import * as Symbol from './Actions/symbol';
import {
    WS,
    ChartBarrierStore,
    cloneObject,
    convertDurationLimit,
    extractInfoFromShortcode,
    findFirstOpenMarket,
    getBarrierPipSize,
    getMinPayout,
    getPlatformSettings,
    getPropertyValue,
    getContractSubtype,
    getTradeNotificationMessage,
    isBarrierSupported,
    isAccumulatorContract,
    isCryptocurrency,
    isEmptyObject,
    isMarketClosed,
    isMultiplierContract,
    isTurbosContract,
    isVanillaFxContract,
    isVanillaContract,
    pickDefaultSymbol,
    resetEndTimeOnVolatilityIndices,
    setLimitOrderBarriers,
    showDigitalOptionsUnavailableError,
    showUnavailableLocationError,
    getCurrencyDisplayCode,
    BARRIER_COLORS,
    BARRIER_LINE_STYLES,
    TRADE_TYPES,
    hasBarrier,
    isHighLow,
    CONTRACT_TYPES,
    setTradeURLParams,
    getTradeURLParams,
    isTouchContract,
    getCardLabelsV2,
    formatMoney,
    getContractPath,
    routes,
    isDtraderV2Enabled,
} from '@deriv/shared';
import { Analytics } from '@deriv-com/analytics';
import type { TEvents } from '@deriv-com/analytics';
import { localize } from '@deriv/translations';
import { getValidationRules, getMultiplierValidationRules } from 'Stores/Modules/Trading/Constants/validation-rules';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';
import { isDigitContractType, isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import ServerTime from '_common/base/server_time';
import { processPurchase } from './Actions/purchase';
import { getUpdatedTicksHistoryStats } from './Helpers/accumulator';
import { processTradeParams } from './Helpers/process';
import { action, computed, makeObservable, observable, override, reaction, runInAction, toJS, when } from 'mobx';
import { createProposalRequests, getProposalErrorField, getProposalInfo } from './Helpers/proposal';
import { getHoveredColor } from './Helpers/barrier-utils';
import BaseStore from '../../base-store';
import { TContractTypesList, TRootStore, TTextValueNumber, TTextValueStrings } from 'Types';
import debounce from 'lodash.debounce';
import {
    ActiveSymbols,
    ActiveSymbolsRequest,
    Buy,
    BuyContractResponse,
    History,
    PriceProposalRequest,
    PriceProposalResponse,
    ServerTimeRequest,
    TickSpotData,
    TicksHistoryRequest,
    TicksHistoryResponse,
    TicksStreamResponse,
    TradingTimesRequest,
} from '@deriv/api-types';
import { STATE_TYPES, TPayload, getChartAnalyticsData } from './Helpers/chart';
import { safeParse } from '@deriv/utils';

type TBarriers = Array<
    ChartBarrierStore & {
        hideOffscreenBarrier?: boolean;
        isSingleBarrier?: boolean;
    }
>;

export type ProposalResponse = PriceProposalResponse & {
    proposal: PriceProposalResponse['proposal'] & {
        payout_choices: string[];
        barrier_spot_distance: string;
        contract_details: {
            barrier: string;
        };
    };
    error?: PriceProposalResponse['error'] & {
        code: string;
        message: string;
        details?: {
            payout_per_point_choices?: number[];
            [k: string]: unknown;
        };
    };
};

export type TChartLayout = {
    adj: boolean;
    aggregationType: string;
    animation?: boolean;
    candleWidth: number;
    chartScale: string;
    chartType: string;
    crosshair: number;
    extended: boolean;
    flipped: boolean;
    interval: number;
    marketSessions: Partial<Record<string, boolean>>;
    outliers: boolean;
    panels: {
        chart: {
            chartName: string;
            display: string;
            index: number;
            percent: number;
            yAxis: {
                name: string;
                position: null;
            };
            yaxisLHS: string[];
            yaxisRHS: string[];
        };
    };
    periodicity: number;
    previousMaxTicks?: number;
    range: Partial<Record<string, unknown>>;
    setSpan: Partial<Record<string, unknown>>;
    studies?: Partial<Record<string, unknown>>;
    symbols: [
        {
            interval: number;
            periodicity: number;
            setSpan: Partial<Record<string, unknown>>;
            symbol: string;
            symbolObject: ActiveSymbols[number];
            timeUnit: string;
        },
    ];
    timeUnit: string;
    volumeUnderlay: boolean;
};
export type TChartStateChangeOption = {
    indicator_type_name?: string;
    indicators_category_name?: string;
    isClosed?: boolean;
    is_favorite?: boolean;
    is_info_open?: boolean;
    is_open?: boolean;
    chart_type_name?: string;
    granularity?: number;
    search_string?: string;
    symbol?: string;
    symbol_category?: string;
    time_interval_name?: string;
};
export type TV2ParamsInitialValues = {
    growth_rate?: number;
    stake?: string | number;
    strike?: string | number;
    multiplier?: number;
    barrier_1?: number;
    payout_per_point?: string;
};
type TContractDataForGTM = Omit<Partial<PriceProposalRequest>, 'cancellation' | 'limit_order'> &
    ReturnType<typeof getProposalInfo> & {
        buy_price: number;
    };
type TPrevChartLayout =
    | (TChartLayout & {
          isDone?: VoidFunction;
          is_used?: boolean;
      })
    | null;

type TDurationMinMax = {
    [key: string]: { min: number; max: number };
};
type TResponse<Req, Res extends { [key: string]: unknown }, K extends string> = Res & {
    echo_req: Req;
    error?: {
        code: string;
        message: string;
        details?: Res[K] & { field: string; payout_per_point_choices?: number[] };
    };
};
type TProposalInfo = {
    [key: string]: ReturnType<typeof getProposalInfo>;
};
type TStakeBoundary = Record<
    string,
    {
        min_stake?: number;
        max_stake?: number;
    }
>;
type TTicksHistoryResponse = TicksHistoryResponse | TicksStreamResponse;
type TBarriersData = Record<string, never> | { barrier: string; barrier_choices?: string[] };
type TValidationParams = ReturnType<typeof getProposalInfo>['validation_params'];

const store_name = 'trade_store';
const g_subscribers_map: Partial<Record<string, ReturnType<typeof WS.subscribeTicksHistory>>> = {}; // blame amin.m
const ANALYTICS_DURATIONS = ['ticks', 'seconds', 'minutes', 'hours', 'days'];

export default class TradeStore extends BaseStore {
    // Control values
    is_trade_component_mounted = false;
    is_purchase_enabled = false;
    is_trade_enabled = false;
    is_trade_enabled_v2 = false;
    is_equal = 0;
    has_equals_only = false;

    // Underlying
    symbol = '';
    is_market_closed = false;
    previous_symbol = '';
    active_symbols: ActiveSymbols = [];
    has_symbols_for_v2 = false;

    form_components: string[] = [];

    // Contract Type
    contract_expiry_type = '';
    contract_start_type = '';
    contract_type = '';
    prev_contract_type = '';
    contract_types_list: TContractTypesList = {};
    non_available_contract_types_list: TContractTypesList = {};
    trade_type_tab = '';
    trade_types: { [key: string]: string } = {};
    contract_types_list_v2: TContractTypesList = {};

    // Amount
    amount = 10;
    basis = '';
    basis_list: Array<TTextValueStrings> = [];
    currency = '';
    stake_boundary: Partial<TStakeBoundary> = {};

    // Duration
    duration = 5;
    duration_min_max: TDurationMinMax = {};
    duration_unit = '';
    duration_units_list: Array<TTextValueStrings> = [];
    expiry_date: string | null = '';
    expiry_epoch: number | string = '';
    expiry_time: string | null = '';
    expiry_type: string | null = 'duration';

    // Barrier
    barrier_1 = '';
    barrier_2 = '';
    barrier_count = 0;
    main_barrier: ChartBarrierStore | null = null;
    barriers: TBarriers = [];
    hovered_barrier = '';
    barrier_choices: string[] = [];
    payout_choices: string[] = [];
    // Start Time
    start_date = 0; // 0 refers to 'now'
    start_dates_list: Array<{ text: string; value: number }> = [];
    start_time: string | null = null;
    sessions: Array<{ open: moment.Moment; close: moment.Moment }> = [];

    market_open_times: string[] = [];
    // End Date Time
    /**
     * An array that contains market closing time.
     *
     * e.g. ["04:00:00", "08:00:00"]
     *
     */
    market_close_times: string[] = [];
    validation_params: {
        [key: string]: TValidationParams | Record<string, never>;
    } = {};

    // Last Digit
    digit_stats: number[] = [];
    last_digit = 5;
    is_mobile_digit_view_selected = false;
    tick_data: TickSpotData | null = null;

    // Purchase
    proposal_info: TProposalInfo = {};
    purchase_info: Partial<BuyContractResponse> = {};

    // Chart loader observables
    is_chart_loading?: boolean;
    should_show_active_symbols_loading = false;

    // Accumulator trade params
    accumulator_range_list: number[] = [];
    growth_rate = 0.03;
    maximum_payout = 0;
    maximum_ticks = 0;
    ticks_history_stats: {
        ticks_stayed_in?: number[];
        last_tick_epoch?: number;
    } = {};
    tick_size_barrier_percentage = '';

    // Multiplier trade params
    multiplier = 0;
    multiplier_range_list: TTextValueNumber[] = [];
    stop_loss?: string;
    take_profit?: string;
    has_stop_loss = false;
    has_take_profit = false;
    has_cancellation = false;
    open_payout_wheelpicker = false;
    commission?: string | number;
    cancellation_price?: number;
    stop_out?: number;
    expiration?: number;
    hovered_contract_type?: string | null;
    cancellation_duration = '60m';
    cancellation_range_list: Array<TTextValueStrings> = [];
    cached_multiplier_cancellation_list: Array<TTextValueStrings> = [];
    ref: React.RefObject<{
        hasPredictionIndicators(): void;
        triggerPopup(arg: () => void): void;
    }> | null = null;
    // Turbos trade params
    long_barriers: TBarriersData = {};
    short_barriers: TBarriersData = {};
    payout_per_point = '';

    // Vanilla trade params
    strike_price_choices: TBarriersData = {};

    // Mobile
    is_trade_params_expanded = true;
    v2_params_initial_values: TV2ParamsInitialValues = {};

    debouncedSetChartStatus = debounce((status: boolean) => {
        runInAction(() => {
            this.is_chart_loading = status;
        });
    }); // no time is needed here, the only goal is to put the call into macrotasks queue
    debouncedProposal = debounce(this.requestProposal, 500);
    proposal_requests: Record<string, Partial<PriceProposalRequest>> = {};
    is_purchasing_contract = false;

    initial_barriers?: { barrier_1: string; barrier_2: string };
    is_initial_barrier_applied = false;
    is_digits_widget_active = false;
    should_skip_prepost_lifecycle = false;
    constructor({ root_store }: { root_store: TRootStore }) {
        const local_storage_properties = [
            'amount',
            'currency',
            'barrier_1',
            'barrier_2',
            'basis',
            'contract_start_type',
            'duration',
            'duration_unit',
            'expiry_date',
            'expiry_type',
            'growth_rate',
            'has_take_profit',
            'has_stop_loss',
            'has_cancellation',
            'hovered_barrier',
            'short_barriers',
            'long_barriers',
            'strike_price_choices',
            'is_equal',
            'last_digit',
            'multiplier',
            'start_date',
            'start_time',
            'stop_loss',
            'take_profit',
            'is_trade_params_expanded',
            'v2_params_initial_values',
        ];
        const session_storage_properties = ['contract_type', 'symbol'];

        super({
            root_store,
            local_storage_properties,
            session_storage_properties,
            store_name,
            validation_rules: getValidationRules(),
        });

        makeObservable(this, {
            accumulator_range_list: observable,
            active_symbols: observable,
            amount: observable,
            barrier_1: observable,
            barrier_2: observable,
            barrier_count: observable,
            barrier_choices: observable,
            payout_choices: observable,
            barriers: observable,
            basis_list: observable,
            basis: observable,
            payout_per_point: observable,
            cancellation_duration: observable,
            cancellation_price: observable,
            cancellation_range_list: observable,
            cached_multiplier_cancellation_list: observable,
            commission: observable,
            contract_expiry_type: observable,
            contract_start_type: observable,
            contract_type: observable,
            contract_types_list: observable,
            contract_types_list_v2: observable,
            currency: observable,
            digit_stats: observable,
            duration_min_max: observable,
            duration_unit: observable,
            duration_units_list: observable,
            duration: observable,
            expiration: observable,
            expiry_date: observable,
            expiry_epoch: observable,
            expiry_time: observable,
            expiry_type: observable,
            form_components: observable,
            growth_rate: observable,
            has_cancellation: observable,
            has_equals_only: observable,
            has_open_accu_contract: computed,
            has_stop_loss: observable,
            has_symbols_for_v2: observable,
            has_take_profit: observable,
            hovered_barrier: observable,
            hovered_contract_type: observable,
            is_accumulator: computed,
            is_chart_loading: observable,
            is_digits_widget_active: observable,
            is_dtrader_v2_enabled: computed,
            is_equal: observable,
            is_market_closed: observable,
            is_mobile_digit_view_selected: observable,
            is_purchase_enabled: observable,
            is_synthetics_trading_market_available: computed,
            is_trade_component_mounted: observable,
            is_trade_enabled: observable,
            is_trade_enabled_v2: observable,
            is_trade_params_expanded: observable,
            is_turbos: computed,
            last_digit: observable,
            long_barriers: observable,
            main_barrier: observable,
            market_close_times: observable,
            market_open_times: observable,
            maximum_payout: observable,
            maximum_ticks: observable,
            validation_params: observable,
            multiplier_range_list: observable,
            multiplier: observable,
            non_available_contract_types_list: observable,
            previous_symbol: observable,
            ref: observable,
            proposal_info: observable.ref,
            purchase_info: observable.ref,
            setHoveredBarrier: action.bound,
            sessions: observable,
            setDefaultGrowthRate: action.bound,
            setDigitStats: action.bound,
            setTickData: action.bound,
            short_barriers: observable,
            should_show_active_symbols_loading: observable,
            should_skip_prepost_lifecycle: observable,
            stake_boundary: observable,
            start_date: observable,
            start_dates_list: observable,
            start_time: observable,
            strike_price_choices: observable,
            stop_loss: observable,
            stop_out: observable,
            symbol: observable,
            take_profit: observable,
            tick_data: observable,
            tick_size_barrier_percentage: observable,
            ticks_history_stats: observable,
            trade_type_tab: observable,
            trade_types: observable,
            open_payout_wheelpicker: observable,
            togglePayoutWheelPicker: action.bound,
            v2_params_initial_values: observable,
            accountSwitcherListener: action.bound,
            barrier_pipsize: computed,
            barriers_flattened: computed,
            changeDurationValidationRules: action.bound,
            chartStateChange: action.bound,
            clearContracts: action.bound,
            clearLimitOrderBarriers: action.bound,
            clearPurchaseInfo: action.bound,
            clientInitListener: action.bound,
            clearV2ParamsInitialValues: action.bound,
            processContractsForV2: action.bound,
            enablePurchase: action.bound,
            exportLayout: action.bound,
            forgetAllProposal: action.bound,
            getFirstOpenMarket: action.bound,
            has_alternative_source: computed,
            initAccountCurrency: action.bound,
            is_multiplier: computed,
            is_symbol_in_active_symbols: computed,
            is_synthetics_available: computed,
            is_vanilla: computed,
            is_vanilla_fx: computed,
            loadActiveSymbols: action.bound,
            logoutListener: action.bound,
            main_barrier_flattened: computed,
            networkStatusChangeListener: action.bound,
            onAllowEqualsChange: action.bound,
            onChange: action.bound,
            onChangeMultiple: action.bound,
            onChartBarrierChange: action.bound,
            onHoverPurchase: action.bound,
            onMount: action.bound,
            onProposalResponse: action.bound,
            onPurchase: action.bound,
            onPurchaseV2: action.bound,
            onUnmount: override,
            prepareTradeStore: action.bound,
            preSwitchAccountListener: action.bound,
            processPurchase: action.bound,
            pushPurchaseDataToGtm: action.bound,
            refresh: action.bound,
            requestProposal: action.bound,
            resetAccumulatorData: action.bound,
            resetErrorServices: action.bound,
            resetPreviousSymbol: action.bound,
            setActiveSymbols: action.bound,
            setActiveSymbolsV2: action.bound,
            setBarrierChoices: action.bound,
            setPayoutChoices: action.bound,
            setChartModeFromURL: action.bound,
            setChartStatus: action.bound,
            setContractTypes: action.bound,
            setContractTypesListV2: action.bound,
            setDefaultSymbol: action.bound,
            setIsTradeParamsExpanded: action.bound,
            setIsDigitsWidgetActive: action.bound,
            setMarketStatus: action.bound,
            getTurbosChartBarrier: action.bound,
            setMobileDigitView: action.bound,
            setPreviousSymbol: action.bound,
            setSkipPrePostLifecycle: action.bound,
            setStakeBoundary: action.bound,
            setTradeTypeTab: action.bound,
            setTradeStatus: action.bound,
            setV2ParamsInitialValues: action.bound,
            show_digits_stats: computed,
            updateStore: action.bound,
            updateSymbol: action.bound,
            setPayoutPerPoint: action.bound,
        });

        when(
            () => !isEmptyObject(this.contract_types_list_v2),
            () => {
                if (!this.contract_types_list_v2 || !this.is_dtrader_v2_enabled) return;
                const searchParams = new URLSearchParams(window.location.search);
                const urlContractType = searchParams.get('trade_type');
                const tradeStoreString = sessionStorage.getItem('trade_store');
                const tradeStoreObj = safeParse(tradeStoreString ?? '{}') ?? {};
                const flattedContractTypesV2 = Object.values(this.contract_types_list_v2)
                    .map(contract_type => contract_type.categories)
                    .flatMap(categories => categories);
                const isValidContractType = flattedContractTypesV2.some(
                    contract_type => contract_type.value === urlContractType
                );
                if (urlContractType) {
                    if (isValidContractType) {
                        tradeStoreObj.contract_type = urlContractType;
                        sessionStorage.setItem('trade_store', JSON.stringify(tradeStoreObj));
                        this.contract_type = urlContractType;
                    } else {
                        this.root_store.ui.toggleUrlUnavailableModal(true);
                    }
                }
            }
        );

        when(
            () => this.has_symbols_for_v2,
            () => {
                if (!this.contract_types_list_v2 || !this.is_dtrader_v2_enabled) return;
                const searchParams = new URLSearchParams(window.location.search);
                const urlSymbol = searchParams.get('symbol');
                const tradeStoreString = sessionStorage.getItem('trade_store');
                const tradeStoreObj = safeParse(tradeStoreString ?? '{}') ?? {};
                const isValidSymbol = this.active_symbols.some(symbol => symbol.symbol === urlSymbol);

                if (urlSymbol) {
                    if (isValidSymbol) {
                        tradeStoreObj.symbol = urlSymbol;
                        sessionStorage.setItem('trade_store', JSON.stringify(tradeStoreObj));
                        this.symbol = urlSymbol;
                    } else {
                        this.root_store.ui.toggleUrlUnavailableModal(true);
                    }
                }
            }
        );

        reaction(
            () => [this.contract_expiry_type, this.duration_min_max, this.duration_unit, this.expiry_type],
            () => {
                this.changeDurationValidationRules();
            }
        );
        reaction(
            () => this.is_equal,
            () => {
                this.onAllowEqualsChange();
            }
        );
        reaction(
            () => this.symbol,
            () => {
                const date = resetEndTimeOnVolatilityIndices(this.symbol, this.expiry_type);
                if (date) {
                    this.expiry_date = date;
                }
                this.setDefaultGrowthRate();
                this.resetAccumulatorData();
                if (this.active_symbols.length) {
                    setTradeURLParams({ symbol: this.symbol });
                }
                this.root_store.notifications.removeTradeNotifications();
            }
        );
        reaction(
            () => this.duration_unit,
            () => {
                this.contract_expiry_type = this.duration_unit === 't' ? 'tick' : 'intraday';
            }
        );
        reaction(
            () => [this.has_stop_loss, this.has_take_profit],
            () => {
                if (!this.has_stop_loss) {
                    this.validation_errors.stop_loss = [];
                }
                if (!this.has_take_profit) {
                    this.validation_errors.take_profit = [];
                }
            }
        );
        reaction(
            () => [this.contract_type],
            () => {
                this.root_store.portfolio.setContractType(this.contract_type);
                if (this.is_accumulator || this.is_multiplier || this.is_turbos) {
                    // when switching back to Multiplier contract, re-apply Stop loss / Take profit validation rules
                    Object.assign(this.validation_rules, getMultiplierValidationRules());
                } else {
                    // we need to remove these two validation rules on contract_type change
                    // to be able to remove any existing Stop loss / Take profit validation errors
                    delete this.validation_rules.stop_loss;
                    delete this.validation_rules.take_profit;
                }
                this.resetAccumulatorData();
                if (!isEmptyObject(this.contract_types_list) || !isEmptyObject(this.contract_types_list_v2)) {
                    setTradeURLParams({ contractType: this.contract_type });
                }
                this.root_store.notifications.removeTradeNotifications();
            }
        );
        reaction(
            () => this.root_store.common.current_language,
            () => {
                this.setValidationRules(getValidationRules());
                this.changeDurationValidationRules();
                if (!this.amount) {
                    this.validateAllProperties();
                }
            }
        );
        reaction(
            () => this.accumulator_range_list.length,
            () => {
                if (this.accumulator_range_list.length) {
                    this.setDefaultGrowthRate();
                }
            }
        );
    }

    get is_symbol_in_active_symbols() {
        return this.active_symbols.some(
            symbol_info => symbol_info.symbol === this.symbol && symbol_info.exchange_is_open === 1
        );
    }

    get has_open_accu_contract() {
        return (
            this.is_accumulator &&
            !!this.root_store.portfolio.open_accu_contract &&
            !!this.root_store.portfolio.active_positions.find(
                ({ contract_info, type }) => isAccumulatorContract(type) && contract_info.underlying === this.symbol
            )
        );
    }

    resetAccumulatorData() {
        if (!isEmptyObject(this.root_store.contract_trade.accumulator_barriers_data)) {
            this.root_store.contract_trade.clearAccumulatorBarriersData();
        }
    }

    setV2ParamsInitialValues({
        value,
        name,
    }: {
        value: number | string | boolean;
        name: keyof TV2ParamsInitialValues;
    }) {
        this.v2_params_initial_values = { ...this.v2_params_initial_values, ...{ [name]: value } };
    }

    clearV2ParamsInitialValues() {
        this.v2_params_initial_values = {};
    }

    setDefaultGrowthRate() {
        if (
            this.is_accumulator &&
            !this.accumulator_range_list.includes(this.growth_rate) &&
            this.accumulator_range_list.length
        ) {
            this.growth_rate = this.accumulator_range_list[0];
        }
    }

    setSkipPrePostLifecycle(should_skip: boolean) {
        if (!!should_skip !== !!this.should_skip_prepost_lifecycle) {
            // to skip assignment if no change is made
            this.should_skip_prepost_lifecycle = should_skip;
        }
    }

    setTradeStatus(status: boolean) {
        this.is_trade_enabled = status;
    }

    refresh() {
        this.forgetAllProposal();
        this.proposal_info = {};
        this.purchase_info = {};
        this.proposal_requests = {};
    }

    clearContracts = () => {
        this.root_store.contract_trade.contracts = [];
    };

    async loadActiveSymbols(should_set_default_symbol = true, should_show_loading = true) {
        if (this.is_dtrader_v2_enabled) {
            await when(() => this.has_symbols_for_v2);
            return;
        }
        this.should_show_active_symbols_loading = should_show_loading;

        await this.setActiveSymbols();
        await this.root_store.active_symbols.setActiveSymbols();

        const { symbol, showModal } = getTradeURLParams({ active_symbols: this.active_symbols });
        if (showModal && should_show_loading && !this.root_store.client.is_logging_in) {
            this.root_store.ui.toggleUrlUnavailableModal(true);
        }
        const hasSymbolChanged = symbol && symbol !== this.symbol;
        if (hasSymbolChanged) this.symbol = symbol;
        if (should_set_default_symbol && !symbol) await this.setDefaultSymbol();
        setTradeURLParams({ symbol: hasSymbolChanged ? symbol : this.symbol });

        const r = await WS.storage.contractsFor(this.symbol);
        if (['InvalidSymbol', 'InputValidationFailed'].includes(r.error?.code)) {
            const symbol_to_update = await pickDefaultSymbol(this.active_symbols);
            await this.processNewValuesAsync({ symbol: symbol_to_update });
        }

        runInAction(() => {
            this.should_show_active_symbols_loading = false;
        });
    }

    async setDefaultSymbol() {
        if (!this.is_symbol_in_active_symbols) {
            this.is_trade_enabled = false;

            const symbol = await pickDefaultSymbol(this.active_symbols);
            await this.processNewValuesAsync({ symbol });
        }
    }

    async setActiveSymbols() {
        const is_on_mf_account = this.root_store.client.landing_company_shortcode === 'maltainvest';
        const is_logged_in = this.root_store.client.is_logged_in;
        const showError = this.root_store.common.showError;

        const { active_symbols, error } = await WS.authorized.activeSymbols();

        if (error) {
            showError({ message: localize('Trading is unavailable at this time.') });
            return;
        }

        if (!active_symbols?.length) {
            await WS.wait('get_settings');
            /*
             * This logic is related to EU country checks
             * Avoid moving this upward in the scope since mobx will lose reactivity
             */
            if (is_on_mf_account) {
                showDigitalOptionsUnavailableError(showError, {
                    text: localize(
                        'We’re working to have this available for you soon. If you have another account, switch to that account to continue trading. You may add a Deriv MT5 Financial.'
                    ),
                    title: localize('{{platform_name_trader}} is not available for this account', {
                        platform_name_trader: getPlatformSettings('trader').name,
                    }),
                    link: localize('Go to {{platform_name_mt5}} dashboard', {
                        platform_name_mt5: getPlatformSettings('mt5').name,
                    }),
                });
                return;
            } else if (!is_on_mf_account) {
                showUnavailableLocationError(showError, is_logged_in);
            }
            showUnavailableLocationError(showError, is_logged_in);
        }
        await this.processNewValuesAsync({ active_symbols });
    }

    async processContractsForV2() {
        const contract_categories = ContractType.getContractCategories();
        this.processNewValuesAsync({
            ...(contract_categories as Pick<TradeStore, 'contract_types_list'> & {
                has_only_forward_starting_contracts: boolean;
            }),
        });
        this.processNewValuesAsync(ContractType.getContractValues(this));
    }

    async setContractTypes() {
        if (this.is_dtrader_v2_enabled) {
            return;
        }

        let contractType: string | undefined = '';
        if (this.symbol && this.is_symbol_in_active_symbols) {
            await Symbol.onChangeSymbolAsync(this.symbol);
            runInAction(() => {
                const contract_categories = ContractType.getContractCategories();
                const { contractType: contractTypeParam, showModal } = getTradeURLParams({
                    contract_types_list: contract_categories.contract_types_list,
                });
                contractType = contractTypeParam;
                const { is_logging_in, is_switching } = this.root_store.client;
                if (showModal && !is_logging_in && !is_switching) this.root_store.ui.toggleUrlUnavailableModal(true);
                this.processNewValuesAsync({
                    ...(contract_categories as Pick<TradeStore, 'contract_types_list'> & {
                        has_only_forward_starting_contracts: boolean;
                    }),
                    ...ContractType.getContractType(
                        contract_categories.contract_types_list,
                        contractType ?? this.contract_type
                    ),
                });
                this.processNewValuesAsync(ContractType.getContractValues(this));
            });
        }
        this.root_store.common.setSelectedContractType(contractType ?? this.contract_type);
        this.root_store.portfolio.setContractType(contractType ?? this.contract_type);
        setTradeURLParams({
            contractType: contractType ?? this.contract_type,
        });
    }

    async prepareTradeStore(should_set_default_symbol = true) {
        this.initial_barriers = { barrier_1: this.barrier_1, barrier_2: this.barrier_2 };
        await when(() => !this.root_store.client.is_populating_account_list);

        // waits for `website_status` in order to set `stake_default` for the selected currency
        await WS.wait('website_status');
        await runInAction(async () => {
            await this.processNewValuesAsync(
                {
                    // fallback to default currency if current logged-in client hasn't selected a currency yet
                    currency: this.root_store.client.currency || this.root_store.client.default_currency,
                },
                true,
                null,
                false
            );
        });
        await this.loadActiveSymbols(should_set_default_symbol);
        await this.setContractTypes();
        await this.processNewValuesAsync(
            {
                is_market_closed: isMarketClosed(this.active_symbols, this.symbol),
            },
            true,
            null,
            false
        );
    }

    async onChangeMultiple(values: Partial<TradeStore>) {
        Object.keys(values).forEach(name => {
            if (!(name in this)) {
                throw new Error(`Invalid Argument: ${name}`);
            }
        });

        await this.processNewValuesAsync({ ...values }, true); // wait for store to be updated
        this.validateAllProperties(); // then run validation before sending proposal
    }

    async onChange(e: { target: { name: string; value: unknown } }) {
        const { name, value } = e.target;
        if (
            name == 'contract_type' &&
            ['accumulator', 'match_diff', 'even_odd', 'over_under'].includes(value as string)
        ) {
            this.prev_contract_type = this.contract_type;
        }

        if (name === 'symbol' && value) {
            // set trade params skeleton and chart loader to true until processNewValuesAsync resolves
            this.setChartStatus(true);
            // reset market close status
            this.setMarketStatus(false);
            this.is_trade_enabled = false;
            // this.root_store.modules.contract_trade.contracts = [];
            // TODO: Clear the contracts in contract-trade-store
        } else if (name === 'currency') {
            // Only allow the currency dropdown change if client is not logged in
            if (!this.root_store.client.is_logged_in) {
                this.root_store.client.selectCurrency(value as string);
            }
        } else if (name === 'expiry_date') {
            this.expiry_time = null;
        } else if (!(name in this)) {
            throw new Error(`Invalid Argument: ${name}`);
        }

        await this.processNewValuesAsync(
            { [name]: value },
            true,
            name === 'contract_type' ? { contract_type: this.contract_type } : {}, // refer to [Multiplier validation rules] below
            true
        ); // wait for store to be updated
        this.validateAllProperties(); // then run validation before sending proposal
        this.root_store.common.setSelectedContractType(this.contract_type);
    }

    setHoveredBarrier(hovered_value: string) {
        this.hovered_barrier = hovered_value;
    }

    setPreviousSymbol(symbol: string) {
        if (this.previous_symbol !== symbol) this.previous_symbol = symbol;
    }

    setIsTradeParamsExpanded(value: boolean) {
        this.is_trade_params_expanded = value;
    }

    async resetPreviousSymbol() {
        this.setMarketStatus(isMarketClosed(this.active_symbols, this.previous_symbol));

        await Symbol.onChangeSymbolAsync(this.previous_symbol);
        this.updateSymbol(this.symbol);

        this.setChartStatus(false);
        runInAction(() => {
            this.previous_symbol = ''; // reset the symbol to default
        });
    }

    onHoverPurchase(is_over: boolean, contract_type?: string) {
        if (this.is_accumulator) return;
        if (this.is_purchase_enabled && this.main_barrier && !this.is_multiplier) {
            this.main_barrier.updateBarrierShade(is_over, contract_type ?? '');
        } else if (!is_over && this.main_barrier && !this.is_multiplier) {
            this.main_barrier.updateBarrierShade(false, contract_type ?? '');
        }

        this.hovered_contract_type = is_over ? contract_type : null;
        setLimitOrderBarriers({
            barriers: this.root_store.portfolio.barriers,
            is_over,
            contract_type,
            contract_info: this.proposal_info[contract_type ?? ''],
        });
    }

    clearLimitOrderBarriers() {
        this.hovered_contract_type = null;
        const { barriers } = this;
        setLimitOrderBarriers({
            barriers,
            is_over: false,
        });
    }

    get barrier_pipsize() {
        return getBarrierPipSize(this.barrier_1);
    }

    get main_barrier_flattened() {
        const is_digit_trade_type = isDigitTradeType(this.contract_type);
        return is_digit_trade_type ? null : toJS(this.main_barrier);
    }

    get barriers_flattened() {
        return this.root_store.portfolio.barriers && toJS(this.root_store.portfolio.barriers);
    }

    setMainBarrier = (proposal_info: PriceProposalRequest) => {
        if (!proposal_info) {
            return;
        }
        const { contract_type, barrier, barrier2 } = proposal_info;
        if (isBarrierSupported(contract_type)) {
            // create barrier only when it's available in response
            this.main_barrier = new ChartBarrierStore(
                this.hovered_barrier || barrier,
                barrier2,
                this.onChartBarrierChange,
                {
                    color: this.hovered_barrier ? getHoveredColor(contract_type) : BARRIER_COLORS.BLUE,
                    line_style: this.hovered_barrier && BARRIER_LINE_STYLES.DASHED,
                    not_draggable: this.is_turbos || this.is_vanilla,
                }
            );
        } else {
            this.main_barrier = null;
        }
    };

    async onPurchaseV2(
        trade_type: string,
        isMobile: boolean,
        callback?: (params: { message: string; redirectTo: string; title: string }) => void
    ) {
        await when(() => {
            const proposal_info_keys = Object.keys(this.proposal_info);
            const proposal_request_keys = Object.keys(this.proposal_requests);
            return proposal_info_keys.length > 0 && proposal_info_keys.length === proposal_request_keys.length;
        });

        const info = this.proposal_info?.[trade_type];
        if (info) this.onPurchase(info.id, info.stake, trade_type, isMobile, callback);
    }

    onPurchase = debounce(this.processPurchase, 300);

    processPurchase(
        proposal_id: string,
        price: string | number,
        type: string,
        isMobile: boolean,
        callback?: (params: { message: string; redirectTo: string; title: string }) => void
    ) {
        if (!this.is_purchase_enabled) return;
        if (proposal_id) {
            runInAction(() => {
                this.is_purchase_enabled = false;
                this.is_purchasing_contract = true;
            });
            const is_tick_contract = this.duration_unit === 't';
            processPurchase(proposal_id, price).then(
                action((response: TResponse<Buy, BuyContractResponse, 'buy'>) => {
                    if (!this.is_trade_component_mounted) {
                        this.enablePurchase();
                        this.is_purchasing_contract = false;
                        return;
                    }

                    const last_digit = +this.last_digit;
                    if (response.error) {
                        // using javascript to disable purchase-buttons manually to compensate for mobx lag
                        this.disablePurchaseButtons();
                        // invalidToken error will handle in socket-general.js
                        if (response.error.code !== 'InvalidToken') {
                            this.root_store.common.setServicesError(
                                {
                                    type: response.msg_type,
                                    ...response.error,
                                },
                                this.is_dtrader_v2_enabled
                            );

                            // Clear purchase info on mobile after toast box error disappears (mobile_toast_timeout = 3500)
                            if (isMobile && this.root_store.common?.services_error?.type === 'buy') {
                                setTimeout(() => {
                                    this.clearPurchaseInfo();
                                    this.requestProposal();
                                }, 3500);
                            }
                        }
                    } else if (response.buy) {
                        if (this.proposal_info[type] && this.proposal_info[type].id !== proposal_id) {
                            throw new Error('Proposal ID does not match.');
                        }
                        const contract_data: TContractDataForGTM = {
                            ...this.proposal_requests[type],
                            ...this.proposal_info[type],
                            buy_price: response.buy.buy_price,
                        };
                        const { contract_id, longcode, start_time } = response.buy;

                        // toggle smartcharts to contract mode
                        if (contract_id) {
                            const shortcode = response.buy.shortcode;
                            const { category, underlying } = extractInfoFromShortcode(shortcode);
                            const is_digit_contract = isDigitContractType(category?.toUpperCase() ?? '');
                            const is_multiplier = isMultiplierContract(category);
                            const contract_type = category?.toUpperCase();
                            const is_call = category.toUpperCase() === CONTRACT_TYPES.CALL;
                            const is_put = category.toUpperCase() === CONTRACT_TYPES.PUT;
                            const is_high_low = isHighLow({ shortcode_info: extractInfoFromShortcode(shortcode) });
                            let higher_lower_contact = CONTRACT_TYPES.LOWER.toLowerCase();
                            let rise_fall_contract = CONTRACT_TYPES.FALL.toLowerCase();
                            if (is_call) {
                                higher_lower_contact = CONTRACT_TYPES.HIGHER.toLowerCase();
                                rise_fall_contract = CONTRACT_TYPES.RISE.toLowerCase();
                            }
                            const call_put_contract = is_high_low ? higher_lower_contact : rise_fall_contract;

                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            if ((window as any).hj) {
                                const event_string = `placed_${is_call || is_put ? call_put_contract : category}_trade`;
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (window as any).hj('event', event_string);
                            }

                            this.root_store.contract_trade.addContract({
                                contract_id,
                                start_time,
                                longcode,
                                underlying,
                                barrier: is_digit_contract ? last_digit : null,
                                contract_type,
                                is_tick_contract,
                            });
                            this.root_store.portfolio.onBuyResponse({
                                contract_id,
                                longcode,
                                contract_type,
                            });
                            // NOTE: changing chart granularity and chart_type has to be done in a different render cycle
                            // so we have to set chart granularity to zero, and change the chart_type to 'mountain' first,
                            // and then set the chart view to the start_time
                            // draw the start time line and show longcode then mount contract
                            // this.root_store.modules.contract_trade.drawContractStartTime(start_time, longcode, contract_id);
                            if (!isMobile) {
                                this.root_store.ui.openPositionsDrawer();
                            }
                            this.proposal_info = {};
                            this.forgetAllProposal();
                            this.purchase_info = response;
                            this.proposal_requests = {};
                            this.debouncedProposal();
                            this.clearLimitOrderBarriers();
                            this.pushPurchaseDataToGtm(contract_data);
                            if (this.root_store.ui.is_mobile) {
                                const shortcode = response.buy.shortcode;
                                const extracted_info_from_shortcode = extractInfoFromShortcode(shortcode);
                                const contract_id = response.buy.contract_id;
                                const currency = getCurrencyDisplayCode(this.root_store.client.currency);
                                const formatted_stake = `${getCardLabelsV2().STAKE}: ${formatMoney(
                                    currency,
                                    response.buy.buy_price,
                                    true,
                                    0,
                                    0
                                )} ${currency}`;
                                const trade_type = extracted_info_from_shortcode.category;

                                if (window.location.pathname === routes.trade)
                                    callback?.({
                                        message: getTradeNotificationMessage(shortcode),
                                        redirectTo: getContractPath(contract_id),
                                        title: formatted_stake,
                                    });

                                this.root_store.notifications.addTradeNotification({
                                    buy_price: is_multiplier ? this.amount : response.buy.buy_price,
                                    contract_id,
                                    contract_type: trade_type,
                                    currency,
                                    purchase_time: response.buy.purchase_time,
                                    shortcode,
                                    status: 'open',
                                });
                            }

                            this.is_purchasing_contract = false;
                            return;
                        }
                    }
                    this.forgetAllProposal();
                    this.purchase_info = response;
                    this.enablePurchase();
                    this.is_purchasing_contract = false;
                })
            );
        }
    }

    enablePurchase() {
        if (!this.root_store.client.is_unwelcome) {
            this.is_purchase_enabled = true;
        }
    }

    disablePurchaseButtons = () => {
        const el_purchase_value = document.getElementsByClassName('trade-container__price-info');
        const el_purchase_buttons = document.getElementsByClassName('btn-purchase');
        [].forEach.bind(el_purchase_buttons, el => {
            (el as HTMLButtonElement).classList.add('btn-purchase--disabled');
        })();
        [].forEach.bind(el_purchase_value, el => {
            (el as HTMLDivElement).classList.add('trade-container__price-info--fade');
        })();
    };

    /**
     * Updates the store with new values
     * @param  {Object} new_state - new values to update the store with
     * @return {Object} returns the object having only those values that are updated
     */
    updateStore(new_state: Partial<TradeStore>) {
        Object.keys(cloneObject(new_state) || {}).forEach(key => {
            if (key === 'root_store' || ['validation_rules', 'validation_errors', 'currency'].indexOf(key) > -1) return;
            if (JSON.stringify(this[key as keyof this]) === JSON.stringify(new_state[key as keyof TradeStore])) {
                delete new_state[key as keyof TradeStore];
            } else {
                if (key === 'symbol') {
                    this.is_purchase_enabled = false;
                    this.is_trade_enabled = false;
                }

                if (new_state.start_date && typeof new_state.start_date === 'string') {
                    new_state.start_date = parseInt(new_state.start_date);
                }

                this[key as 'currency'] = new_state[key as keyof TradeStore] as TradeStore['currency'];

                // validation is done in mobx intercept (base_store.js)
                // when barrier_1 is set, it is compared with store.barrier_2 (which is not updated yet)
                if (key === 'barrier_2' && new_state.barrier_1) {
                    this.barrier_1 = new_state.barrier_1; // set it again, after barrier_2 is updated in store
                }
            }
        });
        return new_state;
    }

    async processNewValuesAsync(
        obj_new_values: Partial<TradeStore> = {},
        is_changed_by_user = false,
        obj_old_values: Partial<TradeStore> | null = {},
        should_forget_first = true
    ) {
        // To switch to rise_fall_equal contract type when allow equal is checked on first page refresh or
        // when switch back to Rise/Fall from another contract type i.e.
        if (obj_new_values.contract_type && obj_new_values.contract_type === TRADE_TYPES.RISE_FALL && !!this.is_equal) {
            obj_new_values.contract_type = TRADE_TYPES.RISE_FALL_EQUAL;
        }
        // when accumulator is selected, we need to change chart type to mountain and granularity to 0
        // and we need to restore previous chart type and granularity when accumulator is unselected
        const {
            prev_chart_type,
            prev_granularity,
            chart_type,
            granularity,
            savePreviousChartMode,
            updateChartType,
            updateGranularity,
        } = this.root_store.contract_trade || {};
        if (isAccumulatorContract(obj_new_values.contract_type) || isDigitTradeType(obj_new_values.contract_type)) {
            savePreviousChartMode(chart_type, granularity);
            updateGranularity(0);
            updateChartType('line');
        } else if (
            (obj_new_values.contract_type || obj_new_values.symbol) &&
            prev_chart_type &&
            prev_granularity &&
            (prev_chart_type !== chart_type || prev_granularity !== granularity)
        ) {
            updateGranularity(prev_granularity);
            updateChartType(prev_chart_type);
            savePreviousChartMode('', null);
        }
        if (/\bduration\b/.test(Object.keys(obj_new_values) as unknown as string)) {
            // TODO: fix this in input-field.jsx
            if (typeof obj_new_values.duration === 'string') {
                obj_new_values.duration = +obj_new_values.duration;
            }
        }
        // Sets the default value to Amount when Currency has changed from Fiat to Crypto and vice versa.
        // The source of default values is the website_status response.
        if (should_forget_first) {
            this.forgetAllProposal();
            this.proposal_requests = {};
        }
        if (is_changed_by_user && /\bcurrency\b/.test(Object.keys(obj_new_values) as unknown as string)) {
            const prev_currency = obj_old_values?.currency || this.currency;
            const has_currency_changed = obj_new_values.currency !== prev_currency;

            const should_reset_stake =
                isCryptocurrency(obj_new_values.currency ?? '') ||
                // For switch between fiat and crypto and vice versa
                isCryptocurrency(obj_new_values.currency ?? '') !== isCryptocurrency(prev_currency);

            if (has_currency_changed && should_reset_stake) {
                obj_new_values.amount = obj_new_values.amount || getMinPayout(obj_new_values.currency ?? '');
            }
            this.currency = obj_new_values.currency ?? '';
        }

        let has_only_forward_starting_contracts;

        if (Object.keys(obj_new_values).includes('symbol')) {
            this.setPreviousSymbol(this.symbol);
            await Symbol.onChangeSymbolAsync(obj_new_values.symbol ?? '');
            this.setMarketStatus(isMarketClosed(this.active_symbols, obj_new_values.symbol ?? ''));
            has_only_forward_starting_contracts =
                ContractType.getContractCategories().has_only_forward_starting_contracts;
        }
        // TODO: remove all traces of setHasOnlyForwardingContracts and has_only_forward_starting_contracts in app
        //  once future contracts are implemented
        this.root_store.ui.setHasOnlyForwardingContracts(has_only_forward_starting_contracts);
        if (has_only_forward_starting_contracts) return;

        const new_state = this.updateStore(cloneObject(obj_new_values));

        if (
            is_changed_by_user ||
            /\b(symbol|contract_types_list)\b/.test(Object.keys(new_state) as unknown as string)
        ) {
            this.updateStore({
                // disable purchase button(s), clear contract info
                is_purchase_enabled: false,
                proposal_info: {},
            });

            // To prevent infinite loop when changing from advanced end_time to digit type contract
            if (obj_new_values.contract_type && this.root_store.ui.is_advanced_duration) {
                if (isDigitTradeType(obj_new_values.contract_type)) {
                    this.barrier_1 = '';
                    this.barrier_2 = '';
                    this.expiry_type = 'duration';
                    this.root_store.ui.is_advanced_duration = false;
                }
            }

            // TODO: handle barrier updates on proposal api
            // const is_barrier_changed = 'barrier_1' in new_state || 'barrier_2' in new_state;
            await processTradeParams(this, new_state);

            this.updateStore({
                ...(!this.is_initial_barrier_applied ? this.initial_barriers : {}),
            });
            this.is_initial_barrier_applied = true;
            if (/\b(contract_type|currency)\b/.test(Object.keys(new_state) as unknown as string)) {
                this.validateAllProperties();
            }
            this.debouncedProposal();
        }
    }

    get is_dtrader_v2_enabled() {
        return isDtraderV2Enabled(this.root_store.ui.is_mobile);
    }

    get is_synthetics_available() {
        return !!this.active_symbols?.find(item => item.market === 'synthetic_index');
    }

    get is_synthetics_trading_market_available() {
        return !!this.active_symbols?.find(
            item => item.subgroup === 'synthetics' && !isMarketClosed(this.active_symbols, item.symbol)
        );
    }

    get show_digits_stats() {
        return isDigitTradeType(this.contract_type);
    }

    setDigitStats(digit_stats: number[]) {
        this.digit_stats = digit_stats;
    }

    setTickData(tick: TickSpotData | null) {
        this.tick_data = tick;
    }

    setMobileDigitView(bool: boolean) {
        this.is_mobile_digit_view_selected = bool;
    }

    pushPurchaseDataToGtm(contract_data: TContractDataForGTM) {
        const data = {
            event: 'buy_contract',
            bom_ui: 'new',
            contract: {
                amount: contract_data.amount,
                barrier1: contract_data.barrier,
                barrier2: contract_data.barrier2,
                basis: contract_data.basis,
                buy_price: contract_data.buy_price,
                contract_type: contract_data.contract_type,
                currency: contract_data.currency,
                date_expiry: contract_data.date_expiry,
                date_start: contract_data.date_start,
                duration: contract_data.duration,
                duration_unit: contract_data.duration_unit,
                payout: contract_data.payout,
                symbol: contract_data.symbol,
            },
            settings: {
                theme: this.root_store.ui.is_dark_mode_on ? 'dark' : 'light',
                positions_drawer: this.root_store.ui.is_positions_drawer_on ? 'open' : 'closed',
                chart: {
                    toolbar_position: this.root_store.ui.is_chart_layout_default ? 'bottom' : 'left',
                    chart_asset_info: this.root_store.ui.is_chart_asset_info_visible ? 'visible' : 'hidden',
                    chart_type: this.root_store.contract_trade.chart_type,
                    granularity: this.root_store.contract_trade.granularity,
                },
            },
        };
        this.root_store.gtm.pushDataLayer(data);
    }

    clearPurchaseInfo() {
        this.purchase_info = {};
        this.proposal_requests = {};
        this.proposal_info = {};
    }

    requestProposal() {
        const requests = createProposalRequests(this);
        if (Object.values(this.validation_errors).some(e => e.length)) {
            runInAction(() => {
                this.proposal_info = {};
                this.purchase_info = {};
            });
            this.forgetAllProposal();
            if (this.is_accumulator) this.resetAccumulatorData();
            return;
        }

        if (!isEmptyObject(requests)) {
            runInAction(() => {
                this.proposal_requests = requests as Record<string, Partial<PriceProposalRequest>>;
                this.purchase_info = {};
            });
            Object.keys(this.proposal_requests).forEach(type => {
                WS.subscribeProposal(this.proposal_requests[type], this.onProposalResponse);
            });
        }
        this.root_store.ui.resetPurchaseStates();
    }

    forgetAllProposal() {
        const length = Object.keys(this.proposal_requests).length;
        if (length > 0) WS.forgetAll('proposal');
    }

    setMarketStatus(status: boolean) {
        this.is_market_closed = status;
    }

    // eslint-disable-next-line class-methods-use-this
    getTurbosChartBarrier(response: ProposalResponse) {
        return (Number(response.proposal?.contract_details?.barrier) - Number(response.proposal?.spot)).toFixed(
            getBarrierPipSize(response.proposal?.contract_details?.barrier)
        );
    }

    onProposalResponse(response: TResponse<PriceProposalRequest, ProposalResponse, 'proposal'>) {
        const { contract_type } = response.echo_req;
        const prev_proposal_info = getPropertyValue(this.proposal_info, contract_type) || {};
        const obj_prev_contract_basis = getPropertyValue(prev_proposal_info, 'obj_contract_basis') || {};

        // add/update expiration or date_expiry for crypto indices from proposal
        const date_expiry = response.proposal?.date_expiry;
        this.expiry_epoch = date_expiry || this.expiry_epoch;

        if (!response.error && !!date_expiry && this.is_crypto_multiplier) {
            this.expiration = date_expiry;
        }

        this.proposal_info = {
            ...this.proposal_info,
            [contract_type]: getProposalInfo(this, response, obj_prev_contract_basis),
        };
        this.validation_params[contract_type] = this.proposal_info[contract_type].validation_params;

        if (this.is_multiplier && this.proposal_info && this.proposal_info.MULTUP) {
            const { commission, cancellation, limit_order } = this.proposal_info.MULTUP;
            // commission and cancellation.ask_price is the same for MULTUP/MULTDOWN
            if (commission) {
                this.commission = commission;
            }
            if (cancellation) {
                this.cancellation_price = cancellation.ask_price;
            }
            this.stop_out = limit_order?.stop_out?.order_amount;
        }

        if (this.is_accumulator && this.proposal_info?.ACCU) {
            const {
                barrier_spot_distance,
                maximum_ticks = 0,
                ticks_stayed_in,
                tick_size_barrier_percentage = '',
                last_tick_epoch,
                maximum_payout = 0,
                high_barrier,
                low_barrier,
                spot_time,
            } = this.proposal_info.ACCU;
            this.ticks_history_stats = getUpdatedTicksHistoryStats({
                previous_ticks_history_stats: this.ticks_history_stats,
                new_ticks_history_stats: ticks_stayed_in,
                last_tick_epoch,
            });
            this.maximum_ticks = maximum_ticks;
            this.maximum_payout = maximum_payout;
            this.tick_size_barrier_percentage = tick_size_barrier_percentage;
            const { updateAccumulatorBarriersData } = this.root_store.contract_trade || {};
            if (updateAccumulatorBarriersData) {
                updateAccumulatorBarriersData({
                    accumulators_high_barrier: high_barrier,
                    accumulators_low_barrier: low_barrier,
                    barrier_spot_distance,
                    current_spot_time: spot_time,
                    underlying: this.symbol,
                });
            }
        }

        if (!this.main_barrier || this.main_barrier?.shade) {
            if (this.is_turbos) {
                if (response.proposal) {
                    const chart_barrier = response.proposal.barrier_spot_distance;
                    this.setMainBarrier({
                        ...response.echo_req,
                        barrier: String(chart_barrier),
                    });
                }
            } else {
                this.setMainBarrier(response.echo_req);
            }
        }

        if (this.hovered_contract_type === contract_type) {
            setLimitOrderBarriers({
                barriers: this.root_store.portfolio.barriers,
                contract_info: this.proposal_info[this.hovered_contract_type ?? ''],
                contract_type,
                is_over: true,
            });
        }

        if (response.error) {
            const error_id = getProposalErrorField(response);
            if (error_id) {
                this.setValidationErrorMessages(error_id, [response.error.message]);
            }
            // Commission for multipliers is normally set from proposal response.
            // But when we change the multiplier and if it is invalid, we don't get the proposal response to set the commission. We only get error message.
            // This is a work around to set the commission from error message.
            if (this.is_multiplier) {
                const { message, details } = response.error;
                const commission_match = (message || '').match(/\((\d+\.*\d*)\)/);
                if (details?.field === 'stop_loss' && commission_match?.[1]) {
                    this.commission = commission_match[1];
                }
            }
            if (this.is_accumulator) this.resetAccumulatorData();

            // Sometimes when we navigate fast, `forget_all` proposal is called immediately after proposal subscription calls.
            // But, in the BE, `forget_all` proposal call is processed before the proposal subscriptions are registered. In this case, `forget_all` proposal doesn't forget the new subscriptions.
            // So when we send new proposal subscription requests, we get `AlreadySubscribed` error.
            // If we get an error message with code `AlreadySubscribed`, `forget_all` proposal will be called and all the existing subscriptions will be marked as complete in `deriv-api` and will subscribe to new proposals
            if (response.error.code === 'AlreadySubscribed') {
                this.refresh();

                if (this.is_trade_component_mounted) {
                    this.debouncedProposal();
                }
                return;
            }

            // Sometimes the initial barrier doesn't match with current barrier choices received from API.
            // When this happens we want to populate the list of barrier choices to choose from since the value cannot be specified manually
            if (this.is_vanilla && response.error.details?.barrier_choices) {
                const { barrier_choices, max_stake, min_stake } = response.error.details;

                this.setStakeBoundary(contract_type, min_stake, max_stake);
                this.setBarrierChoices(barrier_choices as string[]);
                if (!this.barrier_choices.includes(this.barrier_1)) {
                    // Since on change of duration `proposal` API call is made which returns a new set of barrier values.
                    // The new list is set and the mid value is assigned
                    const index = Math.floor(this.barrier_choices.length / 2);
                    this.barrier_1 = this.barrier_choices[index];
                    this.onChange({
                        target: {
                            name: 'barrier_1',
                            value: this.barrier_1,
                        },
                    });
                }
            }
            if (this.is_turbos && response.error.details?.payout_per_point_choices) {
                const { payout_per_point_choices, min_stake, max_stake } = response.error.details;
                const payoutIndex = Math.floor(payout_per_point_choices.length / 2);
                this.setPayoutChoices(payout_per_point_choices.map(item => String(item)));
                this.setStakeBoundary(contract_type, min_stake, max_stake);
                this.onChange({
                    target: {
                        name: 'payout_per_point',
                        value: String(payout_per_point_choices[payoutIndex]),
                    },
                });
                this.barrier_1 = String(this.getTurbosChartBarrier(response));
            }
        } else {
            this.validateAllProperties();
            if (this.is_vanilla) {
                const { max_stake, min_stake, barrier_choices } = response.proposal ?? {};
                this.setBarrierChoices(barrier_choices as string[]);
                this.setStakeBoundary(contract_type, min_stake, max_stake);
            } else if (this.is_turbos) {
                const { max_stake, min_stake, payout_choices } = response.proposal ?? {};
                if (payout_choices) {
                    if (this.payout_per_point == '') {
                        this.onChange({
                            target: {
                                name: 'payout_per_point',
                                value: String(Math.floor(payout_choices.length / 2)),
                            },
                        });
                    }
                    this.setPayoutChoices(payout_choices as string[]);
                    this.setStakeBoundary(contract_type, min_stake, max_stake);
                    this.barrier_1 = response.proposal.barrier_spot_distance;
                }
            }
        }

        if (!this.is_purchasing_contract) {
            this.enablePurchase();
        }
    }

    onChartBarrierChange(barrier_1: string, barrier_2?: string) {
        this.processNewValuesAsync({ barrier_1, barrier_2 }, true);
    }

    onAllowEqualsChange() {
        this.processNewValuesAsync(
            { contract_type: this.is_equal ? TRADE_TYPES.RISE_FALL_EQUAL : TRADE_TYPES.RISE_FALL },
            true
        );
    }

    updateSymbol(underlying: string) {
        if (!underlying) return;
        this.onChange({
            target: {
                name: 'symbol',
                value: underlying,
            },
        });
    }

    changeDurationValidationRules() {
        if (this.expiry_type === 'endtime') {
            this.validation_errors.duration = [];
            return;
        }

        if (!this.validation_rules.duration) return;

        const index = this.validation_rules.duration.rules?.findIndex(item => item[0] === 'number');
        const limits = this.duration_min_max[this.contract_expiry_type] || false;

        if (limits) {
            const duration_options = {
                min: convertDurationLimit(+limits.min, this.duration_unit),
                max: convertDurationLimit(+limits.max, this.duration_unit),
            };

            if (Number(index) > -1 && this.validation_rules.duration.rules) {
                this.validation_rules.duration.rules[Number(index)][1] = duration_options;
            } else {
                this.validation_rules.duration.rules?.push(['number', duration_options]);
            }
            this.validateProperty('duration', this.duration);
        }
    }

    async accountSwitcherListener() {
        if (this.root_store.common.is_language_changing) {
            await this.loadActiveSymbols(false, false);
            this.root_store.common.is_language_changing = false;
        } else {
            await this.loadActiveSymbols(true, false);
        }

        this.resetErrorServices();
        await this.setContractTypes();
        runInAction(async () => {
            this.processNewValuesAsync(
                { currency: this.root_store.client.currency || this.root_store.client.default_currency },
                true,
                { currency: this.currency },
                false
            );
        });
        return Promise.resolve();
    }

    preSwitchAccountListener() {
        this.clearContracts();
        this.is_trade_enabled = false;
        this.is_trade_enabled_v2 = false;
        return Promise.resolve();
    }

    async logoutListener() {
        this.clearContracts();
        this.refresh();
        this.resetErrorServices();
        if (this.root_store.common.is_language_changing) {
            await this.loadActiveSymbols(false);
            this.root_store.common.is_language_changing = false;
        } else {
            await this.loadActiveSymbols();
        }
        await this.setContractTypes();
        this.is_trade_enabled = true;
        this.is_trade_enabled_v2 = true;
        this.debouncedProposal();
    }

    clientInitListener() {
        this.initAccountCurrency(this.root_store.client.currency || this.root_store.client.default_currency);
        return Promise.resolve();
    }

    networkStatusChangeListener(is_online: boolean) {
        this.setTradeStatus(is_online);
        this.is_trade_enabled_v2 = is_online;
    }

    resetErrorServices() {
        this.root_store.ui.toggleServicesErrorModal(false);
    }

    onMount() {
        this.root_store.notifications.removeTradeNotifications();
        if (this.is_trade_component_mounted && this.should_skip_prepost_lifecycle) {
            const { chart_type, granularity } = this.root_store.contract_trade;
            setTradeURLParams({
                chartType: chart_type,
                granularity,
                symbol: this.symbol,
                contractType: this.contract_type,
            });
            return;
        }
        this.root_store.notifications.setShouldShowPopups(false);
        this.onPreSwitchAccount(this.preSwitchAccountListener);
        this.onSwitchAccount(this.accountSwitcherListener);
        this.resetAccumulatorData();
        this.onLogout(this.logoutListener);
        this.onClientInit(this.clientInitListener);
        this.onNetworkStatusChange(this.networkStatusChangeListener);
        this.setChartModeFromURL();
        this.setChartStatus(true);
        runInAction(async () => {
            this.is_trade_component_mounted = true;
            await this.prepareTradeStore();
            this.root_store.notifications.setShouldShowPopups(true);
        });
    }

    setChartModeFromURL() {
        const { chartType: chartTypeParam, granularity: granularityParam } = getTradeURLParams();
        const { chart_type, granularity, updateChartType, updateGranularity } = this.root_store.contract_trade;
        if (!isNaN(Number(granularityParam)) && granularityParam !== granularity) {
            updateGranularity(Number(granularityParam));
        }
        if (chartTypeParam && chartTypeParam !== chart_type) {
            updateChartType(chartTypeParam);
        }
        setTradeURLParams({
            chartType: chartTypeParam ?? chart_type,
            granularity: granularityParam ?? Number(granularity),
        });
    }

    setChartStatus(status: boolean, isFromChart?: boolean) {
        if (isFromChart) this.debouncedSetChartStatus(status);
        else this.is_chart_loading = status;
    }

    async initAccountCurrency(new_currency: string) {
        if (this.currency === new_currency) return;

        await this.processNewValuesAsync({ currency: new_currency }, true, { currency: this.currency }, false);
        this.refresh();
        this.debouncedProposal();
    }

    onUnmount() {
        if (this.should_skip_prepost_lifecycle) {
            return;
        }
        this.disposePreSwitchAccount();
        this.disposeSwitchAccount();
        this.disposeLogout();
        this.disposeClientInit();
        this.disposeNetworkStatusChange();
        this.disposeThemeChange();
        this.is_trade_component_mounted = false;
        this.clearV2ParamsInitialValues();
        // TODO: Find a more elegant solution to unmount contract-trade-store
        this.root_store.contract_trade.onUnmount();
        this.refresh();
        this.resetErrorServices();
        if (this.root_store.notifications.is_notifications_visible) {
            this.root_store.notifications.toggleNotificationsModal();
        }
        if (this.prev_chart_layout) {
            this.prev_chart_layout.is_used = false;
        }
        this.clearContracts();
        this.resetAccumulatorData();
        if (this.is_vanilla) {
            this.setBarrierChoices([]);
        }
    }

    prev_chart_layout: TPrevChartLayout = null;

    get chart_layout() {
        let layout = null;
        if (this.prev_chart_layout && this.prev_chart_layout.is_used === false) {
            layout = this.prev_chart_layout;
        }
        return layout;
    }

    get is_crypto_multiplier() {
        return this.contract_type === TRADE_TYPES.MULTIPLIER && this.symbol.startsWith('cry');
    }

    exportLayout(layout: TChartLayout) {
        delete layout.previousMaxTicks; // TODO: fix it in smartcharts
        this.prev_chart_layout = layout;
        if (this.prev_chart_layout) {
            this.prev_chart_layout.isDone = () => {
                if (this.prev_chart_layout) this.prev_chart_layout.is_used = true;
                this.setChartStatus(false);
            };
        }
    }

    // ---------- WS ----------
    wsSubscribe = (req: TicksHistoryRequest, callback: (response: TTicksHistoryResponse) => void) => {
        const passthrough_callback = (...args: [TTicksHistoryResponse]) => {
            callback(...args);
            if (this.is_accumulator) {
                let current_spot_data = {};
                if ('tick' in args[0]) {
                    const { epoch, quote, symbol } = args[0].tick as TickSpotData;
                    if (this.symbol !== symbol) return;
                    current_spot_data = {
                        current_spot: quote,
                        current_spot_time: epoch,
                    };
                } else if ('history' in args[0]) {
                    const { prices, times } = args[0].history as History;
                    const symbol = args[0].echo_req.ticks_history;
                    if (this.symbol !== symbol) return;
                    current_spot_data = {
                        current_spot: prices?.[prices?.length - 1],
                        current_spot_time: times?.[times?.length - 1],
                        prev_spot_time: times?.[times?.length - 2],
                    };
                } else {
                    return;
                }
                this.root_store.contract_trade.updateAccumulatorBarriersData(current_spot_data);
            }
        };
        if (isMarketClosed(this.active_symbols, req.ticks_history)) {
            delete req.subscribe;
            WS.getTicksHistory(req).then(passthrough_callback, passthrough_callback);
        } else if (req.subscribe === 1) {
            const key = JSON.stringify(req);
            const subscriber = WS.subscribeTicksHistory(req, passthrough_callback);
            g_subscribers_map[key] = subscriber;
        }
    };

    wsForget = (req: TicksHistoryRequest) => {
        const key = JSON.stringify(req);
        if (g_subscribers_map[key]) {
            g_subscribers_map[key]?.unsubscribe();
            delete g_subscribers_map[key];
        }
        // WS.forget('ticks_history', callback, match);
    };

    wsForgetStream = (stream_id: string) => {
        WS.forgetStream(stream_id);
    };

    wsSendRequest = (req: TradingTimesRequest | ActiveSymbolsRequest | ServerTimeRequest) => {
        if ('time' in req) {
            return ServerTime.timePromise().then(server_time => {
                if (server_time) {
                    return {
                        msg_type: 'time',
                        time: server_time.unix(),
                    };
                }
                return WS.time();
            });
        }
        if ('active_symbols' in req) {
            if (this.root_store.client.is_logged_in) {
                return WS.authorized.activeSymbols('brief');
            }
            return WS.activeSymbols('brief');
        }
        if ('trading_times' in req) {
            return WS.tradingTimes(req.trading_times);
        }
        return WS.storage.send(req);
    };

    chartStateChange(state: string, option?: TChartStateChangeOption) {
        if (
            state === STATE_TYPES.MARKET_STATE_CHANGE &&
            this.is_trade_component_mounted &&
            option?.isClosed &&
            option.isClosed !== this.is_market_closed
        ) {
            this.prepareTradeStore(false);
        }
        if (state === STATE_TYPES.SET_CHART_MODE) {
            if (!isNaN(Number(option?.granularity))) {
                this.root_store.contract_trade.updateGranularity(Number(option?.granularity));
            }
            if (option?.chart_type_name) {
                this.root_store.contract_trade.updateChartType(option?.chart_type_name);
            }
        }
        const { data, event_type } = getChartAnalyticsData(state as keyof typeof STATE_TYPES, option) as TPayload;
        if (data) {
            Analytics.trackEvent(event_type, {
                ...data,
                action: data.action as TEvents['ce_indicators_types_form']['action'],
                form_name: 'default',
            });
        }
    }

    get has_alternative_source() {
        return this.is_multiplier && !!this.hovered_contract_type;
    }

    get has_barrier() {
        return hasBarrier(this.contract_type);
    }

    get is_accumulator() {
        return this.contract_type === TRADE_TYPES.ACCUMULATOR;
    }

    get is_multiplier() {
        return this.contract_type === TRADE_TYPES.MULTIPLIER;
    }

    get is_turbos() {
        return isTurbosContract(this.contract_type);
    }

    get is_vanilla() {
        return isVanillaContract(this.contract_type);
    }

    get is_vanilla_fx() {
        return isVanillaFxContract(this.contract_type, this.symbol);
    }

    get is_touch() {
        return isTouchContract(this.contract_type);
    }

    async getFirstOpenMarket(markets_to_search: string[]) {
        if (this.active_symbols?.length) {
            return findFirstOpenMarket(this.active_symbols, markets_to_search);
        }
        const { active_symbols, error } = await WS.authorized.activeSymbols();
        if (error) {
            this.root_store.common.showError({ message: localize('Trading is unavailable at this time.') });
            return undefined;
        }
        return findFirstOpenMarket(active_symbols, markets_to_search);
    }

    setStakeBoundary(type: string, min_stake?: number, max_stake?: number) {
        if (min_stake && max_stake) this.stake_boundary[type] = { min_stake, max_stake };
    }

    setActiveSymbolsV2(active_symbols: ActiveSymbols) {
        this.active_symbols = active_symbols;
        this.has_symbols_for_v2 = !!active_symbols.length;
    }

    setContractTypesListV2(contract_types_list: TContractTypesList) {
        this.contract_types_list_v2 = contract_types_list;
    }

    setBarrierChoices(barrier_choices: string[]) {
        this.barrier_choices = barrier_choices ?? [];
        if (this.is_vanilla) {
            this.strike_price_choices = { barrier: this.barrier_1, barrier_choices };
        }
    }

    setPayoutChoices(payout_choices: string[]) {
        this.payout_choices = payout_choices ?? [];
        const stored_barriers_data = { barrier: this.barrier_1, payout_choices };
        if (getContractSubtype(this.contract_type) === 'Long') {
            this.long_barriers = stored_barriers_data;
        } else {
            this.short_barriers = stored_barriers_data;
        }
    }

    togglePayoutWheelPicker() {
        this.open_payout_wheelpicker = !this.open_payout_wheelpicker;
    }
    setPayoutPerPoint(val: string) {
        if (val && val !== this.payout_per_point) {
            this.payout_per_point = val;
            this.onChange({
                target: {
                    name: 'payout_per_point',
                    value: String(this.payout_per_point),
                },
            });
        }
    }
    setIsDigitsWidgetActive(is_active: boolean) {
        this.is_digits_widget_active = is_active;
    }

    setTradeTypeTab(label = '') {
        this.trade_type_tab = label;
    }
}

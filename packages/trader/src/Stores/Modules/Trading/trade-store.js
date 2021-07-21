import debounce from 'lodash.debounce';
import { action, computed, observable, reaction, runInAction, toJS, when } from 'mobx';
import {
    cloneObject,
    extractInfoFromShortcode,
    getMinPayout,
    getPropertyValue,
    isCryptocurrency,
    isDesktop,
    isEmptyObject,
    isMobile,
    showDigitalOptionsUnavailableError,
    WS,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import { isDigitContractType, isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import ServerTime from '_common/base/server_time';
import { processPurchase } from './Actions/purchase';
import * as Symbol from './Actions/symbol';
import getValidationRules, { getMultiplierValidationRules } from './Constants/validation-rules';
import {
    pickDefaultSymbol,
    showUnavailableLocationError,
    isMarketClosed,
    findFirstOpenMarket,
} from './Helpers/active-symbols';
import ContractType from './Helpers/contract-type';
import { convertDurationLimit, resetEndTimeOnVolatilityIndices } from './Helpers/duration';
import { processTradeParams } from './Helpers/process';
import { createProposalRequests, getProposalErrorField, getProposalInfo } from './Helpers/proposal';
import { getBarrierPipSize } from './Helpers/barrier';
import { setLimitOrderBarriers } from '../Contract/Helpers/limit-orders';
import { ChartBarrierStore } from '../SmartChart/chart-barrier-store';
import { BARRIER_COLORS } from '../SmartChart/Constants/barriers';
import { isBarrierSupported, removeBarrier } from '../SmartChart/Helpers/barriers';
import BaseStore from '../../base-store';

const store_name = 'trade_store';
const g_subscribers_map = {}; // blame amin.m

export default class TradeStore extends BaseStore {
    // Control values
    @observable is_trade_component_mounted = false;
    @observable is_purchase_enabled = false;
    @observable is_trade_enabled = false;
    @observable is_equal = 0;
    @observable has_equals_only = false;

    // Underlying
    @observable symbol;
    @observable is_market_closed = false;
    @observable previous_symbol = '';
    @observable active_symbols = [];
    @observable should_refresh_active_symbols = false;

    @observable form_components = [];

    // Contract Type
    @observable contract_expiry_type = '';
    @observable contract_start_type = '';
    @observable contract_type = '';
    @observable contract_types_list = {};
    @observable trade_types = {};

    // Amount
    @observable amount = 10;
    @observable basis = '';
    @observable basis_list = [];
    @observable currency = '';

    // Duration
    @observable duration = 5;
    @observable duration_unit = '';
    @observable duration_units_list = [];
    @observable duration_min_max = {};
    @observable expiry_date = '';
    @observable expiry_time = '';
    @observable expiry_type = 'duration';

    // Barrier
    @observable barrier_1 = '';
    @observable barrier_2 = '';
    @observable barrier_count = 0;
    @observable main_barrier = null;
    @observable barriers = [];

    // Start Time
    @observable start_date = Number(0); // Number(0) refers to 'now'
    @observable start_dates_list = [];
    @observable start_time = null;
    @observable sessions = [];

    @observable market_open_times = [];
    // End Date Time
    /**
     * An array that contains market closing time.
     *
     * e.g. ["04:00:00", "08:00:00"]
     *
     */
    @observable market_close_times = [];

    // Last Digit
    @observable last_digit = 5;
    @observable is_mobile_digit_view_selected = false;

    // Purchase
    @observable.ref proposal_info = {};
    @observable.ref purchase_info = {};

    // Chart loader observables
    @observable is_chart_loading;

    // Multiplier trade params
    @observable multiplier;
    @observable multiplier_range_list = [];
    @observable stop_loss;
    @observable take_profit;
    @observable has_stop_loss = false;
    @observable has_take_profit = false;
    @observable has_cancellation = false;
    @observable commission;
    @observable cancellation_price;
    @observable stop_out;
    @observable expiration;
    @observable hovered_contract_type;
    @observable cancellation_duration = '60m';
    @observable cancellation_range_list = [];

    // Mobile
    @observable is_trade_params_expanded = true;

    addTickByProposal = () => null;
    debouncedProposal = debounce(this.requestProposal, 500);
    proposal_requests = {};
    is_purchasing_contract = false;

    initial_barriers;
    is_initial_barrier_applied = false;

    @observable should_skip_prepost_lifecycle = false;

    @action.bound
    init = async () => {
        // To be sure that the website_status response has been received before processing trading page.
        await WS.wait('authorize', 'website_status');
        // This is to wait when the client is logging in via OAuth redirect
        await when(() => !this.root_store.client.is_populating_account_list);
        WS.storage.activeSymbols('brief').then(({ active_symbols }) => {
            runInAction(() => {
                this.active_symbols = active_symbols;
            });
        });
    };

    constructor({ root_store }) {
        const local_storage_properties = [
            'amount',
            'currency',
            'barrier_1',
            'barrier_2',
            'basis',
            'contract_start_type',
            'contract_type',
            'duration',
            'duration_unit',
            'expiry_date',
            'expiry_type',
            'has_take_profit',
            'has_stop_loss',
            'has_cancellation',
            'is_equal',
            'last_digit',
            'multiplier',
            'start_date',
            'start_time',
            'symbol',
            'stop_loss',
            'take_profit',
            'is_trade_params_expanded',
        ];
        super({
            root_store,
            local_storage_properties,
            store_name,
            validation_rules: getValidationRules(),
        });

        // Adds intercept to change min_max value of duration validation
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
            () => this.root_store.client.is_logged_in,
            async () => {
                await this.setSymbolsAfterLogin();
            }
        );
        reaction(
            () => [this.contract_type],
            () => {
                if (this.contract_type === 'multiplier') {
                    // when switching back to Multiplier contract, re-apply Stop loss / Take profit validation rules
                    Object.assign(this.validation_rules, getMultiplierValidationRules());
                } else {
                    // we need to remove these two validation rules on contract_type change
                    // to be able to remove any existing Stop loss / Take profit validation errors
                    delete this.validation_rules.stop_loss;
                    delete this.validation_rules.take_profit;
                }
            }
        );
    }

    @computed
    get is_symbol_in_active_symbols() {
        return this.active_symbols.some(
            symbol_info => symbol_info.symbol === this.symbol && symbol_info.exchange_is_open === 1
        );
    }

    @action.bound
    setSkipPrePostLifecycle(should_skip) {
        if (!!should_skip !== !!this.should_skip_prepost_lifecycle) {
            // to skip assignment if no change is made
            this.should_skip_prepost_lifecycle = should_skip;
        }
    }

    @action.bound
    setTradeStatus(status) {
        this.is_trade_enabled = status;
    }

    @action.bound
    refresh() {
        this.forgetAllProposal();
        this.proposal_info = {};
        this.purchase_info = {};
        this.proposal_requests = {};
    }

    @action.bound
    clearContracts = () => {
        this.root_store.modules.contract_trade.contracts = [];
    };

    @action.bound
    async setDefaultSymbol() {
        if (!this.is_symbol_in_active_symbols) {
            const symbol = await pickDefaultSymbol(this.active_symbols);
            await this.processNewValuesAsync({ symbol });
        }
    }

    @action.bound
    async setSymbolsAfterLogin() {
        await this.setActiveSymbols();
        runInAction(() => {
            this.should_refresh_active_symbols = true;
        });
        await this.setDefaultSymbol();
    }

    @action.bound
    async setActiveSymbols() {
        const { active_symbols, error } = this.should_refresh_active_symbols
            ? // if SmartCharts has requested active_symbols, we wait for the response
              await WS.wait('active_symbols')
            : // else requests new active_symbols
              await WS.authorized.activeSymbols();
        if (error) {
            this.root_store.common.showError({ message: localize('Trading is unavailable at this time.') });
            return;
        } else if (!active_symbols || !active_symbols.length) {
            if (this.root_store.client.landing_company_shortcode !== 'maltainvest') {
                showUnavailableLocationError(this.root_store.common.showError, this.root_store.client.is_logged_in);
                return;
            } else if (this.root_store.client.landing_company_shortcode === 'maltainvest') {
                showDigitalOptionsUnavailableError(this.root_store.common.showError, {
                    text: localize(
                        'We’re working to have this available for you soon. If you have another account, switch to that account to continue trading. You may add a DMT5 Financial.'
                    ),
                    title: localize('DTrader is not available for this account'),
                    link: localize('Go to DMT5 dashboard'),
                });
                return;
            }
        }
        this.processNewValuesAsync({ active_symbols });
    }

    @action.bound
    async setContractTypes() {
        if (this.symbol && this.is_symbol_in_active_symbols) {
            await Symbol.onChangeSymbolAsync(this.symbol);
            runInAction(() => {
                const contract_categories = ContractType.getContractCategories();
                this.processNewValuesAsync({
                    ...contract_categories,
                    ...ContractType.getContractType(contract_categories.contract_types_list, this.contract_type),
                });
                this.processNewValuesAsync(ContractType.getContractValues(this));
            });
        }
    }

    @action.bound
    async validateContracts() {
        const r = await WS.storage.contractsFor(this.symbol);
        if (['InvalidSymbol', 'InputValidationFailed'].includes(r.error?.code)) {
            const symbol_to_update = await pickDefaultSymbol(this.active_symbols);
            await this.processNewValuesAsync({ symbol: symbol_to_update });
        }
    }

    @action.bound
    async prepareTradeStore(should_set_default_symbol = true) {
        this.initial_barriers = { barrier_1: this.barrier_1, barrier_2: this.barrier_2 };
        await when(() => !this.root_store.client.is_populating_account_list);

        // waits for `website_status` in order to set `stake_default` for the selected currency
        await WS.wait('website_status');
        runInAction(() => {
            this.processNewValuesAsync(
                {
                    // fallback to default currency if current logged-in client hasn't selected a currency yet
                    currency: this.root_store.client.currency || this.root_store.client.default_currency,
                },
                true,
                null,
                false
            );
        });

        await this.setActiveSymbols();
        runInAction(() => {
            this.should_refresh_active_symbols = true;
        });

        await this.validateContracts();
        if (should_set_default_symbol) await this.setDefaultSymbol();
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

    @action.bound
    async onChangeMultiple(values) {
        Object.keys(values).forEach(name => {
            if (!(name in this)) {
                throw new Error(`Invalid Argument: ${name}`);
            }
        });

        await this.processNewValuesAsync({ ...values }, true); // wait for store to be updated
        this.validateAllProperties(); // then run validation before sending proposal
    }

    @action.bound
    async onChange(e) {
        const { name, value } = e.target;

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
                this.root_store.client.selectCurrency(value);
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
    }

    @action.bound
    setPreviousSymbol(symbol) {
        if (this.previous_symbol !== symbol) this.previous_symbol = symbol;
    }

    @action.bound
    setAllowEqual(is_equal) {
        this.is_equal = is_equal;
    }

    @action.bound
    setIsTradeParamsExpanded(value) {
        this.is_trade_params_expanded = value;
    }

    @action.bound
    async resetPreviousSymbol() {
        this.setMarketStatus(isMarketClosed(this.active_symbols, this.previous_symbol));

        await Symbol.onChangeSymbolAsync(this.previous_symbol);
        await this.updateSymbol(this.symbol);

        this.setChartStatus(false);
        runInAction(() => {
            this.previous_symbol = ''; // reset the symbol to default
        });
    }

    @action.bound
    updateBarrierColor(is_dark_mode) {
        if (this.main_barrier) {
            this.main_barrier.updateBarrierColor(is_dark_mode);
        }
    }

    @action.bound
    onHoverPurchase(is_over, contract_type) {
        if (this.is_purchase_enabled && this.main_barrier && !this.is_multiplier) {
            this.main_barrier.updateBarrierShade(is_over, contract_type);
        } else if (!is_over && this.main_barrier && !this.is_multiplier) {
            this.main_barrier.updateBarrierShade(false, contract_type);
        }

        this.hovered_contract_type = is_over ? contract_type : null;
        setLimitOrderBarriers({
            barriers: this.barriers,
            is_over,
            contract_type,
            contract_info: this.proposal_info[contract_type],
        });
    }

    @action.bound
    setPurchaseSpotBarrier(is_over, position) {
        const key = 'PURCHASE_SPOT_BARRIER';
        if (!is_over) {
            removeBarrier(this.barriers, key);
            return;
        }

        let purchase_spot_barrier = this.barriers.find(b => b.key === key);
        if (purchase_spot_barrier) {
            if (purchase_spot_barrier.high !== +position.contract_info.entry_spot) {
                purchase_spot_barrier.onChange({
                    high: position.contract_info.entry_spot,
                });
            }
        } else {
            purchase_spot_barrier = new ChartBarrierStore(position.contract_info.entry_spot);
            purchase_spot_barrier.key = key;
            purchase_spot_barrier.draggable = false;
            purchase_spot_barrier.hideOffscreenBarrier = true;
            purchase_spot_barrier.isSingleBarrier = true;
            purchase_spot_barrier.updateBarrierColor(this.root_store.ui.is_dark_mode_on);
            this.barriers.push(purchase_spot_barrier);
        }
    }

    @action.bound
    updateLimitOrderBarriers(is_over, position) {
        const contract_info = position.contract_info;
        const { barriers } = this;
        setLimitOrderBarriers({
            barriers,
            contract_info,
            contract_type: contract_info.contract_type,
            is_over,
        });
    }

    @action.bound
    clearLimitOrderBarriers() {
        this.hovered_contract_type = null;
        const { barriers } = this;
        setLimitOrderBarriers({
            barriers,
            is_over: false,
        });
    }

    @computed
    get barrier_pipsize() {
        return getBarrierPipSize(this.barrier_1);
    }

    @computed
    get main_barrier_flattened() {
        const is_digit_trade_type = isDigitTradeType(this.contract_type);
        return is_digit_trade_type ? null : toJS(this.main_barrier);
    }

    @computed
    get barriers_flattened() {
        return this.barriers && toJS(this.barriers);
    }

    setMainBarrier = proposal_info => {
        if (!proposal_info) {
            return;
        }
        const { contract_type, barrier, high_barrier, low_barrier } = proposal_info;

        if (isBarrierSupported(contract_type)) {
            const color = this.root_store.ui.is_dark_mode_on ? BARRIER_COLORS.DARK_GRAY : BARRIER_COLORS.GRAY;
            // create barrier only when it's available in response
            this.main_barrier = new ChartBarrierStore(barrier || high_barrier, low_barrier, this.onChartBarrierChange, {
                color,
            });
            // this.main_barrier.updateBarrierShade(true, contract_type);
        } else {
            this.main_barrier = null;
        }
    };

    @action.bound
    onPurchase = debounce(this.processPurchase, 300);

    @action.bound
    processPurchase(proposal_id, price, type) {
        if (!this.is_purchase_enabled) return;
        if (proposal_id) {
            this.is_purchase_enabled = false;
            this.is_purchasing_contract = true;
            const is_tick_contract = this.duration_unit === 't';
            processPurchase(proposal_id, price).then(
                action(response => {
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
                            this.root_store.common.setServicesError({
                                type: response.msg_type,
                                ...response.error,
                            });
                        }
                    } else if (response.buy) {
                        if (this.proposal_info[type] && this.proposal_info[type].id !== proposal_id) {
                            throw new Error('Proposal ID does not match.');
                        }
                        const contract_data = {
                            ...this.proposal_requests[type],
                            ...this.proposal_info[type],
                            buy_price: response.buy.buy_price,
                        };
                        const { contract_id, longcode, start_time } = response.buy;

                        // toggle smartcharts to contract mode
                        if (contract_id) {
                            const shortcode = response.buy.shortcode;
                            const { category, underlying } = extractInfoFromShortcode(shortcode);
                            const is_digit_contract = isDigitContractType(category.toUpperCase());
                            const contract_type = category.toUpperCase();
                            this.root_store.modules.contract_trade.addContract({
                                contract_id,
                                start_time,
                                longcode,
                                underlying,
                                barrier: is_digit_contract ? last_digit : null,
                                contract_type,
                                is_tick_contract,
                            });
                            this.root_store.modules.portfolio.onBuyResponse({
                                contract_id,
                                longcode,
                                contract_type,
                            });
                            // NOTE: changing chart granularity and chart_type has to be done in a different render cycle
                            // so we have to set chart granularity to zero, and change the chart_type to 'mountain' first,
                            // and then set the chart view to the start_time
                            // draw the start time line and show longcode then mount contract
                            // this.root_store.modules.contract_trade.drawContractStartTime(start_time, longcode, contract_id);
                            if (isDesktop()) {
                                this.root_store.ui.openPositionsDrawer();
                            } else if (isMobile()) {
                                // TODO: Remove this when markers for multipliers are enabled
                                if (this.is_multiplier) {
                                    this.root_store.ui.openPositionsDrawer();
                                }
                            }
                            this.proposal_info = {};
                            this.forgetAllProposal();
                            this.purchase_info = response;
                            this.proposal_requests = {};
                            this.debouncedProposal();
                            this.clearLimitOrderBarriers();
                            this.pushPurchaseDataToGtm(contract_data);
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

    @action.bound
    enablePurchase() {
        if (!this.root_store.client.is_unwelcome) {
            this.is_purchase_enabled = true;
        }
    }

    disablePurchaseButtons = () => {
        const el_purchase_value = document.getElementsByClassName('trade-container__price-info');
        const el_purchase_buttons = document.getElementsByClassName('btn-purchase');
        [].forEach.bind(el_purchase_buttons, el => {
            el.classList.add('btn-purchase--disabled');
        })();
        [].forEach.bind(el_purchase_value, el => {
            el.classList.add('trade-container__price-info--fade');
        })();
    };

    /**
     * Updates the store with new values
     * @param  {Object} new_state - new values to update the store with
     * @return {Object} returns the object having only those values that are updated
     */
    @action.bound
    updateStore(new_state) {
        Object.keys(cloneObject(new_state)).forEach(key => {
            if (key === 'root_store' || ['validation_rules', 'validation_errors', 'currency'].indexOf(key) > -1) return;
            if (JSON.stringify(this[key]) === JSON.stringify(new_state[key])) {
                delete new_state[key];
            } else {
                if (key === 'symbol') {
                    this.is_purchase_enabled = false;
                    this.is_trade_enabled = false;
                }

                if (new_state.start_date && typeof new_state.start_date === 'string') {
                    new_state.start_date = parseInt(new_state.start_date);
                }

                this[key] = new_state[key];

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
        obj_new_values = {},
        is_changed_by_user = false,
        obj_old_values = {},
        should_forget_first = true
    ) {
        // To switch to rise_fall_equal contract type when allow equal is checked on first page refresh or
        // when switch back to Rise/Fall from another contract type i.e.
        if (obj_new_values.contract_type && obj_new_values.contract_type === 'rise_fall' && !!this.is_equal) {
            obj_new_values.contract_type = 'rise_fall_equal';
        }

        if (/\bduration\b/.test(Object.keys(obj_new_values))) {
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
        if (is_changed_by_user && /\bcurrency\b/.test(Object.keys(obj_new_values))) {
            const prev_currency = obj_old_values?.currency || this.currency;
            const has_currency_changed = obj_new_values.currency !== prev_currency;

            const should_reset_stake =
                isCryptocurrency(obj_new_values.currency) ||
                // For switch between fiat and crypto and vice versa
                isCryptocurrency(obj_new_values.currency) !== isCryptocurrency(prev_currency);

            if (has_currency_changed && should_reset_stake) {
                obj_new_values.amount = obj_new_values.amount || getMinPayout(obj_new_values.currency);
            }
            this.currency = obj_new_values.currency;
        }

        let has_only_forward_starting_contracts;

        if (Object.keys(obj_new_values).includes('symbol')) {
            this.setPreviousSymbol(this.symbol);
            await Symbol.onChangeSymbolAsync(obj_new_values.symbol);
            this.setMarketStatus(isMarketClosed(this.active_symbols, obj_new_values.symbol));
            has_only_forward_starting_contracts = ContractType.getContractCategories()
                .has_only_forward_starting_contracts;
        }
        // TODO: remove all traces of setHasOnlyForwardingContracts and has_only_forward_starting_contracts in app
        //  once future contracts are implemented
        this.root_store.ui.setHasOnlyForwardingContracts(has_only_forward_starting_contracts);
        if (has_only_forward_starting_contracts) return;

        const new_state = this.updateStore(cloneObject(obj_new_values));

        if (is_changed_by_user || /\b(symbol|contract_types_list)\b/.test(Object.keys(new_state))) {
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
            const snapshot = await processTradeParams(this, new_state);
            snapshot.is_trade_enabled = true;

            this.updateStore({
                ...snapshot,
                ...(!this.is_initial_barrier_applied ? this.initial_barriers : {}),
            });
            this.is_initial_barrier_applied = true;

            if (/\bcontract_type\b/.test(Object.keys(new_state))) {
                this.validateAllProperties();
            }
            this.debouncedProposal();
        }
    }

    @computed
    get show_digits_stats() {
        return isDigitTradeType(this.contract_type);
    }

    @action.bound
    setMobileDigitView(bool) {
        this.is_mobile_digit_view_selected = bool;
    }

    @action.bound
    pushPurchaseDataToGtm(contract_data) {
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
                    chart_type: this.root_store.modules.contract_trade.chart_type,
                    granularity: this.root_store.modules.contract_trade.granularity,
                },
            },
        };
        this.root_store.gtm.pushDataLayer(data);
    }

    @action.bound
    clearPurchaseInfo() {
        this.purchase_info = {};
        this.proposal_requests = {};
        this.proposal_info = {};
    }

    @action.bound
    requestProposal() {
        const requests = createProposalRequests(this);

        if (Object.values(this.validation_errors).some(e => e.length)) {
            this.proposal_info = {};
            this.purchase_info = {};
            this.forgetAllProposal();
            return;
        }

        if (!isEmptyObject(requests)) {
            this.proposal_requests = requests;
            this.purchase_info = {};

            Object.keys(this.proposal_requests).forEach(type => {
                WS.subscribeProposal(this.proposal_requests[type], this.onProposalResponse);
            });
        }
        this.root_store.ui.resetPurchaseStates();
    }

    @action.bound
    forgetAllProposal() {
        const length = Object.keys(this.proposal_requests).length;
        if (length > 0) WS.forgetAll('proposal');
    }

    @action.bound
    setMarketStatus(status) {
        this.is_market_closed = status;
    }

    @action.bound
    onProposalResponse(response) {
        const contract_type = response.echo_req.contract_type;
        const prev_proposal_info = getPropertyValue(this.proposal_info, contract_type) || {};
        const obj_prev_contract_basis = getPropertyValue(prev_proposal_info, 'obj_contract_basis') || {};

        // add/update expiration or date_expiry for crypto indices from proposal
        const date_expiry = response.proposal?.date_expiry;

        if (!response.error && !!date_expiry && this.is_crypto_multiplier) {
            this.expiration = date_expiry;
        }

        this.proposal_info = {
            ...this.proposal_info,
            [contract_type]: getProposalInfo(this, response, obj_prev_contract_basis),
        };

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

        if (!this.main_barrier || !(this.main_barrier.shade !== 'NONE_SINGLE')) {
            this.setMainBarrier(response.echo_req);
        }

        if (this.hovered_contract_type === contract_type) {
            this.addTickByProposal(response);
            setLimitOrderBarriers({
                barriers: this.barriers,
                contract_info: this.proposal_info[this.hovered_contract_type],
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
        } else {
            this.validateAllProperties();
        }

        if (!this.is_purchasing_contract) {
            this.enablePurchase();
        }
    }

    @action.bound
    onChartBarrierChange(barrier_1, barrier_2) {
        this.processNewValuesAsync({ barrier_1, barrier_2 }, true);
    }

    @action.bound
    onAllowEqualsChange() {
        this.processNewValuesAsync({ contract_type: parseInt(this.is_equal) ? 'rise_fall_equal' : 'rise_fall' }, true);
    }

    @action.bound
    updateSymbol(underlying) {
        if (!underlying) return;
        this.onChange({
            target: {
                name: 'symbol',
                value: underlying,
            },
        });
    }

    @action.bound
    changeDurationValidationRules() {
        if (this.expiry_type === 'endtime') {
            this.validation_errors.duration = [];
            return;
        }

        if (!this.validation_rules.duration) return;

        const index = this.validation_rules.duration.rules.findIndex(item => item[0] === 'number');
        const limits = this.duration_min_max[this.contract_expiry_type] || false;

        if (limits) {
            const duration_options = {
                min: convertDurationLimit(+limits.min, this.duration_unit),
                max: convertDurationLimit(+limits.max, this.duration_unit),
            };

            if (index > -1) {
                this.validation_rules.duration.rules[index][1] = duration_options;
            } else {
                this.validation_rules.duration.rules.push(['number', duration_options]);
            }
            this.validateProperty('duration', this.duration);
        }
    }

    @action.bound
    async accountSwitcherListener() {
        if (this.root_store.client.standpoint.maltainvest) {
            // TODO: optimize this code block once the below mentioned issue is fixed in `deriv-api`
            // Two `active_symbols` are requested here.
            // We can call `setActiveSymbols` after setting `should_refresh_active_symbols` to true so that it utilizes `WS.wait('active_symbols')`
            // But `WS.wait` only works for the first time, when called subsequently it won't wait and will just return the first response.
            await this.setActiveSymbols();
            runInAction(() => {
                this.should_refresh_active_symbols = true;
            });
            await this.validateContracts();
            await this.setDefaultSymbol();
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

    @action.bound
    preSwitchAccountListener() {
        this.clearContracts();
        this.is_trade_enabled = false;
        return Promise.resolve();
    }

    @action.bound
    async logoutListener() {
        this.should_refresh_active_symbols = true;
        this.clearContracts();
        this.refresh();
        this.resetErrorServices();
        await this.setContractTypes();
        this.debouncedProposal();
    }

    @action.bound
    clientInitListener() {
        this.initAccountCurrency(this.root_store.client.currency || this.root_store.client.default_currency);
        return Promise.resolve();
    }

    @action.bound
    networkStatusChangeListener(is_online) {
        this.setTradeStatus(is_online);
    }

    @action.bound
    themeChangeListener(is_dark_mode_on) {
        this.updateBarrierColor(is_dark_mode_on);
    }

    @action.bound
    resetErrorServices() {
        this.root_store.ui.toggleServicesErrorModal(false);
    }

    @action.bound
    onMount() {
        if (this.is_trade_component_mounted && this.should_skip_prepost_lifecycle) {
            return;
        }
        this.onPreSwitchAccount(this.preSwitchAccountListener);
        this.onSwitchAccount(this.accountSwitcherListener);
        this.onLogout(this.logoutListener);
        this.onClientInit(this.clientInitListener);
        this.onNetworkStatusChange(this.networkStatusChangeListener);
        this.onThemeChange(this.themeChangeListener);
        this.setChartStatus(true);
        runInAction(async () => {
            this.is_trade_component_mounted = true;
            this.prepareTradeStore();
        });
    }

    @action.bound
    setChartStatus(status) {
        this.is_chart_loading = status;
    }

    @action.bound
    async initAccountCurrency(new_currency) {
        if (this.currency === new_currency) return;

        await this.processNewValuesAsync({ currency: new_currency }, true, { currency: this.currency }, false);
        this.refresh();
        this.debouncedProposal();
    }

    @action.bound
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
        // TODO: Find a more elegant solution to unmount contract-trade-store
        this.root_store.modules.contract_trade.onUnmount();
        this.refresh();
        this.resetErrorServices();
        if (this.root_store.ui.is_notifications_visible) {
            this.root_store.ui.toggleNotificationsModal();
        }
        if (this.prev_chart_layout) {
            this.prev_chart_layout.is_used = false;
        }
    }

    prev_chart_layout = null;

    get chart_layout() {
        let layout = null;
        if (this.prev_chart_layout && this.prev_chart_layout.is_used === false) {
            layout = this.prev_chart_layout;
        }
        return layout;
    }

    get is_crypto_multiplier() {
        return this.contract_type === 'multiplier' && /^cry/.test(this.symbol);
    }

    @action.bound
    exportLayout(layout) {
        delete layout.previousMaxTicks; // TODO: fix it in smartcharts
        this.prev_chart_layout = layout;
        this.prev_chart_layout.isDone = () => {
            this.prev_chart_layout.is_used = true;
            this.setChartStatus(false);
        };
    }

    // ---------- WS ----------
    wsSubscribe = (req, callback) => {
        if (req.subscribe === 1) {
            const key = JSON.stringify(req);
            const subscriber = WS.subscribeTicksHistory(req, callback);
            g_subscribers_map[key] = subscriber;
        }
    };

    wsForget = req => {
        const key = JSON.stringify(req);
        if (g_subscribers_map[key]) {
            g_subscribers_map[key].unsubscribe();
            delete g_subscribers_map[key];
        }
        // WS.forget('ticks_history', callback, match);
    };

    wsForgetStream = stream_id => {
        WS.forgetStream(stream_id);
    };

    wsSendRequest = req => {
        if (req.time) {
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
        if (req.active_symbols) {
            return this.should_refresh_active_symbols ? WS.activeSymbols('brief') : WS.wait('active_symbols');
        }
        return WS.storage.send(req);
    };

    @action.bound
    resetRefresh() {
        this.should_refresh_active_symbols = false;
    }

    @action.bound
    chartStateChange(state, option) {
        const market_close_prop = 'isClosed';
        switch (state) {
            case 'MARKET_STATE_CHANGE':
                if (option && market_close_prop in option) {
                    if (this.is_trade_component_mounted && option[market_close_prop] !== this.is_market_closed)
                        this.prepareTradeStore(false);
                }
                break;
            default:
        }
    }

    refToAddTick = ref => {
        this.addTickByProposal = ref;
    };

    @computed
    get has_alternative_source() {
        return this.is_multiplier && !!this.hovered_contract_type;
    }

    @computed
    get is_multiplier() {
        return this.contract_type === 'multiplier';
    }

    @action.bound
    async getFirstOpenMarket(markets_to_search) {
        if (this.active_symbols?.length) {
            return findFirstOpenMarket(this.active_symbols, markets_to_search);
        }
        const { active_symbols, error } = this.should_refresh_active_symbols
            ? // if SmartCharts has requested active_symbols, we wait for the response
              await WS.wait('active_symbols')
            : // else requests new active_symbols
              await WS.authorized.activeSymbols();
        if (error) {
            this.root_store.common.showError({ message: localize('Trading is unavailable at this time.') });
            return undefined;
        }
        return findFirstOpenMarket(active_symbols, markets_to_search);
    }
}

import { action, extendObservable, observable, makeObservable, runInAction } from 'mobx';
import {
    ChartBarrierStore,
    isAccumulatorContract,
    isDigitContract,
    isDtraderV2Enabled,
    isEnded,
    isEqualObject,
    isMultiplierContract,
    isResetContract,
    isOpen,
    isTurbosContract,
    getDigitInfo,
    getDisplayStatus,
    getLimitOrder,
    WS,
    getContractUpdateConfig,
    getContractValidationRules,
    BARRIER_LINE_STYLES,
    DEFAULT_SHADES,
    isBarrierSupported,
    getAccuBarriersDefaultTimeout,
    getAccuBarriersForContractDetails,
    getEndTime,
    BARRIER_COLORS,
    getContractStatus,
    setLimitOrderBarriers,
} from '@deriv/shared';
import { getChartConfig } from './Helpers/logic';
import { createChartMarkers, calculateMarker, getAccumulatorMarkers } from './Helpers/chart-markers';
import BaseStore from './base-store';

export default class ContractStore extends BaseStore {
    constructor(root_store, { contract_id }) {
        super({
            root_store,
            validation_rules: getContractValidationRules(),
        });

        makeObservable(this, {
            accu_high_barrier: observable,
            accu_low_barrier: observable,
            cached_barriers_data: observable,
            digits_info: observable,
            sell_info: observable,
            contract_config: observable.ref,
            display_status: observable,
            is_ended: observable,
            is_digit_contract: observable,
            error_message: observable,
            contract_info: observable.ref,
            is_static_chart: observable,
            end_time: observable,
            contract_update_take_profit: observable,
            contract_update_stop_loss: observable,
            has_contract_update_take_profit: observable,
            has_contract_update_stop_loss: observable,
            contract_update_history: observable.ref,
            margin: observable,
            barriers_array: observable.shallow,
            markers_array: observable.shallow,
            marker: observable.ref,
            accumulator_marker: observable.ref,
            populateConfig: action.bound,
            populateContractUpdateConfig: action.bound,
            populateContractUpdateHistory: action.bound,
            clearContractUpdateConfigValues: action.bound,
            onChange: action.bound,
            updateLimitOrder: action.bound,
            getContractsArray: action.bound,
        });

        this.root_store = root_store;
        this.contract_id = contract_id;
    }

    // --- Observable properties ---
    digits_info = observable.object({});
    sell_info = observable.object({});

    contract_config = {};
    display_status = 'purchased';
    is_ended = false;
    is_digit_contract = false;

    // TODO: see how to handle errors.
    error_message = '';

    contract_info = observable.object({});

    is_static_chart = false;
    end_time = null;

    // Accumulator contract
    accu_high_barrier = null;
    accu_low_barrier = null;
    cached_barriers_data = {};

    // Multiplier contract update config
    contract_update_take_profit = '';
    contract_update_stop_loss = '';
    has_contract_update_take_profit = false;
    has_contract_update_stop_loss = false;
    contract_update_history = [];
    contract_update_config = {};

    // ---- chart props
    margin;
    barriers_array = [];
    markers_array = [];
    marker = null;
    accumulator_marker = null;

    // ---- Normal properties ---
    is_ongoing_contract = false;

    populateConfig(contract_info, is_last_contract = false) {
        const prev_contract_info = this.contract_info;
        this.contract_info = contract_info;
        this.end_time = getEndTime(this.contract_info);
        const { accu_high_barrier, accu_low_barrier } = getAccuBarriersForContractDetails(contract_info);
        this.accu_high_barrier = accu_high_barrier;
        this.accu_low_barrier = accu_low_barrier;
        // TODO: don't update the barriers & markers if they are not changed
        this.updateBarriersArray(contract_info, this.root_store.ui.is_dark_mode_on);
        this.markers_array = createChartMarkers(this.contract_info);
        this.marker = calculateMarker(this.contract_info, this.root_store.ui.is_dark_mode_on, is_last_contract);
        this.contract_config = getChartConfig(this.contract_info);
        this.display_status = getDisplayStatus(this.contract_info);
        this.is_ended = isEnded(this.contract_info);
        this.is_digit_contract = isDigitContract(this.contract_info.contract_type);
        // API doesn't return barrier for digit contracts (sometimes), remove this check once resolved
        if (!this.contract_info.barrier && prev_contract_info.barrier && this.is_digit_contract) {
            this.contract_info.barrier = prev_contract_info.barrier;
        }

        if (this.is_digit_contract) {
            extendObservable(this.digits_info, getDigitInfo(this.digits_info, this.contract_info));
        }

        // force to sell the expired contract, in order to remove from portfolio
        if (+contract_info.is_settleable === 1 && !contract_info.is_sold) {
            WS.send({ sell_expired: 1 });
        }

        const is_multiplier = isMultiplierContract(this.contract_info.contract_type);
        const is_accumulator = isAccumulatorContract(this.contract_info.contract_type);
        const is_turbos = isTurbosContract(this.contract_info.contract_type);

        if ((is_accumulator || is_multiplier || is_turbos) && contract_info.contract_id && contract_info.limit_order) {
            this.populateContractUpdateConfig(this.contract_info);
        }
    }

    cacheProposalOpenContractResponse = response => {
        const { contract_id } = response.proposal_open_contract;
        WS.storage.set({ proposal_open_contract: 1, contract_id }, response);
    };

    populateContractUpdateConfig(response) {
        const contract_update_config = getContractUpdateConfig(response);
        if (!isEqualObject(this.contract_update_config, contract_update_config)) {
            Object.assign(this, contract_update_config);
            this.contract_update_config = contract_update_config;

            const { contract_update, error } = response;
            if (contract_update && !error) {
                this.contract_info.limit_order = Object.assign(this.contract_info.limit_order || {}, contract_update);
            }
        }
    }

    populateContractUpdateHistory({ contract_update_history }) {
        this.root_store.contract_replay.contract_store.contract_update_history = contract_update_history.sort(
            (a, b) => b.order_date - a.order_date
        );
    }

    updateBarriersArray(contract_info, is_dark_mode) {
        const {
            barrier,
            contract_type,
            current_spot_high_barrier,
            current_spot_low_barrier,
            high_barrier,
            low_barrier,
            status,
            current_spot_time,
            underlying,
            tick_stream: ticks = [],
        } = contract_info || {};
        const main_barrier = this.barriers_array?.[0];
        if (isAccumulatorContract(contract_info.contract_type)) {
            // even though updateBarriersArray is called both in DTrader & C.Details pages,
            // the below code will delay Accumulator barriers and their labels only in Contract Details.
            if (
                this.cached_barriers_data.current_spot_high_barrier === current_spot_high_barrier &&
                this.cached_barriers_data.current_spot_low_barrier === current_spot_low_barrier &&
                this.cached_barriers_data.high_barrier === high_barrier &&
                this.cached_barriers_data.low_barrier === low_barrier &&
                this.cached_barriers_data.status === status
            ) {
                return;
            }

            const contract_status = getContractStatus(contract_info);
            const is_accu_contract_ended = contract_status !== 'open';
            const prev_epoch = is_accu_contract_ended
                ? ticks[ticks.length - 2]?.epoch || ticks[ticks.length - 1]?.epoch
                : current_spot_time;

            if (is_accu_contract_ended) {
                this.accumulator_marker = getAccumulatorMarkers({
                    high_barrier,
                    low_barrier,
                    prev_epoch,
                    is_dark_mode_on: is_dark_mode,
                    contract_info,
                    in_contract_details: true,
                });
            }

            if (!this.barriers_array.length) {
                // Accumulators barrier range in C.Details consists of labels (this.barriers_array) and horizontal lines with shade (this.marker)
                this.barriers_array = this.createBarriersArray(
                    {
                        ...contract_info,
                        high_barrier: this.accu_high_barrier,
                        low_barrier: this.accu_low_barrier,
                    },
                    is_dark_mode
                );
                return;
            }

            setTimeout(
                () =>
                    runInAction(() => {
                        if (contract_info) {
                            if (isBarrierSupported(contract_type) && this.accu_high_barrier && this.accu_low_barrier) {
                                // updating barrier labels in C.Details page
                                main_barrier?.updateBarriers(this.accu_high_barrier, this.accu_low_barrier);
                            }
                            // this.markers_array contains tick markers & start/end vertical lines in C.Details page
                            this.markers_array = createChartMarkers(contract_info, true);

                            this.accumulator_marker = getAccumulatorMarkers({
                                high_barrier: this.accu_high_barrier,
                                low_barrier: this.accu_low_barrier,
                                prev_epoch,
                                is_dark_mode_on: this.root_store.ui.is_dark_mode_on,
                                contract_info: this.contract_info,
                                in_contract_details: true,
                            });
                        }
                    }),
                isOpen(contract_info) ? getAccuBarriersDefaultTimeout(underlying) : 0
            );
            this.cached_barriers_data = {
                current_spot_high_barrier,
                current_spot_low_barrier,
                high_barrier,
                low_barrier,
                status,
            };
            return;
        }
        if (!this.barriers_array.length) {
            this.barriers_array = this.createBarriersArray(contract_info, is_dark_mode);
            return;
        }

        if (contract_info) {
            if (
                this.barriers_array.length === 1 &&
                isResetContract(contract_info.contract_type) &&
                contract_info.reset_time
            ) {
                this.barriers_array = this.createBarriersArray(contract_info, is_dark_mode);
                return;
            }
            if (
                isBarrierSupported(contract_type) &&
                (barrier || high_barrier) &&
                !isResetContract(contract_info.contract_type)
            ) {
                main_barrier?.updateBarriers(barrier || high_barrier, low_barrier);
            }
            if (
                contract_info.contract_id &&
                contract_info.contract_id === this.root_store.contract_replay.contract_id
            ) {
                setLimitOrderBarriers({
                    barriers: this.barriers_array,
                    contract_info,
                    contract_type,
                    is_over: !contract_info.sell_time,
                });
            }
        }
    }

    createBarriersArray = contract_info => {
        let barriers = [];
        if (contract_info) {
            const {
                contract_type,
                barrier,
                entry_spot,
                high_barrier: high,
                low_barrier,
                reset_time,
                reset_barrier,
            } = contract_info;
            const high_barrier = this.accu_high_barrier || barrier || high;
            const common_props = {
                not_draggable: true,
                shade: DEFAULT_SHADES['2'],
                color: BARRIER_COLORS.BLUE,
            };
            if (
                isBarrierSupported(contract_type) &&
                !isResetContract(contract_type) &&
                (high_barrier || (entry_spot && !isAccumulatorContract(contract_type)))
            ) {
                // create barrier only when it's available in response
                const main_barrier = new ChartBarrierStore(
                    high_barrier || entry_spot,
                    this.accu_low_barrier || low_barrier,
                    null,
                    {
                        ...common_props,
                        line_style: !isAccumulatorContract(contract_type) && BARRIER_LINE_STYLES.SOLID,
                        hideBarrierLine: isAccumulatorContract(contract_type),
                        shade: isAccumulatorContract(contract_type) && DEFAULT_SHADES['2'],
                    }
                );

                main_barrier.updateBarrierShade(true, contract_type);

                barriers = [main_barrier];
            } else if (isResetContract(contract_type) && entry_spot) {
                const main_barrier = new ChartBarrierStore(entry_spot, low_barrier, null, {
                    ...common_props,
                });

                main_barrier.updateBarrierShade(true, contract_type);

                barriers = [main_barrier];

                if (reset_time) {
                    const reset_barrier_instance = new ChartBarrierStore(reset_barrier, low_barrier, null, {
                        ...common_props,
                        hideBarrierLine: true,
                        line_style: BARRIER_LINE_STYLES.DASHED,
                    });

                    main_barrier.updateBarrierShade(false, contract_type);

                    barriers.push(reset_barrier_instance);
                }
            }
        }
        return barriers;
    };

    clearContractUpdateConfigValues() {
        Object.assign(this, getContractUpdateConfig(this.contract_info));
        this.validation_errors.contract_update_stop_loss = [];
        this.validation_errors.contract_update_take_profit = [];
    }

    onChange({ name, value }) {
        this[name] = value;
        this.validateProperty(name, this[name]);
    }

    updateLimitOrder() {
        const limit_order =
            isAccumulatorContract(this.contract_info.contract_type) ||
            isTurbosContract(this.contract_info.contract_type)
                ? { take_profit: getLimitOrder(this).take_profit }
                : getLimitOrder(this);

        Object.keys(limit_order).length !== 0 &&
            WS.contractUpdate(this.contract_id, limit_order).then(response => {
                if (response.error) {
                    this.root_store.common.setServicesError(
                        {
                            type: response.msg_type,
                            ...response.error,
                        },
                        isDtraderV2Enabled(this.root_store.ui.is_mobile)
                    );
                    return;
                }

                // Update contract store
                this.populateContractUpdateConfig(response);
                if (this.root_store.ui.is_history_tab_active) {
                    WS.contractUpdateHistory(this.contract_id).then(this.populateContractUpdateHistory);
                }

                // Update portfolio store
                this.root_store.portfolio.populateContractUpdate(response, this.contract_id);
            });
    }

    getContractsArray() {
        if (!this.accumulator_marker) return [];
        return [this.accumulator_marker];
    }
}

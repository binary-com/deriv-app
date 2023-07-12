import { action, computed, observable, toJS, makeObservable, override, reaction, runInAction } from 'mobx';
import {
    getAccuBarriersDefaultTimeout,
    getAccuBarriersDTraderTimeout,
    getContractTypesConfig,
    isAccumulatorContract,
    isAccumulatorContractOpen,
    isCallPut,
    isDesktop,
    isEnded,
    isMobile,
    isMultiplierContract,
    LocalStore,
    switch_to_tick_chart,
    extractInfoFromShortcode,
    getAccumulatorBarriers,
    getAccuBarrierSpotDistance,
} from '@deriv/shared';
import ContractStore from './contract-store';
import BaseStore from './base-store';

export default class ContractTradeStore extends BaseStore {
    // --- Observable properties ---
    is_browser_tab_active = true;
    contracts = [];
    contracts_map = {};
    has_error = false;
    error_message = '';

    // Chart specific observables
    granularity = +LocalStore.get('contract_trade.granularity') || 0;
    chart_type = LocalStore.get('contract_trade.chart_type') || 'mountain';
    prev_chart_type = '';
    prev_granularity = null;

    // Accumulator barriers data:
    accu_barriers_timeout_id = null;
    accumulator_barriers_data = {};
    accumulator_contract_barriers_data = {};
    cached_barriers_data = {};
    should_calculate_accu_barriers = true;

    constructor(root_store) {
        super({ root_store });

        makeObservable(this, {
            accu_barriers_timeout_id: observable,
            accumulator_barriers_data: observable.struct,
            accumulator_contract_barriers_data: observable.struct,
            cached_barriers_data: observable.struct,
            calculateAccumulatorBarriers: action.bound,
            clearAccumulatorBarriersData: action.bound,
            contracts: observable.shallow,
            has_crossed_accu_barriers: computed,
            has_error: observable,
            error_message: observable,
            granularity: observable,
            chart_type: observable,
            is_browser_tab_active: observable,
            updateAccumulatorBarriersData: action.bound,
            updateChartType: action.bound,
            updateGranularity: action.bound,
            markers_array: computed,
            addContract: action.bound,
            removeContract: action.bound,
            accountSwitchListener: action.bound,
            onUnmount: override,
            prev_chart_type: observable,
            prev_granularity: observable,
            updateProposal: action.bound,
            last_contract: computed,
            clearError: action.bound,
            getContractById: action.bound,
            savePreviousChartMode: action.bound,
            setNewAccumulatorBarriersData: action.bound,
            should_calculate_accu_barriers: observable,
        });

        this.root_store = root_store;
        this.onSwitchAccount(this.accountSwitchListener);

        reaction(
            () => this.last_contract.contract_info,
            () => {
                if (!isAccumulatorContract(this.last_contract.contract_info?.contract_type)) return;
                const {
                    barrier_spot_distance,
                    current_spot,
                    current_spot_time,
                    current_spot_high_barrier,
                    current_spot_low_barrier,
                    is_sold,
                    underlying,
                } = this.last_contract.contract_info || {};
                if (
                    current_spot &&
                    current_spot_high_barrier &&
                    !is_sold &&
                    (!this.should_calculate_accu_barriers ||
                        (!this.accumulator_barriers_data[underlying]?.accumulators_high_barrier &&
                            current_spot_time === this.accumulator_barriers_data[underlying]?.current_spot_time))
                ) {
                    this.updateAccumulatorBarriersData({
                        barrier_spot_distance,
                        current_spot: this.should_calculate_accu_barriers && current_spot,
                        current_spot_time,
                        accumulators_high_barrier: current_spot_high_barrier,
                        accumulators_low_barrier: current_spot_low_barrier,
                        should_update_contract_barriers: !this.should_calculate_accu_barriers,
                        underlying,
                    });
                } else if (is_sold && !this.should_calculate_accu_barriers) {
                    this.clearAccumulatorBarriersData(true, false);
                }
            }
        );
    }

    // -------------------
    // ----- Actions -----
    // -------------------

    calculateAccumulatorBarriers({
        current_spot,
        pip_size,
        should_update_quickly: should_update_barriers_quickly,
        tick_size_barrier,
        underlying,
        ...passthrough_barriers_data
    }) {
        const { shortcode, exit_tick_time, underlying: symbol } = this.last_contract?.contract_info || {};
        if (shortcode && !exit_tick_time && symbol === underlying) {
            // has an ongoing ACCU contract
            const contract_tick_size_barrier = +extractInfoFromShortcode(shortcode).tick_size_barrier;
            if (contract_tick_size_barrier) {
                const { high_barrier: accumulators_high_barrier, low_barrier: accumulators_low_barrier } =
                    getAccumulatorBarriers(contract_tick_size_barrier, current_spot, pip_size);
                this.updateAccumulatorBarriersData({
                    accumulators_high_barrier,
                    accumulators_low_barrier,
                    barrier_spot_distance: getAccuBarrierSpotDistance(
                        accumulators_high_barrier,
                        current_spot,
                        pip_size
                    ),
                    current_spot,
                    underlying,
                    ...passthrough_barriers_data,
                });
            }
        } else if (tick_size_barrier) {
            const { high_barrier: accumulators_high_barrier, low_barrier: accumulators_low_barrier } =
                getAccumulatorBarriers(tick_size_barrier, current_spot, pip_size);
            // has no open ACCU contracts
            this.updateAccumulatorBarriersData({
                accumulators_high_barrier,
                accumulators_low_barrier,
                barrier_spot_distance: getAccuBarrierSpotDistance(accumulators_high_barrier, current_spot, pip_size),
                current_spot,
                should_update_barriers_quickly,
                underlying,
                ...passthrough_barriers_data,
            });
        }
    }

    clearAccumulatorBarriersData(should_clear_contract_data_only, should_clear_timeout = true) {
        if (this.accu_barriers_timeout_id && should_clear_timeout) clearTimeout(this.accu_barriers_timeout_id);
        this.accumulator_contract_barriers_data = {};
        if (!should_clear_contract_data_only) {
            this.accumulator_barriers_data = {};
        }
    }

    setNewAccumulatorBarriersData(new_barriers_data = {}, should_update_contract_barriers) {
        if (should_update_contract_barriers && !this.should_calculate_accu_barriers) {
            this.accumulator_contract_barriers_data = {
                ...this.accumulator_contract_barriers_data,
                ...new_barriers_data,
            };
        } else if (this.should_calculate_accu_barriers) {
            const symbol = new_barriers_data.underlying;
            this.accumulator_barriers_data = {
                ...this.accumulator_barriers_data,
                [symbol]: {
                    ...this.accumulator_barriers_data[symbol],
                    ...new_barriers_data,
                },
            };
        } else {
            this.accumulator_barriers_data = {
                ...this.accumulator_barriers_data,
                ...new_barriers_data,
            };
        }
    }

    updateAccumulatorBarriersData({
        accumulators_high_barrier,
        accumulators_low_barrier,
        barrier_spot_distance,
        current_spot,
        current_spot_time,
        should_update_contract_barriers,
        should_update_barriers_quickly,
        underlying,
    }) {
        const current_spot_data = {
            current_spot,
            current_spot_time,
            underlying: this.should_calculate_accu_barriers && underlying,
        };
        if (current_spot && !this.should_calculate_accu_barriers) {
            // update current tick coming from ticks_history while skipping an update for duplicate data
            if (current_spot_time === this.accumulator_barriers_data.current_spot_time) return;
            current_spot_data.tick_update_timestamp = Date.now();
            this.setNewAccumulatorBarriersData(current_spot_data, true);
            this.setNewAccumulatorBarriersData(current_spot_data);
            return;
        }
        const delayed_barriers_data = {
            accumulators_high_barrier,
            accumulators_low_barrier,
            barrier_spot_distance,
            should_update_contract_barriers,
            previous_spot_time: current_spot_time,
            underlying: this.should_calculate_accu_barriers && underlying,
        };
        if (
            (!this.should_calculate_accu_barriers &&
                this.accumulator_barriers_data.current_spot_time &&
                this.accumulator_barriers_data.current_spot_time !== current_spot_time &&
                !this.accumulator_barriers_data.accumulators_high_barrier) ||
            Object.keys(delayed_barriers_data).every(key => {
                const is_duplicate_non_contract_data = this.should_calculate_accu_barriers
                    ? this.accumulator_barriers_data[underlying]?.[key] === delayed_barriers_data[key]
                    : this.accumulator_barriers_data[key] === delayed_barriers_data[key];
                return should_update_contract_barriers
                    ? this.accumulator_contract_barriers_data[key] === delayed_barriers_data[key]
                    : is_duplicate_non_contract_data;
            })
        ) {
            // skip an update for duplicate data, or when a tick, which current barriers are related to, was not returned from ticks_history
            return;
        }
        if (this.should_calculate_accu_barriers) {
            if (
                this.accumulator_barriers_data[underlying]?.previous_spot_time &&
                this.accumulator_barriers_data[underlying]?.previous_spot_time !==
                    this.accumulator_barriers_data[underlying]?.current_spot_time
            ) {
                if (this.accu_barriers_timeout_id) clearTimeout(this.accu_barriers_timeout_id);
                this.setNewAccumulatorBarriersData(this.cached_barriers_data, should_update_contract_barriers);
            }
            this.setNewAccumulatorBarriersData(current_spot_data, should_update_contract_barriers);
        }
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // when tab is now inactive, we need to update barriers data immediately to timers' accumulation
                // more about Chrome policy for running timers in the background: https://developer.chrome.com/blog/timer-throttling-in-chrome-88/
                this.is_browser_tab_active = false;
            } else {
                this.is_browser_tab_active = true;
            }
        });
        if (this.is_browser_tab_active) {
            // update barriers in DTrader page after animation timeout
            const tick_update_timestamp = should_update_contract_barriers
                ? this.accumulator_contract_barriers_data.tick_update_timestamp
                : this.accumulator_barriers_data.tick_update_timestamp;
            const timeout_for_calculated_barriers = should_update_barriers_quickly
                ? 150
                : getAccuBarriersDefaultTimeout(underlying);
            this.accu_barriers_timeout_id = setTimeout(
                () => {
                    runInAction(() => {
                        this.setNewAccumulatorBarriersData(delayed_barriers_data, should_update_contract_barriers);
                    });
                },
                this.should_calculate_accu_barriers
                    ? timeout_for_calculated_barriers
                    : getAccuBarriersDTraderTimeout({
                          barriers_update_timestamp: Date.now(),
                          has_default_timeout: this.accumulator_barriers_data.current_spot_time !== current_spot_time,
                          should_update_contract_barriers,
                          tick_update_timestamp,
                          underlying,
                      })
            );
        } else {
            // update barriers in DTrader page immediately
            this.setNewAccumulatorBarriersData(delayed_barriers_data, should_update_contract_barriers);
        }
        this.cached_barriers_data = { ...delayed_barriers_data };
    }

    updateChartType(type) {
        LocalStore.set('contract_trade.chart_type', type);
        this.chart_type = type;
    }

    updateGranularity(granularity) {
        const tick_chart_types = ['mountain', 'line', 'colored_line', 'spline', 'baseline'];
        if (granularity === 0 && tick_chart_types.indexOf(this.chart_type) === -1) {
            this.chart_type = 'mountain';
        }
        LocalStore.set('contract_trade.granularity', granularity);
        this.granularity = granularity;
        if (this.granularity === 0) {
            this.root_store.notifications.removeNotificationMessage(switch_to_tick_chart);
        }
    }

    savePreviousChartMode(chart_type, granularity) {
        this.prev_chart_type = chart_type;
        this.prev_granularity = granularity;
    }

    applicable_contracts = () => {
        const { symbol: underlying, contract_type: trade_type } = JSON.parse(localStorage.getItem('trade_store')) || {};

        if (!trade_type || !underlying) {
            return [];
        }
        let { trade_types } = getContractTypesConfig()[trade_type];
        const is_call_put = isCallPut(trade_type);
        if (is_call_put) {
            // treat CALLE/PUTE and CALL/PUT the same
            trade_types = ['CALLE', 'PUTE', 'CALL', 'PUT'];
        }
        return this.contracts
            .filter(c => c.contract_info.underlying === underlying)
            .filter(c => {
                const info = c.contract_info;
                const has_multiplier_contract_ended =
                    isMultiplierContract(info.contract_type) && isEnded(c.contract_info);
                // filter multiplier contract which has ended
                return !has_multiplier_contract_ended;
            })
            .filter(c => {
                const info = c.contract_info;

                const trade_type_is_supported = trade_types.indexOf(info.contract_type) !== -1;
                // both high_low & rise_fall have the same contract_types in POC response
                // entry_spot=barrier means it is rise_fall contract (blame the api)
                if (trade_type_is_supported && info.barrier && info.entry_tick && is_call_put) {
                    if (`${+info.entry_tick}` === `${+info.barrier}`) {
                        return trade_type === 'rise_fall' || trade_type === 'rise_fall_equal';
                    }
                    return trade_type === 'high_low';
                }
                return trade_type_is_supported;
            });
    };

    get has_crossed_accu_barriers() {
        const { symbol } = JSON.parse(localStorage.getItem('trade_store')) || {};
        const open_accu_contract_info =
            this.root_store.portfolio.active_positions.find(
                ({ type, contract_info: _contract_info }) =>
                    isAccumulatorContract(type) && _contract_info.underlying === symbol
            )?.contract_info || {};
        const { current_spot: contract_current_spot, entry_spot, underlying } = open_accu_contract_info;
        const data_for_non_calculated_barriers =
            (isAccumulatorContractOpen(open_accu_contract_info)
                ? this.accumulator_contract_barriers_data
                : this.accumulator_barriers_data) || {};
        const { accumulators_high_barrier, accumulators_low_barrier, current_spot } =
            (this.should_calculate_accu_barriers
                ? this.accumulator_barriers_data[symbol]
                : data_for_non_calculated_barriers) || {};
        return !!(
            current_spot &&
            accumulators_high_barrier &&
            accumulators_low_barrier &&
            (current_spot >= accumulators_high_barrier || current_spot <= accumulators_low_barrier) &&
            (!isAccumulatorContractOpen(open_accu_contract_info) ||
                (entry_spot && entry_spot !== contract_current_spot && underlying === symbol))
        );
    }

    get markers_array() {
        let markers = [];
        const { contract_type: trade_type, symbol } = JSON.parse(localStorage.getItem('trade_store')) || {};
        markers = this.applicable_contracts()
            .map(c => c.marker)
            .filter(m => m)
            .map(m => toJS(m));
        if (markers.length) {
            markers[markers.length - 1].is_last_contract = true;
        }
        const open_accu_contract_info =
            this.root_store.portfolio.active_positions.find(
                ({ type, contract_info: _contract_info }) =>
                    isAccumulatorContract(type) && _contract_info.underlying === symbol
            )?.contract_info || {};
        const { current_spot_time, entry_tick_time, exit_tick_time } = open_accu_contract_info;
        const data_for_non_calculated_barriers =
            (((isAccumulatorContractOpen(open_accu_contract_info) &&
                entry_tick_time &&
                entry_tick_time !== current_spot_time) ||
                (exit_tick_time && current_spot_time <= exit_tick_time)) &&
                (this.should_calculate_accu_barriers
                    ? this.accumulator_barriers_data?.[symbol]
                    : this.accumulator_contract_barriers_data.accumulators_high_barrier &&
                      this.accumulator_contract_barriers_data)) ||
            (this.should_calculate_accu_barriers
                ? this.accumulator_barriers_data?.[symbol]
                : this.accumulator_barriers_data) ||
            {};
        const { accumulators_high_barrier, accumulators_low_barrier, barrier_spot_distance, previous_spot_time } =
            data_for_non_calculated_barriers || {};
        if (trade_type === 'accumulator' && previous_spot_time && accumulators_high_barrier) {
            markers.push({
                type: 'TickContract',
                contract_info: {
                    accu_barriers_difference: barrier_spot_distance && {
                        top: `+${barrier_spot_distance}`,
                        bottom: `-${barrier_spot_distance}`,
                        font: isMobile() ? '10px IBM Plex Sans' : '14px IBM Plex Sans',
                    },
                    has_crossed_accu_barriers: this.has_crossed_accu_barriers,
                    is_accumulator_trade_without_contract:
                        !isAccumulatorContractOpen(open_accu_contract_info) || !entry_tick_time,
                },
                key: 'dtrader_accumulator_barriers',
                price_array: [accumulators_high_barrier, accumulators_low_barrier],
                epoch_array: [previous_spot_time],
            });
        }
        return markers;
    }

    addContract({
        barrier,
        contract_id,
        contract_type,
        start_time,
        longcode,
        underlying,
        is_tick_contract,
        limit_order = {},
    }) {
        const contract_exists = this.contracts_map[contract_id];
        if (contract_exists) {
            return;
        }

        const contract = new ContractStore(this.root_store, { contract_id });
        contract.populateConfig({
            date_start: start_time,
            barrier,
            contract_type,
            longcode,
            underlying,
            limit_order,
        });

        this.contracts.push(contract);
        this.contracts_map[contract_id] = contract;

        if (is_tick_contract && !this.root_store.portfolio.is_multiplier && this.granularity !== 0 && isDesktop()) {
            this.root_store.notifications.addNotificationMessage(switch_to_tick_chart);
        }
    }

    removeContract({ contract_id }) {
        this.contracts = this.contracts.filter(c => c.contract_id !== contract_id);
        delete this.contracts_map[contract_id];
    }

    accountSwitchListener() {
        if (this.has_error) {
            this.clearError();
        }

        return Promise.resolve();
    }

    onUnmount() {
        this.disposeSwitchAccount();
        // TODO: don't forget the tick history when switching to contract-replay-store
    }

    // Called from portfolio
    updateProposal(response) {
        if ('error' in response) {
            this.has_error = true;
            this.error_message = response.error.message;
            return;
        }
        // Update the contract-store corresponding to this POC
        if (response.proposal_open_contract) {
            const contract_id = +response.proposal_open_contract.contract_id;
            const contract = this.contracts_map[contract_id];
            contract.populateConfig(response.proposal_open_contract);
            if (response.proposal_open_contract.is_sold) {
                this.root_store.notifications.removeNotificationMessage(switch_to_tick_chart);
                contract.cacheProposalOpenContractResponse(response);
            }
        }
    }

    get last_contract() {
        const applicable_contracts = this.applicable_contracts();
        const length = applicable_contracts.length;
        return length > 0 ? applicable_contracts[length - 1] : {};
    }

    clearError() {
        this.error_message = '';
        this.has_error = false;
    }

    getContractById(contract_id) {
        return (
            this.contracts_map[contract_id] ||
            // or get contract from contract_replay store when user is on the contract details page
            this.root_store.contract_replay.contract_store
        );
    }
}

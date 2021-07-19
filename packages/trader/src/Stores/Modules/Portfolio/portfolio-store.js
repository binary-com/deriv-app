import throttle from 'lodash.throttle';
import { action, computed, observable, reaction } from 'mobx';
import { createTransformer } from 'mobx-utils';
import {
    isEmptyObject,
    isEnded,
    isUserSold,
    isValidToSell,
    isMultiplierContract,
    getCurrentTick,
    getDisplayStatus,
    WS,
} from '@deriv/shared';
import { formatPortfolioPosition } from './Helpers/format-response';
import { contractCancelled, contractSold } from './Helpers/portfolio-notifications';
import { getDurationPeriod, getDurationTime, getDurationUnitText } from './Helpers/details';
import { getEndTime } from '../Contract/Helpers/logic';

import BaseStore from '../../base-store';

export default class PortfolioStore extends BaseStore {
    @observable.shallow positions = [];
    @observable.shallow all_positions = [];
    positions_map = {};
    @observable is_loading = false;
    @observable error = '';
    getPositionById = createTransformer(id => this.positions.find(position => +position.id === +id));

    responseQueue = [];

    @observable.shallow active_positions = [];

    @action.bound
    initializePortfolio = async should_clear_table => {
        if (this.has_subscribed_to_poc_and_transaction || should_clear_table) {
            this.clearTable();
        }
        this.is_loading = true;
        await WS.wait('authorize');
        WS.portfolio().then(this.portfolioHandler);
        WS.subscribeProposalOpenContract(null, this.proposalOpenContractQueueHandler);
        WS.subscribeTransaction(this.transactionHandler);
        this.has_subscribed_to_poc_and_transaction = true;
    };

    @action.bound
    clearTable() {
        this.positions = [];
        this.positions_map = {};
        this.is_loading = false;
        this.error = '';
        this.updatePositions();
        if (this.has_subscribed_to_poc_and_transaction) {
            WS.forgetAll('proposal_open_contract', 'transaction');
        }
        this.has_subscribed_to_poc_and_transaction = false;
    }

    @action.bound
    portfolioHandler(response) {
        this.is_loading = false;
        if ('error' in response) {
            this.error = response.error.message;
            return;
        }
        this.error = '';
        if (response.portfolio.contracts) {
            this.positions = response.portfolio.contracts
                .map(pos => formatPortfolioPosition(pos, this.root_store.modules.trade.active_symbols))
                .sort((pos1, pos2) => pos2.reference - pos1.reference); // new contracts first

            this.positions.forEach(p => {
                this.positions_map[p.id] = p;
            });
            this.updatePositions();
        }
    }

    @action.bound
    onBuyResponse({ contract_id, longcode, contract_type }) {
        const new_pos = {
            contract_id,
            longcode,
            contract_type,
        };
        this.pushNewPosition(new_pos);
    }

    @action.bound
    async transactionHandler(response) {
        this.root_store.client.transactionResponseCall(response);
        if ('error' in response) {
            this.error = response.error.message;
        }
        if (!response.transaction) return;
        const { contract_id, action: act, longcode } = response.transaction;

        if (act === 'buy') {
            this.onBuyResponse({
                contract_id,
                longcode,
                contract_type: '', // TODO: figure out the icon not showing
            });
        } else if (act === 'sell') {
            const i = this.getPositionIndexById(contract_id);

            if (!this.positions[i]) {
                // On a page refresh, portfolio call has returend empty,
                // even though we we get a transaction.sell response.
                return;
            }
            this.positions[i].is_loading = true;

            // Sometimes when we sell a contract, we don't get `proposal_open_contract` message with exit information and status as `sold`.
            // This is to make sure that we get `proposal_open_contract` message with exit information and status as `sold`.
            const subscriber = WS.subscribeProposalOpenContract(contract_id, poc => {
                this.updateContractTradeStore(poc);
                this.updateContractReplayStore(poc);
                this.populateResultDetails(poc);
                subscriber.unsubscribe();
            });
        }
    }

    deepClone = obj => JSON.parse(JSON.stringify(obj));
    updateContractTradeStore(response) {
        const contract_trade = this.root_store.modules.contract_trade;
        const has_poc = !isEmptyObject(response.proposal_open_contract);
        const has_error = !!response.error;
        if (!has_poc && !has_error) return;
        if (has_poc) {
            contract_trade.addContract(this.deepClone(response.proposal_open_contract));
            contract_trade.updateProposal(this.deepClone(response));
        }
    }

    updateContractReplayStore(response) {
        const contract_replay = this.root_store.modules.contract_replay;
        if (contract_replay.contract_id === response.proposal_open_contract?.contract_id) {
            contract_replay.populateConfig(response);
        }
    }

    updateTradeStore(is_over, portfolio_position, is_limit_order_update) {
        const trade = this.root_store.modules.trade;
        if (!is_limit_order_update) {
            trade.setPurchaseSpotBarrier(is_over, portfolio_position);
        }
        trade.updateLimitOrderBarriers(is_over, portfolio_position);
    }

    proposalOpenContractQueueHandler = response => {
        this.responseQueue.push(response);
        this.throttledUpdatePositions();
    };

    @action.bound
    proposalOpenContractHandler(response) {
        if ('error' in response) {
            this.updateContractTradeStore(response);
            this.updateContractReplayStore(response);
            return;
        }

        const proposal = response.proposal_open_contract;
        const portfolio_position = this.positions_map[proposal.contract_id];

        if (!portfolio_position) return;
        this.updateContractTradeStore(response);
        this.updateContractReplayStore(response);

        const formatted_position = formatPortfolioPosition(
            proposal,
            this.root_store.modules.trade.active_symbols,
            portfolio_position.indicative
        );
        Object.assign(portfolio_position, formatted_position);

        const prev_indicative = portfolio_position.indicative;
        const new_indicative = +proposal.bid_price;
        const profit_loss = +proposal.profit;

        // fix for missing barrier and entry_spot in proposal_open_contract API response, only re-assign if valid
        if (proposal.barrier) portfolio_position.barrier = +proposal.barrier;
        if (proposal.entry_spot) portfolio_position.entry_spot = +proposal.entry_spot;

        // store contract proposal details that require modifiers
        portfolio_position.indicative = new_indicative;
        portfolio_position.profit_loss = profit_loss;
        portfolio_position.is_valid_to_sell = isValidToSell(proposal);

        // store contract proposal details that do not require modifiers
        portfolio_position.contract_info = proposal;

        // for tick contracts
        if (proposal.tick_count) {
            const current_tick =
                portfolio_position.current_tick > getCurrentTick(proposal)
                    ? portfolio_position.current_tick
                    : getCurrentTick(proposal);
            portfolio_position.current_tick = current_tick;
        }

        if (new_indicative > prev_indicative) {
            portfolio_position.status = 'profit';
        } else if (new_indicative < prev_indicative) {
            portfolio_position.status = 'loss';
        } else {
            portfolio_position.status = null;
        }

        if (this.hovered_position_id === portfolio_position.id) {
            if (portfolio_position.contract_info.is_sold === 1) {
                this.updateTradeStore(false, portfolio_position);
            } else {
                this.updateTradeStore(true, portfolio_position, true);
            }
        }

        if (portfolio_position.contract_info.is_sold === 1) {
            this.populateResultDetails(response);
        }
    }

    @action.bound
    onClickCancel(contract_id) {
        const i = this.getPositionIndexById(contract_id);
        if (this.positions[i].is_sell_requested) return;

        this.positions[i].is_sell_requested = true;
        if (contract_id) {
            WS.cancelContract(contract_id).then(response => {
                if (response.error) {
                    this.root_store.common.setServicesError({
                        type: response.msg_type,
                        ...response.error,
                    });
                } else {
                    this.root_store.ui.addNotificationMessage(contractCancelled());
                }
            });
        }
    }

    @action.bound
    onClickSell(contract_id) {
        const i = this.getPositionIndexById(contract_id);
        if (this.positions[i].is_sell_requested) return;

        const { bid_price } = this.positions[i].contract_info;
        this.positions[i].is_sell_requested = true;
        if (contract_id && typeof bid_price === 'number') {
            WS.sell(contract_id, bid_price).then(this.handleSell);
        }
    }

    @action.bound
    handleSell(response) {
        if (response.error) {
            // If unable to sell due to error, give error via pop up if not in contract mode
            const i = this.getPositionIndexById(response.echo_req.sell);
            this.positions[i].is_sell_requested = false;

            // invalidToken error will handle in socket-general.js
            if (response.error.code !== 'InvalidToken') {
                this.root_store.common.setServicesError({
                    type: response.msg_type,
                    ...response.error,
                });
            }
        } else if (!response.error && response.sell) {
            // update contract store sell info after sell
            this.root_store.modules.contract_trade.sell_info = {
                sell_price: response.sell.sold_for,
                transaction_id: response.sell.transaction_id,
            };
            this.root_store.ui.addNotificationMessage(
                contractSold(this.root_store.client.currency, response.sell.sold_for)
            );
        }
    }

    @action.bound
    populateResultDetails = response => {
        const contract_response = response.proposal_open_contract;
        const i = this.getPositionIndexById(contract_response.contract_id);

        if (!this.positions[i]) {
            return;
        }

        this.positions[i].contract_info = contract_response;
        this.positions[i].duration = getDurationTime(contract_response);
        this.positions[i].duration_unit = getDurationUnitText(getDurationPeriod(contract_response));
        this.positions[i].exit_spot = contract_response.exit_tick || contract_response.current_spot; // workaround if no exit_tick in proposal_open_contract, use latest spot
        this.positions[i].is_valid_to_sell = isValidToSell(contract_response);
        this.positions[i].result = getDisplayStatus(contract_response);
        this.positions[i].profit_loss = +contract_response.profit;
        this.positions[i].sell_time = getEndTime(contract_response) || contract_response.current_spot_time; // same as exit_spot, use latest spot time if no exit_tick_time
        this.positions[i].sell_price = contract_response.sell_price;
        this.positions[i].status = 'complete';

        // fix for missing barrier and entry_spot
        if (!this.positions[i].contract_info.barrier || !this.positions[i].contract_info.entry_spot) {
            this.positions[i].contract_info.barrier = this.positions[i].barrier;
            this.positions[i].contract_info.entry_spot = this.positions[i].entry_spot;
        }

        // remove exit_spot for manually sold contracts
        if (isUserSold(contract_response)) this.positions[i].exit_spot = '-';

        this.positions[i].is_loading = false;
    };

    @action.bound
    populateContractUpdate({ contract_update }, contract_id) {
        const position = this.getPositionById(contract_id);
        if (position) {
            Object.assign(position.contract_update, contract_update);
            this.updatePositions();
        }
    }

    @action.bound
    pushNewPosition(new_pos) {
        const position = formatPortfolioPosition(new_pos, this.root_store.modules.trade.active_symbols);
        if (this.positions_map[position.id]) return;

        this.positions.unshift(position);
        this.positions_map[position.id] = position;
        this.updatePositions();
    }

    @action.bound
    removePositionById(contract_id) {
        const contract_idx = this.getPositionIndexById(contract_id);

        this.positions.splice(contract_idx, 1);
        delete this.positions_map[contract_id];
        this.updatePositions();
        this.root_store.modules.contract_trade.removeContract({ contract_id });
    }

    async accountSwitcherListener() {
        await this.initializePortfolio(true);
        return Promise.resolve();
    }

    @action.bound
    onHoverPosition(is_over, position) {
        const { symbol: underlying } = this.root_store.modules.trade;
        if (
            position.contract_info.underlying !== underlying ||
            isEnded(position.contract_info) ||
            !isMultiplierContract(position.type)
        ) {
            return;
        }

        this.hovered_position_id = is_over ? position.id : null;
        this.updateTradeStore(is_over, position);
    }

    preSwitchAccountListener() {
        this.clearTable();

        return Promise.resolve();
    }

    @action.bound
    logoutListener() {
        this.clearTable();
        return Promise.resolve();
    }

    @action.bound
    networkStatusChangeListener(is_online) {
        this.is_loading = !is_online;
    }

    @action.bound
    onMount() {
        this.onPreSwitchAccount(this.preSwitchAccountListener);
        this.onSwitchAccount(this.accountSwitcherListener);
        this.onNetworkStatusChange(this.networkStatusChangeListener);
        this.onLogout(this.logoutListener);
        if (this.positions.length === 0 && !this.has_subscribed_to_poc_and_transaction) {
            // TODO: Optimise the way is_logged_in changes are detected for "logging in" and "already logged on" states
            if (this.root_store.client.is_logged_in) {
                this.initializePortfolio();
            } else {
                reaction(
                    () => this.root_store.client.is_logged_in,
                    () => {
                        if (this.root_store.client.is_logged_in) {
                            this.initializePortfolio();
                        }
                    }
                );
            }
        }
    }

    @action.bound
    onUnmount() {
        this.disposePreSwitchAccount();
        this.disposeSwitchAccount();
        this.disposeLogout();
    }

    getPositionIndexById(contract_id) {
        return this.positions.findIndex(pos => +pos.id === +contract_id);
    }

    @computed
    get totals() {
        let indicative = 0;
        let payout = 0;
        let purchase = 0;

        this.positions.forEach(portfolio_pos => {
            indicative += +portfolio_pos.indicative;
            payout += +portfolio_pos.payout;
            purchase += +portfolio_pos.purchase;
        });
        return {
            indicative,
            payout,
            purchase,
        };
    }

    @action.bound
    setActivePositions() {
        this.active_positions = this.positions.filter(portfolio_pos => !getEndTime(portfolio_pos.contract_info));
        this.all_positions = [...this.positions];
    }

    updatePositions = () => {
        this.responseQueue.forEach(res => this.proposalOpenContractHandler(res));
        this.responseQueue = [];
        this.setActivePositions();
    };

    throttledUpdatePositions = throttle(this.updatePositions, 500);

    @computed
    get is_active_empty() {
        return !this.is_loading && this.active_positions.length === 0;
    }

    @computed
    get active_positions_count() {
        return this.active_positions.length || 0;
    }

    @computed
    get is_empty() {
        return !this.is_loading && this.all_positions.length === 0;
    }
}

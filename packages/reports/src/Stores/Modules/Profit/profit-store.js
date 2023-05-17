import debounce from 'lodash.debounce';
import { action, computed, observable, makeObservable, override } from 'mobx';
import { toMoment, WS } from '@deriv/shared';

import getDateBoundaries from './Helpers/format-request';
import { formatProfitTableTransactions } from './Helpers/format-response';
import BaseStore from '../../base-store';

const batch_size = 50;
const delay_on_scroll_time = 150;

export default class ProfitTableStore extends BaseStore {
    data = [];
    date_from = null;
    date_to = toMoment().startOf('day').add(1, 'd').subtract(1, 's');
    error = '';
    has_loaded_all = false;
    is_loading = false;
    filtered_date_range;

    // `client_loginid` is only used to detect if this is in sync with the client-store, don't rely on
    // this for calculations. Use the client.currency instead.
    client_loginid = '';

    constructor({ root_store }) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super({ root_store });

        makeObservable(this, {
            data: observable,
            date_from: observable,
            date_to: observable,
            error: observable,
            has_loaded_all: observable,
            is_loading: observable,
            filtered_date_range: observable,
            client_loginid: observable,
            total_profit: computed,
            is_empty: computed,
            has_selected_date: computed,
            fetchNextBatch: action.bound,
            profitTableResponseHandler: action.bound,
            handleScroll: action.bound,
            networkStatusChangeListener: action.bound,
            onMount: action.bound,
            onUnmount: override,
            totals: computed,
            accountSwitcherListener: action.bound,
            clearTable: action.bound,
            clearDateFilter: action.bound,
            handleDateChange: action.bound,
        });
    }

    get total_profit() {
        return this.data.reduce((previous, current) => {
            const buy_price = Number(parseFloat(current.buy_price));
            const sell_price = Number(parseFloat(current.sell_price));
            const pl = sell_price - buy_price;
            return previous + pl;
        }, 0);
    }

    get is_empty() {
        return !this.is_loading && this.data.length === 0;
    }

    get has_selected_date() {
        return !!(this.date_from || this.date_to);
    }

    shouldFetchNextBatch() {
        if (this.has_loaded_all || this.is_loading) return false;
        return true;
    }

    async fetchNextBatch() {
        if (!this.shouldFetchNextBatch()) return;
        this.is_loading = true;

        const response = await WS.profitTable(
            batch_size,
            this.data.length,
            getDateBoundaries(this.date_from, this.date_to, 0, false)
        );

        this.profitTableResponseHandler(response);
    }

    profitTableResponseHandler(response) {
        if ('error' in response) {
            this.error = response.error.message;
            return;
        }

        const formatted_transactions = response.profit_table.transactions.map(transaction =>
            formatProfitTableTransactions(
                transaction,
                this.root_store.client.currency,
                this.root_store.active_symbols.active_symbols
            )
        );

        this.data = [...this.data, ...formatted_transactions];
        this.has_loaded_all = formatted_transactions.length < batch_size;
        this.is_loading = false;
    }

    fetchOnScroll = debounce(left => {
        if (left < 1500) {
            this.fetchNextBatch();
        }
    }, delay_on_scroll_time);

    handleScroll(event) {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const left_to_scroll = scrollHeight - (scrollTop + clientHeight);
        this.fetchOnScroll(left_to_scroll);
    }

    networkStatusChangeListener(is_online) {
        this.is_loading = !is_online;
    }

    async onMount() {
        this.assertHasValidCache(this.client_loginid, this.clearDateFilter, WS.forgetAll.bind(null, 'proposal'));
        this.client_loginid = this.root_store.client.loginid;
        this.onSwitchAccount(this.accountSwitcherListener);
        this.onNetworkStatusChange(this.networkStatusChangeListener);
        await WS.wait('authorize');

        /* Caching won't work for profit_table because date filtering happens based on `buy_time` of a contract.
        If we already have a cache for a period and if we sell a contract that was purchased in that period
        then the sold contract won't be there in profit_table when visited again unless we fetch it again.
        Caching will only work if the date filtering happens based on `sell_time` of a contract in BE. */
        this.clearTable();
        this.fetchNextBatch();
    }

    /* DO NOT call clearDateFilter() upon unmounting the component, date filters should stay
    as we change tab or click on any contract for later references as discussed with UI/UX and QA */
    onUnmount() {
        this.disposeSwitchAccount();
        WS.forgetAll('proposal');
    }

    get totals() {
        let profit_loss = 0;

        this.data.forEach(transaction => {
            profit_loss += parseFloat(transaction.profit_loss.replace(/,/g, ''));
        });
        return {
            profit_loss: profit_loss.toString(),
        };
    }

    accountSwitcherListener() {
        return new Promise(resolve => {
            this.clearTable();
            this.clearDateFilter();
            return resolve(this.fetchNextBatch());
        });
    }

    clearTable() {
        this.data = [];
        this.has_loaded_all = false;
        this.is_loading = false;
    }

    clearDateFilter() {
        this.date_from = null;
        this.date_to = toMoment().startOf('day').add(1, 'd').subtract(1, 's');
    }

    handleDateChange(date_values, { date_range } = {}) {
        this.filtered_date_range = date_range;
        this.date_from = date_values?.from ?? (date_values.is_batch ? null : this.date_from);
        this.date_to = date_values?.to ?? this.date_to;
        this.clearTable();
        this.fetchNextBatch();
    }
}

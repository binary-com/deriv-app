import debounce from 'lodash.debounce';
import { action, computed, observable, makeObservable, override } from 'mobx';
import { filterDisabledPositions, toMoment, WS } from '@deriv/shared';

import { formatStatementTransaction } from './Helpers/format-response';
import getDateBoundaries from '../Profit/Helpers/format-request';
import BaseStore from '../../base-store';

const batch_size = 100; // request response limit
const delay_on_scroll_time = 150; // fetch debounce delay on scroll

export default class StatementStore extends BaseStore {
    data = [];
    is_loading = true;
    has_loaded_all = false;
    date_from = null;
    date_to = toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix();
    error = '';
    action_type = 'all';
    filtered_date_range;

    // `client_loginid` is only used to detect if this is in sync with the client-store, don't rely on
    // this for calculations. Use the client.currency instead.
    client_loginid = '';

    account_statistics = {};

    constructor({ root_store }) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super({ root_store });

        makeObservable(this, {
            data: observable,
            is_loading: observable,
            has_loaded_all: observable,
            date_from: observable,
            date_to: observable,
            error: observable,
            action_type: observable,
            filtered_date_range: observable,
            client_loginid: observable,
            account_statistics: observable,
            is_empty: computed,
            has_selected_date: computed,
            clearTable: action.bound,
            clearDateFilter: action.bound,
            fetchNextBatch: action.bound,
            statementHandler: action.bound,
            handleDateChange: action.bound,
            handleFilterChange: action.bound,
            handleScroll: action.bound,
            accountSwitcherListener: action.bound,
            networkStatusChangeListener: action.bound,
            onMount: action.bound,
            onUnmount: override,
        });
    }

    get is_empty() {
        return !this.is_loading && this.data.length === 0;
    }

    get has_selected_date() {
        return !!(this.date_from || this.date_to);
    }

    clearTable() {
        this.data = [];
        this.has_loaded_all = false;
        this.is_loading = false;
    }

    clearDateFilter() {
        this.date_from = null;
        this.date_to = toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix();
        this.partial_fetch_time = 0;
    }

    shouldFetchNextBatch(should_load_partially) {
        if (!should_load_partially && (this.has_loaded_all || this.is_loading)) return false;
        const today = toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix();
        if (this.date_to < today) return !should_load_partially && this.partial_fetch_time;
        return true;
    }

    async fetchNextBatch(should_load_partially = false) {
        if (!this.shouldFetchNextBatch(should_load_partially)) return;
        this.is_loading = true;

        const optional_arguments = getDateBoundaries(
            this.date_from,
            this.date_to,
            this.partial_fetch_time,
            should_load_partially
        );

        if (this.action_type !== 'all') {
            optional_arguments.action_type = this.action_type;
        }

        const response = await WS.statement(
            batch_size,
            !should_load_partially ? this.data.length : undefined,
            optional_arguments
        );
        this.statementHandler(response, should_load_partially);
    }

    statementHandler(response, should_load_partially) {
        if ('error' in response) {
            this.error = response.error.message;
            return;
        }

        const formatted_transactions = response.statement.transactions
            .map(transaction =>
                formatStatementTransaction(
                    transaction,
                    this.root_store.client.currency,
                    this.root_store.active_symbols.active_symbols
                )
            )
            .filter(filterDisabledPositions);

        if (should_load_partially) {
            this.data = [...formatted_transactions, ...this.data];
        } else {
            this.data = [...this.data, ...formatted_transactions];
        }
        this.has_loaded_all = !should_load_partially && formatted_transactions.length < batch_size;
        this.is_loading = false;
        if (formatted_transactions.length > 0) {
            this.partial_fetch_time = toMoment().unix();
        }
    }

    handleDateChange(date_values, { date_range } = {}) {
        const { from, to, is_batch } = date_values;

        this.filtered_date_range = date_range;

        if (from) {
            this.date_from = toMoment(from).unix();
        } else if (is_batch) {
            this.date_from = null;
        }

        if (to) this.date_to = toMoment(to).unix();

        this.clearTable();
        this.fetchNextBatch();
    }

    handleFilterChange(filterValue = {}) {
        this.action_type = filterValue;
        this.clearTable();
        this.fetchNextBatch();
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

    accountSwitcherListener() {
        return new Promise(resolve => {
            this.clearTable();
            this.clearDateFilter();
            return resolve(this.fetchNextBatch());
        });
    }

    networkStatusChangeListener(is_online) {
        this.is_loading = this.is_loading || !is_online;
    }

    async onMount() {
        this.assertHasValidCache(
            this.client_loginid,
            this.clearDateFilter,
            this.client_loginid ? this.clearTable : () => null,
            WS.forgetAll.bind(null, 'proposal')
        );
        this.client_loginid = this.root_store.client.loginid;
        this.onSwitchAccount(this.accountSwitcherListener);
        this.onNetworkStatusChange(this.networkStatusChangeListener);
        await WS.wait('authorize');
        this.fetchNextBatch(true);
    }

    /* DO NOT call clearDateFilter() upon unmounting the component, date filters should stay
    as we change tab or click on any contract for later references as discussed with UI/UX and QA */
    onUnmount() {
        this.disposeSwitchAccount();
        WS.forgetAll('proposal');
    }
}

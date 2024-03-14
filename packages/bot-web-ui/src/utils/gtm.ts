import RootStore from 'Stores/root-store';
import { reaction } from 'mobx';
import { TStores, TCoreStores } from '@deriv/stores/types';
import { TStatistics } from 'Components/transaction-details/transaction-details.types';
import { TContractInfo } from 'Components/summary/summary-card.types';

type TGTM = {
    core: {
        client: {
            loginid: string;
        };
        server_time: {
            unix: () => number;
        };
        gtm: {
            pushDataLayer: (data: Record<string, unknown>) => void;
        };
    };
};

const GTM = (() => {
    let root_store: RootStore & TGTM;

    const getLoginId = (): string => {
        return root_store.core.client.loginid;
    };

    const getServerTime = (): number => {
        return root_store?.core?.server_time?.unix() || Date.now();
    };

    const pushDataLayer = (data: Record<string, unknown>): void => {
        return root_store?.core?.gtm?.pushDataLayer(data);
    };

    const init = (_root_store: RootStore & TStores & TCoreStores & { core: TGTM['core'] }): void => {
        try {
            root_store = _root_store;

            const { run_panel, transactions } = root_store;
            const run_statistics = run_panel.statistics;
            const active_loginid = getLoginId();

            reaction(
                () => run_panel.is_running,
                () => run_panel.is_running && onRunBot(run_statistics)
            );

            reaction(
                () => transactions.elements,
                () => {
                    const contract_data = transactions?.elements?.[active_loginid][0]?.data;
                    onTransactionClosed(contract_data);
                }
            );
        } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Error initializing GTM reactions ', error); // eslint-disable-line no-console
        }
    };

    const onRunBot = (statistics: TStatistics): void => {
        try {
            const run_id = `${getLoginId()}-${getServerTime()}`;
            const counters = `tr:${statistics.number_of_runs},\
                ts:${statistics.total_stake},\
                py:${statistics.total_payout},\
                lc:${statistics.lost_contracts},\
                wc:${statistics.won_contracts},\
                pr:${statistics.total_profit}`;

            const data = {
                counters: counters.replace(/\s/g, ''),
                event: 'dbot_run',
                run_id,
            };
            pushDataLayer(data);
        } catch (error) {
            console.warn('Error pushing run data to datalayer ', error); // eslint-disable-line no-console
        }
    };

    const onTransactionClosed = (contract: TContractInfo): void => {
        if (contract && contract.is_completed) {
            const data = {
                event: 'dbot_run_transaction',
                reference_id: contract.contract_id,
            };
            pushDataLayer(data);
        }
    };

    return {
        init,
        pushDataLayer,
        onTransactionClosed,
        onRunBot,
    };
})();

export default GTM;

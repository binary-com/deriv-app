import React from 'react';
import { useStore } from '@deriv/stores';
import ProfitStores from './Modules/Profit/profit-store';
import StatementStores from './Modules/Statement/statement-store';

type TOverrideProfitStore = Omit<ProfitStores, 'totals' | 'data'> & {
    data: { [key: string]: string }[];
    totals: { [key: string]: unknown };
};

type TOverrideStatementStore = Omit<
    StatementStores,
    | 'account_statistics'
    | 'action_type'
    | 'data'
    | 'date_from'
    | 'date_to'
    | 'filtered_date_range'
    | 'handleDateChange'
    | 'handleFilterChange'
    | 'handleScroll'
    | 'suffix_icon'
> & {
    account_statistics: { total_deposits: number; total_withdrawals: number };
    action_type: string;
    data: { [key: string]: string }[];
    date_from: number;
    date_to: number;
    filtered_date_range: {
        duration: number;
        label: string;
        onClick?: () => void;
        value?: string;
    };
    handleDateChange: () => void;
    handleFilterChange: () => void;
    handleScroll: React.UIEventHandler<HTMLDivElement>;
    suffix_icon: string;
};

type TReportsStore = {
    profit_table: TOverrideProfitStore;
    statement: TOverrideStatementStore;
};

const ReportsStoreContext = React.createContext<TReportsStore | null>(null);

export const ReportsStoreProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const root_store = useStore();
    const memoizedValue = React.useMemo(() => {
        return {
            profit_table: new ProfitStores({ root_store }),
            statement: new StatementStores({ root_store }),
        } as unknown as TReportsStore;
    }, [root_store]);

    return <ReportsStoreContext.Provider value={memoizedValue}>{children}</ReportsStoreContext.Provider>;
};

export const useReportsStore = () => {
    const store = React.useContext(ReportsStoreContext);

    if (!store) {
        throw new Error('useReportsStore must be used within ReportsStoreProvider');
    }

    return store;
};

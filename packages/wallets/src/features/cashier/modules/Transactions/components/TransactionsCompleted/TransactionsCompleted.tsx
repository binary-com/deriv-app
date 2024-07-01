import React, { useCallback, useEffect } from 'react';
import moment from 'moment';
import { useActiveWalletAccount, useAllAccountsList, useInfiniteTransactions } from '@deriv/api-v2';
import { TSocketRequestPayload } from '@deriv/api-v2/types';
import { Loader } from '@deriv-com/ui';
import { WalletText } from '../../../../../../components/Base';
import { useCashierScroll } from '../../../../context';
import { TransactionsCompletedRow } from '../TransactionsCompletedRow';
import { TransactionsNoDataState } from '../TransactionsNoDataState';
import { TransactionsTable } from '../TransactionsTable';
import './TransactionsCompleted.scss';

type TFilter = NonNullable<TSocketRequestPayload<'statement'>['payload']>['action_type'];

type TProps = {
    filter?: TFilter;
};

const TransactionsCompleted: React.FC<TProps> = ({ filter }) => {
    const {
        data: transactions,
        fetchNextPage,
        isFetching,
        isLoading: isTransactionListLoading,
        setFilter,
    } = useInfiniteTransactions();
    const { data: wallet, isLoading: isWalletLoading } = useActiveWalletAccount();
    const { data: accounts, isLoading: isAccountsListLoading } = useAllAccountsList();

    const isLoading = isTransactionListLoading || isWalletLoading || isAccountsListLoading;

    const { setOnCashierScroll } = useCashierScroll();

    const fetchMoreOnBottomReached = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            if (e && e.currentTarget) {
                const { clientHeight, scrollHeight, scrollTop } = e.currentTarget;
                // once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
                if (scrollHeight - scrollTop - clientHeight < 300 && !isFetching) {
                    fetchNextPage();
                }
            }
        },
        [fetchNextPage, isFetching]
    );

    useEffect(() => {
        if (Number(transactions?.length) > 0) setOnCashierScroll(() => fetchMoreOnBottomReached);
        return () => setOnCashierScroll(null);
    }, [fetchMoreOnBottomReached, setOnCashierScroll, transactions?.length]);

    useEffect(() => {
        setFilter(filter);
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!wallet || (!transactions && (isFetching || isLoading))) return <Loader />;

    if (!transactions) return <TransactionsNoDataState />;

    return (
        <TransactionsTable
            columns={[
                {
                    accessorFn: row => row.transaction_time && moment.unix(row.transaction_time).format('DD MMM YYYY'),
                    accessorKey: 'date',
                    header: 'Date',
                },
            ]}
            data={transactions}
            groupBy={['date']}
            rowGroupRender={transaction => (
                <div className='wallets-transactions-completed__group-title'>
                    <WalletText color='primary' size='2xs'>
                        {transaction.transaction_time &&
                            moment.unix(transaction.transaction_time).format('DD MMM YYYY')}
                    </WalletText>
                </div>
            )}
            rowRender={transaction => (
                <TransactionsCompletedRow accounts={accounts} transaction={transaction} wallet={wallet} />
            )}
        />
    );
};

export default TransactionsCompleted;

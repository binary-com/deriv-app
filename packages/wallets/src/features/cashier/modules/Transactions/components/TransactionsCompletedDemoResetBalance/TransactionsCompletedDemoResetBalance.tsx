import React, { useEffect } from 'react';
import { useActiveWalletAccount, useAllAccountsList, useTransactions } from '@deriv/api-v2';
import { Loader, Text } from '@deriv-com/ui';
import { getFormattedDateString } from '../../../../../../utils/utils';
import { TransactionsCompletedRow } from '../TransactionsCompletedRow';
import { TransactionsNoDataState } from '../TransactionsNoDataState';
import { TransactionsTable } from '../TransactionsTable';
import './TransactionsCompletedDemoResetBalance.scss';

const TransactionsCompletedDemoResetBalance: React.FC = () => {
    const {
        data: depositDemoTransactions,
        isLoading: isDemoDepositsListLoading,
        setFilter: setDepositFilter,
    } = useTransactions();
    const {
        data: withdrawalDemoTransactions,
        isLoading: isDemoWithdrawalsListLoading,
        setFilter: setWithdrawalFilter,
    } = useTransactions();
    const { data: wallet, isLoading: isWalletLoading } = useActiveWalletAccount();
    const { data: accounts, isLoading: isAccountsListLoading } = useAllAccountsList();

    useEffect(() => {
        setDepositFilter('deposit');
        setWithdrawalFilter('withdrawal');
    }, [setDepositFilter, setWithdrawalFilter]);

    const isLoading =
        isDemoDepositsListLoading || isDemoWithdrawalsListLoading || isWalletLoading || isAccountsListLoading;

    const resetBalanceTransactions = [...(depositDemoTransactions ?? []), ...(withdrawalDemoTransactions ?? [])].sort(
        (a, b) => (b.transaction_time ?? 0) - (a.transaction_time ?? 0)
    );

    if (!wallet || isLoading) return <Loader />;

    if (!resetBalanceTransactions.length) return <TransactionsNoDataState />;

    return (
        <TransactionsTable
            columns={[
                {
                    accessorFn: row =>
                        row.transaction_time &&
                        getFormattedDateString(
                            row.transaction_time,
                            { day: '2-digit', month: 'short', year: 'numeric' },
                            'DD MMM YYYY',
                            true
                        ),
                    accessorKey: 'date',
                    header: 'Date',
                },
            ]}
            data={resetBalanceTransactions}
            groupBy={['date']}
            rowGroupRender={transaction => (
                <div className='wallets-transactions-completed-demo-reset-balance__group-title'>
                    <Text color='primary' size='2xs'>
                        {transaction.transaction_time &&
                            getFormattedDateString(
                                transaction.transaction_time,
                                { day: '2-digit', month: 'short', year: 'numeric' },
                                'DD MMM YYYY',
                                true
                            )}
                    </Text>
                </div>
            )}
            rowRender={transaction => (
                <TransactionsCompletedRow accounts={accounts} transaction={transaction} wallet={wallet} />
            )}
        />
    );
};

export default TransactionsCompletedDemoResetBalance;

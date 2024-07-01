import React, { useEffect } from 'react';
import moment from 'moment';
import { useCryptoTransactions } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { WalletText } from '../../../../../../components/Base';
import { TransactionsNoDataState } from '../TransactionsNoDataState';
import { TransactionsPendingRow } from '../TransactionsPendingRow';
import { TransactionsTable } from '../TransactionsTable';
import './TransactionsPending.scss';

type TProps = {
    filter?: NonNullable<
        NonNullable<NonNullable<Parameters<ReturnType<typeof useCryptoTransactions>['subscribe']>>[0]>['payload']
    >['transaction_type'];
};

const TransactionsPending: React.FC<TProps> = ({ filter = 'all' }) => {
    const { data: transactions, isLoading, isSubscribed, resetData, subscribe, unsubscribe } = useCryptoTransactions();

    useEffect(() => {
        resetData();
        subscribe({ payload: { transaction_type: filter } });

        return () => unsubscribe();
    }, [filter, resetData, subscribe, unsubscribe]);

    if (!isSubscribed || isLoading) return <Loader />;

    if (!transactions) return <TransactionsNoDataState />;

    return (
        <div className='wallets-transactions-pending'>
            <TransactionsTable
                columns={[
                    {
                        accessorFn: row => moment.unix(row.submit_date).format('DD MMM YYYY'),
                        accessorKey: 'date',
                        header: 'Date',
                    },
                ]}
                data={transactions}
                groupBy={['date']}
                rowGroupRender={transaction => (
                    <div className='wallets-transactions-pending__group-title'>
                        <WalletText color='primary' size='2xs'>
                            {transaction.submit_date && moment.unix(transaction.submit_date).format('DD MMM YYYY')}
                        </WalletText>
                    </div>
                )}
                rowRender={transaction => <TransactionsPendingRow transaction={transaction} />}
            />
        </div>
    );
};

export default TransactionsPending;

import React, { useCallback, useEffect } from 'react';
import { useActiveWalletAccount, useCryptoTransactions } from '@deriv/api-v2';
import { Loader } from '../../../../components';
import { Divider, WalletText } from '../../../../components/Base';
import Warning from '../../../../public/images/warning.svg';
import { THooks } from '../../../../types';
import { TransactionStatusError } from './components/TransactionStatusError';
import { TransactionStatusSuccess } from './components/TransactionStatusSuccess';
import './TransactionStatus.scss';

type TTransactionStatus = {
    transactionType?: THooks.CryptoTransactions['transaction_type'];
};

const TransactionStatus: React.FC<TTransactionStatus> = ({ transactionType }) => {
    const {
        data: transactions,
        error: recentTransactionsError,
        isLoading: isTransactionsLoading,
        resetData,
        subscribe,
        unsubscribeAll,
    } = useCryptoTransactions();
    const {
        data: wallet,
        error: activeWalletAccountError,
        isLoading: isActiveWalletAccountLoading,
        refetch,
    } = useActiveWalletAccount();

    useEffect(() => {
        const unsubscribe = subscribe({ payload: { transaction_type: transactionType } });

        return () => unsubscribe?.();
    }, [subscribe, transactionType]);

    const isLoading = isTransactionsLoading || isActiveWalletAccountLoading;
    const isError = !!activeWalletAccountError || !!recentTransactionsError;
    const isTransactionStatusSuccessVisible = !isLoading && !isError && wallet;

    const refresh = useCallback(() => {
        unsubscribeAll();
        resetData();
        subscribe({ payload: { transaction_type: transactionType } });
        refetch();
    }, [refetch, resetData, subscribe, transactionType, unsubscribeAll]);

    return (
        <div className='wallets-transaction-status'>
            <div className='wallets-transaction-status__header'>
                <WalletText size='sm' weight='bold'>
                    Transaction status
                </WalletText>
                {isError && <Warning />}
            </div>
            <Divider color='#d6dadb' /> {/* --color-grey-5 */}
            <div className='wallets-transaction-status__body'>
                {!isError && isLoading && (
                    <div className='wallets-transaction-status__loader'>
                        <Loader />
                    </div>
                )}
                {isError && <TransactionStatusError refresh={refresh} />}
                {isTransactionStatusSuccessVisible && (
                    <TransactionStatusSuccess
                        transactionType={transactionType}
                        transactions={transactions || []}
                        wallet={wallet}
                    />
                )}
            </div>
        </div>
    );
};

export default TransactionStatus;

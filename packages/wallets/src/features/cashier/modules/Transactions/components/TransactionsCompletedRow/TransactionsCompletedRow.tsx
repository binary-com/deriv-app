import React, { useMemo } from 'react';
import { useActiveWalletAccount, useTransactions } from '@deriv/api';
import { WalletText } from '../../../../../../components/Base';
import { WalletCurrencyCard } from '../../../../../../components/WalletCurrencyCard';
import './TransactionsCompletedRow.scss';

type TProps = {
    transaction: NonNullable<ReturnType<typeof useTransactions>['data']>[number];
};

const TransactionsCompletedRow: React.FC<TProps> = ({ transaction }) => {
    const { data } = useActiveWalletAccount();
    const displayCode = useMemo(() => data?.currency_config?.display_code || 'USD', [data]);

    if (!transaction.action_type || !transaction.amount) return null;

    return (
        <div className='wallets-transactions-completed-row'>
            <div className='wallets-transactions-completed-row__account-details'>
                <WalletCurrencyCard currency={data?.currency || 'USD'} isDemo={data?.is_virtual} size='md' />
                <div className='wallets-transactions-completed-row__column'>
                    <WalletText color='primary' size='xs'>
                        {transaction.action_type.charAt(0).toUpperCase() + transaction.action_type.slice(1)}
                    </WalletText>
                    <WalletText color='general' size='xs' weight='bold'>
                        {displayCode} Wallet
                    </WalletText>
                </div>
            </div>
            <div className='wallets-transactions-completed-row__transaction-details'>
                <WalletText color={transaction.amount > 0 ? 'success' : 'red'} size='xs' weight='bold'>
                    {transaction.amount && transaction.amount > 0 ? '+' : ''}
                    {transaction.display_amount}
                </WalletText>
                <WalletText color='primary' size='2xs'>
                    Balance: {transaction.display_balance_after}
                </WalletText>
            </div>
        </div>
    );
};

export default TransactionsCompletedRow;

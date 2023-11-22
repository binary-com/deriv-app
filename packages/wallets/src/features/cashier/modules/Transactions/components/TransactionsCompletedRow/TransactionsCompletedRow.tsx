import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletText } from '../../../../../../components/Base';
import { THooks } from '../../../../../../types';
import { TransactionsCompletedRowAccountDetails } from './components/TransactionsCompletedRowAccountDetails';
import { TransactionsCompletedRowTransferAccountDetails } from './components/TransactionsCompletedRowTransferAccountDetails';
import './TransactionsCompletedRow.scss';

type TProps = {
    transaction: THooks.Transactions;
};

const TransactionsCompletedRow: React.FC<TProps> = ({ transaction }) => {
    const { data: wallet } = useActiveWalletAccount();

    if (!wallet || !transaction.action_type || !transaction.amount) return null;

    const displayCurrency = wallet?.currency_config?.display_code || 'USD';
    const displayWalletName = `${displayCurrency} Wallet`;

    return (
        <div className='wallets-transactions-completed-row'>
            {transaction.action_type !== 'transfer' ? (
                <TransactionsCompletedRowAccountDetails
                    accountType={wallet?.account_type ?? ''}
                    actionType={transaction.action_type}
                    currency={wallet?.currency ?? 'USD'}
                    displayAccountName={displayWalletName}
                    displayActionType={transaction.action_type.replace(/^\w/, c => c.toUpperCase())}
                    isDemo={Boolean(wallet?.is_virtual)}
                />
            ) : (
                <TransactionsCompletedRowTransferAccountDetails
                    direction={transaction.from?.loginid === wallet?.loginid ? 'to' : 'from'}
                    loginid={
                        [transaction.from?.loginid, transaction.to?.loginid].find(
                            loginid => loginid !== wallet?.loginid
                        ) ?? ''
                    }
                    wallet={wallet}
                />
            )}
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

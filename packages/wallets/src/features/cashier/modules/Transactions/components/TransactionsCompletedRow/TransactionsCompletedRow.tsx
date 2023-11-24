import React from 'react';
import { WalletText } from '../../../../../../components/Base';
import { THooks } from '../../../../../../types';
import { TransactionsCompletedRowAccountDetails } from './components/TransactionsCompletedRowAccountDetails';
import { TransactionsCompletedRowTransferAccountDetails } from './components/TransactionsCompletedRowTransferAccountDetails';
import './TransactionsCompletedRow.scss';

type TProps = {
    accounts: THooks.AllAccountsList;
    transaction: THooks.Transactions;
    wallet: THooks.ActiveWalletAccount;
};

const TransactionsCompletedRow: React.FC<TProps> = ({ accounts, transaction, wallet }) => {
    if (!transaction.action_type || !transaction.amount) return null;

    const displayCurrency = wallet?.currency_config?.display_code || 'USD';
    const displayWalletName = `${displayCurrency} Wallet`;

    // TODO: remove this once backend adds `to` and `from` for Deriv X transfers
    const dxtradeToFrom =
        transaction?.action_type === 'transfer' && transaction.longcode && transaction.longcode.includes('Deriv X')
            ? {
                  from: { loginid: wallet.loginid },
                  to: { loginid: wallet.loginid },
                  [transaction.longcode.split(' ')[1]]: { loginid: transaction.longcode.split(' ').pop() },
              }
            : null;

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
                    accounts={accounts}
                    direction={(transaction.from ?? dxtradeToFrom?.from)?.loginid === wallet?.loginid ? 'to' : 'from'}
                    loginid={
                        [
                            transaction.from?.loginid ?? dxtradeToFrom?.from.loginid,
                            transaction.to?.loginid ?? dxtradeToFrom?.to.loginid,
                        ].find(loginid => loginid !== wallet?.loginid) ?? ''
                    }
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

import React from 'react';
import { Statement } from '@deriv/api-types';
import { getCurrencyDisplayCode, isCryptocurrency, isMobile } from '@deriv/shared';
import { Text } from '@deriv/components';
import { useGroupedFiatTransactions } from '@deriv/hooks';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { getWalletCurrencyIcon } from 'Constants/utils';
import FiatTransactionListItem from './fiat-transaction-list-item';

const FiatTransactionList = () => {
    const store = useStore();
    const {
        client: { accounts, currency, loginid },
        traders_hub: { is_demo },
        ui: { is_dark_mode_on },
    } = store;
    const grouped_transactions = useGroupedFiatTransactions();

    const wallet_title = React.useMemo(() => {
        return `${is_demo ? localize('Demo') : ''} ${getCurrencyDisplayCode(currency)} ${localize('Wallet')}`;
    }, [currency, is_demo]);

    const TransactionsForADay = ({
        day,
        transactions,
    }: {
        day: string;
        transactions: Required<Statement>['transactions'];
    }) => {
        return (
            <div className='fiat-transaction-list__day'>
                <Text
                    size={isMobile() ? 'xxxxs' : 'xxxs'}
                    line_height={isMobile() ? 'm' : 's'}
                    color='less-prominent'
                    weight='lighter'
                >
                    {day}
                </Text>
                {transactions
                    .map(transaction => {
                        if (
                            transaction.amount === undefined ||
                            transaction.balance_after === undefined ||
                            transaction.action_type === undefined
                        )
                            return null;
                        let account_name = wallet_title;
                        let account_currency = currency;
                        let icon = getWalletCurrencyIcon(is_demo ? 'demo' : currency, is_dark_mode_on, false);
                        let icon_type = 'fiat';
                        if (transaction.action_type === 'transfer') {
                            const other_loginid =
                                transaction.to?.loginid === loginid
                                    ? transaction.from?.loginid
                                    : transaction.to?.loginid;
                            if (!other_loginid) return null;
                            const other_account = accounts[other_loginid];
                            if (!other_account) return null;
                            if (!other_account.currency) return null;
                            account_currency = other_account.currency;
                            const account_category = other_account.account_category === 'wallet' ? 'Wallet' : 'account';
                            account_name = `${other_account.is_virtual && 'Demo'} ${other_account.currency} ${localize(
                                account_category
                            )}`;
                            icon = getWalletCurrencyIcon(
                                other_account.is_virtual ? 'demo' : other_account.currency || '',
                                is_dark_mode_on,
                                false
                            );
                            icon_type = isCryptocurrency(account_currency) ? 'crypto' : 'fiat';
                        }
                        return (
                            <FiatTransactionListItem
                                key={transaction.transaction_id}
                                action_type={
                                    transaction.action_type as React.ComponentProps<
                                        typeof FiatTransactionListItem
                                    >['action_type']
                                }
                                account_currency={account_currency}
                                account_name={account_name}
                                amount={transaction.amount}
                                balance_after={transaction.balance_after}
                                currency={currency}
                                icon={icon}
                                icon_type={icon_type}
                            />
                        );
                    })
                    .filter(Boolean)}
            </div>
        );
    };

    return (
        <div className='fiat-transaction-list'>
            {Object.entries(grouped_transactions).map(([day, transactions]) => (
                <TransactionsForADay
                    key={day}
                    day={day}
                    transactions={transactions as Required<Statement>['transactions']}
                />
            ))}
        </div>
    );
};

export default FiatTransactionList;

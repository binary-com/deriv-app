import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize } from '@deriv-com/translations';
import { Button, Divider, Text } from '@deriv-com/ui';
import { THooks } from '../../../../../../types';
import { CryptoTransaction } from '../CryptoTransaction';

type TTransactionStatusSuccess = {
    transactionType?: THooks.CryptoTransactions['transaction_type'];
    transactions: THooks.CryptoTransactions[];
    wallet: THooks.ActiveWalletAccount;
};

const TransactionStatusSuccess: React.FC<TTransactionStatusSuccess> = ({ transactionType, transactions, wallet }) => {
    const history = useHistory();

    const filteredTransactions =
        transactions?.filter(
            el => !transactionType || (transactionType === 'deposit' ? el.is_deposit : el.is_withdrawal)
        ) || [];

    return (
        <React.Fragment>
            {filteredTransactions?.length > 0 ? (
                <React.Fragment>
                    {filteredTransactions?.slice(0, 3).map((transaction, index) => (
                        <React.Fragment key={transaction.id}>
                            <CryptoTransaction
                                currency={wallet.currency || ''}
                                currencyDisplayCode={wallet.currency_config?.code || ''}
                                currencyDisplayFraction={wallet.currency_config?.fractional_digits || 0}
                                key={transaction.id}
                                transaction={transaction}
                            />
                            <Divider
                                color={
                                    index < filteredTransactions.length - 1 && index < 2
                                        ? 'var(--wallets-banner-border-color)'
                                        : 'var(--general-active)'
                                }
                            />
                        </React.Fragment>
                    ))}
                    {filteredTransactions.length > 3 && (
                        <Button
                            borderWidth='sm'
                            color='black'
                            isFullWidth
                            onClick={() => {
                                // should navigate to transactions page with "Pending transactions" toggle on and filter set to `transactionType`
                                history.push('/wallet/transactions', {
                                    showPending: true,
                                    transactionType,
                                });
                            }}
                            size='sm'
                            variant='outlined'
                        >
                            <Localize i18n_default_text='View more' />
                        </Button>
                    )}
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Text align='start' size='sm'>
                        <Localize i18n_default_text='No recent transactions.' />
                    </Text>
                    <Divider />
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default TransactionStatusSuccess;

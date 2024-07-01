import React from 'react';
import { useHistory } from 'react-router-dom';
import { Divider } from '@deriv-com/ui';
import { WalletButton, WalletText } from '../../../../../../components/Base';
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
                        <WalletButton
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
                            View more
                        </WalletButton>
                    )}
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <WalletText size='sm'>No recent transactions.</WalletText>
                    <Divider />
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default TransactionStatusSuccess;

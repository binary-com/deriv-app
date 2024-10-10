import React, { useState } from 'react';
import classNames from 'classnames';
import { useDebounceCallback } from 'usehooks-ts';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Divider, Text } from '@deriv-com/ui';
import { WalletClipboard, WalletMoney } from '../../../../../../components';
import { THooks } from '../../../../../../types';
import parseCryptoLongcode from '../../../../../../utils/parse-crypto-longcode';
import { getTransactionLabels } from '../../constants';
import { TransactionsCompletedRowAccountDetails, TransactionsCompletedRowTransferAccountDetails } from './components';
import './TransactionsCompletedRow.scss';

type TProps = {
    accounts: THooks.AllAccountsList;
    transaction: THooks.InfiniteTransactions | THooks.Transactions;
    wallet: THooks.ActiveWalletAccount;
};

type TTransactionsCompletedRowContentProps = TProps & {
    displayNonTransferActionType: string;
    displayTransferActionType: string;
    displayWalletName: string;
    shouldShowTraceId: boolean;
};

const TransactionsCompletedRowContent: React.FC<TTransactionsCompletedRowContentProps> = ({
    accounts,
    displayNonTransferActionType,
    displayTransferActionType,
    displayWalletName,
    shouldShowTraceId,
    transaction,
    wallet,
}) => {
    const { action_type: actionType, longcode = '', transaction_id: transactionId } = transaction;
    const { account_type: accountType = '', currency = 'USD', is_virtual: isVirtual } = wallet;
    const { addressHash, blockchainHash, splitLongcode } = parseCryptoLongcode(longcode);
    let descriptions = [longcode];

    if (addressHash || blockchainHash) {
        descriptions = splitLongcode?.map(
            description => `${description[0].toLocaleUpperCase()}${description.slice(1)}`
        );
    }
    if (shouldShowTraceId && transaction.longcode) {
        return (
            <Text align='center' as='div'>
                {descriptions.map((description, index) => {
                    return (
                        <React.Fragment key={description}>
                            <Text align='center' as='p' lineHeight='xs' size='xs'>
                                {description}
                            </Text>
                            <div>
                                {blockchainHash && index === descriptions.length - 1 && (
                                    <WalletClipboard popoverAlignment='top' textCopy={blockchainHash} />
                                )}
                                {addressHash &&
                                    transaction.action_type === 'withdrawal' &&
                                    index === descriptions.length - 1 && (
                                        <WalletClipboard popoverAlignment='top' textCopy={addressHash} />
                                    )}
                            </div>
                        </React.Fragment>
                    );
                })}
            </Text>
        );
    }
    return (
        <>
            {actionType && actionType !== 'transfer' ? (
                <TransactionsCompletedRowAccountDetails
                    accountType={accountType}
                    actionType={actionType}
                    currency={currency}
                    displayAccountName={displayWalletName}
                    displayActionType={displayNonTransferActionType}
                    isDemo={Boolean(isVirtual)}
                    transactionID={transactionId}
                />
            ) : (
                <TransactionsCompletedRowTransferAccountDetails
                    accounts={accounts}
                    displayActionType={displayTransferActionType}
                    loginid={
                        [transaction.from?.loginid, transaction.to?.loginid].find(
                            loginid => loginid !== wallet?.loginid
                        ) ?? ''
                    }
                    transactionID={transaction.transaction_id}
                />
            )}
            <div className='wallets-transactions-completed-row__transaction-details'>
                <Text
                    color={transaction.amount && transaction.amount > 0 ? 'success' : 'error'}
                    size='xs'
                    weight='bold'
                >
                    <WalletMoney amount={transaction.amount} currency={currency} hasSign />
                </Text>
                <Text color='primary' size='2xs'>
                    <Localize
                        i18n_default_text='Balance: {{balance}}'
                        values={{
                            balance: transaction.display_balance_after,
                        }}
                    />
                </Text>
            </div>
        </>
    );
};

const TransactionsCompletedRow: React.FC<TProps> = ({ accounts, transaction, wallet }) => {
    const { localize } = useTranslations();
    const [shouldShowTraceId, setShouldShowTraceId] = useState(false);
    const debouncedSetShouldShowTraceId = useDebounceCallback(() => setShouldShowTraceId(false), 5000);

    if (!transaction.action_type || !transaction.amount) return null;

    const displayCurrency = wallet?.currency_config?.display_code || 'USD';
    const displayWalletName = localize('{{currency}} Wallet', { currency: displayCurrency });
    const displayNonTransferActionType =
        wallet.is_virtual && ['deposit', 'withdrawal'].includes(transaction.action_type)
            ? getTransactionLabels(localize).reset_balance
            : //@ts-expect-error we only need partial action types
              getTransactionLabels(localize)[transaction.action_type];
    const displayTransferActionType =
        transaction.from?.loginid === wallet?.loginid ? localize('Transfer to') : localize('Transfer from');

    const handleRowClick = () => {
        setShouldShowTraceId(!shouldShowTraceId);
        debouncedSetShouldShowTraceId();
    };

    return (
        <React.Fragment>
            <Divider color='var(--border-divider)' />
            <div
                className={classNames('wallets-transactions-completed-row', {
                    'wallets-transactions-completed-row--active': shouldShowTraceId,
                })}
                onClick={handleRowClick}
                onKeyDown={handleRowClick}
            >
                <TransactionsCompletedRowContent
                    accounts={accounts}
                    displayNonTransferActionType={displayNonTransferActionType}
                    displayTransferActionType={displayTransferActionType}
                    displayWalletName={displayWalletName}
                    shouldShowTraceId={shouldShowTraceId}
                    transaction={transaction}
                    wallet={wallet}
                />
            </div>
        </React.Fragment>
    );
};

export default TransactionsCompletedRow;

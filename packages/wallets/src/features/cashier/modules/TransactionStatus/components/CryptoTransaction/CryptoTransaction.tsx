import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useCancelCryptoTransaction } from '@deriv/api-v2';
import { LegacyClose1pxIcon } from '@deriv/quill-icons';
import { getTruncatedString } from '@deriv/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { WalletMoney } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import { THooks } from '../../../../../../types';
import { getFormattedDateString } from '../../../../../../utils/utils';
import { WalletActionModal } from '../../../../components/WalletActionModal';
import { getFormattedConfirmations, getStatusName } from '../../../../helpers/transaction-helpers';
import './CryptoTransaction.scss';

type TCryptoTransaction = {
    currency: THooks.ActiveAccount['currency'];
    currencyDisplayCode: THooks.CurrencyConfig['code'];
    currencyDisplayFraction?: THooks.CurrencyConfig['fractional_digits'];
    // TODO: Remove transaction_fee from transaction type once API is updated
    /* eslint-disable-next-line camelcase */
    transaction: THooks.CryptoTransactions & { transaction_fee?: number };
};

const CryptoTransaction: React.FC<TCryptoTransaction> = ({
    currency,
    currencyDisplayCode,
    currencyDisplayFraction,
    transaction,
}) => {
    const { hide, show } = useModal();
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const formattedTransactionHash = transaction.transaction_hash
        ? getTruncatedString(transaction.transaction_hash, { type: 'middle' })
        : localize('Pending');
    const formattedAddressHash = transaction.address_hash
        ? getTruncatedString(transaction.address_hash, { type: 'middle' })
        : localize('NA');
    const formattedConfirmations = getFormattedConfirmations(transaction.confirmations, transaction.status_code);

    const { mutate } = useCancelCryptoTransaction();

    const cancelTransaction = useCallback(() => {
        mutate({ payload: { id: transaction.id } });
        hide();
    }, [hide, mutate, transaction.id]);

    const onCancelTransactionButtonClick = useCallback(() => {
        show(
            <WalletActionModal
                actionButtonsOptions={[
                    {
                        onClick: hide,
                        text: localize("No, don't cancel"),
                    },
                    {
                        isPrimary: true,
                        onClick: cancelTransaction,
                        text: localize('Yes, cancel'),
                    },
                ]}
                description={localize('Are you sure you want to cancel this transaction?')}
                hideCloseButton
                title={localize('Cancel transaction')}
            />,
            {
                defaultRootId: 'wallets_modal_root',
            }
        );
    }, [cancelTransaction, hide, localize, show]);

    return (
        <div className='wallets-crypto-transaction'>
            <div className='wallets-crypto-transaction__type-and-status'>
                <Text align='start' lineHeight='sm' size='xs'>
                    {transaction.is_deposit ? (
                        <Localize i18n_default_text='Deposit {{currency}}' values={{ currency: currencyDisplayCode }} />
                    ) : (
                        <Localize
                            i18n_default_text='Withdrawal {{currency}}'
                            values={{ currency: currencyDisplayCode }}
                        />
                    )}
                </Text>
                <div className='wallets-crypto-transaction__status'>
                    <div
                        className={classNames(
                            'wallets-crypto-transaction__status__dot',
                            `wallets-crypto-transaction__status__dot--${transaction.status_code
                                .toLowerCase()
                                .replace('_', '-')}`
                        )}
                    />
                    <Text align='start' lineHeight='2xs' size='2xs'>
                        {getStatusName(transaction.status_code)}
                    </Text>
                    {!!transaction.is_valid_to_cancel && isDesktop && (
                        <button
                            className='wallets-crypto-transaction__cancel-button'
                            data-testid='dt-wallets-crypto-transactions-cancel-button'
                            onClick={onCancelTransactionButtonClick}
                        >
                            <LegacyClose1pxIcon iconSize='xs' />
                        </button>
                    )}
                </div>
            </div>
            <div className='wallets-crypto-transaction__amount-and-date'>
                <Text align='start' color='less-prominent' size='2xs'>
                    <WalletMoney amount={transaction.amount} currency={currency} />
                </Text>
                <Text align='start' color='less-prominent' size='2xs'>
                    {getFormattedDateString(
                        transaction.submit_date,
                        { day: 'numeric', month: 'short', year: 'numeric' },
                        undefined,
                        true
                    )}
                </Text>
            </div>
            {transaction?.transaction_fee && (
                <Text align='start' color='less-prominent' lineHeight='xs' size='2xs'>
                    <Localize
                        i18n_default_text='Transaction fee: {{fee}} {{currency}}'
                        values={{
                            currency: currencyDisplayCode,
                            fee: Number(transaction.transaction_fee).toFixed(currencyDisplayFraction),
                        }}
                    />
                </Text>
            )}
            <Text align='start' lineHeight='2xs' size='2xs'>
                <Localize
                    components={[
                        <a
                            className='wallets-crypto-transaction__red-text'
                            href={transaction.address_url}
                            key={0}
                            rel='noopener noreferrer'
                            target='_blank'
                        />,
                    ]}
                    i18n_default_text='Address: <0>{{address}}</0>'
                    values={{ address: formattedAddressHash }}
                />
            </Text>
            <Text align='start' lineHeight='2xs' size='2xs'>
                <Localize
                    components={[
                        <a
                            className='wallets-crypto-transaction__red-text'
                            href={transaction.transaction_url}
                            key={0}
                            rel='noopener noreferrer'
                            target='_blank'
                        />,
                    ]}
                    i18n_default_text='Transaction hash: <0>{{hash}}</0>'
                    values={{ hash: formattedTransactionHash }}
                />
            </Text>
            {transaction.is_deposit && (
                <div>
                    <Text align='start' lineHeight='2xs' size='2xs'>
                        <Localize
                            components={[<span className='wallets-crypto-transaction__red-text' key={0} />]}
                            i18n_default_text='Confirmations: <0>{{confirmations}}</0>'
                            values={{ confirmations: formattedConfirmations }}
                        />
                    </Text>
                </div>
            )}
            {!!transaction.is_valid_to_cancel && !isDesktop && (
                <div className='wallets-crypto-transaction__cancel-button-container'>
                    <Button
                        borderWidth='sm'
                        color='black'
                        data-testid='dt-wallets-crypto-transactions-cancel-button'
                        onClick={onCancelTransactionButtonClick}
                        size='sm'
                        variant='outlined'
                    >
                        <Localize i18n_default_text='Cancel transaction' />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CryptoTransaction;

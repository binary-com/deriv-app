import React, { useCallback } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useCancelCryptoTransaction } from '@deriv/api-v2';
import { LegacyClose1pxIcon } from '@deriv/quill-icons';
import { WalletButton, WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import useDevice from '../../../../../../hooks/useDevice';
import { THooks } from '../../../../../../types';
import { WalletActionModal } from '../../../../components/WalletActionModal';
import './CryptoTransaction.scss';

type TCryptoTransaction = {
    currencyDisplayCode: THooks.CurrencyConfig['code'];
    transaction: THooks.CryptoTransactions;
};

const CryptoTransaction: React.FC<TCryptoTransaction> = ({ currencyDisplayCode: currency, transaction }) => {
    const { hide, show } = useModal();
    const { isMobile } = useDevice();

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
                        text: "No, don't cancel",
                    },
                    {
                        isPrimary: true,
                        onClick: cancelTransaction,
                        text: 'Yes, cancel',
                    },
                ]}
                description='Are you sure you want to cancel this transaction?'
                hideCloseButton={true}
                title='Cancel transaction'
            />,
            {
                defaultRootId: 'wallets_modal_root',
            }
        );
    }, [cancelTransaction, hide, show]);

    return (
        <div className='wallets-crypto-transaction'>
            <div className='wallets-crypto-transaction__type-and-status'>
                <WalletText lineHeight='sm' size='xs'>
                    {transaction.is_deposit ? `Deposit ${currency}` : `Withdrawal ${currency}`}
                </WalletText>
                <div className='wallets-crypto-transaction__status'>
                    <div
                        className={classNames(
                            'wallets-crypto-transaction__status__dot',
                            `wallets-crypto-transaction__status__dot--${transaction.status_code
                                .toLowerCase()
                                .replace('_', '-')}`
                        )}
                    />
                    <WalletText lineHeight='2xs' size='2xs'>
                        {transaction.status_name}
                    </WalletText>
                    {!!transaction.is_valid_to_cancel && !isMobile && (
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
                <WalletText color='less-prominent' size='2xs'>
                    {transaction.formatted_amount}
                </WalletText>
                <WalletText color='less-prominent' size='2xs'>
                    {moment.unix(transaction.submit_date).utc().format('MMM D, YYYY')}
                </WalletText>
            </div>
            <WalletText lineHeight='2xs' size='2xs'>
                Address:{' '}
                <a
                    className='wallets-crypto-transaction__red-text'
                    href={transaction.address_url}
                    rel='noopener noreferrer'
                    target='_blank'
                >
                    {transaction.formatted_address_hash}
                </a>
            </WalletText>
            <WalletText lineHeight='2xs' size='2xs'>
                Transaction hash:{' '}
                <a
                    className='wallets-crypto-transaction__red-text'
                    href={transaction.transaction_url}
                    rel='noopener noreferrer'
                    target='_blank'
                >
                    {transaction.formatted_transaction_hash}
                </a>
            </WalletText>
            {transaction.is_deposit && (
                <div>
                    <WalletText lineHeight='2xs' size='2xs'>
                        Confirmations:{' '}
                        <span className='wallets-crypto-transaction__red-text'>
                            {transaction.formatted_confirmations}
                        </span>
                    </WalletText>
                </div>
            )}
            {!!transaction.is_valid_to_cancel && isMobile && (
                <div className='wallets-crypto-transaction__cancel-button-container'>
                    <WalletButton
                        data-testid='dt-wallets-crypto-transactions-cancel-button'
                        onClick={onCancelTransactionButtonClick}
                        size='sm'
                        variant='outlined'
                    >
                        Cancel transaction
                    </WalletButton>
                </div>
            )}
        </div>
    );
};

export default CryptoTransaction;

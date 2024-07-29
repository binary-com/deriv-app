import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useActiveWalletAccount, useCancelCryptoTransaction } from '@deriv/api-v2';
import { LegacyClose1pxIcon } from '@deriv/quill-icons';
import { Button, Divider, Tooltip, useDevice } from '@deriv-com/ui';
import { WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import { WalletCurrencyCard } from '../../../../../../components/WalletCurrencyCard';
import { THooks } from '../../../../../../types';
import { WalletActionModal } from '../../../../components/WalletActionModal';
import { TransactionsPendingRowField } from './components/TransactionsPendingRowField';
import './TransactionsPendingRow.scss';

type TProps = {
    transaction: THooks.CryptoTransactions;
};

const TransactionsPendingRow: React.FC<TProps> = ({ transaction }) => {
    const { data } = useActiveWalletAccount();
    const { isDesktop } = useDevice();
    const displayCode = useMemo(() => data?.currency_config?.display_code || 'USD', [data]);
    const modal = useModal();

    const { mutate } = useCancelCryptoTransaction();

    const cancelTransaction = useCallback(() => {
        mutate({ payload: { id: transaction.id } });
        modal.hide();
    }, [modal, mutate, transaction.id]);

    const onCancelButtonClick = useCallback(() => {
        modal.show(
            <WalletActionModal
                actionButtonsOptions={[
                    {
                        onClick: modal.hide,
                        text: "No, don't cancel",
                    },
                    {
                        isPrimary: true,
                        onClick: cancelTransaction,
                        text: 'Yes, cancel',
                    },
                ]}
                description='Are you sure you want to cancel this transaction?'
                hideCloseButton
                title='Cancel transaction'
            />,
            { defaultRootId: 'wallets_modal_root' }
        );
    }, [cancelTransaction, modal]);

    const onMobileStatusClick = useCallback(() => {
        if (!isDesktop) {
            modal.show(
                <WalletActionModal
                    actionButtonsOptions={[
                        {
                            isPrimary: true,
                            onClick: modal.hide,
                            text: 'Ok',
                        },
                    ]}
                    description={transaction.description}
                    hideCloseButton
                    title='Transaction details'
                />,
                { defaultRootId: 'wallets_modal_root' }
            );
        }
    }, [isDesktop, modal, transaction.description]);

    return (
        <React.Fragment>
            <Divider color='var(--border-divider)' />
            <div className='wallets-transactions-pending-row'>
                <div className='wallets-transactions-pending-row__wallet-info'>
                    <WalletCurrencyCard currency={data?.currency || 'USD'} isDemo={data?.is_virtual} size='md' />
                    <div className='wallets-transactions-pending-row__column'>
                        <WalletText color='primary' size='xs'>
                            {transaction.transaction_type.charAt(0).toUpperCase() +
                                transaction.transaction_type.slice(1)}
                        </WalletText>
                        <WalletText color='general' size='xs' weight='bold'>
                            {displayCode} Wallet
                        </WalletText>
                    </div>
                </div>
                <div className='wallets-transactions-pending-row__fields-container'>
                    <TransactionsPendingRowField
                        className={{ 'wallets-transactions-pending-row__transaction-hash': isDesktop }}
                        hint={
                            transaction.transaction_url
                                ? {
                                      link: transaction.transaction_url,
                                      text: 'View transaction hash on Blockchain',
                                      tooltipAlignment: 'right',
                                  }
                                : undefined
                        }
                        name='Transaction hash'
                        value={transaction.formatted_transaction_hash}
                    />
                    <TransactionsPendingRowField
                        className={{ 'wallets-transactions-pending-row__transaction-address': isDesktop }}
                        hint={{
                            link: transaction.address_url,
                            text: 'View address on Blockchain',
                            tooltipAlignment: 'right',
                        }}
                        name='Address'
                        value={transaction.formatted_address_hash}
                    />
                    <TransactionsPendingRowField
                        className={{ 'wallets-transactions-pending-row__transaction-confirmations': isDesktop }}
                        name='Confirmations'
                        value={transaction.formatted_confirmations.toString()}
                    />
                    {!isDesktop && (
                        <React.Fragment>
                            <TransactionsPendingRowField
                                name='Amount'
                                value={`${transaction.is_deposit ? '+' : '-'}${transaction.formatted_amount}`}
                                valueTextProps={{
                                    color: transaction.is_deposit ? 'success' : 'red',
                                }}
                            />
                            <TransactionsPendingRowField
                                name='Date'
                                value={moment.unix(transaction.submit_date).format('DD MMM YYYY')}
                                valueTextProps={{
                                    color: 'general',
                                }}
                            />
                        </React.Fragment>
                    )}
                    <TransactionsPendingRowField
                        className={{ 'wallets-transactions-pending-row__transaction-time': isDesktop }}
                        name='Time'
                        value={moment
                            .unix(transaction.submit_date)
                            .utc()
                            .format(isDesktop ? 'DD MMM YYYY HH:mm:ss [GMT]' : 'HH:mm:ss [GMT]')}
                        valueTextProps={{
                            color: 'general',
                            size: isDesktop ? '2xs' : 'xs',
                            weight: isDesktop ? 'regular' : 'bold',
                        }}
                    />
                    {isDesktop && (
                        <div className='wallets-transactions-pending-row__transaction-amount'>
                            <WalletText
                                align='right'
                                color={transaction.is_deposit ? 'success' : 'red'}
                                size='sm'
                                weight='bold'
                            >
                                {transaction.is_deposit ? '+' : '-'}
                                {transaction.formatted_amount}
                            </WalletText>
                        </div>
                    )}
                </div>
                <div className='wallets-transactions-pending-row__transaction-status'>
                    <Tooltip
                        as='button'
                        className='wallets-transactions-pending-row__transaction-status-button'
                        data-testid='dt_transaction_status_button'
                        hideTooltip={!isDesktop}
                        onClick={onMobileStatusClick}
                        tooltipContent={transaction.description}
                        tooltipPosition='left'
                    >
                        <div
                            className={classNames(
                                'wallets-transactions-pending-row__transaction-status-dot',
                                `wallets-transactions-pending-row__transaction-status-dot--${transaction.status_code
                                    .toLowerCase()
                                    .replace('_', '-')}`
                            )}
                        />
                        <WalletText color='general' size='sm'>
                            {transaction.status_name}
                        </WalletText>
                    </Tooltip>
                    {isDesktop && !!transaction.is_valid_to_cancel && (
                        <button
                            className='wallets-transactions-pending-row__transaction-cancel-button'
                            onClick={onCancelButtonClick}
                        >
                            <LegacyClose1pxIcon iconSize='xs' />
                        </button>
                    )}
                </div>

                {!isDesktop && !!transaction.is_valid_to_cancel && (
                    <Button
                        borderWidth='sm'
                        color='black'
                        isFullWidth
                        onClick={onCancelButtonClick}
                        size='sm'
                        variant='outlined'
                    >
                        Cancel transaction
                    </Button>
                )}
            </div>
        </React.Fragment>
    );
};

export default TransactionsPendingRow;

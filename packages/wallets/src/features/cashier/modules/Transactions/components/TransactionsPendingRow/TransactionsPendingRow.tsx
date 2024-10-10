import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useActiveWalletAccount, useCancelCryptoTransaction } from '@deriv/api-v2';
import { LegacyClose1pxIcon } from '@deriv/quill-icons';
import { getTruncatedString } from '@deriv/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Divider, Text, Tooltip, useDevice } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import { WalletCurrencyCard, WalletMoney } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import useIsRtl from '../../../../../../hooks/useIsRtl';
import { THooks } from '../../../../../../types';
import { WalletActionModal } from '../../../../components/WalletActionModal';
import {
    getFormattedConfirmations,
    getStatusDescription,
    getStatusName,
} from '../../../../helpers/transaction-helpers';
import { getTransactionLabels } from '../../constants';
import { TransactionsPendingRowField } from './components/TransactionsPendingRowField';
import './TransactionsPendingRow.scss';

type TProps = {
    transaction: THooks.CryptoTransactions;
};

const TransactionsPendingRow: React.FC<TProps> = ({ transaction }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const displayCode = useMemo(() => activeWallet?.currency_config?.display_code || 'USD', [activeWallet]);
    const modal = useModal();
    const isRtl = useIsRtl();
    const formattedTransactionHash = transaction.transaction_hash
        ? getTruncatedString(transaction.transaction_hash, { type: 'middle' })
        : localize('Pending');
    const formattedAddressHash = transaction.address_hash
        ? getTruncatedString(transaction.address_hash, { type: 'middle' })
        : localize('NA');
    const formattedConfirmations = getFormattedConfirmations(transaction.confirmations, transaction.status_code);
    const statusDescription = getStatusDescription(transaction.transaction_type, transaction.status_code);
    const tooltipAlignment = isRtl ? 'left' : 'right';

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
            { defaultRootId: 'wallets_modal_root' }
        );
    }, [cancelTransaction, localize, modal]);

    const onMobileStatusClick = useCallback(() => {
        if (!isDesktop) {
            modal.show(
                <WalletActionModal
                    actionButtonsOptions={[
                        {
                            isPrimary: true,
                            onClick: modal.hide,
                            text: localize('Ok'),
                        },
                    ]}
                    description={statusDescription}
                    hideCloseButton
                    title={localize('Transaction details')}
                />,
                { defaultRootId: 'wallets_modal_root' }
            );
        }
    }, [isDesktop, localize, modal, statusDescription]);

    return (
        <React.Fragment>
            <Divider color='var(--border-divider)' />
            <div className='wallets-transactions-pending-row'>
                <div className='wallets-transactions-pending-row__wallet-info'>
                    <WalletCurrencyCard
                        currency={activeWallet?.currency || 'USD'}
                        isDemo={activeWallet?.is_virtual}
                        size='md'
                    />
                    <div className='wallets-transactions-pending-row__column'>
                        <Text align='start' color='primary' size='xs'>
                            {getTransactionLabels(localize)[transaction.transaction_type]}
                        </Text>
                        <Text align='start' color='general' size='xs' weight='bold'>
                            {displayCode} Wallet
                        </Text>
                    </div>
                </div>
                <div className='wallets-transactions-pending-row__fields-container'>
                    <TransactionsPendingRowField
                        className={{ 'wallets-transactions-pending-row__transaction-hash': isDesktop }}
                        hint={
                            transaction.transaction_url
                                ? {
                                      link: transaction.transaction_url,
                                      text: localize('View transaction hash on Blockchain'),
                                      tooltipAlignment,
                                  }
                                : undefined
                        }
                        name={localize('Transaction hash')}
                        value={formattedTransactionHash}
                    />
                    <TransactionsPendingRowField
                        className={{ 'wallets-transactions-pending-row__transaction-address': isDesktop }}
                        hint={{
                            link: transaction.address_url,
                            text: localize('View address on Blockchain'),
                            tooltipAlignment,
                        }}
                        name={localize('Address')}
                        value={formattedAddressHash}
                    />
                    <TransactionsPendingRowField
                        className={{ 'wallets-transactions-pending-row__transaction-confirmations': isDesktop }}
                        name={localize('Confirmations')}
                        value={formattedConfirmations}
                    />
                    {!isDesktop && (
                        <React.Fragment>
                            <TransactionsPendingRowField
                                name={localize('Amount')}
                                value={
                                    <WalletMoney
                                        amount={
                                            transaction.is_deposit ? transaction.amount : -(transaction.amount || 0)
                                        }
                                        currency={activeWallet?.currency}
                                        hasSign
                                    />
                                }
                                valueTextProps={{
                                    color: transaction.is_deposit ? 'success' : 'red',
                                }}
                            />
                            <TransactionsPendingRowField
                                name={localize('Date')}
                                value={FormatUtils.getFormattedDateString(transaction.submit_date, {
                                    dateOptions: { day: '2-digit', month: 'short', year: 'numeric' },
                                    unix: true,
                                })}
                                valueTextProps={{
                                    color: 'general',
                                }}
                            />
                        </React.Fragment>
                    )}
                    <TransactionsPendingRowField
                        className={{ 'wallets-transactions-pending-row__transaction-time': isDesktop }}
                        name={localize('Time')}
                        value={`${
                            isDesktop &&
                            `${FormatUtils.getFormattedDateString(transaction.submit_date, { unix: true })} `
                        }${FormatUtils.getFormattedTimeString(transaction.submit_date, true)}`}
                        valueTextProps={{
                            color: 'general',
                            size: isDesktop ? '2xs' : 'xs',
                            weight: isDesktop ? 'regular' : 'bold',
                        }}
                    />
                    {isDesktop && (
                        <div className='wallets-transactions-pending-row__transaction-amount'>
                            <Text
                                align='end'
                                color={transaction.is_deposit ? 'success' : 'red'}
                                size='sm'
                                weight='bold'
                            >
                                <WalletMoney
                                    amount={transaction.is_deposit ? transaction.amount : -(transaction.amount || 0)}
                                    currency={activeWallet?.currency}
                                    hasSign
                                />
                            </Text>
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
                        tooltipContent={statusDescription}
                        tooltipPosition={isRtl ? 'right' : 'left'}
                    >
                        <div
                            className={classNames(
                                'wallets-transactions-pending-row__transaction-status-dot',
                                `wallets-transactions-pending-row__transaction-status-dot--${transaction.status_code
                                    .toLowerCase()
                                    .replace('_', '-')}`
                            )}
                        />
                        <Text align='start' color='general' size='sm'>
                            {getStatusName(transaction.status_code)}
                        </Text>
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
                        <Localize i18n_default_text='Cancel transaction' />
                    </Button>
                )}
            </div>
        </React.Fragment>
    );
};

export default TransactionsPendingRow;

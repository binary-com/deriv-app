import React from 'react';
import classNames from 'classnames';
import { Button, Icon, Money, Popover, Table, Text } from '@deriv/components';
import { epochToMoment, formatMoney, isMobileOrTablet } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import { getStatus } from '../../constants/transaction-status';
import { useCashierStore } from '../../stores/useCashierStores';
import type { TSocketResponse } from '@deriv/api/types';

type TTransactionsCryptoRendererProps = {
    row: NonNullable<TSocketResponse<'cashier_payments'>['cashier_payments']>['crypto'][number];
    onTooltipClick: VoidFunction;
};

const TransactionsCryptoRenderer = observer(({ row: crypto, onTooltipClick }: TTransactionsCryptoRendererProps) => {
    const { client } = useStore();
    const { transaction_history } = useCashierStore();
    const { cancelCryptoTransaction, showTransactionsCryptoCancelModal, showTransactionsCryptoStatusModal } =
        transaction_history;
    const { currency } = client;

    const {
        address_hash,
        address_url,
        amount,
        id,
        is_valid_to_cancel,
        status_code,
        submit_date,
        transaction_hash,
        transaction_url,
        transaction_type,
        confirmations,
    } = crypto;
    const formatted_address_hash = address_hash
        ? `${address_hash.substring(0, 4)}....${address_hash.substring(address_hash.length - 4)}`
        : '';
    const formatted_amount = transaction_type === 'withdrawal' ? `-${amount}` : `+${amount}`;
    const formatted_submit_date = isMobileOrTablet()
        ? epochToMoment(submit_date).format('DD MMM YYYY')
        : epochToMoment(submit_date).format('DD MMM YYYY HH:mm:ss [GMT]');
    const formatted_submit_time = epochToMoment(submit_date).format('HH:mm:ss [GMT]');
    const status = getStatus(transaction_hash, transaction_type, status_code, confirmations);

    const [is_transaction_clicked, setTransactionClicked] = React.useState(false);
    const onClickCancel = () => {
        setTransactionClicked(true);
    };
    const onClickNo = () => {
        setTransactionClicked(false);
    };
    const cancelTransaction = () => {
        setTransactionClicked(false);
        cancelCryptoTransaction(id);
    };
    const onClickCancelTransaction = () => {
        showTransactionsCryptoCancelModal(id);
    };
    const onClickStatus = () => {
        if (status) showTransactionsCryptoStatusModal(status.description, status.name);
    };

    const is_third_party_transaction = transaction_url?.includes('CP:');

    if (status && isMobileOrTablet()) {
        return (
            <div>
                <Table.Row className='transactions-crypto-history__table-row'>
                    <Table.Cell className='transactions-crypto-history__table-cell'>
                        <Icon
                            icon={transaction_type === 'withdrawal' ? 'IcCashierWithdrawal' : 'IcCashierDeposit'}
                            size={32}
                        />
                        <Text as='p' size='xs' weight='bold' className='transactions-crypto-history__table-type'>
                            <Localize i18n_default_text={transaction_type} />
                        </Text>
                        <div
                            className='transactions-crypto-history__table-status'
                            onClick={onClickStatus}
                            data-testid='dt_table_status'
                        >
                            <div
                                className={classNames(
                                    'transactions-crypto-history__table-status-code',
                                    `transactions-crypto-history__table-status-code-${status.renderer}`
                                )}
                            />
                            <Text as='p' size='xxs'>
                                {status.name}
                            </Text>
                        </div>
                    </Table.Cell>
                    <Table.Cell>
                        <Text as='p' color='prominent' size='xxs' weight='bold'>
                            {localize('Amount')}
                        </Text>
                    </Table.Cell>
                    <Table.Cell className='transactions-crypto-history__table-amount'>
                        <Text
                            as='p'
                            size='xxs'
                            weight='bold'
                            color={status.renderer === 'successful' ? 'profit-success' : 'red'}
                        >
                            <Money
                                currency={currency}
                                amount={formatMoney(currency, formatted_amount, true)}
                                should_format={false}
                                show_currency
                            />
                        </Text>
                    </Table.Cell>
                    <Table.Cell>
                        <Text as='p' color='prominent' size='xxs' weight='bold'>
                            {localize('Address')}
                        </Text>
                    </Table.Cell>
                    <Table.Cell className='transactions-crypto-history__table-hash'>
                        <a
                            className='transactions-crypto-history__table-link'
                            href={address_url}
                            rel='noopener noreferrer'
                            target='_blank'
                        >
                            <Text as='p' size='xxs' color='red'>
                                {address_hash}
                            </Text>
                        </a>
                    </Table.Cell>
                    <Table.Cell>
                        <Text as='p' color='prominent' size='xxs' weight='bold'>
                            {localize('Transaction hash')}
                        </Text>
                        {is_third_party_transaction && (
                            <Icon
                                className='transactions-crypto-history__table-tooltip'
                                data_testid='dt_transactions_crypto_history_table_tooltip_mobile'
                                onClick={onTooltipClick}
                                icon='IcHelpCentre'
                                custom_color='var(--button-secondary-default)'
                            />
                        )}
                    </Table.Cell>
                    <Table.Cell className='transactions-crypto-history__table-hash'>
                        <a
                            className='transactions-crypto-history__table-link'
                            href={transaction_url}
                            rel='noopener noreferrer'
                            target='_blank'
                        >
                            <Text as='p' size='xxs' color='red'>
                                {status.transaction_hash}
                            </Text>
                        </a>
                    </Table.Cell>
                    <Table.Cell>
                        <Text as='p' color='prominent' size='xxs' weight='bold'>
                            {localize('Confirmations')}
                        </Text>
                    </Table.Cell>
                    <Table.Cell>
                        <Text as='p' size='xxs' color='red'>
                            {status.confirmation_label}
                        </Text>
                    </Table.Cell>
                    <Table.Cell>
                        <Text as='p' color='prominent' size='xxs' weight='bold'>
                            {localize('Time')}
                        </Text>
                    </Table.Cell>
                    <Table.Cell className='transactions-crypto-history__table-time'>
                        <Text as='p' size='xxs'>
                            {formatted_submit_date}
                        </Text>
                        <div className='transactions-crypto-history__bullet' />
                        <Text as='p' size='xxs'>
                            {formatted_submit_time}
                        </Text>
                    </Table.Cell>
                    <Table.Cell className='transactions-crypto-history__table-action'>
                        {is_valid_to_cancel === 1 && (
                            <Button
                                onClick={onClickCancelTransaction}
                                small
                                secondary
                                data-testid='dt_cancel_transaction'
                            >
                                <Text as='p' size='xxxs' weight='bolder'>
                                    <Localize i18n_default_text='Cancel transaction' />
                                </Text>
                            </Button>
                        )}
                    </Table.Cell>
                </Table.Row>
            </div>
        );
    }

    return (
        <div>
            <Table.Row className='transactions-crypto-history__table-row'>
                <Table.Cell className='transactions-crypto-history__table-type'>
                    <Icon
                        icon={transaction_type === 'withdrawal' ? 'IcCashierWithdrawal' : 'IcCashierDeposit'}
                        size={32}
                    />
                    <Text as='p' size='xs' weight='bold'>
                        <Localize i18n_default_text={transaction_type} />
                    </Text>
                </Table.Cell>
                <Table.Cell className='transactions-crypto-history__table-amount'>
                    {status && (
                        <Text
                            as='p'
                            size='xs'
                            weight='bold'
                            color={status.renderer === 'successful' ? 'profit-success' : 'red'}
                        >
                            <Money
                                currency={currency}
                                amount={formatMoney(currency, formatted_amount, true)}
                                should_format={false}
                                show_currency
                            />
                        </Text>
                    )}
                </Table.Cell>
                <Table.Cell className='transactions-crypto-history__table-hash'>
                    <Popover
                        alignment='right'
                        className='transactions-crypto-history__table-popover'
                        message={localize('View address on Blockchain')}
                    >
                        <a
                            className='transactions-crypto-history__table-link'
                            href={address_url}
                            rel='noopener noreferrer'
                            target='_blank'
                        >
                            <Text as='p' size='xs' color='red'>
                                {formatted_address_hash}
                            </Text>
                        </a>
                    </Popover>
                </Table.Cell>
                <Table.Cell className='transactions-crypto-history__table-hash'>
                    {status &&
                        (transaction_url ? (
                            <>
                                <Popover
                                    alignment='right'
                                    className='transactions-crypto-history__table-popover'
                                    message={localize('View transaction on Blockchain')}
                                >
                                    <a
                                        className='transactions-crypto-history__table-link'
                                        href={transaction_url}
                                        rel='noopener noreferrer'
                                        target='_blank'
                                    >
                                        <Text as='p' size='xs' color='red'>
                                            {status.transaction_hash}
                                        </Text>
                                    </a>
                                </Popover>
                                {is_third_party_transaction && (
                                    <Popover
                                        alignment='right'
                                        className='transactions-crypto-history__table-tooltip'
                                        data_testid='dt_transactions_crypto_history_table_tooltip'
                                        message={localize('The details of this transaction is available on CoinsPaid.')}
                                    >
                                        <Icon icon='IcHelpCentre' custom_color='var(--button-secondary-default)' />
                                    </Popover>
                                )}
                            </>
                        ) : (
                            <Text as='p' size='xs' color='red'>
                                {status.transaction_hash}
                            </Text>
                        ))}
                </Table.Cell>
                {!is_transaction_clicked && (
                    <Table.Cell className='transactions-crypto-history__table-confirmations'>
                        <Text as='p' size='xs' color='red'>
                            {status?.confirmation_label}
                        </Text>
                    </Table.Cell>
                )}
                {!is_transaction_clicked && (
                    <Table.Cell>
                        <Text as='p' size='xs'>
                            {formatted_submit_date}
                        </Text>
                    </Table.Cell>
                )}
                {!is_transaction_clicked && (
                    <Table.Cell className='transactions-crypto-history__table-status'>
                        {status && (
                            <Popover
                                alignment='left'
                                className='transactions-crypto-history__table-popover'
                                message={status.description}
                            >
                                <div
                                    className={classNames(
                                        'transactions-crypto-history__table-status-code',
                                        `transactions-crypto-history__table-status-code-${status.renderer}`
                                    )}
                                />
                                <Text as='p' size='xs'>
                                    {status.name}
                                </Text>
                            </Popover>
                        )}
                    </Table.Cell>
                )}
                {is_transaction_clicked ? (
                    <Table.Cell className='transactions-crypto-history__table-confirm'>
                        <div>
                            <Text as='p' color='prominent' size='xxs'>
                                {localize('Are you sure you want to cancel this transaction?')}
                            </Text>
                            <Button onClick={cancelTransaction} primary text={localize('Yes')} />
                            <Button onClick={onClickNo} secondary text={localize('No')} />
                        </div>
                    </Table.Cell>
                ) : (
                    <Table.Cell className='transactions-crypto-history__table-action'>
                        {is_valid_to_cancel === 1 && (
                            <div onClick={onClickCancel} data-testid='dt_transactions_crypto_history_table_button'>
                                <Popover
                                    alignment='left'
                                    className='transactions-crypto-history__table-popover'
                                    message={localize('Cancel transaction')}
                                >
                                    <Icon icon='IcCrossLight' size={10} />
                                </Popover>
                            </div>
                        )}
                    </Table.Cell>
                )}
            </Table.Row>
        </div>
    );
});

export default TransactionsCryptoRenderer;

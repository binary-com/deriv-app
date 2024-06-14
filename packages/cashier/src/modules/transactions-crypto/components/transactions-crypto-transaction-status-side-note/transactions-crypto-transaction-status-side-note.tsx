import React, { useCallback } from 'react';
import { Button, Loading, SideNote, Text } from '@deriv/components';
import { useCryptoTransactions, useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import classNames from 'classnames';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { cryptoTransactionMapper } from '../../helpers';
import './transactions-crypto-transaction-status-side-note.scss';

const TransactionsCryptoTransactionStatusSideNote: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile_or_tablet } = ui;
    const { transaction_history } = useCashierStore();
    const { setIsTransactionsCryptoVisible } = transaction_history;
    const { last_transaction, has_transactions, isLoading, error, subscribe } = useCryptoTransactions();
    const currency_config = useCurrentCurrencyConfig();

    const TransactionDetail = useCallback(() => {
        if (!last_transaction) return null;

        const {
            is_deposit,
            status_color,
            status_name,
            amount,
            submit_date_display,
            address_url_display,
            confirmation_display,
            transaction_hash_display,
        } = cryptoTransactionMapper(last_transaction);

        return (
            <>
                <div className='transactions-crypto-transaction-status-side-note__content'>
                    <Text size={'xxs'}>
                        {is_deposit
                            ? localize('Deposit {{currency}}', { currency: currency_config?.display_code })
                            : localize('Withdrawal {{currency}}', { currency: currency_config?.display_code })}
                    </Text>
                    <Text
                        size={'xxxs'}
                        color={'less-prominent'}
                        className='transactions-crypto-transaction-status-side-note__date'
                    >
                        {localize('{{amount}} {{currency}} on {{date}}', {
                            amount,
                            currency: currency_config?.display_code,
                            date: submit_date_display,
                        })}
                    </Text>
                    <Text size={'xxxs'}>
                        <Localize
                            i18n_default_text='Address: <0>{{value}}</0>'
                            values={{ value: address_url_display }}
                            components={[<Text key={0} size={'xxxs'} color={'red'} />]}
                        />
                    </Text>
                    <Text size={'xxxs'}>
                        <Localize
                            i18n_default_text='Transaction hash: <0>{{value}}</0>'
                            values={{ value: transaction_hash_display }}
                            components={[<Text key={0} size={'xxxs'} color={'red'} />]}
                        />
                    </Text>
                    {is_deposit && (
                        <Text size={'xxxs'}>
                            <Localize
                                i18n_default_text='Confirmations: <0>{{value}}</0>'
                                values={{ value: confirmation_display }}
                                components={[<Text key={0} size={'xxxs'} color={'red'} />]}
                            />
                        </Text>
                    )}
                    <div className='transactions-crypto-transaction-status-side-note__status'>
                        <div
                            className={classNames(
                                'transactions-crypto-transaction-status-side-note__status-dot',
                                `transactions-crypto-transaction-status-side-note__status-dot-${status_color}`
                            )}
                        />
                        <Text size={'xxxs'}>{status_name}</Text>
                    </div>
                </div>
                <div className='transactions-crypto-transaction-status-side-note__divider' />
                <Button
                    text={localize('View more')}
                    onClick={() => setIsTransactionsCryptoVisible(true)}
                    secondary
                    small
                    className='transactions-crypto-transaction-status-side-note__button'
                />
            </>
        );
    }, [currency_config?.display_code, last_transaction, setIsTransactionsCryptoVisible]);

    const LoadingState = useCallback(() => <Loading is_fullscreen={false} />, []);

    const ErrorState = useCallback(
        () => (
            <>
                <Text size={is_mobile_or_tablet ? 'xxs' : 'xs'}>
                    {localize('Unfortunately, we cannot retrieve the information at this time. ')}
                </Text>
                <div className='transactions-crypto-transaction-status-side-note__divider' />
                <Button
                    text={localize('Refresh')}
                    onClick={() => subscribe()}
                    secondary
                    small
                    className='transactions-crypto-transaction-status-side-note__button'
                />
            </>
        ),
        [is_mobile_or_tablet, subscribe]
    );

    const NoTransactionState = useCallback(
        () => (
            <>
                <Text size={is_mobile_or_tablet ? 'xxs' : 'xs'}>{localize('No recent transactions.')}</Text>
                <div className='transactions-crypto-transaction-status-side-note__divider' />
            </>
        ),
        [is_mobile_or_tablet]
    );

    return (
        <SideNote type={error ? 'warning' : undefined} title={localize('Transaction status')}>
            <div className='transactions-crypto-transaction-status-side-note'>
                <div className='transactions-crypto-transaction-status-side-note__divider' />
                {isLoading && <LoadingState />}
                {!isLoading && !error && has_transactions && <TransactionDetail />}
                {!isLoading && !error && !has_transactions && <NoTransactionState />}
                {error ? <ErrorState /> : <></>}
            </div>
        </SideNote>
    );
});

export default TransactionsCryptoTransactionStatusSideNote;

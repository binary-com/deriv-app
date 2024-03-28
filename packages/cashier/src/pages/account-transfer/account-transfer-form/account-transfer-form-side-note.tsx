import React, { useCallback, useEffect } from 'react';
import { GetLimits } from '@deriv/api-types';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useActiveAccount, useCurrencyConfig } from '@deriv/api';
import { addComma, getCurrencyDisplayCode, getPlatformSettings } from '@deriv/shared';
import { useExchangeRate } from '@deriv/hooks';

type TAccountTransferNoteProps = {
    allowed_transfers_amount: GetLimits['daily_cumulative_amount_transfers'];
    allowed_transfers_count: GetLimits['daily_transfers'];
    currency: string;
    is_cumulative_transfers_enabled: boolean;
    is_dxtrade_allowed: boolean;
    is_dxtrade_transfer?: boolean;
    is_mt_transfer?: boolean;
    minimum_fee: string | null;
    transfer_fee?: number | null;
};

const AccountTransferBullet = ({ children }: React.PropsWithChildren) => (
    <div className='account-transfer-form__bullet-wrapper'>
        <div className='account-transfer-form__bullet' />
        <Text size='xxs'>{children}</Text>
    </div>
);

const AccountTransferNote = ({
    allowed_transfers_amount,
    allowed_transfers_count,
    currency,
    is_cumulative_transfers_enabled,
    is_dxtrade_allowed,
    is_dxtrade_transfer,
    is_mt_transfer,
    minimum_fee,
    transfer_fee,
}: TAccountTransferNoteProps) => {
    const { handleSubscription, exchange_rates } = useExchangeRate();
    const { getConfig } = useCurrencyConfig();
    const { data: active_account } = useActiveAccount();
    const active_account_currency = active_account?.currency;
    const currency_config = getConfig(currency);
    const selected_account_currency = currency_config?.display_code;
    const fractional_digits = currency_config?.fractional_digits;
    const exchange_rate =
        selected_account_currency && active_account_currency != null
            ? exchange_rates?.[active_account_currency]?.[selected_account_currency] || 1
            : 1;
    const platform_name_dxtrade = getPlatformSettings('dxtrade').name;
    const platform_name_mt5 = getPlatformSettings('mt5').name;
    const platform_name_ctrader = getPlatformSettings('ctrader').name;

    useEffect(() => {
        if (selected_account_currency && active_account_currency) {
            handleSubscription(active_account_currency, selected_account_currency);
        }
    }, [selected_account_currency, active_account_currency, exchange_rate, handleSubscription]);

    const getCountTransferFeeNote = useCallback(() => {
        if (transfer_fee === 0) {
            return is_dxtrade_allowed ? (
                <Localize
                    i18n_default_text='We do not charge a transfer fee for transfers in the same currency between your Deriv fiat and {{platform_name_mt5}} accounts, between your Deriv fiat and {{platform_name_ctrader}} accounts, and between your Deriv fiat and {{platform_name_dxtrade}} accounts.'
                    values={{ platform_name_dxtrade, platform_name_mt5, platform_name_ctrader }}
                />
            ) : (
                <Localize
                    i18n_default_text='You’ll not be charged a transfer fee for transfers in the same currency between your Deriv fiat and {{platform_name_mt5}} accounts.'
                    values={{ platform_name_mt5 }}
                />
            );
        } else if (transfer_fee === 1) {
            return is_dxtrade_allowed ? (
                <Localize
                    i18n_default_text='We’ll charge a 1% transfer fee for transfers in different currencies between your Deriv fiat and {{platform_name_mt5}} accounts and between your Deriv fiat and {{platform_name_dxtrade}} accounts.'
                    values={{ platform_name_dxtrade, platform_name_mt5 }}
                />
            ) : (
                <Localize
                    i18n_default_text='We’ll charge a 1% transfer fee for transfers in different currencies between your Deriv fiat and {{platform_name_mt5}} accounts.'
                    values={{ platform_name_mt5 }}
                />
            );
        } else if (transfer_fee === 2 && (is_mt_transfer || is_dxtrade_transfer)) {
            return is_dxtrade_allowed ? (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv cryptocurrency and Deriv MT5 accounts and between your Deriv cryptocurrency and {{platform_name_dxtrade}} accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                        platform_name_dxtrade,
                    }}
                />
            ) : (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv cryptocurrency and Deriv MT5 accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        } else if (transfer_fee === 2 && !is_mt_transfer && !is_dxtrade_transfer) {
            return (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv fiat and Deriv cryptocurrency accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        } else if (transfer_fee === 2) {
            return (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv cryptocurrency accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        }
        return null;
    }, [
        currency,
        is_dxtrade_allowed,
        is_dxtrade_transfer,
        is_mt_transfer,
        minimum_fee,
        platform_name_dxtrade,
        platform_name_mt5,
        platform_name_ctrader,
        transfer_fee,
    ]);

    const getDxtradeAllowedNotes = useCallback(() => {
        if (is_dxtrade_allowed) {
            return (
                <React.Fragment>
                    <AccountTransferBullet>
                        <Localize
                            i18n_default_text='You may transfer between your Deriv fiat, cryptocurrency, {{platform_name_mt5}}, {{platform_name_ctrader}}, and {{platform_name_dxtrade}} accounts.'
                            values={{ platform_name_dxtrade, platform_name_mt5, platform_name_ctrader }}
                        />
                    </AccountTransferBullet>
                    <AccountTransferBullet>
                        <Localize
                            i18n_default_text='Each day, you can make up to {{ allowed_internal }} transfers between your Deriv accounts, up to {{ allowed_mt5 }} transfers between your Deriv and {{platform_name_mt5}} accounts, up to {{ allowed_ctrader }} transfers between your Deriv and {{platform_name_ctrader}} accounts, and up to {{ allowed_dxtrade }} transfers between your Deriv and {{platform_name_dxtrade}} accounts.'
                            values={{
                                allowed_internal: allowed_transfers_count?.internal,
                                allowed_mt5: allowed_transfers_count?.mt5,
                                allowed_dxtrade: allowed_transfers_count?.dxtrade,
                                allowed_ctrader: allowed_transfers_count?.ctrader,
                                platform_name_dxtrade,
                                platform_name_mt5,
                                platform_name_ctrader,
                            }}
                        />
                    </AccountTransferBullet>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='You may transfer between your Deriv fiat, cryptocurrency, and {{platform_name_mt5}} accounts.'
                        values={{ platform_name_mt5 }}
                    />
                </AccountTransferBullet>
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='Each day, you can make up to {{ allowed_internal }} transfers between your Deriv accounts and up to {{ allowed_mt5 }} transfers between your Deriv and {{platform_name_mt5}} accounts.'
                        values={{
                            allowed_internal: allowed_transfers_count?.internal,
                            allowed_mt5: allowed_transfers_count?.mt5,
                            platform_name_mt5,
                        }}
                    />
                </AccountTransferBullet>
            </React.Fragment>
        );
    }, [
        allowed_transfers_count?.dxtrade,
        allowed_transfers_count?.internal,
        allowed_transfers_count?.ctrader,
        allowed_transfers_count?.mt5,
        is_dxtrade_allowed,
        platform_name_dxtrade,
        platform_name_mt5,
        platform_name_ctrader,
    ]);

    const getCumulativeTransferFeeNote = useCallback(() => {
        if (transfer_fee === 2) {
            return (
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='We charge 2% or {{ minimum_fee }} {{ currency }} (whichever is higher) for all cryptocurrency transfers.'
                        values={{
                            minimum_fee,
                            currency: selected_account_currency,
                        }}
                    />
                </AccountTransferBullet>
            );
        } else if (transfer_fee === 1) {
            return (
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='We charge 1% or {{ minimum_fee }} {{ currency }} (whichever is higher) for all cryptocurrency transfers.'
                        values={{
                            minimum_fee,
                            currency: selected_account_currency,
                        }}
                    />
                </AccountTransferBullet>
            );
        }
        return (
            <AccountTransferBullet>
                <Localize
                    i18n_default_text="We don't charge a fee for transferring funds between your Deriv {{currency}} account to Deriv MT5, Deriv cTrader, or Deriv X account."
                    values={{
                        currency: selected_account_currency,
                    }}
                />
            </AccountTransferBullet>
        );
    }, [selected_account_currency, minimum_fee, transfer_fee]);

    const getDailyCumilativeLimitNotes = useCallback(() => {
        if (is_dxtrade_transfer) {
            return (
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='Each day you can transfer up to {{ allowed_dxtrade }} {{ currency }}. The daily limit will be reset at 00:00 GMT.'
                        values={{
                            allowed_dxtrade: addComma(
                                exchange_rate * Number(allowed_transfers_amount?.dxtrade),
                                fractional_digits
                            ),
                            currency: selected_account_currency,
                        }}
                    />
                </AccountTransferBullet>
            );
        } else if (is_mt_transfer) {
            return (
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='Each day you can transfer up to {{ allowed_mt5 }} {{ currency }}. The daily limit will be reset at 00:00 GMT.'
                        values={{
                            allowed_mt5: addComma(
                                exchange_rate * Number(allowed_transfers_amount?.mt5),
                                fractional_digits
                            ),
                            currency: selected_account_currency,
                        }}
                    />
                </AccountTransferBullet>
            );
        }
        return (
            <AccountTransferBullet>
                <Localize
                    i18n_default_text='Each day you can transfer up to {{ allowed_internal }} {{ currency }}. The daily limit will be reset at 00:00 GMT.'
                    values={{
                        allowed_internal: addComma(
                            exchange_rate * Number(allowed_transfers_amount?.internal),
                            fractional_digits
                        ),
                        currency: selected_account_currency,
                    }}
                />
            </AccountTransferBullet>
        );
    }, [
        selected_account_currency,
        allowed_transfers_amount?.dxtrade,
        allowed_transfers_amount?.internal,
        allowed_transfers_amount?.mt5,
        exchange_rate,
        fractional_digits,
        is_dxtrade_transfer,
        is_mt_transfer,
    ]);

    return (
        <div className='account-transfer-form__notes'>
            {is_cumulative_transfers_enabled && getDailyCumilativeLimitNotes()}
            {is_cumulative_transfers_enabled && getCumulativeTransferFeeNote()}
            {!is_cumulative_transfers_enabled && getDxtradeAllowedNotes()}
            {!is_cumulative_transfers_enabled && (
                <React.Fragment>
                    <AccountTransferBullet>
                        <Localize i18n_default_text='Transfer limits may vary depending on the exchange rates.' />
                    </AccountTransferBullet>
                    <AccountTransferBullet>
                        {getCountTransferFeeNote()}
                        <Localize i18n_default_text='Please bear in mind that some transfers may not be possible.' />
                    </AccountTransferBullet>
                </React.Fragment>
            )}
            <AccountTransferBullet>
                <Localize
                    i18n_default_text={
                        is_cumulative_transfers_enabled
                            ? 'Transfers may be unavailable when the exchange market is closed or too volatile.'
                            : 'Transfers may be unavailable due to high volatility or technical issues and when the exchange markets are closed.'
                    }
                />
            </AccountTransferBullet>
        </div>
    );
};

export default AccountTransferNote;

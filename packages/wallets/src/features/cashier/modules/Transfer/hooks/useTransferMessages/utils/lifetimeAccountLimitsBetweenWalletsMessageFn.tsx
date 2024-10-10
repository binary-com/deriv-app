import React from 'react';
import { Localize } from '@deriv-com/translations';
import { TMessageFnProps, TTransferMessage } from '../../../types';

let message: TTransferMessage['message'];

const verifyPOIAction = {
    buttonLabel: <Localize i18n_default_text='Verify' />,
    navigateTo: '/account/proof-of-identity',
    shouldOpenInNewTab: true,
};

const lifetimeAccountLimitsBetweenWalletsMessageFn = ({
    activeWallet,
    activeWalletExchangeRates,
    displayMoney,
    limits,
    sourceAccount,
    sourceAmount,
    targetAccount,
}: TMessageFnProps) => {
    if (sourceAccount?.account_category !== 'wallet' || targetAccount?.account_category !== 'wallet') return null;

    const sourceWalletType = sourceAccount.account_type === 'crypto' ? 'crypto' : 'fiat';
    const targetWalletType = targetAccount.account_type === 'crypto' ? 'crypto' : 'fiat';
    const limitsCaseKey = `${sourceWalletType}_to_${targetWalletType}` as const;

    //@ts-expect-error needs backend type
    const allowedSumActiveWalletCurrency = limits?.lifetime_transfers?.[limitsCaseKey]?.allowed as number;
    //@ts-expect-error needs backend type
    const availableSumActiveWalletCurrency = limits?.lifetime_transfers?.[limitsCaseKey]?.available as number;

    if (
        !sourceAccount.currency ||
        (sourceAccount.currency !== activeWallet.currency &&
            !activeWalletExchangeRates?.rates?.[sourceAccount.currency]) ||
        !targetAccount.currency ||
        (targetAccount.currency !== activeWallet.currency &&
            !activeWalletExchangeRates?.rates?.[targetAccount.currency]) ||
        !sourceAccount.currencyConfig ||
        !targetAccount.currencyConfig
    )
        return null;

    const availableSumConverted =
        availableSumActiveWalletCurrency * (activeWalletExchangeRates?.rates?.[targetAccount.currency] ?? 1);

    const formattedSourceCurrencyLimit = displayMoney?.(
        allowedSumActiveWalletCurrency,
        sourceAccount.currencyConfig.display_code,
        sourceAccount.currencyConfig.fractional_digits
    );

    const formattedSourceCurrencyLimitInUSD = displayMoney?.(
        allowedSumActiveWalletCurrency * (activeWalletExchangeRates?.rates?.USD ?? 1),
        activeWalletExchangeRates?.rates?.USD ? 'USD' : sourceAccount.currencyConfig.display_code,
        activeWalletExchangeRates?.rates?.USD ? 2 : sourceAccount.currencyConfig.fractional_digits
    );

    const formattedSourceCurrencyRemainder = displayMoney?.(
        availableSumActiveWalletCurrency,
        sourceAccount.currencyConfig.display_code,
        sourceAccount.currencyConfig.fractional_digits
    );

    const formattedConvertedSourceCurrencyRemainder = displayMoney?.(
        availableSumConverted,
        targetAccount.currencyConfig.display_code,
        targetAccount.currencyConfig.fractional_digits
    );

    const formattedSourceCurrencyRemainderInUSD = displayMoney?.(
        availableSumActiveWalletCurrency * (activeWalletExchangeRates?.rates?.USD ?? 1),
        activeWalletExchangeRates?.rates?.USD ? 'USD' : sourceAccount.currencyConfig.display_code,
        activeWalletExchangeRates?.rates?.USD ? 2 : sourceAccount.currencyConfig.fractional_digits
    );

    if (availableSumActiveWalletCurrency === 0) {
        message =
            targetWalletType === 'crypto' ? (
                <Localize
                    i18n_default_text="You've reached the lifetime transfer limit from your {{sourceAccountName}} to any cryptocurrency Wallet. Verify your account to upgrade the limit."
                    values={{ sourceAccountName: sourceAccount.accountName }}
                />
            ) : (
                <Localize
                    i18n_default_text="You've reached the lifetime transfer limit from your {{sourceAccountName}} to {{targetAccountName}}. Verify your account to upgrade the limit."
                    values={{
                        sourceAccountName: sourceAccount.accountName,
                        targetAccountName: targetAccount.accountName,
                    }}
                />
            );

        return {
            action: verifyPOIAction,
            message,
            type: 'error' as const,
        };
    } else if (sourceAmount > availableSumActiveWalletCurrency) {
        switch (limitsCaseKey) {
            case 'fiat_to_crypto':
            case 'crypto_to_fiat':
                message = (
                    <Localize
                        i18n_default_text='The lifetime transfer limit is up to {{formattedSourceCurrencyRemainder}} ({{formattedConvertedSourceCurrencyRemainder}}). Verify your account to upgrade the limit.'
                        values={{ formattedConvertedSourceCurrencyRemainder, formattedSourceCurrencyRemainder }}
                    />
                );

                return {
                    action: verifyPOIAction,
                    message,
                    type: 'error' as const,
                };
            case 'crypto_to_crypto':
                message = (
                    <Localize
                        i18n_default_text='The lifetime transfer limit is up to {{formattedSourceCurrencyRemainder}} ({{formattedSourceCurrencyRemainderInUSD}}). Verify your account to upgrade the limit.'
                        values={{ formattedSourceCurrencyRemainder, formattedSourceCurrencyRemainderInUSD }}
                    />
                );

                return {
                    action: verifyPOIAction,
                    message,
                    type: 'error' as const,
                };
            default:
                return null;
        }
    }

    if (allowedSumActiveWalletCurrency === availableSumActiveWalletCurrency)
        switch (limitsCaseKey) {
            case 'fiat_to_crypto':
            case 'crypto_to_fiat':
                message =
                    targetWalletType === 'crypto' ? (
                        <Localize
                            i18n_default_text='The lifetime transfer limit from {{sourceAccountName}} to any cryptocurrency Wallets is up to {{formattedSourceCurrencyLimit}}.'
                            values={{ formattedSourceCurrencyLimit, sourceAccountName: sourceAccount.accountName }}
                        />
                    ) : (
                        <Localize
                            i18n_default_text='The lifetime transfer limit from {{sourceAccountName}} to {{targetAccountName}} is up to {{formattedSourceCurrencyLimit}} (Approximate to {{formattedSourceCurrencyLimitInUSD}}).'
                            values={{
                                formattedSourceCurrencyLimit,
                                formattedSourceCurrencyLimitInUSD,
                                sourceAccountName: sourceAccount.accountName,
                                targetAccountName: targetAccount.accountName,
                            }}
                        />
                    );

                return {
                    message,
                    type: 'success' as const,
                };
            case 'crypto_to_crypto':
                message = (
                    <Localize
                        i18n_default_text='The lifetime transfer limit between cryptocurrency Wallets is up to {{formattedSourceCurrencyLimit}} (Approximate to {{formattedSourceCurrencyLimitInUSD}}).'
                        values={{ formattedSourceCurrencyLimit, formattedSourceCurrencyLimitInUSD }}
                    />
                );

                return {
                    message,
                    type: 'success' as const,
                };
            default:
                return null;
        }

    switch (limitsCaseKey) {
        case 'fiat_to_crypto':
        case 'crypto_to_fiat':
            message =
                targetWalletType === 'crypto' ? (
                    <Localize
                        i18n_default_text='Your remaining lifetime transfer limit from {{sourceAccountName}} to any cryptocurrency Wallets is {{formattedSourceCurrencyRemainder}}. Verify your account to upgrade the limit.'
                        values={{ formattedSourceCurrencyRemainder, sourceAccountName: sourceAccount.accountName }}
                    />
                ) : (
                    <Localize
                        i18n_default_text='Your remaining lifetime transfer limit from {{sourceAccountName}} to {{targetAccountName}} is {{formattedSourceCurrencyRemainder}} (Approximate to {{formattedSourceCurrencyRemainderInUSD}}). Verify your account to upgrade the limit.'
                        values={{
                            formattedSourceCurrencyRemainder,
                            formattedSourceCurrencyRemainderInUSD,
                            sourceAccountName: sourceAccount.accountName,
                            targetAccountName: targetAccount.accountName,
                        }}
                    />
                );

            return {
                action: verifyPOIAction,
                message,
                type: 'success' as const,
            };
        case 'crypto_to_crypto':
            message = (
                <Localize
                    i18n_default_text='Your remaining lifetime transfer limit between cryptocurrency Wallets is {{formattedSourceCurrencyRemainder}} (Approximate to {{formattedSourceCurrencyRemainderInUSD}}). Verify your account to upgrade the limit.'
                    values={{ formattedSourceCurrencyRemainder, formattedSourceCurrencyRemainderInUSD }}
                />
            );

            return {
                action: verifyPOIAction,
                message,
                type: 'success' as const,
            };
        default:
            return null;
    }
};

export default lifetimeAccountLimitsBetweenWalletsMessageFn;

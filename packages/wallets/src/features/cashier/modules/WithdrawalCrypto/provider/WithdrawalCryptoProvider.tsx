import React, { createContext, useContext, useEffect, useState } from 'react';
import { useActiveWalletAccount, useCryptoWithdrawal, useCurrencyConfig, useExchangeRate } from '@deriv/api';
import { THooks } from '../../../../../types';
import { TWithdrawalReceipt } from '../types';

export type TWithdrawalCrypto = {
    activeWallet: ReturnType<typeof useActiveWalletAccount>['data'];
    exchangeRates: Partial<ReturnType<typeof useExchangeRate>>;
    fractionalDigits: {
        crypto?: number;
        fiat?: number;
    };
    getConvertedCryptoAmount: (fiatInput: number | string) => string;
    getConvertedFiatAmount: (cryptoInput: number | string) => string;
    getCurrencyConfig: ReturnType<typeof useCurrencyConfig>['getConfig'];
    isWithdrawalSuccess: ReturnType<typeof useCryptoWithdrawal>['isSuccess'];
    onClose: () => void;
    requestCryptoWithdrawal: (values: Parameters<THooks.CryptoWithdrawal>[0]) => void;
    withdrawalReceipt: TWithdrawalReceipt;
};

type TWithdrawalCryptoContextProps = {
    onClose: TWithdrawalCrypto['onClose'];
    verificationCode: string;
};

const WithdrawalCryptoContext = createContext<TWithdrawalCrypto | null>(null);

export const useWithdrawalCryptoContext = () => {
    const context = useContext(WithdrawalCryptoContext);

    if (!context)
        throw new Error(
            'useWithdrawalCryptoContext() must be called within a component wrapped in WithdrawalCryptoProvider.'
        );

    return context;
};

const WithdrawalCryptoProvider: React.FC<React.PropsWithChildren<TWithdrawalCryptoContextProps>> = ({
    children,
    onClose,
    verificationCode,
}) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isSuccess: isWithdrawalSuccess, mutateAsync } = useCryptoWithdrawal();
    const { getConfig } = useCurrencyConfig();
    const [withdrawalReceipt, setWithdrawalReceipt] = useState<TWithdrawalReceipt>({});
    const { data: exchangeRates, subscribe, unsubscribe } = useExchangeRate();
    const FRACTIONAL_DIGITS_CRYPTO = activeWallet?.currency_config?.fractional_digits;
    const FRACTIONAL_DIGITS_FIAT = getConfig('USD')?.fractional_digits;

    useEffect(() => {
        if (activeWallet?.currency)
            subscribe({
                base_currency: 'USD',
                loginid: activeWallet.loginid,
                target_currency: activeWallet.currency,
            });
        return () => unsubscribe();
    }, [activeWallet?.currency, activeWallet?.loginid, subscribe, unsubscribe]);

    const getConvertedCryptoAmount = (fiatInput: number | string) => {
        const value = Number(fiatInput);
        const convertedValue =
            value && exchangeRates?.rates && activeWallet?.currency
                ? (value * exchangeRates?.rates[activeWallet?.currency]).toFixed(FRACTIONAL_DIGITS_CRYPTO)
                : '';
        return convertedValue;
    };

    const getConvertedFiatAmount = (cryptoInput: number | string) => {
        const value = Number(cryptoInput);
        const convertedValue =
            !Number.isNaN(value) && exchangeRates?.rates && activeWallet?.currency
                ? (value / exchangeRates?.rates[activeWallet?.currency]).toFixed(FRACTIONAL_DIGITS_FIAT)
                : '';

        return convertedValue;
    };

    const requestCryptoWithdrawal = (values: Parameters<THooks.CryptoWithdrawal>[0]) => {
        const { address, amount } = values;
        mutateAsync({
            address,
            amount,
            verification_code: verificationCode,
        }).then(() =>
            setWithdrawalReceipt({
                address,
                amount: amount?.toFixed(activeWallet?.currency_config?.fractional_digits),
                currency: activeWallet?.currency,
                landingCompany: activeWallet?.landing_company_name,
            })
        );
    };

    return (
        <WithdrawalCryptoContext.Provider
            value={{
                activeWallet,
                exchangeRates: {
                    data: exchangeRates,
                    subscribe,
                    unsubscribe,
                },
                fractionalDigits: {
                    crypto: FRACTIONAL_DIGITS_CRYPTO,
                    fiat: FRACTIONAL_DIGITS_FIAT,
                },
                getConvertedCryptoAmount,
                getConvertedFiatAmount,
                getCurrencyConfig: getConfig,
                isWithdrawalSuccess,
                onClose,
                requestCryptoWithdrawal,
                withdrawalReceipt,
            }}
        >
            {children}
        </WithdrawalCryptoContext.Provider>
    );
};

export default WithdrawalCryptoProvider;

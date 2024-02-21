import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    useAccountLimits,
    useActiveWalletAccount,
    useCryptoWithdrawal,
    useCurrencyConfig,
    useExchangeRateSubscription,
    usePOA,
    usePOI,
} from '@deriv/api-v2';
import { THooks } from '../../../../../types';
import { TWithdrawalReceipt } from '../types';

export type TWithdrawalCryptoContext = {
    accountLimits: ReturnType<typeof useAccountLimits>['data'];
    activeWallet: ReturnType<typeof useActiveWalletAccount>['data'];
    exchangeRates: Partial<ReturnType<typeof useExchangeRateSubscription>>;
    fractionalDigits: {
        crypto?: number;
        fiat?: number;
    };
    getConvertedCryptoAmount: (fiatInput: number | string) => string;
    getConvertedFiatAmount: (cryptoInput: number | string) => string;
    getCurrencyConfig: ReturnType<typeof useCurrencyConfig>['getConfig'];
    isClientVerified: boolean | undefined;
    isWithdrawalSuccess: ReturnType<typeof useCryptoWithdrawal>['isSuccess'];
    onClose: () => void;
    requestCryptoWithdrawal: (values: Parameters<THooks.CryptoWithdrawal>[0]) => void;
    withdrawalReceipt: TWithdrawalReceipt;
};

type TWithdrawalCryptoContextProps = {
    onClose: TWithdrawalCryptoContext['onClose'];
    verificationCode: string;
};

const WithdrawalCryptoContext = createContext<TWithdrawalCryptoContext | null>(null);

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
    const { data: accountLimits } = useAccountLimits();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: poaStatus } = usePOA();
    const { data: poiStatus } = usePOI();
    const { isSuccess: isWithdrawalSuccess, mutateAsync } = useCryptoWithdrawal();
    const { getConfig } = useCurrencyConfig();
    const [withdrawalReceipt, setWithdrawalReceipt] = useState<TWithdrawalReceipt>({});
    const { data: exchangeRates, subscribe, unsubscribeAll } = useExchangeRateSubscription();

    const FRACTIONAL_DIGITS_CRYPTO = activeWallet?.currency_config?.fractional_digits;
    const FRACTIONAL_DIGITS_FIAT = getConfig('USD')?.fractional_digits;

    useEffect(() => {
        if (activeWallet?.currency)
            subscribe({
                base_currency: 'USD',
                loginid: activeWallet.loginid,
                target_currency: activeWallet.currency,
            });
        return () => unsubscribeAll();
    }, [activeWallet?.currency, activeWallet?.loginid, subscribe, unsubscribeAll]);

    const getClientVerificationStatus = () => {
        const isVerified = poaStatus?.is_verified && poiStatus?.is_verified;
        return isVerified;
    };

    const getConvertedCryptoAmount = (fiatInput: number | string) => {
        const value = typeof fiatInput === 'string' ? parseFloat(fiatInput) : fiatInput;
        const convertedValue =
            !Number.isNaN(value) && exchangeRates?.rates && activeWallet?.currency
                ? (value * exchangeRates?.rates[activeWallet?.currency]).toFixed(FRACTIONAL_DIGITS_CRYPTO)
                : '';
        return convertedValue;
    };

    const getConvertedFiatAmount = (cryptoInput: number | string) => {
        const value = typeof cryptoInput === 'string' ? parseFloat(cryptoInput) : cryptoInput;
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

    const value = {
        accountLimits,
        activeWallet,
        exchangeRates: {
            data: exchangeRates,
            subscribe,
            unsubscribeAll,
        },
        fractionalDigits: {
            crypto: FRACTIONAL_DIGITS_CRYPTO,
            fiat: FRACTIONAL_DIGITS_FIAT,
        },
        getConvertedCryptoAmount,
        getConvertedFiatAmount,
        getCurrencyConfig: getConfig,
        isClientVerified: getClientVerificationStatus(),
        isWithdrawalSuccess,
        onClose,
        requestCryptoWithdrawal,
        withdrawalReceipt,
    };

    return <WithdrawalCryptoContext.Provider value={value}>{children}</WithdrawalCryptoContext.Provider>;
};

export default WithdrawalCryptoProvider;

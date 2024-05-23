import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    useAccountLimits,
    useActiveWalletAccount,
    useCryptoConfig,
    useCryptoWithdrawal,
    useCurrencyConfig,
    useExchangeRateSubscription,
    usePOA,
    usePOI,
} from '@deriv/api-v2';
import { TSocketError } from '@deriv/api-v2/types';
import { THooks } from '../../../../../types';
import { TWithdrawalReceipt } from '../types';

export type TWithdrawalCryptoContext = {
    accountLimits: ReturnType<typeof useAccountLimits>['data'];
    activeWallet: ReturnType<typeof useActiveWalletAccount>['data'];
    cryptoConfig: ReturnType<typeof useCryptoConfig>['data'];
    error: TSocketError<'cashier'>['error'] | undefined;
    exchangeRates: Partial<ReturnType<typeof useExchangeRateSubscription>>;
    fractionalDigits: {
        crypto?: number;
        fiat?: number;
    };
    getConvertedCryptoAmount: (fiatInput: number | string) => string;
    getConvertedFiatAmount: (cryptoInput: number | string) => string;
    getCurrencyConfig: ReturnType<typeof useCurrencyConfig>['getConfig'];
    isClientVerified: boolean | undefined;
    isLoading: boolean;
    isWithdrawalSuccess: ReturnType<typeof useCryptoWithdrawal>['isSuccess'];
    requestCryptoWithdrawal: (values: Parameters<THooks.CryptoWithdrawal>[0]) => void;
    setError: React.Dispatch<
        React.SetStateAction<
            | {
                  code: string;
                  message: string;
              }
            | undefined
        >
    >;
    withdrawalReceipt: TWithdrawalReceipt;
};

type TWithdrawalCryptoContextProps = {
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
    verificationCode,
}) => {
    const { data: accountLimits } = useAccountLimits();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: cryptoConfig, error: cryptoConfigError, isLoading: isCryptoConfigLoading } = useCryptoConfig();
    const { data: poaStatus } = usePOA();
    const { data: poiStatus } = usePOI();
    const { isSuccess: isWithdrawalSuccess, mutateAsync } = useCryptoWithdrawal();
    const { getConfig } = useCurrencyConfig();
    const [error, setError] = useState<TSocketError<'cashier'>['error'] | undefined>();
    const [isTokenValidationLoading, setIsTokenValidationLoading] = useState(true);
    const [withdrawalReceipt, setWithdrawalReceipt] = useState<TWithdrawalReceipt>({});
    const { data: exchangeRates, subscribe, unsubscribe } = useExchangeRateSubscription();
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

    useEffect(() => {
        if (cryptoConfigError) {
            setError(cryptoConfigError?.error);
        }
    }, [cryptoConfigError]);

    useEffect(() => {
        if (verificationCode) {
            mutateAsync({ dry_run: 1, verification_code: verificationCode })
                .catch((error: TSocketError<'cashier'> | null) => {
                    if (error?.error.code === 'InvalidToken') setError(error?.error);
                })
                .finally(() => setIsTokenValidationLoading(false));
        }
    }, [mutateAsync, setError, verificationCode]);

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
        })
            .then(() =>
                setWithdrawalReceipt({
                    address,
                    amount: amount?.toFixed(activeWallet?.currency_config?.fractional_digits),
                    currency: activeWallet?.currency,
                    landingCompany: activeWallet?.landing_company_name,
                })
            )
            .catch((error: TSocketError<'cashier'>) => {
                setError(error.error);
            });
    };

    const value = {
        accountLimits,
        activeWallet,
        cryptoConfig,
        error,
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
        isClientVerified: getClientVerificationStatus(),
        isLoading: isCryptoConfigLoading || isTokenValidationLoading,
        isWithdrawalSuccess,
        requestCryptoWithdrawal,
        setError,
        withdrawalReceipt,
    };

    return <WithdrawalCryptoContext.Provider value={value}>{children}</WithdrawalCryptoContext.Provider>;
};

export default WithdrawalCryptoProvider;

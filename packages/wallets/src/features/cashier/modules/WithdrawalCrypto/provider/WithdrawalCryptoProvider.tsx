import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    useAccountLimits,
    useActiveWalletAccount,
    useCryptoConfig,
    useCryptoEstimations,
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
    countDownEstimationFee: ReturnType<typeof useCryptoEstimations>['countDown'];
    cryptoConfig: ReturnType<typeof useCryptoConfig>['data'];
    cryptoEstimationsError: ReturnType<typeof useCryptoEstimations>['error'];
    cryptoEstimationsFee: ReturnType<typeof useCryptoEstimations>['cryptoEstimationsFee'];
    cryptoEstimationsFeeUniqueId: ReturnType<typeof useCryptoEstimations>['cryptoEstimationsFeeUniqueId'];
    error: TSocketError<'cashier'>['error'] | undefined;
    exchangeRates: Partial<ReturnType<typeof useExchangeRateSubscription>>;
    fractionalDigits: {
        crypto?: number;
        fiat?: number;
    };
    getConvertedCryptoAmount: (fiatInput: number | string) => string;
    getConvertedFiatAmount: (cryptoInput: number | string) => string;
    getCryptoEstimations: ReturnType<typeof useCryptoEstimations>['getCryptoEstimations'];
    getCurrencyConfig: ReturnType<typeof useCurrencyConfig>['getConfig'];
    isClientVerified: boolean | undefined;
    isLoading: boolean;
    isLoadingCryptoEstimationFee: ReturnType<typeof useCryptoEstimations>['isLoading'];
    isWithdrawalSuccess: ReturnType<typeof useCryptoWithdrawal>['isSuccess'];
    requestCryptoWithdrawal: (values: Parameters<THooks.CryptoWithdrawal>[0]) => void;
    serverTime: ReturnType<typeof useCryptoEstimations>['serverTime'];
    setCurrencyCode: ReturnType<typeof useCryptoEstimations>['setCurrencyCode'];
    setError: React.Dispatch<
        React.SetStateAction<
            | {
                  code: string;
                  message: string;
              }
            | undefined
        >
    >;
    unsubscribeCryptoEstimations: ReturnType<typeof useCryptoEstimations>['unsubscribeCryptoEstimations'];
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
    const {
        countDown: countDownEstimationFee,
        cryptoEstimationsFee,
        cryptoEstimationsFeeUniqueId,
        error: cryptoEstimationsError,
        getCryptoEstimations,
        isLoading: isLoadingCryptoEstimationFee,
        serverTime,
        setCurrencyCode,
        unsubscribeCryptoEstimations,
    } = useCryptoEstimations();
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
                .catch((response: TSocketError<'cashier'> | null) => {
                    if (response?.error?.code === 'InvalidToken') setError(response?.error);
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
        // eslint-disable-next-line camelcase
        const { address, amount, estimated_fee_unique_id: estimatedFeeUniqueId } = values;
        mutateAsync({
            address,
            amount,
            estimated_fee_unique_id: estimatedFeeUniqueId,
            verification_code: verificationCode,
        })
            .then(() => {
                const fractionalDigits = activeWallet?.currency_config?.fractional_digits ?? 0;
                setWithdrawalReceipt({
                    address,
                    amount: Number(amount),
                    amountReceived: estimatedFeeUniqueId
                        ? (Number(amount) - Number(cryptoEstimationsFee)).toFixed(fractionalDigits)
                        : amount?.toFixed(fractionalDigits),
                    currency: activeWallet?.currency,
                    landingCompany: activeWallet?.landing_company_name,
                    transactionFee: estimatedFeeUniqueId
                        ? Number(cryptoEstimationsFee)?.toFixed(fractionalDigits)
                        : undefined,
                });
            })
            .catch((error: TSocketError<'cashier'>) => {
                setError(error.error);
            });
    };

    const value = {
        accountLimits,
        activeWallet,
        countDownEstimationFee,
        cryptoConfig,
        cryptoEstimationsError,
        cryptoEstimationsFee,
        cryptoEstimationsFeeUniqueId,
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
        getCryptoEstimations,
        getCurrencyConfig: getConfig,
        isClientVerified: getClientVerificationStatus(),
        isLoading: isCryptoConfigLoading || isTokenValidationLoading,
        isLoadingCryptoEstimationFee,
        isWithdrawalSuccess,
        requestCryptoWithdrawal,
        serverTime,
        setCurrencyCode,
        setError,
        unsubscribeCryptoEstimations,
        withdrawalReceipt,
    };

    return <WithdrawalCryptoContext.Provider value={value}>{children}</WithdrawalCryptoContext.Provider>;
};

export default WithdrawalCryptoProvider;

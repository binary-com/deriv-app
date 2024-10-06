import { useCallback, useMemo } from 'react';
import { useActiveWalletAccount, usePOI, useTradingPlatformStatus, useWalletAccountsList } from '@deriv/api-v2';
import { displayMoney as displayMoney_ } from '@deriv/api-v2/src/utils';
import { THooks } from '../../../../../../types';
import { MT5_ACCOUNT_STATUS, TRADING_PLATFORM_STATUS } from '../../../../../cfd/constants';
import { TAccount, TInitialTransferFormValues, TMessageFnProps, TTransferMessage } from '../../types';
import {
    countLimitMessageFn,
    cumulativeAccountLimitsMessageFn,
    insufficientBalanceMessageFn,
    lifetimeAccountLimitsBetweenWalletsMessageFn,
    tradingPlatformStatusMessageFn,
    transferFeesBetweenWalletsMessageFn,
} from './utils';

type TProps = {
    USDExchangeRates?: THooks.ExchangeRate;
    accountLimits?: THooks.AccountLimits;
    activeWalletExchangeRates?: THooks.ExchangeRate;
    formData: TInitialTransferFormValues;
    fromAccount: NonNullable<TAccount> | undefined;
    toAccount: NonNullable<TAccount> | undefined;
};

const useTransferMessages = ({
    USDExchangeRates,
    accountLimits,
    activeWalletExchangeRates,
    formData,
    fromAccount,
    toAccount,
}: TProps) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: walletAccounts } = useWalletAccountsList();
    const { data: poi } = usePOI();
    const { getPlatformStatus } = useTradingPlatformStatus();

    const platformStatus =
        getPlatformStatus(fromAccount?.account_type ?? '') || getPlatformStatus(toAccount?.account_type ?? '');

    const isServerMaintenance =
        platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE ||
        [fromAccount?.status, toAccount?.status].includes(MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE);
    const isAccountUnavailable = [fromAccount?.status, toAccount?.status].includes(TRADING_PLATFORM_STATUS.UNAVAILABLE);
    const hasTradingPlatformStatus = isServerMaintenance || isAccountUnavailable;

    const isTransferBetweenWallets =
        fromAccount?.account_category === 'wallet' && toAccount?.account_category === 'wallet';
    const isAccountVerified = poi?.is_verified;

    const displayMoney = useCallback(
        (amount: number, currency: string, fractionalDigits: number) =>
            displayMoney_(amount, currency, { fractional_digits: fractionalDigits }),
        []
    );

    const memoizedMessages = useMemo(() => {
        const fiatAccount = walletAccounts?.find(account => account.account_type === 'doughflow');

        const sourceAmount = formData.fromAmount;
        const targetAmount = formData.toAmount;

        const messageFns: ((props: TMessageFnProps) => TTransferMessage | null)[] = [];
        const messages: TTransferMessage[] = [];

        messageFns.push(insufficientBalanceMessageFn);
        messageFns.push(countLimitMessageFn);

        if (!isAccountVerified && isTransferBetweenWallets) {
            messageFns.push(lifetimeAccountLimitsBetweenWalletsMessageFn);
        }
        if (isAccountVerified || (!isAccountVerified && !isTransferBetweenWallets)) {
            messageFns.push(cumulativeAccountLimitsMessageFn);
        }
        if (isTransferBetweenWallets) {
            messageFns.push(transferFeesBetweenWalletsMessageFn);
        }
        if (hasTradingPlatformStatus) {
            messageFns.push(tradingPlatformStatusMessageFn);
        }

        messageFns.forEach(messageFn => {
            if (!activeWallet || !fromAccount) return;

            const message = messageFn({
                activeWallet,
                activeWalletExchangeRates,
                displayMoney,
                fiatAccount,
                limits: accountLimits,
                platformStatus,
                sourceAccount: fromAccount,
                sourceAmount,
                targetAccount: toAccount,
                targetAmount,
                USDExchangeRates,
            });

            if (message) messages.push(message);
        });

        if (messages.some(message => message.type === 'error')) {
            return messages.filter(message => message.type === 'error');
        }

        return messages;
    }, [
        USDExchangeRates,
        accountLimits,
        activeWallet,
        activeWalletExchangeRates,
        displayMoney,
        formData.fromAmount,
        formData.toAmount,
        fromAccount,
        hasTradingPlatformStatus,
        isAccountVerified,
        isTransferBetweenWallets,
        platformStatus,
        toAccount,
        walletAccounts,
    ]);

    return memoizedMessages;
};

export default useTransferMessages;

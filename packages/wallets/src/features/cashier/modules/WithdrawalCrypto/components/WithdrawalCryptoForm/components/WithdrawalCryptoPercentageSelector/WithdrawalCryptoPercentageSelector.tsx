import React from 'react';
import { useFormikContext } from 'formik';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { WalletsPercentageSelector } from '../../../../../../../../components';
import useAllBalanceSubscription from '../../../../../../../../hooks/useAllBalanceSubscription';
import { useWithdrawalCryptoContext } from '../../../../provider';
import { TWithdrawalForm } from '../../../../types';
import { validateCryptoInput, validateFiatInput } from '../../../../utils';
import './WithdrawalCryptoPercentageSelector.scss';

const WithdrawalCryptoPercentageSelector: React.FC = () => {
    const { setValues, values } = useFormikContext<TWithdrawalForm>();
    const { accountLimits, activeWallet, cryptoConfig, fractionalDigits, getConvertedFiatAmount, isClientVerified } =
        useWithdrawalCryptoContext();
    const { localize } = useTranslations();

    const { data: balanceData } = useAllBalanceSubscription();
    const activeWalletBalance = balanceData?.[activeWallet?.loginid ?? '']?.balance ?? 0;
    const activeWalletDisplayBalance = displayMoney(
        balanceData?.[activeWallet?.loginid ?? '']?.balance,
        activeWallet?.currency,
        {
            fractional_digits: activeWallet?.currency_config?.fractional_digits,
        }
    );

    const getPercentageMessage = (value: string) => {
        const amount = parseFloat(value);
        if (!activeWalletBalance || !activeWalletDisplayBalance) return;

        if (amount <= activeWalletBalance) {
            const percentage = Math.round((amount * 100) / activeWalletBalance);
            return (
                <Localize
                    i18n_default_text='{{percentage}}% of available balance ({{activeWalletDisplayBalance}})'
                    values={{ activeWalletDisplayBalance, percentage }}
                />
            );
        }
    };

    const isValidInput =
        !validateCryptoInput(
            {
                balance: activeWalletBalance,
                currency: activeWallet?.currency ?? '',
                displayBalance: activeWalletDisplayBalance,
            },
            fractionalDigits,
            isClientVerified,
            localize,
            accountLimits?.remainder ?? 0,
            values.cryptoAmount,
            cryptoConfig?.minimum_withdrawal
        ) && !validateFiatInput(fractionalDigits, localize, values.fiatAmount);

    return (
        <div className='wallets-withdrawal-crypto-percentage__selector'>
            <WalletsPercentageSelector
                amount={
                    activeWalletBalance &&
                    !Number.isNaN(parseFloat(values.cryptoAmount)) &&
                    parseFloat(values.cryptoAmount) <= activeWalletBalance
                        ? parseFloat(values.cryptoAmount)
                        : 0
                }
                balance={activeWalletBalance ?? 0}
                onChangePercentage={percentage => {
                    if (activeWalletBalance) {
                        const fraction = percentage / 100;
                        const cryptoAmount = (activeWalletBalance * fraction).toFixed(fractionalDigits.crypto);
                        const fiatAmount = !validateCryptoInput(
                            {
                                balance: activeWalletBalance,
                                currency: activeWallet?.currency ?? '',
                                displayBalance: activeWalletDisplayBalance,
                            },
                            fractionalDigits,
                            isClientVerified,
                            localize,
                            accountLimits?.remainder ?? 0,
                            cryptoAmount,
                            cryptoConfig?.minimum_withdrawal
                        )
                            ? getConvertedFiatAmount(cryptoAmount)
                            : '';

                        return setValues({
                            ...values,
                            cryptoAmount,
                            fiatAmount,
                        });
                    }
                }}
            />
            <div className='wallets-withdrawal-crypto-percentage__message'>
                <Text color='less-prominent' size='xs'>
                    {isValidInput && getPercentageMessage(values.cryptoAmount)}
                </Text>
            </div>
        </div>
    );
};

export default WithdrawalCryptoPercentageSelector;

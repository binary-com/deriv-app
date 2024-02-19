import React from 'react';
import { useFormikContext } from 'formik';
import { Text } from '@deriv-com/ui';
import { PercentageSelector } from '../../../../../../components/PercentageSelector';
import { useWithdrawalCryptoContext } from '../../../../provider';
import { TWithdrawalForm } from '../../../../types';
import { validateCryptoInput, validateFiatInput } from '../../../../utils';
import styles from './WithdrawalCryptoPercentageSelector.module.scss';

const WithdrawalCryptoPercentageSelector: React.FC = () => {
    const { setValues, values } = useFormikContext<TWithdrawalForm>();
    const { accountLimits, activeWallet, fractionalDigits, getConvertedFiatAmount, isClientVerified } =
        useWithdrawalCryptoContext();

    const getPercentageMessage = (value: string) => {
        const amount = parseFloat(value);
        if (!activeWallet?.balance || !activeWallet.display_balance) return;

        if (amount <= activeWallet.balance) {
            const percentage = Math.round((amount * 100) / activeWallet.balance);
            return `${percentage}% of available balance (${activeWallet.display_balance})`;
        }
    };

    const isInvalidInput =
        !validateCryptoInput(
            activeWallet,
            fractionalDigits,
            isClientVerified,
            accountLimits?.remainder ?? 0,
            values.cryptoAmount
        ) && !validateFiatInput(fractionalDigits, values.fiatAmount);

    return (
        <div className={styles['percentage-selector']}>
            <PercentageSelector
                amount={
                    activeWallet?.balance &&
                    !Number.isNaN(parseFloat(values.cryptoAmount)) &&
                    parseFloat(values.cryptoAmount) <= activeWallet.balance
                        ? parseFloat(values.cryptoAmount)
                        : 0
                }
                balance={activeWallet?.balance ?? 0}
                onChangePercentage={percentage => {
                    if (activeWallet?.balance) {
                        const fraction = percentage / 100;
                        const cryptoAmount = (activeWallet.balance * fraction).toFixed(fractionalDigits.crypto);
                        const fiatAmount = !validateCryptoInput(
                            activeWallet,
                            fractionalDigits,
                            isClientVerified,
                            accountLimits?.remainder ?? 0,
                            cryptoAmount
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
            <div className={styles['percentage-message']}>
                <Text color='less-prominent' size='xs'>
                    {isInvalidInput && getPercentageMessage(values.cryptoAmount)}
                </Text>
            </div>
        </div>
    );
};

export default WithdrawalCryptoPercentageSelector;

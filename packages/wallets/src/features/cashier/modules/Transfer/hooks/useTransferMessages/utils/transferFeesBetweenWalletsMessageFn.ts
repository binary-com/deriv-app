import { TMessageFnProps } from '../../../types';

const transferFeesBetweenWalletsMessageFn = ({
    displayMoney,
    sourceAccount,
    sourceAmount,
    targetAccount,
}: TMessageFnProps) => {
    if (!sourceAccount.currency || !sourceAccount.currencyConfig || !sourceAmount || !targetAccount.currency)
        return null;

    const minimumFeeAmount = 1 / Math.pow(10, sourceAccount.currencyConfig.fractional_digits);

    const minimumFeeText = displayMoney?.(
        minimumFeeAmount,
        sourceAccount.currency,
        sourceAccount.currencyConfig.fractional_digits
    );

    const feePercentage = sourceAccount.currencyConfig?.transfer_between_accounts.fees[targetAccount.currency];

    const feeAmount = (feePercentage * sourceAmount) / 100;

    const feeMessageText = displayMoney?.(
        feeAmount > minimumFeeAmount ? feeAmount : minimumFeeAmount,
        sourceAccount.currency,
        sourceAccount.currencyConfig.fractional_digits
    );

    return {
        key: 'TRANSFER_FEE_BETWEEN_WALLETS' as const,
        type: 'info' as const,
        values: {
            feeMessageText,
            feePercentage,
            minimumFeeText,
            targetAccountName: targetAccount.accountName,
        },
    };
};

export default transferFeesBetweenWalletsMessageFn;

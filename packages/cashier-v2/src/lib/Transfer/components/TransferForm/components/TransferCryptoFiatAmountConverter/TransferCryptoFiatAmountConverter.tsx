import React from 'react';
import { useFormikContext } from 'formik';
import { CryptoFiatConverter } from '../../../../../../components';
import { DeepNonNullable, TCurrency } from '../../../../../../types';
import { TTransferFormikContext } from '../../../../types';

const TransferCryptoFiatAmountConverter = () => {
    const { values } = useFormikContext<DeepNonNullable<TTransferFormikContext>>();

    const modifiedFromAccount = {
        balance: parseFloat(values.fromAccount.balance),
        currency: values.fromAccount.currency as TCurrency,
        displayBalance: values.fromAccount.displayBalance,
        fractionalDigits: values.fromAccount.currencyConfig?.fractional_digits,
        limits: {
            max: 100,
            min: 1,
        },
    };

    const modifiedToAccount = {
        currency: values.toAccount.currency as TCurrency,
        fractionalDigits: values.toAccount.currencyConfig?.fractional_digits,
    };

    return <CryptoFiatConverter fromAccount={modifiedFromAccount} toAccount={modifiedToAccount} />;
};

export default TransferCryptoFiatAmountConverter;

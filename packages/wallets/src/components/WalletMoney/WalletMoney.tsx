import React from 'react';
import { useCurrencyConfig } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';

type TProps = {
    amount?: number;
    currency?: string;
    hasSign?: boolean;
};

const WalletMoney: React.FC<TProps> = ({ amount = 0, currency = '', hasSign = false }) => {
    const { getConfig } = useCurrencyConfig();
    const currencyConfig = getConfig(currency);

    const fractionalDigits = currencyConfig?.fractional_digits;
    const displayCode = currencyConfig?.display_code;

    let sign = '';
    if (Number(amount) && (Number(amount) < 0 || hasSign)) {
        sign = Number(amount) > 0 ? '+' : '-';
    }

    const value = hasSign ? Math.abs(Number(amount)) : amount;

    const formattedAmount = displayMoney(value, '', {
        fractional_digits: fractionalDigits,
    });

    return (
        <>
            <span dir='ltr'>{(hasSign ? sign : '') + formattedAmount}</span>
            {currency ? `\u00A0${displayCode}` : ''}
        </>
    );
};

export default WalletMoney;

import { FormatUtils } from '@deriv-com/utils';
import { useAuthorize } from '../hooks';

type TCurrency = NonNullable<ReturnType<typeof useAuthorize>['data']['currency']>;

export const displayMoney = (
    amount = 0,
    currency: TCurrency = '',
    options?: {
        fractional_digits?: number;
    }
) => {
    const formattedAmount = FormatUtils.formatMoney(amount, {
        decimalPlaces: options?.fractional_digits ?? 2,
        locale: 'en-US',
    });

    return formattedAmount + (currency ? ` ${currency}` : '');
};

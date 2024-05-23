import { FormatUtils } from '@deriv-com/utils';
import { useAuthorize } from '../hooks';

type TCurrency = NonNullable<ReturnType<typeof useAuthorize>['data']['currency']>;
type TPreferredLanguage = ReturnType<typeof useAuthorize>['data']['preferred_language'];

export const displayMoney = (
    amount: number,
    currency: TCurrency,
    options?: {
        fractional_digits?: number;
        preferred_language?: TPreferredLanguage;
    }
) => {
    const formattedAmount = FormatUtils.formatMoney(amount, {
        decimalPlaces: options?.fractional_digits ?? 2,
        locale: options?.preferred_language ?? undefined,
    });

    return `${formattedAmount} ${currency}`;
};

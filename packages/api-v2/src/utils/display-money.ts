import { useAuthorize } from '../hooks';
import { FormatUtils } from '@deriv-com/utils';

type TCurrency = NonNullable<ReturnType<typeof useAuthorize>['data']['currency']>;
type TPreferredLanguage = ReturnType<typeof useAuthorize>['data']['preferred_language'];

export const displayMoney = (
    amount: number,
    currency: TCurrency,
    options?: {
        fractional_digits?: number;
        preferred_language?: TPreferredLanguage;
    }
) =>
    `${FormatUtils.formatMoney(amount, {
        decimalPlaces: options?.fractional_digits,
        locale: options?.preferred_language || 'en-US',
    })} ${currency}`;

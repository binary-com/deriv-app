import { Icon } from '@deriv/components';
import { capitalizeFirstLetter } from '@deriv/shared';
import { IconProps } from '../icon-types';

export const IsIconCurrency = (icon?: string): icon is Currency =>
    Currencies.find(currency => currency === icon) !== undefined;

const Currencies = [
    'AUD',
    'BCH',
    'BTC',
    'BUSD',
    'DAI',
    'ETH',
    'EURCHECK',
    'EUR',
    'EURS',
    'EUSDT',
    'GBP',
    'IDK',
    'LTC',
    'PAX',
    'TUSD',
    'TUSDT',
    'UNKNOWN',
    'USD',
    'USDC',
    'USDK',
    'UST',
    'VIRTUAL',
] as const;

// TODO: This probably can be moved somewhere else.
export type Currency = typeof Currencies[number];

const CurrencyIcon = ({ icon, ...props }: IconProps<Currency>) => {
    return <Icon icon={`IcCurrency${capitalizeFirstLetter(icon.toLowerCase())}`} {...props} />;
};

export default CurrencyIcon;

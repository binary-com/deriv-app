/* eslint-disable sort-keys */
import React, { CSSProperties } from 'react';
import { fiatIcons, horizontalCurrencyIcons, roundedCurrencyIcons } from '../../constants/icons';
import { THooks } from '../../types';

export const roundedIconWidth = {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
} as const;

export const defaultIconWidth = {
    xs: 48,
    sm: 64,
    md: 72,
    lg: 90,
    xl: 120,
} as const;

type TWalletCurrencyIconsProps = {
    className?: string;
    currency: THooks.WalletAccountsList['wallet_currency_type'];
    height?: CSSProperties['height'];
    rounded?: boolean;
    size?: keyof typeof defaultIconWidth | keyof typeof roundedIconWidth;
    width?: CSSProperties['width'];
};

const WalletCurrencyIcon: React.FC<TWalletCurrencyIconsProps> = ({
    className,
    currency,
    height,
    rounded = false,
    size = 'md',
    width,
}) => {
    const isFiat = fiatIcons.includes(currency as typeof fiatIcons[number]);
    const IconSize = rounded || isFiat ? roundedIconWidth[size] : defaultIconWidth[size];
    const Icon = rounded || isFiat ? roundedCurrencyIcons[currency] : horizontalCurrencyIcons[currency];

    if (!Icon) return null;

    return (
        <Icon
            className={className}
            data-testid='dt_wallet_currency_icon'
            height={height ?? '100%'}
            width={width ?? IconSize}
        />
    );
};

export default WalletCurrencyIcon;

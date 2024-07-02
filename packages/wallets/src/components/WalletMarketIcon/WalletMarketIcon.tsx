/* eslint-disable sort-keys */
import React, { CSSProperties } from 'react';
import { AppIcons, CFDPlatformIcons, MT5MarketIcons, PlatformIcons } from '../../constants/icons';
import { TIconTypes } from '../../types';

const Icons: TIconTypes = {
    ...AppIcons,
    ...MT5MarketIcons,
    ...CFDPlatformIcons,
    ...PlatformIcons,
};

const IconSizes = {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
} as const;

type TWalletIconProps = {
    className?: string;
    height?: CSSProperties['height'];
    icon: keyof typeof Icons;
    size?: keyof typeof IconSizes;
    width?: CSSProperties['width'];
};

const WalletMarketIcon = ({ className = '', height, icon, size = 'md', width }: TWalletIconProps) => {
    const IconSize = IconSizes[size];
    const Icon = Icons[icon];

    if (!Icon) {
        return null;
    }

    return (
        <Icon
            className={className}
            data-testid='dt_wallet_icon'
            height={height ?? IconSize}
            width={width ?? IconSize}
        />
    );
};

export default WalletMarketIcon;

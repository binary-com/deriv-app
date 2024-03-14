/* eslint-disable sort-keys */
import React from 'react';
import {
    AccountsDerivXIcon as DERIVX,
    AccountsDmt5DerivedIcon as MT5_DERIVED,
    AccountsDmt5FinancialIcon as MT5_FINANCIAL,
    AccountsDmt5SwfIcon as MT5_ALL,
    IconTypes,
} from '@deriv/quill-icons';

const iconMapper: Record<string, IconTypes> = {
    DERIVX,
    MT5_DERIVED,
    MT5_FINANCIAL,
    MT5_SYNTHETIC: MT5_FINANCIAL,
    MT5_ALL,
};

type TProps = {
    name: keyof typeof iconMapper;
    size: 'lg' | 'md' | 'sm' | 'xl';
};

const TradingAppIcon: React.FC<TProps> = ({ name, size }) => {
    const Icon = iconMapper[name];

    return <Icon iconSize={size} />;
};

export default TradingAppIcon;

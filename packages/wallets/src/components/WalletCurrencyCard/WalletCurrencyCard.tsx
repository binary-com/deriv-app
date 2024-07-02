/* eslint-disable sort-keys */
import React, { ComponentProps } from 'react';
import { fiatIcons } from '../../constants/icons';
import { THooks } from '../../types';
import { WalletCurrencyIcon } from '../WalletCurrencyIcon';
import { WalletGradientBackground } from '../WalletGradientBackground';
import './WalletCurrencyCard.scss';

const roundedIconWidth = {
    xs: '12',
    sm: '16',
    md: '24',
    lg: '32',
    xl: '48',
} as const;

const defaultIconWidth = {
    xs: '18',
    sm: '30',
    md: '43',
    lg: '58',
    xl: '83',
} as const;

type TProps = {
    className?: string;
    currency: THooks.WalletAccountsList['wallet_currency_type'];
    isDemo?: ComponentProps<typeof WalletGradientBackground>['isDemo'];
    size: keyof typeof defaultIconWidth | keyof typeof roundedIconWidth;
};

const WalletCurrencyCard: React.FC<TProps> = ({ className, currency, isDemo, size = 'lg' }: TProps) => {
    const isFiat = fiatIcons.includes(currency as typeof fiatIcons[number]);
    const IconSize = isFiat ? roundedIconWidth[size] : defaultIconWidth[size];
    return (
        <WalletGradientBackground bodyClassName={className} currency={currency} isDemo={isDemo} type='card'>
            <div className={`wallets-currency-card wallets-currency-card--${size}`}>
                <WalletCurrencyIcon currency={isDemo ? 'DEMO' : currency} width={IconSize} />
            </div>
        </WalletGradientBackground>
    );
};

export default WalletCurrencyCard;

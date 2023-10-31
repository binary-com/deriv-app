import React, { ComponentType, SVGAttributes } from 'react';
import './WalletBaseIcon.scss';

import IcWalletOptionsLight from '../../public/images/wallet/ic-wallet-options-light.svg';
import IcWalletOptionsDark from '../../public/images/wallet/ic-wallet-options-dark.svg';
import IcWalletDerivP2PLight from '../../public/images/wallet/ic-wallet-deriv-p2p-light.svg';
import IcWalletDerivP2PDark from '../../public/images/wallet/ic-wallet-deriv-p2p-dark.svg';

import IcWalletDerivDemoLight from '../../public/images/wallet/ic-wallet-deriv-demo-light.svg';
import IcWalletDerivDemoDark from '../../public/images/wallet/ic-wallet-deriv-demo-dark.svg';

import IcWalletCurrencyUsd from '../../public/images/currencies/usd.svg';
import IcWalletCurrencyEur from '../../public/images/currencies/eur.svg';
import IcWalletCurrencyAud from '../../public/images/currencies/aud.svg';
import IcWalletCurrencyGbp from '../../public/images/currencies/gbp.svg';

import IcWalletBitcoinLight from '../../public/images/currencies/btc.svg';
import IcWalletBitcoinDark from '../../public/images/currencies/btc-dark.svg';
import IcWalletEthereumLight from '../../public/images/currencies/eth.svg';
import IcWalletEthereumDark from '../../public/images/currencies/eth-dark.svg';
import IcWalletLiteCoinLight from '../../public/images/currencies/ltc.svg';
import IcWalletLiteCoinDark from '../../public/images/currencies/ltc-dark.svg';
import IcWalletUsdCoinLight from '../../public/images/currencies/usdc.svg';
import IcWalletUsdCoinDark from '../../public/images/currencies/usdc-dark.svg';
import IcWalletTetherLight from '../../public/images/currencies/usdt.svg';
import IcWalletTetherDark from '../../public/images/currencies/usdt-dark.svg';

interface IconTypes {
    [key: string]: ComponentType<SVGAttributes<SVGElement>>;
}

const ICONS: IconTypes = {
    IcWalletOptionsLight,
    IcWalletOptionsDark,
    IcWalletDerivP2PLight,
    IcWalletDerivP2PDark,

    IcWalletDerivDemoLight,
    IcWalletDerivDemoDark,
    IcWalletCurrencyUsd,
    IcWalletCurrencyEur,
    IcWalletCurrencyAud,
    IcWalletCurrencyGbp,
    IcWalletBitcoinLight,
    IcWalletBitcoinDark,
    IcWalletEthereumLight,
    IcWalletEthereumDark,
    IcWalletLiteCoinLight,
    IcWalletLiteCoinDark,
    IcWalletUsdCoinLight,
    IcWalletUsdCoinDark,
    IcWalletTetherDark,
    IcWalletTetherLight,
} as const;

type TWalletIconProps = {
    className?: string;
    icon: string;
};

const WalletBaseIcon = ({ className = '', icon }: TWalletIconProps) => {
    const IconSvg: ComponentType<SVGAttributes<SVGElement>> = ICONS[icon];

    if (!IconSvg) {
        return null;
    }

    return (
        <div className={`wallets-base-icon ${className}`} data-testid='dt_wallet_icon'>
            <IconSvg preserveAspectRatio='xMidYMid meet' />
        </div>
    );
};

export default WalletBaseIcon;

import React from 'react';
import { WalletCurrencyIcon } from '../WalletCurrencyIcon';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletMarketIcon } from '../WalletMarketIcon';
import './WalletsAppLinkedWithWalletIcon.scss';

type TAppIconProps = {
    appIcon: string;
    currency: string;
    isDemo?: boolean;
    size?: 'large' | 'medium' | 'small';
};

const WalletsAppLinkedWithWalletIcon = ({ appIcon, currency, isDemo = false, size = 'medium' }: TAppIconProps) => {
    return (
        <div
            className={`wallets-app-linked-with-wallet-icon wallets-app-linked-with-wallet-icon--${size}`}
            data-testid='dt_wallets_app_linked_with_wallet_icon'
        >
            {/* Wallet Icon */}
            <div className='wallets-app-linked-with-wallet-icon__wallet-icon'>
                <WalletGradientBackground currency={currency && currency.toUpperCase()} isDemo={isDemo}>
                    <WalletCurrencyIcon currency={isDemo ? 'DEMO' : currency} width={12} />
                </WalletGradientBackground>
            </div>
            {/* App Icon */}
            <div className='wallets-app-linked-with-wallet-icon__app-icon'>
                <WalletMarketIcon icon={appIcon} size='xs' />
            </div>
        </div>
    );
};

export default WalletsAppLinkedWithWalletIcon;

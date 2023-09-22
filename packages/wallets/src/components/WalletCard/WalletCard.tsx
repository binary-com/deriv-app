import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletListCardBadge } from '../WalletListCardBadge';
import { WalletListCardIcon } from '../WalletListCardIcon';
import './WalletCard.scss';

type TProps = {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
};

const WalletCard: React.FC<TProps> = ({ account }) => {
    const { currency, currency_config, display_balance, is_virtual, landing_company_name, wallet_currency_type } =
        account || {};

    const formattedLandingCompany =
        landing_company_name === 'virtual' ? 'Demo' : landing_company_name?.toUpperCase() || 'SVG';

    return (
        <div className='wallets-card'>
            <WalletGradientBackground
                currency={currency_config?.display_code || 'USD'}
                device='mobile'
                has_shine
                is_demo={is_virtual}
                type='card'
            >
                <div className='wallets-card__details'>
                    <div className='wallets-card__details__top'>
                        <WalletListCardIcon type={wallet_currency_type} />
                        <div className='wallets-card__details-landing_company'>
                            {landing_company_name && (
                                <WalletListCardBadge is_demo={account?.is_virtual} label={formattedLandingCompany} />
                            )}
                        </div>
                    </div>
                    <div className={`wallets-card__details__bottom${is_virtual ? '--virtual' : ''}`}>
                        <p className='wallets-card__details__bottom__currency'>{currency} Wallet</p>
                        <p className='wallets-card__details__bottom__balance'>
                            {display_balance} {currency}
                        </p>
                    </div>
                </div>
            </WalletGradientBackground>
        </div>
    );
};

export default WalletCard;

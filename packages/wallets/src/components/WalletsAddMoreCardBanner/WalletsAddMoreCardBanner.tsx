import React from 'react';
import type { useAvailableWallets } from '@deriv/api';
import CheckIcon from '../../public/images/check.svg';
import PlusIcon from '../../public/images/plus.svg';
import WalletAddMoreCurrencyIcon from '../WalletAddMoreCurrencyIcon';

type TWalletsAddMoreCardBannerProps = NonNullable<ReturnType<typeof useAvailableWallets>['data']>[0];

const WalletsAddMoreCardBanner = ({ currency, is_added, landing_company_name }: TWalletsAddMoreCardBannerProps) => {
    return (
        <div className='wallets-add-more__banner'>
            <div className='wallets-add-more__banner-header'>
                <span className='wallets-add-more__banner-logo'>
                    <WalletAddMoreCurrencyIcon currency={currency ? currency.toLowerCase() : ''} />
                </span>
                <span className='wallets-add-more__banner-landing-company'>
                    {landing_company_name ? landing_company_name.toUpperCase() : ''}
                </span>
            </div>
            <button
                className={`wallets-add-more__banner-button ${
                    is_added ? 'wallets-add-more__banner-button--is-added' : ''
                }`}
            >
                {is_added ? (
                    <CheckIcon className='wallets-add-more__banner-button-icon' />
                ) : (
                    <PlusIcon className='wallets-add-more__banner-button-icon' />
                )}
                {is_added ? 'Added' : 'Add'}
            </button>
        </div>
    );
};

export default WalletsAddMoreCardBanner;

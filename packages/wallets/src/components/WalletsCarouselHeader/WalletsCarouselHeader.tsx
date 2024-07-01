import React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { LegacyTransferIcon } from '@deriv/quill-icons';
import { IconButton, WalletText } from '../Base';
import { WalletCurrencyCard } from '../WalletCurrencyCard';
import './WalletsCarouselHeader.scss';

type TProps = {
    balance?: string;
    currency: string;
    hidden?: boolean;
    isBalanceLoading?: boolean;
    isDemo?: boolean;
};

const WalletsCarouselHeader: React.FC<TProps> = ({ balance, currency, hidden, isBalanceLoading, isDemo }) => {
    const history = useHistory();

    return (
        <div className={classNames('wallets-carousel-header', { 'wallets-carousel-header--hidden': hidden })}>
            <div className='wallets-carousel-header__content'>
                <WalletCurrencyCard currency={currency} isDemo={isDemo} size='md' />
                <div className='wallets-carousel-header__details'>
                    <WalletText color='general' size='sm'>
                        {currency} Wallet
                    </WalletText>
                    {isBalanceLoading ? (
                        <div
                            className='wallets-skeleton wallets-carousel-header__balance-loader'
                            data-testid='dt_wallets_carousel_header_balance_loader'
                        />
                    ) : (
                        <WalletText color='general' size='lg' weight='bold'>
                            {balance}
                        </WalletText>
                    )}
                </div>
            </div>
            <IconButton
                color='transparent'
                data-testid='dt_wallets_carousel_header_button'
                icon={<LegacyTransferIcon iconSize='xs' />}
                iconSize='lg'
                onClick={() => {
                    history.push('/wallet/account-transfer');
                }}
                size='lg'
            />
        </div>
    );
};

export default WalletsCarouselHeader;

import React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { LabelPairedArrowUpArrowDownSmBoldIcon } from '@deriv/quill-icons';
import { IconButton, WalletText } from '../Base';
import { WalletCurrencyCard } from '../WalletCurrencyCard';
import './WalletsCarouselHeader.scss';

type TProps = {
    balance?: string;
    currency: string;
    hidden?: boolean;
    isDemo?: boolean;
    isLoading?: boolean;
};

const WalletsCarouselHeader: React.FC<TProps> = ({ balance, currency, hidden, isDemo, isLoading }) => {
    const history = useHistory();

    return (
        <div className={classNames('wallets-carousel-header', { 'wallets-carousel-header--hidden': hidden })}>
            <div className='wallets-carousel-header__content'>
                <WalletCurrencyCard currency={currency} isDemo={isDemo} size='md' />
                <div className='wallets-carousel-header__details'>
                    <WalletText color='general' size='sm'>
                        {currency} Wallet
                    </WalletText>
                    {isLoading ? (
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
                aria-label='Transfer'
                className='wallets-carousel-header__button'
                color='white'
                data-testid='dt_wallets_carousel_header_button'
                icon={<LabelPairedArrowUpArrowDownSmBoldIcon />}
                onClick={() => history.push('/wallet/account-transfer')}
                size='md'
            />
        </div>
    );
};

export default WalletsCarouselHeader;

import React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { LabelPairedArrowUpArrowDownSmBoldIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { IconButton } from '../Base';
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
    const { localize } = useTranslations();
    const { isMobile } = useDevice();

    return (
        <div className={classNames('wallets-carousel-header', { 'wallets-carousel-header--hidden': hidden })}>
            <div className='wallets-carousel-header__content'>
                <WalletCurrencyCard currency={currency} isDemo={isDemo} size='md' />
                <div className='wallets-carousel-header__details'>
                    <Text color='general' size={isMobile ? 'sm' : 'xs'}>
                        {isDemo ? (
                            <Localize i18n_default_text='{{currency}} Demo Wallet' values={{ currency }} />
                        ) : (
                            <Localize i18n_default_text='{{currency}} Wallet' values={{ currency }} />
                        )}
                    </Text>
                    {isBalanceLoading ? (
                        <div
                            className='wallets-skeleton wallets-carousel-header__balance-loader'
                            data-testid='dt_wallets_carousel_header_balance_loader'
                        />
                    ) : (
                        <Text color='general' size={isMobile ? 'lg' : 'md'} weight='bold'>
                            {balance}
                        </Text>
                    )}
                </div>
            </div>
            <IconButton
                aria-label={localize('Transfer')}
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

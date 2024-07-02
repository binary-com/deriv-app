import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { TSubscribedBalance } from '../../types';
import { AccountsList } from '../AccountsList';
import { WalletsCarouselContent } from '../WalletsCarouselContent';
import { WalletsCarouselHeader } from '../WalletsCarouselHeader';
import './WalletsCarousel.scss';

const WalletsCarousel: React.FC<TSubscribedBalance> = ({ balance }) => {
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();
    const [hideWalletsCarouselHeader, setHideWalletsCarouselHeader] = useState(true);
    const contentRef = useRef(null);
    const location = useLocation();
    const [accountsActiveTabIndex, setAccountsActiveTabIndex] = useState(location.state?.accountsActiveTabIndex ?? 0);

    const { data: balanceData, isLoading: isBalanceLoading } = balance;

    const displayedBalance = useMemo(() => {
        return displayMoney?.(
            balanceData?.accounts?.[activeWallet?.loginid ?? '']?.balance ?? 0,
            activeWallet?.currency || '',
            {
                fractional_digits: activeWallet?.currency_config?.fractional_digits,
            }
        );
    }, [balanceData, activeWallet]);

    // useEffect hook to handle event for hiding/displaying WalletsCarouselHeader
    // walletsCarouselHeader will be displayed when WalletsCarouselContent is almost out of viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    setHideWalletsCarouselHeader(entry.isIntersecting);
                });
            },
            { threshold: 0.4 } // triggers when 40% of the element is left in view
        );

        const currentContentRef = contentRef.current;

        if (currentContentRef) {
            observer.observe(currentContentRef);
        }

        return () => {
            if (currentContentRef) {
                observer.unobserve(currentContentRef);
            }
        };
    }, []);

    return (
        <div className='wallets-carousel'>
            <div className='wallets-carousel__header'>
                {!isActiveWalletLoading && (
                    <WalletsCarouselHeader
                        balance={displayedBalance}
                        currency={activeWallet?.currency || 'USD'}
                        hidden={hideWalletsCarouselHeader}
                        isDemo={activeWallet?.is_virtual}
                        isLoading={isBalanceLoading}
                    />
                )}
                <div ref={contentRef}>
                    <WalletsCarouselContent accountsActiveTabIndex={accountsActiveTabIndex} />
                </div>
            </div>
            <AccountsList
                accountsActiveTabIndex={accountsActiveTabIndex}
                balance={balance}
                onTabClickHandler={setAccountsActiveTabIndex}
            />
        </div>
    );
};

export default WalletsCarousel;

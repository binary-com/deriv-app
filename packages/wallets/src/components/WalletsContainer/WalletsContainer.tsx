import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import { WalletsDisabledAccountsBanner } from '../WalletsDisabledAccountsBanner';
import './WalletsContainer.scss';

type TProps = {
    renderHeader: () => React.ReactNode;
};

const WalletsContainer: React.FC<React.PropsWithChildren<TProps>> = ({ children, renderHeader }) => {
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const walletsCardRef = useRef<HTMLDivElement>(null);

    const isDemo = activeWallet?.is_virtual;
    const isOpen = activeWallet?.is_active;
    const disabledWallets = wallets?.filter(wallet => wallet.is_disabled) ?? [];

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isOpen && walletsCardRef?.current) {
                walletsCardRef.current.style.scrollMarginTop = '80px';
                walletsCardRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [isOpen]);

    return (
        <div
            className={classNames('wallets-container', {
                'wallets-container--virtual': isDemo,
            })}
            data-testid='dt_wallets_container'
            ref={walletsCardRef}
        >
            {disabledWallets.length > 0 ? <WalletsDisabledAccountsBanner disabledAccounts={disabledWallets} /> : null}
            <div
                className={classNames('wallets-container__header', {
                    'wallets-container__header--virtual': isDemo,
                })}
                data-testid='dt_wallets_container_header'
            >
                {renderHeader()}
            </div>
            <div className='wallets-container__content wallets-container__content--visible'>{children}</div>
        </div>
    );
};

export default WalletsContainer;

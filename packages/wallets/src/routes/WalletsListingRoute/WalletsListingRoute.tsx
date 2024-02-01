import React, { useEffect } from 'react';
import { useActiveWalletAccount, useAuthorize, useWalletAccountsList } from '@deriv/api';
import { DesktopWalletsList, WalletsAddMoreCarousel, WalletsCarousel, WalletTourGuide } from '../../components';
import useDevice from '../../hooks/useDevice';
import './WalletsListingRoute.scss';

const WalletsListingRoute: React.FC = () => {
    const { isMobile } = useDevice();
    const { data: walletAccounts } = useWalletAccountsList();
    const { switchAccount } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();

    const firstLoginid = walletAccounts?.[0]?.loginid;

    useEffect(() => {
        if (!activeWallet) {
            const activeLinkedAccount = walletAccounts?.find(wallet => wallet.is_linked_account_active);
            if (activeLinkedAccount) {
                switchAccount(activeLinkedAccount.loginid);
            } else if (firstLoginid) {
                switchAccount(firstLoginid);
            }
        }
    }, [activeWallet, firstLoginid, switchAccount, walletAccounts]);

    return (
        <div className='wallets-listing-route'>
            {isMobile ? <WalletsCarousel /> : <DesktopWalletsList />}
            <WalletsAddMoreCarousel />
            {!isMobile && <WalletTourGuide />}
        </div>
    );
};

export default WalletsListingRoute;

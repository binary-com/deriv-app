import React from 'react';
import {
    DesktopWalletsList,
    WalletListHeader,
    WalletsAddMoreCarousel,
    WalletsCarousel,
    WalletTourGuide,
} from '../../components';
import ResetMT5PasswordHandler from '../../features/cfd/ResetMT5PasswordHandler';
import useDevice from '../../hooks/useDevice';
import './WalletsListingRoute.scss';

const WalletsListingRoute: React.FC = () => {
    const { isMobile } = useDevice();

    return (
        <div className='wallets-listing-route'>
            <WalletListHeader />
            {isMobile ? <WalletsCarousel /> : <DesktopWalletsList />}
            <WalletsAddMoreCarousel />
            <ResetMT5PasswordHandler />
            <WalletTourGuide />
        </div>
    );
};

export default WalletsListingRoute;

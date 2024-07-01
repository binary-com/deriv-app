import React, { lazy } from 'react';
import {
    WalletListHeader,
    WalletsAddMoreCarousel,
    WalletsCardLoader,
    WalletsResponsiveLoader,
    WalletTourGuide,
} from '../../components';
import ResetMT5PasswordHandler from '../../features/cfd/ResetMT5PasswordHandler';
import useDevice from '../../hooks/useDevice';
import './WalletsListingRoute.scss';

const LazyWalletsCarousel = lazy(() => import('../../components/WalletsCarousel/WalletsCarousel'));
const LazyDesktopWalletsList = lazy(() => import('../../components/DesktopWalletsList/DesktopWalletsList'));

const WalletsListingRoute: React.FC = () => {
    const { isMobile } = useDevice();
    return (
        <div className='wallets-listing-route'>
            <WalletListHeader />
            {isMobile ? (
                <React.Suspense fallback={<WalletsResponsiveLoader />}>
                    <LazyWalletsCarousel />
                </React.Suspense>
            ) : (
                <React.Suspense fallback={<WalletsCardLoader />}>
                    <LazyDesktopWalletsList />
                </React.Suspense>
            )}
            <WalletsAddMoreCarousel />
            <ResetMT5PasswordHandler />
            <WalletTourGuide />
        </div>
    );
};

export default WalletsListingRoute;

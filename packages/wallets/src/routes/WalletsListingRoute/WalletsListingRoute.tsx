import React, { lazy } from 'react';
import { useWalletAccountsList } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import {
    WalletListHeader,
    WalletsAddMoreCarousel,
    WalletsCardLoader,
    WalletsResponsiveLoader,
    WalletTourGuide,
} from '../../components';
import ResetMT5PasswordHandler from '../../features/cfd/ResetMT5PasswordHandler';
import './WalletsListingRoute.scss';

const LazyWalletsCarousel = lazy(() => import('../../components/WalletsCarousel/WalletsCarousel'));
const LazyDesktopWalletsList = lazy(() => import('../../components/DesktopWalletsList/DesktopWalletsList'));

const WalletsListingRoute: React.FC = () => {
    const { isDesktop } = useDevice();
    const { data: wallets } = useWalletAccountsList();
    const hasAnyActiveRealWallets = wallets?.some(wallet => !wallet.is_virtual && !wallet.is_disabled);

    return (
        <div className='wallets-listing-route'>
            <WalletListHeader />
            {isDesktop ? (
                <React.Suspense fallback={<WalletsCardLoader />}>
                    <LazyDesktopWalletsList />
                </React.Suspense>
            ) : (
                <React.Suspense fallback={<WalletsResponsiveLoader />}>
                    <LazyWalletsCarousel />
                </React.Suspense>
            )}
            {hasAnyActiveRealWallets && <WalletsAddMoreCarousel />}
            <ResetMT5PasswordHandler />
            <WalletTourGuide />
        </div>
    );
};

export default WalletsListingRoute;

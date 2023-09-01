import React from 'react';
import WalletList from './components/WalletList';
import WalletsCarousel from './components/WalletCarousel';
import AddMoreWalletsCarousel from './components/AddMoreWalletsCarousel';
import IcBrandDerivGo from './public/ic-brand-derivgo.svg';
import './app-content.scss';

const AppContent: React.FC = () => {
    return (
        <div>
            <div className='wallet-app-content-icon' />
            <IcBrandDerivGo width={25} height={25} />
            <WalletList />
            <WalletsCarousel />
            <AddMoreWalletsCarousel />
        </div>
    );
};

export default AppContent;

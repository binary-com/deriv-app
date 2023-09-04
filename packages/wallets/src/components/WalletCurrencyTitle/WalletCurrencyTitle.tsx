import React from 'react';
import './WalletCurrencyTitle.scss';

type TProps = {
    currency: string;
};

const WalletCurrencyTitle: React.FC<TProps> = ({ currency }) => {
    return <div className='wallets-currency__title'>{currency} Wallet</div>;
};

export default WalletCurrencyTitle;

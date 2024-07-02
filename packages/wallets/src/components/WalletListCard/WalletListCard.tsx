import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { TSubscribedBalance } from '../../types';
import { WalletCurrencyCard } from '../WalletCurrencyCard';
import { WalletListCardDetails } from '../WalletListCardDetails';
import './WalletListCard.scss';

const WalletListCard: React.FC<TSubscribedBalance> = ({ balance }) => {
    const { data: activeWallet } = useActiveWalletAccount();

    const currency = activeWallet?.wallet_currency_type || 'USD';
    const isDemo = activeWallet?.is_virtual;

    return (
        <div className='wallets-list-card'>
            <div className='wallets-list-card__container'>
                <div className='wallets-list-card__details'>
                    <WalletCurrencyCard currency={isDemo ? 'Demo' : currency} isDemo={isDemo} size='xl' />
                    <WalletListCardDetails balance={balance} />
                </div>
            </div>
        </div>
    );
};

export default WalletListCard;

import React, { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { WalletText } from '../Base';
import WalletListCardActions from '../WalletListCardActions/WalletListCardActions';
import { WalletListCardBalance } from '../WalletListCardBalance';
import WalletListCardDropdown from '../WalletListCardDropdown/WalletListCardDropdown';
import './WalletListCardDetails.scss';

const WalletListCardDetails: React.FC = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const isDemo: boolean = useMemo(() => {
        if (typeof activeWallet?.is_virtual === 'boolean') {
            return activeWallet.is_virtual;
        }
        return isDemo || false;
    }, [activeWallet?.is_virtual]);

    return (
        <div className='wallets-list-details__container'>
            {isDemo ? (
                <WalletText>
                    <Trans defaults='USD Demo Wallet' />
                </WalletText>
            ) : (
                <WalletListCardDropdown />
            )}
            <div className='wallets-list-details__content'>
                <WalletListCardBalance />
                <WalletListCardActions />
            </div>
        </div>
    );
};

export default WalletListCardDetails;

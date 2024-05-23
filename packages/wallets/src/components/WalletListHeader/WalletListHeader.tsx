import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import useDevice from '../../hooks/useDevice';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { WalletText } from '../Base';
import './WalletListHeader.scss';

const WalletListHeader: React.FC = () => {
    const { isMobile } = useDevice();
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const switchWalletAccount = useWalletAccountSwitcher();

    const demoAccount = wallets?.find(wallet => wallet.is_virtual)?.loginid;
    const firstRealAccount = wallets?.find(wallet => !wallet.is_virtual)?.loginid;
    const shouldShowSwitcher = demoAccount && firstRealAccount;
    const isDemo = activeWallet?.is_virtual;
    const [isChecked, setIsChecked] = useState(!isDemo);

    const handleToggle = () => {
        setIsChecked(prev => !prev);
        if (firstRealAccount && activeWallet?.loginid === demoAccount) {
            switchWalletAccount(firstRealAccount);
        } else if (demoAccount) {
            switchWalletAccount(demoAccount);
        }
    };

    useEffect(() => {
        setIsChecked(!isDemo);
    }, [isDemo]);

    if (isMobile) return null;

    return (
        <div className='wallets-list-header'>
            <WalletText size='xl' weight='bold'>
                Trader&apos;s Hub
            </WalletText>
            {shouldShowSwitcher && (
                <div>
                    <div className='wallets-list-header__label'>
                        <WalletText size='sm'>
                            <Trans defaults='Demo' />
                        </WalletText>
                        <WalletText size='sm'>
                            <Trans defaults='Real' />
                        </WalletText>
                    </div>
                    <label className='wallets-list-header__switcher' htmlFor='wallets-list-header__switcher'>
                        <input
                            checked={isChecked}
                            className='wallets-list-header__switcher-input'
                            data-testid='wallets_list_header__switcher_input'
                            id='wallets-list-header__switcher'
                            onChange={handleToggle}
                            type='checkbox'
                        />
                        <span className='wallets-list-header__slider' />
                    </label>
                </div>
            )}
        </div>
    );
};

export default WalletListHeader;

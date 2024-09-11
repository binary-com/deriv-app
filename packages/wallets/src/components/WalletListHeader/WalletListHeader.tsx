import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import useDevice from '../../hooks/useDevice';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import './WalletListHeader.scss';

const WalletListHeader: React.FC = () => {
    const { isMobile } = useDevice();
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const switchWalletAccount = useWalletAccountSwitcher();

    const demoAccount = wallets?.find(wallet => wallet.is_virtual)?.loginid;
    const firstRealAccount = wallets?.find(wallet => !wallet.is_virtual && !wallet.is_disabled)?.loginid;
    const hasAnyActiveRealWallets = wallets?.some(wallet => !wallet.is_virtual && !wallet.is_disabled);
    const shouldShowSwitcher = (demoAccount && firstRealAccount) || !hasAnyActiveRealWallets;
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
            <Text size='xl' weight='bold'>
                <Localize i18n_default_text="Trader's Hub" />
            </Text>
            {shouldShowSwitcher && (
                <div>
                    <div className='wallets-list-header__label'>
                        <div className='wallets-list-header__label-item'>
                            <Text size='sm'>
                                <Localize i18n_default_text='Demo' />
                            </Text>
                        </div>
                        <div
                            className={classNames('wallets-list-header__label-item', {
                                'wallets-list-header__label-item--disabled': !hasAnyActiveRealWallets,
                            })}
                        >
                            <Text size='sm'>
                                <Localize i18n_default_text='Real' />
                            </Text>
                        </div>
                    </div>
                    <label
                        className={classNames('wallets-list-header__switcher', {
                            'wallets-list-header__switcher--disabled': !hasAnyActiveRealWallets,
                        })}
                        htmlFor='wallets-list-header__switcher'
                    >
                        <input
                            checked={isChecked}
                            className='wallets-list-header__switcher-input'
                            data-testid='wallets_list_header__switcher_input'
                            disabled={!hasAnyActiveRealWallets}
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

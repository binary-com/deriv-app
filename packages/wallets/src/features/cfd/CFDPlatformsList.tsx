import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import CFDPlatformsListEmptyState from './CFDPlatformsListEmptyState';
import { CTraderList, MT5PlatformsList, OtherCFDPlatformsList } from './components';
import './CFDPlatformsList.scss';

import { useModal } from '../../components/ModalProvider';
import { MT5PasswordModal } from './modals';

const CFDPlatformsList = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const { show } = useModal();

    return (
        <div className='wallets-cfd-list'>
            <section className='wallets-cfd-list__header'>
                {!isMobile && (
                    <div className='wallets-cfd-list__header-title'>
                        <h1>CFDs</h1>
                    </div>
                )}
                <div className='wallets-cfd-list__header-description'>
                    <h1>
                        Trade with leverage and tight spreads for better returns on trades.{' '}
                        <a
                            className='wallets-cfd-list__header-description__link'
                            href='#'
                            onClick={() => show(<MT5PasswordModal marketType='all' platform='mt5' />)}
                        >
                            Learn more
                        </a>
                    </h1>
                </div>
            </section>
            {activeWallet?.currency_config?.is_crypto ? (
                <CFDPlatformsListEmptyState />
            ) : (
                <React.Fragment>
                    <MT5PlatformsList />
                    {activeWallet?.is_virtual && <CTraderList />}
                    <OtherCFDPlatformsList />
                </React.Fragment>
            )}
        </div>
    );
};

export default CFDPlatformsList;

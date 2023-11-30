import React from 'react';
import { Trans } from 'react-i18next';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletButton, WalletLink, WalletText } from '../../components/Base';
import useDevice from '../../hooks/useDevice';
import CFDPlatformsListEmptyState from './CFDPlatformsListEmptyState';
import { CTraderList, MT5PlatformsList, OtherCFDPlatformsList } from './components';
import './CFDPlatformsList.scss';

type TProps = {
    onMT5PlatformListLoaded?: (value: boolean) => void;
};

const CFDPlatformsList: React.FC<TProps> = ({ onMT5PlatformListLoaded }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();

    const descriptionLink = (
        <Trans
            components={[<WalletLink key={0} staticUrl='/trade-types/cfds/' />]}
            defaults='Trade with leverage and tight spreads for better returns on trades. <0>Learn more</0>'
        />
    );

    return (
        <div className='wallets-cfd-list'>
            <section className='wallets-cfd-list__header'>
                {isMobile ? (
                    <div className='wallets-cfd-list__header-description'>
                        <WalletText>{descriptionLink}</WalletText>
                        <WalletButton size='sm' text='Compare accounts' textSize='sm' variant='ghost' />
                    </div>
                ) : (
                    <div>
                        <div className='wallets-cfd-list__header-compare-accounts'>
                            <WalletText size='xl' weight='bold'>
                                <Trans defaults='CFDs' />
                            </WalletText>
                            <WalletButton size='sm' text='Compare accounts' variant='ghost' />
                        </div>
                        <WalletText>{descriptionLink}</WalletText>
                    </div>
                )}
            </section>
            {activeWallet?.currency_config?.is_crypto ? (
                <CFDPlatformsListEmptyState />
            ) : (
                <React.Fragment>
                    <MT5PlatformsList onMT5PlatformListLoaded={onMT5PlatformListLoaded} />
                    <CTraderList />
                    <OtherCFDPlatformsList />
                </React.Fragment>
            )}
        </div>
    );
};

export default CFDPlatformsList;

import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { WalletLink } from '../../components/Base';
import CFDPlatformsListEmptyState from './CFDPlatformsListEmptyState';
import { CFDPlatformsListAccounts } from './components';
import './CFDPlatformsList.scss';

const CFDPlatformsList: React.FC = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isDesktop } = useDevice();
    const history = useHistory();

    return (
        <div className='wallets-cfd-list'>
            <section className='wallets-cfd-list__header'>
                {isDesktop ? (
                    <React.Fragment>
                        <div className='wallets-cfd-list__header-compare-accounts'>
                            <Text size='xl' weight='bold'>
                                <Localize i18n_default_text='CFDs' />
                            </Text>
                            <Button
                                color='primary-transparent'
                                onClick={() => {
                                    history.push('/compare-accounts');
                                }}
                                size='sm'
                                variant='ghost'
                            >
                                <Localize i18n_default_text='Compare accounts' />
                            </Button>
                        </div>
                        <Text align='start' size='md'>
                            <Localize
                                components={[<WalletLink key={0} staticUrl='/trade-types/cfds/' />]}
                                i18n_default_text='Trade bigger positions with less capital on a wide range of global markets. <0>Learn more</0>'
                            />
                        </Text>
                    </React.Fragment>
                ) : (
                    <div className='wallets-cfd-list__header-description'>
                        <Text align='start' size='sm'>
                            <Localize
                                components={[
                                    <a
                                        className='wallets-cfd-list__header-description__link'
                                        href='https://deriv.com/trade-types/cfds/'
                                        key={0}
                                        rel='noopener noreferrer'
                                        target='_blank'
                                    />,
                                ]}
                                i18n_default_text='Trade bigger positions with less capital on a wide range of global markets. <0>Learn more</0>'
                            />
                        </Text>
                        <Button
                            color='primary-transparent'
                            onClick={() => {
                                history.push('/compare-accounts');
                            }}
                            size='sm'
                            textSize='sm'
                            variant='ghost'
                        >
                            <Localize i18n_default_text='Compare accounts' />
                        </Button>
                    </div>
                )}
            </section>
            {activeWallet?.currency_config?.is_crypto ? <CFDPlatformsListEmptyState /> : <CFDPlatformsListAccounts />}
        </div>
    );
};

export default CFDPlatformsList;

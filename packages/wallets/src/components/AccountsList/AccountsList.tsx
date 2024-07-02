import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from '@deriv-com/ui';
import { CFDPlatformsList } from '../../features';
import useDevice from '../../hooks/useDevice';
import { TSubscribedBalance } from '../../types';
import { OptionsAndMultipliersListing } from '../OptionsAndMultipliersListing';
import './AccountsList.scss';

const AccountsList: FC<TSubscribedBalance> = ({ balance }) => {
    const { isMobile } = useDevice();
    const { t } = useTranslation();

    if (isMobile) {
        return (
            <Tabs activeTab='CFDs' className='wallets-accounts-list__tabs' wrapperClassName='wallets-accounts-list'>
                <Tab className='wallets-accounts-list__tab' title={t('CFDs')}>
                    <CFDPlatformsList />
                </Tab>
                <Tab className='wallets-accounts-list__tab' title={t('Options')}>
                    <OptionsAndMultipliersListing balance={balance} />
                </Tab>
            </Tabs>
        );
    }

    return (
        <div className='wallets-accounts-list' data-testid='dt_desktop_accounts_list'>
            <div className='wallets-accounts-list__content'>
                <CFDPlatformsList />
                <OptionsAndMultipliersListing balance={balance} />
            </div>
        </div>
    );
};

export default AccountsList;

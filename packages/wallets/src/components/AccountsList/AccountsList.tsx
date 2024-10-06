import React, { FC, useCallback } from 'react';
import { useTranslations } from '@deriv-com/translations';
import { Divider, Tab, Tabs, useDevice } from '@deriv-com/ui';
import { CFDPlatformsList } from '../../features';
import { OptionsAndMultipliersListing } from '../OptionsAndMultipliersListing';
import './AccountsList.scss';

type TProps = {
    accountsActiveTabIndex?: number;
    onTabClickHandler?: React.Dispatch<React.SetStateAction<number>>;
};

const AccountsList: FC<TProps> = ({ accountsActiveTabIndex, onTabClickHandler }) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const tabs = [localize('CFDs'), localize('Options')];

    const onChangeTabHandler = useCallback((activeTab: number) => onTabClickHandler?.(activeTab), [onTabClickHandler]);

    if (isDesktop)
        return (
            <div className='wallets-accounts-list' data-testid='dt_desktop_accounts_list'>
                <div className='wallets-accounts-list__content'>
                    <Divider color='var(--border-divider)' height={2} />
                    <CFDPlatformsList />
                    <Divider color='var(--border-divider)' height={2} />
                    <OptionsAndMultipliersListing />
                </div>
            </div>
        );

    return (
        <Tabs
            activeTab={tabs[accountsActiveTabIndex ?? 0]}
            className='wallets-accounts-list__tabs'
            onChange={onChangeTabHandler}
            wrapperClassName='wallets-accounts-list'
        >
            <Tab className='wallets-accounts-list__tab' title={localize('CFDs')}>
                <CFDPlatformsList />
                <Divider className='wallets-accounts-list__divider' color='var(--wallets-banner-border-color)' />
            </Tab>
            <Tab className='wallets-accounts-list__tab' title={localize('Options')}>
                <OptionsAndMultipliersListing />
                <Divider className='wallets-accounts-list__divider' color='var(--wallets-banner-border-color)' />
            </Tab>
        </Tabs>
    );
};

export default AccountsList;

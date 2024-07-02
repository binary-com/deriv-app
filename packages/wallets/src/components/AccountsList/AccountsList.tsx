import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CFDPlatformsList } from '../../features';
import useDevice from '../../hooks/useDevice';
import { TSubscribedBalance } from '../../types';
import { OptionsAndMultipliersListing } from '../OptionsAndMultipliersListing';
import {
    WalletsPrimaryTabList,
    WalletsPrimaryTabPanel,
    WalletsPrimaryTabPanels,
    WalletsPrimaryTabs,
} from '../WalletsPrimaryTabs';
import './AccountsList.scss';

type TProps = {
    accountsActiveTabIndex?: number;
    balance: TSubscribedBalance['balance'];
    onTabClickHandler?: React.Dispatch<React.SetStateAction<number>>;
};

const AccountsList: FC<TProps> = ({ accountsActiveTabIndex, balance, onTabClickHandler }) => {
    const { isMobile } = useDevice();
    const { t } = useTranslation();

    const onChangeTabHandler = useCallback((activeTab: number) => onTabClickHandler?.(activeTab), [onTabClickHandler]);

    if (isMobile) {
        return (
            <WalletsPrimaryTabs
                className='wallets-accounts-list'
                initialActiveTabIndex={accountsActiveTabIndex}
                onChangeTabHandler={onChangeTabHandler}
            >
                <WalletsPrimaryTabList list={[t('CFDs'), t('Options')]} />
                <WalletsPrimaryTabPanels>
                    <WalletsPrimaryTabPanel>
                        <CFDPlatformsList />
                    </WalletsPrimaryTabPanel>
                    <WalletsPrimaryTabPanel>
                        <OptionsAndMultipliersListing balance={balance} />
                    </WalletsPrimaryTabPanel>
                </WalletsPrimaryTabPanels>
            </WalletsPrimaryTabs>
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

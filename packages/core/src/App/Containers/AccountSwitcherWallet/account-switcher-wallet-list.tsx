import React from 'react';
import { AccountSwitcherWalletItem } from './account-switcher-wallet-item';
import { TStores } from '@deriv-lib/stores/types';
import './account-switcher-wallet-list.scss';

type TAccountSwitcherWalletListProps = {
    wallets: TStores['client']['wallet_list'];
    closeAccountsDialog: () => void;
};

export const AccountSwitcherWalletList = ({ wallets, closeAccountsDialog }: TAccountSwitcherWalletListProps) => (
    <div className='account-switcher-wallet-list'>
        {wallets?.map(account => {
            const show_badge = account?.is_malta_wallet || account?.is_virtual;
            return (
                <AccountSwitcherWalletItem
                    key={account.dtrade_loginid}
                    account={account}
                    closeAccountsDialog={closeAccountsDialog}
                    show_badge={show_badge}
                />
            );
        })}
    </div>
);

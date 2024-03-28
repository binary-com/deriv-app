import React from 'react';
import { useHistory } from 'react-router';
import { Icon, Text, ThemedScrollbars, useOnClickOutside } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useStoreWalletAccountsList } from '@deriv/hooks';
import { AccountSwitcherWalletList } from './account-switcher-wallet-list';
import './account-switcher-wallet.scss';

type TAccountSwitcherWalletProps = {
    is_visible: boolean;
    toggle: (value?: boolean) => void;
};

export const AccountSwitcherWallet = observer(({ is_visible, toggle }: TAccountSwitcherWalletProps) => {
    const { data: wallet_list } = useStoreWalletAccountsList();
    const dtrade_account_wallets = wallet_list?.filter(wallet => wallet.dtrade_loginid);

    const history = useHistory();

    const wrapper_ref = React.useRef<HTMLDivElement>(null);

    const validateClickOutside = (event: MouseEvent) => {
        const checkAllParentNodes = (node: HTMLElement): boolean => {
            if (node?.classList?.contains('acc-info__wallets')) return true;
            const parent = node?.parentNode as HTMLElement;
            if (parent) return checkAllParentNodes(parent);
            return false;
        };

        return is_visible && !checkAllParentNodes(event.target as HTMLElement);
    };

    const closeAccountsDialog = React.useCallback(() => {
        toggle(false);
    }, [toggle]);

    useOnClickOutside(wrapper_ref, closeAccountsDialog, validateClickOutside);

    const handleTradersHubRedirect = async () => {
        closeAccountsDialog();
        history.push(routes.wallets);
    };

    return (
        <div className='account-switcher-wallet' ref={wrapper_ref}>
            <div className='account-switcher-wallet__header'>
                <Text as='h4' weight='bold' size='xs'>
                    <Localize i18n_default_text='Deriv Apps accounts' />
                </Text>
            </div>
            <ThemedScrollbars height={450}>
                <AccountSwitcherWalletList wallets={dtrade_account_wallets} closeAccountsDialog={closeAccountsDialog} />
            </ThemedScrollbars>
            <button
                className='account-switcher-wallet__looking-for-cfds'
                onClick={handleTradersHubRedirect}
                type='button'
            >
                <Text size='xs' line_height='xl'>
                    <Localize i18n_default_text='Looking for CFDs? Go to Trader’s Hub' />
                </Text>
                <Icon
                    data_testid='dt_go_to_arrow'
                    icon='IcChevronDownBold'
                    className='account-switcher-wallet__arrow'
                />
            </button>
        </div>
    );
});

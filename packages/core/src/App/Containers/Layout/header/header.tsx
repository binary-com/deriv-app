import React from 'react';
import { useLocation } from 'react-router-dom';
import { useFeatureFlags } from '@deriv/hooks';
import { useReadLocalStorage } from 'usehooks-ts';
import { makeLazyLoader, moduleLoader, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv/components';

const HeaderFallback = () => <div className='header' />;

const DefaultHeader = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "default-header" */ './default-header')),
    () => <HeaderFallback />
)();

const DefaultHeaderWallets = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "default-header-wallets" */ './default-header-wallets')),
    () => <HeaderFallback />
)();

const DTraderHeader = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "dtrader-header" */ './dtrader-header')),
    () => <HeaderFallback />
)();

const DTraderHeaderWallets = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "dtrader-header-wallets" */ './dtrader-header-wallets')),
    () => <HeaderFallback />
)();

const TradersHubHeader = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "traders-hub-header" */ './traders-hub-header')),
    () => <HeaderFallback />
)();

const TradersHubHeaderWallets = makeLazyLoader(
    () =>
        moduleLoader(() => import(/* webpackChunkName: "traders-hub-header-wallets" */ './traders-hub-header-wallets')),
    () => <HeaderFallback />
)();

const DTraderV2Header = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "dtrader-v2-header" */ './dtrader-v2-header')),
    () => <HeaderFallback />
)();

const Header = observer(() => {
    const { client } = useStore();
    const { accounts, has_wallet, is_logged_in, setAccounts, loginid, switchAccount } = client;
    const { pathname } = useLocation();
    const { is_mobile } = useDevice();

    const is_wallets_cashier_route = pathname.includes(routes.wallets_cashier);

    const traders_hub_routes =
        [
            routes.traders_hub,
            routes.traders_hub_v2,
            routes.account,
            routes.cashier,
            routes.wallets,
            routes.wallets_compare_accounts,
            routes.compare_accounts,
            routes.compare_cfds,
        ].includes(pathname) ||
        pathname.startsWith(routes.compare_cfds) ||
        is_wallets_cashier_route;

    const client_accounts = useReadLocalStorage('client.accounts');
    const { is_dtrader_v2_enabled } = useFeatureFlags();

    React.useEffect(() => {
        if (has_wallet && is_logged_in) {
            const accounts_keys = Object.keys(accounts ?? {});
            const client_accounts_keys = Object.keys(client_accounts ?? {});
            if (client_accounts_keys.length > accounts_keys.length) {
                setAccounts(
                    client_accounts as Record<string, ReturnType<typeof useStore>['client']['accounts'][number]>
                );
            }
        }
    }, [accounts, client_accounts, has_wallet, is_logged_in, loginid, setAccounts, switchAccount]);

    if (is_logged_in) {
        let result;
        switch (true) {
            case pathname === routes.onboarding:
                result = null;
                break;
            case is_dtrader_v2_enabled &&
                is_mobile &&
                (pathname === routes.trade ||
                    pathname.startsWith('/contract/') === routes.contract.startsWith('/contract/')):
                result = <DTraderV2Header />;
                break;
            case traders_hub_routes:
                result = has_wallet ? <TradersHubHeaderWallets /> : <TradersHubHeader />;
                break;
            default:
                result = has_wallet ? <DTraderHeaderWallets /> : <DTraderHeader />;
                break;
        }
        return result;
    } else if (pathname === routes.onboarding) {
        return null;
    }
    return has_wallet ? <DefaultHeaderWallets /> : <DefaultHeader />;
});

export default Header;

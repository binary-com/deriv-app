import React, { useEffect } from 'react';
import { Redirect as RouterRedirect, useLocation } from 'react-router-dom';
import { makeLazyLoader, routes, moduleLoader, getDtraderStandaloneDomain , redirectToDTraderStandalone } from '@deriv/shared';
import { Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import Redirect from 'App/Containers/Redirect';
import RootComponent from 'App/Containers/RootComponent';
import Endpoint from 'Modules/Endpoint';

const CFDCompareAccounts = React.lazy(() =>
    import(/* webpackChunkName: "cfd-compare-accounts" */ '@deriv/cfd/src/Containers/cfd-compare-accounts')
);

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const Trader = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "trader" */ '@deriv/trader');
    })
);

const Reports = React.lazy(() => {
    // eslint-disable-next-line import/no-unresolved
    return import(/* webpackChunkName: "reports" */ '@deriv/reports');
});

const CFD = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "cfd" */ '@deriv/cfd');
    })
);

const Account = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "account" */ '@deriv/account');
    })
);

const Cashier = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "cashier" */ '@deriv/cashier');
    })
);

const Bot = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "bot-web-ui-app" */ '@deriv/bot-web-ui');
    })
);

const P2P = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "p2p" */ '@deriv/p2p');
    })
);

const RedirectToNewTradersHub = () => {
    return <Redirect to={routes.traders_hub} />;
};

const RedirectToDtraderStandalone = () => {
    const location = useLocation();
    const dtraderStandaloneDomain = getDtraderStandaloneDomain();

    useEffect(() => {
        const currentPath = location.pathname + location.search + location.hash; // full path including query params and hash if any
        const targetUrl = `https://${dtraderStandaloneDomain}${currentPath}`;

        // Redirect to the constructed URL
        window.location.href = targetUrl;
    }, [location, dtraderStandaloneDomain]);

    return null; // No need to render anything since we're redirecting
};

const getModules = () => {
    const modules = [
        {
            path: routes.bot,
            component: Bot,
            // Don't use `Localize` component since native html tag like `option` cannot render them
            getTitle: () => localize('Bot'),
        },
        {
            path: routes.reports,
            component: Reports,
            getTitle: () => localize('Reports'),
            icon_component: 'IcReports',
            is_authenticated: true,
            routes: [
                {
                    path: routes.positions,
                    component: Reports,
                    getTitle: () => localize('Open positions'),
                    icon_component: 'IcOpenPositions',
                    default: true,
                },
                {
                    path: routes.profit,
                    component: Reports,
                    getTitle: () => localize('Trade table'),
                    icon_component: 'IcProfitTable',
                },
                {
                    path: routes.statement,
                    component: Reports,
                    getTitle: () => localize('Statement'),
                    icon_component: 'IcStatement',
                },
            ],
        },
        {
            path: routes.dxtrade,
            component: props => <CFD {...props} platform='dxtrade' />,
            getTitle: () => localize('Deriv X'),
        },
        {
            path: routes.compare_cfds,
            component: CFDCompareAccounts,
            getTitle: () => localize('Compare CFD accounts'),
        },
        {
            path: routes.mt5,
            component: props => <CFD {...props} platform='mt5' />,
            getTitle: () => localize('MT5'),
        },
        {
            path: routes.account_closed,
            component: Account,
            getTitle: () => localize('Account deactivated'),
        },
        {
            path: routes.account,
            component: Account,
            getTitle: () => localize('Account Settings'),
            icon_component: 'IcUserOutline',
            is_authenticated: true,
            routes: [
                {
                    getTitle: () => localize('Profile'),
                    icon: 'IcUserOutline',
                    subroutes: [
                        {
                            path: routes.personal_details,
                            component: Account,
                            getTitle: () => localize('Personal details'),
                            default: true,
                        },

                        {
                            path: routes.languages,
                            component: Account,
                            getTitle: () => localize('Languages'),
                        },
                    ],
                },
                {
                    getTitle: () => localize('Assessments'),
                    icon: 'IcAssessment',
                    subroutes: [
                        {
                            path: routes.trading_assessment,
                            component: Account,
                            getTitle: () => localize('Trading assessment'),
                        },
                        {
                            path: routes.financial_assessment,
                            component: Account,
                            getTitle: () => localize('Financial assessment'),
                        },
                    ],
                },
                {
                    getTitle: () => localize('Verification'),
                    icon: 'IcVerification',
                    subroutes: [
                        {
                            path: routes.proof_of_identity,
                            component: Account,
                            getTitle: () => localize('Proof of identity'),
                        },
                        {
                            path: routes.proof_of_address,
                            component: Account,
                            getTitle: () => localize('Proof of address'),
                        },
                        {
                            path: routes.proof_of_ownership,
                            component: Account,
                            getTitle: () => localize('Proof of ownership'),
                        },
                        {
                            path: routes.proof_of_income,
                            component: Account,
                            getTitle: () => localize('Proof of income'),
                        },
                    ],
                },
                {
                    getTitle: () => localize('Security and safety'),
                    icon: 'IcSecurity',
                    subroutes: [
                        {
                            path: routes.passwords,
                            component: Account,
                            getTitle: () => localize('Email and passwords'),
                        },
                        {
                            path: routes.passkeys,
                            component: Account,
                            getTitle: () => (
                                <>
                                    {localize('Passkeys')}
                                    <span className='dc-vertical-tab__header--new'>{localize('NEW')}!</span>
                                </>
                            ),
                        },
                        {
                            path: routes.self_exclusion,
                            component: Account,
                            getTitle: () => localize('Self exclusion'),
                        },
                        {
                            path: routes.account_limits,
                            component: Account,
                            getTitle: () => localize('Account limits'),
                        },
                        {
                            path: routes.login_history,
                            component: Account,
                            getTitle: () => localize('Login history'),
                        },
                        {
                            path: routes.api_token,
                            component: Account,
                            getTitle: () => localize('API token'),
                        },
                        {
                            path: routes.connected_apps,
                            component: Account,
                            getTitle: () => localize('Connected apps'),
                        },
                        {
                            path: routes.two_factor_authentication,
                            component: Account,
                            getTitle: () => localize('Two-factor authentication'),
                        },
                        {
                            path: routes.closing_account,
                            component: Account,
                            getTitle: () => localize('Close your account'),
                        },
                    ],
                },
            ],
        },
        {
            path: routes.cashier,
            component: Cashier,
            is_modal: true,
            is_authenticated: true,
            getTitle: () => localize('Cashier'),
            icon_component: 'IcCashier',
            routes: [
                {
                    path: routes.cashier_deposit,
                    component: Cashier,
                    getTitle: () => localize('Deposit'),
                    icon_component: 'IcCashierAdd',
                    default: true,
                },
                {
                    path: routes.cashier_withdrawal,
                    component: Cashier,
                    getTitle: () => localize('Withdrawal'),
                    icon_component: 'IcCashierMinus',
                },
                {
                    path: routes.cashier_pa,
                    component: Cashier,
                    getTitle: () => localize('Payment agents'),
                    icon_component: 'IcPaymentAgent',
                },
                {
                    path: routes.cashier_acc_transfer,
                    component: Cashier,
                    getTitle: () => localize('Transfer'),
                    icon_component: 'IcAccountTransfer',
                },
                {
                    path: routes.cashier_pa_transfer,
                    component: Cashier,
                    getTitle: () => localize('Transfer to client'),
                    icon_component: 'IcAccountTransfer',
                },
                {
                    path: routes.cashier_p2p,
                    component: Cashier,
                    getTitle: () => localize('Deriv P2P'),
                    icon_component: 'IcDp2p',
                    routes: [
                        {
                            path: routes.p2p_buy_sell,
                            component: P2P,
                            getTitle: () => localize('Buy / Sell'),
                            default: true,
                        },
                        {
                            path: routes.p2p_advertiser_page,
                            component: P2P,
                            getTitle: () => localize("Advertiser's page"),
                        },
                        {
                            path: routes.p2p_orders,
                            component: P2P,
                            getTitle: () => localize('Orders'),
                        },
                        {
                            path: routes.p2p_my_ads,
                            component: P2P,
                            getTitle: () => localize('My ads'),
                        },
                        {
                            path: routes.p2p_my_profile,
                            component: P2P,
                            getTitle: () => localize('My profile'),
                        },
                        {
                            path: routes.p2p_verification,
                            component: P2P,
                            getTitle: () => localize('P2P verification'),
                        },
                    ],
                },
                {
                    id: 'gtm-onramp-tab',
                    path: routes.cashier_onramp,
                    component: Cashier,
                    getTitle: () => localize('Fiat onramp'),
                    icon_component: 'IcCashierOnRamp',
                },
                {
                    path: routes.cashier_transactions_crypto,
                    component: Cashier,
                    is_invisible: true,
                },
            ],
        },
        {
            path: routes.trade,
            component: redirectToDTraderStandalone() ? RedirectToDtraderStandalone : Trader,
            getTitle: () => localize('Trader'),
        },
        {
            path: routes.contract,
            component: redirectToDTraderStandalone() ? RedirectToDtraderStandalone : Trader,
            getTitle: () => localize('Contract Details'),
            is_authenticated: true,
        },
        {
            path: routes.old_traders_hub,
            component: RedirectToNewTradersHub,
            is_authenticated: false,
            getTitle: () => localize("Trader's Hub"),
        },
        {
            path: routes.traders_hub,
            component: RootComponent,
            is_authenticated: false,
            getTitle: () => localize("Trader's Hub"),
        },
    ];

    return modules;
};

const lazyLoadComplaintsPolicy = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "complaints-policy" */ 'Modules/ComplaintsPolicy')),
    () => <Loading />
);

// Order matters
// TODO: search tag: test-route-parent-info -> Enable test for getting route parent info when there are nested routes
const initRoutesConfig = () => [
    { path: routes.index, component: RouterRedirect, getTitle: () => '', to: routes.traders_hub },
    { path: routes.endpoint, component: Endpoint, getTitle: () => 'Endpoint' }, // doesn't need localization as it's for internal use
    { path: routes.redirect, component: Redirect, getTitle: () => localize('Redirect') },
    {
        path: routes.complaints_policy,
        component: lazyLoadComplaintsPolicy(),
        getTitle: () => localize('Complaints policy'),
        icon_component: 'IcComplaintsPolicy',
        is_authenticated: true,
    },
    ...getModules(),
];

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = () => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;

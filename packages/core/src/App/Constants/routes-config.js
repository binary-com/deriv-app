import React from 'react';
import { Redirect as RouterRedirect } from 'react-router-dom';
import { makeLazyLoader, routes } from '@deriv/shared';
import { Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Redirect } from 'App/Containers/Redirect';
import Endpoint from 'Modules/Endpoint';
import { Onboarding } from 'App/Containers/Onboarding';

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const Trader = React.lazy(() => {
    // eslint-disable-next-line import/no-unresolved
    return import(/* webpackChunkName: "trader" */ '@deriv/trader');
});

const Account = React.lazy(() => {
    // eslint-disable-next-line import/no-unresolved
    return import(/* webpackChunkName: "account" */ '@deriv/account');
});

const Cashier = React.lazy(() => {
    // eslint-disable-next-line import/no-unresolved
    return import(/* webpackChunkName: "cashier" */ '@deriv/cashier');
});

const Bot = React.lazy(() => {
    // eslint-disable-next-line import/no-unresolved
    return import(/* webpackChunkName: "bot" */ '@deriv/bot-web-ui');
});

const Dashboard = React.lazy(() => {
    // eslint-disable-next-line import/no-unresolved
    return import(/* webpackChunkName: "dashboard" */ 'Modules/Dashboard');
});

const getModules = ({ is_dashboard }) => {
    const modules = [
        {
            path: routes.bot,
            component: Bot,
            // Don't use `Localize` component since native html tag like `option` cannot render them
            getTitle: () => localize('Bot'),
        },
        {
            path: routes.dashboard,
            component: Dashboard,
            is_modal: true,
            getTitle: () => localize('Dashboard'),
            routes: [
                {
                    path: routes.home,
                    component: Dashboard,
                    icon_component: 'IcUserOutline',
                    getTitle: () => localize('Home'),
                },
                {
                    path: routes.my_apps,
                    component: Dashboard,
                    is_modal: true,
                    icon_component: 'IcUserOutline',
                    getTitle: () => localize('My Apps'),
                },
                {
                    path: routes.explore,
                    component: Dashboard,
                    icon_component: 'IcWalletExplore',
                    getTitle: () => localize('Explore'),
                },
                {
                    path: routes.about_us,
                    component: Dashboard,
                    getTitle: () => localize('About Us'),
                },
                {
                    path: routes.resources,
                    component: Dashboard,
                    getTitle: () => localize('Resources'),
                },
            ],
        },
        {
            path: routes.wallets,
            component: Dashboard,
            is_modal: true,
            icon_component: 'IcWalletWallets',
            getTitle: () => localize('Wallets'),
            routes: [
                {
                    getTitle: () => localize('Credit/Debit Cards'),
                    // path: routes.wallets_cards,
                    path: routes.explore,
                },
                {
                    getTitle: () => localize('E-wallet'),
                    // path: routes.wallets_ewallet,
                    path: routes.explore,
                },
                {
                    getTitle: () => localize('Cryptocurrency'),
                    // path: routes.wallets_crypto,
                    path: routes.explore,
                },
                {
                    getTitle: () => localize('Bank Wire'),
                    // path: routes.wallets_bank,
                    path: routes.explore,
                },
            ],
        },
        {
            path: routes.platforms,
            component: Dashboard,
            is_modal: true,
            icon_component: 'IcWalletPlatforms',
            getTitle: () => localize('Platforms'),
            routes: [
                {
                    default: true,
                    getTitle: () => localize('DMT5'),
                    path: routes.platform_dmt5,
                },
                {
                    default: true,
                    getTitle: () => localize('DMT5 Financial STP'),
                    path: routes.platform_dmt5_financial_stp,
                },
                {
                    default: true,
                    getTitle: () => localize('DMT5 Financial'),
                    path: routes.platform_dmt5_financial,
                },
                {
                    default: true,
                    getTitle: () => localize('DMT5 Synthetic'),
                    path: routes.platform_dmt5_synthetic,
                },
                {
                    getTitle: () => localize('DTrader'),
                    // path: routes.platform_dtrader,
                    path: routes.explore,
                },
                {
                    getTitle: () => localize('DBot'),
                    // path: routes.platform_dbot,
                    path: routes.explore,
                },
                {
                    getTitle: () => localize('SmartTrader'),
                    // path: routes.platform_smarttrader,
                    path: routes.explore,
                },
                {
                    getTitle: () => localize('Binary Bot'),
                    // path: routes.platform_binarybot,
                    path: routes.explore,
                },
            ],
        },
        {
            path: routes.trade_types,
            component: Dashboard,
            is_modal: true,
            icon_component: 'IcWalletTradeTypes',
            getTitle: () => localize('Trade Types'),
            routes: [
                {
                    getTitle: () => localize('CFDs'),
                    // path: routes.trade_types_cfds,
                    path: routes.explore,
                },
                {
                    getTitle: () => localize('Multipliers'),
                    // path: routes.trade_types_multipliers,
                    path: routes.explore,
                },
                {
                    getTitle: () => localize('Options'),
                    // path: routes.trade_types_options,
                    path: routes.explore,
                },
            ],
        },
        {
            path: routes.markets,
            component: Dashboard,
            is_modal: true,
            icon_component: 'IcWalletMarkets',
            getTitle: () => localize('Markets'),
            routes: [
                {
                    getTitle: () => localize('Forex'),
                    // path: routes.markets_forex,
                    path: routes.explore,
                },
                {
                    getTitle: () => localize('Synthetic Indices'),
                    // path: routes.markets_synthetic,
                    path: routes.explore,
                },
                {
                    getTitle: () => localize('Stock Indices'),
                    // path: routes.markets_stock,
                    path: routes.explore,
                },
                {
                    getTitle: () => localize('Commodities'),
                    // path: routes.markets_commodities,
                    path: routes.explore,
                },
            ],
        },
        {
            path: routes.account_deactivated,
            component: Account,
            getTitle: () => localize('Account deactivated'),
        },
        {
            path: routes.account,
            component: Account,
            getTitle: () => localize('Account Settings'),
            icon_component: 'IcUserOutline',
            is_authenticated: true,
            // TODO: Revisit this workaround for subroutes [app-routing]
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
                    ],
                },
                {
                    getTitle: () => localize('Security and safety'),
                    icon: 'IcSecurity',
                    subroutes: [
                        {
                            path: routes.passwords,
                            component: Account,
                            getTitle: () => localize('Passwords'),
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
                            path: routes.deactivate_account,
                            component: Account,
                            getTitle: () => localize('Deactivate account'),
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
                    getTitle: () => localize('DP2P'),
                    icon_component: 'IcDp2p',
                },
                {
                    path: routes.cashier_p2p_verification,
                    component: Cashier,
                    getTitle: () => localize('DP2P'),
                    icon_component: 'IcDp2p',
                    is_invisible: true,
                },
                {
                    id: 'gtm-onramp-tab',
                    path: routes.cashier_onramp,
                    component: Cashier,
                    getTitle: () => localize('Fiat onramp'),
                    icon_component: 'IcCashierOnRamp',
                },
            ],
        },
        {
            ...(is_dashboard
                ? {
                      path: routes.dashboard,
                      component: Dashboard,
                      getTitle: () => localize('Dashboard'),
                      routes: [
                          {
                              path: routes.explore,
                              component: Dashboard,
                              getTitle: () => localize('Explore'),
                          },
                          {
                              path: routes.about_us,
                              component: Dashboard,
                              getTitle: () => localize('About Us'),
                          },
                          {
                              path: routes.resources,
                              component: Dashboard,
                              getTitle: () => localize('Resources'),
                          },
                          {
                              path: routes.platform_dmt5_synthetic,
                              component: Dashboard,
                              getTitle: () => localize('DMT5 Synthetic'),
                          },
                      ],
                  }
                : {
                      path: routes.root,
                      component: Trader,
                      getTitle: () => localize('Trader'),
                      routes: [
                          {
                              path: routes.dxtrade,
                              component: Trader,
                              getTitle: () => localize('Deriv X'),
                              is_authenticated: false,
                          },
                          {
                              path: routes.mt5,
                              component: Trader,
                              getTitle: () => localize('MT5'),
                              is_authenticated: false,
                          },
                          {
                              path: routes.reports,
                              component: Trader,
                              getTitle: () => localize('Reports'),
                              icon_component: 'IcReports',
                              is_authenticated: true,
                              routes: [
                                  {
                                      path: routes.positions,
                                      component: Trader,
                                      getTitle: () => localize('Open positions'),
                                      icon_component: 'IcOpenPositions',
                                      default: true,
                                  },
                                  {
                                      path: routes.profit,
                                      component: Trader,
                                      getTitle: () => localize('Profit table'),
                                      icon_component: 'IcProfitTable',
                                  },
                                  {
                                      path: routes.statement,
                                      component: Trader,
                                      getTitle: () => localize('Statement'),
                                      icon_component: 'IcStatement',
                                  },
                              ],
                          },
                          {
                              path: routes.contract,
                              component: Trader,
                              getTitle: () => localize('Contract Details'),
                              is_authenticated: true,
                          },
                          { path: routes.error404, component: Trader, getTitle: () => localize('Error 404') },
                      ],
                  }),
        },
    ];

    return modules;
};

const lazyLoadComplaintsPolicy = makeLazyLoader(
    () => import(/* webpackChunkName: "complaints-policy" */ 'Modules/ComplaintsPolicy'),
    () => <Loading />
);

// Order matters
// TODO: search tag: test-route-parent-info -> Enable test for getting route parent info when there are nested routes
const initRoutesConfig = ({ is_dashboard }) => [
    { path: routes.index, component: RouterRedirect, getTitle: () => '', to: routes.root },
    { path: routes.endpoint, component: Endpoint, getTitle: () => 'Endpoint' }, // doesn't need localization as it's for internal use
    { path: routes.redirect, component: Redirect, getTitle: () => localize('Redirect') },
    { path: routes.onboarding, component: Onboarding, getTitle: () => localize('Onboarding') },
    {
        path: routes.complaints_policy,
        component: lazyLoadComplaintsPolicy(),
        getTitle: () => localize('Complaints policy'),
        icon_component: 'IcComplaintsPolicy',
        is_authenticated: true,
    },
    ...getModules({ is_dashboard }),
];

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, getTitle: () => localize('Error 404') };

// is_deriv_crypto = true as default to prevent route ui blinking
const getRoutesConfig = ({ is_dashboard = true }) => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig({ is_dashboard });
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;

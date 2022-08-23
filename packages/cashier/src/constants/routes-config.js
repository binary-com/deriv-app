import React from 'react';
import { routes, moduleLoader } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Cashier } from '../containers';
import { AccountTransfer, Deposit, OnRamp, P2PCashier, PaymentAgent, PaymentAgentTransfer, Withdrawal } from '../pages';

// Error Routes
const Page404 = React.lazy(() => moduleLoader(() => import(/* webpackChunkName: "404" */ 'Components/page-404')));

// Order matters
const initRoutesConfig = () => [
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
                component: Deposit,
                getTitle: () => localize('Deposit'),
                icon_component: 'IcCashierAdd',
                hide_for: ['affiliate'],
                default: true,
            },
            {
                path: routes.cashier_withdrawal,
                component: Withdrawal,
                getTitle: () => localize('Withdrawal'),
                icon_component: 'IcCashierMinus',
                hide_for: [],
            },
            {
                path: routes.cashier_pa,
                component: PaymentAgent,
                getTitle: () => localize('Payment agents'),
                icon_component: 'IcPaymentAgent',
                hide_for: ['affiliate'],
            },
            {
                path: routes.cashier_acc_transfer,
                component: AccountTransfer,
                getTitle: () => localize('Transfer'),
                icon_component: 'IcAccountTransfer',
                hide_for: [],
            },
            {
                path: routes.cashier_pa_transfer,
                component: PaymentAgentTransfer,
                getTitle: () => localize('Transfer to client'),
                icon_component: 'IcAccountTransfer',
                hide_for: ['affiliate'],
            },
            {
                path: routes.cashier_p2p,
                component: P2PCashier,
                getTitle: () => localize('Deriv P2P'),
                icon_component: 'IcDp2p',
                hide_for: ['affiliate'],
            },
            {
                path: routes.cashier_p2p_verification,
                component: P2PCashier,
                getTitle: () => localize('Deriv P2P'),
                icon_component: 'IcDp2p',
                is_invisible: true,
                hide_for: ['affiliate'],
            },
            {
                id: 'gtm-onramp-tab',
                path: routes.cashier_onramp,
                component: OnRamp,
                getTitle: () => localize('Fiat onramp'),
                icon_component: 'IcCashierOnRamp',
                hide_for: ['affiliate'],
            },
        ],
    },
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

import React from 'react';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import {
    Cashier,
    Deposit,
    Withdrawal,
    PaymentAgent,
    AccountTransfer,
    PaymentAgentTransfer,
    P2PCashier,
    OnRamp,
} from '../Containers';

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ 'Components/Page404.jsx'));

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
                default: true,
            },
            {
                path: routes.cashier_withdrawal,
                component: Withdrawal,
                getTitle: () => localize('Withdrawal'),
                icon_component: 'IcCashierMinus',
            },
            {
                path: routes.cashier_pa,
                component: PaymentAgent,
                getTitle: () => localize('Payment agents'),
                icon_component: 'IcPaymentAgent',
            },
            {
                path: routes.cashier_acc_transfer,
                component: AccountTransfer,
                getTitle: () => localize('Transfer'),
                icon_component: 'IcAccountTransfer',
            },
            {
                path: routes.cashier_pa_transfer,
                component: PaymentAgentTransfer,
                getTitle: () => localize('Transfer to client'),
                icon_component: 'IcAccountTransfer',
            },
            {
                path: routes.cashier_p2p,
                component: P2PCashier,
                getTitle: () => localize('Deriv P2P'),
                icon_component: 'IcDp2p',
            },
            {
                path: routes.cashier_p2p_verification,
                component: P2PCashier,
                getTitle: () => localize('Deriv P2P'),
                icon_component: 'IcDp2p',
                is_invisible: true,
            },
            {
                id: 'gtm-onramp-tab',
                path: routes.cashier_onramp,
                component: OnRamp,
                getTitle: () => localize('Fiat onramp'),
                icon_component: 'IcCashierOnRamp',
            },
        ],
    },
];

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = ({ is_dashboard }) => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig({ is_dashboard });
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;

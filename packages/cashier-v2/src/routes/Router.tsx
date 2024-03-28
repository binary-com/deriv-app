/* eslint-disable sort-keys */
import React from 'react';
import { Switch } from 'react-router-dom';
import TransferIcon from '../assets/images/ic-account-transfer.svg';
import CashierIcon from '../assets/images/ic-cashier.svg';
import DepositIcon from '../assets/images/ic-cashier-add.svg';
import WithdrawalIcon from '../assets/images/ic-cashier-minus.svg';
import OnRampIcon from '../assets/images/ic-cashier-on-ramp.svg';
import PaymentAgentIcon from '../assets/images/ic-payment-agent.svg';
import { DummyComponent } from '../components';
import { Cashier } from '../containers';
import { AccountTransfer, Deposit, PaymentAgent, PaymentAgentTransfer, Withdrawal } from '../flows';
import { TRouteTypes } from '../types';
import RouteWithSubRoutes from './RouteWithSubRoutes';

export const cashierPathRoutes = {
    cashier: '/cashier-v2',
    cashierDeposit: '/cashier-v2/deposit',
    cashierWithdrawal: '/cashier-v2/withdrawal',
    cashierPaymentAgents: '/cashier-v2/payment-agent',
    cashierAccountTransfer: '/cashier-v2/account-transfer',
    cashierPaymentAgentTransfer: '/cashier-v2/payment-agent-transfer',
    cashierOnRamp: '/cashier-v2/on-ramp',
} as const;

const routesConfig: TRouteTypes.IRouteConfig[] = [
    {
        path: cashierPathRoutes.cashier,
        component: Cashier,
        icon: <CashierIcon />,
        title: 'Cashier',
        routes: [
            {
                path: cashierPathRoutes.cashierDeposit,
                component: Deposit,
                icon: <DepositIcon />,
                title: 'Deposit',
            },
            {
                path: cashierPathRoutes.cashierWithdrawal,
                component: Withdrawal,
                icon: <WithdrawalIcon />,
                title: 'Withdrawal',
            },
            {
                path: cashierPathRoutes.cashierPaymentAgents,
                component: PaymentAgent,
                icon: <PaymentAgentIcon />,
                title: 'Payment agents',
            },
            {
                path: cashierPathRoutes.cashierAccountTransfer,
                component: AccountTransfer,
                icon: <TransferIcon />,
                title: 'Transfer',
            },
            {
                path: cashierPathRoutes.cashierPaymentAgentTransfer,
                component: PaymentAgentTransfer,
                icon: <TransferIcon />,
                title: 'Transfer to client',
            },
            {
                path: cashierPathRoutes.cashierOnRamp,
                component: DummyComponent,
                icon: <OnRampIcon />,
                title: 'Fiat onramp',
            },
        ],
    },
];

export const defaultRoute = routesConfig[0].routes?.[0];

const Router = () => {
    const { component: RouteComponent, path, routes, title } = routesConfig[0];

    return (
        <Switch>
            <RouteWithSubRoutes component={RouteComponent} path={path} routes={routes} title={title} />
        </Switch>
    );
};

export default Router;

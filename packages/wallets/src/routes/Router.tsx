import React, { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { Page404 } from '../components/Page404';

const LazyWalletsListingRoute = lazy(
    () => import(/* webpackChunkName: "wallets-listing-route" */ './WalletsListingRoute/WalletsListingRoute')
);
const LazyCashierModalRoute = lazy(
    () => import(/* webpackChunkName: "cashier-modal-route" */ './CashierModalRoute/CashierModalRoute')
);
const LazyCompareAccountsRoute = lazy(
    () => import(/* webpackChunkName: "compare-accounts-route" */ './CompareAccountsRoute/CompareAccountsRoute')
);

type TWalletsRoute =
    | '/'
    | '/compare-accounts'
    | '/wallet'
    | '/wallet/account-transfer'
    | '/wallet/deposit'
    | '/wallet/on-ramp'
    | '/wallet/reset-balance'
    | '/wallet/transactions'
    | '/wallet/withdrawal';

export type TRoute = '/endpoint' | `?${string}` | `${TWalletsRoute}`;

// wallets routes which have their states
interface WalletsRouteState {
    '/': { accountsActiveTabIndex: number };
    '/wallet/account-transfer': {
        accountsActiveTabIndex: number;
        shouldSelectDefaultWallet: boolean;
        toAccountLoginId: string;
    };
    '/wallet/deposit': { accountsActiveTabIndex: number };
    '/wallet/reset-balance': { accountsActiveTabIndex: number };
    '/wallet/transactions': {
        accountsActiveTabIndex: number;
        showPending: boolean;
        transactionType: 'deposit' | 'withdrawal';
    };
    '/wallet/withdrawal': { accountsActiveTabIndex: number };
}

type TStatefulRoute = TRoute & `${keyof WalletsRouteState}`;

type TRouteState = {
    [T in TStatefulRoute]: T extends `${infer R extends keyof WalletsRouteState}`
        ? Partial<WalletsRouteState[R]>
        : never;
};

type TLocationInfo = {
    [T in TRoute]: {
        pathname: T;
        state?: T extends TStatefulRoute ? TRouteState[T] : never;
    };
}[TRoute];

declare module 'react-router-dom' {
    export function useHistory(): {
        location: TLocationInfo & {
            hash: string;
            search: string;
        };
        push: <T extends TRoute>(path: T, ...state: T extends TStatefulRoute ? [TRouteState[T]?] : []) => void;
    };

    export function useRouteMatch(path: TRoute): boolean;
}

const Router: React.FC = () => {
    return (
        <Switch>
            <Route
                exact
                path={'/compare-accounts'}
                render={() => (
                    <React.Suspense fallback={<Loader />}>
                        <LazyCompareAccountsRoute />
                    </React.Suspense>
                )}
            />
            <Route
                path={'/wallet'}
                render={() => (
                    <React.Suspense fallback={<Loader />}>
                        <LazyCashierModalRoute />
                    </React.Suspense>
                )}
            />
            <Route
                exact
                path={'/'}
                render={() => (
                    <React.Suspense fallback={<Loader />}>
                        <LazyWalletsListingRoute />
                    </React.Suspense>
                )}
            />
            <Route render={() => <Page404 />} />
        </Switch>
    );
};

export default Router;

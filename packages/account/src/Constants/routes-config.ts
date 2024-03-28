import React from 'react';
import { routes, moduleLoader } from '@deriv/shared';
import { localize } from '@deriv/translations';
import {
    AccountLimits,
    Passwords,
    Passkeys,
    PersonalDetails,
    TradingAssessment,
    FinancialAssessment,
    ProofOfIdentity,
    ProofOfAddress,
    ProofOfOwnership,
    ApiToken,
    TwoFactorAuthentication,
    SelfExclusion,
    Account,
    ClosingAccount,
    ConnectedApps,
    LoginHistory,
    AccountClosed,
    DeactivateAccount,
    LanguageSettings,
    ProofOfIncome,
} from '../Sections';

import { TRoute, TRouteConfig } from '../Types';
// Error Routes
const Page404 = React.lazy(() => moduleLoader(() => import(/* webpackChunkName: "404" */ 'Modules/Page404')));
export type TPage404 = typeof Page404;

// Order matters
const initRoutesConfig = () => [
    {
        path: routes.account_closed,
        component: AccountClosed,
        is_authenticated: false,
        // Don't use `Localize` component since native html tag like `option` cannot render them
        getTitle: () => localize('Account closed'),
    },
    {
        // TODO: Remove once mobile team has changed this link
        path: routes.deactivate_account,
        component: DeactivateAccount,
    },
    {
        path: routes.account,
        component: Account,
        is_authenticated: true,
        getTitle: () => localize('Account Settings'),
        icon_component: 'IcUserOutline',
        routes: [
            {
                getTitle: () => localize('Profile'),
                icon: 'IcUserOutline',
                subroutes: [
                    {
                        path: routes.personal_details,
                        component: PersonalDetails,
                        getTitle: () => localize('Personal details'),
                        default: true,
                    },
                    {
                        path: routes.languages,
                        component: LanguageSettings,
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
                        component: TradingAssessment,
                        getTitle: () => localize('Trading assessment'),
                    },
                    {
                        path: routes.financial_assessment,
                        component: FinancialAssessment,
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
                        component: ProofOfIdentity,
                        getTitle: () => localize('Proof of identity'),
                    },
                    {
                        path: routes.proof_of_address,
                        component: ProofOfAddress,
                        getTitle: () => localize('Proof of address'),
                    },
                    {
                        path: routes.proof_of_ownership,
                        component: ProofOfOwnership,
                        getTitle: () => localize('Proof of ownership'),
                    },
                    {
                        path: routes.proof_of_income,
                        component: ProofOfIncome,
                        getTitle: () => localize('Proof of income'),
                    },
                ],
            },
            {
                getTitle: () => localize('Security and safety'),
                icon: 'IcSecurity',
                id: 'security_routes',
                subroutes: [
                    {
                        path: routes.passwords,
                        component: Passwords,
                        getTitle: () => localize('Email and passwords'),
                    },
                    {
                        path: routes.passkeys,
                        component: Passkeys,
                        getTitle: () => localize('Passkeys'),
                    },
                    {
                        path: routes.self_exclusion,
                        component: SelfExclusion,
                        getTitle: () => localize('Self exclusion'),
                    },
                    {
                        path: routes.account_limits,
                        component: AccountLimits,
                        getTitle: () => localize('Account limits'),
                    },
                    {
                        path: routes.login_history,
                        component: LoginHistory,
                        getTitle: () => localize('Login history'),
                    },
                    ...[
                        {
                            path: routes.api_token,
                            component: ApiToken,
                            getTitle: () => localize('API token'),
                        },
                    ],
                    {
                        path: routes.connected_apps,
                        component: ConnectedApps,
                        getTitle: () => localize('Connected apps'),
                    },
                    {
                        path: routes.two_factor_authentication,
                        component: TwoFactorAuthentication,
                        getTitle: () => localize('Two-factor authentication'),
                    },
                    {
                        path: routes.closing_account,
                        component: ClosingAccount,
                        getTitle: () => localize('Close your account'),
                    },
                ],
            },
        ],
    },
];

let routesConfig: TRouteConfig[] | undefined;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default: TRoute = { component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = (): TRouteConfig[] => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;

import React from 'react';
import { routes } from '@deriv/shared';

import { localize } from '@deriv/translations';
import {
    AccountLimits,
    DerivPassword,
    PersonalDetails,
    FinancialAssessment,
    ProofOfIdentity,
    ProofOfAddress,
    ApiToken,
    TwoFactorAuthentication,
    SelfExclusion,
    Account,
    ConnectedApps,
    LoginHistory,
} from 'Sections';

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

// Order matters
const initRoutesConfig = () => [
    {
        path: routes.account,
        component: Account,
        is_authenticated: true,
        title: localize('Account Settings'),
        icon_component: 'IcUserOutline',
        routes: [
            {
                title: localize('Profile'),
                icon: 'IcUserOutline',
                subroutes: [
                    {
                        path: routes.personal_details,
                        component: PersonalDetails,
                        title: localize('Personal details'),
                        default: true,
                    },
                    {
                        path: routes.financial_assessment,
                        component: FinancialAssessment,
                        title: localize('Financial assessment'),
                    },
                ],
            },
            {
                title: localize('Verification'),
                icon: 'IcVerification',
                subroutes: [
                    {
                        path: routes.proof_of_identity,
                        component: ProofOfIdentity,
                        title: localize('Proof of identity'),
                    },
                    {
                        path: routes.proof_of_address,
                        component: ProofOfAddress,
                        title: localize('Proof of address'),
                    },
                ],
            },
            {
                title: localize('Security and safety'),
                icon: 'IcSecurity',
                subroutes: [
                    {
                        path: routes.deriv_password,
                        component: DerivPassword,
                        title: localize('Deriv password'),
                    },
                    {
                        path: routes.self_exclusion,
                        component: SelfExclusion,
                        title: localize('Self exclusion'),
                    },
                    {
                        path: routes.account_limits,
                        component: AccountLimits,
                        title: localize('Account limits'),
                    },
                    {
                        path: routes.login_history,
                        component: LoginHistory,
                        title: localize('Login history'),
                    },
                    {
                        path: routes.api_token,
                        component: ApiToken,
                        title: localize('API token'),
                    },
                    {
                        path: routes.connected_apps,
                        component: ConnectedApps,
                        title: localize('Connected apps'),
                    },
                    {
                        path: routes.two_factor_authentication,
                        component: TwoFactorAuthentication,
                        title: localize('Two-factor authentication'),
                    },
                ],
            },
        ],
    },
];

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { component: Page404, title: localize('Error 404') };

const getRoutesConfig = () => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;

import { addRoutesConfig } from '@deriv/shared/utils/route';
import { localize } from '@deriv/translations';
// TODO remove this once deriv-shared is updated
import Page404 from 'Modules/Page404';
import routes from './routes';
import {
    Account,
    PersonalDetails,
    FinancialAssessment,
    ProofOfAddress,
    ProofOfIdentity,
    DerivPassword,
    AccountLimits,
} from '../exports';

// Error Routes
// const Page404 = lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

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
                    { path: routes.proof_of_address, component: ProofOfAddress, title: localize('Proof of address') },
                ],
            },
            {
                title: localize('Security and safety'),
                icon: 'IcSecurity',
                subroutes: [
                    { path: routes.deriv_password, component: DerivPassword, title: localize('Deriv password') },
                    { path: routes.account_limits, component: AccountLimits, title: localize('Account limits') },
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
        addRoutesConfig(routesConfig);
    }
    return routesConfig;
};

export default getRoutesConfig;

import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { FadeWrapper, Loading } from '@deriv/components';
import { flatten, matchRoute, routes as shared_routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import PageOverlayWrapper from './page-overlay-wrapper';
import { TRoute } from '../../Types';
import 'Styles/account.scss';
import { useDevice } from '@deriv-com/ui';

type TAccountProps = RouteComponentProps & {
    routes: Array<TRoute>;
};

/**
 * Component that renders the account section
 * @name Account
 * @param history - history object passed from react-router-dom
 * @param location - location object passed from react-router-dom
 * @param routes - routes object passed from react-router-dom
 * @returns React component
 */
const Account = observer(({ history, location, routes }: TAccountProps) => {
    const { client, ui } = useStore();
    const {
        is_virtual,
        is_logged_in,
        is_logging_in,
        is_proof_of_ownership_enabled,
        landing_company_shortcode,
        should_allow_authentication,
        should_allow_poinc_authentication,
        is_passkey_supported,
    } = client;
    const { toggleAccountSettings, is_account_settings_visible } = ui;
    const { isMobile } = useDevice();
    // subroutes of a route is structured as an array of arrays
    const subroutes = flatten(routes.map(i => i.subroutes));
    const selected_content = subroutes.find(r => matchRoute(r, location.pathname));
    const should_remove_passkeys_route = !isMobile || (isMobile && !is_passkey_supported);

    React.useEffect(() => {
        toggleAccountSettings(true);
    }, [toggleAccountSettings]);

    routes.forEach(menu_item => {
        if (menu_item?.subroutes?.length) {
            menu_item.subroutes.forEach(route => {
                if (route.path === shared_routes.financial_assessment) {
                    route.is_disabled = is_virtual;
                }

                if (route.path === shared_routes.trading_assessment) {
                    route.is_disabled = is_virtual || landing_company_shortcode !== 'maltainvest';
                }

                if (route.path === shared_routes.proof_of_identity || route.path === shared_routes.proof_of_address) {
                    route.is_disabled = !should_allow_authentication;
                }

                if (route.path === shared_routes.proof_of_ownership) {
                    route.is_disabled = is_virtual || !is_proof_of_ownership_enabled;
                }

                if (route.path === shared_routes.proof_of_income) {
                    route.is_disabled = !should_allow_poinc_authentication;
                }

                if (route.path === shared_routes.passkeys) {
                    route.is_hidden = should_remove_passkeys_route;
                }
            });
        }
    });

    if (!selected_content) {
        history.push(shared_routes.personal_details);
    }

    if (!is_logged_in && is_logging_in) {
        return <Loading is_fullscreen className='account__initial-loader' />;
    }

    return (
        <FadeWrapper
            is_visible={is_account_settings_visible}
            className='account-page-wrapper'
            keyname='account-page-wrapper'
        >
            <div className='account'>
                <PageOverlayWrapper routes={routes} subroutes={subroutes} />
            </div>
        </FadeWrapper>
    );
});

Account.displayName = 'Account';

export default withRouter(Account);

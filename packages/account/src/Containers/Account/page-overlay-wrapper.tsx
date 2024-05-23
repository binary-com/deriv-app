import React from 'react';
import { useHistory } from 'react-router-dom';
import { Analytics } from '@deriv-com/analytics';
import { PageOverlay, VerticalTab } from '@deriv/components';
import { getOSNameWithUAParser, getSelectedRoute, getStaticUrl, routes as shared_routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import TradingHubLogout from './tradinghub-logout';
import { TRoute } from '../../Types';

type RouteItems = React.ComponentProps<typeof VerticalTab>['list'];

type PageOverlayWrapperProps = {
    routes: Array<TRoute>;
    subroutes: RouteItems;
};

/**
 * @name PageOverlayWrapper
 * @param routes - routes object pased by react-router-dom
 * @param subroutes - list of subroutes
 */
const PageOverlayWrapper = observer(({ routes, subroutes }: PageOverlayWrapperProps) => {
    const history = useHistory();
    const { client, common, ui } = useStore();
    const { is_mobile } = ui;
    const { has_wallet, logout } = client;
    const { is_from_derivgo } = common;

    const passkeysMenuCloseActionEventTrack = React.useCallback(() => {
        Analytics.trackEvent('ce_passkey_account_settings_form', {
            action: 'close',
            form_name: 'ce_passkey_account_settings_form',
            operating_system: getOSNameWithUAParser(),
        });
    }, []);

    const list_groups = routes.map(route_group => ({
        icon: route_group.icon,
        label: route_group?.getTitle(),
        subitems: route_group?.subroutes?.length ? route_group.subroutes.map(sub => subroutes.indexOf(sub)) : [],
    }));

    const onClickClose = React.useCallback(() => {
        if (location.pathname === shared_routes.passkeys) {
            passkeysMenuCloseActionEventTrack();
        }

        has_wallet ? history.push(shared_routes.wallets) : history.push(shared_routes.traders_hub);
    }, [history, has_wallet]);

    const selected_route = getSelectedRoute({ routes: subroutes as Array<TRoute>, pathname: location.pathname });

    const onClickLogout = () => {
        history.push(shared_routes.index);
        logout().then(() => (window.location.href = getStaticUrl('/')));
    };

    if (is_mobile && selected_route) {
        const RouteComponent = selected_route.component as React.ElementType<{ component_icon: string | undefined }>;
        return (
            <PageOverlay header={selected_route?.getTitle()} onClickClose={onClickClose} is_from_app={is_from_derivgo}>
                <RouteComponent component_icon={selected_route.icon_component} />
            </PageOverlay>
        );
    }
    return (
        <PageOverlay
            header={<Localize i18n_default_text='Settings' />}
            onClickClose={onClickClose}
            is_from_app={is_from_derivgo}
        >
            <VerticalTab
                is_floating
                current_path={location.pathname}
                is_routed
                is_full_width
                list={subroutes}
                list_groups={list_groups}
                extra_content={<TradingHubLogout handleOnLogout={onClickLogout} />}
            />
        </PageOverlay>
    );
});

PageOverlayWrapper.displayName = 'PageOverlayWrapper';

export default PageOverlayWrapper;

import { getPlatformSettings } from '../brand';
import { routes } from '../routes';

type TRoutingHistory = {
    action: string;
    hash: string;
    key: string;
    pathname: string;
    search: string;
}[];

/*
 * These functions exist because we want to refresh the browser page on switch between Bot and the rest of the platforms.
 * */

export const platform_name = Object.freeze({
    DBot: getPlatformSettings('dbot').name,
    DTrader: getPlatformSettings('trader').name,
    DXtrade: getPlatformSettings('dxtrade').name,
    DMT5: getPlatformSettings('mt5').name,
    SmartTrader: getPlatformSettings('smarttrader').name,
    DerivGO: getPlatformSettings('go').name,
});

export const CFD_PLATFORMS = Object.freeze({
    MT5: 'mt5',
    DXTRADE: 'dxtrade',
    CTRADER: 'ctrader',
});

export const isBot = () =>
    /^\/bot/.test(window.location.pathname) ||
    (/^\/(br_)/.test(window.location.pathname) && window.location.pathname.split('/')[2] === 'bot');

export const isMT5 = () =>
    /^\/mt5/.test(window.location.pathname) ||
    (/^\/(br_)/.test(window.location.pathname) && window.location.pathname.split('/')[2] === CFD_PLATFORMS.MT5);

export const isDXtrade = () =>
    /^\/derivx/.test(window.location.pathname) ||
    (/^\/(br_)/.test(window.location.pathname) && window.location.pathname.split('/')[2] === 'derivx');

export const isNavigationFromDerivGO = () => window.sessionStorage.getItem('config.platform') === 'derivgo';

export const isNavigationFromP2P = () => window.sessionStorage.getItem('config.platform') === 'dp2p';

export const getPathname = () => {
    if (isBot()) return platform_name.DBot;
    if (isMT5()) return platform_name.DMT5;
    if (isDXtrade()) return platform_name.DXtrade;
    switch (window.location.pathname.split('/')[1]) {
        case '':
            return platform_name.DTrader;
        case 'reports':
            return 'Reports';
        case 'cashier':
            return 'Cashier';
        default:
            return platform_name.SmartTrader;
    }
};

export const getPlatformInformation = (routing_history: TRoutingHistory) => {
    if (isBot() || isNavigationFromPlatform(routing_history, routes.bot)) {
        return { header: platform_name.DBot, icon: getPlatformSettings('dbot').icon };
    }

    if (isMT5() || isNavigationFromPlatform(routing_history, routes.mt5)) {
        return { header: platform_name.DMT5, icon: getPlatformSettings('mt5').icon };
    }

    if (isDXtrade() || isNavigationFromPlatform(routing_history, routes.dxtrade)) {
        return { header: platform_name.DXtrade, icon: getPlatformSettings('dxtrade').icon };
    }

    if (isNavigationFromExternalPlatform(routing_history, routes.smarttrader)) {
        return { header: platform_name.SmartTrader, icon: getPlatformSettings('smarttrader').icon };
    }

    return { header: platform_name.DTrader, icon: getPlatformSettings('trader').icon };
};

export const getActivePlatform = (routing_history: TRoutingHistory) => {
    if (isBot() || isNavigationFromPlatform(routing_history, routes.bot)) return platform_name.DBot;
    if (isMT5() || isNavigationFromPlatform(routing_history, routes.mt5)) return platform_name.DMT5;
    if (isDXtrade() || isNavigationFromPlatform(routing_history, routes.dxtrade)) return platform_name.DXtrade;
    if (isNavigationFromExternalPlatform(routing_history, routes.smarttrader)) return platform_name.SmartTrader;
    return platform_name.DTrader;
};

export const getPlatformRedirect = (routing_history: TRoutingHistory) => {
    if (isBot() || isNavigationFromPlatform(routing_history, routes.bot))
        return { name: platform_name.DBot, route: routes.bot };
    if (isMT5() || isNavigationFromPlatform(routing_history, routes.mt5))
        return { name: platform_name.DMT5, route: routes.mt5 };
    if (isDXtrade() || isNavigationFromPlatform(routing_history, routes.dxtrade))
        return { name: platform_name.DXtrade, route: routes.dxtrade };
    if (isNavigationFromExternalPlatform(routing_history, routes.smarttrader))
        return { name: platform_name.SmartTrader, route: routes.smarttrader };
    if (isNavigationFromExternalPlatform(routing_history, routes.cashier_p2p))
        return { name: 'P2P', route: routes.cashier_p2p };
    if (isNavigationFromP2P()) return { name: 'P2P', route: routes.cashier_p2p, ref: 'p2p' };
    return { name: platform_name.DTrader, route: routes.trade };
};

export const isNavigationFromPlatform = (
    app_routing_history: TRoutingHistory,
    platform_route: string,
    should_ignore_parent_path = false
) => {
    if (app_routing_history.length > 0) {
        const getParentPath = (pathname: string) => (/^http/.test(pathname) ? false : pathname.split('/')[1]);

        for (let i = 0; i < app_routing_history.length; i++) {
            const history_item = app_routing_history[i];
            const history_item_parent_path = getParentPath(history_item.pathname);
            const next_history_item = app_routing_history.length > i + 1 && app_routing_history[i + 1];

            if (
                history_item_parent_path === getParentPath(platform_route) ||
                (should_ignore_parent_path && history_item.pathname === platform_route)
            ) {
                return true;
            } else if (!next_history_item) {
                return false;
            } else if (history_item_parent_path === getParentPath(next_history_item.pathname)) {
                // Continue walking until we see passed in platform_route.
                continue; // eslint-disable-line no-continue
            } else {
                // Return false when path matches a platform parent path, but don't return anything
                // when a non-platform path was seen. i.e. navigating between /cashier and /reports
                // should not affect navigating back to platform when clicking cross.
                const platform_parent_paths = [routes.mt5, routes.dxtrade, routes.bot, routes.trade].map(route =>
                    getParentPath(route)
                );
                const is_other_platform_path = platform_parent_paths.includes(history_item_parent_path);

                if (is_other_platform_path) {
                    break;
                }
            }
        }
    }

    return false;
};

export const isNavigationFromExternalPlatform = (routing_history: TRoutingHistory, platform_route: string) => {
    /*
     *  Check if the client is navigating from external platform(SmartTrader)
     *  and has not visited Dtrader after it.
     */

    const platform_index = routing_history.findIndex(history_item => history_item.pathname === platform_route);
    const dtrader_index = routing_history.findIndex(history_item => history_item.pathname === routes.trade);
    const has_visited_platform = platform_index !== -1;
    const has_visited_dtrader = dtrader_index !== -1;

    if (has_visited_platform) {
        return has_visited_dtrader ? platform_index < dtrader_index : true;
    }

    return false;
};

export const isDtraderV2Enabled = (is_mobile: boolean) => {
    const is_dtrader_v2 = JSON.parse(localStorage.getItem('FeatureFlagsStore') ?? '{}')?.data?.dtrader_v2;

    return (
        is_dtrader_v2 &&
        is_mobile &&
        (window.location.pathname.startsWith(routes.trade) || window.location.pathname.startsWith('/contract/'))
    );
};

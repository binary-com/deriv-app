import { routes } from '../routes';

/*
 * These functions exist because we want to refresh the browser page on switch between Bot and the rest of the platforms.
 * */

export const platform_name = Object.freeze({
    DBot: 'DBot',
    DTrader: 'DTrader',
    DXtrade: 'Deriv X',
    DMT5: 'DMT5',
    SmartTrader: 'SmartTrader',
});

export const CFD_PLATFORMS = Object.freeze({
    MT5: 'mt5',
    DXTRADE: 'dxtrade',
    DERIVX: 'derivx',
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

export const getPlatformInformation = routing_history => {
    if (isBot() || isNavigationFromPlatform(routing_history, routes.bot)) {
        return { header: platform_name.DBot, icon: 'IcBrandDbot' };
    }

    if (isMT5() || isNavigationFromPlatform(routing_history, routes.mt5)) {
        return { header: platform_name.DMT5, icon: 'IcBrandDmt5' };
    }

    if (isDXtrade() || isNavigationFromPlatform(routing_history, routes.dxtrade)) {
        return { header: platform_name.DXtrade, icon: 'IcBrandDxtrade' };
    }

    if (isNavigationFromPlatform(routing_history, routes.smarttrader)) {
        return { header: platform_name.SmartTrader, icon: 'IcBrandSmarttrader' };
    }
    return { header: platform_name.DTrader, icon: 'IcBrandDtrader' };
};

export const getActivePlatform = routing_history => {
    if (isBot() || isNavigationFromPlatform(routing_history, routes.bot)) return 'DBot';
    if (isMT5() || isNavigationFromPlatform(routing_history, routes.mt5)) return 'DMT5';
    if (isDXtrade() || isNavigationFromPlatform(routing_history, routes.dxtrade)) return 'Deriv X';
    if (isNavigationFromPlatform(routing_history, routes.smarttrader)) return 'SmartTrader';
    return 'DTrader';
};

export const getPlatformRedirect = routing_history => {
    if (isBot() || isNavigationFromPlatform(routing_history, routes.bot))
        return { name: platform_name.DBot, route: routes.bot };
    if (isMT5() || isNavigationFromPlatform(routing_history, routes.mt5))
        return { name: platform_name.DMT5, route: routes.mt5 };
    if (isDXtrade() || isNavigationFromPlatform(routing_history, routes.dxtrade))
        return { name: platform_name.DXtrade, route: routes.dxtrade };
    if (isNavigationFromPlatform(routing_history, routes.smarttrader))
        return { name: platform_name.SmartTrader, route: routes.smarttrader };
    if (isNavigationFromP2P(routing_history, routes.cashier_p2p)) return { name: 'P2P', route: routes.cashier_p2p };
    return { name: platform_name.DTrader, route: routes.trade };
};

export const isNavigationFromPlatform = (app_routing_history, platform_route, should_ignore_parent_path = false) => {
    if (app_routing_history.length > 0) {
        const getParentPath = pathname => (/^http/.test(pathname) ? false : pathname.split('/')[1]);

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

export const isNavigationFromP2P = (routing_history, platform_route) => {
    const routing_history_index = routing_history.length > 1 ? 1 : 0;
    const history_item = routing_history[routing_history_index];
    return history_item?.pathname === platform_route;
};

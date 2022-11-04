import { matchPath, RouteProps } from 'react-router';
import { routes } from '@deriv/shared';

export const normalizePath: (path: string) => string = path => (/^\//.test(path) ? path : `/${path || ''}`); // Default to '/'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const findRouteByPath = (path: string, routes_config?: any[]): RouteProps | undefined => {
    let result;

    routes_config?.some(route_info => {
        let match_path;
        try {
            match_path = matchPath(path, route_info);
        } catch (e: unknown) {
            if (/undefined/.test((e as Error).message)) {
                return undefined;
            }
        }

        if (match_path) {
            result = route_info;
            return true;
        } else if (route_info.routes) {
            result = findRouteByPath(path, route_info.routes);
            return result;
        }
        return false;
    });

    return result;
};

export const isRouteVisible = (route?: { is_authenticated: boolean }, is_logged_in?: boolean) =>
    !(route && route.is_authenticated && !is_logged_in);

export const getPath = (route_path: string, params: { [key: string]: string } = {}) =>
    Object.keys(params).reduce((p, name) => p.replace(`:${name}`, params[name]), route_path);

export const getContractPath = (contract_id: string) => getPath(routes.contract, { contract_id });

import { ElementType } from 'react';
import { Redirect } from 'react-router-dom';

export type TRoute = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component?: ((routes?: TRoute[]) => JSX.Element) | typeof Redirect | ElementType<any> | null | undefined;
    default?: boolean;
    exact?: boolean;
    getTitle?: () => string;
    icon_component?: string;
    icon?: string;
    id?: string;
    is_disabled?: boolean;
    is_invisible?: boolean;
    path?: string;
    subroutes?: TRoute[];
    to?: string;
};

export type TRouteConfig = TRoute & {
    is_authenticated?: boolean;
    is_modal?: boolean;
    routes?: TRoute[];
};

export type TBinaryRoutes = {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

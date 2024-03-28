import React from 'react';
import { BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import { defaultRoute, routes } from '../../routesConfig';

export const RouteLinks = () => (
    <BrowserRouter>
        <div className='px-4 py-16 md:gap-24 grid grid-cols-[1fr_4fr] max-w-[600px] md:max-w-[1200px] mx-auto md:py-50 md:px-24'>
            <div className='p-8 d-none lg:flex lg:flex-col bg-solid-slate-1 rounded-default'>
                {routes.map(route => (
                    <NavLink
                        activeClassName='bg-solid-slate-2 border-solid border-l-4 border-l-solid-red-5 rounded-xs font-bold'
                        className='p-10 text-default'
                        key={route.routePath}
                        to={route.routePath}
                    >
                        {route.routeName}
                    </NavLink>
                ))}
            </div>
            <Switch>
                {routes.map(({ routeComponent: Component, routePath }) => (
                    <Route exact key={routePath} path={routePath} render={() => <Component />} />
                ))}
                <Redirect from='/' to={defaultRoute} />
            </Switch>
        </div>
    </BrowserRouter>
);

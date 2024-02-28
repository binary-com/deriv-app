import React from 'react';
import { BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import { defaultRoute, routes } from '../../constants/routes-config';

const RouteLinks = () => (
    <BrowserRouter>
        <div className='px-4 py-16 gap-6 grid grid-cols-1 sm:grid-cols-[1fr_4fr]'>
            <div className='flex-col hidden p-8 sm:flex bg-solid-slate-1 rounded-xs'>
                {routes.map(route => (
                    <NavLink
                        activeClassName='bg-solid-slate-2 border-solid border-l-4 border-l-solid-red-5 rounded-xs font-bold'
                        className='p-8 text-default'
                        key={route.routePath}
                        to={route.routePath}
                    >
                        {route.routeName}
                    </NavLink>
                ))}
            </div>
            <div className='p-8'>
                <Switch>
                    {routes.map(route => {
                        const Component = route.routeComponent;
                        return (
                            <Route
                                exact
                                key={route.routePath}
                                path={route.routePath}
                                render={() => <Component path={route.routePath} />}
                            />
                        );
                    })}
                    <Redirect from='/' to={defaultRoute} />
                </Switch>
            </div>
        </div>
    </BrowserRouter>
);

export default RouteLinks;

import React, { PropsWithChildren, useEffect } from 'react';
// @ts-expect-error `@deriv/deriv-api` is not in TypeScript, Hence we ignore the TS error.
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, getSocketURL, useWS } from '@deriv/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import APIContext from './APIContext';

declare global {
    interface Window {
        ReactQueryClient?: QueryClient;
        DerivAPI?: Record<string, DerivAPIBasic>;
    }
}

// This is a temporary workaround to share a single `QueryClient` instance between all the packages.
// Later once we have each package separated we won't need this anymore and can remove this.
const getSharedQueryClientContext = (): QueryClient => {
    if (!window.ReactQueryClient) {
        window.ReactQueryClient = new QueryClient();
    }

    return window.ReactQueryClient;
};

const getDerivAPIInstance = (): DerivAPIBasic => {
    const endpoint = getSocketURL();
    const app_id = getAppId();
    const language = 'EN';
    const brand = 'deriv';
    const wss = `wss://${endpoint}/websockets/v3?app_id=${app_id}&l=${language}&brand=${brand}`;

    if (!window.DerivAPI) {
        window.DerivAPI = {};
    }

    if (!window.DerivAPI?.[wss]) {
        window.DerivAPI[wss] = new DerivAPIBasic({ connection: new WebSocket(wss) });
    }

    return window.DerivAPI?.[wss];
};

const queryClient = getSharedQueryClientContext();

type TProps = {
    /** If set to true, the APIProvider will instantiate it's own socket connection. */
    standalone?: boolean;
};

const APIProvider = ({ children, standalone = false }: PropsWithChildren<TProps>) => {
    const ws = useWS();
    // Use the new API instance if the `standalone` prop is set to true,
    // else use the legacy socket connection.
    const api = standalone ? getDerivAPIInstance() : ws;

    useEffect(() => {
        // Disconnect the connection when this component unmounts.
        return () => {
            api?.disconnect();
        };
    }, [api]);

    return (
        <APIContext.Provider value={{ ...api }}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools />
            </QueryClientProvider>
        </APIContext.Provider>
    );
};

export default APIProvider;

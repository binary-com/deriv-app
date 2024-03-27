import React, { PropsWithChildren, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
// @ts-expect-error `@deriv/deriv-api` is not in TypeScript, Hence we ignore the TS error.
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, getSocketURL, useWS } from '@deriv/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    TSocketEndpointNames,
    TSocketError,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';
import { hashObject } from './utils';

type TSendFunction = <T extends TSocketEndpointNames>(
    name: T,
    payload?: TSocketRequestPayload<T>
) => Promise<TSocketResponseData<T> & TSocketError<T>>;

type TSubscribeFunction = <T extends TSocketSubscribableEndpointNames>(
    name: T,
    payload?: TSocketRequestPayload<T>
) => Promise<{ id: string; subscription: DerivAPIBasic['subscribe'] }>;

type TUnsubscribeFunction = (id: string) => void;

type APIContextData = {
    derivAPI: DerivAPIBasic | null;
    switchEnvironment: (loginid: string | null | undefined) => void;
    send: TSendFunction;
    subscribe: TSubscribeFunction;
    unsubscribe: TUnsubscribeFunction;
    queryClient: QueryClient;
};

const APIContext = createContext<APIContextData | null>(null);

declare global {
    interface Window {
        ReactQueryClient?: QueryClient;
        DerivAPI?: Record<string, DerivAPIBasic>;
        WSConnections?: Record<string, WebSocket>;
    }
}

// This is a temporary workaround to share a single `QueryClient` instance between all the packages.
const getSharedQueryClientContext = (): QueryClient => {
    if (!window.ReactQueryClient) {
        window.ReactQueryClient = new QueryClient();
    }

    return window.ReactQueryClient;
};

/**
 * Retrieves the WebSocket URL based on the current environment.
 * @returns {string} The WebSocket URL.
 */
const getWebSocketURL = () => {
    const endpoint = getSocketURL();
    const app_id = getAppId();
    const language = localStorage.getItem('i18n_language');
    const brand = 'deriv';
    const wss_url = `wss://${endpoint}/websockets/v3?app_id=${app_id}&l=${language}&brand=${brand}`;

    return wss_url;
};

/**
 * Retrieves or initializes a WebSocket instance based on the provided URL.
 * @param {string} wss_url - The WebSocket URL.
 * @returns {WebSocket} The WebSocket instance associated with the provided URL.
 */
const getWebsocketInstance = (wss_url: string, onWSClose: () => void) => {
    if (!window.WSConnections) {
        window.WSConnections = {};
    }

    const existingWebsocketInstance = window.WSConnections[wss_url];
    if (
        !existingWebsocketInstance ||
        !(existingWebsocketInstance instanceof WebSocket) ||
        [2, 3].includes(existingWebsocketInstance.readyState)
    ) {
        window.WSConnections[wss_url] = new WebSocket(wss_url);
        window.WSConnections[wss_url].addEventListener('close', () => {
            if (typeof onWSClose === 'function') onWSClose();
        });
    }

    return window.WSConnections[wss_url];
};

/**
 * Retrieves the active WebSocket instance.
 * @returns {WebSocket} The WebSocket instance associated with the provided URL.
 */
export const getActiveWebsocket = () => {
    const wss_url = getWebSocketURL();

    return window?.WSConnections?.[wss_url];
};

/**
 * Initializes a DerivAPI instance for the global window. This enables a standalone connection
 * without causing race conditions with deriv-app core stores.
 * @returns {DerivAPIBasic} The initialized DerivAPI instance.
 */
const initializeDerivAPI = (onWSClose: () => void): DerivAPIBasic => {
    if (!window.DerivAPI) {
        window.DerivAPI = {};
    }

    const wss_url = getWebSocketURL();
    const websocketConnection = getWebsocketInstance(wss_url, onWSClose);

    if (!window.DerivAPI?.[wss_url] || window.DerivAPI?.[wss_url].isConnectionClosed()) {
        window.DerivAPI[wss_url] = new DerivAPIBasic({ connection: websocketConnection });
    }

    return window.DerivAPI?.[wss_url];
};

const queryClient = getSharedQueryClientContext();

/**
 * Determines the WS environment based on the login ID and custom server URL.
 * @param {string | null | undefined} loginid - The login ID (can be a string, null, or undefined).
 * @returns {string} Returns the WS environment: 'custom', 'real', or 'demo'.
 */
/**
 * @deprecated Please use 'WebSocketUtils.getEnvironmentFromLoginid' from '@deriv-com/utils' instead of this.
 */
const getEnvironment = (loginid: string | null | undefined) => {
    const customServerURL = window.localStorage.getItem('config.server_url');
    if (customServerURL) return 'custom';

    if (loginid && !/^(VRT|VRW)/.test(loginid)) return 'real';
    return 'demo';
};

type TAPIProviderProps = {
    /** If set to true, the APIProvider will instantiate it's own socket connection. */
    standalone?: boolean;
};

const APIProvider = ({ children, standalone = false }: PropsWithChildren<TAPIProviderProps>) => {
    const WS = useWS();
    const [reconnect, setReconnect] = useState(false);
    const activeLoginid = window.localStorage.getItem('active_loginid');
    const [environment, setEnvironment] = useState(getEnvironment(activeLoginid));
    const standaloneDerivAPI = useRef(standalone ? initializeDerivAPI(() => setReconnect(true)) : null);
    const subscriptions = useRef<Record<string, DerivAPIBasic['subscribe']>>();

    const send: TSendFunction = (name, payload) => {
        return standaloneDerivAPI.current?.send({ [name]: 1, ...payload });
    };

    const subscribe: TSubscribeFunction = async (name, payload) => {
        const id = await hashObject({ name, payload });
        const matchingSubscription = subscriptions.current?.[id];
        if (matchingSubscription) return { id, subscription: matchingSubscription };

        const { payload: _payload } = payload ?? {};

        const subscription = standaloneDerivAPI.current?.subscribe({
            [name]: 1,
            subscribe: 1,
            ...(_payload ?? {}),
        });

        subscriptions.current = { ...(subscriptions.current ?? {}), ...{ [id]: subscription } };
        return { id, subscription };
    };

    const unsubscribe: TUnsubscribeFunction = id => {
        const matchingSubscription = subscriptions.current?.[id];
        if (matchingSubscription) matchingSubscription.unsubscribe();
    };

    useEffect(() => {
        const currentDerivApi = standaloneDerivAPI.current;
        const currentSubscriptions = subscriptions.current;

        return () => {
            if (currentSubscriptions) {
                Object.keys(currentSubscriptions).forEach(key => {
                    currentSubscriptions[key].unsubscribe();
                });
            }
            if (currentDerivApi && currentDerivApi.connection.readyState === 1) currentDerivApi.disconnect();
        };
    }, []);

    const switchEnvironment = useCallback(
        (loginid: string | null | undefined) => {
            if (!standalone) return;
            const currentEnvironment = getEnvironment(loginid);
            if (currentEnvironment !== 'custom' && currentEnvironment !== environment) {
                setEnvironment(currentEnvironment);
            }
        },
        [environment, standalone]
    );

    useEffect(() => {
        let interval_id: ReturnType<typeof setInterval>;

        if (standalone) {
            interval_id = setInterval(() => standaloneDerivAPI.current?.send({ ping: 1 }), 10000);
        }

        return () => clearInterval(interval_id);
    }, [standalone]);

    useEffect(() => {
        let reconnectTimerId: NodeJS.Timeout;
        if (standalone || reconnect) {
            standaloneDerivAPI.current = initializeDerivAPI(() => {
                reconnectTimerId = setTimeout(() => setReconnect(true), 500);
            });
            setReconnect(false);
        }

        return () => clearTimeout(reconnectTimerId);
    }, [environment, reconnect, standalone]);

    return (
        <APIContext.Provider
            value={{
                derivAPI: standalone ? standaloneDerivAPI.current : WS,
                switchEnvironment,
                send,
                subscribe,
                unsubscribe,
                queryClient,
            }}
        >
            <QueryClientProvider client={queryClient}>
                {children}
                {/* <ReactQueryDevtools /> */}
            </QueryClientProvider>
        </APIContext.Provider>
    );
};

export const useAPIContext = () => {
    const context = useContext(APIContext);
    if (!context) {
        throw new Error('useAPIContext must be used within APIProvider');
    }
    return context;
};

export default APIProvider;

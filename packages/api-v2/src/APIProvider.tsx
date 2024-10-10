import React, { PropsWithChildren, createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { getAppId, getSocketURL } from '@deriv/shared';
import { getInitialLanguage } from '@deriv-com/translations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TSocketRequestPayload, TSocketResponseData, TSocketSubscribableEndpointNames } from '../types';
import { hashObject } from './utils';
import WSClient from './ws-client/ws-client';

type TSubscribeFunction = <T extends TSocketSubscribableEndpointNames>(
    name: T,
    payload: TSocketRequestPayload<T> | undefined
) => Promise<{
    id: string;
    subscription: {
        unsubscribe: () => void;
        subscribe: (onData: (response: TSocketResponseData<TSocketSubscribableEndpointNames>) => void) => void;
    };
}>;

type TUnsubscribeFunction = (id: string) => void;

type APIContextData = {
    subscribe: TSubscribeFunction;
    unsubscribe: TUnsubscribeFunction;
    queryClient: QueryClient;
    setOnReconnected: (onReconnected: () => void) => void;
    setOnConnected: (onConnected: () => void) => void;
    connection: WebSocket;
    wsClient: WSClient;
};

/**
 * Retrieves the WebSocket URL based on the current environment.
 * @returns {string} The WebSocket URL.
 */
const getWebSocketURL = () => {
    const endpoint = getSocketURL();
    const app_id = getAppId();
    const language = getInitialLanguage();
    return `wss://${endpoint}/websockets/v3?app_id=${app_id}&l=${language}&brand=deriv`;
};

const APIContext = createContext<APIContextData | null>(null);

/**
 * @returns {WebSocket} The initialized WebSocket instance.
 */
const initializeConnection = (onWSClose: () => void, onOpen?: () => void): WebSocket => {
    const wss_url = getWebSocketURL();

    const connection = new WebSocket(wss_url);
    connection.addEventListener('close', () => {
        onWSClose?.();
    });

    connection.addEventListener('open', () => {
        onOpen?.();
    });

    return connection;
};

/**
 * TODO: standlone no longer exists, as its always standalone,
 * but I do not want to remove it from all packages withint this PR, so needs to be cleaned up in subsequent PRs
 */
type TAPIProviderProps = {
    /** If set to true, the APIProvider will instantiate it's own socket connection. */
    standalone?: boolean;
};

type SubscribeReturnType = ReturnType<TSubscribeFunction>; // This captures the entire return type of TSubscribeFunction
type UnwrappedSubscription = Awaited<SubscribeReturnType>;

const APIProvider = ({ children }: PropsWithChildren<TAPIProviderProps>) => {
    const [reconnect, setReconnect] = useState(false);
    const connectionRef = useRef<WebSocket>();
    const subscriptionsRef = useRef<Record<string, UnwrappedSubscription['subscription']>>();
    const reactQueryRef = useRef<QueryClient>();
    const isMounted = useRef(true);

    // on reconnected ref
    const onReconnectedRef = useRef<() => void>();
    const onConnectedRef = useRef<() => void>();
    const isOpenRef = useRef<boolean>(false);
    const wsClientRef = useRef<WSClient>(new WSClient());

    const language = getInitialLanguage();
    const [prevLanguage, setPrevLanguage] = useState<string>(language);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    if (!reactQueryRef.current) {
        reactQueryRef.current = new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,
                    refetchOnReconnect: false,
                },
            },
        });
    }

    // have to be here and not inside useEffect as there are places in code expecting this to be available
    if (!connectionRef.current) {
        connectionRef.current = initializeConnection(
            () => {
                if (isMounted.current) setReconnect(true);
            },
            () => {
                if (!connectionRef.current) {
                    throw new Error('Connection is not set');
                }

                wsClientRef.current.setWs(connectionRef.current);
                if (isMounted.current) {
                    isOpenRef.current = true;
                    if (onConnectedRef.current) {
                        onConnectedRef.current();
                        onConnectedRef.current = undefined;
                    }
                }
            }
        );
    }

    const setOnReconnected = useCallback((onReconnected: () => void) => {
        onReconnectedRef.current = onReconnected;
    }, []);

    const setOnConnected = useCallback((onConnected: () => void) => {
        if (isOpenRef.current) {
            onConnected();
        } else {
            onConnectedRef.current = onConnected;
        }
    }, []);

    const subscribe: TSubscribeFunction = async (name, payload) => {
        const id = await hashObject({ name, payload });
        const matchingSubscription = subscriptionsRef.current?.[id];
        if (matchingSubscription) return { id, subscription: matchingSubscription };

        const { payload: _payload } = payload ?? {};

        const result: UnwrappedSubscription = {
            id,
            subscription: {
                subscribe: (onData: (response: TSocketResponseData<TSocketSubscribableEndpointNames>) => void) => {
                    wsClientRef.current?.subscribe(name, _payload, onData);
                },
                unsubscribe: () => {
                    unsubscribe(id);
                },
            },
        };

        subscriptionsRef.current = { ...(subscriptionsRef.current ?? {}), ...{ [id]: result.subscription } };
        return result;
    };

    const unsubscribe: TUnsubscribeFunction = id => {
        const matchingSubscription = subscriptionsRef.current?.[id];
        if (matchingSubscription) matchingSubscription.unsubscribe();
    };

    useEffect(() => {
        const currentSubscriptionsRef = subscriptionsRef.current;

        return () => {
            if (currentSubscriptionsRef) {
                Object.keys(currentSubscriptionsRef).forEach(key => {
                    currentSubscriptionsRef[key].unsubscribe();
                });
            }

            wsClientRef.current?.close();
            reactQueryRef.current?.clear();
        };
    }, []);

    useEffect(() => {
        const interval_id: ReturnType<typeof setInterval> = setInterval(() => {
            if (wsClientRef.current && wsClientRef.current?.ws?.readyState == 1) {
                wsClientRef.current.request('ping');
            }
        }, 10000);
        return () => clearInterval(interval_id);
    }, []);

    useEffect(() => {
        let reconnectTimerId: NodeJS.Timeout;
        if (reconnect) {
            connectionRef.current = initializeConnection(
                () => {
                    reconnectTimerId = setTimeout(() => setReconnect(true), 500);
                },
                () => {
                    if (!connectionRef.current) {
                        throw new Error('Connection is not set');
                    }
                    wsClientRef.current.setWs(connectionRef.current);
                    if (onReconnectedRef.current) {
                        onReconnectedRef.current();
                    }
                }
            );
            setReconnect(false);
        }

        return () => clearTimeout(reconnectTimerId);
    }, [reconnect]);

    // reconnects to latest WS url for new language only when language changes
    useEffect(() => {
        if (prevLanguage !== language) {
            setReconnect(true);
            setPrevLanguage(language);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    return (
        <APIContext.Provider
            value={{
                subscribe,
                unsubscribe,
                queryClient: reactQueryRef.current,
                setOnReconnected,
                setOnConnected,
                connection: connectionRef.current,
                wsClient: wsClientRef.current,
            }}
        >
            <QueryClientProvider client={reactQueryRef.current}>
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

import { useCallback, useContext, useEffect, useState } from 'react';

import type {
    TSocketEndpointNames,
    TSocketPaginateableEndpointNames,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';

import APIContext from './APIContext';

const useAPI = () => {
    const api = useContext(APIContext);
    const readyState = api?.get()?.connection?.readyState;
    const [isReady, setIsReady] = useState<boolean>(readyState === WebSocket.OPEN);

    useEffect(() => {
        if ((readyState === WebSocket.OPEN) !== isReady) {
            setIsReady(readyState === WebSocket.OPEN);
        }
    }, [isReady, readyState]);

    const send = useCallback(
        async <T extends TSocketEndpointNames | TSocketPaginateableEndpointNames = TSocketEndpointNames>(
            name: T,
            payload?: TSocketRequestPayload<T>
        ): Promise<TSocketResponseData<T>> => {
            const response = await api?.send({ [name]: 1, ...(payload || {}) });

            if (response.error) {
                throw response.error;
            }

            return response;
        },
        [api]
    );

    const subscribe = useCallback(
        <T extends TSocketSubscribableEndpointNames>(
            name: T,
            payload?: TSocketRequestPayload<T>
        ): {
            subscribe: (
                // The type will be handled by the `useSubscription` hook.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onData: (response: any) => void,
                // The type will be handled by the `useSubscription` hook.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (response: any) => void
            ) => { unsubscribe?: VoidFunction };
        } => api?.subscribe({ [name]: 1, subscribe: 1, ...(payload || {}) }),
        [api]
    );

    return {
        send,
        subscribe,
        isReady,
    };
};

export default useAPI;

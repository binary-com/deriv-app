import { useCallback } from 'react';

import type {
    TSocketEndpointNames,
    TSocketPaginateableEndpointNames,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';
import { useAPIContext } from './APIProvider';

const useAPI = () => {
    const { derivAPI } = useAPIContext();

    const send = useCallback(
        async <T extends TSocketEndpointNames | TSocketPaginateableEndpointNames = TSocketEndpointNames>(
            name: T,
            payload?: TSocketRequestPayload<T>
        ): Promise<TSocketResponseData<T>> => {
            const response = await derivAPI?.send({ [name]: 1, ...(payload || {}) });

            if (response.error) {
                throw response.error;
            }

            return response;
        },
        [derivAPI]
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
        } => derivAPI?.subscribe({ [name]: 1, subscribe: 1, ...(payload || {}) }),
        [derivAPI]
    );

    return {
        send,
        subscribe,
        derivAPI,
    };
};

export default useAPI;

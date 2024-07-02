import { useCallback } from 'react';

import type {
    TSocketEndpointNames,
    TSocketPaginateableEndpointNames,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';
import { useAPIContext } from './APIProvider';

type UnsubscribeFunction = () => Promise<void> | undefined;

const useAPI = () => {
    const { wsClient, connection } = useAPIContext();

    const send = useCallback(
        async <T extends TSocketEndpointNames | TSocketPaginateableEndpointNames = TSocketEndpointNames>(
            name: T,
            payload?: TSocketRequestPayload<T>['payload']
        ): Promise<TSocketResponseData<T>> => {
            // casting needed as there is genuine type mismatch which have been there already
            // so it needs to be fixed in one of the layers,
            // potentially will make this consistent in upcoming PRs
            try {
                return wsClient?.request<T>(name, payload as unknown as TSocketRequestPayload<T>['payload']);
            } catch (e) {
                return e as TSocketResponseData<T>;
            }
        },
        [wsClient]
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
        } => {
            const subscribeHandler = (onData: (response: any) => void): { unsubscribe?: UnsubscribeFunction } => {
                // Start the subscription and keep the promise.
                const subscriptionPromise = wsClient?.subscribe(name, payload, onData);

                // Define unsubscribe function, which will be returned inside the object from subscribeHandler.
                const unsubscribe: UnsubscribeFunction = async () => {
                    const subscribeResponse = await subscriptionPromise;
                    return subscribeResponse?.unsubscribe?.();
                };

                return { unsubscribe };
            };

            return { subscribe: subscribeHandler };
        },
        [wsClient]
    );

    return {
        send,
        subscribe,
        connection,
    };
};

export default useAPI;

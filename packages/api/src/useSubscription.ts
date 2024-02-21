import { useCallback, useEffect, useRef, useState } from 'react';
import useAPI from './useAPI';
import type {
    TSocketAcceptableProps,
    TSocketError,
    TSocketRequestPayload,
    TSocketResponseData,
    TSocketSubscribableEndpointNames,
} from '../types';

const useSubscription = <T extends TSocketSubscribableEndpointNames>(name: T, idle_time = 5000) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setSubscribed] = useState(false);
    const [isIdle, setIdle] = useState(false);
    const [error, setError] = useState<TSocketError<T>>();
    const [data, setData] = useState<TSocketResponseData<T>>();
    const idle_timeout = useRef<NodeJS.Timeout>();

    const { subscribe: _subscribe } = useAPI();
    const subscribers = useRef<Map<ReturnType<ReturnType<typeof _subscribe>['subscribe']>, VoidFunction | undefined>>(
        new Map()
    );

    const subscribe = useCallback(
        (...props: TSocketAcceptableProps<T>) => {
            const prop = props?.[0];
            const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;

            setIsLoading(true);
            setSubscribed(true);
            setIdle(false);

            idle_timeout.current = setTimeout(() => {
                setIdle(true);
                setIsLoading(false);
            }, idle_time);

            try {
                const subscriber = _subscribe(name, payload).subscribe(
                    response => {
                        setData(response);
                        setIsLoading(false);
                    },
                    response => {
                        setError(response.error);
                        setIsLoading(false);
                    }
                );
                subscribers.current.set(subscriber, subscriber.unsubscribe);

                return () => {
                    subscriber.unsubscribe?.();
                    subscribers.current.delete(subscriber);
                };
            } catch (e) {
                setError(e as TSocketError<T>);
            }
        },
        [_subscribe, name, idle_time]
    );

    const unsubscribeAll = useCallback(() => {
        subscribers.current.forEach(unsubscribe => unsubscribe?.());
        setSubscribed(false);
    }, []);

    useEffect(() => {
        return () => {
            unsubscribeAll();
        };
    }, [unsubscribeAll]);

    useEffect(() => {
        return () => {
            if (idle_timeout.current) clearTimeout(idle_timeout.current);
        };
    }, [data]);

    return {
        subscribe,
        unsubscribeAll,
        isIdle,
        isLoading,
        isSubscribed,
        error,
        data,
    };
};

export default useSubscription;

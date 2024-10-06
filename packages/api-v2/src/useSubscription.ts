import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthContext } from './AuthProvider';
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
    const [error, setError] = useState<TSocketError<T>['error']>();
    const [data, setData] = useState<TSocketResponseData<T>>();
    const subscriber = useRef<{ unsubscribe?: VoidFunction }>();
    const idle_timeout = useRef<NodeJS.Timeout>();
    const { subscribe: _subscribe } = useAuthContext();

    const subscribe = useCallback(async (...props: TSocketAcceptableProps<T>) => {
        const prop = props?.[0];
        const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;

        setIsLoading(true);
        setSubscribed(true);
        setIdle(false);

        idle_timeout.current = setTimeout(() => {
            setIdle(true);
        }, idle_time);

        try {
            subscriber.current = await _subscribe(name, payload).subscribe(response => {
                setData(response);
                setIsLoading(false);
            });
        } catch (e) {
            setError((e as TSocketError<T>).error);
        }
    }, []);

    const unsubscribe = useCallback(() => {
        subscriber.current?.unsubscribe?.();
        setSubscribed(false);
    }, []);

    useEffect(() => {
        return () => {
            unsubscribe();
        };
    }, [unsubscribe]);

    useEffect(() => {
        return () => {
            if (idle_timeout.current) clearTimeout(idle_timeout.current);
        };
    }, [data]);

    return {
        subscribe,
        unsubscribe,
        isIdle,
        isLoading,
        isSubscribed,
        error,
        data,
    };
};

export default useSubscription;

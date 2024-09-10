import { WS } from '@deriv/shared';
import { useState, useEffect, useCallback, useRef } from 'react';
import { TServerError } from 'Types';

type QueryResult<T> = {
    data: null | T;
    error: TServerError | null;
    is_fetching: boolean;
    refetch: () => void;
};

type QueryOptions = {
    wait_for_authorize?: boolean;
    enabled?: boolean;
};

// Cache object to store the results
const cache: Record<string, any> = {};
const ongoing_requests: Record<string, Promise<any> | undefined> = {};

export const useDtraderQuery = <Response>(
    keys: string[],
    request: Record<string, any>,
    options: QueryOptions = {}
): QueryResult<Response> => {
    const key = keys.join('-');
    const { enabled = true } = options;
    const [data, setData] = useState<Response | null>(cache[key] || null);
    const [error, setError] = useState<TServerError | null>(null);
    const [is_fetching, setIsLoading] = useState(!cache[key] && enabled);
    const is_mounted = useRef(false);
    const request_string = JSON.stringify(request);

    const { wait_for_authorize = true } = options;

    useEffect(() => {
        is_mounted.current = true;

        return () => {
            is_mounted.current = false;
        };
    }, []);

    const fetchData = useCallback(() => {
        setIsLoading(true);

        let send_promise: Promise<any> | undefined;

        if (ongoing_requests[key]) {
            send_promise = ongoing_requests[key];
        } else {
            const request = JSON.parse(request_string);
            send_promise = wait_for_authorize ? WS.authorized.send(request) : WS.send(request);
            ongoing_requests[key] = send_promise;
        }

        send_promise
            ?.then((result: Response) => {
                if (!is_mounted.current) return;

                cache[key] = result;
                setData(result);
                setIsLoading(false);
            })
            .catch((err: TServerError) => {
                if (!is_mounted.current) return;

                setError(err);
                setIsLoading(false);
            })
            .finally(() => {
                delete ongoing_requests[key];
            });
    }, [setIsLoading, key, request_string, wait_for_authorize]);

    useEffect(() => {
        if (enabled && !cache[key]) {
            fetchData();
        }
    }, [key, fetchData, enabled]);

    const refetch = useCallback(() => {
        if (enabled) {
            cache[key] = null;
            fetchData();
        }
    }, [enabled, fetchData, key]);

    return { data, error, is_fetching, refetch };
};

export const invalidateDTraderCache = (keys: string[]) => {
    const key = keys.join('-');
    cache[key] = null;
};

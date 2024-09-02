import { WS } from '@deriv/shared';
import { useState, useEffect, useCallback, useRef } from 'react';
import { TServerError } from 'Types';

type QueryResult<T> = {
    data: null | T;
    error: TServerError | null;
    is_loading: boolean;
    refetch: () => void;
};

type QueryOptionsBase = {
    wait_for_authorize?: boolean;
    enabled?: boolean;
};

type QueryOptions = QueryOptionsBase;

// Cache object to store the results
const cache: Record<string, any> = {};
const ongoing_requests: Record<string, Promise<any> | undefined> = {};

const useDtraderQueryBase = <Response>(
    key: string,
    request: Record<string, any>,
    options: QueryOptionsBase = {}
): QueryResult<Response> => {
    const { enabled = false } = options;
    const [data, setData] = useState<Response | null>(cache[key] || null);
    const [error, setError] = useState<TServerError | null>(null);
    const [is_loading, setIsLoading] = useState(!cache[key] && enabled);
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

        let send_promise;

        if (ongoing_requests[key]) {
            send_promise = ongoing_requests[key];
        } else {
            const request = JSON.parse(request_string);
            send_promise = wait_for_authorize ? WS.authorized.send(request) : WS.send(request);
            ongoing_requests[key] = send_promise;
        }

        send_promise
            .then((result: Response) => {
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

    return { data, error, is_loading, refetch };
};

export const useDtraderQuery = <Response>(
    key: string,
    request: Record<string, any>,
    options: QueryOptions = {}
): QueryResult<Response> => {
    return useDtraderQueryBase<Response>(key, request, options);
};

export const invalidateDTraderCache = (key: string) => {
    cache[key] = null;
};

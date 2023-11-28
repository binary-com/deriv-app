import useInfiniteQuery from './useInfiniteQuery';
import useMutation from './useMutation';
import useQuery from './useQuery';

export { default as APIProvider } from './APIProvider';
export * from './hooks';
export { default as useInvalidateQuery } from './useInvalidateQuery';
export { default as usePaginatedFetch } from './usePaginatedFetch';
export { default as useSubscription } from './useSubscription';

export {
    useInfiniteQuery,
    useMutation,
    useQuery,
    /** @deprecated use `useQuery` instead */
    useQuery as useFetch,
    /** @deprecated use `useMutation` instead */
    useMutation as useRequest,
};

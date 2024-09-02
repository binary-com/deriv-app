import useInfiniteQuery from './useInfiniteQuery';
import useMutation from './useMutation';
import useQuery from './useQuery';
import type {
    LandingCompany,
    LandingCompanyResponse,
    StatesList,
    StatesListResponse,
} from './types/api-types-overrides';

export { default as APIProvider } from './APIProvider';
export { default as useInvalidateQuery } from './useInvalidateQuery';
export { default as usePaginatedFetch } from './usePaginatedFetch';
export { default as useSubscription } from './useSubscription';
export { default as useRemoteConfig } from './hooks/useRemoteConfig';
export { LandingCompany, LandingCompanyResponse, StatesList, StatesListResponse };
export * from './hooks';

export {
    useInfiniteQuery,
    useMutation,
    useQuery,
    /** @deprecated use `useQuery` instead */
    useQuery as useFetch,
    /** @deprecated use `useMutation` instead */
    useMutation as useRequest,
};

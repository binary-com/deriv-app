import React from 'react';
import useInfiniteQuery from '../../useInfiniteQuery';
import useAuthorize from '../useAuthorize';

/** This custom hook returns a list of orders under the current client. */
const useOrderList = (
    payload?: NonNullable<Parameters<typeof useInfiniteQuery<'p2p_order_list'>>[1]>['payload'],
    config?: NonNullable<Parameters<typeof useInfiniteQuery<'p2p_order_list'>>[1]>['options']
) => {
    const { isSuccess } = useAuthorize();
    const { data, fetchNextPage, ...rest } = useInfiniteQuery('p2p_order_list', {
        payload: { ...payload, offset: payload?.offset || 0, limit: payload?.limit || 50 },
        options: {
            getNextPageParam: (lastPage, pages) => {
                if (!lastPage?.p2p_order_list?.list) return;

                return pages.length;
            },
            enabled: isSuccess && (config?.enabled === undefined || config.enabled),
        },
    });

    // Flatten the data array
    const flatten_data = React.useMemo(() => {
        if (!data?.pages?.length) return;

        return data?.pages?.flatMap(page => page?.p2p_order_list?.list);
    }, [data?.pages]);

    // Additional p2p_order_list data
    const modified_data = React.useMemo(() => {
        if (!flatten_data?.length) return undefined;

        return flatten_data.map(advert => ({
            ...advert,
            /** Details of the advert for this order. */
            advert_details: {
                ...advert?.advert_details,
                /** Indicates if this is block trade advert or not. */
                block_trade: Boolean(advert?.advert_details?.block_trade),
            },
            /** Details of the advertiser for this order. */
            advertiser_details: {
                ...advert?.advertiser_details,
                /** Indicates if the advertiser is currently online. */
                is_online: Boolean(advert?.advertiser_details?.is_online),
                /** Indicates that the advertiser was recommended in the most recent review by the current user. */
                is_recommended: Boolean(advert?.advertiser_details?.is_recommended),
            },
            /** Details of the client who created the order. */
            client_details: {
                ...advert?.client_details,
                /** Indicates if the advertiser is currently online. */
                is_online: Boolean(advert?.advertiser_details?.is_online),
                /** Indicates that the advertiser was recommended in the most recent review by the current user. */
                is_recommended: Boolean(advert?.advertiser_details?.is_recommended),
            },
            /** The epoch time of the order completion. */
            completion_time: advert?.completion_time ? new Date(advert.completion_time) : undefined,
            /** The advert creation time in epoch. */
            created_time: advert?.created_time ? new Date(advert.created_time) : undefined,
            /** The epoch time in which the order will be expired. */
            expiry_time: advert?.expiry_time ? new Date(advert.expiry_time) : undefined,
            /** 1 if the order is created for the advert of the current client, otherwise 0. */
            is_incoming: Boolean(advert?.is_incoming),
            /** 1 if a review can be given, otherwise 0 */
            is_reviewable: Boolean(advert?.is_reviewable),
            /** 1 if the latest order changes have been seen by the current client, otherwise 0. */
            is_seen: Boolean(advert?.is_seen),
            /** Details of the review you gave for this order, if any. */
            review_details: {
                ...advert?.review_details,
                /** 1 if the advertiser is recommended, 0 if not recommended. */
                recommended: Boolean(advert?.review_details?.recommended),
            },
            /** Indicates that the seller in the process of confirming the order. */
            verification_pending: Boolean(advert?.verification_pending),
            /** Epoch time that the current verification token will expire. */
            verification_token_expiry: advert?.verification_token_expiry
                ? new Date(advert.verification_token_expiry)
                : undefined,
        }));
    }, [flatten_data]);

    return {
        /** The 'p2p_order_list' response. */
        data: modified_data,
        loadMoreOrders: fetchNextPage,
        ...rest,
    };
};

export default useOrderList;

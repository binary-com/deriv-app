import { useP2PAdvertList } from '@deriv/hooks';
import { useStores } from 'Stores/index';

/**
 * @name useP2PAdvertiserAdverts
 *
 * @description This custom hook returns paginated available adverts for a given advertiser based on their advertiser_id by calling 'p2p_advert_list' endpoint
 * @returns {object} The returned object contains many fields, some of which are explained below:
 * object.loadMoreAdvertiserAdverts - A function to load more adverts.  (used by the InfiniteLoader @see https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md).
 * object.has_more_adverts_to_load - Whether there are more adverts to load (used by the InfiniteLoader @see https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md).
 * @example const { adverts, has_more_adverts_to_load, ...rest } = useP2PAdvertiserAdverts();
 * */

const useP2PAdvertiserAdverts = () => {
    const { advertiser_page_store, general_store } = useStores();
    const { advertiser_details_id, counterparty_type, is_counterparty_advertiser_blocked } = advertiser_page_store;
    const { advertiser_id, counterparty_advertiser_id, is_advertiser_info_subscribed, list_item_limit } = general_store;
    const is_my_advert = advertiser_details_id === advertiser_id;
    const is_advertiser_blocked = !!is_counterparty_advertiser_blocked && !is_my_advert;

    const {
        data: adverts = [],
        loadMoreAdverts: loadMoreAdvertiserAdverts,
        ...rest
    } = useP2PAdvertList(
        {
            counterparty_type,
            limit: list_item_limit,
            advertiser_id:
                counterparty_advertiser_id && is_advertiser_info_subscribed
                    ? counterparty_advertiser_id
                    : advertiser_details_id,
        },
        {
            enabled: !is_advertiser_blocked, // Only fetch adverts if the advertiser is not blocked. This stops the page shift on window refocus when the overlay is shown and the buy/sell table gets a loader due to isFetching.
        }
    );
    const has_more_adverts_to_load = adverts.length >= list_item_limit;

    return {
        adverts,
        has_more_adverts_to_load,
        loadMoreAdvertiserAdverts,
        ...rest,
    };
};

export default useP2PAdvertiserAdverts;

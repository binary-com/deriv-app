import React from 'react';
import { useP2PAdvertList } from '@deriv/hooks';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores/index';
import { useStore } from '@deriv/stores';

type TAdvertList = ReturnType<typeof useP2PAdvertList>['data'];

/**
 * @name getSearchResults
 * Filter out adverts based on the search term. Btw, this causes a bug that's in production as well.
 * If a user doesn't scroll to the bottom before searching, the items that fall outside of the limit won't be part of the search results.
 *  */
const getSearchResults = (items: TAdvertList, search_term: string) => {
    if (search_term) {
        return items?.filter(item =>
            item.advertiser_details?.name.toLowerCase().includes(search_term.toLowerCase().trim())
        );
    }
};

/**
 *  @name getRenderedAdverts
 * @returns { Array } - adverts that are ready to be rendered. Adverts that consist of a combination of items filtered based on the
 * Buy/Sell toggle and the search term. See useP2PRenderedAdverts for more information.
 */
const getRenderedAdverts = (
    search_term: string,
    search_results: TAdvertList,
    is_mobile_or_tablet: boolean,
    filtered_items: TAdvertList = []
) => {
    const EMPTY_ITEM_PLACE_HOLDER = { id: 'WATCH_THIS_SPACE' };
    const NO_MATCH_ROW = { id: 'NO_MATCH_ROW' };
    let rendered_adverts: DeepPartial<TAdvertList> = [];
    if (is_mobile_or_tablet) {
        if (search_term) {
            rendered_adverts = [EMPTY_ITEM_PLACE_HOLDER, NO_MATCH_ROW];
            if (search_results?.length) {
                rendered_adverts = [EMPTY_ITEM_PLACE_HOLDER, ...search_results];
            }
        } else {
            // This allows for the sliding animation on the Buy/Sell toggle as it pushes
            // an empty item with an item that holds the same height of the toggle container.
            // Also see: buy-sell-row.jsx
            rendered_adverts = [EMPTY_ITEM_PLACE_HOLDER, ...filtered_items];
        }
    } else {
        rendered_adverts = filtered_items;
        if (search_term) {
            rendered_adverts = [NO_MATCH_ROW];
            if (search_results?.length) {
                rendered_adverts = search_results;
            }
        }
    }
    return rendered_adverts;
};

/**
 * @name useP2PRenderedAdverts
 *
 * @description This custom hook returns paginated available adverts in a format that's ready to be rendered by calling 'p2p_advert_list' endpoint
 * @returns {object} The returned object contains many fields, some of which are explained below:
 * object.loadMore - A function to load more adverts.  (used by the InfiniteLoader @see https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md).
 * object.has_more_adverts_to_load - Whether there are more adverts to load (used by the InfiniteLoader @see https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md).
 * @example const { rendered_adverts, has_more_items_to_load, loadMore, ...rest } = useP2PRenderedAdverts();
 *
 * */
const useP2PRenderedAdverts = () => {
    const { general_store, buy_sell_store } = useStores();
    const { ui } = useStore();
    const {
        sort_by,
        should_use_client_limits,
        is_buy,
        selected_payment_method_value,
        selected_local_currency,
        table_type,
        search_term,
    } = buy_sell_store;
    const { list_item_limit } = general_store;
    const { is_mobile_or_tablet } = ui;
    const counterparty_type = is_buy ? buy_sell.BUY : buy_sell.SELL;

    const { data: items = [], ...rest } = useP2PAdvertList({
        counterparty_type,
        limit: list_item_limit,
        sort_by,
        use_client_limits: should_use_client_limits ? 1 : 0,
        ...(selected_payment_method_value.length > 0 ? { payment_method: selected_payment_method_value } : {}),
        ...(selected_local_currency ? { local_currency: selected_local_currency } : {}),
    });

    const has_more_items_to_load = items.length >= general_store.list_item_limit;

    // Filter out adverts based on the Buy/Sell toggle. If the toggle is set to Buy, only show Sell adverts and vice versa.
    const filtered_items = React.useMemo(() => {
        return items.filter(item =>
            table_type === buy_sell.BUY ? item.type === buy_sell.SELL : item.type === buy_sell.BUY
        );
    }, [items, table_type]);

    const search_results = React.useMemo(() => {
        return getSearchResults(items, search_term);
    }, [search_term, items]);

    const rendered_adverts = React.useMemo(() => {
        return getRenderedAdverts(search_term, search_results, is_mobile_or_tablet, filtered_items);
    }, [search_term, filtered_items, is_mobile_or_tablet, search_results]);

    return {
        rendered_adverts,
        has_more_items_to_load,
        ...rest,
    };
};

export default useP2PRenderedAdverts;

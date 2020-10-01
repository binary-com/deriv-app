import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@deriv/components';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import Empty from 'Components/empty/empty.jsx';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { height_constants } from 'Utils/height_constants';
import { requestWS } from 'Utils/websocket';
import { RowComponent, BuySellRowLoader } from './row.jsx';
import { BuySellTable } from './buy-sell-table.jsx';

const BuySellTableContent = ({ is_buy, setSelectedAdvert }) => {
    const { list_item_limit } = React.useContext(Dp2pContext);
    const is_mounted = React.useRef(false);
    const item_offset = React.useRef(0);
    const [has_more_items_to_load, setHasMoreItemsToLoad] = React.useState(false);
    const [api_error_message, setApiErrorMessage] = React.useState('');
    const [is_loading, setIsLoading] = React.useState(true);
    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        is_mounted.current = true;
        loadMoreItems(item_offset.current, list_item_limit);
        return () => (is_mounted.current = false);
    }, []);

    React.useEffect(() => {
        setIsLoading(true);
        if (is_mounted.current) {
            loadMoreItems(item_offset.current, list_item_limit);
        }
    }, [is_buy]);

    const loadMoreItems = start_idx => {
        return new Promise(resolve => {
            requestWS({
                p2p_advert_list: 1,
                counterparty_type: is_buy ? 'buy' : 'sell',
                offset: start_idx,
                limit: list_item_limit,
            }).then(response => {
                if (is_mounted.current) {
                    if (!response.error) {
                        const { list } = response.p2p_advert_list;

                        setHasMoreItemsToLoad(list.length >= list_item_limit);
                        setItems(items.concat(list));
                        item_offset.current += list.length;
                    } else {
                        setApiErrorMessage(response.error.message);
                    }
                    setIsLoading(false);
                }
                resolve();
            });
        });
    };

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }
    if (api_error_message) {
        return <TableError message={api_error_message} />;
    }

    const Row = props => <RowComponent {...props} setSelectedAdvert={setSelectedAdvert} />;

    if (items.length) {
        const item_height = 56;
        const height_values = [
            height_constants.screen,
            height_constants.core_header,
            height_constants.page_overlay_header,
            height_constants.page_overlay_content_padding,
            height_constants.tabs,
            height_constants.filters,
            height_constants.filters_margin,
            height_constants.table_header,
            height_constants.core_footer,
        ];
        return (
            <BuySellTable>
                <InfiniteLoaderList
                    autosizer_height={`calc(${height_values.join(' - ')})`}
                    items={items}
                    item_size={item_height}
                    RenderComponent={Row}
                    RowLoader={BuySellRowLoader}
                    has_more_items_to_load={has_more_items_to_load}
                    loadMore={loadMoreItems}
                />
            </BuySellTable>
        );
    }

    return <Empty has_tabs icon='IcCashierNoAds' title={localize('No ads found')} />;
};

BuySellTableContent.propTypes = {
    is_buy: PropTypes.bool,
    setSelectedAdvert: PropTypes.func,
};

export default BuySellTableContent;

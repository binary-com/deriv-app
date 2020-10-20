import React from 'react';
import { Loading, Button } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import { TableError } from 'Components/table/table-error.jsx';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import Empty from 'Components/empty/empty.jsx';
import { useStores } from 'Stores';
import { createExtendedOrderDetails } from 'Utils/orders';
import OrderTableHeader from './order-table-header.jsx';
import OrderRowComponent from './order-table-row.jsx';

const OrderTableContent = observer(() => {
    const { general_store, order_store } = useStores();

    const Row = row_props => <OrderRowComponent {...row_props} />;

    React.useEffect(() => {
        order_store.setIsLoading(true);
        order_store.loadMoreOrders();
    }, [general_store.order_table_type]);

    if (order_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }
    if (order_store.api_error_message) {
        return <TableError message={order_store.api_error_message} />;
    }

    if (general_store.orders.length) {
        const { client, props } = general_store;
        const modified_list = general_store.orders
            .map(order => createExtendedOrderDetails(order, client.loginid, props.server_time))
            .filter(order => (general_store.is_active_tab ? order.is_active_order : order.is_inactive_order));

        if (modified_list.length) {
            return (
                <OrderTableHeader>
                    <InfiniteLoaderList
                        autosizer_height={`calc(${order_store.height_values.join(' - ')})`}
                        items={modified_list}
                        item_size={order_store.item_height}
                        RenderComponent={Row}
                        has_more_items_to_load={order_store.has_more_items_to_load}
                        loadMore={order_store.loadMoreOrders}
                    />
                </OrderTableHeader>
            );
        }
    }

    return (
        <Empty has_tabs icon='IcNoOrder' title={localize('You have no orders')}>
            {general_store.is_active_tab && (
                <Button primary large className='p2p-empty__button' onClick={() => general_store.handleTabClick(0)}>
                    <Localize i18n_default_text='Buy/Sell' />
                </Button>
            )}
        </Empty>
    );
});

export default OrderTableContent;

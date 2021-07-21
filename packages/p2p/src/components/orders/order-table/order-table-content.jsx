import React from 'react';
import PropTypes from 'prop-types';
import { Loading, Button, InfiniteDataList, Div100vhContainer } from '@deriv/components';
import { reaction } from 'mobx';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';
import { TableError } from 'Components/table/table-error.jsx';
import Empty from 'Components/empty/empty.jsx';
import OrderRow from 'Components/orders/order-table/order-table-row.jsx';
import OrderTableHeader from 'Components/orders/order-table/order-table-header.jsx';
import { useStores } from 'Stores';
import { createExtendedOrderDetails } from 'Utils/orders';

const ContentWrapper = ({ children }) => {
    if (isMobile()) {
        return <Div100vhContainer height_offset='21rem'>{children}</Div100vhContainer>;
    }
    return <OrderTableHeader>{children}</OrderTableHeader>;
};

const OrderTableContent = () => {
    const { general_store, order_store } = useStores();

    React.useEffect(
        () =>
            reaction(
                () => general_store.order_table_type,
                () => {
                    order_store.setIsLoading(true);
                    order_store.setOrders([]);
                    order_store.loadMoreOrders({ startIndex: 0 });
                },
                { fireImmediately: true }
            ),
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    if (order_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (order_store.api_error_message) {
        return <TableError message={order_store.api_error_message} />;
    }

    if (order_store.orders.length) {
        const { client, props } = general_store;
        const modified_list = order_store.orders
            .map(order => createExtendedOrderDetails(order, client.loginid, props.server_time))
            // TODO: Get rid of this filter if confirmed that BE is sending correct data.
            .filter(order => (general_store.is_active_tab ? order.is_active_order : order.is_inactive_order));

        if (modified_list.length) {
            return (
                <ContentWrapper>
                    <InfiniteDataList
                        data_list_className='orders__data-list'
                        has_more_items_to_load={order_store.has_more_items_to_load}
                        items={modified_list}
                        keyMapperFn={item => item.id}
                        loadMoreRowsFn={order_store.loadMoreOrders}
                        rowRenderer={row_props => <OrderRow {...row_props} />}
                    />
                </ContentWrapper>
            );
        }
    }

    return (
        <Empty has_tabs icon='IcNoOrder' title={<Localize i18n_default_text='You have no orders.' />}>
            {general_store.is_active_tab && (
                <Button primary large className='p2p-empty__button' onClick={() => general_store.handleTabClick(0)}>
                    <Localize i18n_default_text='Buy/Sell' />
                </Button>
            )}
        </Empty>
    );
};

OrderTableContent.propTypes = {
    is_active: PropTypes.bool,
    showDetails: PropTypes.func,
};

export default observer(OrderTableContent);

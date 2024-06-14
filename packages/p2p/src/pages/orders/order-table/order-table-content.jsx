import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Loading, Button, InfiniteDataList, Div100vhContainer, Text } from '@deriv/components';
import { reaction } from 'mobx';
import { isMobileOrTablet, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import TableError from 'Components/section-error';
import P2pEmpty from 'Components/p2p-empty';
import OrderRow from 'Pages/orders/order-table/order-table-row.jsx';
import OrderTableHeader from 'Pages/orders/order-table/order-table-header.jsx';
import { useStores } from 'Stores';
import { createExtendedOrderDetails } from 'Utils/orders';

const ContentWrapper = ({ children }) => {
    if (isMobileOrTablet()) {
        return <Div100vhContainer height_offset='21rem'>{children}</Div100vhContainer>;
    }
    return <OrderTableHeader>{children}</OrderTableHeader>;
};

const OrderTableContent = () => {
    const { general_store, order_store } = useStores();
    const {
        client: { loginid },
    } = useStore();
    const history = useHistory();
    const { is_active_tab } = general_store;
    const getNoOrderMessage = () => {
        if (is_active_tab) {
            return (
                <Text weight='bold'>
                    <Localize i18n_default_text='You have no orders.' />
                </Text>
            );
        }

        return (
            <Text as='div' align='center' color='less-prominent'>
                <Localize i18n_default_text="You've made no transactions of this type during this period." />
            </Text>
        );
    };

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
        return <TableError message={order_store.api_error_message} size='xs' className='section-error__table' />;
    }

    if (order_store.orders.length) {
        const modified_list = order_store.orders
            .map(order => createExtendedOrderDetails(order, loginid, general_store.server_time))
            // TODO: Get rid of this filter if confirmed that BE is sending correct data.
            .filter(order => (is_active_tab ? order.is_active_order : order.is_inactive_order));

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
        <P2pEmpty
            has_tabs
            icon={is_active_tab ? 'IcNoOrder' : 'IcStatement'}
            is_disabled={!is_active_tab}
            title={getNoOrderMessage()}
        >
            {is_active_tab && (
                <Button
                    primary
                    large
                    className='p2p-empty__button'
                    onClick={() => {
                        general_store.handleTabClick(0);
                        history.push({ pathname: routes.p2p_buy_sell });
                    }}
                >
                    <Localize i18n_default_text='Buy/Sell' />
                </Button>
            )}
        </P2pEmpty>
    );
};

OrderTableContent.propTypes = {
    is_active: PropTypes.bool,
    server_time: PropTypes.object,
    showDetails: PropTypes.func,
};

export default observer(OrderTableContent);

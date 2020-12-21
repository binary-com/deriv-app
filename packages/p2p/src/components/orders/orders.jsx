import React from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import OrderDetails from 'Components/order-details/order-details.jsx';
import { useStores } from 'Stores';
import OrderTable from './order-table/order-table.jsx';
import './orders.scss';

const Orders = observer(() => {
    const { order_store } = useStores();

    // This is a bit hacky, but it allows us to force re-render this
    // component when the timer expired. This is created due to BE
    // not expiring orders on time. Remove this when they do.
    const [, forceRerender] = React.useState();
    order_store.setForceRerenderOrders(forceRerender);

    React.useEffect(() => {
        const disposeOrderIdReaction = reaction(
            () => order_store.order_id,
            () => order_store.onOrderIdUpdate(),
            { fireImmediately: true }
        );

        const disposeOrdersUpdateReaction = reaction(
            () => order_store.orders,
            () => order_store.onOrdersUpdate(),
            { fireImmediately: true }
        );

        return () => {
            disposeOrderIdReaction();
            disposeOrdersUpdateReaction();
            order_store.onUnmount();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (order_store.order_information) {
        return (
            <div className='orders'>
                <OrderDetails onPageReturn={() => order_store.hideDetails(true)} />
            </div>
        );
    }

    return (
        <div className='orders'>
            <OrderTable />
        </div>
    );
});

Orders.displayName = 'Orders';

export default Orders;

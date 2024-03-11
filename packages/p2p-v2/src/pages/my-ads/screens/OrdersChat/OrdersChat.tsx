import React from 'react';
import { OrdersChatSection } from '../OrdersChatSection';
import './OrdersChat.scss';

const OrdersChat = () => {
    return (
        <div className='flex justify-center p2p-v2-orders-chat '>
            <OrdersChatSection />
        </div>
    );
};

export default OrdersChat;

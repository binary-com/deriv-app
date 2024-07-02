import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useStores } from 'Stores';
import { render, screen } from '@testing-library/react';
import OrderDetails from '../order-details.jsx';

const mock_order_info = {
    account_currency: 'USD',
    advert_details: { description: 'P2P Dev' },
    amount_display: 20,
    chat_channel_url: 'http://www.deriv.com',
    contact_info: '123-456',
    has_timer_expired: false,
    id: 123,
    is_active_order: false,
    is_buy_order_for_user: false,
    is_buyer_confirmed_order: false,
    is_my_ad: false,
    is_pending_order: false,
    is_sell_order: false,
    labels: {
        counterparty_nickname_label: 'Test',
        result_string: 'Result str',
        left_send_or_receive: 'Left Send or receive',
        right_send_or_receive: 'Right Send or receive',
        payment_details: 'Payment details',
        contact_details: 'Contact',
        instructions: ' Test Instructions',
    },
    local_currency: 'AED',
    other_user_details: { name: 'Deriv P2P', first_name: 'Deriv', last_name: 'P2P' },
    payment_info: 'Online',
    purchase_time: '10.00',
    rate: 2,
    should_highlight_alert: false,
    should_highlight_danger: false,
    should_highlight_success: false,
    should_show_lost_funds_banner: false,
    should_show_order_footer: false,
    status_string: 'Check',
};

const mock_order_store = {
    order_information: { ...mock_order_info },
    order_id: '123',
    has_order_payment_method_details: false,
    order_payment_method_details: [],
    setOrderPaymentMethodDetails: jest.fn(),
    getSettings: jest.fn(),
    getWebsiteStatus: jest.fn(),
    setRatingValue: jest.fn(),
    setIsRecommended: jest.fn(),
    setOrderId: jest.fn(),
    setActiveOrder: jest.fn(),
};
const mock_sendbird_store = {
    should_show_chat_on_orders: false,
    setChatChannelUrl: jest.fn(),
    setHasChatError: jest.fn(),
    createChatForNewOrder: jest.fn(),
    registerEventListeners: jest.fn().mockReturnValue(jest.fn()),
    registerMobXReactions: jest.fn().mockReturnValue(jest.fn()),
};

const mock_my_profile_store = {
    getPaymentMethodsList: jest.fn(),
};

const mock_buy_sell_store = {
    is_create_order_subscribed: true,
    setIsCreateOrderSubscribed: jest.fn(),
    unsubscribeCreateOrder: jest.fn(),
};

const mock_general_store = {
    redirectToOrderDetails: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({
        order_store: { ...mock_order_store },
        sendbird_store: { ...mock_sendbird_store },
        my_profile_store: { ...mock_my_profile_store },
        buy_sell_store: { ...mock_buy_sell_store },
        general_store: { ...mock_general_store },
    })),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => ({
        isCurrentModal: false,
        showModal: () => {},
        hideModal: () => {},
        useRegisterModalProps: () => {},
    })),
}));

jest.mock('Components/order-details/order-details-footer.jsx', () => jest.fn(() => <div>Order details footer</div>));

jest.mock('Components/order-details/order-info-block.jsx', () => jest.fn(() => <div>Order Info Block</div>));

jest.mock('Pages/orders/chat/chat.jsx', () => jest.fn(() => <div>Chat section</div>));

jest.mock('Components/p2p-accordion/p2p-accordion.jsx', () => jest.fn(() => <div>Payment methods listed</div>));

describe('<OrderDetails/>', () => {
    it('should render component with loss of funds warning banner', () => {
        useStores.mockReturnValue({
            order_store: {
                ...mock_order_store,
                order_information: {
                    ...mock_order_info,
                    should_show_lost_funds_banner: true,
                    chat_channel_url: null,
                },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails onPageReturn={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(
            screen.getByText("Don't risk your funds with cash transactions. Use bank transfers or e-wallets instead.")
        ).toBeInTheDocument();
    });
    it('should render success message when highlight success is true', () => {
        useStores.mockReturnValue({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info, should_highlight_success: true },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails onPageReturn={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('Result str')).toBeInTheDocument();
    });
    it('should display footer info when show_order_footer is set', () => {
        useStores.mockReturnValue({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info, should_show_order_footer: true },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails onPageReturn={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('Order details footer')).toBeInTheDocument();
    });
    it('should display formatted currency when the order is pending', () => {
        useStores.mockReturnValue({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info, is_pending_order: true },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails onPageReturn={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('40.00 AED')).toBeInTheDocument();
    });
    it('should display payment details when Order is active', () => {
        useStores.mockReturnValue({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info, is_active_order: true },
                has_order_payment_method_details: true,
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails onPageReturn={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('Payment details')).toBeInTheDocument();
    });
    it('should render Chat component if should_show_chat_on_orders is enabled', () => {
        useStores.mockReturnValue({
            order_store: {
                ...mock_order_store,
            },
            sendbird_store: { ...mock_sendbird_store, should_show_chat_on_orders: true },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails onPageReturn={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('Chat section')).toBeInTheDocument();
    });
    it('should display Buy section when is_buy_order_for_user flag is enabled', () => {
        useStores.mockReturnValue({
            order_store: {
                ...mock_order_store,
                order_information: { ...mock_order_info, is_buy_order_for_user: true },
            },
            sendbird_store: { ...mock_sendbird_store },
            my_profile_store: { ...mock_my_profile_store },
            buy_sell_store: { ...mock_buy_sell_store },
            general_store: { ...mock_general_store },
        });
        render(<OrderDetails onPageReturn={jest.fn()} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('Buy USD order')).toBeInTheDocument();
    });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores';
import { mockStore, StoreProvider } from '@deriv/stores';
import AppContent from '../app-content.jsx';

const mocked_store_values = {
    general_store: {
        is_loading: false,
        should_show_dp2p_blocked: false,
        props: { should_show_verification: false },
        is_advertiser: false,
    },
    buy_sell_store: {
        setTableType: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mocked_store_values),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => ({
        showModal: jest.fn(),
        hideModal: jest.fn(),
    })),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Tabs: jest.fn(({ children }) => (
        <div>
            Tabs<div>{children}</div>
        </div>
    )),
    Loading: () => <div>Loading</div>,
}));

// jest.mock('Components/dp2p-blocked', () => jest.fn(() => 'Dp2pBlocked'));
jest.mock('Components/verification/verification', () => jest.fn(() => 'Verification'));
jest.mock('Pages/my-ads/my-ads', () => jest.fn(() => 'MyAds'));
jest.mock('Pages/orders/orders', () => jest.fn(() => 'Orders'));
jest.mock('Pages/buy-sell/buy-sell', () => jest.fn(() => 'BuySell'));
jest.mock('Pages/my-profile', () => jest.fn(() => 'MyProfile'));

describe('<AppContent/>', () => {
    it('should set the table type to buy on initial page render', () => {
        render(<AppContent />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(mocked_store_values.buy_sell_store.setTableType).toHaveBeenCalledWith('buy');
    });
    it('should load the Tab component when no error status are set', () => {
        render(<AppContent />, {
            // TODO: remove StoreProvider Wrappers when we fix routing for p2p
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Tabs')).toBeInTheDocument();
    });

    it('should render the loading component when is_loading state is true', () => {
        useStores.mockImplementation(() => ({
            ...mocked_store_values,
            general_store: { ...mocked_store_values.general_store, is_loading: true },
        }));
        render(<AppContent />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    // it('should render the DP2P blocked component when should_show_dp2p_blocked state is true', () => {
    //     useStores.mockImplementation(() => ({
    //         general_store: { ...mocked_store_values, should_show_dp2p_blocked: true },
    //     }));
    //     render(<AppContent />, {
    //         wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
    //     });

    //     expect(screen.getByText('Dp2pBlocked')).toBeInTheDocument();
    // });

    // it('should render only the first notification component when multiple error status is set', () => {
    //     useStores.mockImplementation(() => ({
    //         general_store: { ...mocked_store_values, should_show_popup: true, should_show_dp2p_blocked: true },
    //     }));
    //     render(<AppContent />, {
    //         wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
    //     });

    //     expect(screen.queryByText('NicknameForm')).not.toBeInTheDocument();
    //     expect(screen.getByText('Dp2pBlocked')).toBeInTheDocument();
    // });
});

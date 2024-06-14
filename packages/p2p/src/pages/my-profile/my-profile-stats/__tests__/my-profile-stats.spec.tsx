import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isMobile } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores/index';
import MyProfileStats from '../my-profile-stats';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileOrTabletWrapper: jest.fn(({ children }) => children),
    MobileFullPageModal: ({ children, pageHeaderReturnFn = mock_store.setActiveTab }) => (
        <div>
            <button onClick={pageHeaderReturnFn}>Return</button>
            {children}
        </div>
    ),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => true),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<MyProfileStats />', () => {
    beforeEach(() => {
        mock_store = {
            general_store: {
                advertiser_info: {
                    buy_completion_rate: 100,
                    buy_orders_amount: 1,
                    buy_orders_count: 1,
                    buy_time_avg: 80,
                    partner_count: 1,
                    release_time_avg: 60,
                    sell_completion_rate: 100,
                    sell_orders_amount: 1,
                    sell_orders_count: 1,
                    total_orders_count: 2,
                    total_turnover: 50,
                },
            },
            my_profile_store: {
                setActiveTab: jest.fn(),
            },
        };
        (isMobile as jest.Mock).mockReturnValue(true);
    });

    it('should render MyProfileStats component showing all 4 tabs if isMobile is true', () => {
        render(<MyProfileStats />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Stats')).toBeInTheDocument();
        expect(screen.getByText('Payment methods')).toBeInTheDocument();
        expect(screen.getByText('Ad details')).toBeInTheDocument();
        expect(screen.getByText('My counterparties')).toBeInTheDocument();
    });

    it('should allow the user to press the return button in MobileFullPageModal', () => {
        const setShouldShowStatsAndRatingsMock = jest.spyOn(React, 'useState');
        (setShouldShowStatsAndRatingsMock as jest.Mock).mockImplementation(initialValue => [initialValue, jest.fn()]);

        render(<MyProfileStats />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        const returnButton = screen.getByRole('button', { name: 'Return' });
        userEvent.click(returnButton);

        expect(setShouldShowStatsAndRatingsMock).toBeCalled();
    });

    it('should allow a user to click on each different tab, which should call setShouldShowStatsAndRatings and setActiveTab', () => {
        const setShouldShowStatsAndRatingsMock = jest.spyOn(React, 'useState');
        (setShouldShowStatsAndRatingsMock as jest.Mock).mockImplementation(initialValue => [initialValue, jest.fn()]);

        const setActiveTabMock = jest.fn();
        mock_store.my_profile_store.setActiveTab = setActiveTabMock;

        render(<MyProfileStats />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        const statsTab = screen.getByText('Stats');
        const paymentMethodsTab = screen.getByText('Payment methods');
        const adDetailsTab = screen.getByText('Ad details');
        const myCounterpartiesTab = screen.getByText('My counterparties');

        userEvent.click(statsTab);
        expect(setShouldShowStatsAndRatingsMock).toBeCalled();

        userEvent.click(paymentMethodsTab);
        expect(setActiveTabMock).toBeCalledTimes(1);
        expect(setActiveTabMock).toBeCalledWith(my_profile_tabs.PAYMENT_METHODS);

        userEvent.click(adDetailsTab);
        expect(setActiveTabMock).toBeCalledTimes(2);
        expect(setActiveTabMock).toBeCalledWith(my_profile_tabs.AD_TEMPLATE);

        userEvent.click(myCounterpartiesTab);
        expect(setActiveTabMock).toBeCalledTimes(3);
        expect(setActiveTabMock).toBeCalledWith(my_profile_tabs.MY_COUNTERPARTIES);
    });
});

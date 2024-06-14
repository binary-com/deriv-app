import React from 'react';
import { render, screen } from '@testing-library/react';
import AppNotificationMessages from '../app-notification-messages';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isMobileOrTablet: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(() => ({
        pathname: '/appstore/traders-hub',
    })),
}));
jest.mock('react-transition-group', () => ({
    TransitionGroup: jest.fn(({ children }) => <div>{children}</div>),
    CSSTransition: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('../../Components/Elements/NotificationMessage', () => jest.fn(() => 'mockedNotification'));
jest.mock('../trade-notifications', () => jest.fn(() => <div>TradeNotifications</div>));

describe('AppNotificationMessages', () => {
    const store = mockStore({
        notifications: {
            notifications: [
                {
                    action: {
                        route: '/account/financial-assessment',
                        text: 'Start now',
                    },
                    header: 'Pending action required',
                    key: 'notify_financial_assessment',
                    message: 'Please complete your financial assessment.',
                    should_show_again: true,
                    type: 'warning',
                },
            ],
            notification_messages: [
                {
                    action: {
                        route: '/account/financial-assessment',
                        text: 'Start now',
                    },
                    header: 'Pending action required',
                    key: 'notify_financial_assessment',
                    message: 'Please complete your financial assessment.',
                    should_show_again: true,
                    type: 'warning',
                },
            ],
            marked_notifications: [],
            should_show_popups: true,
        },
        landing_company_shortcode: 'svg',
        has_iom_account: false,
        has_malta_account: false,
        is_logged_in: true,
    });
    const renderComponent = (mock_store = mockStore({})) => {
        return render(
            <StoreProvider store={mock_store}>
                <AppNotificationMessages />
            </StoreProvider>
        );
    };
    it('should render the component', () => {
        renderComponent(store);
        expect(screen.getByText('mockedNotification')).toBeInTheDocument();
        expect(screen.getByText('TradeNotifications')).toBeInTheDocument();
    });
});

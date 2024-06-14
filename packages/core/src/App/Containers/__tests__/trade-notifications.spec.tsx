import React from 'react';
import { render, screen } from '@testing-library/react';
import { SwipeableNotification } from '@deriv/components';
import { StoreProvider, mockStore, useStore } from '@deriv/stores';
import { getCardLabels } from '@deriv/shared';
import TradeNotifications from '../trade-notifications';

type TMockedSwipeableNotificationProps = React.ComponentProps<typeof SwipeableNotification> & {
    onUnmount?: () => void;
    timestamp?: number | null;
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileOrTabletWrapper: jest.fn(({ children }) => children),
    SwipeableNotification: ({ children, onUnmount, timestamp }: TMockedSwipeableNotificationProps) => {
        if (onUnmount) onUnmount();
        return (
            <div>
                {children}
                {!!timestamp && <div>Timestamp</div>}
            </div>
        );
    },
}));

describe('TradeNotifications', () => {
    const STATUS = {
        OPEN: 'open',
        COMPLETED: 'completed',
    };
    const getTradeNotification = (status: string) => ({
        id: `${Math.random()}_${status}`,
        status,
        timestamp: 1234567890,
    });
    const opened_trade_title = 'Trade opened:';
    const timestamp = 'Timestamp';

    const renderTradeNotifications = (
        mock_props: React.ComponentProps<typeof TradeNotifications> = {},
        mock_store: ReturnType<typeof useStore> = mockStore({})
    ) =>
        render(
            <StoreProvider store={mock_store}>
                <TradeNotifications {...mock_props} />
            </StoreProvider>
        );

    it('should not render notifications if show_trade_notifications is not passed', () => {
        renderTradeNotifications();
        expect(screen.queryByText(getCardLabels().TOTAL_PROFIT_LOSS)).not.toBeInTheDocument();
        expect(screen.queryByText(getCardLabels().STAKE)).not.toBeInTheDocument();
    });
    it('should not render notifications if show_trade_notifications is passed but has no notifications', () => {
        renderTradeNotifications({ show_trade_notifications: true });
        expect(screen.queryByText(getCardLabels().TOTAL_PROFIT_LOSS)).not.toBeInTheDocument();
        expect(screen.queryByText(getCardLabels().STAKE)).not.toBeInTheDocument();
    });
    it('should render "Trade opened" notification without timestamp', () => {
        const mock_store = mockStore({
            notifications: {
                trade_notifications: [getTradeNotification(STATUS.OPEN)],
            },
        });
        renderTradeNotifications({ show_trade_notifications: true }, mock_store);
        expect(screen.getByText(opened_trade_title)).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().STAKE)).toBeInTheDocument();
        expect(screen.queryByText(timestamp)).not.toBeInTheDocument();
    });
    it('should render "Trade closed" notification with timestamp', () => {
        const mock_store = mockStore({
            notifications: {
                trade_notifications: [getTradeNotification(STATUS.COMPLETED)],
            },
        });
        renderTradeNotifications({ show_trade_notifications: true }, mock_store);
        expect(screen.getByText('Trade closed:')).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().TOTAL_PROFIT_LOSS)).toBeInTheDocument();
        expect(screen.getByText(timestamp)).toBeInTheDocument();
    });
    it('should display no more than 3 notifications', () => {
        const mock_store = mockStore({
            notifications: {
                trade_notifications: [
                    getTradeNotification(STATUS.OPEN),
                    getTradeNotification(STATUS.OPEN),
                    getTradeNotification(STATUS.OPEN),
                    getTradeNotification(STATUS.OPEN),
                ],
            },
        });
        renderTradeNotifications({ show_trade_notifications: true }, mock_store);
        expect(screen.getAllByText(opened_trade_title)).toHaveLength(3);
    });
});

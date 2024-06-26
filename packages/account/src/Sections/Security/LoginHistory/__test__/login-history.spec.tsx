import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import { WS } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import LoginHistory from '../login-history';
import { getLoginHistoryFormattedData } from '@deriv/utils';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => 'mockedLoading'),
}));

jest.mock('@deriv/utils', () => ({
    ...jest.requireActual('@deriv/utils'),
    getLoginHistoryFormattedData: jest.fn(),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        authorized: {
            fetchLoginHistory: jest.fn(() =>
                Promise.resolve({
                    login_history: [
                        {
                            date: '2023-08-28 03:11:45 GMT',
                            browser: 'Chrome  v116.0.0.0',
                            action: 'login',
                            status: 'successful',
                            ip: 'MOCK.IP.ADDRESS',
                            id: 0,
                            environment: 'Deriv GO',
                        },
                    ],
                })
            ),
        },
    },
}));

describe('<LoginHistory />', () => {
    let mock_store: ReturnType<typeof mockStore>;

    const renderComponent = async () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );
        render(<LoginHistory />, { wrapper });
    };

    beforeEach(() => {
        (getLoginHistoryFormattedData as jest.Mock).mockReturnValue([
            {
                date: '2023-08-28 03:11:45 GMT',
                browser: 'Chrome  v116.0.0.0',
                action: 'login',
                status: 'successful',
                ip: 'MOCK.IP.ADDRESS',
                id: 0,
            },
        ]);
        mock_store = mockStore({
            client: {
                is_switching: false,
                is_authorize: true,
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render Login History Table', async () => {
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText(/date and time/i)).not.toHaveClass('dc-text login-history__list__row__cell--title');
        });
    });

    it('should render Table Header.', async () => {
        renderComponent();
        const table_headers = [/date and time/i, /action/i, /browser/i, /ip address/i, /status/i];
        await Promise.all(
            table_headers.map(async header => {
                await waitFor(() => {
                    expect(screen.getByText(header)).toBeInTheDocument();
                });
            })
        );
    });

    it('should render Table Items.', async () => {
        renderComponent();
        const table_items = [
            /2023-08-28 03:11:45 GMT/i,
            /login/i,
            /chrome v116.0.0.0/i,
            /MOCK.IP.ADDRESS/i,
            /successful/i,
        ];
        await Promise.all(
            table_items.map(async item => {
                await waitFor(() => {
                    expect(screen.getByText(item)).toBeInTheDocument();
                });
            })
        );
    });

    it('should render Loading if client: is_switching is true', () => {
        mock_store.client.is_switching = true;
        renderComponent();
        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should render Table Item text: Logout if action is not login', async () => {
        (getLoginHistoryFormattedData as jest.Mock).mockReturnValue([
            {
                date: '2023-08-28 03:11:45 GMT',
                browser: 'Chrome  v116.0.0.0',
                action: 'logout',
                status: 'successful',
                ip: 'MOCK.IP.ADDRESS',
                id: 0,
            },
        ]);
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText(/logout/i)).toBeInTheDocument();
        });
    });

    it('should render Table Item text: Failed under status if status is not 1', async () => {
        (getLoginHistoryFormattedData as jest.Mock).mockReturnValue([
            {
                date: '2023-08-28 03:11:45 GMT',
                browser: 'Chrome  v116.0.0.0',
                action: 'logout',
                status: 'failed',
                ip: 'MOCK.IP.ADDRESS',
                id: 0,
            },
        ]);
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText(/failed/i)).toBeInTheDocument();
        });
    });

    it('should render Login History List for responsive screen', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText(/date and time/i)).toHaveClass('dc-text login-history__list__row__cell--title');
        });
    });

    it('should render Error with error message', async () => {
        WS.authorized.fetchLoginHistory = jest.fn(() =>
            Promise.resolve({
                error: { message: 'this is an error message' },
            })
        );
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText(/this is an error message/i)).toBeInTheDocument();
        });
    });
});

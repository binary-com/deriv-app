import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserHistory, createBrowserHistory } from 'history';
import { Router } from 'react-router';
import getRoutesConfig from 'Constants/routes-config';
import Cashier from '../cashier';
import { P2PSettingsProvider, mockStore } from '@deriv/stores';
import CashierProviders from '../../../cashier-providers';
import { routes } from '@deriv/shared';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('@deriv/hooks', () => {
    return {
        ...jest.requireActual('@deriv/hooks'),
        usePaymentAgentTransferVisible: jest.fn(() => ({
            data: true,
            isLoading: false,
            isSuccess: true,
        })),
        useIsP2PEnabled: jest.fn(() => ({
            is_p2p_enabled: true,
            is_p2p_enabled_loading: false,
            is_p2p_enabled_success: true,
        })),
    };
});

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});

jest.mock('@deriv/shared', () => {
    const original_module = jest.requireActual('@deriv/shared');

    return {
        ...original_module,
        WS: {
            wait: (...payload: unknown[]) => {
                return Promise.resolve([...payload]);
            },
        },
    };
});

jest.mock('Components/error-dialog', () => jest.fn(() => 'mockedErrorDialog'));
jest.mock('Pages/deposit', () => jest.fn(() => 'mockedDeposit'));
jest.mock('Pages/withdrawal', () => jest.fn(() => 'mockedWithdrawal'));

describe('<Cashier />', () => {
    let history: BrowserHistory, mockRootStore: ReturnType<typeof mockStore>;
    beforeEach(() => {
        mockRootStore = mockStore({
            common: {
                routeBackInApp: jest.fn(),
                is_from_derivgo: false,
            },
            ui: {
                is_cashier_visible: true,
                toggleCashier: jest.fn(),
            },
            client: {
                is_account_setting_loaded: true,
                is_logged_in: true,
                is_logging_in: false,
                active_accounts: [],
                is_crypto: jest.fn(),
            },
            notifications: {
                showAccountSwitchToRealNotification: jest.fn(),
            },
            modules: {
                cashier: {
                    withdraw: {
                        error: {},
                    },
                    general_store: {
                        is_cashier_onboarding: false,
                        is_loading: false,
                        onMountCommon: jest.fn(),
                        setAccountSwitchListener: jest.fn(),
                        setCashierTabIndex: jest.fn(),
                        cashier_route_tab_index: 0,
                        setActiveTab: jest.fn(),
                    },
                    transaction_history: {
                        is_transactions_crypto_visible: false,
                    },
                    payment_agent: {
                        is_payment_agent_visible: false,
                    },
                },
            },
        });
    });
    const renderWithRouter = (component: JSX.Element, mock_root_store: ReturnType<typeof mockStore>) => {
        history = createBrowserHistory();
        return {
            ...render(<Router history={history}>{component}</Router>, {
                wrapper: ({ children }) => (
                    <CashierProviders store={mock_root_store}>
                        <P2PSettingsProvider>{children}</P2PSettingsProvider>
                    </CashierProviders>
                ),
            }),
        };
    };

    it('shows the loading component if not yet logged in', () => {
        mockRootStore.client.is_account_setting_loaded = false;
        mockRootStore.client.is_logged_in = false;
        mockRootStore.client.is_logging_in = true;

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mockRootStore);

        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('shows the loading component if logged in but account setting is not yet loaded', () => {
        mockRootStore.client.is_account_setting_loaded = false;
        mockRootStore.client.is_logged_in = true;
        mockRootStore.client.is_logging_in = false;

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mockRootStore);

        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('renders the component if logged in and account setting is loaded', () => {
        mockRootStore.client.is_account_setting_loaded = true;
        mockRootStore.client.is_logged_in = true;
        mockRootStore.client.is_logging_in = false;
        mockRootStore.client.is_crypto = jest.fn(() => true);
        mockRootStore.modules.cashier.general_store.is_cashier_onboarding = true;
        mockRootStore.modules.cashier.payment_agent.is_payment_agent_visible = true;

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mockRootStore);

        expect(screen.getByRole('link', { name: 'Deposit' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Withdrawal' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Transfer' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Payment agents' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Transfer to client' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Deriv P2P' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Fiat onramp' })).toBeInTheDocument();
    });

    it("redirects to trader's hub page if the close button is clicked", () => {
        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mockRootStore);

        const close_btn = screen.getByTestId('dt_page_overlay_header_close');
        fireEvent.click(close_btn);

        expect(history.location.pathname).toBe(routes.traders_hub);
    });

    it('goes to Withdrawal page in Desktop mode when clicking on Withdrawal in the Vertical tab menu', () => {
        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mockRootStore);

        const withdrawal_link = screen.getByRole('link', { name: 'Withdrawal' });
        fireEvent.click(withdrawal_link);

        expect(history.location.pathname).toBe('/cashier/withdrawal');
    });

    it('does not render the side note if in deposit page', () => {
        history.replace('/cashier/deposit');

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mockRootStore);

        expect(screen.queryByTestId('vertical_tab_side_note')).not.toBeInTheDocument();
    });
});

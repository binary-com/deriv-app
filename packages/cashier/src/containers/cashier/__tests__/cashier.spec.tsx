import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserHistory, createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { isMobile } from '@deriv/shared';
import getRoutesConfig from 'Constants/routes-config';
import Cashier from '../cashier';
import { P2PSettingsProvider, mockStore } from '@deriv/stores';
import CashierProviders from '../../../cashier-providers';
import { APIProvider } from '@deriv/api';

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
        isMobile: jest.fn(() => false),
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
    let history: BrowserHistory;
    const renderWithRouter = (component: JSX.Element, mock_root_store: ReturnType<typeof mockStore>) => {
        history = createBrowserHistory();
        return {
            ...render(<Router history={history}>{component}</Router>, {
                wrapper: ({ children }) => (
                    <APIProvider>
                        <CashierProviders store={mock_root_store}>
                            <P2PSettingsProvider>{children}</P2PSettingsProvider>
                        </CashierProviders>
                    </APIProvider>
                ),
            }),
        };
    };

    it('should show the loading component if client_tnc_status is not yet loaded or not yet logged in', () => {
        const mock_root_store = mockStore({
            common: {
                routeBackInApp: jest.fn(),
                is_from_derivgo: true,
            },
            ui: {
                is_cashier_visible: false,
                toggleCashier: jest.fn(),
            },
            client: {
                is_account_setting_loaded: false,
                is_logged_in: false,
                is_logging_in: true,
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

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mock_root_store);

        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should render the component if client_tnc_status is loaded', () => {
        const mock_root_store = mockStore({
            common: {
                routeBackInApp: jest.fn(),
                is_from_derivgo: true,
            },
            ui: {
                is_cashier_visible: true,
                toggleCashier: jest.fn(),
            },
            client: {
                is_account_setting_loaded: true,
                is_logged_in: true,
                is_logging_in: true,
                active_accounts: [],
                is_virtual: false,
                is_crypto: jest.fn(() => true),
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
                        is_cashier_onboarding: true,
                        is_loading: true,
                        onMountCommon: jest.fn(),
                        setAccountSwitchListener: jest.fn(),
                        setCashierTabIndex: jest.fn(),
                        cashier_route_tab_index: 0,
                        setActiveTab: jest.fn(),
                    },
                    transaction_history: {
                        is_transactions_crypto_visible: true,
                    },
                    payment_agent: {
                        is_payment_agent_visible: true,
                    },
                },
            },
        });

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mock_root_store);

        expect(screen.getByRole('link', { name: 'Deposit' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Withdrawal' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Transfer' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Payment agents' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Transfer to client' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Deriv P2P' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Fiat onramp' })).toBeInTheDocument();
    });

    // TODO: Fix this test case
    // it('should redirect to trade page if the close button is clicked ', () => {
    //     const mock_root_store = mockStore({
    //         common: {
    //             routeBackInApp: jest.fn(),
    //             is_from_derivgo: true,
    //         },
    //         ui: {
    //             is_cashier_visible: true,
    //             toggleCashier: jest.fn(),
    //         },
    //         client: {
    //             is_account_setting_loaded: true,
    //             is_logged_in: true,
    //             is_logging_in: false,
    //             is_crypto: jest.fn(),
    //         },
    //         modules: {
    //             cashier: {
    //                 withdraw: {
    //                     error: {},
    //                 },
    //                 general_store: {
    //                     is_cashier_onboarding: false,
    //                     is_loading: false,

    //                     onMountCommon: jest.fn(),
    //                     setAccountSwitchListener: jest.fn(),
    //                     setCashierTabIndex: jest.fn(),
    //                     cashier_route_tab_index: 0,
    //                     setActiveTab: jest.fn(),
    //                 },
    //                 transaction_history: {
    //                     is_transactions_crypto_visible: false,
    //                 },
    //                 payment_agent: {
    //                     is_payment_agent_visible: true,
    //                 },
    //             },
    //         },
    //     });

    //     renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mock_root_store);

    //     const close_btn = screen.getByTestId('page_overlay_header_close');
    //     fireEvent.click(close_btn);

    //     expect(mock_root_store.common!.routeBackInApp).toHaveBeenCalled();
    //     expect(history.location.pathname).toBe('/');
    // });

    it('should go to selected route page on desktop', () => {
        const mock_root_store = mockStore({
            common: {
                routeBackInApp: jest.fn(),
                is_from_derivgo: true,
            },
            ui: {
                is_cashier_visible: true,
                toggleCashier: jest.fn(),
            },
            notifications: {
                showAccountSwitchToRealNotification: jest.fn(),
            },
            client: {
                is_account_setting_loaded: true,
                is_logged_in: true,
                is_logging_in: true,
                active_accounts: [],
                is_crypto: jest.fn(),
            },
            modules: {
                cashier: {
                    withdraw: {
                        error: {},
                    },
                    general_store: {
                        is_cashier_onboarding: true,
                        is_loading: true,
                        onMountCommon: jest.fn(),
                        setAccountSwitchListener: jest.fn(),
                        setCashierTabIndex: jest.fn(),
                        cashier_route_tab_index: 0,
                        setActiveTab: jest.fn(),
                    },
                    transaction_history: {
                        is_transactions_crypto_visible: true,
                    },
                    payment_agent: {
                        is_payment_agent_visible: true,
                    },
                },
            },
        });

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mock_root_store);

        const withdrawal_link = screen.getByRole('link', { name: 'Withdrawal' });
        fireEvent.click(withdrawal_link);

        expect(history.location.pathname).toBe('/cashier/withdrawal');
    });

    it('should not render the side note if on deposit page', () => {
        const mock_root_store = mockStore({
            common: {
                routeBackInApp: jest.fn(),
                is_from_derivgo: true,
            },
            ui: {
                is_cashier_visible: true,
                toggleCashier: jest.fn(),
            },
            notifications: {
                showAccountSwitchToRealNotification: jest.fn(),
            },
            client: {
                is_account_setting_loaded: true,
                is_logged_in: true,
                is_logging_in: true,
                active_accounts: [],
                is_crypto: jest.fn(),
            },
            modules: {
                cashier: {
                    withdraw: {
                        error: {},
                    },
                    general_store: {
                        is_cashier_onboarding: true,
                        is_loading: true,
                        onMountCommon: jest.fn(),
                        setAccountSwitchListener: jest.fn(),
                        setCashierTabIndex: jest.fn(),
                        cashier_route_tab_index: 0,
                        setActiveTab: jest.fn(),
                    },
                    transaction_history: {
                        is_transactions_crypto_visible: true,
                    },
                    payment_agent: {
                        is_payment_agent_visible: true,
                    },
                },
            },
        });

        history.replace('/cashier/deposit');

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mock_root_store);

        expect(screen.queryByTestId('vertical_tab_side_note')).not.toBeInTheDocument();
    });

    it('should show the selected route page on mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);

        const mock_root_store = mockStore({
            common: {
                routeBackInApp: jest.fn(),
                is_from_derivgo: true,
            },
            ui: {
                is_cashier_visible: true,
                toggleCashier: jest.fn(),
            },
            notifications: {
                showAccountSwitchToRealNotification: jest.fn(),
            },
            client: {
                is_account_setting_loaded: true,
                is_logged_in: true,
                is_logging_in: false,
                active_accounts: [],
                is_crypto: jest.fn(),
            },
            modules: {
                cashier: {
                    withdraw: {
                        error: {},
                    },
                    general_store: {
                        is_cashier_onboarding: true,
                        is_loading: true,
                        onMountCommon: jest.fn(),
                        setAccountSwitchListener: jest.fn(),
                        setCashierTabIndex: jest.fn(),
                        cashier_route_tab_index: 0,
                        setActiveTab: jest.fn(),
                    },
                    transaction_history: {
                        is_transactions_crypto_visible: true,
                    },
                    payment_agent: {
                        is_payment_agent_visible: true,
                    },
                },
            },
        });

        renderWithRouter(<Cashier routes={getRoutesConfig()[0].routes || []} />, mock_root_store);

        const withdrawal_link = screen.getByRole('link', { name: 'Withdrawal' });
        fireEvent.click(withdrawal_link);

        expect(history.location.pathname).toBe('/cashier/withdrawal');
    });
});

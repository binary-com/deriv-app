import React from 'react';
import { screen, render } from '@testing-library/react';
import { formatMoney, isDesktop, isMobile } from '@deriv/shared';
import AccountLimits from '../account-limits';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});
jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true, // this property makes it work,
    default: 'mockedDefaultExport',
    useWS: () => undefined,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
    formatMoney: jest.fn(),
}));

jest.mock('Components/demo-message', () => jest.fn(() => 'mockedDemoMessage'));
jest.mock('Components/load-error-message', () => jest.fn(() => 'mockedLoadErrorMessage'));
jest.mock('../account-limits-footer', () => jest.fn(() => 'mockedAccountLimitsFooter'));

describe('<AccountLimits/>', () => {
    let store = mockStore({});
    const props = {
        overlay_ref: document.createElement('div'),
    };
    const mock = {
        client: {
            currency: 'AUD',
            is_fully_authenticated: true,
            is_switching: false,
            is_virtual: false,
            getLimits: jest.fn(() => Promise.resolve({ get_limits: {} })),
            account_limits: {
                account_balance: 300000,
                daily_transfers: {
                    dxtrade: {
                        allowed: 12,
                        available: 12,
                    },
                    internal: {
                        allowed: 10,
                        available: 10,
                    },
                    mt5: {
                        allowed: 10,
                        available: 10,
                    },
                },
                lifetime_limit: 13907.43,
                market_specific: {
                    commodities: [
                        {
                            name: 'Commodities',
                            payout_limit: 5000,
                            profile_name: 'moderate_risk',
                            turnover_limit: 50000,
                        },
                    ],
                    cryptocurrency: [
                        {
                            name: 'Cryptocurrencies',
                            payout_limit: 100.0,
                            profile_name: 'extreme_risk',
                            turnover_limit: 1000.0,
                        },
                    ],
                    forex: [
                        {
                            name: 'Smart FX',
                            payout_limit: 5000,
                            profile_name: 'moderate_risk',
                            turnover_limit: 50000,
                        },
                        {
                            name: 'Major Pairs',
                            payout_limit: 20000,
                            profile_name: 'medium_risk',
                            turnover_limit: 100000,
                        },
                        {
                            name: 'Minor Pairs',
                            payout_limit: 5000,
                            profile_name: 'moderate_risk',
                            turnover_limit: 50000,
                        },
                    ],
                    indices: [
                        {
                            name: 'Stock Indices',
                            payout_limit: 20000,
                            profile_name: 'medium_risk',
                            turnover_limit: 100000,
                        },
                    ],
                    synthetic_index: [
                        {
                            name: 'Synthetic Indices',
                            payout_limit: 50000,
                            profile_name: 'low_risk',
                            turnover_limit: 500000,
                        },
                    ],
                },
                num_of_days: 30,
                num_of_days_limit: 13907.43,
                open_positions: 100,
                payout: 50000,
                remainder: 13907.43,
                withdrawal_for_x_days_monetary: 0,
                withdrawal_since_inception_monetary: 0,
            },
        },
    };
    store = mockStore(mock);
    it('should render the Loading component if is_switching is true', () => {
        store = mockStore({
            client: {
                ...mock.client,
                is_switching: true,
            },
        });
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} />
            </StoreProvider>
        );
        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
    });

    it('should render DemoMessage component if is_virtual is true', () => {
        store = mockStore({
            client: {
                ...mock.client,
                is_switching: false,
                is_virtual: true,
            },
        });
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} />
            </StoreProvider>
        );
        expect(screen.queryByTestId('dt_account_demo_message_wrapper')).toHaveClass('account__demo-message-wrapper');
        expect(screen.getByText('mockedDemoMessage')).toBeInTheDocument();
    });

    it('should render LoadErrorMessage component if there is api_initial_load_error', () => {
        store = mockStore({
            client: {
                ...mock.client,
                account_limits: {
                    api_initial_load_error: 'error in fetching data from API',
                    account_balance: '',
                    payout: '',
                    market_specific: {
                        commodities: [],
                        cryptocurrency: [],
                        forex: [],
                        indices: [],
                        synthetic_index: [],
                    },
                    num_of_days_limit: '',
                    remainder: '',
                    withdrawal_since_inception_monetary: '',
                },
                is_switching: false,
                is_virtual: false,
            },
        });
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} />
            </StoreProvider>
        );
        expect(screen.getByText('mockedLoadErrorMessage')).toBeInTheDocument();
    });

    it('should render AccountLimits component', () => {
        store = mockStore(mock);
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} />
            </StoreProvider>
        );
        expect(screen.queryByTestId('account_limits_data')).toBeInTheDocument();
    });
    it('should call setIsPopupOverlayShown fn ', () => {
        store = mockStore(mock);
        const setIsPopupOverlayShown = jest.fn();
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} setIsOverlayShown={setIsPopupOverlayShown} />
            </StoreProvider>
        );
        expect(setIsPopupOverlayShown).toHaveBeenCalledTimes(1);
    });

    it('should render Loading component if is_loading is true', () => {
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} />
            </StoreProvider>
        );
        expect(screen.queryByTestId('account_limits_data')).toBeInTheDocument();
    });

    it('should render AccountLimitsArticle component if should_show_article is true in mobile mode', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} should_show_article />
            </StoreProvider>
        );
        expect(screen.getByRole('heading', { name: /account limits/i })).toBeInTheDocument();
        expect(screen.getByText(/these are default limits that we apply to your accounts\./i)).toBeInTheDocument();
    });

    it('should not render AccountLimitsArticle component if should_show_article is false', () => {
        store = mockStore(mock);
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} should_show_article={false} />
            </StoreProvider>
        );
        expect(screen.queryByText('/account limits/i')).not.toBeInTheDocument();
    });

    it('should render Trading limits table and its trading limits contents properly', () => {
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} />
            </StoreProvider>
        );
        expect(screen.queryByTestId('account_limits_data')).toBeInTheDocument();

        expect(
            screen.getByRole('columnheader', {
                name: /trading limits/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('cell', {
                name: /\*maximum number of open positions/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('cell', {
                name: /\*maximum account cash balance/i,
            })
        ).toBeInTheDocument();
    });

    it('should render Maximum number of open positions- table cell and its contents properly', () => {
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} />
            </StoreProvider>
        );
        expect(
            screen.getByRole('cell', {
                name: /\*maximum number of open positions/i,
            })
        ).toBeInTheDocument();
        const { open_positions } = store.client.account_limits;
        expect(
            screen.getByRole('cell', {
                name: open_positions?.toString(),
            })
        ).toBeInTheDocument();
    });

    it('should call formatMoney', () => {
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} />
            </StoreProvider>
        );
        const { account_balance } = store.client.account_limits;
        expect(formatMoney).toHaveBeenCalledWith(store.client.currency, account_balance, true);
    });

    it('should render Trading limits table and its maximum daily turnover contents properly', () => {
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} />
            </StoreProvider>
        );
        expect(screen.queryByTestId('trading_daily_turnover_table')).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', {
                name: /maximum daily turnover/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('cell', {
                name: /commodities/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('cell', {
                name: /stock indices/i,
            })
        ).toBeInTheDocument();
    });

    it('should not render withdrawal_limits_table is_app_settings is true', () => {
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} is_app_settings />
            </StoreProvider>
        );
        expect(screen.queryByTestId('withdrawal_limits_table')).not.toBeInTheDocument();
    });

    it('should render withdrawal_limits_table is_app_settings is false', () => {
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} />
            </StoreProvider>
        );
        expect(screen.queryByTestId('withdrawal_limits_table')).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', {
                name: /withdrawal limits/i,
            })
        ).toBeInTheDocument();
    });

    it('withdrawal_limits_table should have a Limits header if is_fully_authenticated is true', () => {
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('withdrawal_limits_table')).toHaveTextContent('Limit');
    });

    it('show show withdrawal limit lifted message if is_fully_authenticated is true', () => {
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} />
            </StoreProvider>
        );

        expect(
            screen.getByText(/your account is fully authenticated and your withdrawal limits have been lifted\./i)
        ).toBeInTheDocument();
    });

    it('withdrawal_limits_table should show `Total withdrawal allowed` when is_fully_authenticated is false', () => {
        store = mockStore({
            client: {
                ...mock.client,
                is_fully_authenticated: false,
            },
        });
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} />
            </StoreProvider>
        );
        expect(screen.getByText(/total withdrawal allowed/i)).toBeInTheDocument();
    });

    it('should show limit_notice message when is_fully_authenticated is false in mobile mode', () => {
        store = mockStore({
            client: {
                ...mock.client,
                is_fully_authenticated: false,
            },
        });
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(
            <BrowserRouter>
                <StoreProvider store={store}>
                    <AccountLimits {...props} />
                </StoreProvider>
            </BrowserRouter>
        );
        expect(screen.getByText(/stated limits are subject to change without prior notice\./i)).toBeInTheDocument();
    });

    it('should not  show limit_notice message when is_fully_authenticated is false', () => {
        store = mockStore({
            client: {
                ...mock.client,
                is_fully_authenticated: false,
            },
        });
        (isMobile as jest.Mock).mockReturnValue(false);
        (isDesktop as jest.Mock).mockReturnValue(true);
        render(
            <BrowserRouter>
                <StoreProvider store={store}>
                    <AccountLimits {...props} is_app_settings={false} />
                </StoreProvider>
            </BrowserRouter>
        );
        expect(
            screen.queryByText(/your account is fully authenticated and your withdrawal limits have been lifted\./i)
        ).not.toBeInTheDocument();
    });

    it('should show AccountLimitsArticle when should_show_article and isDesktop is true', () => {
        store = mockStore(mock);
        (isMobile as jest.Mock).mockReturnValue(false);
        (isDesktop as jest.Mock).mockReturnValue(true);
        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} should_show_article />
            </StoreProvider>
        );
        expect(screen.getByRole('heading', { name: /account limits/i })).toBeInTheDocument();
        expect(screen.getByText(/these are default limits that we apply to your accounts\./i)).toBeInTheDocument();
    });

    it('should show AccountLimitsFooter if footer_ref is passed', () => {
        const footer = React.createRef<HTMLElement>();

        render(
            <StoreProvider store={store}>
                <AccountLimits {...props} should_show_article footer_ref={footer} />
            </StoreProvider>
        );
        expect(screen.getByText(/mockedaccountlimitsfooter/i)).toBeInTheDocument();
    });
});

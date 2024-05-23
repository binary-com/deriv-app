import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { screen, render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import AccountSwitcher from '../account-switcher.jsx';

jest.mock('@deriv/hooks', () => {
    return {
        ...jest.requireActual('@deriv/hooks'),
        useHasSetCurrency: jest.fn(() => true),
    };
});

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});

let store = mockStore({
    client: {
        available_crypto_currencies: [
            {
                value: 'eUSDT',
                fractional_digits: 2,
                is_deposit_suspended: 0,
                is_suspended: 0,
                is_withdrawal_suspended: 0,
                name: 'Tether ERC20',
                stake_default: 10,
                transfer_between_accounts: {
                    fees: {
                        AUD: 2,
                    },
                    limits: {
                        max: 5001.78,
                        min: 1,
                    },
                    limits_dxtrade: {
                        max: 2500.89,
                        min: 0.01,
                    },
                    limits_mt5: {
                        max: 15005.33,
                        min: 0.01,
                    },
                },
                type: 'crypto',
            },
        ],
        loginid: 'VRTC4444904',
        accounts: {
            CR5241840: {
                account_category: 'trading',
                account_type: 'binary',
                created_at: 1679639315,
                currency: 'BTC',
                is_disabled: 0,
                is_virtual: 0,
                landing_company_shortcode: 'svg',
                linked_to: [],
                token: '123',
                excluded_until: '',
                landing_company_name: 'svg',
                balance: 0,
            },
            VRTC4444904: {
                account_category: 'trading',
                account_type: 'binary',
                created_at: 1625550280,
                currency: 'USD',
                is_disabled: 0,
                is_virtual: 1,
                landing_company_shortcode: 'virtual',
                linked_to: [],
                token: '234',
                excluded_until: '',
                landing_company_name: 'virtual',
                balance: 9999.92,
                accepted_bch: 0,
                email: 'test',
                session_start: 1690369843,
                residence: 'bh',
            },
        },
        account_type: 'demo',
        account_list: [
            {
                loginid: 'CR5241840',
                is_disabled: 0,
                is_virtual: 0,
                icon: 'btc',
                title: 'BTC',
            },
            {
                loginid: 'VRTC4444904',
                is_disabled: 0,
                is_virtual: 1,
                icon: 'real',
                title: 'Real',
            },
        ],
        residence: 'id',
        is_eu: false,
        is_landing_company_loaded: true,
        is_low_risk: true,
        is_high_risk: false,
        is_logged_in: true,
        is_virtual: true,
        has_fiat: true,
        landing_company_shortcode: 'svg',
        mt5_login_list: [
            {
                account_type: 'demo',
                sub_account_type: 'financial_stp',
            },
        ],
        obj_total_balance: { amount_real: 5000, amount_mt5: 300, amount_dxtrade: 100, currency: 'USD' },
        switchAccount: jest.fn(),
        resetVirtualBalance: jest.fn(),
        has_active_real_account: true,
        logout: jest.fn(),
        upgradeable_landing_companies: ['maltainvest'],
        has_any_real_account: true,
        virtual_account_loginid: 'VRTC123123',
        real_account_creation_unlock_date: 2022,
    },
    ui: {
        is_dark_mode_on: false,
        is_positions_drawer_on: false,
        openRealAccountSignup: jest.fn(),
        toggleAccountsDialog: jest.fn(),
        togglePositionsDrawer: jest.fn(),
        toggleSetCurrencyModal: jest.fn(),
        should_show_real_accounts_list: true,
        setShouldShowCooldownModal: jest.fn(),
    },
    traders_hub: {
        show_eu_related_content: false,
        content_flag: 'LOW_RISK_CR_NON_EU',
        setTogglePlatformType: jest.fn(),
    },
});

describe('AccountSwitcher', () => {
    const renderWithRouter = children => {
        render(
            <StoreProvider store={store}>
                <BrowserRouter>{children}</BrowserRouter>
            </StoreProvider>
        );
    };

    it('should render account switcher', () => {
        renderWithRouter(<AccountSwitcher />);
        expect(screen.getByTestId('acc-switcher')).toBeInTheDocument();
        expect(screen.getByText('Real')).toBeInTheDocument();
    });

    it('should render a loader when landing companies are not loaded', () => {
        store = {
            ...store,
            client: {
                ...store.client,
                is_landing_company_loaded: false,
            },
        };
        renderWithRouter(<AccountSwitcher />);
        expect(screen.getByText('mockedLoading')).toBeInTheDocument();
        expect(screen.queryByText('Real')).not.toBeInTheDocument();
    });

    it('should list the real accounts in real tab when landing companies are loaded', () => {
        store = {
            ...store,
            client: {
                ...store.client,
                is_landing_company_loaded: true,
            },
        };
        renderWithRouter(<AccountSwitcher />);
        expect(screen.queryByText('mockedLoading')).not.toBeInTheDocument();
        expect(screen.getByText('Real')).toHaveClass('dc-tabs__active');
        expect(screen.getByText('CR5241840')).toBeInTheDocument();
    });

    it('should list the demo accounts in demo tab when landing companies are loaded', () => {
        store = {
            ...store,
            client: {
                ...store.client,
                is_landing_company_loaded: true,
                is_virtual: true,
            },
            ui: {
                ...store.ui,
                should_show_real_accounts_list: false,
            },
        };
        renderWithRouter(<AccountSwitcher should_show_real_accounts_list={false} is_virtual />);
        expect(screen.queryByText('mockedLoading')).not.toBeInTheDocument();
        expect(screen.getAllByText('Demo')[0]).toHaveClass('dc-tabs__active');
        expect(screen.getByText('VRTC4444904')).toBeInTheDocument();
    });
});

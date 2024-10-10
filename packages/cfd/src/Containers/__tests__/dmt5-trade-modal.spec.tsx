import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import DMT5TradeModal from '../dmt5-trade-modal';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(({ icon }) => <div>{icon}</div>),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getCFDAccountDisplay: jest.fn(),
}));

jest.mock('../../Assets/svgs/trading-platform', () => jest.fn(() => 'MockTradingPlatformIcon'));

jest.mock('../migration-banner', () => jest.fn(() => <div>MockMigrateBanner</div>));

describe('<DMT5TradeModal/>', () => {
    const mock_props: React.ComponentProps<typeof DMT5TradeModal> = {
        mt5_trade_account: {
            account_type: 'real',
            balance: 0,
            country: 'id',
            currency: 'USD',
            display_balance: '0.00',
            email: 'uks123@deriv.com',
            group: 'real\\p01_ts03\\synthetic\\svg_std_usd\\01',
            landing_company_short: 'svg',
            leverage: 500,
            login: 'MTR40021028',
            market_type: 'synthetic',
            name: '0.00 USD',
            server: 'p01_ts03',
            server_info: {
                environment: 'Deriv-Server',
                geolocation: {
                    group: 'asia_synthetic',
                    location: 'Singapore',
                    region: 'Asia',
                    sequence: 1,
                },
                id: 'p01_ts03',
            },
            status: 'migrated_with_position',
            sub_account_category: '',
            sub_account_type: 'financial',
            white_label_links: {
                webtrader_url: 'https://mt5-real01-web.deriv.com/terminal',
                android:
                    'https://download.mql5.com/cdn/mobile/mt5/android?server=DerivSVG-Demo,DerivSVG-Server,DerivSVG-Server-02,DerivSVG-Server-03',
                ios: 'https://download.mql5.com/cdn/mobile/mt5/ios?server=DerivSVG-Demo,DerivSVG-Server,DerivSVG-Server-02,DerivSVG-Server-03',
                windows: 'https://download.mql5.com/cdn/web/22698/mt5/derivsvg5setup.exe',
            },
            display_login: 40021028,
            icon: 'Standard',
            sub_title: 'Standard',
            short_code_and_region: 'SVG',
            platform: 'mt5',
            description: 40021028,
            key: 'trading_app_card_40021028',
            action_type: 'multi-action',
            availability: 'Non-EU',
        },
        show_eu_related_content: false,
        onPasswordManager: jest.fn(),
        toggleModal: jest.fn(),
    };

    const store_config = mockStore({
        modules: {
            cfd: {
                migrated_mt5_accounts: [
                    {
                        loginId: 'MT5YFHU',
                        to_account: {
                            synthetic: 'bvi',
                        },
                    },
                ],
            },
        },
    });

    const renderComponent = ({ props = mock_props }) => {
        return render(
            <StoreProvider store={store_config}>
                <DMT5TradeModal {...props} />
            </StoreProvider>
        );
    };

    it('should render correct status badge if mt5_acc_auth_status value is migrated_with_position', () => {
        renderComponent({ props: mock_props });

        const status_badge = screen.getByText(/No new positions/);
        expect(status_badge).toBeInTheDocument();
    });

    it('should render correct status badge if mt5_acc_auth_status value is migrated_without_position', () => {
        const new_mock_props = {
            ...mock_props,
            mt5_trade_account: {
                status: 'migrated_without_position',
            },
        };
        renderComponent({ props: new_mock_props });

        const status_badge = screen.getByText(/Account closed/);
        expect(status_badge).toBeInTheDocument();
    });

    it('should not render status badge if mt5_acc_auth_status value is poa_pending', () => {
        const new_mock_props = {
            ...mock_props,
            mt5_trade_account: {
                status: 'poa_pending',
            },
        };
        renderComponent({ props: new_mock_props });

        expect(screen.queryByText(/In review/)).not.toBeInTheDocument();
        expect(screen.queryByText(/No new positions/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Account closed/)).not.toBeInTheDocument();
    });

    it('should not render status badge if mt5_acc_auth_status value is null', () => {
        const new_mock_props = {
            ...mock_props,
            mt5_trade_account: {
                status: null,
            },
        };
        renderComponent({ props: new_mock_props });

        expect(screen.queryByText(/In review/)).not.toBeInTheDocument();
        expect(screen.queryByText(/No new positions/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Account closed/)).not.toBeInTheDocument();
    });

    it('should not render migration banner if account is not eligible to migrate', () => {
        renderComponent({ props: mock_props });
        expect(screen.queryByText(/MockMigrateBanner/)).not.toBeInTheDocument();
    });

    it('should render migration banner if account is eligible to migrate', () => {
        const new_mock_props = {
            ...mock_props,
            mt5_trade_account: {
                eligible_to_migrate: { financial: 'bvi' },
            },
        };
        renderComponent({ props: new_mock_props });
        expect(screen.queryByText(/MockMigrateBanner/)).toBeInTheDocument();
    });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDCompareAccountsDescription from '../cfd-compare-accounts-description';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('<CFDCompareAccountsDescription />', () => {
    const mock = mockStore({
        traders_hub: {
            selected_region: 'Non-EU',
        },
    });

    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    it('should render content for standard svg', () => {
        const mocked_props = {
            trading_platforms: {
                market_type: 'gaming',
                shortcode: 'svg',
                instruments: ['Forex', 'Synthetic Indices', 'Stocks', 'Commodities', 'Cryptocurrencies'],
                product_details: { max_leverage: '1:1000', min_spread: '0' },
                platform: 'mt5',
                product: 'standard',
            },
            is_demo: false,
        };
        render(<CFDCompareAccountsDescription {...mocked_props} />, { wrapper });
        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('0 pips')).toBeInTheDocument();
    });

    it('should render content for swapfree', () => {
        const mocked_props = {
            trading_platforms: {
                market_type: 'all',
                shortcode: 'svg',
                instruments: ['Forex', 'Synthetic Indices', 'Stocks', 'Commodities', 'Cryptocurrencies'],
                product_details: { max_leverage: '1:1111000', min_spread: '0.44' },
                platform: 'mt5',
                product: 'swap_free',
            },
            is_demo: false,
        };

        render(<CFDCompareAccountsDescription {...mocked_props} />, { wrapper });
        expect(screen.getByText('Up to 1:1111000')).toBeInTheDocument();
        expect(screen.getByText('0.44 pips')).toBeInTheDocument();
    });

    it('should render content for financial', () => {
        const mocked_props = {
            trading_platforms: {
                market_type: 'financial',
                shortcode: 'labuan',
                instruments: ['Forex', 'Cryptocurrencies'],
                product_details: { max_leverage: '1:1000', min_spread: '0.2' },
                platform: 'mt5',
                product: 'standard',
            },
            is_demo: false,
        };

        render(<CFDCompareAccountsDescription {...mocked_props} />, { wrapper });

        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('0.2 pips')).toBeInTheDocument();
    });

    it('should render content for financial market type with maltainvest shortcode ', () => {
        const mock_store = mockStore({
            traders_hub: {
                selected_region: 'EU',
            },
        });

        const mocked_props = {
            trading_platforms: {
                market_type: 'financial',
                shortcode: 'maltainvest',
                instruments: ['Forex', 'Cryptocurrencies'],
                product_details: { max_leverage: '1:30', min_spread: '0.5' },
                platform: 'mt5',
                product: 'financial',
            },
            is_demo: false,
        };

        render(
            <StoreProvider store={mock_store}>
                <CFDCompareAccountsDescription {...mocked_props} />
            </StoreProvider>
        );
        expect(screen.getByText('Up to 1:30')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
    });

    it('should render content for ctrader ', () => {
        const mock_store = mockStore({
            traders_hub: {
                selected_region: 'NON-EU',
            },
        });

        const mocked_props = {
            trading_platforms: {
                market_type: 'financial',
                shortcode: 'maltainvest',
                instruments: ['Forex', 'Cryptocurrencies'],
                product_details: { max_leverage: '1:30', min_spread: '0.5' },
                platform: 'ctrader',
            },
            is_demo: false,
        };
        render(
            <StoreProvider store={mock_store}>
                <CFDCompareAccountsDescription {...mocked_props} />
            </StoreProvider>
        );
        expect(screen.getByText('Up to 1:30')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
    });
});

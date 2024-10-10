import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDCompareAccountsTitleIcon from '../cfd-compare-accounts-title-icon';

jest.mock('../../../Assets/svgs/trading-platform', () => jest.fn(() => <div>Mocked Icon</div>));

const mocked_props = {
    trading_platforms: {},
    is_eu_user: false,
    is_demo: false,
};

describe('<CFDCompareAccountsTitleIcon />', () => {
    test('should render correct title for Standard product type', () => {
        mocked_props.trading_platforms = {
            platform: 'mt5',
            market_type: 'gaming',
            shortcode: 'svg',
            product: 'standard',
        };
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Standard')).toBeInTheDocument();
    });

    test('should render correct title for financial_stp product type', () => {
        mocked_props.trading_platforms = {
            platform: 'mt5',
            market_type: 'financial',
            shortcode: 'labuan',
            product: 'stp',
        };
        mocked_props.is_eu_user = false;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Financial - STP')).toBeInTheDocument();
    });

    test('should render correct title for financial product type', () => {
        mocked_props.trading_platforms = {
            platform: 'mt5',
            market_type: 'financial',
            shortcode: 'vanuatu',
            product: 'financial',
        };
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Financial')).toBeInTheDocument();
    });

    test('should render correct title for Swap-Free product type', () => {
        mocked_props.trading_platforms = {
            platform: 'mt5',
            market_type: 'all',
            shortcode: 'svg',
            product: 'swap_free',
        };
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Swap-Free')).toBeInTheDocument();
    });

    test('should render correct title for Zero Spread product type', () => {
        mocked_props.trading_platforms = {
            platform: 'mt5',
            market_type: 'all',
            shortcode: 'bvi',
            product: 'zero_spread',
        };

        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Zero Spread')).toBeInTheDocument();
    });

    test('should render correct title for Deriv X product type', () => {
        mocked_props.trading_platforms = {
            platform: 'dxtrade',
            market_type: 'all',
            shortcode: 'svg',
        };

        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Deriv X')).toBeInTheDocument();
    });

    test('should render correct title for EU Clients', () => {
        mocked_props.trading_platforms = {
            platform: 'mt5',
            market_type: 'financial',
            shortcode: 'maltainvest',
            product: 'financial',
        };
        mocked_props.is_eu_user = true;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('CFDs')).toBeInTheDocument();
    });

    test('should render correct title for standard product type in demo account', () => {
        mocked_props.trading_platforms = {
            platform: 'mt5',
            market_type: 'gaming',
            shortcode: 'svg',
            product: 'standard',
        };
        mocked_props.is_demo = true;
        mocked_props.is_eu_user = false;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Standard Demo')).toBeInTheDocument();
    });

    test('should render correct title for financial product in demo account', () => {
        mocked_props.trading_platforms = {
            platform: 'mt5',
            market_type: 'financial',
            shortcode: 'svg',
            product: 'financial',
        };

        mocked_props.is_demo = true;
        mocked_props.is_eu_user = false;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Financial Demo')).toBeInTheDocument();
    });

    test('should render correct title for Swap-Free with correct product type  demo account', () => {
        mocked_props.trading_platforms = {
            platform: 'mt5',
            market_type: 'all',
            shortcode: 'svg',
            product: 'swap_free',
        };
        mocked_props.is_demo = true;
        mocked_props.is_eu_user = false;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Swap-Free Demo')).toBeInTheDocument();
    });

    test('should render correct title for Zero Spread with correct product type  demo account', () => {
        mocked_props.trading_platforms = {
            platform: 'mt5',
            market_type: 'all',
            shortcode: 'bvi',
            product: 'zero_spread',
        };

        mocked_props.is_demo = true;
        mocked_props.is_eu_user = false;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Zero Spread Demo')).toBeInTheDocument();
    });

    test('should render correct title for DerivX with correct product type demo account', () => {
        mocked_props.trading_platforms = {
            platform: 'dxtrade',
            market_type: 'all',
            shortcode: 'svg',
        };
        mocked_props.is_demo = true;
        mocked_props.is_eu_user = false;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Deriv X Demo')).toBeInTheDocument();
    });

    test('should render correct title for EU clients demo accounts', () => {
        mocked_props.trading_platforms.platform = 'mt5';
        mocked_props.trading_platforms.market_type = 'financial';
        mocked_props.trading_platforms.shortcode = 'svg';
        mocked_props.is_demo = true;
        mocked_props.is_eu_user = true;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('CFDs Demo')).toBeInTheDocument();
    });
});

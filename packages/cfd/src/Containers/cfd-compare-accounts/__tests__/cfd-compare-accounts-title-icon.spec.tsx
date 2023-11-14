import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDCompareAccountsTitleIcon from '../cfd-compare-accounts-title-icon';
import { MARKET_TYPES } from '@deriv/shared';

jest.mock('../../../Assets/svgs/trading-platform', () => jest.fn(() => <div>Mocked Icon</div>));

const mocked_props = {
    trading_platforms: {
        platform: 'mt5',
        market_type: MARKET_TYPES.UNREGULATED,
        shortcode: 'svg',
    },
    is_eu_user: false,
    is_demo: false,
};

describe('<CFDCompareAccountsTitleIcon />', () => {
    test('should render correct title for synthetic_svg market type and shortcode', () => {
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Derived - SVG')).toBeInTheDocument();
    });

    test('should render correct title for synthetic_bvi market type and shortcode', () => {
        mocked_props.trading_platforms.shortcode = 'bvi';
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Derived - BVI')).toBeInTheDocument();
    });

    test('should render correct title for synthetic_vanuatu market type and shortcode', () => {
        mocked_props.trading_platforms.shortcode = 'vanuatu';
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Derived - Vanuatu')).toBeInTheDocument();
    });

    test('should render correct title for financial_labuan market type and shortcode', () => {
        mocked_props.trading_platforms.platform = 'mt5';
        mocked_props.trading_platforms.market_type = MARKET_TYPES.FINANCIAL;
        mocked_props.trading_platforms.shortcode = 'labuan';
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Financial - Labuan')).toBeInTheDocument();
    });

    test('should render correct title for financial_vanuatu market type and shortcode', () => {
        mocked_props.trading_platforms.platform = 'mt5';
        mocked_props.trading_platforms.market_type = MARKET_TYPES.FINANCIAL;
        mocked_props.trading_platforms.shortcode = 'vanuatu';
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Financial - Vanuatu')).toBeInTheDocument();
    });

    test('should render correct title for financial_bvi market type and shortcode', () => {
        mocked_props.trading_platforms.platform = 'mt5';
        mocked_props.trading_platforms.market_type = MARKET_TYPES.FINANCIAL;
        mocked_props.trading_platforms.shortcode = 'bvi';
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Financial - BVI')).toBeInTheDocument();
    });

    test('should render correct title for Swap-Free market type and shortcode', () => {
        mocked_props.trading_platforms.platform = 'mt5';
        mocked_props.trading_platforms.market_type = MARKET_TYPES.ALL;
        mocked_props.trading_platforms.shortcode = 'svg';
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Swap-Free - SVG')).toBeInTheDocument();
    });

    test('should render correct title for Deriv X market type and shortcode', () => {
        mocked_props.trading_platforms.platform = 'dxtrade';
        mocked_props.trading_platforms.market_type = MARKET_TYPES.ALL;
        mocked_props.trading_platforms.shortcode = 'svg';
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Deriv X')).toBeInTheDocument();
    });

    test('should render correct title for EU Clients', () => {
        mocked_props.trading_platforms.platform = 'mt5';
        mocked_props.trading_platforms.market_type = MARKET_TYPES.FINANCIAL;
        mocked_props.trading_platforms.shortcode = 'svg';
        mocked_props.is_eu_user = true;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('CFDs')).toBeInTheDocument();
    });

    test('should render correct title for gaming market type and shortcode demo account', () => {
        mocked_props.trading_platforms.platform = 'mt5';
        mocked_props.trading_platforms.market_type = MARKET_TYPES.UNREGULATED;
        mocked_props.trading_platforms.shortcode = 'svg';
        mocked_props.is_demo = true;
        mocked_props.is_eu_user = false;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Derived Demo')).toBeInTheDocument();
    });

    test('should render correct title for financial market type and shortcode demo account', () => {
        mocked_props.trading_platforms.platform = 'mt5';
        mocked_props.trading_platforms.market_type = MARKET_TYPES.FINANCIAL;
        mocked_props.trading_platforms.shortcode = 'svg';
        mocked_props.is_demo = true;
        mocked_props.is_eu_user = false;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Financial Demo')).toBeInTheDocument();
    });

    test('should render correct title for Swap-Free with correct market type and shortcode demo account', () => {
        mocked_props.trading_platforms.platform = 'mt5';
        mocked_props.trading_platforms.market_type = MARKET_TYPES.ALL;
        mocked_props.trading_platforms.shortcode = 'svg';
        mocked_props.is_demo = true;
        mocked_props.is_eu_user = false;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Swap-Free Demo')).toBeInTheDocument();
    });

    test('should render correct title for Swap-Free with correct market type and shortcode demo account', () => {
        mocked_props.trading_platforms.platform = 'dxtrade';
        mocked_props.trading_platforms.market_type = MARKET_TYPES.ALL;
        mocked_props.trading_platforms.shortcode = 'svg';
        mocked_props.is_demo = true;
        mocked_props.is_eu_user = false;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('Deriv X Demo')).toBeInTheDocument();
    });

    test('should render correct title for EU clients demo accounts', () => {
        mocked_props.trading_platforms.platform = 'mt5';
        mocked_props.trading_platforms.market_type = MARKET_TYPES.FINANCIAL;
        mocked_props.trading_platforms.shortcode = 'svg';
        mocked_props.is_demo = true;
        mocked_props.is_eu_user = true;
        render(<CFDCompareAccountsTitleIcon {...mocked_props} />);
        expect(screen.getByText('CFDs Demo')).toBeInTheDocument();
    });
});

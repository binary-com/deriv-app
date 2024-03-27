import React, { ComponentProps } from 'react';
import { act, render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import Trader from '../trade';
import TraderProviders from '../../../../trader-providers';
import ChartLoader from 'App/Components/Elements/chart-loader';
import { TCoreStores } from '@deriv/stores/types';
import { useDevice } from '@deriv/hooks';

jest.mock('App/Components/Elements/PositionsDrawer', () => jest.fn(() => <div>PositionsDrawer</div>));
jest.mock('../trade-chart', () => jest.fn(() => <div>TradeChart</div>));
jest.mock('../../Components/Form/form-layout', () => jest.fn(() => <div>FormLayout</div>));
jest.mock('App/Components/Elements/chart-loader', () =>
    jest.fn(({ is_visible }: ComponentProps<typeof ChartLoader>) => (is_visible ? <div>ChartLoader</div> : null))
);

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDevice: jest.fn(() => ({ isDesktop: true, isMobile: false, isTablet: false })),
}));

type TMockTrader = {
    rootStore: TCoreStores;
};

const MockTrader = ({ rootStore }: TMockTrader) => (
    <TraderProviders store={rootStore}>
        <Trader />
    </TraderProviders>
);

describe('Trader', () => {
    let rootStore: TCoreStores;
    beforeEach(() => {
        rootStore = mockStore({
            ui: {
                notification_messages_ui: 'div',
                is_mobile: false,
            },
            modules: {
                trade: {
                    contract_type: 'CALL',
                    form_components: [],
                    getFirstOpenMarket: jest.fn(),
                    has_barrier: false,
                    is_accumulator: false,
                    is_chart_loading: false,
                    is_market_closed: false,
                    is_synthetics_available: false,
                    is_synthetics_trading_market_available: false,
                    is_trade_enabled: true,
                    is_trade_params_expanded: false,
                    is_turbos: false,
                    is_vanilla: false,
                    onMount: jest.fn(),
                    onUnmount: jest.fn(),
                    prepareTradeStore: jest.fn(),
                    setIsDigitsWidgetActive: jest.fn(),
                    setMobileDigitView: jest.fn(),
                    should_show_active_symbols_loading: false,
                    show_digits_stats: true,
                    symbol: 'symbol',
                },
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the trader component in mobile view', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false, isMobile: true, isTablet: false });
        rootStore.ui.is_mobile = true;
        render(<MockTrader rootStore={rootStore} />);
        expect(screen.getByText('TradeChart')).toBeInTheDocument();
        expect(screen.getByText('FormLayout')).toBeInTheDocument();
    });

    it('renders the trader component in desktop view', () => {
        render(<MockTrader rootStore={rootStore} />);
        expect(screen.getByText('PositionsDrawer')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_swipeable')).not.toBeInTheDocument();
        expect(screen.getByText('TradeChart')).toBeInTheDocument();
        expect(screen.getByText('FormLayout')).toBeInTheDocument();
    });

    it('should show market is closed overlay', () => {
        rootStore.modules.trade.is_market_closed = true;
        render(<MockTrader rootStore={rootStore} />);
        expect(screen.getByText('This market is closed')).toBeInTheDocument();
    });

    it('should call unMount and onUnmount when component is mounted and unmounted', () => {
        const { unmount } = render(<MockTrader rootStore={rootStore} />);
        expect(rootStore.modules.trade.onMount).toBeCalledTimes(1);
        unmount();
        expect(rootStore.modules.trade.onUnmount).toBeCalledTimes(1);
    });

    it('should render chart loader when chart is loading', () => {
        rootStore.modules.trade.is_chart_loading = true;
        render(<MockTrader rootStore={rootStore} />);
        expect(screen.getByText('ChartLoader')).toBeInTheDocument();
    });

    it('should not render chart loader when chart is not loading', () => {
        render(<MockTrader rootStore={rootStore} />);
        expect(screen.queryByText('ChartLoader')).not.toBeInTheDocument();
    });

    it('should have a correct height offset for div100vhcontainer for accumulator', () => {
        rootStore.modules.trade.is_accumulator = true;
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false, isMobile: true, isTablet: false });
        render(<MockTrader rootStore={rootStore} />);
        expect(screen.getByTestId('dt_div_100_vh')).toHaveStyle('height: calc(768px - 295px);');
    });

    it('should have a correct height offset for div100vhcontainer for turbos', () => {
        rootStore.modules.trade.is_turbos = true;
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false, isMobile: true, isTablet: false });
        render(<MockTrader rootStore={rootStore} />);
        expect(screen.getByTestId('dt_div_100_vh')).toHaveStyle('height: calc(768px - 300px);');
    });

    it('should set category and subcategory when component is mounted', async () => {
        rootStore.modules.trade.getFirstOpenMarket = jest.fn(() => ({
            category: 'category',
            subcategory: 'subcategory',
        }));
        await act(async () => {
            render(<MockTrader rootStore={rootStore} />);
        });
        expect(rootStore.modules.trade.getFirstOpenMarket).toBeCalledTimes(1);
    });

    it('should be able to click see open markets button in market is closed overlay', async () => {
        rootStore.modules.trade.is_market_closed = true;
        rootStore.modules.trade.getFirstOpenMarket = jest.fn(() => ({
            category: 'category',
            subcategory: 'subcategory',
        }));
        await act(async () => {
            render(<MockTrader rootStore={rootStore} />);

            const seeOpenMarketsButton = screen.getByText('See open markets');
            expect(seeOpenMarketsButton).toBeInTheDocument();
            seeOpenMarketsButton.click();
        });
    });

    it('should be able to click try synthetic indices button in market is closed overlay', async () => {
        rootStore.modules.trade.is_market_closed = true;
        rootStore.modules.trade.is_synthetics_trading_market_available = true;
        rootStore.modules.trade.is_synthetics_available = true;
        await act(async () => {
            render(<MockTrader rootStore={rootStore} />);

            const trySyntheticIndicesButton = screen.getByText('Try Synthetic Indices');
            expect(trySyntheticIndicesButton).toBeInTheDocument();
            trySyntheticIndicesButton.click();
        });
    });
});

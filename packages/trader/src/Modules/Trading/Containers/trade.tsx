import React from 'react';
import classNames from 'classnames';
import { Div100vhContainer, SwipeableWrapper } from '@deriv/components';
import { TickSpotData } from '@deriv/api-types';
import { TRADE_TYPES } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import ChartLoader from 'App/Components/Elements/chart-loader';
import PositionsDrawer from 'App/Components/Elements/PositionsDrawer';
import MarketIsClosedOverlay from 'App/Components/Elements/market-is-closed-overlay';
import { ChartTopWidgets, DigitsWidget } from './chart-widgets';
import FormLayout from '../Components/Form/form-layout';
import TradeChart from './trade-chart';
import { useDevice } from '@deriv/hooks';

export type TBottomWidgetsParams = {
    digits: number[];
    tick: TickSpotData | null;
};
type TBottomWidgetsMobile = TBottomWidgetsParams & {
    setTick: (tick: TickSpotData | null) => void;
    setDigits: (digits: number[]) => void;
};

const BottomWidgetsMobile = ({ tick, digits, setTick, setDigits }: TBottomWidgetsMobile) => {
    React.useEffect(() => {
        setTick(tick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tick]);

    React.useEffect(() => {
        setDigits(digits);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [digits]);

    // render nothing for bottom widgets on chart in mobile
    return null;
};

const Trade = observer(() => {
    const { client, common, ui } = useStore();
    const {
        contract_type,
        form_components,
        getFirstOpenMarket,
        has_barrier,
        is_accumulator,
        is_chart_loading,
        is_market_closed,
        is_synthetics_available,
        is_synthetics_trading_market_available,
        is_trade_enabled,
        is_trade_params_expanded,
        is_turbos,
        is_vanilla,
        onMount,
        onUnmount,
        prepareTradeStore,
        setIsDigitsWidgetActive,
        setMobileDigitView,
        should_show_active_symbols_loading,
        show_digits_stats,
        symbol,
    } = useTraderStore();
    const {
        has_only_forward_starting_contracts: is_market_unavailable_visible,
        is_dark_mode_on: is_dark_theme,
        notification_messages_ui: NotificationMessages,
    } = ui;
    const { is_eu } = client;
    const { network_status } = common;
    const { isDesktop, isMobile } = useDevice();

    const [digits, setDigits] = React.useState<number[]>([]);
    const [tick, setTick] = React.useState<null | TickSpotData>(null);
    const [try_synthetic_indices, setTrySyntheticIndices] = React.useState(false);
    const [try_open_markets, setTryOpenMarkets] = React.useState(false);
    const [category, setCategory] = React.useState<string>();
    const [subcategory, setSubcategory] = React.useState<string>();
    const [swipe_index, setSwipeIndex] = React.useState<number | undefined>(0);

    const should_elevate_navigation =
        is_trade_params_expanded &&
        (contract_type === TRADE_TYPES.MATCH_DIFF || contract_type === TRADE_TYPES.OVER_UNDER);

    const open_market = React.useMemo(() => {
        if (try_synthetic_indices) {
            return { category: 'synthetics' };
        } else if (try_open_markets && category) {
            return { category, subcategory };
        }
        return null;
    }, [try_synthetic_indices, try_open_markets, category, subcategory]);

    React.useEffect(() => {
        onMount();
        if (!is_synthetics_available) {
            const setMarket = async () => {
                const markets_to_search = ['forex', 'indices', 'commodities']; // none-synthetic
                const { category: market_cat, subcategory: market_subcat } =
                    (await getFirstOpenMarket(markets_to_search)) ?? {};
                if (market_cat) {
                    setCategory(market_cat);
                    setSubcategory(market_subcat);
                }
            };

            setMarket();
        }
        return () => onUnmount();
    }, [onMount, onUnmount, getFirstOpenMarket, is_synthetics_available]);

    React.useEffect(() => {
        if (isMobile) {
            setDigits([]);
        }
        setTrySyntheticIndices(false);
        setTryOpenMarkets(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol, setDigits, setTrySyntheticIndices, is_synthetics_available]);

    const bottomWidgets = React.useCallback(({ digits: d, tick: t }: TBottomWidgetsParams) => {
        return <BottomWidgetsMobile digits={d} tick={t} setTick={setTick} setDigits={setDigits} />;
    }, []);

    const onChangeSwipeableIndex = (index?: number) => {
        setMobileDigitView(index === 0);
        setIsDigitsWidgetActive(index === 0);
        setSwipeIndex(index);
    };

    const onTryOtherMarkets = async () => {
        if (!is_synthetics_available) {
            setTryOpenMarkets(true);
            setTimeout(() => setTryOpenMarkets(false));
        } else {
            setTrySyntheticIndices(true);
            setTimeout(() => setTrySyntheticIndices(false));
        }
    };

    const topWidgets = React.useCallback(
        () => <ChartTopWidgets open_market={open_market} open={try_synthetic_indices || try_open_markets} />,
        [open_market, try_synthetic_indices, try_open_markets]
    );

    const form_wrapper_class = isMobile ? 'mobile-wrapper' : 'sidebar__container';
    const chart_height_offset = React.useMemo(() => {
        if (is_accumulator) return '295px';
        if (is_turbos) return '300px';
        return '259px';
    }, [is_turbos, is_accumulator]);

    // TODO: Uncomment and update this when DTrader 2.0 development starts:
    // if (useFeatureFlags().is_dtrader_v2_enabled) return <Text size='xl'>Hello! I am DTrader 2.0.</Text>;
    return (
        <div
            className={classNames('trade-container', {
                [`trade-container--${is_accumulator ? 'accumulators' : 'turbos'}`]: is_accumulator || is_turbos,
            })}
            id='trade_container'
        >
            {isDesktop && <PositionsDrawer />}
            {/* Div100vhContainer is workaround for browsers on devices
                    with toolbars covering screen height,
                    using css vh is not returning correct screen height */}
            <Div100vhContainer
                className='chart-container'
                height_offset={chart_height_offset}
                id='chart_container'
                is_disabled={!isMobile}
            >
                <NotificationMessages show_trade_notifications={isMobile} />
                <React.Suspense
                    fallback={<ChartLoader is_dark={is_dark_theme} is_visible={!symbol || !!is_chart_loading} />}
                >
                    {!isMobile && (
                        <div
                            className={classNames('chart-container__wrapper', {
                                'vanilla-trade-chart': is_vanilla,
                            })}
                        >
                            <ChartLoader is_visible={is_chart_loading || should_show_active_symbols_loading} />
                            <TradeChart topWidgets={topWidgets} is_accumulator={is_accumulator} />
                        </div>
                    )}
                    {isMobile && (
                        <React.Fragment>
                            <ChartLoader is_visible={is_chart_loading || should_show_active_symbols_loading} />
                            <SwipeableWrapper
                                className={classNames({ 'vanilla-trade-chart': is_vanilla })}
                                is_disabled={
                                    !show_digits_stats ||
                                    !is_trade_enabled ||
                                    !form_components.length ||
                                    is_chart_loading ||
                                    should_show_active_symbols_loading
                                }
                                is_swipe_disabled={swipe_index === 1}
                                onChange={onChangeSwipeableIndex}
                                should_elevate_navigation={should_elevate_navigation}
                            >
                                {show_digits_stats && <DigitsWidget digits={digits} tick={tick} />}
                                <TradeChart
                                    bottomWidgets={show_digits_stats ? bottomWidgets : undefined}
                                    has_barrier={has_barrier}
                                    is_accumulator={is_accumulator}
                                    topWidgets={topWidgets}
                                />
                            </SwipeableWrapper>
                        </React.Fragment>
                    )}
                </React.Suspense>
            </Div100vhContainer>
            <div className={form_wrapper_class}>
                {is_market_closed && !is_market_unavailable_visible && (
                    <MarketIsClosedOverlay
                        is_eu={is_eu}
                        is_synthetics_trading_market_available={is_synthetics_trading_market_available}
                        onClick={onTryOtherMarkets}
                        onMarketOpen={prepareTradeStore}
                        symbol={symbol}
                    />
                )}
                <FormLayout
                    is_market_closed={is_market_closed}
                    is_trade_enabled={
                        is_trade_enabled && form_components.length > 0 && network_status.class === 'online'
                    }
                />
            </div>
        </div>
    );
});

export default Trade;

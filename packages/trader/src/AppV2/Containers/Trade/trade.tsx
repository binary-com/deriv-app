import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useStore } from '@deriv/stores';
import { Loading } from '@deriv/components';
import { useLocalStorageData } from '@deriv/hooks';
import ClosedMarketMessage from 'AppV2/Components/ClosedMarketMessage';
import { useTraderStore } from 'Stores/useTraderStores';
import BottomNav from 'AppV2/Components/BottomNav';
import PurchaseButton from 'AppV2/Components/PurchaseButton';
import { getChartHeight, HEIGHT } from 'AppV2/Utils/layout-utils';
import { TradeParametersContainer, TradeParameters } from 'AppV2/Components/TradeParameters';
import CurrentSpot from 'AppV2/Components/CurrentSpot';
import { TradeChart } from '../Chart';
import { isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import TradeTypes from './trade-types';
import MarketSelector from 'AppV2/Components/MarketSelector';
import useContractsForCompany from 'AppV2/Hooks/useContractsForCompany';
import AccumulatorStats from 'AppV2/Components/AccumulatorStats';
import OnboardingGuide from 'AppV2/Components/OnboardingGuide/GuideForPages';
import ServiceErrorSheet from 'AppV2/Components/ServiceErrorSheet';

const Trade = observer(() => {
    const [is_minimized_params_visible, setIsMinimizedParamsVisible] = React.useState(false);
    const chart_ref = React.useRef<HTMLDivElement>(null);
    const {
        client: { is_logged_in },
        ui: { is_dark_mode_on },
    } = useStore();
    const {
        active_symbols,
        contract_type,
        has_cancellation,
        symbol,
        is_accumulator,
        is_market_closed,
        onMount,
        onChange,
        onUnmount,
    } = useTraderStore();
    const { trade_types } = useContractsForCompany();
    const [guide_dtrader_v2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2', {
        trade_types_selection: false,
        trade_page: false,
        positions_page: false,
    });

    const symbols = React.useMemo(
        () =>
            active_symbols.map(({ display_name, symbol: underlying }) => ({
                text: display_name,
                value: underlying,
            })),
        [active_symbols]
    );

    const onTradeTypeSelect = React.useCallback(
        (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
            const value = trade_types.find(({ text }) => text === (e.target as HTMLButtonElement).textContent)?.value;
            onChange({
                target: {
                    name: 'contract_type',
                    value,
                },
            });
        },
        [trade_types, onChange]
    );

    const onScroll = React.useCallback(() => {
        const current_chart_ref = chart_ref?.current;
        if (current_chart_ref) {
            const chart_bottom_Y = current_chart_ref.getBoundingClientRect().bottom;
            const container_bottom_Y = window.innerHeight - HEIGHT.BOTTOM_NAV;
            setIsMinimizedParamsVisible(chart_bottom_Y <= container_bottom_Y);
        }
    }, []);

    React.useEffect(() => {
        onMount();
        return onUnmount;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BottomNav onScroll={onScroll}>
            {symbols.length && trade_types.length ? (
                <React.Fragment>
                    <div className='trade'>
                        <TradeTypes
                            contract_type={contract_type}
                            onTradeTypeSelect={onTradeTypeSelect}
                            trade_types={trade_types}
                            is_dark_mode_on={is_dark_mode_on}
                        />
                        <MarketSelector />
                        {isDigitTradeType(contract_type) && <CurrentSpot />}
                        <TradeParametersContainer>
                            <TradeParameters />
                        </TradeParametersContainer>
                        <div className='trade__chart-tooltip'>
                            <section
                                className={clsx('trade__chart', { 'trade__chart--with-borderRadius': !is_accumulator })}
                                style={{
                                    height: getChartHeight({ is_accumulator, symbol, has_cancellation, contract_type }),
                                }}
                                ref={chart_ref}
                            >
                                <TradeChart />
                            </section>
                        </div>
                        {is_accumulator && <AccumulatorStats />}
                    </div>
                    <div className={clsx('trade__parameter', { 'trade__parameter--with-button': !is_market_closed })}>
                        <TradeParametersContainer is_minimized_visible={is_minimized_params_visible} is_minimized>
                            <TradeParameters is_minimized />
                        </TradeParametersContainer>
                        {!is_market_closed && <PurchaseButton />}
                    </div>
                    {!guide_dtrader_v2?.trade_page && is_logged_in && <OnboardingGuide type='trade_page' />}
                </React.Fragment>
            ) : (
                <Loading.DTraderV2 />
            )}
            <ServiceErrorSheet />
            <ClosedMarketMessage />
        </BottomNav>
    );
});

export default Trade;

import React from 'react';
import Digits from 'Modules/Contract/Components/Digits';
import AccumulatorsStats from 'Modules/Contract/Components/AccumulatorsStats';
import BottomWidgets from '../../SmartChart/Components/bottom-widgets';
import TopWidgets from '../../SmartChart/Components/top-widgets';
import { symbolChange } from '../../SmartChart/Helpers/symbol';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv/hooks';

type TDigits = React.ComponentProps<typeof Digits>;

type TChartTopWidgets = {
    open_market: React.ComponentProps<typeof TopWidgets>['open_market'];
    open: React.ComponentProps<typeof TopWidgets>['open'];
};

type TChartBottomWidgets = {
    digits: TDigits['digits_array'];
    tick: TDigits['tick'];
    show_accumulators_stats: boolean;
};

export const DigitsWidget = observer(({ digits, tick }: { digits: TDigits['digits_array']; tick: TDigits['tick'] }) => {
    const { contract_trade, ui } = useStore();
    const {
        onChange: onDigitChange,
        symbol: underlying,
        contract_type: trade_type,
        last_digit: selected_digit,
    } = useTraderStore();
    const { is_mobile } = ui;
    const { last_contract } = contract_trade;
    const { contract_info = {}, digits_info = {}, display_status, is_digit_contract, is_ended } = last_contract;
    return (
        <Digits
            contract_info={contract_info}
            digits_array={digits}
            digits_info={digits_info}
            display_status={display_status}
            is_digit_contract={is_digit_contract}
            is_ended={is_ended}
            is_mobile={is_mobile}
            onDigitChange={onDigitChange}
            is_trade_page
            tick={tick}
            trade_type={trade_type}
            selected_digit={selected_digit}
            underlying={underlying}
        />
    );
});

// Chart widgets passed into SmartCharts
export const ChartTopWidgets = observer(({ open_market, open }: TChartTopWidgets) => {
    const { ui } = useStore();
    const { is_digits_widget_active, onChange: onSymbolChange } = useTraderStore();
    const { is_dark_mode_on } = ui;
    const theme = is_dark_mode_on ? 'dark' : 'light';
    const { isMobile } = useDevice();

    return (
        <TopWidgets
            open_market={open_market}
            open={open}
            is_mobile={isMobile}
            is_digits_widget_active={is_digits_widget_active}
            onSymbolChange={symbolChange(onSymbolChange) as ReturnType<typeof useTraderStore>['onChange']}
            theme={theme}
        />
    );
});

export const ChartBottomWidgets = ({ digits, tick, show_accumulators_stats }: TChartBottomWidgets) => (
    <BottomWidgets
        Widget={show_accumulators_stats ? <AccumulatorsStats /> : <DigitsWidget digits={digits} tick={tick} />}
    />
);

import React from 'react';
import { TQuickStrategyProps, TSymbolItem } from '../quick-strategy.types';
import { QuickStrategyForm, MarketOption, TradeTypeOption } from '.';

const QuickStrategyContainer = (props: TQuickStrategyProps) => {
    const {
        symbol_dropdown,
        trade_type_dropdown,
        active_index,
        description,
        duration_unit_dropdown,
        types_strategies_dropdown,
        initial_values,
        is_onscreen_keyboard_active,
        is_stop_button_visible,
        selected_symbol,
        selected_trade_type,
        selected_duration_unit,
        selected_type_strategy,
        is_dialog_open,
        createStrategy,
        getSizeDesc,
        onChangeDropdownItem,
        onChangeInputValue,
        onHideDropdownList,
        onScrollStopDropdownList,
        setCurrentFocus,
        setActiveTab,
        toggleStopBotDialog,
    } = props;

    const symbol_dropdown_options = React.useMemo(
        () =>
            symbol_dropdown
                .map((symbol: TSymbolItem) => ({
                    component: <MarketOption key={symbol.text} symbol={symbol} />,
                    ...symbol,
                }))
                .filter(option => option.group !== 'Cryptocurrencies'), // Until Crypto enabled for Dbot
        [symbol_dropdown]
    );

    const trade_type_dropdown_options = React.useMemo(
        () =>
            trade_type_dropdown.map(trade_type => ({
                component: <TradeTypeOption key={trade_type.text} trade_type={trade_type} />,
                ...trade_type,
            })),
        [trade_type_dropdown]
    );

    return (
        <QuickStrategyForm
            active_index={active_index}
            description={description}
            createStrategy={createStrategy}
            duration_unit_dropdown={duration_unit_dropdown}
            types_strategies_dropdown={types_strategies_dropdown}
            getSizeDesc={getSizeDesc}
            initial_values={initial_values}
            is_onscreen_keyboard_active={is_onscreen_keyboard_active}
            is_stop_button_visible={is_stop_button_visible}
            onChangeDropdownItem={onChangeDropdownItem}
            onChangeInputValue={onChangeInputValue}
            onHideDropdownList={onHideDropdownList}
            onScrollStopDropdownList={onScrollStopDropdownList}
            symbol_dropdown={symbol_dropdown_options}
            trade_type_dropdown={trade_type_dropdown_options}
            selected_symbol={selected_symbol}
            selected_trade_type={selected_trade_type}
            selected_duration_unit={selected_duration_unit}
            selected_type_strategy={selected_type_strategy}
            setCurrentFocus={setCurrentFocus}
            setActiveTab={setActiveTab}
            toggleStopBotDialog={toggleStopBotDialog}
            is_dialog_open={is_dialog_open}
        />
    );
};

export default React.memo(QuickStrategyContainer);

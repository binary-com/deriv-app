import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { TQuickStrategyProps } from './q-strategy.types';
import { QStrategyContainer } from './q-strategy-components';
import { localize } from '@deriv/translations';
import { MobileFullPageModal } from '@deriv/components';

const QStrategy = (props: TQuickStrategyProps) => {
    const { is_mobile, is_strategy_modal_open, toggleStrategyModal } = props;
    React.useEffect(() => {
        if (!is_mobile) {
            toggleStrategyModal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {is_mobile ? (
                <MobileFullPageModal
                    is_modal_open={is_strategy_modal_open}
                    className='quick-strategy__wrapper'
                    header={localize('Quick Strategy')}
                    onClickClose={toggleStrategyModal}
                    height_offset='80px'
                    page_overlay
                >
                    <QStrategyContainer {...props} />
                </MobileFullPageModal>
            ) : (
                <div className='quick-strategy__container'>
                    <QStrategyContainer {...props} />
                </div>
            )}
        </>
    );
};

export default connect(({ run_panel, quick_strategy, ui }: RootStore) => ({
    active_index: quick_strategy.active_index,
    description: quick_strategy.description,
    createStrategy: quick_strategy.createStrategy,
    duration_unit_dropdown: quick_strategy.duration_unit_dropdown,
    types_strategies_dropdown: quick_strategy.types_strategies_dropdown,
    getSizeDesc: quick_strategy.getSizeDesc,
    initial_errors: quick_strategy.initial_errors,
    initial_values: quick_strategy.initial_values,
    is_onscreen_keyboard_active: ui.is_onscreen_keyboard_active,
    is_mobile: ui.is_mobile,
    is_stop_button_visible: run_panel.is_stop_button_visible,
    onChangeDropdownItem: quick_strategy.onChangeDropdownItem,
    onChangeInputValue: quick_strategy.onChangeInputValue,
    onHideDropdownList: quick_strategy.onHideDropdownList,
    onScrollStopDropdownList: quick_strategy.onScrollStopDropdownList,
    selected_symbol: quick_strategy.selected_symbol,
    selected_trade_type: quick_strategy.selected_trade_type,
    selected_duration_unit: quick_strategy.selected_duration_unit,
    selected_type_strategy: quick_strategy.selected_type_strategy,
    symbol_dropdown: quick_strategy.symbol_dropdown,
    toggleStrategyModal: quick_strategy.toggleStrategyModal,
    trade_type_dropdown: quick_strategy.trade_type_dropdown,
    validateQuickStrategy: quick_strategy.validateQuickStrategy,
    setCurrentFocus: ui.setCurrentFocus,
}))(QStrategy);

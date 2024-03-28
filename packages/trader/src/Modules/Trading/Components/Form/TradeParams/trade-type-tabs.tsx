import classNames from 'classnames';
import React from 'react';
import { ButtonToggle } from '@deriv/components';
import { isTurbosContract, isVanillaContract, TRADE_TYPES } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

type TTradeTypeTabs = {
    className?: string;
};

const TradeTypeTabs = observer(({ className }: TTradeTypeTabs) => {
    const { onChange, contract_type } = useTraderStore();

    const is_turbos = isTurbosContract(contract_type);
    const is_vanilla = isVanillaContract(contract_type);
    const tab_list = [
        { text: localize('Up'), value: TRADE_TYPES.TURBOS.LONG, is_displayed: is_turbos },
        { text: localize('Down'), value: TRADE_TYPES.TURBOS.SHORT, is_displayed: is_turbos },
        { text: localize('Call'), value: TRADE_TYPES.VANILLA.CALL, is_displayed: is_vanilla },
        { text: localize('Put'), value: TRADE_TYPES.VANILLA.PUT, is_displayed: is_vanilla },
    ];

    if (!is_turbos && !is_vanilla) return null;

    return (
        <div className={classNames('trade-container__trade', 'trade-container__trade-type-tabs', className)}>
            <ButtonToggle
                id='dt_advanced_duration_toggle'
                buttons_arr={tab_list.filter(({ is_displayed }) => is_displayed)}
                name='contract_type'
                className='trade-container__trade-type-tabs--button'
                is_animated
                onChange={onChange}
                value={tab_list.find(({ value }) => value === contract_type)?.value ?? ''}
            />
        </div>
    );
});

export default TradeTypeTabs;

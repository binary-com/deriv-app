import React from 'react';
import { Tabs, RelativeDatepicker } from '@deriv/components';
import { getDurationMinMaxValues } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import type { TTradeParamsMobile } from 'Modules/Trading/Containers/trade-params-mobile';
import DurationTicksWidgetMobile from './duration-ticks-widget-mobile';
import DurationNumbersWidgetMobile from './duration-numbers-widget-mobile';

export type TDurationMobile = Pick<
    TTradeParamsMobile,
    | 'amount_tab_idx'
    | 'd_duration'
    | 'duration_tab_idx'
    | 'h_duration'
    | 'm_duration'
    | 's_duration'
    | 't_duration'
    | 'has_amount_error'
    | 'payout_value'
    | 'setDurationError'
    | 'setDurationTabIdx'
    | 'setSelectedDuration'
    | 'stake_value'
    | 'toggleModal'
> & {
    expiry_epoch?: string | number;
};

type TDurationUnit = 't' | 's' | 'm' | 'h' | 'd';

const DurationMobile = observer(
    ({
        amount_tab_idx,
        d_duration,
        duration_tab_idx,
        expiry_epoch,
        h_duration,
        has_amount_error,
        m_duration,
        payout_value,
        s_duration,
        setDurationError,
        setDurationTabIdx,
        setSelectedDuration,
        stake_value,
        t_duration,
        toggleModal,
    }: TDurationMobile) => {
        const { duration_units_list, duration_min_max, basis: trade_basis } = useTraderStore();
        const duration_values = {
            t_duration,
            s_duration,
            m_duration,
            h_duration,
            d_duration,
        };
        const [min, max] = getDurationMinMaxValues(duration_min_max, 'daily', 'd');
        const handleRelativeChange = (date: number) => {
            setSelectedDuration('d', date);
        };
        const selected_basis_option = () => {
            if (amount_tab_idx === 0) {
                return 'stake';
            } else if (amount_tab_idx === 1) {
                return 'payout';
            }
            return trade_basis;
        };

        const onTabChange = (index: number) => {
            setDurationTabIdx(index);
            const { value: unit } = duration_units_list[index];
            setSelectedDuration(unit, duration_values[`${unit as TDurationUnit}_duration`]);
        };

        return (
            <div>
                <Tabs active_index={duration_tab_idx} onTabItemClick={onTabChange} single_tab_has_no_label top>
                    {duration_units_list.map(duration_unit_option => {
                        switch (duration_unit_option.value) {
                            case 't':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <DurationTicksWidgetMobile
                                            basis_option={selected_basis_option()}
                                            has_amount_error={has_amount_error}
                                            toggleModal={toggleModal}
                                            selected_duration={t_duration}
                                            setDurationError={setDurationError}
                                            setSelectedDuration={setSelectedDuration}
                                            stake_value={stake_value}
                                            payout_value={payout_value}
                                        />
                                    </div>
                                );
                            case 's':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <DurationNumbersWidgetMobile
                                            basis_option={selected_basis_option()}
                                            has_amount_error={has_amount_error}
                                            toggleModal={toggleModal}
                                            duration_unit_option={duration_unit_option}
                                            selected_duration={s_duration}
                                            setDurationError={setDurationError}
                                            setSelectedDuration={setSelectedDuration}
                                            stake_value={stake_value}
                                            payout_value={payout_value}
                                        />
                                    </div>
                                );
                            case 'm':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <DurationNumbersWidgetMobile
                                            basis_option={selected_basis_option()}
                                            has_amount_error={has_amount_error}
                                            toggleModal={toggleModal}
                                            duration_unit_option={duration_unit_option}
                                            selected_duration={m_duration}
                                            setDurationError={setDurationError}
                                            setSelectedDuration={setSelectedDuration}
                                            stake_value={stake_value}
                                            payout_value={payout_value}
                                        />
                                    </div>
                                );
                            case 'h':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <DurationNumbersWidgetMobile
                                            basis_option={selected_basis_option()}
                                            has_amount_error={has_amount_error}
                                            toggleModal={toggleModal}
                                            duration_unit_option={duration_unit_option}
                                            selected_duration={h_duration}
                                            setDurationError={setDurationError}
                                            setSelectedDuration={setSelectedDuration}
                                            stake_value={stake_value}
                                            payout_value={payout_value}
                                        />
                                    </div>
                                );
                            case 'd':
                                return (
                                    <div label={duration_unit_option.text} key={duration_unit_option.value}>
                                        <DurationNumbersWidgetMobile
                                            basis_option={selected_basis_option()}
                                            has_amount_error={has_amount_error}
                                            toggleModal={toggleModal}
                                            duration_unit_option={duration_unit_option}
                                            contract_expiry='daily'
                                            selected_duration={d_duration}
                                            setDurationError={setDurationError}
                                            setSelectedDuration={setSelectedDuration}
                                            stake_value={stake_value}
                                            show_expiry
                                            payout_value={payout_value}
                                            expiry_epoch={expiry_epoch}
                                            duration_values={duration_values}
                                        />
                                        <RelativeDatepicker
                                            onChange={handleRelativeChange}
                                            min_date={min}
                                            max_date={max}
                                            title={localize('Pick an end date')}
                                        />
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })}
                </Tabs>
            </div>
        );
    }
);

export default DurationMobile;

import React from 'react';
import { getDurationMinMaxValues } from '@deriv/shared';
import Duration from './duration';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

type TDurationWrapper = {
    is_minimized?: boolean;
};
const DurationWrapper = observer(({ is_minimized }: TDurationWrapper) => {
    const { ui } = useStore();
    const {
        advanced_expiry_type,
        advanced_duration_unit,
        getDurationFromUnit,
        is_advanced_duration,
        onChangeUiStore,
        simple_duration_unit,
        duration_t,
    } = ui;
    const {
        contract_expiry_type,
        contract_type,
        duration,
        duration_unit,
        duration_units_list,
        duration_min_max,
        expiry_type,
        expiry_date,
        expiry_epoch,
        expiry_time,
        start_date,
        onChange,
        onChangeMultiple,
    } = useTraderStore();

    const duration_props = {
        advanced_duration_unit,
        advanced_expiry_type,
        contract_expiry_type,
        contract_type,
        duration_min_max,
        duration_t,
        duration_unit,
        duration_units_list,
        duration,
        expiry_date,
        expiry_epoch,
        expiry_time,
        expiry_type,
        getDurationFromUnit,
        is_minimized,
        is_advanced_duration,
        onChange,
        onChangeMultiple,
        onChangeUiStore,
        simple_duration_unit,
        start_date,
    };

    const hasDurationUnit = (duration_type: string, is_advanced: boolean) => {
        let duration_list = [...duration_units_list];

        if (duration_list.length > 1 && !is_advanced) {
            duration_list = duration_list.filter(du => du.value === 'm' || du.value === 't');
        }

        return duration_list.some(du => du.value === duration_type);
    };

    const current_duration_unit = is_advanced_duration ? advanced_duration_unit : simple_duration_unit;
    const has_missing_duration_unit = !hasDurationUnit(current_duration_unit, is_advanced_duration);
    const simple_is_missing_duration_unit =
        !is_advanced_duration && simple_duration_unit === 'd' && duration_units_list.length === 4;
    const [min_value, max_value] = getDurationMinMaxValues(duration_min_max, contract_expiry_type, duration_unit);

    const handleEndTime = () => {
        const symbol_has_endtime = duration_units_list.length > 1 || is_advanced_duration;

        if (symbol_has_endtime) {
            // simple duration does not have endtime
            if (!is_advanced_duration) onChangeUiStore({ name: 'is_advanced_duration', value: true });

            onChangeUiStore({ name: 'advanced_expiry_type', value: 'endtime' });
        } else {
            // If query string contains endtime but contract type does not e.g. digits (only ticks contracts)
            onChange({ target: { name: 'expiry_type', value: 'duration' } });
        }
    };

    const assertDurationIsWithinBoundary = React.useCallback(
        (current_duration: number) => {
            const [min_value, max_value] = getDurationMinMaxValues(
                duration_min_max,
                contract_expiry_type,
                duration_unit
            );
            if (contract_expiry_type === 'tick' && current_duration < Number(min_value)) {
                onChangeUiStore({ name: `duration_${duration_unit}`, value: Number(min_value) });
                onChange({ target: { name: 'duration', value: min_value } });
            }

            if (
                current_duration >= Number(min_value) &&
                current_duration > Number(max_value) &&
                duration_unit !== 'd'
            ) {
                onChangeUiStore({ name: `duration_${duration_unit}`, value: Number(max_value) });
                onChange({ target: { name: 'duration', value: max_value } });
            }
        },
        [contract_expiry_type, duration_unit, duration_min_max, onChange, onChangeUiStore]
    );

    React.useEffect(() => {
        const current_unit = is_advanced_duration ? advanced_duration_unit : simple_duration_unit;
        const current_duration = getDurationFromUnit(current_unit);
        let unit = duration_unit;
        let duration_value = duration;

        if (duration_units_list?.length > 0 && (has_missing_duration_unit || simple_is_missing_duration_unit)) {
            unit = duration_units_list[0].value;
            duration_value = getDurationFromUnit(unit);
            onChangeMultiple({ duration_unit: unit, duration: +duration_value });
        }

        if (unit !== current_unit) {
            onChangeUiStore({ name: 'advanced_duration_unit', value: unit });
            onChangeUiStore({ name: 'simple_duration_unit', value: unit });
        }

        if (+duration_value !== +current_duration) {
            onChangeUiStore({ name: `duration_${unit}`, value: duration_value });
        }

        if (expiry_type === 'endtime') handleEndTime();

        assertDurationIsWithinBoundary(Number(current_duration));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [has_missing_duration_unit, simple_is_missing_duration_unit]);

    React.useEffect(() => {
        if (duration_unit === 'd') {
            onChangeUiStore({ name: 'is_advanced_duration', value: true });
        }
    }, [duration_unit, onChangeUiStore]);

    React.useEffect(() => {
        if (is_advanced_duration && expiry_type !== advanced_expiry_type) {
            onChange({ target: { name: 'expiry_type', value: advanced_expiry_type } });
        }
    }, [is_advanced_duration, expiry_type, advanced_expiry_type, onChange]);

    // intercept changes to contract duration and check that trade_store and ui_store are aligned.
    React.useEffect(() => {
        const current_duration = getDurationFromUnit(duration_unit);
        const simple_is_not_type_duration = !is_advanced_duration && expiry_type !== 'duration';

        // simple only has expiry type duration
        if (simple_is_not_type_duration) {
            onChange({ target: { name: 'expiry_type', value: 'duration' } });
        }

        if (duration !== Number(current_duration)) {
            onChangeUiStore({ name: `duration_${duration_unit}`, value: duration });
        }

        assertDurationIsWithinBoundary(Number(current_duration));
    }, [
        duration_unit,
        is_advanced_duration,
        expiry_type,
        duration,
        assertDurationIsWithinBoundary,
        onChange,
        onChangeUiStore,
        getDurationFromUnit,
    ]);

    return (
        <Duration hasDurationUnit={hasDurationUnit} max_value={max_value} min_value={min_value} {...duration_props} />
    );
});

export default DurationWrapper;

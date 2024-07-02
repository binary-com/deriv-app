import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { Autocomplete } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';
import { useDBotStore } from 'Stores/useDBotStore';
import { TApiHelpersInstance, TDurationUnitItem, TFormData } from '../types';

type TDurationUnit = {
    attached?: boolean;
};

const DurationUnit: React.FC<TDurationUnit> = ({ attached }: TDurationUnit) => {
    const [list, setList] = React.useState<TDurationUnitItem[]>([]);
    const [prevSymbol, setPrevSymbol] = React.useState('');
    const [prevTradeType, setPrevTradeType] = React.useState('');
    const { quick_strategy } = useDBotStore();
    const { setValue, setCurrentDurationMinMax } = quick_strategy;
    const { setFieldValue, validateForm, values } = useFormikContext<TFormData>();
    const { symbol, tradetype } = values;

    React.useEffect(() => {
        if (tradetype && symbol) {
            const getDurationUnits = async () => {
                const { contracts_for } = ApiHelpers.instance as unknown as TApiHelpersInstance;
                const durations = await contracts_for.getDurations(symbol, tradetype);
                const duration_units = durations?.map(duration => ({
                    text: duration.display ?? '',
                    value: duration.unit ?? '',
                    min: duration.min,
                    max: duration.max,
                }));
                setList(duration_units);
                const selected = values?.durationtype;
                const has_selected = duration_units?.some(duration => duration.value === selected);
                if (!has_selected || prevSymbol !== symbol || prevTradeType !== tradetype) {
                    setCurrentDurationMinMax(durations?.[0]?.min, durations?.[0]?.max);
                    setFieldValue?.('durationtype', durations?.[0]?.unit, true);
                    setFieldValue?.('duration', durations?.[0]?.min, true);
                    setValue('durationtype', durations?.[0]?.unit ?? '');
                } else {
                    const duration = duration_units?.find((duration: TDurationUnitItem) => duration.value === selected);
                    setCurrentDurationMinMax(duration?.min, duration?.max);
                }
                setPrevSymbol(symbol as string);
                setPrevTradeType(tradetype as string);
            };
            getDurationUnits();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol, tradetype]);

    return (
        <div
            className={classNames('qs__form__field qs__form__field__input', {
                'no-top-border-radius': attached,
            })}
        >
            <Field name='durationtype' key='durationtype' id='durationtype'>
                {({ field }: FieldProps) => {
                    const selected_item = list?.find(item => item.value === field.value);
                    return (
                        <Autocomplete
                            {...field}
                            readOnly
                            inputMode='none'
                            data-testid='dt_qs_durationtype'
                            autoComplete='off'
                            className='qs__select'
                            value={selected_item?.text || ''}
                            list_items={list}
                            onItemSelection={(item: TItem) => {
                                const { value, min, max } = item as TDurationUnitItem;
                                if (value) {
                                    setCurrentDurationMinMax(min, max);
                                    setFieldValue?.('durationtype', value);
                                    setValue('durationtype', value);
                                    setFieldValue?.('duration', min).then(() => {
                                        validateForm();
                                    });
                                    setValue('duration', min);
                                }
                            }}
                        />
                    );
                }}
            </Field>
        </div>
    );
};

export default DurationUnit;

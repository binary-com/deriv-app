import React, { MouseEvent } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Input, Popover } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

type TQSInput = {
    name: string;
    onChange: (key: string, value: string | number | boolean) => void;
    type?: string;
    attached?: boolean;
    should_have?: { key: string; value: string | number | boolean }[];
    disabled?: boolean;
    min?: number;
    max?: number;
    has_currency_unit?: boolean;
};

const QSInput: React.FC<TQSInput> = observer(
    ({
        name,
        onChange,
        type = 'text',
        attached = false,
        disabled = false,
        min,
        max,
        has_currency_unit = false,
    }: TQSInput) => {
        const {
            ui: { is_desktop },
            client: { currency },
        } = useStore();
        const { quick_strategy } = useDBotStore();
        const { loss_threshold_warning_data } = quick_strategy;

        const [has_focus, setFocus] = React.useState(false);
        const { setFieldValue, setFieldTouched } = useFormikContext();
        const is_number = type === 'number';
        const max_value = 999999999999;

        const handleButtonInputChange = (e: MouseEvent<HTMLButtonElement>, value: string) => {
            e?.preventDefault();
            onChange(name, value);
            setFieldTouched(name, true, true);
            setFieldValue(name, value);
        };

        const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const input_value = e.target.value;
            let value: number | string = 0;
            const max_characters = 12;
            if (max_characters && input_value.length >= max_characters) {
                value = input_value.slice(0, max_characters);
                value = is_number ? Number(value) : value;
            } else {
                value = is_number ? Number(input_value) : input_value;
            }
            onChange(name, value);
        };

        return (
            <Field name={name} key={name} id={name}>
                {({ field, meta }: FieldProps) => {
                    const { error } = meta;
                    const has_error = error;
                    const is_exclusive_field = has_currency_unit;
                    return (
                        <div
                            className={classNames('qs__form__field qs__form__field__input', {
                                'no-top-spacing': attached,
                                'no-border-top': attached,
                            })}
                        >
                            <div
                                data-testid='dt_qs_input_container'
                                onMouseEnter={() => setFocus(true)}
                                onMouseLeave={() => setFocus(false)}
                            >
                                <Popover
                                    alignment='bottom'
                                    message={error}
                                    is_open={!is_desktop ? !!error : !!error && has_focus}
                                    zIndex='9999'
                                    classNameBubble='qs__warning-bubble'
                                    has_error
                                    should_disable_pointer_events
                                >
                                    <Input
                                        data_testId={`dt_qs_${name}`}
                                        className={classNames(
                                            'qs__input',
                                            { error: has_error },
                                            { highlight: loss_threshold_warning_data?.highlight_field?.includes(name) }
                                        )}
                                        type={type}
                                        leading_icon={
                                            is_number ? (
                                                <button
                                                    disabled={disabled || (!!min && field.value <= min)}
                                                    data-testid='dt_qs_input_decrease'
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        const value = Number(field.value) - 1;
                                                        handleButtonInputChange(
                                                            e,
                                                            String(value % 1 ? value.toFixed(2) : value)
                                                        );
                                                    }}
                                                >
                                                    -
                                                </button>
                                            ) : undefined
                                        }
                                        trailing_icon={
                                            is_number ? (
                                                <button
                                                    disabled={
                                                        disabled ||
                                                        field.value == max_value ||
                                                        (!!max && field.value >= max)
                                                    }
                                                    data-testid='dt_qs_input_increase'
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        const value = Number(field.value) + 1;
                                                        handleButtonInputChange(
                                                            e,
                                                            String(value % 1 ? value.toFixed(2) : value)
                                                        );
                                                    }}
                                                >
                                                    +
                                                </button>
                                            ) : null
                                        }
                                        {...field}
                                        disabled={disabled}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOnChange(e)}
                                        placeholder={is_exclusive_field ? '0' : ''}
                                        bottom_label={is_exclusive_field ? currency : ''}
                                        max_characters={2}
                                        maxLength={2}
                                    />
                                </Popover>
                            </div>
                        </div>
                    );
                }}
            </Field>
        );
    }
);

export default QSInput;

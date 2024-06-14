import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { isMobileOrTablet } from '@deriv/shared';
import Input from '../input';
import Text from '../text';

type TAmountInput = {
    currency: string;
    decimal_places?: number;
    disabled?: boolean;
    has_error?: boolean;
    initial_value?: number;
    label?: string;
    locale?: Intl.LocalesArgument;
    max_digits?: number;
    onChange?: (value: number) => void;
};

const AmountInput = ({
    currency,
    decimal_places = 2,
    disabled = false,
    has_error,
    initial_value = 0,
    label,
    locale,
    max_digits = 8,
    onChange,
}: TAmountInput) => {
    const [value, setValue] = useState(initial_value);
    const [focus, setFocus] = useState(false);
    const [is_pasting, setIsPasting] = useState(false);
    const [caret_right_offset, setCaretRightOffset] = useState(0);
    const [selection, setSelection] = useState<{
        selectionStart: number;
        selectionEnd: number;
    }>({ selectionStart: 0, selectionEnd: 0 });
    const [target, setTarget] = useState<React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>['target']>();

    const displayNumber = useCallback(
        (number: number) => number.toLocaleString(locale, { minimumFractionDigits: decimal_places }),
        [decimal_places, locale]
    );

    useEffect(() => {
        setValue(initial_value);
    }, [initial_value]);

    useEffect(() => {
        // update caret position every time the value changes (this happens after onChange)
        const updated_caret_position = displayNumber(value).length - caret_right_offset;
        target?.setSelectionRange(updated_caret_position, updated_caret_position);
        setSelection({ selectionStart: updated_caret_position, selectionEnd: updated_caret_position });
    }, [value, target, displayNumber]);

    const onChangeHandler: React.ComponentProps<typeof Input>['onChange'] = e => {
        if (!target) setTarget(e.target);
        let new_value = value;
        if (!is_pasting) {
            // handle ATM typing:
            // remove all characters that are not digit / point / comma:
            const input_value = e.target.value.replace(/[^\d.,]/g, '');
            if (input_value.replace(/[.,]/g, '').replace(/^0+/g, '').length <= max_digits)
                new_value = Number(input_value.replace(/[.,]/g, '')) / Math.pow(10, decimal_places);
        } else {
            // handle pasting:
            const selection_length = selection.selectionEnd - selection.selectionStart;
            const pasted_string_length = e.target.value.length + selection_length - displayNumber(value).length;
            const pasted_string = e.target.value.substring(
                selection.selectionStart,
                selection.selectionStart + pasted_string_length
            );
            // remove all characters that are not digit / point / comma:
            const input_value = e.target.value.replace(/[^\d.,]/g, '');
            // understand the value user wants to paste:
            const pasted_value = pasted_string
                .replace(/[^\d.,]/g, '') // remove all characters that are not digit / point / comma
                .replace(/[,.](?=.*[,.])/g, '') // leave only the last point / comma
                .replace(',', '.'); // make the last point / comma separator a point
            if (pasted_value.replace('.', '')) {
                // if the value is a valid non-empty string, handle the two scenarios:
                if ((value === 0 && caret_right_offset === 0) || selection_length === displayNumber(value).length) {
                    // handle pasting when there's nothing entered before it, or it is overridden (intention: reset value):
                    new_value = Number(
                        pasted_value.substring(
                            0,
                            pasted_value.includes('.') ? max_digits + 1 : max_digits - decimal_places
                        )
                    );
                } else if (input_value.replace(/[.,]/g, '').replace(/^0+/g, '').length <= max_digits) {
                    // handle pasting when there's something entered before it and there's space for the pasted value (intention: add to value):
                    new_value = Number(input_value.replace(/[.,]/g, '')) / Math.pow(10, decimal_places);
                }
            }
        }
        setValue(new_value);
        setIsPasting(false);
        onChange?.(new_value);
    };

    const inputActionHandler: React.ComponentProps<typeof Input>['onMouseDown'] &
        React.ComponentProps<typeof Input>['onMouseUp'] &
        React.ComponentProps<typeof Input>['onKeyDown'] = e => {
        if (e.currentTarget.selectionStart !== null && e.currentTarget.selectionEnd !== null) {
            setCaretRightOffset(e.currentTarget.value.length - e.currentTarget.selectionEnd);
            setSelection({
                selectionStart: e.currentTarget.selectionStart,
                selectionEnd: e.currentTarget.selectionEnd,
            });
        }
    };

    return (
        <div className='amount-input-wrapper'>
            <Text size={isMobileOrTablet() ? 'xxs' : 'xs'}>{label}</Text>
            <div
                className={classNames('amount-input-container', {
                    'amount-input-container--error': has_error,
                    'amount-input-container--disabled': disabled,
                })}
            >
                <Input
                    className='amount-input'
                    disabled={disabled || focus}
                    type='text'
                    inputMode='numeric'
                    value={`${displayNumber(value)} ${currency}`}
                    // Temporary workaround to avoid jest warnings
                    onChange={() => undefined}
                />
                <Input
                    className='amount-input'
                    data-testid='dt_amount-input'
                    disabled={disabled}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    onChange={onChangeHandler}
                    onKeyDown={inputActionHandler}
                    onMouseDown={inputActionHandler}
                    onMouseUp={inputActionHandler}
                    onPaste={() => setIsPasting(true)}
                    type='text'
                    inputMode='numeric'
                    value={displayNumber(value)}
                />
            </div>
        </div>
    );
};

export default AmountInput;

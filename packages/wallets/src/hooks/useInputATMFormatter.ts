import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { unFormatLocaleString } from '@deriv/utils';
import useInputDecimalFormatter from './useInputDecimalFormatter';

type TOptions = {
    fractionDigits?: number;
    locale?: Intl.LocalesArgument;
    maxDigits?: number;
};

// function-wrapped because of SonarCloud warnings. More context for why: https://stackoverflow.com/questions/1520800/why-does-a-regexp-with-global-flag-give-wrong-results
const getSeparatorRegex = () => /[,.]/g; // locale-agnostic

const useInputATMFormatter = (inputRef: React.RefObject<HTMLInputElement>, initial?: number, options?: TOptions) => {
    const input = inputRef.current;

    // helper values for editing
    const isErasing = useRef(false);
    const isPasting = useRef(false);
    const isRewriting = useRef(false);
    const clipboardContent = useRef('');

    const { onChange: onChangeDecimal, value } = useInputDecimalFormatter(undefined, options);
    const { fractionDigits = 2, locale, maxDigits = 14 } = options ?? {};

    const formattedValue = useMemo(
        () => `${Number(value).toLocaleString(locale, { minimumFractionDigits: fractionDigits })}`,
        [fractionDigits, locale, value]
    );

    // maintain the input state to compare new values to it on every change
    const [prevFormattedValue, setPrevFormattedValue] = useState<string>(formattedValue);
    useEffect(() => {
        setPrevFormattedValue(formattedValue);
    }, [formattedValue]);

    // keep the caret from jumping
    const [caretNeedsRepositioning, setCaretNeedsRepositioning] = useState<boolean>(false);
    const [caret, setCaret] = useState<number>(); // counting from right
    useEffect(() => {
        if (caret && caretNeedsRepositioning && input) {
            const newCaretPosition = formattedValue.length - caret;

            input.setSelectionRange(newCaretPosition, newCaretPosition);
            setCaretNeedsRepositioning(false);
        }
    }, [caret, formattedValue, caretNeedsRepositioning, input]);

    const checkExceedsMaxDigits = useCallback(
        (newValue: string) => {
            if (!input) return true;

            // drop the changes if the number of digits is not decreasing and it has exceeded maxDigits
            const inputDigitsCount = input.value.replace(getSeparatorRegex(), '').replace(/^0+/, '').length;
            const changeDigitsCount = newValue.replace(getSeparatorRegex(), '').replace(/^0+/, '').length ?? 0;
            return maxDigits && changeDigitsCount >= inputDigitsCount && changeDigitsCount > maxDigits;
        },
        [input, maxDigits]
    );

    const handleNewValue = useCallback(() => {
        if (!input) return;

        // ignore non-digit changes
        const hasNoChangeInDigits =
            input.value.length + 1 === prevFormattedValue.length &&
            input.value.replaceAll(getSeparatorRegex(), '') === prevFormattedValue.replaceAll(getSeparatorRegex(), '');
        if (hasNoChangeInDigits) return;

        // if newValue has no separator, an integer val is being handled (and edited by the user).
        // This would require setting the caret to the end of the integer part of the input val
        const hasSeparator = getSeparatorRegex().test(input.value);
        const integerEditingCaretOffset = !!input.value && !hasSeparator ? fractionDigits + 1 : 0;

        let newCaretPosition = input.value.length - (input.selectionStart ?? 0) + integerEditingCaretOffset;

        const caretInFractions = hasSeparator && newCaretPosition <= fractionDigits;
        const decimalPlacesCount = unFormatLocaleString(input.value, locale).split('.')?.[1]?.length;
        if (caretInFractions && !isErasing.current) {
            if (newCaretPosition > 0 && input.value[input.value.length - newCaretPosition] === '0') {
                input.value =
                    input.value.slice(0, input.value.length - newCaretPosition) +
                    input.value.slice(input.value.length - newCaretPosition + 1);
                newCaretPosition--;
            } else if (decimalPlacesCount < fractionDigits) {
                newCaretPosition = fractionDigits - decimalPlacesCount;
            }
        }

        setCaret(newCaretPosition);
        setCaretNeedsRepositioning(true);

        const unformatted = unFormatLocaleString(input.value, locale);
        const shifted = (Number(unformatted) * 10).toFixed(fractionDigits);
        const unShifted = (Number(unformatted) / 10).toFixed(fractionDigits);
        const unformattedFraction = unformatted.split('.')?.[1]?.length || fractionDigits;

        // The new value has one more decimal places than the fraction digits,
        // so we need to shift the decimal point to the left.
        if (unformattedFraction - 1 === fractionDigits) {
            return onChangeDecimal({ target: { value: shifted } });
        }

        // The new value has one less decimal places than the fraction digits,
        // so we need to shift the decimal point to the right.
        // This behavior is designated for erasing only.
        if (isErasing.current && unformattedFraction + 1 === fractionDigits) {
            return onChangeDecimal({ target: { value: unShifted } });
        }

        // The new value has the same number of decimal places as the fraction digits,
        // so we don't need to shift the decimal point.
        if (unformattedFraction === fractionDigits) {
            return onChangeDecimal({ target: { value: unformatted } });
        }

        // The new value has more decimal places than the fraction digits,
        // so we chop the extra decimal points.
        if (unformattedFraction - 1 > fractionDigits) {
            return onChangeDecimal({ target: { value: unformatted } });
        }

        // The new value has less decimal places than the fraction digits,
        // so we add the missing extra decimal point.
        if (unformattedFraction + 1 < fractionDigits) {
            return onChangeDecimal({ target: { value: unformatted } });
        }

        return onChangeDecimal({ target: { value: unformatted } });
    }, [input, prevFormattedValue, locale, fractionDigits, onChangeDecimal]);

    const onChange = useCallback(
        (e: DeepPartial<React.ChangeEvent<HTMLInputElement>> | React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target?.value;
            if (typeof newValue === 'undefined') return;

            if (isPasting.current) {
                isPasting.current = false;
                if (!isRewriting.current) return;

                const pastedValueUnformatted = unFormatLocaleString(clipboardContent.current, locale);
                const pastedValue =
                    fractionDigits > 2 && !getSeparatorRegex().test(pastedValueUnformatted) // allow pasting integer values as fractions in case of crypto
                        ? Number(pastedValueUnformatted) / Math.pow(10, fractionDigits)
                        : Number(pastedValueUnformatted);
                const pastedValueFormatted = `${pastedValue.toLocaleString(locale, {
                    minimumFractionDigits: fractionDigits,
                })}`;
                if (
                    !isNaN(pastedValue) &&
                    isFinite(pastedValue) &&
                    pastedValue >= 0 &&
                    !checkExceedsMaxDigits(pastedValueFormatted)
                )
                    return onChangeDecimal({ target: { value: unFormatLocaleString(pastedValueFormatted, locale) } });
            } else {
                if (checkExceedsMaxDigits(newValue)) return;
                handleNewValue();
            }
        },
        [checkExceedsMaxDigits, fractionDigits, handleNewValue, locale, onChangeDecimal]
    );

    const onPaste: React.ClipboardEventHandler<HTMLInputElement> = useCallback(
        e => {
            isPasting.current = e.type === 'paste';
            const pastedText = (e.clipboardData || window.clipboardData).getData('Text');
            isRewriting.current =
                Number(unFormatLocaleString(formattedValue, locale)) === 0 || pastedText === e.currentTarget.value;

            if (isPasting.current && isRewriting.current) {
                clipboardContent.current = pastedText;
            }
        },
        [formattedValue, locale]
    );

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' || e.key === 'Delete') isErasing.current = true;
    };

    const onKeyUp = () => {
        isErasing.current = false;
    };

    useEffect(() => {
        if (typeof initial === 'number') {
            return onChangeDecimal({
                target: {
                    value: unFormatLocaleString(
                        `${Number(initial).toLocaleString(locale, { minimumFractionDigits: fractionDigits })}`,
                        locale
                    ),
                },
            });
        }
    }, [fractionDigits, initial, locale, onChangeDecimal]);

    return { onChange, onKeyDown, onKeyUp, onPaste, value: formattedValue };
};

export default useInputATMFormatter;

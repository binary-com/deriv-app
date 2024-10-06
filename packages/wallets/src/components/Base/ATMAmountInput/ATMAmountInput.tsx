import React, { useCallback, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import unFormatLocaleString from '@deriv/utils/src/unFormatLocaleString';
import { Text } from '@deriv-com/ui';
import useInputATMFormatter from '../../../hooks/useInputATMFormatter';
import './ATMAmountInput.scss';

type TProps = {
    currency?: string;
    disabled?: boolean;
    fractionDigits?: number;
    isError?: boolean;
    label: string;
    maxDigits?: number;
    onBlur?: VoidFunction;
    onChange?: (value: number) => void;
    onFocus?: VoidFunction;
    value: number;
};

const WalletTransferFormInputField: React.FC<TProps> = ({
    currency,
    disabled,
    fractionDigits = 0,
    isError,
    label,
    maxDigits,
    onBlur,
    onChange,
    onFocus,
    value,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const {
        onChange: formatOnChange,
        onKeyDown,
        onKeyUp,
        onPaste: formatOnPaste,
        value: formattedValue,
    } = useInputATMFormatter(inputRef, value, {
        fractionDigits,
        locale: 'en-US',
        maxDigits,
    });

    useEffect(() => {
        onChange?.(Number(unFormatLocaleString(formattedValue, 'en-US')));
    }, [formattedValue, onChange]);

    const onFocusHandler = useCallback(() => {
        setIsFocused(true);
        onFocus?.();
    }, [onFocus]);

    const onBlurHandler = useCallback(() => {
        setIsFocused(false);
        onBlur?.();
    }, [onBlur]);

    return (
        <div className='wallets-atm-amount-input'>
            <Text align='start' size='sm'>
                {label}
            </Text>
            <div className='wallets-atm-amount-input__input-container'>
                <Text align='start' size='lg' weight='bold'>
                    <input
                        className={classnames('wallets-atm-amount-input__input', {
                            'wallets-atm-amount-input__input--error': isError,
                        })}
                        disabled={disabled || isFocused}
                        readOnly
                        value={`${formattedValue} ${currency ?? ''}`}
                    />
                    <input
                        className={classnames('wallets-atm-amount-input__input', {
                            'wallets-atm-amount-input__input--error': isError,
                        })}
                        disabled={disabled}
                        onBlur={onBlurHandler}
                        onChange={formatOnChange}
                        onFocus={onFocusHandler}
                        onKeyDown={onKeyDown}
                        onKeyUp={onKeyUp}
                        onPaste={formatOnPaste}
                        ref={inputRef}
                        type='tel'
                        value={formattedValue}
                    />
                </Text>
            </div>
        </div>
    );
};

export default WalletTransferFormInputField;

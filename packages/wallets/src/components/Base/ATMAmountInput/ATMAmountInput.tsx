import React, { useCallback, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import unFormatLocaleString from '@deriv/utils/src/unFormatLocaleString';
import useInputATMFormatter from '../../../hooks/useInputATMFormatter';
import { WalletText } from '../..';
import './ATMAmountInput.scss';

type TProps = {
    currency?: string;
    disabled?: boolean;
    fractionDigits?: number;
    isError?: boolean;
    label: string;
    locale?: Intl.LocalesArgument;
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
    locale,
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
        locale,
        maxDigits,
    });

    useEffect(() => {
        onChange?.(Number(unFormatLocaleString(formattedValue, locale)));
    }, [formattedValue, locale, onChange]);

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
            <WalletText size='sm'>{label}</WalletText>
            <div className='wallets-atm-amount-input__input-container'>
                <WalletText size='lg' weight='bold'>
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
                </WalletText>
            </div>
        </div>
    );
};

export default WalletTransferFormInputField;

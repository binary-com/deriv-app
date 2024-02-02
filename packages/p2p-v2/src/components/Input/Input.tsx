import React, { forwardRef, ReactElement } from 'react';
import clsx from 'clsx';
import { Text, useDevice } from '@deriv-com/ui';
import './Input.scss';

type TInputProps = {
    errorMessage?: string;
    hasError?: boolean;
    leadingIcon?: ReactElement;
    name: string;
    onBlur?: () => void;
    onChange?: () => void;
    placeholder?: string;
    value?: string;
};

const Input = forwardRef<HTMLInputElement, TInputProps>(
    ({ errorMessage, hasError, leadingIcon, name, onBlur, onChange, placeholder, value, ...props }, ref) => {
        const { isMobile } = useDevice();

        return (
            <div className='p2p-v2-input'>
                {leadingIcon && <div className='p2p-v2-input__leading-icon'>{leadingIcon}</div>}
                <input
                    className={clsx('p2p-v2-input__field', {
                        'p2p-v2-input__field--error': hasError,
                    })}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder={placeholder}
                    ref={ref}
                    value={value}
                    {...props}
                />
                {hasError && (
                    <Text className='p2p-v2-input__error' color='error' size={isMobile ? 'sm' : 'xs'}>
                        {errorMessage}
                    </Text>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;

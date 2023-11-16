import React, { ChangeEvent, ComponentProps, CSSProperties, FC, useState } from 'react';
import classNames from 'classnames';
import { FormikErrors } from 'formik';
import HelperMessage, { HelperMessageProps } from './HelperMessage';
import './WalletTextField.scss';

export interface WalletTextFieldProps extends ComponentProps<'input'>, HelperMessageProps {
    defaultValue?: string;
    errorMessage?: FormikErrors<unknown> | FormikErrors<unknown>[] | string[] | string;
    isInvalid?: boolean;
    label?: string;
    maxWidth?: CSSProperties['maxWidth'];
    renderRightIcon?: () => React.ReactNode;
    showMessage?: boolean;
}

const WalletTextField: FC<WalletTextFieldProps> = ({
    defaultValue = '',
    isInvalid = false,
    label,
    maxLength,
    maxWidth = '33rem',
    message,
    name = 'wallet-textfield',
    onChange,
    renderRightIcon,
    showMessage = false,
    ...rest
}) => {
    const [value, setValue] = useState(defaultValue);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange?.(e);
    };

    return (
        <div
            className={classNames('wallets-textfield', {
                'wallets-textfield--error': isInvalid,
            })}
            style={{ maxWidth }}
        >
            <div className='wallets-textfield__box'>
                <input
                    className='wallets-textfield__field'
                    id={name}
                    maxLength={maxLength}
                    onChange={handleChange}
                    placeholder={label}
                    value={value}
                    {...rest}
                />
                {label && (
                    <label className='wallets-textfield__label' htmlFor={name}>
                        {label}
                    </label>
                )}
                {typeof renderRightIcon === 'function' && (
                    <div className='wallets-textfield__icon'>{renderRightIcon()}</div>
                )}
            </div>
            <div className='wallets-textfield__message-container'>
                {showMessage && <HelperMessage inputValue={value} maxLength={maxLength} message={message} />}
            </div>
        </div>
    );
};

WalletTextField.displayName = 'WalletTextField';
export default WalletTextField;

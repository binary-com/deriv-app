import React, { ComponentProps, CSSProperties, FC, PropsWithChildren, ReactElement } from 'react';
import classNames from 'classnames';
import { Loader } from '@deriv-com/ui';
import { TGenericSizes } from '../../../types';
import { WalletText } from '../WalletText';
import './WalletButton.scss';

type TVariant = 'contained' | 'ghost' | 'outlined';
type TColor = 'black' | 'primary-light' | 'primary' | 'white';
type TBorderWidth = Extract<TGenericSizes, 'md' | 'sm'> | 'none';

interface WalletButtonProps {
    ariaLabel?: ComponentProps<'button'>['aria-label'];
    borderWidth?: TBorderWidth;
    color?: TColor;
    disabled?: ComponentProps<'button'>['disabled'];
    icon?: ReactElement;
    isFullWidth?: boolean;
    isLoading?: boolean;
    onClick?: ComponentProps<'button'>['onClick'];
    rounded?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    textSize?: ComponentProps<typeof WalletText>['size'];
    type?: ComponentProps<'button'>['type'];
    variant?: TVariant;
}

const WalletButton: FC<PropsWithChildren<WalletButtonProps>> = ({
    ariaLabel,
    borderWidth = 'sm',
    children,
    color = 'primary',
    disabled = false,
    icon,
    isFullWidth = false,
    isLoading = false,
    onClick,
    rounded = 'sm',
    size = 'md',
    textSize,
    type,
    variant = 'contained',
}) => {
    const isContained = variant === 'contained';

    const buttonClassNames = classNames(
        'wallets-button',
        `wallets-button__size--${size}`,
        `wallets-button__variant--${variant}`,
        `wallets-button__rounded--${rounded}`,
        `wallets-button__border--${borderWidth}`,
        isContained && `wallets-button__color--${color}`,
        isFullWidth && 'wallets-button__full-width'
    );

    type TButtonFontColor = {
        [key in TVariant]: {
            [key in TColor]: string;
        };
    };

    const fontColorMapper: TButtonFontColor = {
        contained: {
            black: 'white',
            primary: 'white',
            'primary-light': 'error',
            white: 'general',
        },
        ghost: {
            black: 'error',
            primary: 'error',
            'primary-light': 'error',
            white: 'error',
        },
        outlined: {
            black: 'general',
            primary: 'general',
            'primary-light': 'general',
            white: 'general',
        },
    };

    const loaderColorMapper: Record<TColor, CSSProperties['color']> = {
        black: '#333333',
        primary: '#FFFFFF',
        'primary-light': '#EC3F3F',
        white: '#85ACB0',
    };

    const buttonFontSizeMapper = {
        lg: 'md',
        md: 'sm',
        sm: 'xs',
    } as const;

    return (
        <button
            aria-label={ariaLabel}
            className={buttonClassNames}
            disabled={disabled || isLoading}
            onClick={onClick}
            type={type}
        >
            {isLoading && (
                <div className='wallets-button__loader'>
                    <Loader color={isContained ? loaderColorMapper[color] : '#85ACB0'} isFullScreen={false} />
                </div>
            )}
            {icon && !isLoading && icon}
            {children && !isLoading && (
                <WalletText
                    align='center'
                    color={fontColorMapper[variant][color]}
                    size={textSize || buttonFontSizeMapper[size] || 'sm'}
                    weight='bold'
                >
                    {children}
                </WalletText>
            )}
        </button>
    );
};

export default WalletButton;

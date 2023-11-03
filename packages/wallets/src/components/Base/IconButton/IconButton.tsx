import React, { ButtonHTMLAttributes, ComponentProps, CSSProperties, forwardRef } from 'react';
import classNames from 'classnames';
import { TGenericSizes } from '../types';
import './IconButton.scss';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    color?: CSSProperties['color'] | 'primary';
    icon: React.ReactNode;
    isRound?: boolean;
    onClick?: ComponentProps<'button'>['onClick'];
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, color = 'primary', disabled, icon, isRound, onClick, size = 'sm', ...rest }, ref) => {
        const iconButtonClassNames = classNames(
            'wallets-icon-button',
            `wallets-icon-button__size--${size}`,
            `wallets-icon-button__color--${color}`,
            `wallets-icon-button__border-radius--${isRound ? 'round' : 'default'}`,
            className
        );

        return (
            <button className={iconButtonClassNames} disabled={disabled} onClick={onClick} ref={ref} {...rest}>
                <div className='wallets-icon-button__icon'>{icon}</div>
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';
export default IconButton;

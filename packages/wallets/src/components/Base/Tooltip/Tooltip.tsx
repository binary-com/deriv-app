import React from 'react';
import classNames from 'classnames';
import './Tooltip.scss';

type TProps = {
    alignment?: 'bottom' | 'left' | 'right' | 'top';
    className?: string;
    isVisible: boolean;
    message: string;
};

const Tooltip: React.FC<React.PropsWithChildren<TProps>> = ({
    alignment = 'left',
    children,
    className,
    isVisible,
    message,
}) => {
    return (
        <div className='wallets-tooltip'>
            {children}
            {isVisible && (
                <div
                    className={classNames(
                        'wallets-tooltip__content',
                        `wallets-tooltip__content--${alignment}`,
                        className
                    )}
                    data-testid='dt_tooltip_content'
                >
                    <div className={classNames('wallets-tooltip__arrow', `wallets-tooltip__arrow--${alignment}`)} />
                    <div className='wallets-tooltip__message'>{message}</div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;

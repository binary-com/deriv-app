import * as React from 'react';
import classNames from 'classnames';
import { Button as CButton } from '@deriv/components';

const Button: React.FC<IButtonProps> = ({ className, children, onClick, ...props }) => {
    return (
        <CButton className={classNames('dw-btn', className)} onClick={onClick} {...props}>
            {children}
        </CButton>
    );
};

interface IButtonProps {
    className?: string;
    large?: boolean;
    primary?: boolean;
    tertiary?: boolean;
    children: React.ComponentType | React.ElementType | React.ReactElement;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default Button;

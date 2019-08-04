import classNames from 'classnames';
import React      from 'react';

const UnderlyingIconComponent = ({ market }) => (
    <div
        className={classNames(
            'icons-underlying',
            `icons-underlying__ic-${market ? market.toUpperCase() : 'unknown'}`
        )}
    />
);
export const UnderlyingIcon = React.memo(UnderlyingIconComponent);

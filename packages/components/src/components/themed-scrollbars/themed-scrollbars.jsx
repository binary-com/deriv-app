import classNames from 'classnames';
import React from 'react';
import { useHover } from '../../hooks/use-hover';

const ThemedScrollbars = ({
    children,
    className,
    height,
    width,
    autohide = true,
    is_bypassed,
    is_only_horizontal,
    is_only_horizontal_overlay,
    has_horizontal,
    onScroll,
    refSetter,
}) => {
    if (is_bypassed) return children;
    const [hoverRef, isHovered] = useHover(refSetter);
    return (
        <div
            ref={hoverRef}
            className={classNames('dc-themed-scrollbars', className, {
                'dc-themed-scrollbars__autohide': autohide,
                'dc-themed-scrollbars__autohide--is-hovered': autohide && isHovered,
                'dc-themed-scrollbars--has-horizontal': has_horizontal,
                'dc-themed-scrollbars--only-horizontal': is_only_horizontal,
                'dc-themed-scrollbars--only-horizontal-overlay': is_only_horizontal_overlay,
            })}
            style={{
                maxHeight: height || '100%',
                maxWidth: width || 'none',
            }}
            onScroll={onScroll}
        >
            {children}
        </div>
    );
};

export default ThemedScrollbars;

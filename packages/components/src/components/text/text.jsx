import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { isEmptyObject } from '@deriv/shared';

const Text = ({ children, size, color, align, weight, line_height, as, className, styles, ...props }) => {
    const [style, setStyle] = React.useState({});
    React.useEffect(() => {
        const class_styles = {
            '--text-size': `var(--text-size-${size || 's'})`,
            '--text-color': `var(--text-${color || 'general'})`,
            '--text-lh': `var(--text-lh-${line_height || 'm'})`,
            '--text-weight': `var(--text-weight-${weight || 'normal'})`,
        };
        if (!isEmptyObject(styles)) {
            const combined_style = { ...class_styles, ...styles };
            setStyle(combined_style);
        }
        setStyle(class_styles);
    }, [size, color, line_height, weight]);

    const text_align = align || 'start';
    const class_names = classNames(
        'dc-text',
        {
            [`dc-text--${text_align}`]: !!text_align,
        },
        className
    );
    return (
        (as === 'p' && (
            <p {...props} className={class_names} style={style}>
                {children}
            </p>
        )) || (
            <span {...props} className={class_names} style={style}>
                {children}
            </span>
        )
    );
};

Text.propTypes = {
    line_height: PropTypes.string,
    size: PropTypes.string,
};

export default Text;

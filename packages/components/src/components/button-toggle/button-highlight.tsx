import React from 'react';

type THighlightProps = {
    has_rounded_button: boolean;
    highlight_color?: string;
    left: number;
    width: number | string;
    default_offset: number;
};

const Highlight = ({
    has_rounded_button,
    highlight_color = 'var(--button-toggle-secondary)',
    left,
    width,
    default_offset,
}: THighlightProps) => {
    const border_radius_size = '4px';
    const highlight_style = {
        backgroundColor: highlight_color,
        left: 0,
        transform: `translate3d(${left}px, 0, 0)`,
        width,
        borderRadius: '0',
    };

    if (has_rounded_button) {
        highlight_style.borderRadius = '4px';
    } else {
        Object.assign(highlight_style, {
            borderTopLeftRadius: left === default_offset ? border_radius_size : 0,
            borderTopRightRadius: left === default_offset ? 0 : border_radius_size,
            borderBottomLeftRadius: left === default_offset ? border_radius_size : 0,
            borderBottomRightRadius: left === default_offset ? 0 : border_radius_size,
        });
    }

    return (
        <span
            data-testid={`dt_highlight${has_rounded_button ? '_rounded' : ''}`}
            style={highlight_style}
            className='dc-button-menu--highlight'
        />
    );
};

export { Highlight };

import React from 'react';
import classNames from 'classnames';
import { isMobileOrTablet } from '@deriv/shared';
import Text from '../text';

type TBadgeSize = 'medium' | 'large';
type TWeight = 'bold' | 'normal';
type TBackgroundColor = 'blue' | 'orange' | 'red' | 'gray';
type TRoundedCorners = 4 | 2;

interface Badge extends React.HTMLAttributes<HTMLSpanElement> {
    className?: string;
    custom_color?: string;
    label: string;
    rounded_corners?: TRoundedCorners;
    size?: TBadgeSize;
    weight?: TWeight;
}

interface BadgeContained extends Badge {
    type: 'contained';
    background_color: TBackgroundColor;
}

interface BadgeBordered extends Badge {
    type: 'bordered';
}

type BadgeProps = BadgeContained | BadgeBordered;

const Badge = (props: BadgeProps) => {
    const {
        className,
        custom_color,
        label,
        rounded_corners = 4,
        size = 'medium',
        type,
        weight = 'bold',
        ...rest
    } = props;

    const is_contained = type === 'contained';
    const is_bordered = type === 'bordered';

    const badge_height = React.useMemo(() => {
        switch (size) {
            case 'large':
                return {
                    height: isMobileOrTablet() ? '1.6rem' : '2.2rem',
                    paddingInline: '0.8rem',
                };
            case 'medium':
            default:
                return {
                    height: isMobileOrTablet() ? '1.2rem' : '1.4rem',
                    paddingInline: '0.4rem',
                };
        }
    }, [size]);

    const badge_class_names = React.useMemo(() => {
        return classNames(
            'dc-badge',
            {
                'dc-badge--contained': is_contained,
                'dc-badge--bordered': is_bordered,
                'dc-badge--blue': is_contained && props.background_color === 'blue',
                'dc-badge--orange': is_contained && props.background_color === 'orange',
                'dc-badge--red': is_contained && props.background_color === 'red',
                'dc-badge--gray': is_contained && props.background_color === 'gray',
                'dc-badge--full-rounded': rounded_corners === 4,
                'dc-badge--two-rounded': rounded_corners === 2,
            },
            className
        );
    }, [className, is_bordered, is_contained, is_contained && props.background_color, rounded_corners]);

    if (!label) return null;

    return (
        <Text
            as='span'
            className={badge_class_names}
            color={custom_color}
            size={isMobileOrTablet() ? 'xxxxs' : 'xxxs'}
            styles={badge_height}
            weight={weight}
            {...rest}
        >
            {label}
        </Text>
    );
};

export default Badge;

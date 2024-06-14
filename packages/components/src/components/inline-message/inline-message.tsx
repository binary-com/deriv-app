import React from 'react';
import { isMobileOrTablet } from '@deriv/shared';
import Icon from '../icon/icon';
import Text from '../text';
import './inline-message.scss';

const type_icon_mapper = {
    warning: 'IcAlertWarning',
    information: 'IcAlertInfo',
    announcement: 'IcAlertAnnounce',
    error: 'IcAlertDanger',
};

const size_to_font_size_mapper = {
    xs: isMobileOrTablet() ? 'xxxxs' : 'xxxs',
    sm: isMobileOrTablet() ? 'xxxs' : 'xxs',
    md: isMobileOrTablet() ? 'xxs' : 'xs',
    lg: isMobileOrTablet() ? 'xs' : 's',
};

type TProps = {
    type?: keyof typeof type_icon_mapper;
    size?: 'xs' | 'sm' | 'md' | 'lg';
} & RequireAtLeastOne<{ title: React.ReactNode; message: React.ReactNode; children: React.ReactNode }>;

const InlineMessage: React.FC<React.PropsWithChildren<TProps>> = ({
    type = 'warning',
    size = 'xs',
    title,
    message,
    children,
}) => {
    const icon = type_icon_mapper[type];
    const icon_size = size === 'lg' && !isMobileOrTablet() ? 24 : 16;
    const font_size = size_to_font_size_mapper[size];

    return (
        <div className={`inline-message inline-message__${type} inline-message__${size} `}>
            <Icon size={icon_size} icon={icon} className={`inline-message__icon__${size}`} />
            <Text size={font_size} className={`inline-message__messages inline-message__messages__${size}`}>
                {title && <strong>{title}</strong>}
                {message && <span>{message}</span>}
                {children}
            </Text>
        </div>
    );
};

export default InlineMessage;

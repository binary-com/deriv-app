import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { isMobileOrTablet } from '@deriv/shared';
import { Button, Icon, Text } from '@deriv/components';

const NotificationBanner = ({
    className,
    header,
    message,
    primary_btn,
    secondary_btn,
    img_src,
    img_alt,
    onClose,
    icon,
}) => (
    <div
        className={classNames('notification-banner', {
            [`notification-banner__${className}`]: className,
        })}
        data-testid='dt_notification_banner'
    >
        <div className='notification-banner--left'>
            <Text as='h4' size={isMobileOrTablet() ? 'xs' : 's'} weight='bold' className='notification-banner__title'>
                {header}
            </Text>
            <Text
                as='p'
                size={isMobileOrTablet() ? 'xxs' : 'xs'}
                className='notification-banner__description'
                line_height='xs'
            >
                {message}
            </Text>
            {!!primary_btn && (
                <div className='notification-banner__btn-wrapper'>
                    <Button className='notification-banner__btn' primary small onClick={primary_btn.onClick}>
                        {primary_btn.text}
                    </Button>
                </div>
            )}
            {!!secondary_btn && (
                <div className='notification-banner__btn-wrapper'>
                    <Button className='notification-banner__btn' secondary small onClick={secondary_btn.onClick}>
                        {secondary_btn.text}
                    </Button>
                </div>
            )}
        </div>
        <div className='notification-banner--right'>
            <div className='notification-banner__bg' />
            <img className='notification-banner__img' src={img_src} alt={img_alt} />
            <Icon className='notification-banner__close-icon' icon={icon ?? 'IcCloseLight'} onClick={onClose} />
        </div>
    </div>
);

NotificationBanner.propTypes = {
    className: PropTypes.string,
    secondary_btn: PropTypes.object,
    header: PropTypes.string,
    img_alt: PropTypes.string,
    img_src: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    primary_btn: PropTypes.shape({
        text: PropTypes.string,
        onClick: PropTypes.func,
    }),
    icon: PropTypes.string,
};

export default NotificationBanner;

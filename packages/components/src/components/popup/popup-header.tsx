import * as React from 'react';
import { isDesktop, isMobileOrTablet } from '@deriv/shared';
import PopupContext from './popup-context';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';
import Money from '../money';

const PopupHeader = () => {
    const {
        balance,
        close_icon_color,
        currency,
        header_big_text,
        header_banner_text,
        header_button_text,
        header_content_color,
        header_icon,
        onHeaderButtonClick,
        title,
        togglePopupModal,
    } = React.useContext(PopupContext);

    return (
        <div className='dc-popup__header'>
            <div className='dc-popup__header-content'>
                <div className='dc-popup__header-container'>
                    <div className='dc-popup__header-container-left'>
                        <div className='dc-popup__header-title-container'>
                            <div className='dc-popup__header-title'>
                                <Text
                                    size='s'
                                    styles={{ color: header_content_color, display: 'flex', alignItems: 'center' }}
                                >
                                    {title}
                                </Text>
                            </div>
                            {header_banner_text && isMobileOrTablet() && (
                                <div className='dc-popup__header-banner'>
                                    <Text size='xxxxs' line_height='m' color='prominent'>
                                        {header_banner_text}
                                    </Text>
                                </div>
                            )}
                        </div>
                        <div className='dc-popup__header-balance'>
                            <Text size='m' weight='bold' styles={{ color: header_content_color }}>
                                <Money amount={balance} currency={currency} show_currency />
                            </Text>
                            {header_button_text && (
                                <Button
                                    primary
                                    is_circle={isMobileOrTablet()}
                                    is_circular={isDesktop()}
                                    className='dc-popup__header-button'
                                    icon={<Icon icon='IcPlay' size={10} color='active' />}
                                    onClick={onHeaderButtonClick}
                                    text={isDesktop() ? header_button_text : ''}
                                />
                            )}
                        </div>
                    </div>
                    {header_icon && (
                        <div className='dc-popup__header-container-right'>
                            <Icon icon={header_icon} size={40} className='dc-popup__header-icon' />
                        </div>
                    )}
                </div>
                {header_banner_text && isDesktop() && (
                    <div className='dc-popup__header-container'>
                        <div className='dc-popup__header-banner'>
                            <Text size='xxxs' line_height='s' weight='bold' color='prominent'>
                                {header_banner_text}
                            </Text>
                        </div>
                    </div>
                )}
                {header_big_text && (
                    <div className='dc-popup__header-container'>
                        <div className='dc-popup__header-container-left'>
                            <Text
                                as='h3'
                                className='dc-popup__header-big-text'
                                color='prominent'
                                size='l'
                                line_height='xs'
                                weight='bold'
                            >
                                {header_big_text}
                            </Text>
                        </div>
                    </div>
                )}
            </div>
            <div className='dc-popup__header-close'>
                <Icon
                    icon='IcCross'
                    className='dc-popup__header-close-icon'
                    color={close_icon_color}
                    onClick={togglePopupModal}
                />
            </div>
        </div>
    );
};

export default PopupHeader;

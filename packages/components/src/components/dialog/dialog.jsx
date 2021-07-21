import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { isMobile } from '@deriv/shared';
import Button from '../button/button.jsx';
import Icon from '../icon/icon.jsx';
import Text from '../text';
import { useOnClickOutside } from '../../hooks';

const Dialog = ({
    disableApp,
    dismissable,
    enableApp,
    is_closed_on_cancel,
    is_closed_on_confirm,
    is_visible,
    onCancel,
    onConfirm,
    header_icon,
    ...other_props
}) => {
    const wrapper_ref = React.useRef();
    React.useEffect(() => {
        if (is_visible && !!disableApp) {
            disableApp();
        }
    }, [is_visible, disableApp]);

    const handleCancel = () => {
        if (is_closed_on_cancel && enableApp) {
            enableApp();
        }
        onCancel();
    };

    const handleConfirm = () => {
        if (is_closed_on_confirm && enableApp) {
            enableApp();
        }
        onConfirm();
    };

    const validateClickOutside = () => dismissable || (has_close_icon && is_visible && is_closed_on_cancel);

    useOnClickOutside(wrapper_ref, onCancel ? handleCancel : handleConfirm, validateClickOutside);

    const {
        cancel_button_text,
        className,
        children,
        confirm_button_text,
        is_loading,
        is_mobile_full_width = true,
        is_content_centered,
        portal_element_id,
        title,
        has_close_icon,
    } = other_props;

    const content_classes = classNames('dc-dialog__content', {
        'dc-dialog__content--centered': is_content_centered,
    });

    const is_text = typeof children === 'string' || typeof children?.props?.i18n_default_text === 'string';
    const dialog = (
        <CSSTransition
            appear
            in={is_visible && !is_loading}
            timeout={50}
            classNames={{
                appear: 'dc-dialog__wrapper--enter',
                enter: 'dc-dialog__wrapper--enter',
                enterDone: 'dc-dialog__wrapper--enter-done',
                exit: 'dc-dialog__wrapper--exit',
            }}
            unmountOnExit
        >
            <div
                className={classNames('dc-dialog__wrapper', className, {
                    'dc-dialog__wrapper--has-portal': !!portal_element_id,
                    'dc-dialog__wrapper--has-icon': header_icon,
                })}
            >
                <div
                    className={classNames('dc-dialog__dialog', {
                        'dc-dialog__dialog--has-margin': !is_mobile_full_width,
                        'dc-dialog__dialog--no-padding': header_icon,
                    })}
                    ref={wrapper_ref}
                >
                    {header_icon && title ? (
                        <div className='dc-dialog__header-wrapper__centered'>
                            <Icon
                                className='dc-dialog__header-verification-icon'
                                icon={header_icon}
                                size={isMobile() ? 30 : 35}
                            />
                            <Text
                                as='h1'
                                align='center'
                                color='prominent'
                                weight='bold'
                                className='dc-dialog__header'
                                size={isMobile() ? 'xs' : 'sm'}
                            >
                                {title}
                            </Text>
                        </div>
                    ) : (
                        <div className='dc-dialog__header-wrapper'>
                            {!!title && (
                                <Text as='h1' color='prominent' weight='bold' className='dc-dialog__header'>
                                    {title}
                                </Text>
                            )}
                            {has_close_icon && (
                                <div
                                    onClick={onCancel ? handleCancel : handleConfirm}
                                    className='dc-dialog__header--close'
                                >
                                    <Icon icon='IcCross' />
                                </div>
                            )}
                        </div>
                    )}
                    {is_text ? (
                        <Text as='p' size='xs' styles={{ lineHeight: '1.43' }} className={content_classes}>
                            {children}
                        </Text>
                    ) : (
                        <div className={content_classes}>{children}</div>
                    )}
                    <div className='dc-dialog__footer'>
                        {!!onCancel && (
                            <Button
                                className='dc-dialog__button'
                                has_effect
                                text={cancel_button_text}
                                onClick={handleCancel}
                                secondary
                                large
                            />
                        )}
                        {!!confirm_button_text && (
                            <Button
                                className='dc-dialog__button'
                                has_effect
                                text={confirm_button_text}
                                onClick={handleConfirm}
                                primary
                                large
                            />
                        )}
                    </div>
                </div>
            </div>
        </CSSTransition>
    );

    if (portal_element_id) {
        return ReactDOM.createPortal(dialog, document.getElementById(portal_element_id));
    }

    return dialog;
};

Dialog.defaultProps = {
    is_closed_on_cancel: true,
    is_closed_on_confirm: true,
    header_icon: false,
};

Dialog.propTypes = {
    cancel_button_text: PropTypes.string,
    confirm_button_text: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    has_close_icon: PropTypes.bool,
    header_icon: PropTypes.string,
    is_closed_on_cancel: PropTypes.bool,
    is_closed_on_confirm: PropTypes.bool,
    is_content_centered: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_mobile_full_width: PropTypes.bool,
    is_visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    portal_element_id: PropTypes.string,
    title: PropTypes.string,
};

export default Dialog;

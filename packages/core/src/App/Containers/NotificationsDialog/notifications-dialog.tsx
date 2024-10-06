import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { MobileDialog, useOnClickOutside } from '@deriv/components';
import { Analytics } from '@deriv-com/analytics';
import { LocalStore } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import NotificationListWrapper from './notification-list-wrapper';

const NotificationsDialog = observer(() => {
    const { client, notifications } = useStore();
    const { loginid } = client;
    const {
        is_notifications_visible,
        notifications: notifications_array,
        removeNotifications,
        removeNotificationMessage,
        removeNotificationMessageByKey,
        toggleNotificationsModal,
    } = notifications;

    const wrapper_ref = React.useRef<HTMLDivElement>(null);
    const [is_outside, setIsOutside] = React.useState(false);
    const { isMobile } = useDevice();

    const handleClickOutside = (event: MouseEvent) => {
        const notifications_toggle_btn = !(event?.target as Element)?.classList.contains(
            'notifications-toggle__icon-wrapper'
        );
        if (
            !wrapper_ref?.current?.contains(event.target as Node) &&
            is_notifications_visible &&
            notifications_toggle_btn
        ) {
            toggleNotificationsModal();
        }
    };

    const clearNotifications = () => {
        const p2p_settings = LocalStore.getObject('p2p_settings');
        if (loginid && p2p_settings[loginid]) {
            p2p_settings[loginid].is_notifications_visible = false;
        }
        LocalStore.setObject('p2p_settings', p2p_settings);

        Analytics.trackEvent('ce_notification_form', {
            action: 'clear_all',
            form_name: 'ce_notification_form',
            notification_num: notifications_array.length,
        });

        notifications_array.forEach(({ key, should_show_again }) => {
            removeNotificationMessageByKey({ key });
            removeNotificationMessage({
                key,
                should_show_again,
            });
            removeNotifications(true);
        });
    };

    useOnClickOutside(wrapper_ref, handleClickOutside);

    React.useEffect(() => {
        const should_check_position = !isMobile && is_notifications_visible && wrapper_ref.current;

        if (should_check_position) {
            const { right } = wrapper_ref.current.getBoundingClientRect();
            setIsOutside(right > window.innerWidth);
        }
    }, [isMobile, is_notifications_visible]);

    if (isMobile) {
        return (
            <MobileDialog
                portal_element_id='modal_root'
                title={<Localize i18n_default_text='Notifications' />}
                wrapper_classname='notifications-mobile-dialog'
                visible={is_notifications_visible}
                onClose={toggleNotificationsModal}
            >
                <NotificationListWrapper clearNotifications={clearNotifications} ref={wrapper_ref} />
            </MobileDialog>
        );
    }

    return (
        <CSSTransition
            in={is_notifications_visible}
            classNames={{
                enter: 'notifications-dialog--enter',
                enterDone: 'notifications-dialog--enter-done',
                exit: 'notifications-dialog--exit',
            }}
            timeout={150}
            onExited={() => setIsOutside(false)}
            unmountOnExit
        >
            <NotificationListWrapper
                clearNotifications={clearNotifications}
                is_outside={is_outside}
                ref={wrapper_ref}
            />
        </CSSTransition>
    );
});

export default NotificationsDialog;

import classNames from 'classnames';
import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { isEmptyObject, toTitleCase } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Analytics } from '@deriv-com/analytics';
import { BinaryLink } from 'App/Components/Routes';
import EmptyNotification from 'App/Components/Elements/Notifications/empty-notification';

type TActionProps = ReturnType<typeof useStore>['notifications']['notifications'][0]['action'];
type TNotificationMessage = ReturnType<typeof useStore>['notifications']['notifications'][0];

const NotificationsList = observer(() => {
    const { notifications } = useStore();
    const { notifications: notifications_array, toggleNotificationsModal } = notifications;

    const getNotificationItemIcon = (item: TNotificationMessage) => {
        const { type } = item;
        if (['contract_sold', 'info', 'news', 'promotions'].includes(type)) {
            return 'IcAlertInfo';
        } else if (type === 'p2p_completed_order') {
            return 'IcAlertAnnounce';
        }
        return `IcAlert${toTitleCase(type)}`;
    };

    const getButtonSettings = (item: TNotificationMessage): TActionProps | undefined => {
        const object_key = ['action', 'secondary_btn', 'cta_btn', 'primary_btn'].find(
            obj_key => !isEmptyObject(item[obj_key as keyof TNotificationMessage])
        );
        switch (object_key) {
            case 'primary_btn':
                return item.primary_btn;
            case 'cta_btn':
                return item.cta_btn;
            case 'secondary_btn':
                return item.secondary_btn;
            case 'action':
                return item.action;
            default:
                return undefined;
        }
    };

    const onActionTrackEvent = (key: string) => {
        Analytics.trackEvent('ce_notification_form', {
            action: 'click_cta',
            form_name: 'ce_notification_form',
            notification_key: key,
        });
    };
    const filtered_notifications = notifications_array.filter(item => !item.only_toast_message);
    return (
        <React.Fragment>
            {filtered_notifications.length > 0 ? (
                filtered_notifications.map(item => (
                    <div className='notifications-item' key={item.key}>
                        <Text as='h2' className='notifications-item__title' weight='bold' size='xs' color='prominent'>
                            {item.type && (
                                <Icon
                                    icon={getNotificationItemIcon(item)}
                                    className={classNames('notifications-item__title-icon', {
                                        [`notifications-item__title-icon--${item.type}`]: item.type,
                                    })}
                                />
                            )}
                            {item.header}
                        </Text>
                        <div className='notifications-item__message'>{item.message}</div>
                        <div className='notifications-item__action'>
                            {!!getButtonSettings(item) && (
                                <React.Fragment>
                                    {getButtonSettings(item)?.route ? (
                                        <BinaryLink
                                            onClick={() => {
                                                const buttonSettings = getButtonSettings(item);
                                                if (buttonSettings?.onClick) {
                                                    buttonSettings.onClick();
                                                }
                                                toggleNotificationsModal();
                                                onActionTrackEvent(item.key);
                                            }}
                                            active_class='notifications-item'
                                            className={classNames(
                                                'dc-btn',
                                                'dc-btn--secondary',
                                                'notifications-item__cta-button'
                                            )}
                                            to={getButtonSettings(item)?.route}
                                        >
                                            <Text weight='bold' size='xxs'>
                                                {getButtonSettings(item)?.text}
                                            </Text>
                                        </BinaryLink>
                                    ) : (
                                        <Button
                                            className={classNames(
                                                'dc-btn--secondary',
                                                'notifications-item__cta-button'
                                            )}
                                            onClick={() => {
                                                getButtonSettings(item)?.onClick();
                                                onActionTrackEvent(item.key);
                                            }}
                                        >
                                            <Text weight='bold' size='xxs'>
                                                {getButtonSettings(item)?.text}
                                            </Text>
                                        </Button>
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <EmptyNotification />
            )}
        </React.Fragment>
    );
});

export default NotificationsList;

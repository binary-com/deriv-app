import React from 'react';
import classNames from 'classnames';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

type TNotificationsClearAllFooter = {
    clearNotifications: () => void;
};

const NotificationsClearAllFooter = observer(({ clearNotifications }: TNotificationsClearAllFooter) => {
    const { notifications, ui } = useStore();
    const { is_notifications_empty } = notifications;
    const { is_mobile_or_tablet } = ui;

    return (
        <React.Fragment>
            <div className='notifications-dialog__separator' />
            <div
                data-testid='dt_clear_all_footer_button'
                className={classNames('notifications-dialog__footer', {
                    'notifications-dialog__content--empty': is_notifications_empty,
                    'notifications-dialog__content--sticky': is_mobile_or_tablet,
                })}
            >
                <Button
                    className={classNames('dc-btn--secondary', 'notifications-dialog__clear')}
                    disabled={is_notifications_empty}
                    onClick={clearNotifications}
                >
                    <Text size='xxs' color='prominent' weight='bold'>
                        <Localize i18n_default_text='Clear All' />
                    </Text>
                </Button>
            </div>
        </React.Fragment>
    );
});

export default NotificationsClearAllFooter;

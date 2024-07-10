import { platform_name } from '@deriv-app/shared';
import { TNotificationMessage } from '@deriv-app/stores/types';
import { localize } from '@deriv-app/translations';

export const switch_account_notification = {
    key: 'bot_switch_account',
    header: localize('You have switched accounts.'),
    message: localize(
        'Our system will finish any Deriv Bot trades that are running, and Deriv Bot will not place any new trades.'
    ),
    type: 'warning',
    is_persistent: true,
};

export const journalError = (onClick: () => void): TNotificationMessage => {
    return {
        key: 'bot_error',
        header: localize('The bot encountered an error while running.'),
        action: {
            text: localize('View in Journal'),
            onClick,
        },
        type: 'danger',
        platform: platform_name.DBot,
        is_disposable: true,
    };
};

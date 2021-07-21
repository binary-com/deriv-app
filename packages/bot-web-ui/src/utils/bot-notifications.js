import { localize } from '@deriv/translations';
import { platform_name } from '@deriv/shared';

export const switch_account_notification = {
    key: 'bot_switch_account',
    header: localize('You have switched accounts.'),
    message: localize(
        'Our system will finish any DBot trades that are running, and DBot will not place any new trades.'
    ),
    type: 'warning',
    variant: 'account',
    is_persistent: true,
};

export const journalError = onClick => {
    return {
        key: 'bot_error',
        header: localize('The bot encountered an error while running.'),
        action: {
            text: localize('View in Journal'),
            onClick,
        },
        type: 'danger',
        variant: 'account',
        platform: [platform_name.DBot],
        is_disposable: true,
    };
};

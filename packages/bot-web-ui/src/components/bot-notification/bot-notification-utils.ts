import { toast, ToastPosition, TypeOptions } from 'react-toastify';
import { localize } from '@deriv/translations';

export type TNotificationContent = {
    message: string;
    primary_action?: TAction;
};

export type TAction = {
    label: string;
    onClick: () => void;
};

export type TNotificationStyle = {
    type: TypeOptions;
    position: ToastPosition;
    autoClose: number;
    hideProgressBar: boolean;
    closeOnClick: boolean;
    pauseOnHover: boolean;
    pauseOnFocusLoss?: boolean;
};

export enum NOTIFICATION_TYPE {
    BOT_IMPORT = 'BOT_IMPORT',
    BOT_DELETE = 'BOT_DELETE',
}

export const notification_message = {
    bot_stop: localize('You’ve just stopped the bot. Any open contracts can be viewed on the Reports page.'),
    workspace_change: localize('Changes you make will not affect your running bot.'),
    [NOTIFICATION_TYPE.BOT_IMPORT]: localize('You’ve successfully imported a bot.'),
    [NOTIFICATION_TYPE.BOT_DELETE]: localize('You’ve successfully deleted a bot.'),
};

export const notification_style = {
    type: toast.TYPE.DEFAULT,
    position: toast.POSITION.BOTTOM_LEFT,
    autoClose: 6000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    pauseOnFocusLoss: false,
};

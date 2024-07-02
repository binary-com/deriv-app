import { toast, ToastPosition, TypeOptions } from 'react-toastify';
import { isDbotRTL } from '@deriv/bot-skeleton/src/utils/workspace';
import { localize } from '@deriv/translations';

const getToastPosition = () => {
    const is_RTL = isDbotRTL();
    if (is_RTL) return toast.POSITION.BOTTOM_RIGHT;
    return toast.POSITION.BOTTOM_LEFT;
};

export type TNotificationContent = {
    message: string;
    primary_action?: TAction;
    closeToast?: () => void;
};

export type TAction = {
    label: string;
    onClick: (closeToast?: () => void) => void;
};

export type TNotificationStyle = {
    type: TypeOptions;
    position: ToastPosition;
    autoClose: number;
    hideProgressBar: boolean;
    closeOnClick: boolean;
    pauseOnHover: boolean;
    pauseOnFocusLoss: boolean;
    closeButton: boolean;
};

export enum NOTIFICATION_TYPE {
    BOT_IMPORT = 'BOT_IMPORT',
    BOT_DELETE = 'BOT_DELETE',
}

export const notification_message = {
    bot_stop: localize('You’ve just stopped the bot. Any open contracts can be viewed on the Reports page.'),
    workspace_change: localize('Changes you make will not affect your running bot.'),
    block_delete: localize('You’ve just deleted a block.'),
    [NOTIFICATION_TYPE.BOT_IMPORT]: localize('You’ve successfully imported a bot.'),
    [NOTIFICATION_TYPE.BOT_DELETE]: localize('You’ve successfully deleted a bot.'),
    strategy_conversion: localize('Save this strategy as an XML file from Deriv Bot for faster re-imports.'),
};

export const notification_style = {
    type: toast.TYPE.DEFAULT,
    position: getToastPosition(),
    autoClose: 6000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    pauseOnFocusLoss: false,
};

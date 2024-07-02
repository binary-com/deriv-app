import { TFormValues } from '../pages/bot-builder/quick-strategy/types';

export const form_name = 'ce_bot_form';
export const STORED_ITEM_NOT_FOUND = 'No results found';

export enum ACTION {
    OPEN = 'open',
    CLOSE = 'close',
    RUN_BOT = 'run_bot',
    RUN_QUICK_STRATEGY = 'run_quick_strategy',
    EDIT_QUICK_STRATEGY = 'edit_quick_strategy',
    SELECT_QUICK_STRATEGY_GUIDE = 'select_quick_strategy_guide',
    SWITCH_QUICK_STRATEGY_TAB = 'switch_quick_strategy_tab',
    DASHBOARD_CLICK = 'dashboard_click',
    UPLOAD_STRATEGY_START = 'upload_strategy_start',
    UPLOAD_STRATEGY_COMPLETED = 'upload_strategy_completed',
    UPLOAD_STRATEGY_FAILED = 'upload_strategy_failed',
    GOOGLE_DRIVE_CONNECT = 'google_drive_connect',
    GOOGLE_DRIVE_DISCONNECT = 'google_drive_disconnect',
    SWITCH_LOAD_STRATEGY_TAB = 'switch_load_strategy_tab',
}

export type TFormStrategy = {
    form_values: TFormValues;
} & TSelectedStrategy;

export type TSelectedStrategy = {
    selected_strategy: string;
};

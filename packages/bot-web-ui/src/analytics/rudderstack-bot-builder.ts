import { Analytics, TEvents } from '@deriv-com/analytics';
import { ACTION, form_name } from './constants';
import { getSubpageName } from './utils';

export const rudderStackSendSwitchLoadStrategyTabEvent = ({ load_strategy_tab }: TEvents['ce_bot_form']) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.SWITCH_LOAD_STRATEGY_TAB,
        form_name,
        load_strategy_tab,
        subform_name: 'load_strategy',
    });
};

export const rudderStackSendUploadStrategyStartEvent = ({ upload_provider }: TEvents['ce_bot_form']) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.UPLOAD_STRATEGY_START,
        form_name,
        subform_name: 'load_strategy',
        subpage_name: getSubpageName(),
        upload_provider,
    });
};

export const rudderStackSendUploadStrategyCompletedEvent = ({ upload_provider }: TEvents['ce_bot_form']) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.UPLOAD_STRATEGY_COMPLETED,
        form_name,
        subform_name: 'load_strategy',
        subpage_name: getSubpageName(),
        upload_provider,
    });
};

export const rudderStackSendGoogleDriveConnectEvent = () => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.GOOGLEDRIVE_CONNECT,
        form_name,
        subpage_name: getSubpageName(),
    });
};

export const rudderStackSendGoogleDriveDisconnectEvent = () => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.GOOGLEDRIVE_DISCONNECT,
        form_name,
        subpage_name: getSubpageName(),
    });
};

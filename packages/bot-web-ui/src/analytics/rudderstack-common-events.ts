import { Analytics, TEvents } from '@deriv-com/analytics';
import { ACTION, form_name, TFormStrategy } from './constants';
import { getRsStrategyType, getSubpageName } from './utils';

export const rudderStackSendOpenEvent = ({ subform_source, subform_name }: TEvents['ce_bot_form']) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.OPEN,
        form_name,
        subpage_name: getSubpageName(),
        subform_name,
        subform_source,
    });
};

export const rudderStackSendCloseEvent = ({
    subform_name,
    quick_strategy_tab,
    selected_strategy,
}: TEvents['ce_bot_form'] & TFormStrategy) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.CLOSE,
        form_name,
        subpage_name: getSubpageName(),
        subform_name,
        quick_strategy_tab,
        strategy_name: getRsStrategyType(selected_strategy),
    });
};

export const rudderStackSendRunBotEvent = () => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.RUN_BOT,
        form_name,
        subpage_name: getSubpageName(),
    });
};

export const rudderStackSendUploadStrategyStartEvent = ({ upload_provider, upload_id }: TEvents['ce_bot_form']) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.UPLOAD_STRATEGY_START,
        form_name,
        subform_name: 'load_strategy',
        subpage_name: getSubpageName(),
        upload_provider,
        upload_id,
    });
};

export const rudderStackSendUploadStrategyCompletedEvent = ({
    upload_provider,
    upload_id,
    upload_type,
}: TEvents['ce_bot_form']) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.UPLOAD_STRATEGY_COMPLETED,
        form_name,
        subform_name: 'load_strategy',
        subpage_name: getSubpageName(),
        upload_provider,
        upload_id,
        upload_type,
    });
};

export const rudderStackSendUploadStrategyFailedEvent = ({
    upload_provider,
    upload_id,
    upload_type,
    error_message,
    error_code,
}: TEvents['ce_bot_form']) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.UPLOAD_STRATEGY_FAILED,
        form_name,
        subform_name: 'load_strategy',
        subpage_name: getSubpageName(),
        upload_provider,
        upload_id,
        upload_type,
        error_message,
        error_code,
    });
};

export const rudderStackSendGoogleDriveConnectEvent = () => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.GOOGLE_DRIVE_CONNECT,
        form_name,
        subpage_name: getSubpageName(),
    });
};

export const rudderStackSendGoogleDriveDisconnectEvent = () => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.GOOGLE_DRIVE_DISCONNECT,
        form_name,
        subpage_name: getSubpageName(),
    });
};

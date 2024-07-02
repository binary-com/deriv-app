import { Analytics, TEvents } from '@deriv-com/analytics';
import { ACTION, form_name } from './constants';

export const rudderStackSendDashboardClickEvent = ({ dashboard_click_name }: TEvents['ce_bot_form']) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.DASHBOARD_CLICK,
        form_name,
        subpage_name: 'dashboard',
        dashboard_click_name,
    });
};

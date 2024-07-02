import { Analytics, TEvents } from '@deriv-com/analytics';
import { ACTION, form_name } from './constants';
import { getSubpageName } from './utils';

export const rudderStackSendSwitchLoadStrategyTabEvent = ({ load_strategy_tab }: TEvents['ce_bot_form']) => {
    Analytics.trackEvent('ce_bot_form', {
        action: ACTION.SWITCH_LOAD_STRATEGY_TAB,
        form_name,
        load_strategy_tab,
        subform_name: 'load_strategy',
        subpage_name: getSubpageName(),
    });
};

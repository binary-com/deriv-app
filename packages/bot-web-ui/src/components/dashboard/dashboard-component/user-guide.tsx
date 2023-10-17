import React from 'react';
import { observer } from 'mobx-react';
import { RudderStack } from '@deriv/analytics';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useStore } from '@deriv/stores';

type TUserGuide = {
    setActiveTab: (param: number) => void;
    setActiveTabTutorial: (active_tab_tutorials: number) => void;
};

const UserGuide = observer(({ setActiveTab, setActiveTabTutorial }: TUserGuide) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const sendToRudderStack = () => {
        RudderStack.track('ce_bot_builder_form', {
            action: 'push_user_guide',
            form_source: 'ce_bot_dashboard_form',
            device_type: is_mobile ? 'mobile' : 'desktop',
        });
    };
    return (
        <div className='tab__dashboard__home__retrigger'>
            <button
                data-testid='btn-user-guide'
                onClick={() => {
                    sendToRudderStack();
                    setActiveTab(DBOT_TABS.TUTORIAL);
                    setActiveTabTutorial(0);
                }}
            >
                <Icon className='tab__dashboard__home__retrigger__icon' icon={'IcDbotUserGuide'} />
                <Text size='xs' line_height='s' className={'tab__dashboard__home__retrigger__text'}>
                    {localize('User Guide')}
                </Text>
            </button>
        </div>
    );
});

export default UserGuide;

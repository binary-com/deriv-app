import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { rudderStackSendDashboardClickEvent } from '../../analytics/rudderstack-dashboard';

type TUserGuide = {
    is_mobile?: boolean;
    handleTabChange: (item: number) => void;
    setActiveTabTutorial: (active_tab: number) => void;
};

const UserGuide: React.FC<TUserGuide> = ({ is_mobile, handleTabChange, setActiveTabTutorial }) => {
    return (
        <div className='user-guide'>
            <button
                className='user-guide__button'
                onClick={() => {
                    handleTabChange(DBOT_TABS.TUTORIAL);
                    setActiveTabTutorial(0);
                    rudderStackSendDashboardClickEvent({ dashboard_click_name: 'user_guide' });
                }}
                data-testid='btn-user-guide'
            >
                <Icon className='user-guide__icon' icon={'IcDbotUserGuide'} />
                {!is_mobile && (
                    <Text size='xs' line_height='s' className='user-guide__label'>
                        {localize('User Guide')}
                    </Text>
                )}
            </button>
        </div>
    );
};

export default UserGuide;

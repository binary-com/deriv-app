import * as React from 'react';
import { Icon, Text } from '@deriv/components';
import Dp2pBlockedChecklist from './dp2p-blocked-checklist.jsx';
import Dp2pBlockedDescription from './dp2p-blocked-description.jsx';
import { Localize } from '../i18next';

const Dp2pBlocked = () => {
    return (
        <div className='dp2p-blocked'>
            <Icon icon='IcCashierDp2pBlocked' size={128} />
            <Text className='dp2p-blocked__title' color='prominent' line_height='m' size='s' weight='bold'>
                <Localize i18n_default_text='Your Deriv P2P cashier is blocked' />
            </Text>
            <Dp2pBlockedDescription />
            <Dp2pBlockedChecklist />
        </div>
    );
};

export default Dp2pBlocked;

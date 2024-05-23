import React from 'react';
import { Popover, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';

type TAccountLimitsExtraInfo = {
    message: string;
    className?: string;
};

const AccountLimitsExtraInfo = ({ message, ...props }: TAccountLimitsExtraInfo) => {
    if (isMobile()) {
        return (
            <Text color='less-prominent' line_height='s' size='xxxs'>
                {message}
            </Text>
        );
    }

    return (
        <Popover
            data_testid='dt_acc_limits_popover'
            alignment='right'
            className='da-account-limits__popover'
            icon='info'
            is_bubble_hover_enabled
            message={message}
            zIndex='9999'
            {...props}
        />
    );
};

export default AccountLimitsExtraInfo;

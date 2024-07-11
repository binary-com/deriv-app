import React from 'react';
import { Text } from '@deriv-lib/components';
import { isMobile } from '@deriv-lib/shared';
import { observer } from '@deriv-lib/stores';
import { getLastOnlineLabel } from 'Utils/adverts';

type TOnlineStatusLabelProps = {
    is_online: 0 | 1;
    last_online_time: number;
    size?: string;
};

const OnlineStatusLabel = ({
    is_online,
    last_online_time,
    size = isMobile() ? 'xxxs' : 'xs',
}: TOnlineStatusLabelProps) => {
    return (
        <Text color='less-prominent' size={size}>
            {getLastOnlineLabel(is_online, last_online_time)}
        </Text>
    );
};

export default observer(OnlineStatusLabel);

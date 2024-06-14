import React from 'react';
import { Text } from '@deriv/components';
import { isMobileOrTablet } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { getLastOnlineLabel } from 'Utils/adverts';

type TOnlineStatusLabelProps = {
    is_online: 0 | 1;
    last_online_time: number;
    size?: string;
};

const OnlineStatusLabel = ({
    is_online,
    last_online_time,
    size = isMobileOrTablet() ? 'xxxs' : 'xs',
}: TOnlineStatusLabelProps) => {
    return (
        <Text color='less-prominent' size={size}>
            {getLastOnlineLabel(is_online, last_online_time)}
        </Text>
    );
};

export default observer(OnlineStatusLabel);

import React from 'react';
import { Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { getLastOnlineLabel } from 'Utils/adverts';

type TOnlineStatusLabelProps = {
    is_online: 0 | 1;
    last_online_time: number;
    size?: string;
};

const OnlineStatusLabel = ({ is_online, last_online_time }: TOnlineStatusLabelProps) => {
    const { isDesktop } = useDevice();

    return (
        <Text color='less-prominent' size={isDesktop ? 'xs' : 'xxxs'}>
            {getLastOnlineLabel(is_online, last_online_time)}
        </Text>
    );
};

export default observer(OnlineStatusLabel);

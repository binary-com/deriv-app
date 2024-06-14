import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { toGMTFormat, toLocalFormat } from '@deriv/shared';
import { Popover } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';

const ServerTime = observer(({ is_mobile_or_tablet }) => {
    const { common } = useStore();
    const { server_time } = common;
    const gmt_time = toGMTFormat(server_time);
    const local_time = toLocalFormat(server_time);
    return (
        <Popover
            alignment='top'
            message={local_time}
            className={classNames('server-time', {
                'server-time--is-mobile': is_mobile_or_tablet,
            })}
            zIndex={9999}
        >
            {gmt_time}
        </Popover>
    );
});

ServerTime.propTypes = {
    is_mobile_or_tablet: PropTypes.bool,
};

export default ServerTime;

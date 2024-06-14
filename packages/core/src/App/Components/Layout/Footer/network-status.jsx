import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

const NetworkStatus = observer(({ is_mobile_or_tablet }) => {
    const { common } = useStore();
    const { network_status: status } = common;

    const network_status_element = (
        <div
            data-testid='dt_network_status_element'
            className={classNames('network-status__circle', {
                'network-status__circle--offline': status.class === 'offline',
                'network-status__circle--online': status.class === 'online',
                'network-status__circle--blinker': status.class === 'blinker',
            })}
        />
    );
    return (
        <div
            data-testid='dt_network_status'
            className={classNames('network-status__wrapper', {
                'network-status__wrapper--is-mobile': is_mobile_or_tablet,
            })}
        >
            {is_mobile_or_tablet ? (
                network_status_element
            ) : (
                <Popover
                    classNameBubble='network-status__tooltip'
                    alignment='top'
                    message={localize('Network status: {{status}}', {
                        status: status.tooltip || localize('Connecting to server'),
                    })}
                >
                    {network_status_element}
                </Popover>
            )}
        </div>
    );
});

NetworkStatus.propTypes = {
    is_mobile_or_tablet: PropTypes.bool,
};

export default NetworkStatus;

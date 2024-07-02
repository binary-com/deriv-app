import React from 'react';
import { Icon, Text, Tooltip } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { getTextSize } from 'Utils/responsive';
import './my-profile-name-business-hours.scss';

const MyProfileNameBusinessHours = () => {
    const { showModal } = useModalManagerContext();

    return (
        <div className='my-profile-name-business-hours'>
            <Tooltip
                alignment='top'
                className='my-profile-name-business-hours__tooltip'
                message={localize('Business hours')}
            >
                <Icon icon='IcClockOutline' />
                <Text
                    className='my-profile-name-business-hours__tooltip-text'
                    line_height='xxs'
                    onClick={() => showModal({ key: 'BusinessHourModal', props: {} })}
                    size={getTextSize('xxxs', 'xs')}
                    weight='bold'
                >
                    <Localize i18n_default_text='Open' />
                </Text>
            </Tooltip>
        </div>
    );
};

export default MyProfileNameBusinessHours;

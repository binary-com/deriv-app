import React from 'react';
import { Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';

const CardWithArrow = ({ onClick, title, description, icon }) => {
    return (
        <div className='manual-poi__card' onClick={onClick}>
            <Icon className='manual-poi__card-icon' icon={icon} size={64} />
            <div className='manual-poi__card-content'>
                <Text as='p' size='xs' weight='bold' color='prominent'>
                    {title}
                </Text>
                <Text as='p' size={isMobile() ? 'xxxs' : 'xxs'}>
                    {description}
                </Text>
            </div>

            <Icon icon='IcChevronRight' size={isMobile() ? 23 : 31} />
        </div>
    );
};

export { CardWithArrow };

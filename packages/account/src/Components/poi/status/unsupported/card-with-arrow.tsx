import React from 'react';
import { Icon, Text } from '@deriv/components';
import { isMobileOrTablet } from '@deriv/shared';

type TCardWithArrow = {
    onClick: () => void;
    title: string;
    description: string;
    icon: string;
};

const CardWithArrow = ({ onClick, title, description, icon }: TCardWithArrow) => {
    return (
        <div className='manual-poi__card' onClick={onClick}>
            <Icon className='manual-poi__card-icon' icon={icon} size={64} />
            <div className='manual-poi__card-content'>
                <Text as='p' size='xs' weight='bold' color='prominent'>
                    {title}
                </Text>
                <Text as='p' size={isMobileOrTablet() ? 'xxxs' : 'xxs'}>
                    {description}
                </Text>
            </div>

            <Icon icon='IcChevronRight' size={isMobileOrTablet() ? 23 : 31} />
        </div>
    );
};

export { CardWithArrow };

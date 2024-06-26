import React from 'react';
import { Icon, Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';

type TCardWithArrow = {
    onClick: () => void;
    title: string;
    description: string;
    icon: string;
};

const CardWithArrow = ({ onClick, title, description, icon }: TCardWithArrow) => {
    const { isDesktop } = useDevice();
    return (
        <div className='manual-poi__card' onClick={onClick}>
            <Icon className='manual-poi__card-icon' icon={icon} size={64} />
            <div className='manual-poi__card-content'>
                <Text as='p' size='xs' weight='bold' color='prominent'>
                    {title}
                </Text>
                <Text as='p' size={isDesktop ? 'xxs' : 'xxxs'}>
                    {description}
                </Text>
            </div>

            <Icon icon='IcChevronRight' size={isDesktop ? 31 : 23} />
        </div>
    );
};

export { CardWithArrow };

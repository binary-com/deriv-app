import React, { ReactNode } from 'react';
import { Text } from '@deriv-com/ui';

type TIconWithMessage = {
    actionButton?: ReactNode;
    children?: ReactNode;
    icon: JSX.Element;
    title: string;
};

export const IconWithMessage = ({ actionButton, children, icon, title }: TIconWithMessage) => (
    <div className='flex flex-col w-full'>
        {icon}
        <div className='grid justify-center gap-16 mt-24 mb-32'>
            <Text align='center' size='md' weight='bold'>
                {title}
            </Text>
            {children}
        </div>
        {actionButton && <div className='flex justify-center'>{actionButton}</div>}
    </div>
);

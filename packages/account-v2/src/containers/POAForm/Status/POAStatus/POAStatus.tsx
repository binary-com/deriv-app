import React, { ReactNode } from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';

type TPOAStatus = {
    actionButton?: ReactNode;
    children?: ReactNode;
    icon: JSX.Element;
    title: string;
};

export const POAStatus = ({ actionButton, children, icon, title }: TPOAStatus) => (
    <div className='grid justify-center w-full justify-items-center mt-4000 gap-1000'>
        {icon}
        <div className='grid justify-center gap-500'>
            <Text align='center' size='md' weight='bold'>
                {title}
            </Text>
            <div className='grid gap-200'>{children}</div>
        </div>
        {actionButton ? <div className='mt-500'>{actionButton}</div> : null}
    </div>
);

import React from 'react';
import { ButtonProps } from '@deriv/quill-design';
import { Button, Text } from '@deriv-com/ui';

type TTradingAccountCardContent = {
    children: string;
    title: string;
};

export const TradingAccountCardContent = ({ children, title }: TTradingAccountCardContent) => (
    <div className='grow'>
        <Text as='p' className='leading-200' size='sm' weight='bold'>
            {title}
        </Text>
        <Text className='w-5/6 leading-100 lg:w-full' size='xs'>
            {children}
        </Text>
    </div>
);

type TTradingAccountCardButton = {
    onSubmit?: ButtonProps['onClick'];
};

export const TradingAccountCardLightButton = ({ onSubmit }: TTradingAccountCardButton) => (
    <Button color='primary-light' onClick={onSubmit}>
        Get
    </Button>
);

import React from 'react';
import { Text } from '@deriv-com/ui';

type TConnectedAppsResponsiveColumn = {
    description: string | null | undefined;
    style?: string;
    title: string;
};

export const ConnectedAppsResponsiveColumn = ({ description, style, title }: TConnectedAppsResponsiveColumn) => (
    <div className={`flex flex-col gap-4 ${style}`}>
        <Text size='sm' weight='bold'>
            {title}
        </Text>
        <Text size='sm'>{description}</Text>
    </div>
);

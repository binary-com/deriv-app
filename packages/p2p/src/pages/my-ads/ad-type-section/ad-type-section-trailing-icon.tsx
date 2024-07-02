import React from 'react';
import { Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';

type TAdTypeSectionTrailingIcon = { label: string };

const AdTypeSectionTrailingIcon = ({ label }: TAdTypeSectionTrailingIcon) => {
    const { isDesktop } = useDevice();

    return (
        <Text color={isDesktop ? 'less-prominent' : 'prominent'} size={isDesktop ? 'xxs' : 's'}>
            {label}
        </Text>
    );
};

export default AdTypeSectionTrailingIcon;

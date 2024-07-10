import React from 'react';
import { Text } from '@deriv-app/components';
import { useStore } from '@deriv-app/stores';

type TAdTypeSectionTrailingIcon = { label: string };

const AdTypeSectionTrailingIcon = ({ label }: TAdTypeSectionTrailingIcon) => {
    const { ui: is_desktop } = useStore();

    return (
        <Text color={is_desktop ? 'less-prominent' : 'prominent'} size={is_desktop ? 'xxs' : 's'}>
            {label}
        </Text>
    );
};

export default AdTypeSectionTrailingIcon;

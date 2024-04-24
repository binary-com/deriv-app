import React from 'react';
import { Text } from '@deriv/components';
import { useStore } from '@deriv/stores';

type TCopyAdvertFormTrailingIcon = { label: string };

const CopyAdvertFormTrailingIcon = ({ label }: TCopyAdvertFormTrailingIcon) => {
    const { ui: is_desktop } = useStore();

    return (
        <Text color={is_desktop ? 'less-prominent' : 'prominent'} size={is_desktop ? 'xxs' : 's'}>
            {label}
        </Text>
    );
};

export default CopyAdvertFormTrailingIcon;

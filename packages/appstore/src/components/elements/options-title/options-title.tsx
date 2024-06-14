import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TOptionsTitle = {
    is_eu_user: boolean;
};

const OptionsTitle = ({ is_eu_user }: TOptionsTitle) => {
    const { isDesktop } = useDevice();

    if (!isDesktop) return null;

    return is_eu_user ? (
        <Text size='sm' weight='bold' color='prominent'>
            <Localize i18n_default_text='Multipliers' />
        </Text>
    ) : (
        <Text size='sm' weight='bold' color='prominent'>
            <Localize i18n_default_text='Options' />
        </Text>
    );
};

export default OptionsTitle;

import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import React from 'react';

const getPasskeysTips = () =>
    [
        {
            id: 1,
            description: <Localize i18n_default_text='Enable screen lock on your device.' />,
        },
        {
            id: 2,
            description: <Localize i18n_default_text='Sign in to your Google or iCloud account.' />,
        },
        {
            id: 3,
            description: <Localize i18n_default_text='Enable Bluetooth.' />,
        },
    ] as const;

export const TipsBlock = () => {
    const tips = getPasskeysTips();
    return (
        <div className='passkeys-status__description-tips-wrapper'>
            <Icon icon='IcBulb' size={24} />
            <div className='passkeys-status__description-tips-container'>
                <Text weight='bold' size='xs'>
                    <Localize i18n_default_text='Tips:' />
                </Text>
                <Text size='xxs' line_height='l'>
                    <Localize i18n_default_text='Before using passkey:' />
                </Text>
                {tips.map(({ id, description }) => (
                    <li key={`tip-${id}`}>
                        <Text size='xxs' line_height='l'>
                            {description}
                        </Text>
                    </li>
                ))}
            </div>
        </div>
    );
};

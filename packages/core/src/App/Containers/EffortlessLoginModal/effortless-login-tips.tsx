import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const getEffortLessLoginTips = () =>
    [
        {
            id: 1,
            icon: 'IcFingerprintBold',
            description: <Localize i18n_default_text='No need to remember a password' />,
        },
        {
            id: 2,
            icon: 'IcMobileDevice',

            description: <Localize i18n_default_text='Sync across devices' />,
        },
        {
            id: 3,
            icon: 'IcLockBold',
            description: <Localize i18n_default_text='Enhanced security with biometrics or screen lock  ' />,
        },
    ] as const;

export const EffortLessLoginTips = ({ onLearnMoreClick }: { onLearnMoreClick?: () => void }) => {
    const tips = getEffortLessLoginTips();

    return (
        <div>
            {tips.map(({ id, icon, description }) => (
                <div key={`tip-${id}`} className='effortless-login-modal__overlay-tip'>
                    <Icon icon={icon} size={24} />
                    <Text size='xs' weight='bold'>
                        {description}
                    </Text>
                </div>
            ))}

            <Text as='p' size='xs' className='effortless-login-modal__overlay-tip'>
                <Localize
                    i18n_default_text='Learn more about passkeys <0> here</0>.'
                    components={[<Text key={0} color='loss-danger' size='xs' onClick={onLearnMoreClick} />]}
                />
            </Text>
        </div>
    );
};

import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const getPasskeysDescription = () =>
    [
        {
            id: 1,
            question: <Localize i18n_default_text='What are passkeys?' />,
            description: (
                <Localize i18n_default_text='Passkeys are a security measure that lets you log in the same way you unlock your device: with a fingerprint, a face scan, or a screen lock PIN.' />
            ),
        },
        {
            id: 2,
            question: <Localize i18n_default_text='Why passkeys?' />,
            description: (
                <Localize i18n_default_text='Passkeys are an added layer of security that protects your account against unauthorised access and phishing attacks.' />
            ),
        },
        {
            id: 3,
            question: <Localize i18n_default_text='How to create a passkey?' />,
            description: (
                <Localize i18n_default_text='Go to ‘Account Settings’ on Deriv to set up your passkey. Each device can only save one passkey; however, iOS users may still see the "Create passkey" button due to iOS’s ability to save passkeys on other devices.' />
            ),
        },
        {
            id: 4,
            question: <Localize i18n_default_text='Where are passkeys saved?' />,
            description: (
                <Localize i18n_default_text='Passkeys are saved in your Google password manager for Android devices and in iCloud keychain on iOS devices to help you sign in on other devices.' />
            ),
        },
        {
            id: 5,
            question: <Localize i18n_default_text='What happens if my Deriv account email is changed?' />,
            description: (
                <Localize i18n_default_text='Even if you change your email address, you can still continue to log in to your Deriv account with the same passkey.' />
            ),
        },
    ] as const;

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

export const EffortlessLoginDescription = () => {
    const passkeys_descriptions = getPasskeysDescription();
    const tips = getPasskeysTips();

    return (
        <React.Fragment>
            <div className='effortless-login-modal__description-container'>
                {passkeys_descriptions.map(({ id, question, description }) => (
                    <div key={`description-${id}`} className='effortless-login-modal__description-card'>
                        <Text weight='bold' size='xs'>
                            {question}
                        </Text>
                        <Text as='p' size='xs'>
                            {description}
                        </Text>
                    </div>
                ))}
            </div>
            <div className='effortless-login-modal__description-tips-wrapper'>
                <Icon icon='IcBulb' size={24} />
                <div className='effortless-login-modal__description-tips-container'>
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
        </React.Fragment>
    );
};

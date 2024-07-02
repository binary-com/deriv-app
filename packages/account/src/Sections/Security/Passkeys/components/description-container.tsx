import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const getPasskeysDescriptions = () =>
    [
        {
            id: 1,
            question: <Localize i18n_default_text='What are passkeys?' />,
            descriptions: [
                <Localize i18n_default_text='Secure alternative to passwords.' key='1.1' />,
                <Localize
                    i18n_default_text='Unlock your account like your phone - with biometrics, face scan or PIN.'
                    key='1.2'
                />,
            ],
        },
        {
            id: 2,
            question: <Localize i18n_default_text='Why passkeys?' />,
            descriptions: [
                <Localize i18n_default_text='Extra security layer.' key='2.1' />,
                <Localize i18n_default_text='Shields against unauthorised access and phishing.' key='2.2' />,
            ],
        },
        {
            id: 3,
            question: <Localize i18n_default_text='How to create a passkey?' />,
            descriptions: [
                <Localize i18n_default_text='Go to ‘Account Settings’ on Deriv.' key='3.1' />,
                <Localize i18n_default_text='You can create one passkey per device.' key='3.2' />,
            ],
        },
        {
            id: 4,
            question: <Localize i18n_default_text='Where are passkeys saved?' />,
            descriptions: [
                <Localize i18n_default_text='Android: Google password manager.' key='4.1' />,
                <Localize i18n_default_text='iOS: iCloud keychain.' key='4.2' />,
            ],
        },
        {
            id: 5,
            question: <Localize i18n_default_text='What happens if my Deriv account email is changed?' />,
            descriptions: [
                <Localize i18n_default_text='No problem! Your passkey still works.' key='5.1' />,
                <Localize i18n_default_text='Sign in to Deriv with your existing passkey.' key='5.2' />,
            ],
        },
    ] as const;

export const DescriptionContainer = () => {
    const passkeys_descriptions = getPasskeysDescriptions();
    return (
        <div className='passkeys-status__description-container'>
            {passkeys_descriptions.map(({ id, question, descriptions }) => (
                <div key={`description-card-${id}`} className='passkeys-status__description-card'>
                    <Text weight='bold' size='xs'>
                        {question}
                    </Text>
                    <Text as='ul' size='xs'>
                        {descriptions.map(description => (
                            <li key={`description-${description.key}`}>
                                <Text size='xs' line_height='l'>
                                    {description}
                                </Text>
                            </li>
                        ))}
                    </Text>
                </div>
            ))}
        </div>
    );
};

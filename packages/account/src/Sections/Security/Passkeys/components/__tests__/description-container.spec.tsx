import { screen, render } from '@testing-library/react';
import { DescriptionContainer } from '../description-container';

describe('DescriptionContainer', () => {
    it('renders the descriptions correctly', () => {
        const description_data = [
            {
                question: 'What are passkeys?',
                descriptions: [
                    'Secure alternative to passwords.',
                    'Unlock your account like your phone - with biometrics, face scan or PIN.',
                ],
            },
            {
                question: 'Why passkeys?',
                descriptions: ['Extra security layer.', 'Shields against unauthorised access and phishing.'],
            },
            {
                question: 'How to create a passkey?',
                descriptions: ['Go to ‘Account Settings’ on Deriv.', 'You can create one passkey per device.'],
            },
            {
                question: 'Where are passkeys saved?',
                descriptions: ['Android: Google password manager.', 'iOS: iCloud keychain.'],
            },
            {
                question: 'What happens if my Deriv account email is changed?',
                descriptions: ['No problem! Your passkey still works.', 'Sign in to Deriv with your existing passkey.'],
            },
        ];

        render(<DescriptionContainer />);

        description_data.forEach(({ question, descriptions }) => {
            expect(screen.getByText(question)).toBeInTheDocument();
            descriptions.forEach(description => expect(screen.getByText(description)).toBeInTheDocument());
        });
    });
});

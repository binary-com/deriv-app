import React from 'react';
import { screen, render } from '@testing-library/react';
import { DescriptionContainer } from '../description-container';

describe('DescriptionContainer', () => {
    it('renders the descriptions correctly', () => {
        const description_data = [
            {
                question: 'What are passkeys?',
                description:
                    'Passkeys are a security measure that lets you log in the same way you unlock your device: with a fingerprint, a face scan, or a screen lock PIN.',
            },
            {
                question: 'Why passkeys?',
                description:
                    'Passkeys are an added layer of security that protects your account against unauthorised access and phishing attacks.',
            },
            {
                question: 'How to create a passkey?',
                description:
                    'Go to ‘Account Settings’ on Deriv to set up your passkey. Each device can only save one passkey; however, iOS users may still see the "Create passkey" button due to iOS’s ability to save passkeys on other devices.',
            },
            {
                question: 'Where are passkeys saved?',
                description:
                    'Passkeys are saved in your Google password manager for Android devices and in iCloud keychain on iOS devices to help you sign in on other devices.',
            },
            {
                question: 'What happens if my Deriv account email is changed?',
                description:
                    'Even if you change your email address, you can still continue to log in to your Deriv account with the same passkey.',
            },
        ];

        render(<DescriptionContainer />);

        description_data.forEach(({ question, description }) => {
            expect(screen.getByText(question)).toBeInTheDocument();
            expect(screen.getByText(description)).toBeInTheDocument();
        });
    });
});

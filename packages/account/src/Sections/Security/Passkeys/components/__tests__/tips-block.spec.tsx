import React from 'react';
import { screen, render } from '@testing-library/react';
import { TipsBlock } from '../tips-block';

describe('TipsBlock', () => {
    const enable_screen_lock_tip = 'Enable screen lock on your device.';
    const google_sign_in_tip = 'Sign in to your Google or iCloud account.';
    const bluetooth_tip = 'Enable Bluetooth.';

    it('renders the tips correctly', () => {
        render(<TipsBlock />);

        expect(screen.getByText('Tips:')).toBeInTheDocument();
        expect(screen.getByText('Before using passkey:')).toBeInTheDocument();
        expect(screen.getByText(enable_screen_lock_tip)).toBeInTheDocument();
        expect(screen.getByText(google_sign_in_tip)).toBeInTheDocument();
        expect(screen.getByText(bluetooth_tip)).toBeInTheDocument();
    });
});

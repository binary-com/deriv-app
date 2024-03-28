import React from 'react';
import { screen, render } from '@testing-library/react';
import PasskeyCard from '../passkey-card';

describe('PasskeyCard', () => {
    it('renders the passkey card correctly', () => {
        const mock_card: React.ComponentProps<typeof PasskeyCard> = {
            id: 1,
            name: 'Test Passkey',
            last_used: 1633024800,
            created_at: 1633024800,
            stored_on: 'Device',
            icon: 'IcPasskey',
            passkey_id: 'mock-id',
        };

        render(<PasskeyCard {...mock_card} />);

        expect(screen.getByText(/test passkey/i)).toBeInTheDocument();
        expect(screen.getByText(/stored on/i)).toBeInTheDocument();
        expect(screen.getByText(/last used/i)).toBeInTheDocument();
    });
});

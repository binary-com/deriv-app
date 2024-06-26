import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasskeysList } from '../passkeys-list';

const passkey_name_1 = 'Test Passkey 1';
const passkey_name_2 = 'Test Passkey 2';

const mock_passkeys_list: React.ComponentProps<typeof PasskeysList>['passkeys_list'] = [
    {
        id: 1,
        name: passkey_name_1,
        last_used: 1633024800000,
        created_at: 1633024800000,
        stored_on: '',
        icon: 'Test Icon 1',
        passkey_id: 'mock-id-1',
    },
    {
        id: 2,
        name: passkey_name_2,
        last_used: 1633124800000,
        created_at: 1634024800000,
        stored_on: '',
        icon: 'Test Icon 2',
        passkey_id: 'mock-id-2',
    },
];

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getOSNameWithUAParser: () => 'test OS',
}));

describe('PasskeysList', () => {
    it('renders the passkeys and calls the correct function when the button is clicked', () => {
        const mockOnPrimaryButtonClick = jest.fn();
        const mockOnSecondaryButtonClick = jest.fn();
        const mockOnPasskeyMenuClick = jest.fn();

        render(
            <PasskeysList
                passkeys_list={mock_passkeys_list}
                onPrimaryButtonClick={mockOnPrimaryButtonClick}
                onSecondaryButtonClick={mockOnSecondaryButtonClick}
                onPasskeyMenuClick={mockOnPasskeyMenuClick}
            />
        );

        mock_passkeys_list.forEach(passkey => {
            expect(screen.getByText(passkey.name)).toBeInTheDocument();
        });

        userEvent.click(screen.getByRole('button', { name: /create passkey/i }));
        userEvent.click(screen.getByRole('button', { name: /learn more/i }));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });
});

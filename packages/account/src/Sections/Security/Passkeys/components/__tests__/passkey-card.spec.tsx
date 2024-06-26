import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasskeyCard } from '../passkey-card';
import { PasskeysList } from '../passkeys-list';

const passkey_name_1 = 'Test Passkey 1';
const passkey_name_2 = 'Test Passkey 2';

const mock_passkeys_list: React.ComponentProps<typeof PasskeysList>['passkeys_list'] = [
    {
        id: 1,
        name: passkey_name_1,
        last_used: 1633024800000,
        created_at: 1633024800000,
        stored_on: 'Test device 1',
        icon: 'Test Icon 1',
        passkey_id: 'mock-id-1',
    },
    {
        id: 2,
        name: passkey_name_2,
        last_used: 1633124800000,
        created_at: 1634024800000,
        stored_on: 'Test device 2',
        icon: 'Test Icon 2',
        passkey_id: 'mock-id-2',
    },
];

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getOSNameWithUAParser: () => 'test OS',
}));

describe('PasskeyCard', () => {
    const mockOnPasskeyMenuClick = jest.fn();
    const mock_card = mock_passkeys_list[0];

    it('renders the passkey card correctly and trigger menu with renaming', () => {
        render(<PasskeyCard {...mock_card} onPasskeyMenuClick={mockOnPasskeyMenuClick} />);

        expect(screen.getByText(/test passkey/i)).toBeInTheDocument();
        expect(screen.getByText(/stored on/i)).toBeInTheDocument();
        expect(screen.getByText(/last used/i)).toBeInTheDocument();
        expect(screen.queryByText('Rename')).not.toBeInTheDocument();
        const menu_button = screen.getByTestId('dt_dropdown_display');
        userEvent.click(menu_button);
        const rename_option = screen.getByText('Rename');
        expect(rename_option).toBeInTheDocument();
        userEvent.click(rename_option);
        expect(mockOnPasskeyMenuClick).toHaveBeenCalledTimes(1);
    });
});

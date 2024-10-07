import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DerivAppsSuccessFooter } from '../DerivAppsSuccessFooter';

const mockHistoryPush = jest.fn();
const mockHide = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

jest.mock('../../ModalProvider', () => ({
    ...jest.requireActual('../../ModalProvider'),
    useModal: jest.fn(() => ({ hide: mockHide })),
}));

describe('DerivAppsSuccessFooter', () => {
    it('renders the component', () => {
        render(<DerivAppsSuccessFooter />);
        expect(screen.getByRole('button', { name: 'Maybe later' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Transfer funds' })).toBeInTheDocument();
    });
    it('hides the modal when Maybe later button is clicked', async () => {
        render(<DerivAppsSuccessFooter />);
        await userEvent.click(screen.getByRole('button', { name: 'Maybe later' }));
        expect(mockHide).toHaveBeenCalled();
    });
    it('navigates to /wallet/account-transfer when Transfer funds button is clicked', async () => {
        render(<DerivAppsSuccessFooter />);
        await userEvent.click(screen.getByRole('button', { name: 'Transfer funds' }));
        expect(mockHistoryPush).toHaveBeenCalledWith('/wallet/account-transfer');
    });
});

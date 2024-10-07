import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MT5ChangeInvestorPasswordSavedScreen from '../MT5ChangeInvestorPasswordSavedScreen';

describe('MT5ChangeInvestorPasswordSavedScreen', () => {
    it('renders without crashing', () => {
        render(<MT5ChangeInvestorPasswordSavedScreen />);

        expect(screen.getByText('Your investor password has been changed.')).toBeInTheDocument();
        expect(screen.getByText('Password saved')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /OK/i })).toBeInTheDocument();
    });

    it('calls setNextScreen when OK button is clicked', async () => {
        const setNextScreenMock = jest.fn();

        render(<MT5ChangeInvestorPasswordSavedScreen setNextScreen={setNextScreenMock} />);

        await userEvent.click(screen.getByRole('button', { name: /OK/i }));

        expect(setNextScreenMock).toHaveBeenCalled();
    });
});

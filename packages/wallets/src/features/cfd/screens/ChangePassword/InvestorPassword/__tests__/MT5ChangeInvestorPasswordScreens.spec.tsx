import React from 'react';
import { useActiveWalletAccount, useSettings, useVerifyEmail } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModal } from '../../../../../../components/ModalProvider';
import MT5ChangeInvestorPasswordScreens from '../MT5ChangeInvestorPasswordScreens';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useSettings: jest.fn(),
    useVerifyEmail: jest.fn(),
}));

jest.mock('../../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../../components/ModalProvider'),
    useModal: jest.fn(),
}));

jest.mock('../MT5ChangeInvestorPasswordInputsScreen', () =>
    jest.fn(({ sendEmail, setNextScreen }) => (
        <div>
            <button onClick={sendEmail}>Send Email</button>
            <button onClick={setNextScreen}>Next Screen</button>
        </div>
    ))
);

jest.mock('../MT5ChangeInvestorPasswordSavedScreen', () =>
    jest.fn(({ setNextScreen }) => (
        <div>
            <button onClick={setNextScreen}>Close</button>
        </div>
    ))
);

describe('MT5ChangeInvestorPasswordScreens', () => {
    beforeEach(() => {
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn().mockReturnValue('account-id'),
            hide: jest.fn(),
        });
        (useSettings as jest.Mock).mockReturnValue({ data: { email: 'user@example.com' } });
        (useVerifyEmail as jest.Mock).mockReturnValue({ mutate: jest.fn() });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: { is_virtual: false } });
    });

    it('renders intro screen by default', () => {
        render(<MT5ChangeInvestorPasswordScreens />);

        expect(screen.getByRole('button', { name: 'Send Email' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Next Screen' })).toBeInTheDocument();
    });

    it('handles send email button click', async () => {
        const setShowEmailSentScreen = jest.fn();
        const { mutate } = useVerifyEmail();

        render(<MT5ChangeInvestorPasswordScreens setShowEmailSentScreen={setShowEmailSentScreen} />);

        await userEvent.click(screen.getByRole('button', { name: 'Send Email' }));

        await waitFor(() => {
            expect(mutate).toHaveBeenCalled();
            expect(setShowEmailSentScreen).toHaveBeenCalledWith(true);
            expect(localStorage.getItem('trading_platform_investor_password_reset_account_id')).toBe('account-id');
        });
    });

    it('switches to saved screen on next screen button click', async () => {
        render(<MT5ChangeInvestorPasswordScreens />);

        await userEvent.click(screen.getByRole('button', { name: 'Next Screen' }));

        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('calls hide modal on close button click in saved screen', async () => {
        const { hide } = useModal();

        render(<MT5ChangeInvestorPasswordScreens />);

        await userEvent.click(screen.getByRole('button', { name: 'Next Screen' }));
        await userEvent.click(screen.getByRole('button', { name: 'Close' }));

        expect(hide).toHaveBeenCalled();
    });
});

import React, { PropsWithChildren } from 'react';
import { useTradingPlatformInvestorPasswordChange } from '@deriv/api-v2';
import { Button, useDevice } from '@deriv-com/ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModal } from '../../../../../../components/ModalProvider';
import { validPasswordMT5 } from '../../../../../../utils/password-validation';
import MT5ChangeInvestorPasswordInputsScreen from '../MT5ChangeInvestorPasswordInputsScreen';

jest.mock('@deriv/api-v2', () => ({
    useTradingPlatformInvestorPasswordChange: jest.fn(),
}));

jest.mock('../../../../../../components', () => ({
    ...jest.requireActual('../../../../../../components'),
    WalletsActionScreen: jest.fn(({ description, renderButtons }) => (
        <div>
            {description}
            {renderButtons()}
        </div>
    )),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Button: jest.fn(
        ({
            children,
            disabled,
            isLoading,
            onClick,
            type,
        }: PropsWithChildren<{
            disabled: boolean;
            isLoading: boolean;
            onClick: () => void;
            textSize: string;
            type?: 'button' | 'reset' | 'submit';
        }>) => {
            return (
                <button disabled={disabled} onClick={onClick} type={type}>
                    {isLoading && <>Loading...</>}
                    {!isLoading ? children : null}
                </button>
            );
        }
    ),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('../../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../../components/ModalProvider'),
    useModal: jest.fn(),
}));

jest.mock('../../../../../../components/Base/WalletPasswordField/PasswordViewerIcon', () =>
    jest.fn(({ setViewPassword, viewPassword }) => (
        <button onClick={() => setViewPassword(!viewPassword)}>PasswordViewerIcon</button>
    ))
);

jest.mock('../../../../../../utils/password-validation', () => ({
    ...jest.requireActual('../../../../../../utils/password-validation'),
    validPasswordMT5: jest.fn(),
}));

describe('MT5ChangeInvestorPasswordInputsScreen', () => {
    beforeEach(() => {
        (useTradingPlatformInvestorPasswordChange as jest.Mock).mockReturnValue({
            mutateAsync: jest.fn(),
            status: 'idle',
        });
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn().mockReturnValue('test-account-id'),
        });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        (validPasswordMT5 as jest.Mock).mockReturnValue(true);
    });

    it('renders the component correctly', () => {
        render(<MT5ChangeInvestorPasswordInputsScreen />);

        expect(screen.getByText(/Use this password to grant viewing access to another user/)).toBeInTheDocument();
        expect(screen.getByText(/Change investor password/)).toBeInTheDocument();
        expect(screen.getByText(/Create or reset investor password/)).toBeInTheDocument();
    });

    it('validates current password field', async () => {
        render(<MT5ChangeInvestorPasswordInputsScreen />);

        await userEvent.click(screen.getByText('Current investor password'));
        await userEvent.tab();
        await userEvent.click(screen.getByText(/Change investor password/));

        await waitFor(() => {
            expect(screen.getByText('The field is required')).toBeInTheDocument();
        });
    });

    it('submits the form with valid data', async () => {
        const newPassword = 'newPassword123';
        const oldPassword = 'oldPassword123';
        const mockChangePassword = jest.fn().mockResolvedValue({});
        (useTradingPlatformInvestorPasswordChange as jest.Mock).mockReturnValue({
            mutateAsync: mockChangePassword,
        });

        render(<MT5ChangeInvestorPasswordInputsScreen setNextScreen={jest.fn()} />);

        await userEvent.type(screen.getByLabelText(/Current investor password/), oldPassword);
        const newInvestorPasswordInput = await screen.findByText('New investor password');
        await userEvent.type(newInvestorPasswordInput, newPassword);

        await userEvent.click(screen.getByText(/Change investor password/));

        await waitFor(() => {
            expect(mockChangePassword).toHaveBeenCalledWith({
                account_id: 'test-account-id',
                new_password: newPassword,
                old_password: oldPassword,
                platform: 'mt5',
            });
        });
    });

    it('displays error message if change password fails', () => {
        (useTradingPlatformInvestorPasswordChange as jest.Mock).mockReturnValue({
            error: { error: { message: 'Error changing password' } },
            mutateAsync: jest.fn(),
        });

        render(<MT5ChangeInvestorPasswordInputsScreen />);

        expect(screen.getByText('Error changing password')).toBeInTheDocument();
    });

    it('shows the loader when the change investor password mutation is loading', async () => {
        (useTradingPlatformInvestorPasswordChange as jest.Mock).mockReturnValue({
            status: 'loading',
        });

        render(<MT5ChangeInvestorPasswordInputsScreen />);

        await expect(
            screen.getByRole('button', {
                name: 'Loading...',
            })
        ).toBeInTheDocument();
    });

    it('displays the password when the viewer icon is clicked', async () => {
        render(<MT5ChangeInvestorPasswordInputsScreen />);

        const currentPasswordInput = screen.getByPlaceholderText('Current investor password');
        expect(currentPasswordInput).toHaveAttribute('type', 'password');

        await userEvent.click(screen.getAllByRole('button', { name: 'PasswordViewerIcon' })[0]);

        expect(currentPasswordInput).toHaveAttribute('type', 'text');
    });

    it('renders button with correct text size for mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<MT5ChangeInvestorPasswordInputsScreen />);

        expect(Button).toHaveBeenCalledWith(expect.objectContaining({ textSize: 'md' }), {});
    });
});

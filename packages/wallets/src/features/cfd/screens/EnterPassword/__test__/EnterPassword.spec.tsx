import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MARKET_TYPE, PlatformDetails } from '../../../constants';
import EnterPassword from '../EnterPassword';

jest.mock('@deriv/api-v2');

jest.mock('../../components', () => ({
    ...jest.requireActual('../../components'),
    MT5LicenceMessage: jest.fn(() => <div>MT5LicenceMessage</div>),
    MT5PasswordModalTnc: jest.fn(() => <div>MT5PasswordModalTnc</div>),
}));

describe('EnterPassword', () => {
    const mockUseActiveWalletAccount = useActiveWalletAccount as jest.Mock;

    beforeEach(() => {
        mockUseActiveWalletAccount.mockReturnValue({ data: { is_virtual: false } });
    });

    afterEach(cleanup);

    const title = `Enter your ${PlatformDetails.mt5.title} password`;
    const shortPassword = 'abcd';
    const validPassword = 'Abcd1234!';

    const defaultProps = {
        isForgotPasswordLoading: false,
        isLoading: false,
        marketType: MARKET_TYPE.FINANCIAL,
        modalTitle: title,
        onPasswordChange: jest.fn(),
        onPrimaryClick: jest.fn(),
        onSecondaryClick: jest.fn(),
        password: '',
        passwordError: false,
        platform: PlatformDetails.mt5.platform,
        setPassword: jest.fn(),
    };

    const renderComponent = (props = {}) => {
        return render(
            <EnterPassword
                isTncChecked={true}
                onTncChange={function (): void {
                    throw new Error('Function not implemented.');
                }}
                {...defaultProps}
                {...props}
            />
        );
    };

    it('renders the component correctly', () => {
        renderComponent();
        expect(screen.getByText(title)).toBeInTheDocument();
        expect(
            screen.getByText(
                `Enter your ${PlatformDetails.mt5.title} password to add a ${PlatformDetails.mt5.title} Financial account`
            )
        ).toBeInTheDocument();
    });

    it('calls onPasswordChange when typing in the password field', async () => {
        renderComponent();
        const passwordField = screen.getByLabelText(`${PlatformDetails.mt5.title} password`);
        await userEvent.type(passwordField, validPassword);
        expect(defaultProps.onPasswordChange).toHaveBeenCalled();
    });

    it('calls onSecondaryClick when clicking the "Forgot password?" button', async () => {
        renderComponent();
        const forgotPasswordButton = screen.getByRole('button', { name: 'Forgot password?' });
        await userEvent.click(forgotPasswordButton);
        expect(defaultProps.onSecondaryClick).toHaveBeenCalled();
    });

    it('calls onPrimaryClick when clicking the "Add account" button', async () => {
        renderComponent({ password: validPassword });
        const addAccountButton = screen.getByRole('button', { name: 'Add account' });
        await userEvent.click(addAccountButton);
        expect(defaultProps.onPrimaryClick).toHaveBeenCalled();
    });

    it('disables the "Add account" button when password is invalid', () => {
        renderComponent({ password: shortPassword });
        const addAccountButton = screen.getByRole('button', { name: 'Add account' });
        expect(addAccountButton).toBeDisabled();
    });

    it('disables the "Add account" button when tnc is not checked', () => {
        renderComponent({ isTncChecked: false });
        const addAccountButton = screen.getByRole('button', { name: 'Add account' });
        expect(addAccountButton).toBeDisabled();
    });

    it('shows password error hints when passwordError is true', () => {
        renderComponent({ passwordError: true });
        expect(
            screen.getByText(
                `Hint: You may have entered your Deriv password, which is different from your ${PlatformDetails.mt5.title} password.`
            )
        ).toBeInTheDocument();
    });

    it('shows the mt5 licence message component for real MT5 accounts', () => {
        renderComponent({ account: { shortcode: 'svg' } });

        expect(screen.getByText('MT5LicenceMessage')).toBeInTheDocument();
    });

    it('hides the mt5 licence message for virtual accounts', () => {
        mockUseActiveWalletAccount.mockReturnValue({ data: { is_virtual: true } });
        renderComponent();

        expect(screen.queryByText('MT5LicenceMessage')).not.toBeInTheDocument();
    });

    it('shows the mt5 tnc checkbox for regulated real accounts', () => {
        renderComponent({ account: { shortcode: 'bvi' } });

        expect(screen.getByText('MT5PasswordModalTnc')).toBeInTheDocument();
    });

    it('hides the mt5 tnc checkbox for non-regulated real accounts', () => {
        renderComponent({ account: { shortcode: 'svg' } });

        expect(screen.queryByText('MT5PasswordModalTnc')).not.toBeInTheDocument();
    });
});

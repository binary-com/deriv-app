import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../AuthProvider';
import { ModalProvider } from '../../ModalProvider';
import WalletSuccessResetMT5Password from '../WalletSuccessResetMT5Password';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </WalletsAuthProvider>
    </APIProvider>
);

const props = {
    isInvestorPassword: false,
    onClick: jest.fn(),
    title: 'mocked',
};

describe('<WalletsErrorMT5InvestorPassword />', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should render WalletSuccessResetMT5Password', () => {
        render(<WalletSuccessResetMT5Password {...props} />, { wrapper });
        expect(screen.getByTestId('dt_modal_step_wrapper'));
    });

    it('should render content if isInvestorPassword is true', () => {
        render(<WalletSuccessResetMT5Password {...props} isInvestorPassword />, { wrapper });
        expect(screen.getByText('Reset mocked password'));
        expect(screen.getByText('Password saved'));
        expect(screen.getByText('Your investor password has been changed.'));
        expect(screen.getByRole('button', { name: 'Ok' }));
    });

    it('should render content if isInvestorPassword is false', () => {
        render(<WalletSuccessResetMT5Password {...props} />, { wrapper });
        expect(screen.getByText('Manage mocked password'));
        expect(screen.getByText('Success'));
        expect(
            screen.getByText(
                'You have a new mocked password to log in to your mocked accounts on the web and mobile apps.'
            )
        );
        expect(screen.getByRole('button', { name: 'Done' }));
    });

    it('should execute function onClick when button is clicked', async () => {
        render(<WalletSuccessResetMT5Password {...props} />, { wrapper });
        expect(screen.getByRole('button', { name: 'Done' }));
        await userEvent.click(screen.getByRole('button', { name: 'Done' }));
        expect(props.onClick).toBeCalled();
    });

    it('should render WalletSuccessResetMT5Password on Mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<WalletSuccessResetMT5Password {...props} />, { wrapper });
        expect(screen.getByTestId('dt_modal_step_wrapper'));
    });
});

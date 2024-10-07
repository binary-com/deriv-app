import React, { PropsWithChildren } from 'react';
import { APIProvider, useTradingPlatformInvestorPasswordReset, useTradingPlatformPasswordReset } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import { CFD_PLATFORMS } from '../../../features/cfd/constants';
import { ModalProvider } from '../../ModalProvider';
import WalletsResetMT5Password from '../WalletsResetMT5Password';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

const mockShow = jest.fn();
const mockHide = jest.fn();

jest.mock('../../ModalProvider', () => ({
    ...jest.requireActual('../../ModalProvider'),
    useModal: jest.fn(() => ({
        hide: mockHide,
        setModalOptions: jest.fn(),
        show: mockShow,
    })),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useTradingPlatformInvestorPasswordReset: jest.fn(() => ({
        error: null,
        isError: false,
        isLoading: false,
        isSuccess: false,
        mutate: jest.fn(),
    })),
    useTradingPlatformPasswordReset: jest.fn(() => ({
        error: null,
        isError: false,
        isLoading: false,
        isSuccess: true,
        mutate: jest.fn(),
    })),
}));

const defaultProps = {
    actionParams: 'test-action-params',
    isInvestorPassword: false,
    platform: CFD_PLATFORMS.MT5,
    verificationCode: 'test-verification-code',
};

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </WalletsAuthProvider>
    </APIProvider>
);

describe('WalletsResetMT5Password', () => {
    let $root: HTMLDivElement, $modalContainer: HTMLDivElement;

    beforeEach(() => {
        jest.clearAllMocks();

        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        $root = document.createElement('div');
        $root.id = 'root';
        $modalContainer = document.createElement('div');
        $modalContainer.id = 'wallets_modal_root';
        document.body.appendChild($root);
        document.body.appendChild($modalContainer);
    });

    afterEach(() => {
        document.body.removeChild($root);
        document.body.removeChild($modalContainer);
    });

    it('should render WalletsResetMT5Password on Desktop', () => {
        render(<WalletsResetMT5Password {...defaultProps} />, { wrapper });
        expect(screen.getByTestId('dt_modal_step_wrapper')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create/ })).toBeInTheDocument();
    });

    it('should render WalletsResetMT5Password on Mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<WalletsResetMT5Password {...defaultProps} />, { wrapper });
        expect(screen.getByTestId('dt_modal_step_wrapper')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create/ })).toBeInTheDocument();
    });

    it('should show correct content if isInvestorPassword is false', async () => {
        const mockMutate = jest.fn();
        (useTradingPlatformPasswordReset as jest.Mock).mockReturnValue({
            error: null,
            isError: false,
            isLoading: false,
            isSuccess: false,
            mutate: mockMutate,
        });

        render(<WalletsResetMT5Password {...defaultProps} />);
        expect(screen.getByTestId('dt_modal_step_wrapper')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create/ })).toBeInTheDocument();

        const inputBox = await screen.findByLabelText(/Deriv MT5 password/);
        const createButton = await screen.findByRole('button', { name: /Create/ });
        fireEvent.change(inputBox, { target: { value: 'Abcd1234!' } });
        expect(await inputBox).toHaveValue('Abcd1234!');
        expect(createButton).toBeEnabled();
        fireEvent.click(createButton);
        expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    it('should show correct content if isInvestorPassword is true', async () => {
        const mockMutate = jest.fn();
        (useTradingPlatformInvestorPasswordReset as jest.Mock).mockReturnValue({
            error: null,
            isError: false,
            isLoading: false,
            isSuccess: false,
            mutate: mockMutate,
        });

        render(<WalletsResetMT5Password {...defaultProps} isInvestorPassword />);
        expect(screen.getByTestId('dt_modal_step_wrapper')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create/ })).toBeInTheDocument();

        const inputBox = await screen.findByLabelText(/New investor password/);
        const createButton = await screen.findByRole('button', { name: /Create/ });
        fireEvent.change(inputBox, { target: { value: 'Abcd1234!' } });
        expect(await inputBox).toHaveValue('Abcd1234!');
        expect(createButton).toBeEnabled();
        fireEvent.click(createButton);
        expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    it('should return Error when API returns error', async () => {
        const mockMutate = jest.fn();
        (useTradingPlatformPasswordReset as jest.Mock).mockReturnValue({
            error: 'Error',
            isError: true,
            isLoading: false,
            isSuccess: false,
            mutate: mockMutate,
        });

        render(<WalletsResetMT5Password {...defaultProps} />);
        expect(screen.getByTestId('dt_modal_step_wrapper')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create/ })).toBeInTheDocument();

        const inputBox = await screen.findByLabelText(/Deriv MT5 password/);
        const createButton = await screen.findByRole('button', { name: /Create/ });
        fireEvent.change(inputBox, { target: { value: 'Abcd1234!' } });
        expect(await inputBox).toHaveValue('Abcd1234!');
        expect(createButton).toBeEnabled();
        fireEvent.click(createButton);
        expect(mockMutate).toHaveBeenCalledTimes(1);
        expect(mockShow).toBeCalled();
    });

    it('should return Success when API returns success', async () => {
        const mockMutate = jest.fn();
        (useTradingPlatformPasswordReset as jest.Mock).mockReturnValue({
            error: null,
            isError: false,
            isLoading: false,
            isSuccess: true,
            mutate: mockMutate,
        });

        render(<WalletsResetMT5Password {...defaultProps} />);
        expect(screen.getByTestId('dt_modal_step_wrapper')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create/ })).toBeInTheDocument();

        const inputBox = await screen.findByLabelText(/Deriv MT5 password/);
        const createButton = await screen.findByRole('button', { name: /Create/ });
        fireEvent.change(inputBox, { target: { value: 'Abcd1234!' } });
        expect(await inputBox).toHaveValue('Abcd1234!');
        expect(createButton).toBeEnabled();
        fireEvent.click(createButton);
        expect(mockMutate).toHaveBeenCalledTimes(1);
        expect(mockShow).toBeCalled();
    });

    it('should disable the Create button for invalid MT5 password', async () => {
        render(<WalletsResetMT5Password {...defaultProps} />);
        const inputBox = await screen.findByLabelText(/Deriv MT5 password/);
        const createButton = await screen.findByRole('button', { name: /Create/ });
        fireEvent.change(inputBox, { target: { value: 'invalid' } });
        expect(createButton).toBeDisabled();
    });

    it('should cancel reset on click of Cancel button', async () => {
        render(<WalletsResetMT5Password {...defaultProps} />);
        const cancelButton = await screen.findByRole('button', { name: /Cancel/ });
        fireEvent.click(cancelButton);
        expect(mockHide).toHaveBeenCalledTimes(1);
    });
});

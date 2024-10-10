import React, { PropsWithChildren } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ModalProvider, TModalContext, useModal } from '../../../../../components/ModalProvider';
import CTraderAddAccountSuccessModal from '../CTraderAddAccountSuccessModal';

jest.mock('../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../components/ModalProvider'),
    useModal: jest.fn(() => ({
        ...jest.requireActual('../../../../../components/ModalProvider').useModal(),
    })),
}));

const wrapper = ({ children }: PropsWithChildren) => <ModalProvider>{children}</ModalProvider>;

// Mocking the useHistory hook
const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: mockPush,
    }),
}));

describe('CTraderAddAccountSuccessModal', () => {
    const mockUseModal = useModal as jest.MockedFunction<() => TModalContext>;
    const mockShowModal = jest.fn();
    const mockHideModal = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseModal.mockReturnValue({
            getModalState: jest.fn(),
            hide: mockHideModal,
            isOpen: false,
            setModalOptions: jest.fn(),
            setModalState: jest.fn(),
            show: mockShowModal,
        });
    });

    it('should render the components with success message and buttons', () => {
        render(<CTraderAddAccountSuccessModal />, { wrapper });

        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(
            screen.getByText(/Congratulations, you have successfully created your real Deriv cTrader account/i)
        ).toBeInTheDocument();
        expect(screen.getByText('Maybe later')).toBeInTheDocument();
        expect(screen.getByText('Transfer now')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallets_ctrader_success_icon')).toBeInTheDocument();
    });

    it('should hide modal when "Maybe Later" button is clicked', () => {
        render(<CTraderAddAccountSuccessModal />, { wrapper });
        fireEvent.click(screen.getByText('Maybe later'));

        expect(mockHideModal).toHaveBeenCalled();
    });

    it('should show the MT5TradeModal when "Transfer now" button is clicked', () => {
        render(<CTraderAddAccountSuccessModal />, { wrapper });
        fireEvent.click(screen.getByText('Transfer now'));
        mockHideModal();

        expect(mockPush).toHaveBeenCalledWith('/wallet/withdrawal');
    });
});

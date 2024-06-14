import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PaymentAgentUnlistedWithdrawForm from '../payment-agent-unlisted-withdraw-form';
import { useDevice } from '@deriv-com/ui';
import { isMobile, isMobileOrTablet, validNumber } from '@deriv/shared';
import CashierProviders from '../../../../cashier-providers';
import { mockStore } from '@deriv/stores';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true, isTablet: false, isMobile: false })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    validNumber: jest.fn(() => ({ is_ok: true, message: '' })),
    isMobile: jest.fn(() => false),
    isMobileOrTablet: jest.fn(() => false),
}));

jest.mock('Pages/payment-agent/payment-agent-disclaimer', () => jest.fn(() => 'PaymentAgentDisclaimer'));

describe('<PaymentAgentUnlistedWithdrawForm />', () => {
    let mockRootStore: ReturnType<typeof mockStore>, setIsUnlistedWithdraw: (value: boolean) => void;

    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component as React.ReactPortal;
        });
    });

    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
    });

    beforeEach(() => {
        mockRootStore = mockStore({
            ui: { disableApp: jest.fn(), enableApp: jest.fn() },
            client: {
                balance: '1000',
                currency: 'USD',
                verification_code: {
                    payment_agent_withdraw: 'ABCdef',
                },
            },
            modules: {
                cashier: {
                    payment_agent: {
                        error: {},
                        onMountPaymentAgentWithdraw: jest.fn(),
                        requestTryPaymentAgentWithdraw: jest.fn().mockResolvedValue(''),
                    },
                },
            },
        });

        setIsUnlistedWithdraw = jest.fn();
    });

    const mockPaymentAgentUnlistedWithdrawForm = () => {
        return (
            <CashierProviders store={mockRootStore}>
                <PaymentAgentUnlistedWithdrawForm setIsUnlistedWithdraw={setIsUnlistedWithdraw} />
            </CashierProviders>
        );
    };

    it('should render the component', () => {
        render(mockPaymentAgentUnlistedWithdrawForm());

        expect(screen.getByTestId('dt-back-arrow-icon')).toBeInTheDocument();
        expect(screen.getByText('Back to list')).toBeInTheDocument();
        expect(screen.getByLabelText('Enter the payment agent account number')).toBeInTheDocument();
        expect(screen.getByText('Example: CR123456789')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
        expect(screen.getByLabelText('Enter amount')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
        expect(screen.getByText('Note: Deriv does not charge any transfer fees.')).toBeInTheDocument();
    });

    it('should trigger onclick callback when arrow back button was clicked', () => {
        render(mockPaymentAgentUnlistedWithdrawForm());

        const el_back_arrow_icon = screen.getByTestId('dt-back-arrow-icon');
        fireEvent.click(el_back_arrow_icon);

        expect(setIsUnlistedWithdraw).toHaveBeenCalledWith(false);
    });

    it('should show different error messages', async () => {
        (validNumber as jest.Mock).mockReturnValue({ is_ok: false, message: 'error_message' });
        const { rerender } = render(mockPaymentAgentUnlistedWithdrawForm());

        const el_input_account_number = screen.getByLabelText('Enter the payment agent account number');
        const el_input_amount = screen.getByLabelText('Enter amount');
        const el_continue_btn = screen.getByRole('button', { name: 'Continue' });
        fireEvent.change(el_input_account_number, { target: { value: 'CR56656565' } });
        fireEvent.change(el_input_amount, { target: { value: '100.99999' } });
        fireEvent.click(el_continue_btn);
        await waitFor(() => {
            expect(screen.getByText('error_message')).toBeInTheDocument();
        });
        (validNumber as jest.Mock).mockReturnValue({ is_ok: true, message: '' });

        rerender(mockPaymentAgentUnlistedWithdrawForm());
        fireEvent.change(el_input_account_number, { target: { value: 'CR56656565' } });
        fireEvent.change(el_input_amount, { target: { value: '2000' } });
        fireEvent.click(el_continue_btn);
        await waitFor(() => {
            expect(screen.getByText('Insufficient balance.')).toBeInTheDocument();
        });

        rerender(mockPaymentAgentUnlistedWithdrawForm());
        fireEvent.change(el_input_account_number, { target: { value: '667766767' } });
        fireEvent.change(el_input_amount, { target: { value: '100' } });
        fireEvent.click(el_continue_btn);
        await waitFor(() => {
            expect(screen.getByText('Please enter a valid account number. Example: CR123456789')).toBeInTheDocument();
        });
    });

    it('should trigger requestTryPaymentAgentWithdraw, when all data are valid', async () => {
        render(mockPaymentAgentUnlistedWithdrawForm());

        const el_input_account_number = screen.getByLabelText('Enter the payment agent account number');
        const el_input_amount = screen.getByLabelText('Enter amount');
        const el_continue_btn = screen.getByRole('button', { name: 'Continue' });
        fireEvent.change(el_input_account_number, { target: { value: 'CR90000100' } });
        fireEvent.change(el_input_amount, { target: { value: '100' } });
        fireEvent.click(el_continue_btn);

        await waitFor(() => {
            expect(mockRootStore.modules.cashier.payment_agent.requestTryPaymentAgentWithdraw).toHaveBeenCalledWith({
                loginid: 'CR90000100',
                currency: 'USD',
                amount: 100,
                verification_code: 'ABCdef',
            });
        });
    });

    it('should show PaymentAgentDisclaimer in mobile view', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isMobileOrTablet as jest.Mock).mockReturnValue(true);
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false, isTablet: false, isMobile: true });
        render(mockPaymentAgentUnlistedWithdrawForm());

        expect(screen.getByText('PaymentAgentDisclaimer')).toBeInTheDocument();
    });
});

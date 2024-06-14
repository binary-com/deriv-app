import React from 'react';
import PaymentAgentReceipt from '../payment-agent-receipt';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserHistory, createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { useDevice } from '@deriv-com/ui';
import { isMobile, isMobileOrTablet, routes } from '@deriv/shared';
import CashierProviders from '../../../../cashier-providers';
import { mockStore } from '@deriv/stores';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true, isTablet: false, isMobile: false })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isMobileOrTablet: jest.fn(() => false),
}));

jest.mock('Pages/payment-agent/payment-agent-disclaimer', () => jest.fn(() => 'PaymentAgentDisclaimer'));

describe('<PaymentAgentReceipt />', () => {
    let history: BrowserHistory, mockRootStore: ReturnType<typeof mockStore>;

    beforeEach(() => {
        mockRootStore = mockStore({
            client: {
                currency: 'USD',
            },
            common: {
                is_from_derivgo: false,
            },
            modules: {
                cashier: {
                    payment_agent: {
                        receipt: {
                            amount_transferred: '20.00',
                            payment_agent_email: 'reshma+cr1@binary.com',
                            payment_agent_id: 'CR90000089',
                            payment_agent_name: 'Ms QA script reshmacrcdD',
                            payment_agent_phone: [{ phone_number: '+62417522087' }],
                            payment_agent_url: [{ url: 'https://deriv.com/' }],
                        },
                        resetPaymentAgent: jest.fn(),
                    },
                },
            },
        });

        history = createBrowserHistory();
    });

    const renderPaymentAgentReceipt = () => {
        return render(
            <Router history={history}>
                <CashierProviders store={mockRootStore}>
                    <PaymentAgentReceipt />
                </CashierProviders>
            </Router>
        );
    };

    it('should show the proper text/messages', () => {
        renderPaymentAgentReceipt();

        const [view_transactions_btn, make_a_new_withdrawal_btn] = screen.getAllByRole('button');

        expect(screen.getByText('You’ve transferred 20.00 USD')).toBeInTheDocument();
        expect(screen.getByText('Important notice to receive your funds')).toBeInTheDocument();
        expect(
            screen.getByText(/to receive your funds, contact the payment agent with the details below/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/you can view the summary of this transaction in your email/i)).toBeInTheDocument();
        expect(screen.getByText('Ms QA script reshmacrcdD')).toBeInTheDocument();
        expect(screen.getByText("'s")).toBeInTheDocument();
        expect(screen.getByText('contact details')).toBeInTheDocument();
        expect(screen.getByText('+62417522087')).toBeInTheDocument();
        expect(screen.getByText('reshma+cr1@binary.com')).toBeInTheDocument();
        expect(view_transactions_btn).toBeInTheDocument();
        expect(make_a_new_withdrawal_btn).toBeInTheDocument();
    });

    it('should redirect to "/reports/statement" when the "View transactions" button is clicked', () => {
        renderPaymentAgentReceipt();

        const [view_transactions_btn] = screen.getAllByRole('button');
        fireEvent.click(view_transactions_btn);
        expect(history.location.pathname).toBe(routes.statement);
    });

    it('should trigger onClick callback when the "Make a new withdrawal" button is clicked', () => {
        renderPaymentAgentReceipt();

        const [_, make_a_new_withdrawal_btn] = screen.getAllByRole('button');

        fireEvent.click(make_a_new_withdrawal_btn);
        expect(mockRootStore.modules.cashier.payment_agent.resetPaymentAgent).toHaveBeenCalledTimes(1);
    });

    it('should not show "View transactions" if is_from_derivgo equal to true', () => {
        mockRootStore.common.is_from_derivgo = true;
        renderPaymentAgentReceipt();

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should show PaymentAgentDisclaimer in mobile view', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isMobileOrTablet as jest.Mock).mockReturnValue(true);
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false, isTablet: false, isMobile: true });

        renderPaymentAgentReceipt();

        expect(screen.getByText('PaymentAgentDisclaimer')).toBeInTheDocument();
    });
});

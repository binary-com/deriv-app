import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import PaymentAgentContainer from '../payment-agent-container';
import { useDevice } from '@deriv-com/ui';
import { isMobile, isMobileOrTablet } from '@deriv/shared';
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

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

jest.mock('Pages/payment-agent/payment-agent-unlisted-withdraw-form', () =>
    jest.fn(() => <div>PaymentAgentUnlistedWithdrawForm</div>)
);
jest.mock('Pages/payment-agent/payment-agent-withdraw-confirm', () =>
    jest.fn(() => <div>PaymentAgentWithdrawConfirm</div>)
);
jest.mock('Pages/payment-agent/payment-agent-receipt', () => jest.fn(() => <div>PaymentAgentReceipt</div>));
jest.mock('Pages/payment-agent/payment-agent-disclaimer', () => jest.fn(() => <div>PaymentAgentDisclaimer</div>));
jest.mock('Pages/payment-agent/payment-agent-search-box', () => jest.fn(() => <div>PaymentAgentSearchBox</div>));

describe('<PaymentAgentContainer />', () => {
    let mockRootStore: ReturnType<typeof mockStore>;
    beforeEach(() => {
        mockRootStore = mockStore({
            client: {
                verification_code: {
                    payment_agent_withdraw: 'ABCdef',
                },
            },
            modules: {
                cashier: {
                    payment_agent: {
                        is_try_withdraw_successful: false,
                        is_withdraw_successful: false,
                        onChangePaymentMethod: jest.fn(),
                        filtered_list: [
                            {
                                currencies: 'USD',
                                deposit_commission: 0,
                                email: 'pa@example.com',
                                further_information: 'further information CR90000000',
                                max_withdrawal: '2000',
                                min_withdrawal: '10',
                                name: 'Payment Agent of CR90000000',
                                paymentagent_loginid: 'CR90000000',
                                phones: '+12345678',
                                supported_banks: [{ payment_method: 'Visa' }],
                                telephone: '+12345678',
                                url: 'https://www.pa.com',
                                withdrawal_commission: 0,
                            },
                            {
                                currencies: 'USD',
                                deposit_commission: 0,
                                email: 'pa@example.com',
                                further_information: 'further information CR90000002',
                                max_withdrawal: '2000',
                                min_withdrawal: '10',
                                name: 'Payment Agent of CR90000002',
                                paymentagent_loginid: 'CR90000002',
                                phones: '+12345678',
                                supported_banks: [{ payment_method: 'Visa' }, { payment_method: 'Mastercard' }],
                                telephone: '+12345678',
                                url: 'https://www.pa.com',
                                withdrawal_commission: 0,
                            },
                        ],
                        resetPaymentAgent: jest.fn(),
                        selected_bank: '',
                        supported_banks: [
                            { text: 'MasterCard', value: 'mastercard' },
                            { text: 'Visa', value: 'visa' },
                        ],
                    },
                },
            },
        });
    });

    const renderPaymentAgentContainer = (is_deposit = true) => {
        return render(
            <CashierProviders store={mockRootStore}>
                <PaymentAgentContainer is_deposit={is_deposit} />
            </CashierProviders>
        );
    };

    it('should show proper messages and icons', () => {
        renderPaymentAgentContainer();

        expect(
            screen.getByText('Contact your preferred payment agent for payment instructions and make your deposit.')
        ).toBeInTheDocument();
        expect(screen.getByText('PaymentAgentSearchBox')).toBeInTheDocument();
        expect(screen.getByTestId('dt_dropdown_container')).toBeInTheDocument();
        expect(screen.getByText('Payment Agent of CR90000000')).toBeInTheDocument();
        expect(screen.getByText('Further information CR90000000')).toBeInTheDocument();
        expect(screen.getByText('Payment Agent of CR90000002')).toBeInTheDocument();
        expect(screen.getByText('Further information CR90000002')).toBeInTheDocument();
        expect(screen.getAllByTestId('dt_payment_method_icon')).toHaveLength(2);
    });

    it('should show proper header when is_deposit is equal to false', () => {
        renderPaymentAgentContainer(false);

        expect(
            screen.getByText(
                /choose your preferred payment agent and enter your withdrawal amount. If your payment agent is not listed/i
            )
        ).toBeInTheDocument();
        expect(screen.getByText('search for them using their account number')).toBeInTheDocument();
    });

    it('should show PaymentAgentUnlistedWithdrawForm when the user clicks on "search for them using their account number" link', () => {
        renderPaymentAgentContainer(false);

        const el_withdrawal_link = screen.getByTestId('dt_withdrawal_link');
        fireEvent.click(el_withdrawal_link);

        expect(screen.getByText('PaymentAgentUnlistedWithdrawForm')).toBeInTheDocument();
    });

    it('should show PaymentAgentWithdrawConfirm component when is_try_withdraw_successful is equal to true', () => {
        mockRootStore.modules.cashier.payment_agent.is_try_withdraw_successful = true;
        renderPaymentAgentContainer();

        expect(screen.getByText('PaymentAgentWithdrawConfirm')).toBeInTheDocument();
    });

    it('should show PaymentAgentReceipt component when is_withdraw_successful is equal to true', () => {
        mockRootStore.modules.cashier.payment_agent.is_withdraw_successful = true;
        renderPaymentAgentContainer();

        expect(screen.getByText('PaymentAgentReceipt')).toBeInTheDocument();
    });

    it('should show PaymentAgentDisclaimer in mobile view', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isMobileOrTablet as jest.Mock).mockReturnValue(true);
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false, isTablet: false, isMobile: true });
        renderPaymentAgentContainer();

        expect(screen.getByText('PaymentAgentDisclaimer')).toBeInTheDocument();
    });

    it('should show search loader when is_search_loading equal to true', () => {
        mockRootStore.modules.cashier.payment_agent.is_search_loading = true;
        renderPaymentAgentContainer();

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should show proper warning messages if there are no matches in search results', () => {
        mockRootStore.modules.cashier.payment_agent.has_payment_agent_search_warning = true;
        renderPaymentAgentContainer();

        expect(screen.getByText('No payment agents found for your search')).toBeInTheDocument();
        expect(screen.getByText('Try changing your search criteria.')).toBeInTheDocument();
    });
});

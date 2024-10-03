import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv-com/ui';
import { StoreProvider, mockStore } from '@deriv/stores';
import { OneTimeDepositModalContent } from '../one-time-deposit-modal-content';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('@deriv/cashier/src/modules/deposit-fiat/components/deposit-fiat-iframe/deposit-fiat-iframe', () =>
    jest.fn(() => <div>FiatIframe</div>)
);
jest.mock(
    '@deriv/cashier/src/modules/deposit-crypto/components/deposit-crypto-wallet-address/deposit-crypto-wallet-address',
    () => jest.fn(() => <div>CryptoWallet</div>)
);

window.LiveChatWidget = {
    call: jest.fn(),
    get: jest.fn(),
    init: jest.fn(),
    on: jest.fn(),
};

describe('<OneTimeDepositModalContent />', () => {
    const mockDefault = mockStore({});

    const wrapper = (mock: ReturnType<typeof mockStore> = mockDefault) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render one time deposit modal content with correct title', () => {
        render(<OneTimeDepositModalContent />, {
            wrapper: wrapper(),
        });

        expect(screen.getByText(/Deposit/)).toBeInTheDocument();
    });

    it('should render one time deposit modal content with correct title in responsive mode', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });

        render(<OneTimeDepositModalContent />, {
            wrapper: wrapper(),
        });

        expect(screen.getByText(/Deposit/)).toBeInTheDocument();
    });

    it('should render one time deposit modal content with fiat iframe', () => {
        render(<OneTimeDepositModalContent />, {
            wrapper: wrapper(),
        });

        expect(screen.getByText(/Select a payment method to make a deposit into your account/)).toBeInTheDocument();
        expect(screen.getByText(/FiatIframe/)).toBeInTheDocument();
    });

    it('should render one time deposit modal content with crypto wallet', () => {
        render(<OneTimeDepositModalContent is_crypto_provider />, {
            wrapper: wrapper(),
        });

        expect(
            screen.queryByText(/Select a payment method to make a deposit into your account/)
        ).not.toBeInTheDocument();
        expect(screen.getByText(/CryptoWallet/)).toBeInTheDocument();
    });

    it('should open live chat widget on click', () => {
        render(<OneTimeDepositModalContent />, {
            wrapper: wrapper(),
        });

        const live_chat = screen.getByTestId('dt_live_chat');
        expect(live_chat).toBeInTheDocument();
        userEvent.click(live_chat);
    });
});

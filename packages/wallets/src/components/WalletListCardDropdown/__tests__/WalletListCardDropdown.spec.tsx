import React, { PropsWithChildren } from 'react';
import { APIProvider, useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../AuthProvider';
import useAllBalanceSubscription from '../../../hooks/useAllBalanceSubscription';
import WalletListCardDropdown from '../WalletListCardDropdown';
import '@testing-library/jest-dom';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useWalletAccountsList: jest.fn(),
}));
jest.mock('../../../hooks/useAllBalanceSubscription', () =>
    jest.fn(() => ({
        data: undefined,
        isLoading: false,
    }))
);

const mockSwitchAccount = jest.fn();

jest.mock('../../../hooks/useWalletAccountSwitcher', () => ({
    __esModule: true,
    default: jest.fn(() => mockSwitchAccount),
}));

const mockUseAllBalanceSubscription = useAllBalanceSubscription as jest.MockedFunction<
    typeof useAllBalanceSubscription
>;

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>{children}</WalletsAuthProvider>
    </APIProvider>
);

describe('WalletListCardDropdown', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                loginid: 'CR1',
            },
        });
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [
                {
                    currency: 'USD',
                    currency_config: { fractional_digits: 2 },
                    is_virtual: false,
                    loginid: 'CR1',
                },
                {
                    currency: 'BTC',
                    currency_config: { fractional_digits: 8 },
                    is_virtual: false,
                    loginid: 'BTC1',
                },
            ],
        });
    });

    it('renders with correct default data', () => {
        render(<WalletListCardDropdown />, { wrapper });

        expect(screen.getByDisplayValue('USD Wallet')).toBeInTheDocument();
    });

    it('switches to selected account on click of the list item', () => {
        render(<WalletListCardDropdown />, { wrapper });

        const input = screen.getByDisplayValue('USD Wallet');
        fireEvent.click(input);

        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();

        const btcWallet = screen.getByText('BTC Wallet');
        fireEvent.click(btcWallet);

        expect(mockSwitchAccount).toHaveBeenCalledWith('BTC1');
        expect(screen.getByDisplayValue('BTC Wallet')).toBeInTheDocument();
    });

    it('displays correct wallet details with balance in items list', () => {
        (mockUseAllBalanceSubscription as jest.Mock).mockReturnValue({
            data: {
                BTC1: {
                    balance: '1.0000000',
                },
                CR1: {
                    balance: '1000.00',
                },
            },
            isLoading: false,
        });
        render(<WalletListCardDropdown />, { wrapper });

        const input = screen.getByDisplayValue('USD Wallet');
        fireEvent.click(input);
        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();
        expect(screen.getByText('1.00000000 BTC')).toBeInTheDocument();
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('1,000.00 USD')).toBeInTheDocument();
    });

    it('handles case where no active wallet is set', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: null,
        });

        render(<WalletListCardDropdown />, { wrapper });

        expect(screen.queryByDisplayValue('USD Wallet')).not.toBeInTheDocument();
    });

    it('handles case where wallets data is empty', () => {
        (useWalletAccountsList as jest.Mock).mockReturnValue({ data: [] });

        render(<WalletListCardDropdown />, { wrapper });

        expect(screen.queryByDisplayValue('USD Wallet')).not.toBeInTheDocument();
    });

    it('closes the dropdown when clicking outside', () => {
        render(<WalletListCardDropdown />, { wrapper });

        const input = screen.getByDisplayValue('USD Wallet');
        fireEvent.click(input);

        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();

        fireEvent.mouseDown(document);
        expect(screen.queryByText('BTC Wallet')).not.toBeInTheDocument();
    });

    it('closes the dropdown when pressing the escape key', () => {
        render(<WalletListCardDropdown />, { wrapper });

        const input = screen.getByDisplayValue('USD Wallet');
        fireEvent.click(input);

        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByText('BTC Wallet')).not.toBeInTheDocument();
    });

    it('renders the disabled badge for a disabled wallet', () => {
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [
                {
                    currency: 'USD',
                    currency_config: { fractional_digits: 2 },
                    is_disabled: true,
                    is_virtual: false,
                    loginid: 'CR1',
                },
            ],
        });

        render(<WalletListCardDropdown />, { wrapper });

        const input = screen.getByDisplayValue('USD Wallet');
        userEvent.click(input);

        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('Disabled')).toBeInTheDocument();
    });
});

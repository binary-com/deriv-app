import React from 'react';
import { APIProvider, useBalanceSubscription } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import WalletListCardBalance from '../WalletListCardBalance';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(() => ({
        data: {
            currency: 'USD',
            loginid: 'CR1',
        },
    })),
    useBalanceSubscription: jest.fn(),
}));

describe('WalletListCardBalance', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <APIProvider>
            <WalletsAuthProvider>{children}</WalletsAuthProvider>
        </APIProvider>
    );

    it('should show account balance', () => {
        (useBalanceSubscription as jest.Mock).mockReturnValue({
            data: {
                balance: '100',
            },
            isLoading: false,
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        });
        render(<WalletListCardBalance />, { wrapper });
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
    });

    it('should subscribe to the balance call with for the correct account when the component mounts', () => {
        const mockSubscribe = jest.fn();

        (useBalanceSubscription as jest.Mock).mockReturnValue({
            isLoading: false,
            subscribe: mockSubscribe,
            unsubscribe: jest.fn(),
        });
        render(<WalletListCardBalance />, { wrapper });
        expect(mockSubscribe).toBeCalledWith({ loginid: 'CR1' });
    });

    it('should unsubscribe to the balance call when the component unmounts', async () => {
        const mockUnsubscribe = jest.fn();

        (useBalanceSubscription as jest.Mock).mockReturnValue({
            isLoading: false,
            subscribe: jest.fn(),
            unsubscribe: mockUnsubscribe,
        });
        const { unmount } = render(<WalletListCardBalance />, { wrapper });
        unmount();

        await waitFor(() => {
            expect(mockUnsubscribe).toBeCalled();
        });
    });

    it('should show loader when balance has not been loaded', () => {
        (useBalanceSubscription as jest.Mock).mockReturnValue({
            isLoading: true,
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        });
        render(<WalletListCardBalance />, { wrapper });
        expect(screen.queryByText('100 USD')).not.toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_list_card_balance_loader')).toBeInTheDocument();
    });
});

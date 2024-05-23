import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletDeposit from '../WalletDeposit';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
}));

jest.mock('../../../modules', () => ({
    DepositCryptoModule: jest.fn(() => <div>MockedDepositCryptoModule</div>),
    DepositFiatModule: jest.fn(() => <div>MockedDepositFiatModule</div>),
}));

describe('WalletDeposit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render crypto module when wallet is crypto', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency_config: {
                    is_crypto: true,
                },
            },
        });

        render(<WalletDeposit />);

        expect(screen.getByText(/MockedDepositCryptoModule/)).toBeInTheDocument();
        expect(screen.queryByText(/MockedDepositFiatModule/)).not.toBeInTheDocument();
    });

    it('should render fiat module when wallet is fiat', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency_config: {
                    is_crypto: false,
                },
            },
        });

        render(<WalletDeposit />);

        expect(screen.getByText(/MockedDepositFiatModule/)).toBeInTheDocument();
        expect(screen.queryByText(/MockedDepositCryptoModule/)).not.toBeInTheDocument();
    });
});

import React, { PropsWithChildren } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { CashierLocked, SystemMaintenance } from '../../../modules';
import WalletFiatOnRamp from '../WalletFiatOnRamp';

jest.mock('../../../modules', () => ({
    CashierLocked: jest.fn(({ children }) => <>{children}</>),
    FiatOnRampModule: jest.fn(() => <div>MockedFiatOnRampModule</div>),
    SystemMaintenance: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

const mockUseActiveWalletAccount = useActiveWalletAccount as jest.Mock;
const mockUseHistory = useHistory as jest.Mock;

const wrapper = ({ children }: PropsWithChildren) => (
    <SystemMaintenance>
        <CashierLocked>{children}</CashierLocked>
    </SystemMaintenance>
);

describe('WalletFiatOnRamp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should redirect to /wallets/cashier/deposit when isCrypto is false', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            data: {
                currency_config: {
                    is_crypto: false,
                },
            },
        });

        const pushMock = jest.fn();
        mockUseHistory.mockReturnValue({ push: pushMock });

        render(<WalletFiatOnRamp />, { wrapper });

        expect(pushMock).toHaveBeenCalledWith('/wallets/cashier/deposit');
    });

    it('should render FiatOnRampModule when isCrypto is true', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            data: {
                currency_config: {
                    is_crypto: true,
                },
            },
        });

        render(<WalletFiatOnRamp />, { wrapper });

        expect(screen.getByText(/MockedFiatOnRampModule/)).toBeInTheDocument();
    });
});

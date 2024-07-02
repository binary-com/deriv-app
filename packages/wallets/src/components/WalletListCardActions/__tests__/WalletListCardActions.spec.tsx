import React, { PropsWithChildren } from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import useDevice from '../../../hooks/useDevice';
import WalletListCardActions from '../WalletListCardActions';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(() => ({
        data: {
            currency: 'USD',
            display_login: 'CRW123456',
            email: '',
            is_active: true,
            is_virtual: false,
            loginid: 'CRW123456',
        },
    })),
}));

jest.mock('../../../hooks/useDevice');
const mockedUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;

const history = createMemoryHistory();
const wrapper = ({ children }: PropsWithChildren) => <Router history={history}>{children}</Router>;

describe('WalletListCardActions', () => {
    beforeEach(() => {
        mockedUseDevice.mockReturnValue({ isDesktop: true, isMobile: false, isTablet: false });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should show the actions texts if the real wallet is active', () => {
        render(<WalletListCardActions />, { wrapper });
        expect(screen.getByText('Deposit')).toBeInTheDocument();
        expect(screen.getByText('Withdraw')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
    });

    it('should show the actions texts if the demo wallet is active', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                display_login: 'VRW123456',
                email: '',
                is_active: true,
                is_virtual: true,
                loginid: 'VRW123456',
            },
        });

        render(<WalletListCardActions />, { wrapper });
        expect(screen.getByText('Reset balance')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
    });

    it("shouldn't show the actions texts if the real wallet is inactive", () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                display_login: 'CRW123456',
                email: '',
                is_active: false,
                is_virtual: false,
                loginid: 'CRW123456',
            },
        });

        render(<WalletListCardActions />, { wrapper });
        expect(screen.queryByText('Deposit')).not.toBeInTheDocument();
        expect(screen.queryByText('Withdraw')).not.toBeInTheDocument();
        expect(screen.queryByText('Transfer')).not.toBeInTheDocument();
    });

    it('should switch account and redirect to the correct page when clicking on one of the actions and wallet is inactive', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                display_login: 'CRW123456',
                email: '',
                is_active: false,
                is_virtual: false,
                loginid: 'CRW123456',
            },
        });

        render(<WalletListCardActions />, { wrapper });
        screen.getByRole('button', { name: 'deposit' }).click();
        expect(history.location.pathname).toBe('/wallet/deposit');
    });

    it('should render the actions for mobile', () => {
        mockedUseDevice.mockReturnValue({ isDesktop: false, isMobile: true, isTablet: false });
        const { container } = render(<WalletListCardActions />, {
            wrapper,
        });
        // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
        const mobileActions = container.querySelector('.wallets-mobile-actions');
        expect(mobileActions).toBeInTheDocument();
    });

    it('should switch account and redirect to the correct page when clicking on one of the actions and wallet is inactive for mobile', () => {
        mockedUseDevice.mockReturnValue({ isDesktop: false, isMobile: true, isTablet: false });
        render(<WalletListCardActions />, {
            wrapper,
        });
        screen.getByRole('button', { name: 'deposit' }).click();
        expect(history.location.pathname).toBe('/wallet/deposit');
    });

    it('should redirect to cashier page when clicking on deposit', () => {
        render(<WalletListCardActions />, { wrapper });
        screen.getByRole('button', { name: 'deposit' }).click();
        expect(history.location.pathname).toBe('/wallet/deposit');
    });

    it('should redirect to cashier page when clicking on withdraw', () => {
        render(<WalletListCardActions />, { wrapper });
        screen.getByRole('button', { name: 'withdrawal' }).click();
        expect(history.location.pathname).toBe('/wallet/withdrawal');
    });

    it('should redirect to cashier page when clicking on transfer', () => {
        render(<WalletListCardActions />, { wrapper });
        screen.getByRole('button', { name: 'account-transfer' }).click();
        expect(history.location.pathname).toBe('/wallet/account-transfer');
    });

    it('should redirect to cashier page when clicking on reset balance', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                display_login: 'VRW123456',
                email: '',
                is_active: true,
                is_virtual: true,
                loginid: 'VRW123456',
            },
        });

        render(<WalletListCardActions />, { wrapper });
        screen.getByRole('button', { name: 'reset-balance' }).click();
        expect(history.location.pathname).toBe('/wallet/reset-balance');
    });

    it('passes `accountsActiveTabIndex` in history state, when we redirect the user to the new page in mobile view for REAL wallet', () => {
        const realWalletButtons = ['deposit', 'withdrawal', 'account-transfer'];
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                display_login: 'CRW123456',
                email: '',
                is_active: true,
                is_virtual: false,
                loginid: 'CRW123456',
            },
        });
        mockedUseDevice.mockReturnValue({ isDesktop: false, isMobile: true, isTablet: false });

        render(<WalletListCardActions accountsActiveTabIndex={1} />, {
            wrapper,
        });

        realWalletButtons.forEach(button => {
            screen.getByRole('button', { name: button }).click();
            expect(history.location.pathname).toBe(`/wallet/${button}`);
            expect(history.location.state).toStrictEqual({ accountsActiveTabIndex: 1 });
        });
    });

    it('passes `accountsActiveTabIndex` in history state, when we redirect the user to the new page in mobile view for DEMO wallet', () => {
        const demoWalletButtons = ['reset-balance', 'account-transfer'];
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                display_login: 'VRW123456',
                email: '',
                is_active: true,
                is_virtual: true,
                loginid: 'VRW123456',
            },
        });
        mockedUseDevice.mockReturnValue({ isDesktop: false, isMobile: true, isTablet: false });

        render(<WalletListCardActions accountsActiveTabIndex={1} />, {
            wrapper,
        });

        demoWalletButtons.forEach(button => {
            screen.getByRole('button', { name: button }).click();
            expect(history.location.pathname).toBe(`/wallet/${button}`);
            expect(history.location.state).toStrictEqual({ accountsActiveTabIndex: 1 });
        });
    });
});

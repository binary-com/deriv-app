import React from 'react';
import { render, screen } from '@testing-library/react';
import useDevice from '../../../../../../../hooks/useDevice';
import { getTradingAppIcon } from '../../../../../helpers';
import TransferFormAccountCard from '../TransferFormAccountCard';

jest.mock('../../../../../../../hooks/useDevice', () => jest.fn());

jest.mock('../../../../../helpers', () => ({
    getTradingAppIcon: jest.fn(),
}));

describe('TransferFormAccountCard', () => {
    const mockAccount = {
        account_category: 'wallet',
        account_type: 'type1',
        accountName: 'Test Account',
        displayBalance: '1000 USD',
        landingCompanyName: 'SVG',
        mt5_group: 'group1',
    };

    const mockActiveWallet = {
        currency: 'USD',
        landingCompanyName: 'SVG',
    };

    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (getTradingAppIcon as jest.Mock).mockReturnValue('appIcon');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without crashing', () => {
        render(<TransferFormAccountCard account={undefined} activeWallet={undefined} type={undefined} />);

        expect(screen.queryByText('Test Account')).not.toBeInTheDocument();
        expect(screen.queryByText('Balance: 1000 USD')).not.toBeInTheDocument();
    });

    it('should render content for demo account card correctly', () => {
        const mockNewAccount = { ...mockAccount, currencyConfig: {}, demo_account: true };

        render(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                activeWallet={mockActiveWallet}
                type='modal'
            />
        );

        expect(screen.getByText('Test Account')).toBeInTheDocument();
        expect(screen.getByText('Balance: 1000 USD')).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_wallets_app_linked_with_wallet_icon')).not.toBeInTheDocument();
    });

    it('should render content for real account card correctly', () => {
        const mockNewAccount = { ...mockAccount, currencyConfig: { display_code: 'USD' }, demo_account: false };

        render(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                activeWallet={mockActiveWallet}
                type='modal'
            />
        );

        expect(screen.getByText('Test Account')).toBeInTheDocument();
        expect(screen.getByText('Balance: 1000 USD')).toBeInTheDocument();
        expect(screen.getByText('SVG')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_wallets_app_linked_with_wallet_icon')).not.toBeInTheDocument();
    });

    it('should render content for non-wallet account card correctly', () => {
        const mockNewAccount = {
            ...mockAccount,
            account_category: 'trading',
        };

        render(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                activeWallet={mockActiveWallet}
                type='modal'
            />
        );

        expect(screen.getByText('Test Account')).toBeInTheDocument();
        expect(screen.getByText('Balance: 1000 USD')).toBeInTheDocument();
        expect(screen.getByText('SVG')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallets_app_linked_with_wallet_icon')).toBeInTheDocument();
    });

    it('should display content for demo account in mobile input type correctly', () => {
        const mockNewAccount = { ...mockAccount, demo_account: true };
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                activeWallet={mockActiveWallet}
                type='input'
            />
        );

        expect(screen.getByText('Test Account')).toBeInTheDocument();
        expect(screen.getByText('Balance: 1000 USD')).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
    });

    it('should display content for real account in mobile input type correctly', () => {
        const mockNewAccount = { ...mockAccount, demo_account: false };
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                activeWallet={mockActiveWallet}
                type='input'
            />
        );

        expect(screen.getByText('Test Account')).toBeInTheDocument();
        expect(screen.getByText('Balance: 1000 USD')).toBeInTheDocument();
        expect(screen.getByText('SVG')).toBeInTheDocument();
    });

    it('should display different layouts for modal and input types', () => {
        const mockNewAccount = { ...mockAccount, demo_account: true };

        const { rerender } = render(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                activeWallet={mockActiveWallet}
                type='modal'
            />
        );

        expect(screen.getByText('Demo')).toBeInTheDocument();

        rerender(
            <TransferFormAccountCard
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                account={mockNewAccount}
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                activeWallet={mockActiveWallet}
                type='input'
            />
        );

        expect(screen.queryByText('Demo')).not.toBeInTheDocument();
    });
});

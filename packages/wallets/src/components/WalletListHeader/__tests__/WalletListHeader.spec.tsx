import React from 'react';
import { useWalletAccountsList } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import WalletListHeader from '../WalletListHeader';
import '@testing-library/jest-dom';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: () => ({ data: { is_virtual: false, loginid: 'real1' } }),
    useWalletAccountsList: jest.fn(() => ({
        data: [
            { is_virtual: false, loginid: 'real1' },
            { is_virtual: true, loginid: 'demo123' },
        ],
    })),
}));

const mockSwitchWalletAccount = jest.fn();

jest.mock('../../../hooks/useWalletAccountSwitcher', () => ({
    __esModule: true,
    default: jest.fn(() => mockSwitchWalletAccount),
}));

describe('WalletListHeader', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should render header correctly', () => {
        render(<WalletListHeader />);

        expect(screen.getByText("Trader's Hub")).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
        expect(screen.getByText('Real')).toBeInTheDocument();
    });

    it('should be checked if the real account is active', () => {
        render(<WalletListHeader />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    it('should toggle accounts on checkbox change', () => {
        render(<WalletListHeader />);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockSwitchWalletAccount).toHaveBeenCalledWith('demo123');
    });

    it('renders the switcher with the correct class when all the real wallets are disabled', () => {
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [
                { is_disabled: true, is_virtual: false, loginid: 'real1' },
                { is_virtual: true, loginid: 'demo123' },
            ],
        });

        render(<WalletListHeader />);

        const switcher = screen.getByTestId('dt_wallets_list_header__label_item_real');
        expect(switcher).toHaveClass('wallets-list-header__label-item--disabled');
    });
});

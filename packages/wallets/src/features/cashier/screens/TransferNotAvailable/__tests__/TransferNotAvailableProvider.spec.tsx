import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import getMessage from '../TransferNotAvailableProvider';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

jest.mock('@deriv-com/translations', () => ({
    // eslint-disable-next-line camelcase
    Localize: ({ i18n_default_text, values }: { i18n_default_text: string; values?: Record<string, string> }) => {
        // eslint-disable-next-line camelcase
        let text = i18n_default_text;
        if (values) {
            Object.entries(values).forEach(([key, value]) => {
                text = text.replace(new RegExp(`{{${key}}}`, 'g'), value);
            });
        }
        return <span>{text}</span>;
    },
}));

describe('TransferNotAvailableProvider', () => {
    const mockHistory = { push: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns correct message when no accounts are available for transfer', async () => {
        const result = getMessage({
            currency: 'USD',
            hasAccountsForTransfer: false,
            hasTransferAccountsWithFunds: false,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            history: mockHistory,
            isVirtual: false,
        });

        if (result)
            render(
                <>
                    {result.title}
                    {result.description}
                    {result.actionButton}
                </>
            );
        expect(
            screen.getByText('No trading accounts or other wallets are available to receive funds')
        ).toBeInTheDocument();
        expect(
            screen.getByText("Add a trading account or Wallet in Trader's hub to receive funds from this Wallet.")
        ).toBeInTheDocument();
        const button = screen.getByText("Back to Trader's hub");
        await userEvent.click(button);
        expect(mockHistory.push).toHaveBeenCalledWith('/');
    });

    it('returns correct message for virtual account when no accounts are available for transfer', () => {
        const result = getMessage({
            currency: 'USD',
            hasAccountsForTransfer: false,
            hasTransferAccountsWithFunds: false,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            history: mockHistory,
            isVirtual: true,
        });

        if (result)
            render(
                <>
                    {result.title}
                    {result.description}
                    {result.actionButton}
                </>
            );

        expect(screen.getByText('No trading accounts are available to receive funds')).toBeInTheDocument();
        expect(
            screen.getByText(
                "Add a demo trading account in Trader's hub to receive funds from this Wallet to start trading."
            )
        ).toBeInTheDocument();
    });

    it('returns correct message when no accounts have funds', async () => {
        const result = getMessage({
            currency: 'USD',
            hasAccountsForTransfer: true,
            hasTransferAccountsWithFunds: false,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            history: mockHistory,
            isVirtual: false,
        });

        if (result)
            render(
                <>
                    {result.title}
                    {result.description}
                    {result.actionButton}
                </>
            );

        expect(screen.getByText('No funds in any trading accounts or wallets')).toBeInTheDocument();
        expect(screen.getByText('Please make a deposit to your USD Wallet to make a transfer.')).toBeInTheDocument();
        const button = screen.getByText('Deposit');
        await userEvent.click(button);
        expect(mockHistory.push).toHaveBeenCalledWith('/wallet/deposit');
    });

    it('returns correct message for virtual account when no accounts have funds', async () => {
        const result = getMessage({
            currency: 'USD',
            hasAccountsForTransfer: true,
            hasTransferAccountsWithFunds: false,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            history: mockHistory,
            isVirtual: true,
        });

        if (result)
            render(
                <>
                    {result.title}
                    {result.description}
                    {result.actionButton}
                </>
            );

        expect(screen.getByText('No funds in Demo wallet and demo trading accounts')).toBeInTheDocument();
        expect(
            screen.getByText('Please reset the balance of your Demo Wallet to make a transfer.')
        ).toBeInTheDocument();
        const button = screen.getByText('Reset balance');
        await userEvent.click(button);
        expect(mockHistory.push).toHaveBeenCalledWith('/wallet/reset-balance');
    });

    it('returns undefined when accounts are available and have funds', () => {
        const result = getMessage({
            currency: 'USD',
            hasAccountsForTransfer: true,
            hasTransferAccountsWithFunds: true,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            history: mockHistory,
            isVirtual: false,
        });

        expect(result).toBeUndefined();
    });
});

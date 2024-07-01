import React from 'react';
import { useCashierFiatAddress } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import WithdrawalFiat from '../WithdrawalFiat';

jest.mock('@deriv/api-v2', () => ({
    useCashierFiatAddress: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    Loader: jest.fn(() => <div>Loading...</div>),
}));

jest.mock('../../../screens', () => ({
    WithdrawalErrorScreen: jest.fn(({ error }) => <div>MockedWithdrawalErrorScreen - {error.message}</div>),
}));

describe('<WithdrawalFiat />', () => {
    const verificationCode = 'abcd1234';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render loader while data is loading', () => {
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            isLoading: true,
            mutateAsync: jest.fn().mockResolvedValueOnce({}),
        });

        render(<WithdrawalFiat verificationCode={verificationCode} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render error screen for fiat withdrawal error', () => {
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            error: { error: { code: 'CashierForwardError', message: 'Fiat Error' } },
            mutateAsync: jest.fn().mockResolvedValueOnce({}),
        });

        render(<WithdrawalFiat verificationCode={verificationCode} />);

        expect(screen.getByText(/MockedWithdrawalErrorScreen - Fiat Error/)).toBeInTheDocument();
    });

    it('should render the loader while the iframe is loading', () => {
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            isLoading: false,
            mutateAsync: jest.fn().mockResolvedValueOnce({}),
        });

        render(<WithdrawalFiat verificationCode={verificationCode} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render the iframe with the withdrawal url from API response', () => {
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            data: 'https://iframe_url',
            isLoading: false,
            mutateAsync: jest.fn().mockResolvedValueOnce({}),
        });

        render(<WithdrawalFiat verificationCode={verificationCode} />);
        const iframe = screen.getByTestId('dt_wallets_withdrawal_fiat_iframe');
        expect(iframe).toHaveAttribute('src', 'https://iframe_url');
        expect(iframe).toHaveStyle({ display: 'none' });

        fireEvent.load(iframe);
        expect(iframe).toHaveStyle({ display: 'block' });
    });
});

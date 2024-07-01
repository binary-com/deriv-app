import React from 'react';
import { useAuthorize, useCashierFiatAddress } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import DepositFiat from '../DepositFiat';

jest.mock('@deriv/api-v2', () => ({
    useAuthorize: jest.fn(),
    useCashierFiatAddress: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    Loader: jest.fn(() => <div>Loading...</div>),
}));

jest.mock('../../../screens', () => ({
    DepositErrorScreen: jest.fn(({ error }) => <div>MockedDepositErrorScreen - {error.message}</div>),
}));

describe('DepositFiat', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render loader while data is loading', () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: false });
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            isLoading: true,
            mutate: jest.fn(),
        });

        render(<DepositFiat />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render error screen for fiat deposit error', () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            error: { error: { code: 'CashierForwardError', message: 'Fiat Error' } },
            mutate: jest.fn(),
        });

        render(<DepositFiat />);

        expect(screen.getByText(/MockedDepositErrorScreen - Fiat Error/)).toBeInTheDocument();
    });

    it('should render loader if iframe is not yet loaded', () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            mutate: jest.fn(),
        });
        render(<DepositFiat />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_deposit-fiat-iframe')).not.toBeInTheDocument();
    });

    it('should display iframe correctly after onLoad event', () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            data: 'https://iframe_url',
            isLoading: false,
            mutate: jest.fn(),
        });
        render(<DepositFiat />);

        const iframe = screen.getByTestId('dt_deposit-fiat-iframe');
        expect(iframe).toHaveAttribute('src', 'https://iframe_url');
        expect(iframe).toHaveStyle({ display: 'none' });

        fireEvent.load(iframe);
        expect(iframe).toHaveStyle({ display: 'block' });
    });
});

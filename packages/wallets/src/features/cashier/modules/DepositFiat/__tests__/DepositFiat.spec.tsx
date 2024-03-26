import React from 'react';
import { useAuthorize, useCashierFiatAddress } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import DepositFiat from '../DepositFiat';

jest.mock('@deriv/api-v2', () => ({
    useAuthorize: jest.fn(),
    useCashierFiatAddress: jest.fn(),
}));

describe('DepositFiat', () => {
    beforeEach(() => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render error screen if isError and depositError is a server error', () => {
        const serverError = { code: '500', message: 'Server Error' };

        (useCashierFiatAddress as jest.Mock).mockReturnValueOnce({
            data: null,
            error: { error: serverError },
            isError: true,
            isLoading: false,
            mutate: jest.fn(),
        });

        render(<DepositFiat />);
        expect(screen.getByText('Server Error')).toBeInTheDocument();
    });

    it('should render loader while loading', () => {
        (useAuthorize as jest.Mock).mockReturnValueOnce({ isSuccess: false });
        (useCashierFiatAddress as jest.Mock).mockReturnValueOnce({
            data: null,
            error: null,
            isError: false,
            isLoading: true,
            mutate: jest.fn(),
        });

        render(<DepositFiat />);
        expect(screen.getByTestId('dt_wallets_loader')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_deposit-fiat-iframe')).not.toBeInTheDocument();
    });

    it('should render iframe with correct iframe url', () => {
        (useCashierFiatAddress as jest.Mock).mockReturnValueOnce({
            data: 'https://iframe_url',
            error: null,
            isError: false,
            isLoading: false,
            mutate: jest.fn(),
        });

        render(<DepositFiat />);
        const iframe = screen.getByTestId('dt_deposit-fiat-iframe');
        expect(iframe).toHaveAttribute('src', 'https://iframe_url');
    });

    it('should display iframe correctly after onLoad event', () => {
        (useCashierFiatAddress as jest.Mock).mockReturnValue({
            data: 'https://iframe_url',
            error: null,
            isError: false,
            isLoading: false,
            mutate: jest.fn(),
        });

        render(<DepositFiat />);

        const iframe = screen.getByTestId('dt_deposit-fiat-iframe');
        expect(iframe).toHaveStyle({ display: 'none' });

        fireEvent.load(iframe);
        expect(iframe).toHaveStyle({ display: 'block' });
    });
});

import React from 'react';
import { useHistory } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import WalletsCarouselHeader from '../WalletsCarouselHeader';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({
        push: mockPush,
    })),
}));

describe('WalletsCarouselHeader', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render WalletsCarouselHeader with correct content', () => {
        render(<WalletsCarouselHeader balance='100.00' currency='USD' />);

        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('100.00')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_wallets_carousel_header_balance_loader')).not.toBeInTheDocument();
    });

    it('should redirect to transfer page on click of transfer button', () => {
        render(<WalletsCarouselHeader balance='100.00' currency='USD' />);

        fireEvent.click(screen.getByTestId('dt_wallets_carousel_header_button'));

        expect(useHistory().push).toHaveBeenCalledWith('/wallet/account-transfer');
    });

    it('should display loader when balance is loading', () => {
        render(<WalletsCarouselHeader currency='USD' isBalanceLoading />);

        expect(screen.getByTestId('dt_wallets_carousel_header_balance_loader')).toBeInTheDocument();
    });
});

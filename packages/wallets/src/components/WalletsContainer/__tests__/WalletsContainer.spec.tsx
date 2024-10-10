import React, { PropsWithChildren } from 'react';
import { APIProvider, useActiveWalletAccount, useWalletAccountsList } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import { ModalProvider } from '../../ModalProvider';
import WalletsContainer from '../WalletsContainer';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useWalletAccountsList: jest.fn(),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </WalletsAuthProvider>
    </APIProvider>
);

jest.mock('../../WalletsDisabledAccountsBanner', () => ({
    WalletsDisabledAccountsBanner: jest.fn(() => <div>mockDisabledWalletsBanner</div>),
}));

describe('WalletsContainer', () => {
    const renderHeaderMock = jest.fn(() => <div data-testid='header'>Header</div>);
    const children = <div data-testid='children'>Children</div>;

    beforeEach(() => {
        renderHeaderMock.mockClear();
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [
                { is_disabled: false, is_virtual: false, loginid: 'real1' },
                { is_virtual: true, loginid: 'demo123' },
            ],
        });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: undefined,
        });
    });

    it('should render the default component if no data available', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: undefined,
        });

        render(<WalletsContainer renderHeader={renderHeaderMock}>{children}</WalletsContainer>, { wrapper });

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('children')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallets_container')).toHaveClass('wallets-container');
        expect(screen.getByTestId('dt_wallets_container_header')).toHaveClass('wallets-container__header');
    });

    it('should apply virtual class when is virtual is true', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                is_active: false,
                is_virtual: true,
            },
        });

        render(<WalletsContainer renderHeader={renderHeaderMock}>{children}</WalletsContainer>, { wrapper });

        expect(screen.getByTestId('dt_wallets_container_header')).toHaveClass('wallets-container__header--virtual');
        expect(screen.getByTestId('dt_wallets_container')).toHaveClass('wallets-container--virtual');
    });

    it('should scroll into view when is active is true', async () => {
        const scrollIntoViewMock = jest.fn();
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                is_active: true,
                is_virtual: false,
            },
        });

        render(<WalletsContainer renderHeader={renderHeaderMock}>{children}</WalletsContainer>, { wrapper });

        const containerElement = screen.getByTestId('dt_wallets_container');
        if (containerElement) {
            containerElement.scrollIntoView = scrollIntoViewMock;
        }

        await waitFor(() => {
            expect(scrollIntoViewMock).toHaveBeenCalled();
        });

        expect(containerElement).toHaveStyle('scroll-margin-top: 80px');
    });

    it('renders the disabled wallets banner if a user has any disabled wallets', () => {
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [
                { is_disabled: true, is_virtual: false, loginid: 'real1' },
                { is_virtual: true, loginid: 'demo123' },
            ],
        });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: undefined,
        });

        render(<WalletsContainer renderHeader={renderHeaderMock}>{children}</WalletsContainer>, { wrapper });

        expect(screen.getByText('mockDisabledWalletsBanner')).toBeInTheDocument();
    });
});

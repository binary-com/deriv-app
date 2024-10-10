import React, { PropsWithChildren } from 'react';
import { APIProvider, AuthProvider, useWalletAccountsList } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import { ModalProvider } from '../../../components/ModalProvider';
import WalletsListingRoute from '../WalletsListingRoute';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useWalletAccountsList: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

jest.mock('../../../components', () => ({
    ...jest.requireActual('../../../components'),
    WalletListHeader: () => <div>WalletListHeader</div>,
    WalletsAddMoreCarousel: () => <div>WalletsAddMoreCarousel</div>,
    WalletTourGuide: () => <div>WalletTourGuide</div>,
}));

jest.mock('../../../components/DesktopWalletsList/DesktopWalletsList', () =>
    jest.fn(() => <div>DesktopWalletsList</div>)
);

jest.mock('../../../components/WalletsCarousel/WalletsCarousel', () => jest.fn(() => <div>WalletsCarousel</div>));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <AuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </AuthProvider>
    </APIProvider>
);

describe('WalletsListingRoute', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [
                {
                    currency: 'USD',
                    currency_config: { fractional_digits: 2 },
                    is_disabled: false,
                    is_virtual: false,
                    loginid: 'CR1',
                },
            ],
        });
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('renders DesktopWalletsList, WalletsAddMoreCarousel and WalletTourGuide correctly on desktop', async () => {
        render(<WalletsListingRoute />, { wrapper });
        expect(screen.getByText('WalletListHeader')).toBeInTheDocument();
        expect(screen.queryByText('WalletsCarousel')).not.toBeInTheDocument();
        expect(screen.getByText('WalletTourGuide')).toBeInTheDocument();
        expect(await screen.findByText('DesktopWalletsList')).toBeInTheDocument();
    });

    it('renders WalletsCarousel and WalletsAddMoreCarousel correctly on mobile', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<WalletsListingRoute />, { wrapper });
        expect(screen.getByText('WalletListHeader')).toBeInTheDocument();
        expect(screen.queryByText('DesktopWalletsList')).not.toBeInTheDocument();
        expect(await screen.findByText('WalletsCarousel')).toBeInTheDocument();
        expect(screen.queryByText('WalletTourGuide')).toBeInTheDocument();
    });

    it('hides the wallet add more carousel if a user has no enabled real accounts', () => {
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [
                {
                    currency: 'USD',
                    currency_config: { fractional_digits: 2 },
                    is_disabled: true,
                    is_virtual: false,
                    loginid: 'CR1',
                },
            ],
        });
        render(<WalletsListingRoute />, { wrapper });
        expect(screen.queryByText('WalletsAddMoreCarousel')).not.toBeInTheDocument();
    });
});

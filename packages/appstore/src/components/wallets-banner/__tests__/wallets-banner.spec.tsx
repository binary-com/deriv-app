import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletsBannerUpgrade from '../wallets-banner-upgrade';
import WalletsBannerUpgrading from '../wallets-banner-upgrading';

describe('<WalletsBanner />', () => {
    const mockRootStore = mockStore({
        traders_hub: {
            toggleWalletsUpgrade: jest.fn(),
        },
    });

    describe('Should render properly with right banner if status is eligible: <WalletsBannerUpgrade />', () => {
        const desktop_test_id = 'dt_wallets_upgrade_coins_horizontal';
        const mobile_test_id = 'dt_wallets_upgrade_coins';

        it('Should render upgrade now button', async () => {
            render(<WalletsBannerUpgrade />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const btn = screen.getByRole('button', { name: /Enable now/i });
            expect(btn).toBeInTheDocument();
        });

        it('Should render image properly for desktop', () => {
            mockRootStore.ui.is_mobile = false;
            render(<WalletsBannerUpgrade />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop_test_id);
            const mobile_image = screen.queryByTestId(mobile_test_id);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('Should render image properly for mobile', () => {
            mockRootStore.ui.is_mobile = true;
            render(<WalletsBannerUpgrade />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop_test_id);
            const mobile_image = screen.queryByTestId(mobile_test_id);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });
    });

    describe('Should render properly with right banner if status is in_progress: <WalletsBannerUpgrading />', () => {
        const desktop_test_id = 'dt_wallets_upgrade_coins_horizontal';
        const mobile_test_id = 'dt_wallets_upgrade_coins';

        it('Should render right title', () => {
            render(<WalletsBannerUpgrading />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const title = screen.queryByText(/We're setting up your Wallets/i);

            expect(title).toBeInTheDocument();
        });

        it('Should render loading dots', () => {
            render(<WalletsBannerUpgrading />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const loading_dots = screen.queryByTestId('dt_wallets_loading_dots');

            expect(loading_dots).toBeInTheDocument();
        });

        it('Should render image properly for desktop', () => {
            mockRootStore.ui.is_mobile = false;
            render(<WalletsBannerUpgrading />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop_test_id);
            const mobile_image = screen.queryByTestId(mobile_test_id);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('Should render image properly for mobile', () => {
            mockRootStore.ui.is_mobile = true;
            render(<WalletsBannerUpgrading />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop_test_id);
            const mobile_image = screen.queryByTestId(mobile_test_id);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });
    });
});

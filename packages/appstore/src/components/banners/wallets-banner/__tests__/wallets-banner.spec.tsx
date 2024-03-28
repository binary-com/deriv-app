import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import { TImageTestID } from 'Assets/svgs/wallets/image-types';
import WalletsBannerUpgrade from '../wallets-banner-upgrade';
import WalletsBannerUpgrading from '../wallets-banner-upgrading';
import WalletsBannerReady from '../wallets-banner-ready';

describe('<WalletsBanner />', () => {
    const mockRootStore = mockStore({
        traders_hub: {
            toggleWalletsUpgrade: true,
        },
    });

    describe('Should render properly with right banner if status is eligible: <WalletsBannerUpgrade />', () => {
        const desktop: TImageTestID = 'dt_upgrade_desktop';
        const mobile: TImageTestID = 'dt_upgrade_mobile';

        it('Should render upgrade now button', async () => {
            render(<WalletsBannerUpgrade />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const btn = screen.getByRole('button', { name: /Upgrade now/i });
            expect(btn).toBeInTheDocument();
        });

        it('Should render image properly for desktop', () => {
            mockRootStore.ui.is_mobile = false;
            render(<WalletsBannerUpgrade />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('Should render image properly for mobile', () => {
            mockRootStore.ui.is_mobile = true;
            render(<WalletsBannerUpgrade />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });
    });

    describe('Should render properly with right banner if status is in_progress: <WalletsBannerUpgrading />', () => {
        const desktop: TImageTestID = 'dt_upgrading_desktop';
        const mobile: TImageTestID = 'dt_upgrading_mobile';
        const desktop_eu: TImageTestID = 'dt_upgrading_desktop_eu';
        const mobile_eu: TImageTestID = 'dt_upgrading_mobile_eu';

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

        it('Should render image properly for desktop for Non-EU', () => {
            mockRootStore.ui.is_mobile = false;
            render(<WalletsBannerUpgrading />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('Should render image properly for mobile for Non-EU', () => {
            mockRootStore.ui.is_mobile = true;
            render(<WalletsBannerUpgrading />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });

        it('Should render image properly for desktop for EU', () => {
            mockRootStore.ui.is_mobile = false;
            render(<WalletsBannerUpgrading is_eu={true} />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop_eu);
            const mobile_image = screen.queryByTestId(mobile_eu);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('Should render image properly for mobile for EU', () => {
            mockRootStore.ui.is_mobile = true;
            render(<WalletsBannerUpgrading is_eu={true} />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop_eu);
            const mobile_image = screen.queryByTestId(mobile_eu);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });
    });

    describe('Should render properly with right banner if status is migrated: <WalletsBannerReady />', () => {
        const desktop: TImageTestID = 'dt_ready_desktop';
        const mobile: TImageTestID = 'dt_ready_mobile';
        const desktop_eu: TImageTestID = 'dt_ready_desktop_eu';
        const mobile_eu: TImageTestID = 'dt_ready_mobile_eu';

        it('Should render right title', () => {
            render(<WalletsBannerReady />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const title = screen.queryByText(/Your Wallets are ready/i);

            expect(title).toBeInTheDocument();
        });

        it('Should render tick', () => {
            render(<WalletsBannerReady />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const tick = screen.queryByTestId('dt_wallets_ready_tick');

            expect(tick).toBeInTheDocument();
        });

        it('Should render right button', () => {
            render(<WalletsBannerReady />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const btn = screen.queryByText('Log out');

            expect(btn).toBeInTheDocument();
        });

        it('Should render image properly for desktop for Non-EU', () => {
            mockRootStore.ui.is_mobile = false;
            render(<WalletsBannerReady />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('Should render image properly for mobile for Non-EU', () => {
            mockRootStore.ui.is_mobile = true;
            render(<WalletsBannerReady />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop);
            const mobile_image = screen.queryByTestId(mobile);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });

        it('Should render image properly for desktop for EU', () => {
            mockRootStore.ui.is_mobile = false;
            render(<WalletsBannerReady is_eu={true} />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop_eu);
            const mobile_image = screen.queryByTestId(mobile_eu);

            expect(desktop_image).toBeInTheDocument();
            expect(mobile_image).not.toBeInTheDocument();
        });

        it('Should render image properly for mobile for EU', () => {
            mockRootStore.ui.is_mobile = true;
            render(<WalletsBannerReady is_eu={true} />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });
            const desktop_image = screen.queryByTestId(desktop_eu);
            const mobile_image = screen.queryByTestId(mobile_eu);

            expect(mobile_image).toBeInTheDocument();
            expect(desktop_image).not.toBeInTheDocument();
        });

        it('Should call logout function when click on button', async () => {
            render(<WalletsBannerReady />, {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            });

            const btn = screen.getByText('Log out');

            await userEvent.click(btn);

            expect(btn).toBeInTheDocument();
            expect(mockRootStore.client.logout).toBeCalledTimes(1);
        });
    });
});

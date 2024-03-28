import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useWalletMigration } from '@deriv/hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import WalletsUpgradeModal from '../wallets-upgrade-modal';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWalletMigration: jest.fn(() => ({
        is_eligible: true,
    })),
}));

jest.mock('@deriv/stores', () => ({
    ...jest.requireActual('@deriv/stores'),
    observer: jest.fn(x => x),
}));

describe('<WalletsUpgradeModal />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('Should show modal if user is eligible for migration and is_wallet_modal_closed is not in sessionStorage', () => {
        const mock = mockStore({
            traders_hub: {
                toggleWalletsUpgrade: jest.fn(),
            },
            ui: {
                is_mobile: false,
                is_desktop: true,
            },
        });

        jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<WalletsUpgradeModal />, { wrapper });

        expect(screen.getByText('Introducing Wallets')).toBeInTheDocument();
        expect(screen.getByText('Enable now')).toBeInTheDocument();
    });

    it('Should not show modal if user is not eligible for migration', () => {
        const mock = mockStore({
            traders_hub: {
                toggleWalletsUpgrade: jest.fn(),
            },
            ui: {
                is_mobile: false,
                is_desktop: true,
            },
        });

        (useWalletMigration as jest.Mock).mockImplementationOnce(() => ({
            is_eligible: false,
        }));

        jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<WalletsUpgradeModal />, { wrapper });

        expect(screen.queryByText('Enable now')).not.toBeInTheDocument();
    });

    it('Should not show modal if is_wallet_modal_closed is in sessionStorage', () => {
        const mock = mockStore({
            traders_hub: {
                toggleWalletsUpgrade: jest.fn(),
            },
            ui: {
                is_mobile: false,
                is_desktop: true,
            },
        });

        sessionStorage.setItem('is_wallet_migration_modal_closed', 'true');
        const isWalletMigrationModalClosed = sessionStorage.getItem('is_wallet_migration_modal_closed');

        jest.spyOn(React, 'useState').mockImplementationOnce(() => [!isWalletMigrationModalClosed, jest.fn()]);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<WalletsUpgradeModal />, { wrapper });

        expect(screen.queryByText('Enable now')).not.toBeInTheDocument();
    });

    it('Should close modal when close button is clicked', () => {
        const mock = mockStore({
            traders_hub: {
                toggleWalletsUpgrade: jest.fn(),
            },
            ui: {
                is_mobile: false,
                is_desktop: true,
            },
        });

        const setModalOpen = jest.fn();
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, setModalOpen]);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<WalletsUpgradeModal />, { wrapper });

        const close_button = screen.getByTestId('dt_modal_close_icon');
        userEvent.click(close_button);

        expect(setModalOpen).toHaveBeenCalledWith(false);
        expect(sessionStorage.getItem('is_wallet_migration_modal_closed')).toBe('true');
    });

    // TODO: Add test for clicking Enable now button after the next flow is ready
});

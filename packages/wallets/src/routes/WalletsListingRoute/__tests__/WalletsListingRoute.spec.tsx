import React, { PropsWithChildren } from 'react';
import { useActiveWalletAccount, useAuthorize, useWalletAccountsList } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { ModalProvider } from '../../../components/ModalProvider';
import useDevice from '../../../hooks/useDevice';
import WalletsListingRoute from '../WalletsListingRoute';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
    useAuthorize: jest.fn(),
    useWalletAccountsList: jest.fn(),
}));

jest.mock('../../../hooks/useDevice', () => jest.fn());

jest.mock('../../../components/', () => {
    return {
        DesktopWalletsList: () => <div>DesktopWalletsList</div>,
        WalletsAddMoreCarousel: () => <div>WalletsAddMoreCarousel</div>,
        WalletsCarousel: () => <div>WalletsCarousel</div>,
        WalletTourGuide: () => <div>WalletTourGuide</div>,
    };
});

const wrapper = ({ children }: PropsWithChildren) => <ModalProvider>{children}</ModalProvider>;

describe('WalletsListingRoute', () => {
    let mockSwitchAccount: jest.Mock;

    beforeEach(() => {
        mockSwitchAccount = jest.fn();
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: null });
        (useAuthorize as jest.Mock).mockReturnValue({ switchAccount: mockSwitchAccount });
        (useWalletAccountsList as jest.Mock).mockReturnValue({ data: [{ loginid: '123' }] });
    });

    it('renders DesktopWalletsList, WalletsAddMoreCarousel and WalletTourGuide correctly on desktop', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(<WalletsListingRoute />, { wrapper });
        expect(screen.getByText('DesktopWalletsList')).toBeInTheDocument();
        expect(screen.getByText('WalletTourGuide')).toBeInTheDocument();
        expect(screen.queryByText('WalletsCarousel')).not.toBeInTheDocument();
    });

    it('renders WalletsCarousel and WalletsAddMoreCarousel correctly on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<WalletsListingRoute />, { wrapper });
        expect(screen.queryByText('DesktopWalletsList')).not.toBeInTheDocument();
        expect(screen.getByText('WalletsCarousel')).toBeInTheDocument();
        expect(screen.queryByText('WalletTourGuide')).not.toBeInTheDocument();
    });
});

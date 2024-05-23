import React, { PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import { ModalProvider } from '../../../components/ModalProvider';
import useDevice from '../../../hooks/useDevice';
import WalletsListingRoute from '../WalletsListingRoute';

jest.mock('../../../hooks/useDevice', () => jest.fn());

jest.mock('../../../components/', () => {
    return {
        DesktopWalletsList: () => <div>DesktopWalletsList</div>,
        WalletListHeader: () => <div>WalletListHeader</div>,
        WalletsAddMoreCarousel: () => <div>WalletsAddMoreCarousel</div>,
        WalletsCarousel: () => <div>WalletsCarousel</div>,
        WalletTourGuide: () => <div>WalletTourGuide</div>,
    };
});

const wrapper = ({ children }: PropsWithChildren) => <ModalProvider>{children}</ModalProvider>;

describe('WalletsListingRoute', () => {
    it('renders DesktopWalletsList, WalletsAddMoreCarousel and WalletTourGuide correctly on desktop', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(<WalletsListingRoute />, { wrapper });
        expect(screen.getByText('WalletListHeader')).toBeInTheDocument();
        expect(screen.getByText('DesktopWalletsList')).toBeInTheDocument();
        expect(screen.queryByText('WalletsCarousel')).not.toBeInTheDocument();
        expect(screen.getByText('WalletTourGuide')).toBeInTheDocument();
    });

    it('renders WalletsCarousel and WalletsAddMoreCarousel correctly on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<WalletsListingRoute />, { wrapper });
        expect(screen.getByText('WalletListHeader')).toBeInTheDocument();
        expect(screen.queryByText('DesktopWalletsList')).not.toBeInTheDocument();
        expect(screen.getByText('WalletsCarousel')).toBeInTheDocument();
        expect(screen.queryByText('WalletTourGuide')).toBeInTheDocument();
    });
});

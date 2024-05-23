import React, { ComponentProps, PropsWithChildren } from 'react';
import { WalletTourGuide } from 'src/components/WalletTourGuide';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import useDevice from '../../../hooks/useDevice';
import { ModalProvider } from '../../ModalProvider';
import AccountsList from '../AccountsList';

jest.mock('../../../hooks/useDevice');
const mockUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;

const mockWalletTourGuide = jest.fn();
jest.mock(
    '../../WalletTourGuide/WalletTourGuide',
    // eslint-disable-next-line react/display-name
    () => (props: ComponentProps<typeof WalletTourGuide>) => {
        mockWalletTourGuide(props);
        return (
            <div>
                <p>mock wallet tour guide</p>
            </div>
        );
    }
);

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </WalletsAuthProvider>
    </APIProvider>
);

describe('AccountsList', () => {
    it('should render account list in mobile view', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        render(<AccountsList />, { wrapper });
        expect(screen.getByTestId('dt_tabs')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tab_list')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tab_panels')).toBeInTheDocument();
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.getByText('Options')).toBeInTheDocument();
        expect(screen.getByText('Compare accounts')).toBeInTheDocument();
    });

    it('should show Options tab in mobile view when the tab active', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        render(<AccountsList />, { wrapper });
        expect(screen.getByTestId('dt_tab_panels')).toBeInTheDocument();
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.getAllByText('Options')[0]).toBeInTheDocument();

        screen.getAllByText('Options')[0].click();
        expect(screen.getAllByText('Options')[0]).toBeInTheDocument();
        expect(screen.getByText('Deriv Trader')).toBeInTheDocument();
        expect(screen.getByText('Deriv Bot')).toBeInTheDocument();
        expect(screen.getByText('SmartTrader')).toBeInTheDocument();
        expect(screen.getByText('Binary Bot')).toBeInTheDocument();
        expect(screen.getByText('Deriv GO')).toBeInTheDocument();
    });

    it('should render account list in desktop view', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: true,
            isMobile: false,
            isTablet: false,
        });
        render(<AccountsList />, { wrapper });

        expect(screen.getByTestId('dt_desktop_accounts_list')).toBeInTheDocument();
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.getAllByText('Options')[0]).toBeInTheDocument();
    });

    it('should render wallet tour guide in mobile view with isWalletSettled set to false', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        render(<AccountsList />, { wrapper });
        expect(mockWalletTourGuide);
    });

    it('should render wallet tour guide in mobile view with isWalletSettled set to true', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        render(<AccountsList />, { wrapper });
        expect(mockWalletTourGuide);
    });
});

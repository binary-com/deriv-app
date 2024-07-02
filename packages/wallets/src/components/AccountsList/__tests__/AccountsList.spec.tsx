import React, { ComponentProps, PropsWithChildren } from 'react';
import { WalletTourGuide } from 'src/components/WalletTourGuide';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import useDevice from '../../../hooks/useDevice';
import { TSubscribedBalance } from '../../../types';
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

const mockBalanceData: TSubscribedBalance['balance'] = {
    data: {
        accounts: {
            1234567: {
                balance: 1000.0,
                converted_amount: 1000.0,
                currency: 'USD',
                demo_account: 0,
                status: 1,
                type: 'deriv',
            },
            7654321: {
                balance: 1.0,
                converted_amount: 1.0,
                currency: 'BTC',
                demo_account: 1,
                status: 1,
                type: 'deriv',
            },
        },
        balance: 9990,
        currency: 'USD',
        loginid: 'CRW1314',
    },
    error: undefined,
    isIdle: false,
    isLoading: false,
    isSubscribed: false,
};

describe('AccountsList', () => {
    it('should render account list in mobile view', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        render(<AccountsList balance={mockBalanceData} />, { wrapper });
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
        render(<AccountsList balance={mockBalanceData} />, { wrapper });
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
        render(<AccountsList balance={mockBalanceData} />, { wrapper });

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
        render(<AccountsList balance={mockBalanceData} />, { wrapper });
        expect(mockWalletTourGuide);
    });

    it('should render wallet tour guide in mobile view with isWalletSettled set to true', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
        });
        render(<AccountsList balance={mockBalanceData} />, { wrapper });
        expect(mockWalletTourGuide);
    });
});

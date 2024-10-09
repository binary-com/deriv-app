import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalProvider } from '../../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../../constants';
import AddedMT5AccountsList from '../AddedMT5AccountsList';
import { useAddedMT5Account } from '../hooks';

// mock function to check if correct props are passed to the modal components
const mockPropsFn = jest.fn();

jest.mock('../hooks', () => ({
    useAddedMT5Account: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

jest.mock('../../../../components', () => ({
    ...jest.requireActual('../../../../components'),
    ClientVerificationStatusBadge: jest.fn(props => {
        mockPropsFn(props);
        return <div>ClientVerificationStatusBadge</div>;
    }),
    PlatformStatusBadge: jest.fn(props => {
        mockPropsFn(props);
        return <div>PlatformStatusBadge</div>;
    }),
}));

jest.mock('../../../../modals', () => ({
    ...jest.requireActual('../../../../modals'),
    ClientVerificationModal: jest.fn(props => {
        mockPropsFn(props);
        return <div>ClientVerificationModal</div>;
    }),
    MT5TradeModal: jest.fn(props => {
        mockPropsFn(props);
        return <div>MT5TradeModal</div>;
    }),
    TradingPlatformStatusModal: jest.fn(props => {
        mockPropsFn(props);
        return <div>TradingPlatformStatusModal</div>;
    }),
}));

const mockAccount = {
    display_balance: 'USD 1000.00',
    display_login: '12345678',
    landing_company_short: 'svg',
    market_type: 'financial',
    platform: 'mt5',
    product: 'financial',
    status: 'active',
};

const mockUseAddedMT5AccountData = {
    accountDetails: {
        icon: (
            <>
                icon-{mockAccount.platform}-{mockAccount.product}
            </>
        ),
        title: 'Financial',
    },
    isServerMaintenance: false,
    showClientVerificationModal: false,
    showMT5TradeModal: true,
    showPlatformStatus: false,
};

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <>
        <ModalProvider>{children}</ModalProvider>
    </>
);

describe('AddedMT5AccountsList', () => {
    // const mockShow = jest.fn();

    beforeAll(() => {
        const modalRoot = document.createElement('div');
        modalRoot.setAttribute('id', 'wallets_modal_root');
        document.body.appendChild(modalRoot);
    });
    beforeEach(() => {
        (useAddedMT5Account as jest.Mock).mockReturnValue(mockUseAddedMT5AccountData);
    });

    it('displays added mt5 account with correct account details', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />, { wrapper });

        expect(screen.getByText('icon-mt5-financial')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('USD 1000.00')).toBeInTheDocument();
        expect(screen.getByText('12345678')).toBeInTheDocument();
    });

    it('displays ClientVerificationStatusBadge with correct props', () => {
        (useAddedMT5Account as jest.Mock).mockReturnValue({
            ...mockUseAddedMT5AccountData,
            kycStatus: 'mockKycStatus',
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />, { wrapper });

        expect(screen.getByText('ClientVerificationStatusBadge')).toBeInTheDocument();
        expect(mockPropsFn).toBeCalledWith({
            underlined: true,
            variant: 'mockKycStatus',
        });
    });

    it('shows MT5TradeModal when list is clicked and status is active', async () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />, { wrapper });

        userEvent.click(screen.getByTestId('dt_wallets_trading_account_card'));

        await waitFor(() => {
            expect(screen.getByText('MT5TradeModal')).toBeInTheDocument();
            expect(mockPropsFn).toBeCalledWith({
                marketType: mockAccount.market_type,
                mt5Account: mockAccount,
                platform: PlatformDetails.mt5.platform,
            });
        });
    });

    it('shows ClientVerificationModal when verification has failed', async () => {
        (useAddedMT5Account as jest.Mock).mockReturnValue({
            ...mockUseAddedMT5AccountData,
            showClientVerificationModal: true,
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />, { wrapper });

        userEvent.click(screen.getByTestId('dt_wallets_trading_account_card'));

        await waitFor(() => {
            expect(screen.getByText('ClientVerificationModal')).toBeInTheDocument();
            expect(mockPropsFn).toBeCalledWith({
                account: mockAccount,
            });
        });
    });

    it('shows TradingPlatformStatusModal when platform is under maintenance', async () => {
        (useAddedMT5Account as jest.Mock).mockReturnValue({
            ...mockUseAddedMT5AccountData,
            isServerMaintenance: true,
            showPlatformStatus: true,
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />, { wrapper });

        userEvent.click(screen.getByTestId('dt_wallets_trading_account_card'));

        await waitFor(() => {
            expect(screen.getByText('TradingPlatformStatusModal')).toBeInTheDocument();
            expect(mockPropsFn).toBeCalledWith({
                isServerMaintenance: true,
            });
        });
    });
});

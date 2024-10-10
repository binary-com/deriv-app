import React, { PropsWithChildren } from 'react';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import { ModalProvider, TModalContext, useModal } from '../../../../../../components/ModalProvider';
import { calculateTotalByKey } from '../../../../../../utils/calculate-total-by-key';
import { PlatformDetails } from '../../../../constants';
import { MT5TradeModal } from '../../../../modals';
import AddedCTraderAccountsList from '../AddedCTraderAccountsList';

jest.mock('@deriv/api-v2');
jest.mock('../../../../../../utils/calculate-total-by-key', () => ({
    calculateTotalByKey: jest.fn(),
}));
const mockModalShow = jest.fn();
jest.mock('../../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../../components/ModalProvider'),
    useModal: jest.fn(() => ({
        ...jest.requireActual('../../../../../../components/ModalProvider').useModal(),
        show: mockModalShow,
    })),
}));

const mockAccount = { balance: 2000, currency: 'USD', market_type: 'financial' };

const wrapper = ({ children }: PropsWithChildren) => <ModalProvider>{children}</ModalProvider>;

describe('AddedCTraderAccountsList', () => {
    const mockUseCtraderAccountsList = useCtraderAccountsList as jest.Mock;
    const mockUseModal = useModal as jest.MockedFunction<() => TModalContext>;
    const mockCalculateTotalBalance = calculateTotalByKey as jest.MockedFunction<typeof calculateTotalByKey>;
    const mockShowModal = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseModal.mockReturnValue({
            getModalState: jest.fn(),
            hide: jest.fn(),
            isOpen: false,
            setModalOptions: jest.fn(),
            setModalState: jest.fn(),
            show: mockShowModal,
        });
    });

    it('should render nothing when there are no accounts', () => {
        mockUseCtraderAccountsList.mockReturnValue({ data: null });

        render(<AddedCTraderAccountsList />, { wrapper });

        expect(screen.queryByTestId('dt_wallets_trading_account_card')).not.toBeInTheDocument();
    });

    it('should render the trading account card with account details', () => {
        mockUseCtraderAccountsList.mockReturnValue({ data: [mockAccount] });
        mockCalculateTotalBalance.mockReturnValue('2000.00');

        render(<AddedCTraderAccountsList />, { wrapper });
        expect(screen.getByTestId('dt_wallets_trading_account_card')).toBeInTheDocument();
        expect(screen.getByText(PlatformDetails.ctrader.title)).toBeInTheDocument();
        expect(screen.getByText('2,000.00 USD')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallets_trading_account_chevron_icon')).toBeInTheDocument();
    });

    it('should open the MT5TradeModal when the trading account card is clicked', () => {
        mockUseCtraderAccountsList.mockReturnValue({ data: [mockAccount] });
        mockCalculateTotalBalance.mockReturnValue('2000.00');

        render(<AddedCTraderAccountsList />);

        fireEvent.click(screen.getByTestId('dt_wallets_trading_account_card'));

        expect(mockShowModal).toHaveBeenCalledWith(<MT5TradeModal platform={PlatformDetails.ctrader.platform} />);
    });
});

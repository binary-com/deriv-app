import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ContractDetails from '../contract-details';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import useOrderDetails from 'AppV2/Hooks/useOrderDetails';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../trader-providers';
import moment from 'moment';
import {
    isValidToSell,
    isMultiplierContract,
    isValidToCancel,
    isOpen,
    useWS,
    WS,
    hasContractEntered,
    isForwardStarting,
    isAccumulatorContract,
} from '@deriv/shared';
import { getContractDetailsConfig } from 'AppV2/Utils/contract-details-config';

jest.mock('AppV2/Hooks/useContractDetails', () => jest.fn());
jest.mock('AppV2/Hooks/useOrderDetails', () => jest.fn());
jest.mock('AppV2/Components/ForwardStartingBanner', () => jest.fn(() => <div>ForwardStartingBanner</div>));

jest.mock('AppV2/Components/ContractCard', () => {
    const ContractCard = () => <div data-testid='contract-card'>ContractCard</div>;
    ContractCard.displayName = 'ContractCard';
    return { ContractCard };
});

jest.mock('AppV2/Components/DealCancellation/deal-cancellation.tsx', () => {
    const DealCancellation = () => <div data-testid='deal-cancellation'>Deal Cancellation</div>;
    DealCancellation.displayName = 'DealCancellation';
    return DealCancellation;
});
jest.mock('AppV2/Components/RiskManagementItem/risk-management-item.tsx', () => {
    const RiskManagementItem = () => <div data-testid='risk-management-item'>Risk Management Item</div>;
    RiskManagementItem.displayName = 'RiskManagementItem';
    return RiskManagementItem;
});
jest.mock('AppV2/Components/TakeProfit/take-profit.tsx', () => {
    const TakeProfit = () => <div data-testid='take-profit'>Take Profit</div>;
    TakeProfit.displayName = 'TakeProfit';
    return TakeProfit;
});
jest.mock('AppV2/Components/StopLoss/stop-loss.tsx', () => {
    const StopLoss = () => <div data-testid='stop-loss'>Stop Loss</div>;
    StopLoss.displayName = 'StopLoss';
    return StopLoss;
});

jest.mock('AppV2/Components/ContractDetailsFooter/contract-details-footer.tsx', () => {
    const ContractDetailsFooter = () => (
        <div data-testid='ContractDetailsFooter'>Contract Details Footer Placeholder</div>
    );
    ContractDetailsFooter.displayName = 'ContractDetailsFooter';
    return ContractDetailsFooter;
});

jest.mock('AppV2/Components/EntryExitDetails', () => {
    const EntryExitDetails = () => <div>Entry Exit Details Placeholder</div>;
    EntryExitDetails.displayName = 'EntryExitDetails';
    return EntryExitDetails;
});

jest.mock('AppV2/Components/PayoutInfo', () => {
    const PayoutInfo = () => <div>Payout Info Placeholder</div>;
    PayoutInfo.displayName = 'PayoutInfo';
    return PayoutInfo;
});

jest.mock('AppV2/Components/TakeProfitHistory', () => {
    const TakeProfitHistory = () => <div data-testid='TakeProfitHistory'>Take Profit History Placeholder</div>;
    TakeProfitHistory.displayName = 'TakeProfitHistory';
    return TakeProfitHistory;
});

jest.mock('AppV2/Components/OrderDetails', () => {
    const OrderDetails = () => <div data-testid='TakeProfitHistory'>Order Details Placeholder</div>;
    OrderDetails.displayName = 'OrderDetails';
    return OrderDetails;
});

jest.mock('AppV2/Containers/Chart/contract-details-chart.tsx', () => {
    const ContractDetailsChart = () => <div>Chart Placeholder</div>;
    ContractDetailsChart.displayName = 'ContractDetailsChart';
    return ContractDetailsChart;
});

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isValidToSell: jest.fn(),
    isMultiplierContract: jest.fn(),
    isValidToCancel: jest.fn(),
    isOpen: jest.fn(),
    useWS: jest.fn(),
    hasContractEntered: jest.fn(),
    isForwardStarting: jest.fn(),
    isAccumulatorContract: jest.fn(),
    WS: {
        contractUpdateHistory: jest.fn(),
    },
}));
jest.mock('AppV2/Utils/contract-details-config', () => ({ getContractDetailsConfig: jest.fn() }));

const mockContractInfo = {
    contract_id: 1,
    currency: 'USD',
    contract_type: 'multiplier',
    limit_order: {},
    purchase_time: Date.now(),
    shortcode: 'mock_shortcode',
};

const default_mock_store = {
    modules: {
        trade: {
            active_symbols: [{ symbol: 'R_10' }],
        },
    },
    ui: {
        addToast: jest.fn(),
        current_focus: '',
        is_mobile: true,
        removeToast: jest.fn(),
        setCurrentFocus: jest.fn(),
        should_show_cancellation_warning: false,
        toggleCancellationWarning: jest.fn(),
    },
    common: {
        server_time: moment('2023-11-21 10:59:59'),
    },
    contract_trade: {
        getContractById: jest.fn(),
    },
};

describe('ContractDetails', () => {
    beforeEach(() => {
        (useContractDetails as jest.Mock).mockReturnValue({
            contract_info: mockContractInfo,
            is_loading: false,
        });
        (useOrderDetails as jest.Mock).mockReturnValue({
            details: {},
        });
        (isValidToSell as jest.Mock).mockReturnValue(true);
        (isMultiplierContract as jest.Mock).mockReturnValue(true);
        (isValidToCancel as jest.Mock).mockReturnValue(true);
        (isOpen as jest.Mock).mockReturnValue(true);
        (hasContractEntered as jest.Mock).mockReturnValue(true);
        (isForwardStarting as jest.Mock).mockReturnValue(true);
        (isAccumulatorContract as jest.Mock).mockReturnValue(false);
        (useWS as jest.Mock).mockReturnValue({
            send: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        });
        (WS.contractUpdateHistory as jest.Mock).mockResolvedValue({
            contract_update_history: [],
        });
        (getContractDetailsConfig as jest.Mock).mockReturnValue({
            isTakeProfitVisible: true,
            isStopLossVisible: true,
            isDealCancellationVisible: true,
            isTpHistoryVisible: true,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderContractDetails = () => {
        render(
            <TraderProviders store={mockStore(default_mock_store)}>
                <ContractDetails />
            </TraderProviders>
        );
    };

    it('should render the ForwardStartingBanner component', async () => {
        await waitFor(() => renderContractDetails());
        expect(screen.getByText('ForwardStartingBanner')).toBeInTheDocument();
    });

    it('should render the ContractCard component', async () => {
        await waitFor(() => renderContractDetails());
        expect(screen.getByText('ContractCard')).toBeInTheDocument();
    });

    it('should render the Chart component', async () => {
        await waitFor(() => renderContractDetails());
        expect(screen.getByText('Chart Placeholder')).toBeInTheDocument();
    });

    it('should render the DealCancellation component', async () => {
        await waitFor(() => renderContractDetails());
        expect(screen.getByText('Deal Cancellation')).toBeInTheDocument();
    });

    it('should render the TakeProfit and StopLoss components if conditions are met', async () => {
        await waitFor(() => renderContractDetails());
        expect(screen.getByTestId('take-profit')).toBeInTheDocument();
        expect(screen.getByTestId('stop-loss')).toBeInTheDocument();
    });

    it('should render the OrderDetails component', async () => {
        await waitFor(() => renderContractDetails());
        expect(screen.getByText('Order Details Placeholder')).toBeInTheDocument();
    });

    it('should render the PayoutInfo component', async () => {
        await waitFor(() => renderContractDetails());
        expect(screen.getByText('Payout Info Placeholder')).toBeInTheDocument();
    });

    it('should render the EntryExitDetails component', async () => {
        await waitFor(() => renderContractDetails());
        expect(screen.getByText('Entry Exit Details Placeholder')).toBeInTheDocument();
    });

    it('should render the TakeProfitHistory component if history is available', async () => {
        (WS.contractUpdateHistory as jest.Mock).mockResolvedValueOnce({
            contract_update_history: [
                {
                    order_date: '2021-01-01',
                },
            ],
        });
        await waitFor(() => {
            renderContractDetails();
            expect(screen.getByText('Take Profit History Placeholder')).toBeInTheDocument();
        });
    });

    it('should render the ContractDetailsFooter component if conditions are met', async () => {
        await waitFor(() => renderContractDetails());
        expect(screen.getByText('Contract Details Footer Placeholder')).toBeInTheDocument();
    });

    it('should not render the ContractDetailsFooter component if conditions are not met', async () => {
        (hasContractEntered as jest.Mock).mockReturnValue(false);
        (isForwardStarting as jest.Mock).mockReturnValue(false);
        await waitFor(() => renderContractDetails());
        expect(screen.queryByText('Contract Details Footer Placeholder')).not.toBeInTheDocument();
    });

    it('should render loader if is_loading === true', async () => {
        (useContractDetails as jest.Mock).mockReturnValue({
            contract_info: mockContractInfo,
            is_loading: true,
        });
        await waitFor(() => renderContractDetails());
        expect(screen.getByTestId('dt_contract_details_loader')).toBeInTheDocument();
    });
});

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { ReportsStoreProvider } from '../../../../../../reports/src/Stores/useReportsStores';
import TraderProviders from '../../../../trader-providers';
import ModulesProvider from 'Stores/Providers/modules-providers';
import PositionsContent, { TClosedPosition } from '../positions-content';
import { TPortfolioPosition } from '@deriv/stores/types';

const contractTypeFilter = 'Filter by trade types';
const contractCardList = 'ContractCardList';
const emptyPositions = 'EmptyPositions';
const loaderTestId = 'dt_positions_loader';
const totalProfitLoss = 'Total profit/loss:';

const mediaQueryList = {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

window.matchMedia = jest.fn().mockImplementation(() => mediaQueryList);

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        activeSymbols: jest.fn(),
        authorized: {
            activeSymbols: jest.fn(),
            subscribeProposalOpenContract: jest.fn(),
            send: jest.fn(),
        },
        buy: jest.fn(),
        storage: {
            contractsFor: jest.fn(),
            send: jest.fn(),
        },
        contractUpdate: jest.fn(),
        contractUpdateHistory: jest.fn(),
        subscribeTicksHistory: jest.fn(),
        forgetStream: jest.fn(),
        forget: jest.fn(),
        forgetAll: jest.fn(),
        send: jest.fn(),
        subscribeProposal: jest.fn(),
        subscribeTicks: jest.fn(),
        time: jest.fn(),
        tradingTimes: jest.fn(),
        wait: jest.fn(),
        profitTable: jest.fn().mockReturnValue({
            profit_table: {
                transactions: [
                    {
                        contract_info: {
                            app_id: 16929,
                            buy_price: 10,
                            contract_id: 243705193508,
                            contract_type: 'TURBOSLONG',
                            duration_type: 'minutes',
                            longcode:
                                'You will receive a payout at expiry if the spot price never breaches the barrier. The payout is equal to the payout per point multiplied by the distance between the final price and the barrier.',
                            payout: 0,
                            purchase_time: '28 May 2024 10:18:24',
                            sell_price: 0,
                            sell_time: '28 May 2024 10:21:08',
                            shortcode: 'TURBOSLONG_1HZ100V_10.00_1716891504_1716891900_S-255P_3.692058_1716891504',
                            transaction_id: 486048790368,
                            underlying_symbol: '1HZ100V',
                            profit_loss: '-10.00',
                            display_name: '',
                            purchase_time_unix: 1716891504,
                        },
                    },
                ],
            },
        }),
    },
}));

jest.mock('AppV2/Components/ContractCard', () => ({
    ...jest.requireActual('AppV2/Components/ContractCard'),
    ContractCardList: jest.fn(({ positions }: { positions: (TPortfolioPosition | TClosedPosition)[] }) => (
        <div>
            <p>{contractCardList}</p>
            <ul>
                {positions.map(({ contract_info }) => (
                    <li key={contract_info.contract_id}>{contract_info.contract_type}</li>
                ))}
            </ul>
        </div>
    )),
    ContractCardsSections: jest.fn(() => <div>ContractCardsSections</div>),
}));

jest.mock('AppV2/Components/EmptyPositions', () => ({
    ...jest.requireActual('AppV2/Components/EmptyPositions'),
    EmptyPositions: jest.fn(() => <div>{emptyPositions}</div>),
}));

jest.mock('AppV2/Components/Filter', () => ({
    ...jest.requireActual('AppV2/Components/Filter'),
    ContractTypeFilter: jest.fn(() => <div>{contractTypeFilter}</div>),
    TimeFilter: jest.fn(() => <div>TimeFilter</div>),
}));

describe('PositionsContent', () => {
    let defaultMockStore: ReturnType<typeof mockStore>;

    const mockProps = {
        hasButtonsDemo: false,
        setHasButtonsDemo: jest.fn(),
    };

    beforeEach(() => {
        defaultMockStore = mockStore({
            portfolio: {
                active_positions: [
                    {
                        contract_info: {
                            account_id: 147849428,
                            barrier_count: 1,
                            bid_price: 41.4,
                            buy_price: 10,
                            commission: 0.36,
                            contract_id: 243687440268,
                            contract_type: 'MULTUP',
                            currency: 'USD',
                            current_spot: 807.2,
                            current_spot_display_value: '807.20',
                            current_spot_time: 1716882618,
                            date_expiry: 4870540799,
                            date_settlement: 4870540800,
                            date_start: 1716877413,
                            display_name: 'Volatility 100 (1s) Index',
                            entry_spot: 782.35,
                            entry_spot_display_value: '782.35',
                            entry_tick: 782.35,
                            entry_tick_display_value: '782.35',
                            entry_tick_time: 1716877414,
                            expiry_time: 4870540799,
                            id: '3f168dfb-c3c3-5cb2-e636-e7b6e25a7c56',
                            is_expired: 0,
                            is_forward_starting: 0,
                            is_intraday: 0,
                            is_path_dependent: 1,
                            is_settleable: 0,
                            is_sold: 0,
                            is_valid_to_cancel: 0,
                            is_valid_to_sell: 1,
                            limit_order: {
                                stop_out: {
                                    display_name: 'Stop out',
                                    order_amount: -10,
                                    order_date: 1716877413,
                                    value: '774.81',
                                },
                            },
                            longcode:
                                "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 1000, minus commissions.",
                            multiplier: 100,
                            profit: 31.4,
                            profit_percentage: 314,
                            purchase_time: 1716877413,
                            shortcode: 'MULTUP_1HZ100V_10.00_100_1716877413_4870540799_0_0.00_N1',
                            status: 'open',
                            transaction_ids: {
                                buy: 486015531488,
                            },
                            underlying: '1HZ100V',
                        },
                        details:
                            "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 1000, minus commissions.",
                        display_name: '',
                        id: 243687440268,
                        indicative: 41.4,
                        purchase: 10,
                        reference: 486015531488,
                        type: 'MULTUP',
                        contract_update: {
                            stop_out: {
                                display_name: 'Stop out',
                                order_amount: -10,
                                order_date: 1716877413,
                                value: '774.81',
                            },
                        },
                        entry_spot: 782.35,
                        profit_loss: 31.4,
                        is_valid_to_sell: true,
                        status: 'profit',
                    },
                    {
                        contract_info: {
                            account_id: 147849428,
                            barrier: '821.69',
                            barrier_count: 1,
                            bid_price: 4.4,
                            buy_price: 10,
                            contract_id: 243705193508,
                            contract_type: 'TURBOSLONG',
                            currency: 'USD',
                            current_spot: 823.04,
                            current_spot_display_value: '823.04',
                            current_spot_time: 1716891600,
                            date_expiry: 1716891900,
                            date_settlement: 1716891900,
                            date_start: 1716891504,
                            display_name: 'Volatility 100 (1s) Index',
                            display_number_of_contracts: '3.692058',
                            entry_spot: 824.24,
                            entry_spot_display_value: '824.24',
                            entry_tick: 824.24,
                            entry_tick_display_value: '824.24',
                            entry_tick_time: 1716891504,
                            expiry_time: 1716891900,
                            id: '631c07ee-ff93-a6e0-3e14-7917581b8b1b',
                            is_expired: 0,
                            is_forward_starting: 0,
                            is_intraday: 1,
                            is_path_dependent: 1,
                            is_settleable: 0,
                            is_sold: 0,
                            is_valid_to_cancel: 0,
                            is_valid_to_sell: 1,
                            longcode:
                                'You will receive a payout at expiry if the spot price never breaches the barrier. The payout is equal to the payout per point multiplied by the distance between the final price and the barrier.',
                            profit: -5.6,
                            profit_percentage: -56,
                            purchase_time: 1716891504,
                            shortcode: 'TURBOSLONG_1HZ100V_10.00_1716891504_1716891900_S-255P_3.692058_1716891504',
                            status: 'open',
                            transaction_ids: {
                                buy: 486048790368,
                            },
                            underlying: '1HZ100V',
                        },
                        details:
                            'You will receive a payout at expiry if the spot price never breaches the barrier. The payout is equal to the payout per point multiplied by the distance between the final price and the barrier.',
                        display_name: '',
                        id: 243705193508,
                        indicative: 4.4,
                        purchase: 10,
                        reference: 486048790368,
                        type: 'TURBOSLONG',
                        barrier: 821.69,
                        entry_spot: 824.24,
                        profit_loss: -5.6,
                        is_valid_to_sell: true,
                        status: 'profit',
                    },
                ],
            },
            modules: {
                profit_table: {
                    data: [],
                    handleScroll: jest.fn(),
                    is_empty: true,
                    is_loading: false,
                    onMount: jest.fn(),
                    onUnmount: jest.fn(),
                    handleDateChange: jest.fn(),
                },
                positions: {
                    openContractTypeFilter: [],
                    closedContractTypeFilter: [],
                    timeFilter: '',
                    customTimeRangeFilter: '',
                    setClosedContractTypeFilter: jest.fn(),
                    setOpenContractTypeFilter: jest.fn(),
                    setTimeFilter: jest.fn(),
                    setCustomTimeRangeFilter: jest.fn(),
                },
            },
        });
    });

    const mockPositionsContent = (isClosedTab = false) => {
        return (
            <BrowserRouter>
                <TraderProviders store={defaultMockStore}>
                    <ReportsStoreProvider>
                        <ModulesProvider store={defaultMockStore}>
                            <PositionsContent {...mockProps} isClosedTab={isClosedTab} />
                        </ModulesProvider>
                    </ReportsStoreProvider>
                </TraderProviders>
            </BrowserRouter>
        );
    };

    it('should render loader if there is no data yet', () => {
        defaultMockStore = mockStore({});
        render(mockPositionsContent());

        expect(screen.getByTestId(loaderTestId)).toBeInTheDocument();
    });

    it('should render loader if is_loading is true in portfolio-store', () => {
        defaultMockStore = mockStore({ portfolio: { ...defaultMockStore.portfolio, is_loading: true } });
        render(mockPositionsContent());

        expect(screen.getByTestId(loaderTestId)).toBeInTheDocument();
    });

    it('should render EmptyPositions if data has loaded but user has no open positions', () => {
        defaultMockStore = mockStore({ portfolio: { active_positions: [], is_active_empty: true } });
        render(mockPositionsContent());

        expect(screen.getByText(emptyPositions)).toBeInTheDocument();
    });

    it('should render EmptyPositions if data has loaded but user has no closed positions', () => {
        render(mockPositionsContent(true));

        expect(screen.getByText(emptyPositions)).toBeInTheDocument();
    });

    it('should render contract type filter, total profit/loss and contract card list for open positions if they exist', () => {
        render(mockPositionsContent());

        expect(screen.queryByText(emptyPositions)).not.toBeInTheDocument();
        expect(screen.getByText(contractTypeFilter)).toBeInTheDocument();
        expect(screen.getByText(totalProfitLoss)).toBeInTheDocument();
        expect(screen.getByText(contractCardList)).toBeInTheDocument();
    });

    it('should show EmptyPositions component if user chose contract type filter and such contracts are absent from positions', () => {
        defaultMockStore = mockStore({
            modules: {
                ...defaultMockStore.modules,
                positions: {
                    ...defaultMockStore.modules.positions,
                    openContractTypeFilter: ['Accumulators'],
                },
            },
            portfolio: defaultMockStore.portfolio,
        });
        render(mockPositionsContent());

        expect(screen.getByText(emptyPositions)).toBeInTheDocument();
    });

    it('should show filtered cards if user chose contract type filter and such contracts are present in positions', () => {
        defaultMockStore = mockStore({
            modules: {
                ...defaultMockStore.modules,
                positions: {
                    ...defaultMockStore.modules.positions,
                    openContractTypeFilter: ['Multipliers'],
                },
            },
            portfolio: defaultMockStore.portfolio,
        });
        render(mockPositionsContent());

        expect(screen.queryByText(emptyPositions)).not.toBeInTheDocument();
        expect(screen.queryByText('TURBOSLONG')).not.toBeInTheDocument();
        expect(screen.getByText('MULTUP')).toBeInTheDocument();
    });

    it('should show all cards if a user has reset the filter', () => {
        defaultMockStore = mockStore({
            modules: {
                ...defaultMockStore.modules,
                positions: {
                    ...defaultMockStore.modules.positions,
                    openContractTypeFilter: [],
                },
            },
            portfolio: defaultMockStore.portfolio,
        });
        render(mockPositionsContent());

        expect(screen.queryByText(emptyPositions)).not.toBeInTheDocument();
        expect(screen.getByText('MULTUP')).toBeInTheDocument();
        expect(screen.getByText('TURBOSLONG')).toBeInTheDocument();
    });
});

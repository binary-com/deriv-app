import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TCoreStores } from '@deriv/stores/types';
import { isMobile } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import Statement from '../statement';
import ReportsProviders from '../../reports-providers';
import { useReportsStore } from 'Stores/useReportsStores';

jest.mock('Stores/useReportsStores', () => ({
    ...jest.requireActual('Stores/useReportsStores'),
    useReportsStore: jest.fn(() => ({
        statement: {
            action_type: 'all',
            data: [
                {
                    action: 'Sell',
                    date: '04 Jun 2024 01:47:16',
                    display_name: '',
                    refid: 487679411128,
                    payout: '0.00',
                    amount: '11.00',
                    balance: '8,866.19',
                    desc: "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 Index, multiplied by 50, minus commissions.",
                    id: 243990619668,
                    app_id: 2,
                    shortcode: 'MULTUP_R_100_5.00_10_1717078783_4870713599_0_6.00_N1',
                    action_type: 'sell',
                    purchase_time: 1717078783,
                    transaction_time: 1717465636,
                },
                {
                    action: 'Buy',
                    date: '31 May 2024 19:42:42',
                    display_name: '',
                    refid: 486932886768,
                    payout: '0.00',
                    amount: '-10.00',
                    balance: '8,845.35',
                    desc: "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 100, minus commissions.",
                    id: 244170956768,
                    app_id: 36300,
                    shortcode: 'MULTUP_1HZ100V_10.00_10_1717184563_4870799999_0_33.00_N1',
                    action_type: 'buy',
                    transaction_time: 1717184562,
                },
            ],
            date_from: null,
            date_to: 1717631999,
            has_selected_date: true,
            handleScroll: jest.fn(),
            is_empty: false,
            is_loading: false,
            onMount: jest.fn(),
            onUnmount: jest.fn(),
        },
    })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    WS: {
        forgetAll: jest.fn(),
        wait: jest.fn(),
        statement: jest.fn().mockReturnValue({
            statement: {
                transactions: [
                    {
                        action_type: 'sell',
                        amount: 11,
                        app_id: 2,
                        balance_after: 8866.19,
                        contract_id: 243990619668,
                        longcode:
                            "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 Index, multiplied by 50, minus commissions.",
                        payout: 0,
                        purchase_time: 1717078783,
                        reference_id: 486589408728,
                        shortcode: 'MULTUP_R_100_5.00_10_1717078783_4870713599_0_6.00_N1',
                        transaction_id: 487679411128,
                        transaction_time: 1717465636,
                    },
                    {
                        action_type: 'buy',
                        amount: -10,
                        app_id: 36300,
                        balance_after: 8845.35,
                        contract_id: 244170956768,
                        longcode:
                            "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 100, minus commissions.",
                        payout: 0,
                        reference_id: null,
                        shortcode: 'MULTUP_1HZ100V_10.00_10_1717184563_4870799999_0_33.00_N1',
                        transaction_id: 486932886768,
                        transaction_time: 1717184562,
                    },
                ],
            },
        }),
    },
}));

describe('Statement', () => {
    let store = mockStore({});
    const allTransactions = 'All transactions';
    const dataTableTestId = 'dt_data_table';
    const dataListTestId = 'dt_data_list';
    const loadingTestId = 'dt_loading_component';
    const noTransationsShortText = 'You have no transactions yet.';
    const noTransationsLongText = "You've made no transactions of this type during this period.";
    const mockedErrorMessage = 'Error message';
    const props: React.ComponentProps<typeof Statement> = {
        component_icon: 'IcStatement',
    };
    const mockedStatement = (
        mockedStore: TCoreStores = store,
        mockedProps: React.ComponentProps<typeof Statement> = props
    ) => {
        return (
            <ReportsProviders store={mockedStore}>
                <MemoryRouter>
                    <Statement {...mockedProps} />
                </MemoryRouter>
            </ReportsProviders>
        );
    };
    beforeEach(() => {
        store = mockStore({
            client: {
                currency: 'USD',
                is_switching: false,
                is_virtual: true,
            },
        });
        (isMobile as jest.Mock).mockReturnValue(false);
    });
    it('should render filter with All transactions selected and DataTable for desktop', () => {
        render(mockedStatement());
        expect(screen.getByText(allTransactions)).toBeInTheDocument();
        expect(screen.getByTestId(dataTableTestId)).toBeInTheDocument();
    });
    it('should render filter but no DataTable if data is empty on desktop', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                data: [],
            },
        });
        render(mockedStatement());
        expect(screen.getByText(allTransactions)).toBeInTheDocument();
        expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
    });
    it('should render filter dropdown with All transactions selected and DataList for mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        render(mockedStatement());
        expect(screen.getByRole('combobox')).toHaveValue('all');
        expect(screen.getByTestId(dataListTestId)).toBeInTheDocument();
    });
    it('should render filter dropdown but no DataList if data is empty on mobile', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                data: [],
            },
        });
        (isMobile as jest.Mock).mockReturnValue(true);
        render(mockedStatement());
        expect(screen.getByRole('combobox')).toHaveValue('all');
        expect(screen.queryByTestId(dataListTestId)).not.toBeInTheDocument();
    });
    it('should render error if it is defined', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                error: mockedErrorMessage,
            },
        });
        render(mockedStatement());
        expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
        expect(screen.getByText(mockedErrorMessage)).toBeInTheDocument();
    });
    it('should render a long No transactions message when data is empty & is_empty === true & has_selected_date === true', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                data: [],
                is_empty: true,
            },
        });
        render(mockedStatement());
        expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
        expect(screen.getByText(noTransationsLongText)).toBeInTheDocument();
    });
    it('should render a short No transactions message when data is empty & is_empty === true & has_selected_date === false', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                data: [],
                is_empty: true,
                has_selected_date: false,
            },
        });
        render(mockedStatement());
        expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
        expect(screen.getByText(noTransationsShortText)).toBeInTheDocument();
    });
    it('should render Loading when data is empty & is_loading === true', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                data: [],
                is_loading: true,
            },
        });
        render(mockedStatement());
        expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
        expect(screen.getByTestId(loadingTestId)).toBeInTheDocument();
    });
    it('should render Loading when is_switching === true', () => {
        store.client.is_switching = true;
        render(mockedStatement());
        expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
        expect(screen.getByTestId(loadingTestId)).toBeInTheDocument();
    });
    it('should render transactions together with Loading when data is available & is_loading === true', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                is_loading: true,
            },
        });
        render(mockedStatement());
        expect(screen.getByTestId(dataTableTestId)).toBeInTheDocument();
        expect(screen.getByTestId(loadingTestId)).toBeInTheDocument();
    });
});

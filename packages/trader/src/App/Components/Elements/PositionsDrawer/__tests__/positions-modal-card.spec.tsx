import React from 'react';
import moment from 'moment';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { getCardLabels, mockContractInfo, TRADE_TYPES } from '@deriv/shared';
import { ActiveSymbols } from '@deriv/api-types';
import PositionsModalCard from '../positions-modal-card';
import TraderProviders from '../../../../../trader-providers';

const closed_label = 'Closed';
const currency_badge = 'CurrencyBadge';
const positions_card_loader = 'Positions Card Loader';
const progress_slider_mobile = 'ProgressSliderMobile';
const symbol_display_name = 'Symbol Display Name';
const underlying = 'test_underlying';
const usd = 'USD';

const default_mock_props: React.ComponentProps<typeof PositionsModalCard> = {
    className: 'test_className',
    contract_info: mockContractInfo({
        barrier: '2650.0',
        bid_price: 10,
        buy_price: 7,
        contract_id: 123386875,
        contract_type: TRADE_TYPES.VANILLA.CALL,
        currency: usd,
        date_start: 123532989,
        date_expiry: 626512765,
        entry_spot: 2666.0,
        entry_spot_display_value: '2666.0',
        is_sold: 0,
        profit: 3,
        underlying: '',
    }),
    contract_update: {},
    currency: usd,
    current_tick: 6,
    id: 123386875,
    indicative: 23.45,
    is_loading: false,
    is_sell_requested: false,
    onClickSell: jest.fn(),
    profit_loss: 3,
    onClickCancel: jest.fn(),
    togglePositions: jest.fn(),
};

const default_mock_store = {
    modules: {
        trade: {
            active_symbols: [{ symbol: 'R_10' }] as ActiveSymbols,
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

jest.mock('App/Components/Elements/ContentLoader', () => ({
    ...jest.requireActual('App/Components/Elements/ContentLoader'),
    PositionsCardLoader: jest.fn(() => <div>{positions_card_loader}</div>),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getSymbolDisplayName: jest.fn(() => symbol_display_name),
}));
jest.mock('App/Components/Routes', () => ({
    ...jest.requireActual('App/Components/Routes'),
    BinaryLink: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    CurrencyBadge: jest.fn(() => <div>{currency_badge}</div>),
    ProgressSliderMobile: jest.fn(() => <div>{progress_slider_mobile}</div>),
}));

describe('<PositionsModalCard />', () => {
    const {
        CONTRACT_VALUE,
        ENTRY_SPOT,
        POTENTIAL_PAYOUT: PAYOUT_LIMIT,
        STAKE,
        STRIKE,
        TAKE_PROFIT,
        TOTAL_PROFIT_LOSS,
    } = getCardLabels();

    const mockPositionsModalCard = (
        mocked_store: TCoreStores,
        mocked_params: React.ComponentProps<typeof PositionsModalCard>
    ) => {
        return (
            <TraderProviders store={mocked_store}>
                <PositionsModalCard {...mocked_params} />
            </TraderProviders>
        );
    };

    it('should render loader if underlying in contract_info is falsy and contract is supported', () => {
        render(mockPositionsModalCard(mockStore(default_mock_store), { ...default_mock_props }));

        expect(screen.getByText(positions_card_loader)).toBeInTheDocument();
    });
    it('should render specific contract card for Vanillas', () => {
        render(
            mockPositionsModalCard(mockStore(default_mock_store), {
                ...default_mock_props,
                contract_info: { ...default_mock_props.contract_info, underlying },
            })
        );

        expect(screen.queryByText(positions_card_loader)).not.toBeInTheDocument();
        expect(screen.getByText(symbol_display_name)).toBeInTheDocument();
        expect(screen.getByText(currency_badge)).toBeInTheDocument();
        expect(screen.getByText(STAKE)).toBeInTheDocument();
        expect(screen.getByText(/7.00/i)).toBeInTheDocument();
        expect(screen.getByText(CONTRACT_VALUE)).toBeInTheDocument();
        expect(screen.getByText(/10.00/i)).toBeInTheDocument();
        expect(screen.getByText(ENTRY_SPOT)).toBeInTheDocument();
        expect(screen.getByText(/2,666/i)).toBeInTheDocument();
        expect(screen.getByText(STRIKE)).toBeInTheDocument();
        expect(screen.getByText(/2,650.0/i)).toBeInTheDocument();
        expect(screen.queryByText(closed_label)).not.toBeInTheDocument();
        expect(screen.getByText(progress_slider_mobile)).toBeInTheDocument();
        expect(screen.getByText(TOTAL_PROFIT_LOSS)).toBeInTheDocument();
        expect(screen.getByText(/3.00/i)).toBeInTheDocument();
    });
    it('should render a specific closed contract card for Vanillas', () => {
        render(
            mockPositionsModalCard(mockStore(default_mock_store), {
                ...default_mock_props,
                contract_info: {
                    ...default_mock_props.contract_info,
                    bid_price: 10,
                    buy_price: 7,
                    is_sold: 1,
                    profit: 2,
                    sell_price: 8,
                    underlying,
                },
            })
        );

        expect(screen.queryByText(positions_card_loader)).not.toBeInTheDocument();
        expect(screen.getByText(symbol_display_name)).toBeInTheDocument();
        expect(screen.getByText(currency_badge)).toBeInTheDocument();
        expect(screen.getByText(STAKE)).toBeInTheDocument();
        expect(screen.getByText(/7.00/i)).toBeInTheDocument();
        expect(screen.getByText(CONTRACT_VALUE)).toBeInTheDocument();
        expect(screen.getByText(/8.00/i)).toBeInTheDocument();
        expect(screen.getByText(ENTRY_SPOT)).toBeInTheDocument();
        expect(screen.getByText(/2,666/i)).toBeInTheDocument();
        expect(screen.getByText(STRIKE)).toBeInTheDocument();
        expect(screen.getByText(/2,650.0/i)).toBeInTheDocument();
        expect(screen.queryByText(progress_slider_mobile)).not.toBeInTheDocument();
        expect(screen.getByText(closed_label)).toBeInTheDocument();
        expect(screen.getByText(TOTAL_PROFIT_LOSS)).toBeInTheDocument();
        expect(screen.getByText(/2.00/i)).toBeInTheDocument();
    });
    it('should render specific contract card for Turbos', () => {
        render(
            mockPositionsModalCard(mockStore(default_mock_store), {
                ...default_mock_props,
                contract_info: {
                    ...default_mock_props.contract_info,
                    contract_type: TRADE_TYPES.TURBOS.LONG,
                    underlying,
                },
            })
        );

        expect(screen.queryByText(positions_card_loader)).not.toBeInTheDocument();
        expect(screen.getByText(symbol_display_name)).toBeInTheDocument();
        expect(screen.getByText('Up')).toBeInTheDocument();
        expect(screen.getByText(usd)).toBeInTheDocument();
        expect(screen.getByText(STAKE)).toBeInTheDocument();
        expect(screen.getByText(/10.00/i)).toBeInTheDocument();
        expect(screen.getByText(CONTRACT_VALUE)).toBeInTheDocument();
        expect(screen.getByText(/7.00/i)).toBeInTheDocument();
        expect(screen.getByText(ENTRY_SPOT)).toBeInTheDocument();
        expect(screen.getByText(TAKE_PROFIT)).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument();
        expect(screen.getByText(/Barrier:/i)).toBeInTheDocument();
        expect(screen.getByText(/2,650.0/i)).toBeInTheDocument();
    });
    it('should render contract card for Rise/Fall', () => {
        render(
            mockPositionsModalCard(mockStore(default_mock_store), {
                ...default_mock_props,
                contract_info: {
                    ...default_mock_props.contract_info,
                    contract_type: TRADE_TYPES.RISE_FALL,
                    underlying,
                },
            })
        );

        expect(screen.queryByText(positions_card_loader)).not.toBeInTheDocument();
        expect(screen.getByText(symbol_display_name)).toBeInTheDocument();
        expect(screen.getByText(usd)).toBeInTheDocument();
        expect(screen.getByText(TOTAL_PROFIT_LOSS)).toBeInTheDocument();
        expect(screen.getByText(CONTRACT_VALUE)).toBeInTheDocument();
        expect(screen.getByText(/7.00/i)).toBeInTheDocument();
        expect(screen.getByText(STAKE)).toBeInTheDocument();
        expect(screen.getByText(/10.00/i)).toBeInTheDocument();
        expect(screen.getByText(PAYOUT_LIMIT)).toBeInTheDocument();
    });
    it('should render the same contract card for Touch/No Touch as for Rise/Fall', () => {
        render(
            mockPositionsModalCard(mockStore(default_mock_store), {
                ...default_mock_props,
                contract_info: {
                    ...default_mock_props.contract_info,
                    contract_type: TRADE_TYPES.TOUCH,
                    underlying,
                },
            })
        );

        expect(screen.queryByText(positions_card_loader)).not.toBeInTheDocument();
        expect(screen.getByText(symbol_display_name)).toBeInTheDocument();
        expect(screen.getByText(usd)).toBeInTheDocument();
        expect(screen.getByText(TOTAL_PROFIT_LOSS)).toBeInTheDocument();
        expect(screen.getByText(CONTRACT_VALUE)).toBeInTheDocument();
        expect(screen.getByText(/7.00/i)).toBeInTheDocument();
        expect(screen.getByText(STAKE)).toBeInTheDocument();
        expect(screen.getByText(/10.00/i)).toBeInTheDocument();
        expect(screen.getByText(PAYOUT_LIMIT)).toBeInTheDocument();
    });
    it('should render the contract card for Multipliers', () => {
        render(
            mockPositionsModalCard(mockStore(default_mock_store), {
                ...default_mock_props,
                contract_info: {
                    ...default_mock_props.contract_info,
                    contract_type: TRADE_TYPES.MULTIPLIER,
                    underlying,
                },
            })
        );

        expect(screen.queryByText(positions_card_loader)).not.toBeInTheDocument();
        expect(screen.getByText(symbol_display_name)).toBeInTheDocument();
        expect(screen.getByText(usd)).toBeInTheDocument();
        expect(screen.getByText('Stake:')).toBeInTheDocument();
        expect(screen.getByText(/Contract value:/i)).toBeInTheDocument();
        expect(screen.getByText(/10.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Deal cancel. fee:/i)).toBeInTheDocument();
        expect(screen.getByText(TAKE_PROFIT)).toBeInTheDocument();
        expect(screen.getByText(/Stop loss:/i)).toBeInTheDocument();
        expect(screen.getByText(TOTAL_PROFIT_LOSS)).toBeInTheDocument();
    });

    it('should not render arrow indicator if the contract was sold (is_sold === 1)', () => {
        render(
            mockPositionsModalCard(mockStore(default_mock_store), {
                ...default_mock_props,
                contract_info: {
                    ...default_mock_props.contract_info,
                    is_sold: 1,
                },
            })
        );

        expect(screen.queryByTestId('dt_arrow_indicator')).not.toBeInTheDocument();
    });
});

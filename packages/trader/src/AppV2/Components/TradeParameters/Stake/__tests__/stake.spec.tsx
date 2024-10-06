import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';
import Stake from '../stake';

const stake_param_label = 'Stake';
const input_placeholder = 'Amount';
const save_button_label = 'Save';

describe('Stake', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(
        () =>
            (default_mock_store = mockStore({
                modules: {
                    trade: {
                        ...mockStore({}),
                        amount: 10,
                        basis: 'stake',
                        contract_type: TRADE_TYPES.RISE_FALL,
                        currency: 'USD',
                        proposal_info: {
                            [CONTRACT_TYPES.CALL]: {
                                id: '53e8cb91-8c13-60a3-289f-778e8386367c',
                                has_error: false,
                                message:
                                    'Win payout if Volatility 100 (1s) Index is strictly higher than entry spot at 5 minutes after contract start time.',
                                payout: 19.55,
                            },
                            [CONTRACT_TYPES.PUT]: {
                                id: '2b5dd806-7505-8af7-1bbb-5e24ac48bbbc',
                                has_error: false,
                                message:
                                    'Win payout if Volatility 100 (1s) Index is strictly lower than entry spot at 5 minutes after contract start time.',
                                payout: 19.51,
                            },
                        },
                        trade_types: {
                            [CONTRACT_TYPES.CALL]: 'Higher',
                            [CONTRACT_TYPES.PUT]: 'Lower',
                        },
                        validation_errors: { amount: [] },
                        validation_params: {
                            [CONTRACT_TYPES.CALL]: { payout: { max: '50000.00' } },
                            [CONTRACT_TYPES.PUT]: { payout: { max: '50000.00' } },
                        },
                        v2_params_initial_values: {
                            stake: 10,
                        },
                    },
                },
            }))
    );

    const MockedStake = ({ store = default_mock_store }: { store?: ReturnType<typeof mockStore> }) => (
        <TraderProviders store={store}>
            <ModulesProvider store={store}>
                <Stake is_minimized />
            </ModulesProvider>
        </TraderProviders>
    );

    it('should switch basis to stake if it is different', () => {
        default_mock_store.modules.trade.basis = 'payout';
        render(<MockedStake />);

        expect(default_mock_store.modules.trade.onChange).toHaveBeenCalledWith({
            target: { name: 'basis', value: 'stake' },
        });
    });

    it('should render trade param with "Stake" label and input with a value equal to the current stake amount value', () => {
        render(<MockedStake />);
        const { amount, currency } = default_mock_store.modules.trade;
        expect(screen.getByText(stake_param_label)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue(`${amount} ${currency}`);
    });

    it('should open ActionSheet with input, details and "Save" button if user clicks on "Stake" trade param', () => {
        render(<MockedStake />);

        expect(screen.queryByTestId('dt-actionsheet-overlay')).not.toBeInTheDocument();

        userEvent.click(screen.getByText(stake_param_label));

        expect(screen.getByTestId('dt-actionsheet-overlay')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(input_placeholder)).toBeInTheDocument();
        expect(screen.getAllByText(/payout/i)).toHaveLength(3);
        expect(screen.getByRole('button', { name: save_button_label })).toBeInTheDocument();
    });

    it('should call onChange when stake input changes', () => {
        render(<MockedStake />);
        userEvent.click(screen.getByText(stake_param_label));
        userEvent.type(screen.getByPlaceholderText(input_placeholder), '0');
        expect(default_mock_store.modules.trade.onChange).toHaveBeenCalledWith({
            target: { name: 'amount', value: '100' },
        });
    });

    it('should not render payout details for Accumulators', () => {
        default_mock_store.modules.trade.is_accumulator = true;
        render(<MockedStake />);
        userEvent.click(screen.getByText(stake_param_label));
        expect(screen.queryByText(/payout/i)).not.toBeInTheDocument();
    });

    it('should not render payout details for Turbos', () => {
        default_mock_store.modules.trade.is_turbos = true;
        render(<MockedStake />);
        userEvent.click(screen.getByText(stake_param_label));
        expect(screen.queryByText(/payout/i)).not.toBeInTheDocument();
    });

    it('should not render payout details for Vanillas', () => {
        default_mock_store.modules.trade.is_vanilla = true;
        render(<MockedStake />);
        userEvent.click(screen.getByText(stake_param_label));
        expect(screen.queryByText(/payout/i)).not.toBeInTheDocument();
    });

    it('should render Stop out and Comission details instead of payout details for Multipliers', () => {
        render(
            <MockedStake
                store={{
                    ...default_mock_store,
                    modules: {
                        ...default_mock_store.modules,
                        trade: {
                            ...default_mock_store.modules.trade,
                            commission: 0.36,
                            contract_type: TRADE_TYPES.MULTIPLIER,
                            is_multiplier: true,
                            proposal_info: {
                                [CONTRACT_TYPES.MULTIPLIER.UP]: {
                                    id: '3b09df15-b0b7-70a8-15c9-fad8e2bda5ef',
                                    has_error: false,
                                    message:
                                        "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 1000, minus commissions.",
                                    payout: 0,
                                },
                                [CONTRACT_TYPES.MULTIPLIER.DOWN]: {
                                    id: '873af3a9-a0da-5486-d1f9-fce8206e6ba2',
                                    has_error: false,
                                    message:
                                        "If you select 'Down', your total profit/loss will be the percentage decrease in Volatility 100 (1s) Index, multiplied by 1000, minus commissions.",
                                    payout: 0,
                                },
                            },
                            stop_out: -10,
                            trade_types: {
                                [CONTRACT_TYPES.MULTIPLIER.UP]: 'Multiply Up',
                                [CONTRACT_TYPES.MULTIPLIER.DOWN]: 'Multiply Down',
                            },
                            validation_params: {
                                [CONTRACT_TYPES.MULTIPLIER.UP]: {
                                    stake: {
                                        max: '2000.00',
                                        min: '1.00',
                                    },
                                },
                                [CONTRACT_TYPES.MULTIPLIER.DOWN]: {
                                    stake: {
                                        max: '2000.00',
                                        min: '1.00',
                                    },
                                },
                            },
                        },
                    },
                }}
            />
        );

        userEvent.click(screen.getByText(stake_param_label));
        expect(screen.getByText('Acceptable range: 1.00 to 2,000.00 USD')).toBeInTheDocument();
        expect(screen.getByText('Stop out')).toBeInTheDocument();
        expect(screen.getByText('Commission')).toBeInTheDocument();
    });

    it('should call setV2ParamsInitialValues if v2_params_initial_values.stake !== amount on mount and on Save button click if no error', () => {
        default_mock_store.modules.trade.amount = '30';
        render(<MockedStake />);
        userEvent.click(screen.getByText(stake_param_label));
        userEvent.type(screen.getByPlaceholderText(input_placeholder), '0');

        expect(default_mock_store.modules.trade.setV2ParamsInitialValues).toHaveBeenCalledTimes(1);

        userEvent.click(screen.getByRole('button', { name: save_button_label }));
        expect(default_mock_store.modules.trade.setV2ParamsInitialValues).toHaveBeenCalledTimes(2);
    });

    it('should call onChange on component mount if v2_params_initial_values.stake is not equal to amount', () => {
        default_mock_store.modules.trade.amount = '30';
        render(<MockedStake />);
        expect(default_mock_store.modules.trade.onChange).toHaveBeenCalledWith({
            target: { name: 'amount', value: 10 },
        });
    });

    it('should show error in case of a validation error if input is non-empty', () => {
        const error_text = "Please enter a stake amount that's at least 0.35.";
        default_mock_store.modules.trade.proposal_info = {
            PUT: { id: '', has_error: true, message: error_text },
            CALL: { id: '', has_error: true, message: error_text },
        };
        default_mock_store.modules.trade.validation_errors.amount = [error_text];
        default_mock_store.modules.trade.amount = 0;

        render(<MockedStake />);
        userEvent.click(screen.getByText(stake_param_label));
        expect(screen.getByText(error_text)).toBeInTheDocument();
        expect(screen.getAllByText('- USD')).toHaveLength(2);
    });

    it('should show max payout error with the least current payout when both of the 2 contract types exceed max payout', () => {
        const error_text_rise = 'Minimum stake of 0.35 and maximum payout of 50000.00. Current payout is 50631.97.';
        const error_text_fall = 'Minimum stake of 0.35 and maximum payout of 50000.00. Current payout is 50513.21.';
        default_mock_store.modules.trade.proposal_info = {
            CALL: { id: '', has_error: true, message: error_text_rise, error_field: 'amount' },
            PUT: { id: '', has_error: true, message: error_text_fall, error_field: 'amount' },
        };
        default_mock_store.modules.trade.validation_errors.amount = [error_text_fall];
        default_mock_store.modules.trade.amount = '26500';

        render(<MockedStake />);
        userEvent.click(screen.getByText(stake_param_label));

        expect(screen.getByText(error_text_fall)).toBeInTheDocument();
        expect(screen.queryByText('- USD')).not.toBeInTheDocument();
    });

    it('should not show max payout error if one of the 2 contract types satisfies max payout', () => {
        const error_text_rise = 'Minimum stake of 0.35 and maximum payout of 50000.00. Current payout is 50058.77.';
        const success_text_fall =
            'Win payout if Volatility 100 (1s) Index is strictly lower than entry spot at 5 minutes after contract start time.';
        default_mock_store.modules.trade.proposal_info = {
            CALL: { id: '', has_error: true, message: error_text_rise },
            PUT: {
                id: 'b608baf2-ba5d-00e0-8035-9af5c0769664',
                has_error: false,
                message: success_text_fall,
                payout: 49942.7,
            },
        };
        default_mock_store.modules.trade.amount = '26200';

        render(<MockedStake />);
        userEvent.click(screen.getByText(stake_param_label));

        expect(screen.queryByText(error_text_rise)).not.toBeInTheDocument();
    });
});

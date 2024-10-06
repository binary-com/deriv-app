import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, TextField, TextFieldWithSteppers, useSnackbar } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import { formatMoney, getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import StakeDetails from './stake-details';

type TStakeProps = {
    is_minimized?: boolean;
};

const Stake = observer(({ is_minimized }: TStakeProps) => {
    const {
        amount,
        basis,
        commission,
        contract_type,
        currency,
        has_stop_loss,
        is_accumulator,
        is_multiplier,
        is_turbos,
        is_vanilla,
        onChange,
        proposal_info,
        setV2ParamsInitialValues,
        stop_out,
        trade_type_tab,
        trade_types,
        symbol,
        validation_errors,
        validation_params,
        v2_params_initial_values,
    } = useTraderStore();
    const { addSnackbar } = useSnackbar();
    const [is_open, setIsOpen] = React.useState(false);
    const [should_show_error, setShouldShowError] = React.useState(true);
    const displayed_error = React.useRef(false);
    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    // first contract type data:
    const {
        has_error: has_error_1,
        id: id_1,
        message: message_1 = '',
        payout: payout_1 = 0,
        error_field: error_field_1,
    } = proposal_info[contract_types[0]] ?? {};
    // second contract type data:
    const {
        has_error: has_error_2,
        id: id_2,
        message: message_2 = '',
        payout: payout_2 = 0,
        error_field: error_field_2,
    } = proposal_info[contract_types[1]] ?? {};
    const is_loading_proposal = !has_error_1 && !has_error_2 && (!id_1 || (!!contract_types[1] && !id_2));
    const proposal_error_message_1 = has_error_1 && error_field_1 === 'amount' ? message_1 : '';
    const proposal_error_message_2 = has_error_2 && error_field_2 === 'amount' ? message_2 : '';
    const proposal_error_message =
        proposal_error_message_1 || proposal_error_message_2 || validation_errors?.amount?.[0];
    /* TODO: stop using Max payout from error text as a default max payout and stop using error text for is_max_payout_exceeded after validation_params are added to proposal API (both success & error response):
    E.g., for is_max_payout_exceeded, we have to temporarily check the error text: Max payout error always contains 3 numbers, the check will work for any languages: */
    const float_number_search_regex = /\d+(\.\d+)?/g;
    const is_max_payout_exceeded =
        proposal_error_message_1.match(float_number_search_regex)?.length === 3 ||
        proposal_error_message_2.match(float_number_search_regex)?.length === 3;
    const error_max_payout =
        is_max_payout_exceeded && proposal_error_message
            ? Number(proposal_error_message.match(float_number_search_regex)?.[1])
            : 0;
    const { payout, stake } = validation_params[contract_types[0]] ?? {};
    const { max: max_payout = error_max_payout } = payout ?? {};
    const { max: max_stake = 0, min: min_stake = 0 } = stake ?? {};
    const error_payout_1 = proposal_error_message_1
        ? Number(proposal_error_message_1.match(float_number_search_regex)?.[2])
        : 0;
    const error_payout_2 = proposal_error_message_2
        ? Number(proposal_error_message_2.match(float_number_search_regex)?.[2])
        : 0;
    const first_contract_payout = payout_1 || error_payout_1;
    const second_contract_payout = payout_2 || error_payout_2;
    const validation_error_text = contract_types[1] ? validation_errors?.amount[0] : proposal_error_message;
    const main_error_message =
        (validation_error_text && error_payout_1 > error_payout_2
            ? proposal_error_message_2
            : proposal_error_message_1) || validation_error_text;
    const has_both_errors = has_error_1 && has_error_2;
    const two_contracts_error = has_both_errors || amount.toString() === '' ? main_error_message : '';
    const stake_error = has_both_errors ? two_contracts_error : validation_error_text;
    const [details, setDetails] = React.useState({
        first_contract_payout,
        max_payout,
        max_stake,
        min_stake,
        second_contract_payout,
    });

    React.useEffect(() => {
        if (stake_error && !is_minimized && !displayed_error.current && !is_open) {
            displayed_error.current = true;
            addSnackbar({
                message: <Localize i18n_default_text='Please adjust your stake.' />,
                status: 'fail',
                hasCloseButton: true,
                style: { marginBottom: '48px' },
            });
        }
    }, [stake_error]);

    React.useEffect(() => {
        displayed_error.current = false;
    }, [contract_type, symbol]);

    React.useEffect(() => {
        const initial_stake = v2_params_initial_values?.stake;
        if (initial_stake && amount !== initial_stake) {
            onChange({ target: { name: 'amount', value: initial_stake } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useEffect(() => {
        if (is_open && v2_params_initial_values.stake !== amount) {
            setV2ParamsInitialValues({ value: amount, name: 'stake' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_open]);
    React.useEffect(() => {
        if (basis !== 'stake') onChange({ target: { name: 'basis', value: 'stake' } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [basis]);
    React.useEffect(() => {
        if (is_open) {
            if (
                (details.first_contract_payout !== first_contract_payout && first_contract_payout) ||
                (details.max_payout !== max_payout && max_payout) ||
                (details.max_stake !== max_stake && max_stake) ||
                (details.min_stake !== min_stake && min_stake) ||
                (details.second_contract_payout !== second_contract_payout && second_contract_payout)
            ) {
                setDetails({
                    first_contract_payout,
                    max_payout,
                    max_stake,
                    min_stake,
                    second_contract_payout,
                });
            }
        }
    }, [details, is_open, max_payout, max_stake, min_stake, first_contract_payout, second_contract_payout]);

    const getInputMessage = () =>
        (should_show_error && stake_error) ||
        (!!details.min_stake && !!details.max_stake && (
            <Localize
                i18n_default_text='Acceptable range: {{min_stake}} to {{max_stake}} {{currency}}'
                values={{
                    currency: getCurrencyDisplayCode(currency),
                    min_stake: formatMoney(currency, +details.min_stake, true),
                    max_stake: formatMoney(currency, +details.max_stake, true),
                }}
            />
        ));

    const handleOnChange = (e: { target: { name: string; value: string } }) => {
        if (stake_error) setShouldShowError(true);
        onChange({ target: { name: 'amount', value: e.target.value } });
    };

    const onClose = (is_saved = false) => {
        if (is_open) {
            if (!is_saved) {
                onChange({ target: { name: 'amount', value: v2_params_initial_values.stake } });
            }
            if (v2_params_initial_values.stake !== amount) {
                setV2ParamsInitialValues({ value: amount, name: 'stake' });
            }
            setIsOpen(false);
        }
    };

    return (
        <>
            <TextField
                variant='fill'
                readOnly
                label={<Localize i18n_default_text='Stake' key={`stake${is_minimized ? '-minimized' : ''}`} />}
                noStatusIcon
                onClick={() => setIsOpen(true)}
                value={`${v2_params_initial_values?.stake ?? amount} ${getCurrencyDisplayCode(currency)}`}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                status={stake_error && !is_open ? 'error' : undefined}
            />
            <ActionSheet.Root isOpen={is_open} onClose={() => onClose(false)} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Header title={<Localize i18n_default_text='Stake' />} />
                    <ActionSheet.Content className='stake-content'>
                        <TextFieldWithSteppers
                            allowDecimals
                            allowSign={false}
                            customType='commaRemoval'
                            className='text-field--custom'
                            decimals={getDecimalPlaces(currency)}
                            data-testid='dt_input_with_steppers'
                            message={getInputMessage()}
                            minusDisabled={Number(amount) - 1 <= 0}
                            name='amount'
                            noStatusIcon
                            onChange={handleOnChange}
                            placeholder={localize('Amount')}
                            regex={/[^0-9.,]/g}
                            status={should_show_error && stake_error ? 'error' : 'neutral'}
                            textAlignment='center'
                            inputMode='decimal'
                            unitLeft={getCurrencyDisplayCode(currency)}
                            variant='fill'
                            value={amount}
                        />
                        <StakeDetails
                            commission={commission}
                            contract_type={contract_type}
                            contract_types={contract_types}
                            currency={currency}
                            details={details}
                            has_stop_loss={has_stop_loss}
                            is_loading_proposal={is_loading_proposal}
                            is_multiplier={is_multiplier}
                            is_max_payout_exceeded={is_max_payout_exceeded}
                            should_show_payout_details={!is_accumulator && !is_multiplier && !is_turbos && !is_vanilla}
                            stake_error={stake_error}
                            stop_out={stop_out}
                        />
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        alignment='vertical'
                        shouldCloseOnPrimaryButtonClick={false}
                        primaryAction={{
                            content: <Localize i18n_default_text='Save' />,
                            onAction: () => {
                                if (!stake_error && !is_loading_proposal) {
                                    onClose(true);
                                } else {
                                    setShouldShowError(true);
                                }
                            },
                        }}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </>
    );
});

export default Stake;

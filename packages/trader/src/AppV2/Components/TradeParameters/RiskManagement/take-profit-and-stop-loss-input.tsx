import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import {
    CONTRACT_TYPES,
    getCurrencyDisplayCode,
    getDecimalPlaces,
    isCryptocurrency,
    useIsMounted,
} from '@deriv/shared';
import { useDebounceCallback } from 'usehooks-ts';
import { focusAndOpenKeyboard, getProposalRequestObject } from 'AppV2/Utils/trade-params-utils';
import { ActionSheet, CaptionText, Text, ToggleSwitch, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { TTradeStore } from 'Types';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import { ExpandedProposal } from 'Stores/Modules/Trading/Helpers/proposal';
import { useDtraderQuery } from 'AppV2/Hooks/useDtraderQuery';

type TTakeProfitAndStopLossInputProps = {
    classname?: string;
    has_save_button?: boolean;
    has_actionsheet_wrapper?: boolean;
    initial_error_text?: string;
    onActionSheetClose: () => void;
    parent_ref?: React.MutableRefObject<{
        has_take_profit?: boolean;
        has_stop_loss?: boolean;
        take_profit?: string;
        tp_error_text?: string;
        stop_loss?: string;
        sl_error_text?: string;
    }>;
    parent_is_api_response_received_ref?: React.MutableRefObject<boolean>;
    type?: 'take_profit' | 'stop_loss';
};
type TOnProposalResponse = TTradeStore['onProposalResponse'];

const TakeProfitAndStopLossInput = ({
    classname,
    has_save_button = true,
    has_actionsheet_wrapper = true,
    initial_error_text,
    onActionSheetClose,
    parent_ref,
    parent_is_api_response_received_ref,
    type = 'take_profit',
}: TTakeProfitAndStopLossInputProps) => {
    const trade_store = useTraderStore();
    const {
        contract_type,
        currency,
        has_take_profit,
        has_stop_loss,
        is_accumulator,
        is_multiplier,
        take_profit,
        stop_loss,
        trade_types,
        trade_type_tab,
        onChangeMultiple,
        validation_params,
    } = trade_store;
    const isMounted = useIsMounted();

    const is_take_profit_input = type === 'take_profit';

    // For handling cases when user clicks on Save btn before we got response from API
    const is_api_response_received = React.useRef(false);
    const is_api_response_received_ref = parent_is_api_response_received_ref || is_api_response_received;

    const [is_enabled, setIsEnabled] = React.useState(is_take_profit_input ? has_take_profit : has_stop_loss);
    const [new_input_value, setNewInputValue] = React.useState(is_take_profit_input ? take_profit : stop_loss);
    const [error_text, setErrorText] = React.useState('');
    const [fe_error_text, setFEErrorText] = React.useState(initial_error_text ?? '');

    // Refs for handling focusing and bluring input
    const input_ref = React.useRef<HTMLInputElement>(null);
    const focused_input_ref = React.useRef<HTMLInputElement>(null);
    const focus_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    const decimals = getDecimalPlaces(currency);
    const currency_display_code = getCurrencyDisplayCode(currency);
    const Component = has_actionsheet_wrapper ? ActionSheet.Content : 'div';
    const is_crypto_currency = isCryptocurrency(currency);
    const should_set_validation_params = is_multiplier && is_enabled && !new_input_value && !is_crypto_currency;

    const min_value = validation_params[contract_types[0]]?.[type]?.min;
    const max_value = validation_params[contract_types[0]]?.[type]?.max;
    // Storing data from validation params (proposal) in state in case if we got a validation error from API and proposal stop streaming
    const [info, setInfo] = React.useState<Record<string, string | undefined>>({ min_value, max_value });

    /* In order to get validation params for Multipliers when TP and SL are empty, 
            we send '1' first, get validation params and set them into the state.*/
    const input_value = should_set_validation_params ? '1' : new_input_value;
    const new_values = {
        ...(is_take_profit_input ? { has_take_profit: is_enabled } : { has_stop_loss: is_enabled }),
        has_cancellation: false,
        ...(is_take_profit_input
            ? { take_profit: is_enabled ? input_value : '' }
            : { stop_loss: is_enabled ? input_value : '' }),
    };

    const proposal_req = getProposalRequestObject({
        new_values,
        trade_store,
        trade_type: Object.keys(trade_types)[0],
    });

    const { data: response } = useDtraderQuery<Parameters<TOnProposalResponse>[0]>(
        ['proposal', ...Object.entries(new_values).flat().join('-')],
        proposal_req,
        {
            enabled: is_enabled,
        }
    );

    const input_message =
        info.min_value && info.max_value && is_enabled ? (
            <Localize
                i18n_default_text='Acceptable range: {{min_value}} to {{max_value}} {{currency}}'
                values={{
                    currency: currency_display_code,
                    min_value: info.min_value,
                    max_value: info.max_value,
                }}
            />
        ) : (
            ''
        );

    const updateParentRef = ({ field_name, new_value }: { field_name: string; new_value: string | boolean }) => {
        if (!parent_ref?.current || !field_name) return;
        parent_ref.current = { ...parent_ref.current, [field_name]: new_value };
    };

    const onToggleSwitch = (new_value: boolean) => {
        is_api_response_received_ref.current = false;
        setIsEnabled(new_value);
        updateParentRef({ field_name: is_take_profit_input ? 'has_take_profit' : 'has_stop_loss', new_value });

        if (new_value) {
            clearTimeout(focus_timeout.current);
            focus_timeout.current = focusAndOpenKeyboard(focused_input_ref.current, input_ref.current);
        } else {
            setFEErrorText('');
            setErrorText('');
            updateParentRef({ field_name: is_take_profit_input ? 'tp_error_text' : 'sl_error_text', new_value: '' });
            input_ref.current?.blur();
        }
    };

    React.useEffect(() => {
        if (!is_enabled) return;

        const onProposalResponse: TOnProposalResponse = response => {
            const { proposal, echo_req, error } = response;

            const new_error = error?.message ?? '';
            setErrorText(new_error);
            updateParentRef({
                field_name: is_take_profit_input ? 'tp_error_text' : 'sl_error_text',
                new_value: new_error,
            });

            /* For Multipliers, validation parameters come in proposal response only if TP or SL are switched on and their value is not empty.
            Here we set them into the state in order to show further even if we got a validation error from API.*/
            if (
                isMounted() &&
                proposal &&
                (echo_req.contract_type === CONTRACT_TYPES.MULTIPLIER.UP || CONTRACT_TYPES.MULTIPLIER.DOWN) &&
                (echo_req?.limit_order?.take_profit || echo_req?.limit_order?.stop_loss)
            ) {
                const { validation_params } = proposal as ExpandedProposal;
                setInfo(info => {
                    if (
                        (info.min_value !== validation_params?.[type]?.min && validation_params?.[type]?.min) ||
                        (info.max_value !== validation_params?.[type]?.max && validation_params?.[type]?.max)
                    ) {
                        return {
                            min_value: validation_params?.[type]?.min,
                            max_value: validation_params?.[type]?.max,
                        };
                    }
                    return info;
                });
            }
            is_api_response_received_ref.current = true;
        };

        if (response) onProposalResponse(response);

        return () => clearTimeout(focus_timeout.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_enabled, new_input_value, response]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        is_api_response_received_ref.current = false;
        let value = String(e.target.value);
        if (value.length > 1) value = /^[0-]+$/.test(value) ? '0' : value.replace(/^0*/, '').replace(/^\./, '0.');

        setFEErrorText('');
        setNewInputValue(value);
        updateParentRef({ field_name: type, new_value: value });
    };

    const debouncedOnInputChange = useDebounceCallback(onInputChange, 300);

    const onSave = () => {
        // Prevent from saving if user clicks before BE validation
        if (!is_api_response_received_ref.current && is_enabled) return;

        if (error_text && is_enabled) return;
        if (!new_input_value && is_enabled) {
            setFEErrorText(
                is_take_profit_input
                    ? localize('Please enter a take profit amount.')
                    : localize('Please enter a stop loss amount.')
            );
            return;
        }

        const is_tp_enabled = error_text ? false : is_enabled;
        onChangeMultiple({
            ...(is_take_profit_input ? { has_take_profit: is_tp_enabled } : { has_stop_loss: is_tp_enabled }),
            ...(is_take_profit_input
                ? {
                      take_profit: error_text || new_input_value === '0' ? '' : new_input_value,
                  }
                : {
                      stop_loss: error_text || new_input_value === '0' ? '' : new_input_value,
                  }),
            ...(is_tp_enabled ? { has_cancellation: false } : {}),
        });
        onActionSheetClose();
    };

    React.useEffect(() => {
        setFEErrorText(initial_error_text ?? '');
        updateParentRef({
            field_name: is_take_profit_input ? 'tp_error_text' : 'sl_error_text',
            new_value: initial_error_text ?? '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initial_error_text]);

    React.useEffect(() => {
        setInfo(info =>
            (info.min_value !== min_value && min_value) || (info.max_value !== max_value && max_value)
                ? { min_value, max_value }
                : info
        );
    }, [min_value, max_value]);

    return (
        <React.Fragment>
            <Component className={clsx('take-profit__wrapper', classname)}>
                <div className='take-profit__content'>
                    <Text>
                        {is_take_profit_input ? (
                            <Localize i18n_default_text='Take profit' />
                        ) : (
                            <Localize i18n_default_text='Stop loss' />
                        )}
                    </Text>
                    <ToggleSwitch checked={is_enabled} onChange={onToggleSwitch} />
                </div>
                <TextFieldWithSteppers
                    allowDecimals
                    customType='commaRemoval'
                    className='text-field--custom'
                    disabled={!is_enabled}
                    decimals={decimals}
                    data-testid={is_take_profit_input ? 'dt_tp_input' : 'dt_sl_input'}
                    inputMode='decimal'
                    message={fe_error_text || error_text || input_message}
                    minusDisabled={Number(new_input_value) - 1 <= 0}
                    name={type}
                    noStatusIcon
                    onChange={debouncedOnInputChange}
                    placeholder={localize('Amount')}
                    ref={input_ref}
                    regex={/[^0-9.,]/g}
                    status={fe_error_text || error_text ? 'error' : 'neutral'}
                    textAlignment='center'
                    unitLeft={currency_display_code}
                    variant='fill'
                    value={new_input_value ?? ''}
                />
                {!is_enabled && (
                    <button
                        className='take-profit__overlay'
                        data-testid='dt_take_profit_overlay'
                        onClick={() => onToggleSwitch(true)}
                    />
                )}
                {/* this input with inline styles is needed to fix a focus issue in Safari */}
                <input ref={focused_input_ref} style={{ height: 0, opacity: 0, display: 'none' }} inputMode='decimal' />
                {is_accumulator && (
                    <CaptionText color='quill-typography__color--subtle' className='take-profit__accu-information'>
                        <Localize i18n_default_text='Note: Cannot be adjusted for ongoing accumulator contracts.' />
                    </CaptionText>
                )}
            </Component>
            {has_save_button && (
                <ActionSheet.Footer
                    alignment='vertical'
                    primaryAction={{
                        content: <Localize i18n_default_text='Save' />,
                        onAction: onSave,
                    }}
                    shouldCloseOnPrimaryButtonClick={false}
                />
            )}
        </React.Fragment>
    );
};

export default observer(TakeProfitAndStopLossInput);

import React from 'react';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import { focusAndOpenKeyboard } from 'AppV2/Utils/trade-params-utils';
import { ActionSheet, CaptionText, Text, ToggleSwitch, TextFieldWithSteppers } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';

type TTakeProfitInputProps = {
    onActionSheetClose: () => void;
};

const TakeProfitInput = ({ onActionSheetClose }: TTakeProfitInputProps) => {
    const {
        currency,
        has_take_profit,
        is_accumulator,
        take_profit,
        onChangeMultiple,
        onChange,
        validation_params,
        validation_errors,
    } = useTraderStore();

    const [error_message, setErrorMessage] = React.useState<React.ReactNode>('');

    //TODO: check if can reuse in other places
    const has_error_ref = React.useRef<boolean>();
    const has_tp_initial_value_ref = React.useRef<boolean>();
    const has_tp_selected_value_ref = React.useRef(has_take_profit);
    const tp_initial_value_ref = React.useRef<string | number | undefined>('');
    const tp_selected_value_ref = React.useRef<string | number | undefined>(take_profit);

    const input_ref = React.useRef<HTMLInputElement>(null);
    const focused_input_ref = React.useRef<HTMLInputElement>(null);
    const focus_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    const min_take_profit = validation_params?.take_profit?.min;
    const max_take_profit = validation_params?.take_profit?.max;
    const decimals = getDecimalPlaces(currency);
    const be_error_text = validation_errors.take_profit[0];
    const currency_display_code = getCurrencyDisplayCode(currency);

    const onToggleSwitch = (new_value: boolean) => {
        has_tp_selected_value_ref.current = new_value;

        if (new_value) {
            isTakeProfitOutOfRange({ value: tp_selected_value_ref.current });
            clearTimeout(focus_timeout.current);
            focus_timeout.current = focusAndOpenKeyboard(focused_input_ref.current, input_ref.current);
        } else {
            input_ref.current?.blur();
        }

        onChangeMultiple({
            has_take_profit: new_value,
            ...(new_value ? { has_cancellation: false } : {}),
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = String(e.target.value).replace(',', '.').replace(/^0*/, '').replace(/^\./, '0.');
        tp_selected_value_ref.current = value;

        if (!isTakeProfitOutOfRange({ value }) && value !== '') {
            onChange({ target: { name: 'take_profit', value } });
        }
    };

    const isTakeProfitOutOfRange = ({
        value,
        should_validate_empty_value,
    }: {
        value?: string | number;
        should_validate_empty_value?: boolean;
    }) => {
        if (should_validate_empty_value && value === '') {
            has_error_ref.current = true;
            setErrorMessage(<Localize i18n_default_text='Please enter a take profit amount.' />);
            return true;
        }
        if (value === '' || (Number(value) >= Number(min_take_profit) && Number(value) <= Number(max_take_profit))) {
            has_error_ref.current = false;
            setErrorMessage('');
            return false;
        }
        if (Number(value) < Number(min_take_profit)) {
            has_error_ref.current = true;
            setErrorMessage(
                <Localize
                    i18n_default_text='Please enter a take profit amount that’s higher than {{min_take_profit}}.'
                    values={{ min_take_profit }}
                />
            );
            return true;
        }
        if (Number(value) > Number(max_take_profit)) {
            has_error_ref.current = true;
            setErrorMessage(
                <Localize
                    i18n_default_text='Please enter a take profit amount that’s lower than {{max_take_profit}}.'
                    values={{ max_take_profit }}
                />
            );
            return true;
        }
    };

    const onSave = () => {
        if (
            isTakeProfitOutOfRange({ value: tp_selected_value_ref.current, should_validate_empty_value: true }) &&
            has_tp_selected_value_ref.current
        )
            return;

        if (be_error_text && has_tp_selected_value_ref.current) {
            return;
        }

        if (has_tp_selected_value_ref.current !== has_tp_initial_value_ref.current) {
            has_tp_initial_value_ref.current = has_tp_selected_value_ref.current;
        }
        if (tp_selected_value_ref.current !== tp_initial_value_ref.current) {
            tp_initial_value_ref.current = tp_selected_value_ref.current;
        }

        const has_take_profit = has_error_ref.current ? false : has_tp_selected_value_ref.current;
        onChangeMultiple({
            has_take_profit,
            ...(has_take_profit ? { has_cancellation: false } : {}),
        });

        onChange({
            target: {
                name: 'take_profit',
                value:
                    has_error_ref.current || tp_selected_value_ref.current === '0' ? '' : tp_selected_value_ref.current,
            },
        });

        onActionSheetClose();
    };

    const input_message =
        min_take_profit && max_take_profit ? (
            <Localize
                i18n_default_text='Acceptable range: {{min_take_profit}} to {{max_take_profit}} {{currency}}'
                values={{ currency: currency_display_code, min_take_profit, max_take_profit }}
            />
        ) : (
            ''
        );

    React.useEffect(() => {
        has_error_ref.current = !!be_error_text;
    }, [be_error_text]);

    React.useEffect(() => {
        if (!has_tp_initial_value_ref.current && has_take_profit) {
            has_tp_initial_value_ref.current = has_take_profit;
        }
        if (!tp_initial_value_ref.current && take_profit) {
            tp_initial_value_ref.current = take_profit;
        }

        return () => {
            const has_take_profit =
                tp_initial_value_ref.current === '' ||
                tp_initial_value_ref.current === '0' ||
                (has_error_ref.current && tp_selected_value_ref.current !== '0' && tp_selected_value_ref.current !== '')
                    ? false
                    : has_tp_initial_value_ref.current;
            onChangeMultiple({
                has_take_profit,
                ...(has_take_profit ? { has_cancellation: false } : {}),
            });
            onChange({
                target: {
                    name: 'take_profit',
                    value:
                        tp_initial_value_ref.current === '' ||
                        tp_initial_value_ref.current === '0' ||
                        (has_error_ref.current &&
                            tp_selected_value_ref.current !== '0' &&
                            tp_selected_value_ref.current !== '')
                            ? ''
                            : tp_initial_value_ref.current,
                },
            });

            clearTimeout(focus_timeout.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <ActionSheet.Content className='take-profit__wrapper'>
                <div className='take-profit__content'>
                    <Text>
                        <Localize i18n_default_text='Take profit' />
                    </Text>
                    <ToggleSwitch checked={has_tp_selected_value_ref.current} onChange={onToggleSwitch} />
                </div>
                <TextFieldWithSteppers
                    allowDecimals
                    disabled={!has_tp_selected_value_ref.current}
                    decimals={decimals}
                    data-testid='dt_input_with_steppers'
                    inputMode='decimal'
                    message={
                        has_tp_selected_value_ref.current
                            ? error_message || (be_error_text && !!take_profit) || input_message
                            : ''
                    }
                    minusDisabled={Number(tp_selected_value_ref.current) - 1 <= 0}
                    name='take_profit'
                    onChange={onInputChange}
                    placeholder={localize('Amount')}
                    ref={input_ref}
                    regex={/[^0-9.,]/g}
                    status={error_message || (be_error_text && !!take_profit) ? 'error' : 'neutral'}
                    textAlignment='center'
                    unitLeft={currency_display_code}
                    variant='fill'
                    value={tp_selected_value_ref.current}
                />
                {!has_tp_selected_value_ref.current && (
                    <button
                        className='take-profit__overlay'
                        onClick={() => onToggleSwitch(true)}
                        data-testid='dt_take_profit_overlay'
                    />
                )}
                {/* this input with inline styles is needed to fix a focus issue in Safari */}
                <input ref={focused_input_ref} style={{ height: 0, opacity: 0, display: 'none' }} inputMode='decimal' />
                {is_accumulator && (
                    <CaptionText color='quill-typography__color--subtle' className='take-profit__accu-information'>
                        <Localize i18n_default_text='Note: Cannot be adjusted for ongoing accumulator contracts.' />
                    </CaptionText>
                )}
            </ActionSheet.Content>
            <ActionSheet.Footer
                alignment='vertical'
                primaryAction={{
                    content: <Localize i18n_default_text='Save' />,
                    onAction: onSave,
                }}
                shouldCloseOnPrimaryButtonClick={false}
            />
        </React.Fragment>
    );
};

export default observer(TakeProfitInput);

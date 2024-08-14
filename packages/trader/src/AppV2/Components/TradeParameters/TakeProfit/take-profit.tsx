import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { getContractTypePosition, getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import { focusAndOpenKeyboard, getTradeTypeTabsList } from 'AppV2/Utils/trade-params-utils';
import Carousel from 'AppV2/Components/Carousel';
import CarouselHeader from 'AppV2/Components/Carousel/carousel-header';
import TakeProfitInput from './take-profit-input';
import TradeParamDefinition from 'AppV2/Components/TradeParamDefinition';

type TTakeProfitProps = {
    is_minimized?: boolean;
};

const getSortedIndex = (type: string, index?: number) => {
    switch (getContractTypePosition(type as 'CALL')) {
        case 'top':
            return 0;
        case 'bottom':
            return 1;
        default:
            return index;
    }
};

const TakeProfit = observer(({ is_minimized }: TTakeProfitProps) => {
    const {
        contract_type,
        currency,
        has_open_accu_contract,
        has_take_profit,
        is_accumulator,
        take_profit,
        trade_types,
        trade_type_tab,
        onChangeMultiple,
        onChange,
        validation_params,
    } = useTraderStore();

    const [is_open, setIsOpen] = React.useState(false);
    const [is_enabled, setIsEnabled] = React.useState(has_take_profit);
    const [take_profit_value, setTakeProfitValue] = React.useState<string | number | undefined>(take_profit);
    const [error_message, setErrorMessage] = React.useState<React.ReactNode>();

    const input_ref = React.useRef<HTMLInputElement>(null);
    const focused_input_ref = React.useRef<HTMLInputElement>(null);
    const focus_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    const trade_types_array = Object.keys(trade_types)
        .filter(type => !getTradeTypeTabsList(contract_type).length || type === trade_type_tab)
        .sort((a, b) => Number(getSortedIndex(a) ?? 0) - Number(getSortedIndex(b) ?? 0));
    const min_take_profit = validation_params[trade_types_array[0]]?.take_profit?.min;
    const max_take_profit = validation_params[trade_types_array[0]]?.take_profit?.max;
    const decimals = getDecimalPlaces(currency);

    const getInputMessage = () =>
        is_enabled
            ? error_message || (
                  <Localize
                      i18n_default_text='Acceptable range: {{min_take_profit}} to {{max_take_profit}} {{currency}}'
                      values={{ currency, min_take_profit, max_take_profit }}
                  />
              )
            : '';

    const isTakeProfitOutOfRange = (value = take_profit_value) => {
        if (!value) {
            setErrorMessage(<Localize i18n_default_text='Please enter a take profit amount.' />);
            return true;
        }
        if (Number(value) < Number(min_take_profit) || Number(value) > Number(max_take_profit)) {
            setErrorMessage(
                <Localize
                    i18n_default_text='Acceptable range: {{min_take_profit}} to {{max_take_profit}} {{currency}}'
                    values={{ currency, min_take_profit, max_take_profit }}
                />
            );
            return true;
        }
        setErrorMessage('');
        return false;
    };

    const onToggleSwitch = (new_value: boolean) => {
        setIsEnabled(new_value);

        if (new_value) {
            if (take_profit_value !== '' && take_profit_value !== undefined) {
                isTakeProfitOutOfRange();
            }

            clearTimeout(focus_timeout.current);
            focus_timeout.current = focusAndOpenKeyboard(focused_input_ref.current, input_ref.current);
        } else {
            input_ref.current?.blur();
            setErrorMessage('');
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value: string | number = e.target.value.replace(',', '.');

        setTakeProfitValue(value);
        isTakeProfitOutOfRange(value);
    };

    const onSave = () => {
        if (isTakeProfitOutOfRange() && is_enabled) return;

        onChangeMultiple({
            has_take_profit: is_enabled,
            ...(is_enabled ? { has_cancellation: false } : {}),
        });
        onChange({
            target: {
                name: 'take_profit',
                value: take_profit_value,
            },
        });
        onActionSheetClose();
    };

    const onActionSheetClose = () => {
        setIsOpen(false);
        setIsEnabled(has_take_profit);
        setTakeProfitValue(take_profit);
        setErrorMessage('');
    };

    const action_sheet_content = [
        {
            id: 1,
            component: (
                <TakeProfitInput
                    currency={getCurrencyDisplayCode(currency)}
                    decimals={decimals}
                    error_message={error_message}
                    is_enabled={is_enabled}
                    is_accumulator={is_accumulator}
                    message={getInputMessage()}
                    onToggleSwitch={onToggleSwitch}
                    onInputChange={onInputChange}
                    onSave={onSave}
                    ref={input_ref}
                    take_profit_value={take_profit_value}
                />
            ),
        },
        {
            id: 2,
            component: (
                <TradeParamDefinition
                    description={
                        <Localize i18n_default_text='When your profit reaches or exceeds the set amount, your trade will be closed automatically.' />
                    }
                />
            ),
        },
    ];

    React.useEffect(() => {
        setIsEnabled(has_take_profit);
        setTakeProfitValue(take_profit);

        return () => clearTimeout(focus_timeout.current);
    }, [has_take_profit, take_profit]);

    return (
        <React.Fragment>
            <TextField
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                disabled={has_open_accu_contract}
                label={
                    <Localize i18n_default_text='Take profit' key={`take-profit${is_minimized ? '-minimized' : ''}`} />
                }
                onClick={() => setIsOpen(true)}
                readOnly
                variant='fill'
                value={has_take_profit && take_profit ? `${take_profit} ${getCurrencyDisplayCode(currency)}` : '-'}
            />
            <ActionSheet.Root isOpen={is_open} onClose={onActionSheetClose} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <Carousel
                        header={CarouselHeader}
                        pages={action_sheet_content}
                        title={<Localize i18n_default_text='Take profit' />}
                    />
                    {/* this input with inline styles is needed to fix a focus issue in Safari */}
                    <input ref={focused_input_ref} style={{ height: 0, opacity: 0, display: 'none' }} />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default TakeProfit;

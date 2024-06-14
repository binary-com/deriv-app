import React from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';

import { DesktopWrapper, Icon, Input, MobileOrTabletWrapper } from '@deriv/components';
import { useExchangeRate } from '@deriv/hooks';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';

import { useCashierStore } from '../../stores/useCashierStores';
import { TReactChangeEvent } from '../../types';

import './crypto-fiat-converter.scss';

type TInputGroupProps = React.PropsWithChildren<{
    className: string;
}>;

type TCryptoFiatConverterProps = {
    arrow_icon_direction: 'right' | 'left';
    from_currency: string;
    hint?: React.ReactNode;
    onChangeConverterFromAmount: (
        event: { target: { value: string } },
        from_currency: string,
        to_currency: string,
        converted_amount?: number
    ) => void;
    onChangeConverterToAmount: (
        event: TReactChangeEvent,
        to_currency: string,
        from_currency: string,
        converted_amount?: number
    ) => void;
    resetConverter: VoidFunction;
    setArrowIconDirection: React.Dispatch<React.SetStateAction<'right' | 'left'>>;
    to_currency: string;
    validateFromAmount: VoidFunction;
    validateToAmount: VoidFunction;
};

const InputGroup = ({ children, className }: TInputGroupProps) => {
    return (
        <fieldset>
            <div className={className}>{children}</div>
        </fieldset>
    );
};

const CryptoFiatConverter = observer(
    ({
        arrow_icon_direction,
        from_currency,
        hint,
        onChangeConverterFromAmount,
        onChangeConverterToAmount,
        resetConverter,
        setArrowIconDirection,
        to_currency,
        validateFromAmount,
        validateToAmount,
    }: TCryptoFiatConverterProps) => {
        const { crypto_fiat_converter } = useCashierStore();
        const { exchange_rates } = useExchangeRate();

        const { converter_from_amount, converter_from_error, converter_to_error, converter_to_amount } =
            crypto_fiat_converter;

        const { handleChange } = useFormikContext();

        React.useEffect(() => {
            return () => resetConverter();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        React.useEffect(() => {
            setArrowIconDirection('right');
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [from_currency]);

        return (
            <div className='crypto-fiat-converter'>
                <Field name='converter_from_amount' validate={validateFromAmount}>
                    {({ field }: FieldProps<string>) => (
                        <Input
                            {...field}
                            onFocus={() => {
                                setArrowIconDirection('right');
                            }}
                            onChange={(e: TReactChangeEvent) => {
                                const rate = exchange_rates?.[from_currency]?.[to_currency] ?? 0;
                                const converted_amount = Number(e.target.value) * rate;
                                onChangeConverterFromAmount(e, from_currency, to_currency, converted_amount);
                                handleChange(e);
                            }}
                            type='text'
                            error={converter_from_error as string}
                            label={localize('Amount ({{currency}})', {
                                currency: getCurrencyDisplayCode(from_currency),
                            })}
                            value={converter_from_amount}
                            autoComplete='off'
                            required
                            hint={hint}
                            classNameHint='crypto-fiat-converter__hint'
                            data-testid='dt_converter_from_amount_input'
                        />
                    )}
                </Field>
                <MobileOrTabletWrapper>
                    {arrow_icon_direction === 'right' ? <Icon icon='IcArrowDownBold' /> : <Icon icon='IcArrowUpBold' />}
                </MobileOrTabletWrapper>
                <DesktopWrapper>
                    <div className='crypto-fiat-converter__arrow-container'>
                        {arrow_icon_direction === 'right' ? (
                            <Icon icon='IcArrowRightBold' id='arrow_right_bold' data_testid='dti_arrow_right_bold' />
                        ) : (
                            <Icon icon='IcArrowLeftBold' id='arrow_left_bold' data_testid='dti_arrow_left_bold' />
                        )}
                    </div>
                </DesktopWrapper>
                <Field name='converter_to_amount' validate={validateToAmount}>
                    {({ field }: FieldProps<string>) => (
                        <InputGroup className='input-group'>
                            <Input
                                {...field}
                                onFocus={() => {
                                    setArrowIconDirection('left');
                                }}
                                onChange={(e: TReactChangeEvent) => {
                                    const rate = exchange_rates?.[to_currency]?.[from_currency] ?? 0;
                                    const converted_amount = Number(e.target.value) * rate;
                                    onChangeConverterToAmount(e, to_currency, from_currency, converted_amount);
                                    handleChange(e);
                                }}
                                type='text'
                                error={converter_to_error}
                                label={localize('Amount ({{currency}})', {
                                    currency: getCurrencyDisplayCode(to_currency),
                                })}
                                value={converter_to_amount}
                                autoComplete='off'
                                hint={localize('Approximate value')}
                                classNameHint='crypto-fiat-converter__hint'
                                data-testid='dt_converter_to_amount_input'
                            />
                        </InputGroup>
                    )}
                </Field>
            </div>
        );
    }
);

export default CryptoFiatConverter;

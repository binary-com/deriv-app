import PropTypes from 'prop-types';
import React from 'react';
import { Field, useFormikContext } from 'formik';
import { DesktopWrapper, Input, Icon, MobileWrapper, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { useInterval } from '@deriv/components/src/hooks';

const Timer = props => {
    const initial_time = 60;
    const [remaining_time, setRemainingTime] = React.useState(initial_time);

    useInterval(() => {
        if (remaining_time > 0) {
            setRemainingTime(remaining_time - 1);
        }
    }, 1000);
    React.useEffect(() => {
        if (remaining_time === 0) {
            props.onComplete();
            setRemainingTime(initial_time);
        }
    });

    return (
        <Text as='p' size='xs' className='timer'>
            <Localize i18n_default_text='{{remaining_time}}s' values={{ remaining_time }} />
        </Text>
    );
};

const InputGroup = ({ children, className }) => {
    return (
        <fieldset>
            <div className={className}>{children}</div>
        </fieldset>
    );
};

const CryptoFiatConverter = ({
    calculatePercentage,
    converter_from_amount,
    converter_from_error,
    converter_to_error,
    converter_to_amount,
    from_currency,
    hint,
    is_timer_visible,
    onChangeConverterFromAmount,
    onChangeConverterToAmount,
    percentageSelectorSelectionStatus,
    resetConverter,
    setConverterFromAmount,
    setConverterToAmount,
    setIsTimerVisible,
    to_currency,
    validateFromAmount,
    validateToAmount,
}) => {
    const { handleBlur, handleChange } = useFormikContext();
    const [arrow_icon_direction, setArrowIconDirection] = React.useState('right');
    const [has_from_amount_changed, setHasFromAmountChanged] = React.useState(false);
    const [has_to_amount_changed, setHasToAmountChanged] = React.useState(false);

    React.useEffect(() => {
        return () => resetConverter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        setArrowIconDirection('right');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [from_currency]);

    return (
        <div className='crypto-fiat-converter-form'>
            <Field name='converter_from_amount' validate={validateFromAmount}>
                {({ field }) => (
                    <Input
                        {...field}
                        onFocus={() => {
                            setArrowIconDirection('right');
                        }}
                        onBlur={e => {
                            handleBlur(e);
                            if (has_from_amount_changed) {
                                onChangeConverterFromAmount(e, from_currency, to_currency);
                            }
                            setHasFromAmountChanged(false);
                        }}
                        onChange={e => {
                            setHasFromAmountChanged(true);
                            setIsTimerVisible(false);
                            setConverterFromAmount(e.target.value);
                            handleChange(e);
                            percentageSelectorSelectionStatus(true);
                            calculatePercentage();
                        }}
                        type='number'
                        error={converter_from_error}
                        label={localize('Amount ({{currency}})', { currency: from_currency })}
                        value={converter_from_amount}
                        autoComplete='off'
                        required
                        hint={hint}
                    />
                )}
            </Field>
            <MobileWrapper>
                {arrow_icon_direction === 'right' ? <Icon icon='IcArrowDownBold' /> : <Icon icon='IcArrowUpBold' />}
            </MobileWrapper>
            <DesktopWrapper>
                {arrow_icon_direction === 'right' ? <Icon icon='IcArrowRightBold' /> : <Icon icon='IcArrowLeftBold' />}
            </DesktopWrapper>
            <Field name='converter_to_amount' validate={validateToAmount}>
                {({ field }) => (
                    <InputGroup className='input-group'>
                        <Input
                            {...field}
                            onFocus={() => {
                                setArrowIconDirection('left');
                            }}
                            onBlur={e => {
                                handleBlur(e);
                                if (has_to_amount_changed) {
                                    onChangeConverterToAmount(e, to_currency, from_currency);
                                }
                                setHasToAmountChanged(false);
                            }}
                            onChange={e => {
                                setHasToAmountChanged(true);
                                setIsTimerVisible(false);
                                setConverterToAmount(e.target.value);
                                handleChange(e);
                                percentageSelectorSelectionStatus(true);
                                calculatePercentage();
                            }}
                            type='number'
                            error={converter_to_error}
                            label={localize('Amount ({{currency}})', { currency: to_currency })}
                            value={converter_to_amount}
                            autoComplete='off'
                            hint={localize('Approximate value')}
                        />
                        {is_timer_visible && (
                            <Timer
                                onComplete={() => {
                                    onChangeConverterFromAmount(
                                        {
                                            target: {
                                                value: converter_from_amount,
                                            },
                                        },
                                        from_currency,
                                        to_currency
                                    );
                                }}
                            />
                        )}
                    </InputGroup>
                )}
            </Field>
        </div>
    );
};

CryptoFiatConverter.propTypes = {
    calculatePercentage: PropTypes.func,
    converter_from_amount: PropTypes.string,
    converter_from_error: PropTypes.string,
    converter_to_error: PropTypes.string,
    converter_to_amount: PropTypes.string,
    from_currency: PropTypes.string,
    is_timer_visible: PropTypes.bool,
    onChangeConverterFromAmount: PropTypes.func,
    onChangeConverterToAmount: PropTypes.func,
    percentageSelectorSelectionStatus: PropTypes.func,
    resetConverter: PropTypes.func,
    setConverterFromAmount: PropTypes.func,
    setConverterToAmount: PropTypes.func,
    setIsTimerVisible: PropTypes.func,
    to_currency: PropTypes.string,
    validateFromAmount: PropTypes.func,
    validateToAmount: PropTypes.func,
};

export default connect(({ modules }) => ({
    calculatePercentage: modules.cashier.calculatePercentage,
    converter_from_amount: modules.cashier.converter_from_amount,
    converter_from_error: modules.cashier.converter_from_error,
    converter_to_error: modules.cashier.converter_to_error,
    converter_to_amount: modules.cashier.converter_to_amount,
    is_timer_visible: modules.cashier.is_timer_visible,
    onChangeConverterFromAmount: modules.cashier.onChangeConverterFromAmount,
    onChangeConverterToAmount: modules.cashier.onChangeConverterToAmount,
    percentageSelectorSelectionStatus: modules.cashier.percentageSelectorSelectionStatus,
    resetConverter: modules.cashier.resetConverter,
    setConverterFromAmount: modules.cashier.setConverterFromAmount,
    setConverterToAmount: modules.cashier.setConverterToAmount,
    setIsTimerVisible: modules.cashier.setIsTimerVisible,
}))(CryptoFiatConverter);

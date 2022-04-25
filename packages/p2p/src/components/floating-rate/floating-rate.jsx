import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import React from 'react';
import { InputField, Text } from '@deriv/components';
import { formatMoney, isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { truncateDecimal } from 'Utils/format-value.js';
import './floating-rate.scss';

const FloatingRate = ({
    change_handler,
    className,
    exchange_rate,
    error_messages,
    fiat_currency,
    local_currency,
    onChange,
    offset,
    ...props
}) => {
    const { general_store } = useStores();
    const { name, value, required } = props;
    // Get market feed restricted to 2 decimal places
    const market_feed = value ? truncateDecimal(parseFloat(exchange_rate * (1 + value / 100)), 2) : exchange_rate;

    const onBlurHandler = e => {
        let float_rate = e.target.value;
        if (float_rate && float_rate.length) {
            float_rate = parseFloat(float_rate).toFixed(2);
            if (!/^[+-]/.test(float_rate) && Math.sign(float_rate) > 0) {
                // Assign + symbol for positive rate
                e.target.value = `+${float_rate}`;
            }
        }
        onChange(e);
    };
    return (
        <div className={classNames(className, 'floating-rate')}>
            <section className={classNames('floating-rate__field', { 'mobile-layout': isMobile() })}>
                <Text as='div' size='s' weight='normal' line_height='xs' className='floating-rate__field--prefix'>
                    {localize('at')}
                </Text>
                <InputField
                    ariaLabel='Floating rate'
                    classNameInlinePrefix='floating-rate__percent'
                    classNameInput={classNames('floating-rate__input', {
                        'floating-rate__input--error-field': error_messages,
                    })}
                    current_focus={general_store.current_focus}
                    decimal_point_change={2}
                    id='floating_rate_input'
                    inline_prefix='%'
                    is_autocomplete_disabled
                    is_float
                    is_incrementable
                    is_signed
                    inputmode='decimal'
                    increment_button_type='button'
                    max_value={offset?.upper_limit}
                    min_value={offset?.lower_limit}
                    name={name}
                    onBlur={onBlurHandler}
                    onChange={change_handler}
                    setCurrentFocus={general_store.setCurrentFocus}
                    required={required}
                    type='number'
                    value={value}
                />
                <div className='floating-rate__mkt-rate'>
                    <Text
                        as='span'
                        size='xxxs'
                        color='prominent'
                        weight='normal'
                        line_height='xxs'
                        className='floating-rate__mkt-rate--label'
                    >
                        {localize('of the market rate')}
                    </Text>
                    <Text
                        as='span'
                        size='xs'
                        color='prominent'
                        weight='normal'
                        line_height='xs'
                        className='floating-rate__mkt-rate--msg'
                    >
                        1 {fiat_currency} = {formatMoney(local_currency, exchange_rate, true)} {local_currency}
                    </Text>
                </div>
            </section>
            {error_messages ? (
                <Text
                    as='div'
                    size='xxs'
                    color='loss-danger'
                    weight='normal'
                    line_height='xs'
                    className='floating-rate__error-message'
                >
                    {error_messages}
                </Text>
            ) : (
                <Text
                    as='div'
                    size='xxs'
                    color='status-info-blue'
                    weight='normal'
                    line_height='xs'
                    className='floating-rate__hint'
                >
                    {localize('Your rate is')} = {formatMoney(local_currency, market_feed, true)} {local_currency}
                </Text>
            )}
        </div>
    );
};

FloatingRate.propTypes = {
    change_handler: PropTypes.func,
    className: PropTypes.string,
    exchange_rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    error_messages: PropTypes.string,
    fiat_currency: PropTypes.string,
    local_currency: PropTypes.string,
    onChange: PropTypes.func,
    offset: PropTypes.object,
};

export default observer(FloatingRate);

import React from 'react';
import classNames from 'classnames';
import { setDecimalPlaces, removeTrailingZeros, percentOf, roundOffDecimal } from 'Utils/format-value';
import { InputField, Text } from '@deriv/components';
import { useP2PExchangeRate, useP2PSettings } from '@deriv/hooks';
import { formatMoney, isMobileOrTablet, mobileOSDetect } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from 'Components/i18next';

type TFloatingRate = {
    change_handler?: () => void;
    className?: string;
    data_testid: string;
    error_messages: string;
    fiat_currency: string;
    local_currency: string;
    name?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    value?: string;
};

const FloatingRate = ({
    change_handler,
    className,
    data_testid,
    error_messages,
    fiat_currency,
    local_currency,
    name,
    onChange,
    required,
    value,
}: TFloatingRate) => {
    const {
        ui: { current_focus, setCurrentFocus },
    } = useStore();
    const exchange_rate = useP2PExchangeRate(local_currency);

    const { p2p_settings } = useP2PSettings();
    const override_exchange_rate = p2p_settings?.override_exchange_rate;
    const market_rate = override_exchange_rate ? Number(override_exchange_rate) : exchange_rate;
    const os = mobileOSDetect();
    const market_feed = value ? percentOf(market_rate, value) : market_rate;
    const decimal_place = setDecimalPlaces(market_feed, 6);

    // Input mask for formatting value on blur of floating rate field
    const onBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
        let float_rate = event.target.value;
        if (!isNaN(parseFloat(float_rate)) && float_rate.trim().length) {
            float_rate = parseFloat(float_rate).toFixed(2);
            if (/^\d+/.test(float_rate) && parseFloat(float_rate) > 0) {
                // Assign + symbol for positive rate
                event.target.value = `+${float_rate}`;
            } else {
                event.target.value = float_rate;
            }
        }
        onChange(event);
    };

    return (
        <div className={classNames(className, 'floating-rate')}>
            <section className={classNames('floating-rate__field', { 'mobile-layout': isMobileOrTablet() })}>
                <Text as='div' line_height='xs' className='floating-rate__field--prefix'>
                    {localize('at')}
                </Text>
                <InputField
                    ariaLabel='Floating rate'
                    classNameInlinePrefix='floating-rate__percent'
                    classNameInput={classNames('floating-rate__input', {
                        'floating-rate__input--error-field': error_messages,
                    })}
                    classNameDynamicSuffix='dc-input-suffix'
                    classNameWrapper={classNames({ 'dc-input-wrapper--error': error_messages })}
                    current_focus={current_focus}
                    data_testid={data_testid}
                    decimal_point_change={2}
                    id='floating_rate_input'
                    increment_button_type='button'
                    inline_prefix='%'
                    is_autocomplete_disabled
                    is_float
                    is_incrementable
                    is_signed
                    name={name}
                    onBlur={onBlurHandler}
                    onChange={change_handler}
                    required={required}
                    setCurrentFocus={setCurrentFocus}
                    type={isMobileOrTablet() && os !== 'iOS' ? 'tel' : 'number'}
                    value={value ?? ''}
                />
                <div className='floating-rate__mkt-rate'>
                    <Text
                        as='span'
                        className='floating-rate__mkt-rate--label'
                        color='hint'
                        line_height='xxs'
                        size='xxs'
                    >
                        {localize('of the market rate')}
                    </Text>
                    <Text
                        as='span'
                        className='floating-rate__mkt-rate--msg'
                        color='prominent'
                        line_height='xs'
                        size='xxs'
                    >
                        1 {fiat_currency} = {removeTrailingZeros(formatMoney(local_currency, market_rate, true, 6))}
                    </Text>
                </div>
            </section>
            {error_messages ? (
                <Text as='div' className='floating-rate__error-message' color='loss-danger' line_height='xs' size='xxs'>
                    {error_messages}
                </Text>
            ) : (
                <Text as='div' className='floating-rate__hint' color='status-info-blue' line_height='xs' size='xxs'>
                    {localize('Your rate is')} ={' '}
                    {removeTrailingZeros(
                        formatMoney(local_currency, roundOffDecimal(market_feed, decimal_place), true, decimal_place)
                    )}{' '}
                    {local_currency}
                </Text>
            )}
        </div>
    );
};

export default observer(FloatingRate);

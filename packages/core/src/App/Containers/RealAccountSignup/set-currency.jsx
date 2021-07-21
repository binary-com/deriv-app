import classNames from 'classnames';
import React from 'react';
import { localize } from '@deriv/translations';
import { currencySelectorConfig } from '@deriv/account';
import { website_name, generateValidationFunction } from '@deriv/shared';
import { Text } from '@deriv/components';
import { connect } from 'Stores/connect';
import CurrencySelector from './currency-selector.jsx';
import LoadingModal from './real-account-signup-loader.jsx';
import 'Sass/set-currency.scss';
import 'Sass/change-account.scss';

const SetCurrency = ({
    setLoading,
    onSuccessSetAccountCurrency,
    onError,
    available_crypto_currencies,
    has_fiat,
    landing_company_shortcode,
    is_loading,
    ...props
}) => {
    const form_error = React.useState('');
    const form_value = React.useState({ currency: '' });

    const setCurrency = (obj, setSubmitting) => {
        setLoading(true);
        const { currency } = obj;
        if (currency) {
            props
                .setCurrency(currency)
                .then(response => {
                    setSubmitting(false);
                    onSuccessSetAccountCurrency('', response.echo_req.set_account_currency);
                })
                .catch(error_message => {
                    onError(error_message);
                })
                .finally(() => setLoading(false));
        }
    };

    const updateValue = (index, value, setSubmitting) => {
        setCurrency(value, setSubmitting);
    };

    const noCryptoAvailable = () => {
        return available_crypto_currencies.length === 0 && has_fiat && props.currency;
    };

    if (is_loading) return <LoadingModal />;
    return (
        <div
            className={classNames('set-currency-modal', {
                'set-currency-modal--disabled': noCryptoAvailable(),
            })}
        >
            {noCryptoAvailable() && (
                <div className='set-currency-modal--disabled-message'>
                    <p>
                        {localize(
                            'You already have an account for each of the cryptocurrencies available on {{deriv}}.',
                            {
                                deriv: website_name,
                            }
                        )}
                    </p>
                </div>
            )}
            <div className='set-currency-modal__heading-container'>
                <Text
                    as='p'
                    size='xs'
                    line_height='s'
                    align='center'
                    className='set-currency-modal__heading-container__main-heading'
                >
                    {localize(
                        'You have an account that do not have currency assigned. Please choose a currency to trade with this account.'
                    )}
                </Text>
                <Text
                    as='p'
                    weight='bold'
                    align='center'
                    className='set-currency-modal__heading-container__sub-heading'
                >
                    {localize('Please choose your currency')}
                </Text>
            </div>
            <CurrencySelector
                className='account-wizard__body'
                onSubmit={updateValue}
                value={form_value}
                form_error={form_error}
                set_currency
                validate={generateValidationFunction(landing_company_shortcode, currencySelectorConfig)}
                {...props}
            />
        </div>
    );
};

export default connect(({ client }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    can_change_fiat_currency: client.can_change_fiat_currency,
    currency: client.currency,
    current_currency_type: client.current_currency_type,
    current_fiat_currency: client.current_fiat_currency,
    is_eu: client.is_eu,
    has_fiat: client.has_fiat,
    landing_company_shortcode: client.landing_company_shortcode,
    setCurrency: client.setAccountCurrency,
    createCryptoAccount: client.createCryptoAccount,
}))(SetCurrency);

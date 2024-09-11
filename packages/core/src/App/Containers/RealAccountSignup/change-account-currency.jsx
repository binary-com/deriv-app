import { Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FormSubmitButton, Text } from '@deriv/components';
import { isMobile, reorderCurrencies } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { CurrencyRadioButtonGroup, CurrencyRadioButton } from '@deriv/account';
import './currency-selector.scss';

const FIAT_CURRENCY_TYPE = 'fiat';

const ChangeAccountCurrency = observer(
    ({ value, onSubmit, form_error, can_change_fiat_currency, current_currency_type }) => {
        const { client, ui } = useStore();
        const {
            upgradeable_currencies: legal_allowed_currencies,
            currency: client_currency,
            current_fiat_currency,
        } = client;
        const { closeRealAccountSignup } = ui;
        const getReorderedCurrencies = () =>
            reorderCurrencies(legal_allowed_currencies.filter(currency => currency.type === FIAT_CURRENCY_TYPE));

        const is_fiat = current_currency_type === 'fiat';
        const fiat_message = (
            <Localize
                i18n_default_text='If you want to change your account currency, please contact us via <0>live chat</0>.'
                components={[
                    <span
                        key={0}
                        className='link link--orange'
                        onClick={() => {
                            closeRealAccountSignup();
                            window.LiveChatWidget.call('maximize');
                        }}
                    />,
                ]}
            />
        );

        const non_fiat_mesage = (
            <Localize
                i18n_default_text='Please switch to your {{fiat_currency}} account to change currencies.'
                values={{
                    fiat_currency: current_fiat_currency?.toUpperCase?.(),
                }}
            />
        );

        const disabled_message = is_fiat ? fiat_message : non_fiat_mesage;

        return (
            <Formik
                initialValues={{
                    fiat: value.fiat,
                }}
                onSubmit={onSubmit}
            >
                {({ handleSubmit, values, errors, touched, isSubmitting }) => (
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <Text as='h1' color='prominent' weight='bold' align='center' className='change-currency__title'>
                            <Localize i18n_default_text='Change your currency' />
                        </Text>
                        <Text as='h3' size='xxs' align='center' className='change-currency__sub-title'>
                            <Localize i18n_default_text='Choose the currency you would like to trade with.' />
                        </Text>
                        {!can_change_fiat_currency && (
                            <div className='account-wizard--disabled-message'>
                                <Text
                                    as='p'
                                    align='center'
                                    size='xxs'
                                    className='account-wizard--disabled-message-description'
                                >
                                    {disabled_message}
                                </Text>
                            </div>
                        )}
                        <CurrencyRadioButtonGroup
                            id='fiat'
                            label={localize('Cryptocurrencies')}
                            className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                            value={values.fiat}
                            error={errors.fiat}
                            touched={touched.fiat}
                            is_title_enabled={false}
                            item_count={getReorderedCurrencies().length}
                        >
                            {getReorderedCurrencies().map(currency => (
                                <Field
                                    key={currency.value}
                                    component={CurrencyRadioButton}
                                    name='fiat'
                                    id={currency.value}
                                    label={currency.name}
                                    selected={currency.value === client_currency}
                                />
                            ))}
                        </CurrencyRadioButtonGroup>
                        <FormSubmitButton
                            className='change-currency__button'
                            is_disabled={isSubmitting || !values.fiat}
                            label={localize('Change currency')}
                            is_absolute={!isMobile()}
                            form_error={form_error}
                        />
                    </form>
                )}
            </Formik>
        );
    }
);

ChangeAccountCurrency.propTypes = {
    onSubmit: PropTypes.func,
    closeModal: PropTypes.func,
    value: PropTypes.shape({
        crypto: PropTypes.string,
        fiat: PropTypes.string,
    }),
    form_error: PropTypes.string,
    can_change_fiat_currency: PropTypes.bool,
    current_currency_type: PropTypes.string,
    current_fiat_currency: PropTypes.string,
};

export default ChangeAccountCurrency;

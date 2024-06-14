import { Field, Formik } from 'formik';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { usePaymentAgentList } from '@deriv/hooks';
import { FormSubmitButton, Icon, Loading, Text, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobileOrTablet, reorderCurrencies, routes } from '@deriv/shared';
import { CurrencyRadioButtonGroup, CurrencyRadioButton } from '@deriv/account';
import AddCryptoCurrency from './add-crypto-currency.jsx';
import CurrencyProvider from './choose-currency';
import { observer, useStore } from '@deriv/stores';
import './currency-selector.scss';

const CRYPTO_CURRENCY_TYPE = 'crypto';
const FIAT_CURRENCY_TYPE = 'fiat';

const AddCurrency = observer(({ onSubmit, hasNoAvailableCrypto, is_add_crypto, is_add_fiat }) => {
    const { client, modules, ui } = useStore();
    const { available_crypto_currencies, has_fiat, upgradeable_currencies: legal_allowed_currencies } = client;
    const { cashier } = modules;
    const setShouldShowAllAvailableCurrencies = cashier.general_store.setShouldShowAllAvailableCurrencies;
    const deposit_target = cashier.general_store.deposit_target;
    const { openRealAccountSignup } = ui;

    const [form_error] = React.useState('');
    const [form_value] = React.useState({ crypto: '', fiat: '' });
    const { data: all_payment_agent_list, isLoading: is_loading } = usePaymentAgentList();

    const getReorderedCurrencies = React.useMemo(() => {
        const allowed_currencies_payment_agent_availability = CurrencyProvider.currenciesPaymentAgentAvailability(
            legal_allowed_currencies,
            all_payment_agent_list
        );

        const crypto = reorderCurrencies(
            allowed_currencies_payment_agent_availability?.filter(
                currency =>
                    currency.type === CRYPTO_CURRENCY_TYPE &&
                    available_crypto_currencies.some(x => x.value === currency.value)
            ),
            CRYPTO_CURRENCY_TYPE
        );

        const fiat = reorderCurrencies(
            allowed_currencies_payment_agent_availability?.filter(
                currency =>
                    currency.type === FIAT_CURRENCY_TYPE &&
                    !available_crypto_currencies.some(x => x.value === currency.value)
            )
        );

        return {
            crypto,
            fiat,
        };
    }, [all_payment_agent_list, available_crypto_currencies, legal_allowed_currencies]);

    const onClickBack = () => {
        openRealAccountSignup('choose');
        if (deposit_target === routes.cashier_pa) {
            setShouldShowAllAvailableCurrencies(true);
        }
    };

    const AddFiat = () => {
        return (
            <div>
                <Text as='h1' color='prominent' align='center' weight='bold' className='add-currency__title'>
                    {localize('Fiat currencies')}
                </Text>
                {!!has_fiat && (
                    <Text as='p' color='prominent' align='center' size='xxs' className='add-currency__sub-title'>
                        {localize('You are limited to one fiat account only.')}
                    </Text>
                )}
                {is_loading ? (
                    <Loading is_fullscreen={false} />
                ) : (
                    <CurrencyRadioButtonGroup
                        id='crypto_currency'
                        className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                        item_count={getReorderedCurrencies.fiat.length}
                    >
                        {getReorderedCurrencies.fiat.map(currency => (
                            <Field
                                key={currency.value}
                                component={CurrencyRadioButton}
                                name='currency'
                                id={currency.value}
                                label={currency.name}
                                icon={currency.icon}
                                second_line_label={currency.second_line_label}
                                onClick={currency.onClick}
                                selected={has_fiat}
                            />
                        ))}
                    </CurrencyRadioButtonGroup>
                )}
            </div>
        );
    };

    const AddCrypto = () => {
        return (
            <div>
                <Text as='h1' color='prominent' align='center' weight='bold' className='add-currency__title'>
                    {localize('Cryptocurrencies')}
                </Text>
                <Text as='p' color='prominent' align='center' size='xxs' className='add-currency__sub-title'>
                    {localize('You can open an account for each cryptocurrency.')}
                </Text>
                {is_loading ? (
                    <Loading is_fullscreen={false} />
                ) : (
                    <CurrencyRadioButtonGroup
                        id='crypto_currency'
                        className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                        item_count={getReorderedCurrencies.crypto.length}
                    >
                        {getReorderedCurrencies.crypto.map(currency => (
                            <Field
                                key={currency.value}
                                component={CurrencyRadioButton}
                                name='currency'
                                id={currency.value}
                                label={currency.name}
                                icon={currency.icon}
                                second_line_label={currency.second_line_label}
                                onClick={currency.onClick}
                                selected={deposit_target === routes.cashier_pa ? !currency.has_payment_agent : false}
                            />
                        ))}
                    </CurrencyRadioButtonGroup>
                )}
            </div>
        );
    };

    if (is_add_crypto)
        return (
            <ThemedScrollbars autohide={false}>
                <div
                    className={classNames('add-crypto-currency cashier-deposit', {
                        'account-wizard--disabled': hasNoAvailableCrypto(),
                    })}
                >
                    <AddCryptoCurrency
                        className='account-wizard__body'
                        onSubmit={onSubmit}
                        onClickBack={onClickBack}
                        value={form_value}
                        form_error={form_error}
                        should_show_crypto_only
                        hasNoAvailableCrypto={hasNoAvailableCrypto}
                    />
                </div>
            </ThemedScrollbars>
        );

    if (is_add_fiat) {
        return (
            <ThemedScrollbars autohide={false}>
                <div className='change-currency'>
                    <AddCryptoCurrency
                        className='account-wizard__body'
                        onSubmit={onSubmit}
                        value={form_value}
                        form_error={form_error}
                        should_show_fiat_only
                        hasNoAvailableCrypto={hasNoAvailableCrypto}
                        is_add_fiat
                    />
                </div>
            </ThemedScrollbars>
        );
    }

    return (
        <Formik
            initialValues={{
                currency: form_value.currency,
            }}
            onSubmit={onSubmit}
        >
            {({ handleSubmit, values, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <ThemedScrollbars height={isMobileOrTablet() ? window.innerHeight - 190 : '460px'}>
                        <div>
                            <Text
                                as='p'
                                color='prominent'
                                weight='bold'
                                align='center'
                                className='add-currency__wizard-header'
                            >
                                {localize('Choose your currency')}
                            </Text>

                            <AddFiat />
                            <div className='add-currency__underline' />
                            <AddCrypto />
                        </div>
                    </ThemedScrollbars>
                    <div className='add-currency__note-wrapper'>
                        <Text as='p' color='prominent' align='center' size='xxs' className='add-currency__note'>
                            {localize('Some currencies may not be supported by payment agents in your country.')}
                        </Text>
                    </div>
                    <FormSubmitButton
                        className='currency-selector__button'
                        is_disabled={isSubmitting || !values.currency}
                        label={localize('Add account')}
                        is_absolute
                        form_error={form_error}
                        has_cancel
                        cancel_label={localize('Back')}
                        cancel_icon={<Icon icon='IcArrowLeftBold' />}
                        onCancel={() => onClickBack()}
                    />
                </form>
            )}
        </Formik>
    );
});

AddCurrency.propTypes = {
    onSubmit: PropTypes.func,
    is_add_crypto: PropTypes.bool,
    is_add_fiat: PropTypes.bool,
    hasNoAvailableCrypto: PropTypes.func,
};

export default AddCurrency;

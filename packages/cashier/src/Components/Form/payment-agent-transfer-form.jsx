import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Formik, Form } from 'formik';
import { Button, DesktopWrapper, Input, Text } from '@deriv/components';
import { getDecimalPlaces, validNumber, getCurrencyDisplayCode } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import FormError from '../Error/form-error.jsx';

const validateTransfer = (values, { balance, currency, transfer_limit }) => {
    const errors = {};

    if (!values.loginid || !/^[A-Za-z]+[0-9]+$/.test(values.loginid)) {
        errors.loginid = localize('Please enter a valid client login ID.');
    }

    const { is_ok, message } = validNumber(values.amount, {
        type: 'float',
        decimals: getDecimalPlaces(currency),
        ...(transfer_limit.min && {
            min: transfer_limit.min,
            max: +balance >= transfer_limit.min && +balance < transfer_limit.max ? balance : transfer_limit.max,
        }),
    });

    if (!values.amount) {
        errors.amount = localize('This field is required.');
    } else if (+balance < +values.amount) {
        errors.amount = localize('Insufficient balance.');
    } else if (!is_ok) {
        errors.amount = message;
    }

    if (values.description && !/^[0-9A-Za-z .,'-]{0,250}$/.test(values.description.replace(/\n/g, ' '))) {
        errors.description = localize('Please enter a valid description.');
    }

    return errors;
};

const PaymentAgentTransferForm = ({
    amount,
    balance,
    currency,
    description,
    error,
    requestTryPaymentAgentTransfer,
    setErrorMessage,
    transfer_limit,
    transfer_to,
}) => {
    const validateTransferPassthrough = values =>
        validateTransfer(values, {
            balance,
            currency,
            transfer_limit,
        });

    const onTransferPassthrough = async (values, actions) => {
        const payment_agent_transfer = await requestTryPaymentAgentTransfer({
            amount: values.amount,
            currency,
            description: values.description.replace(/\n/g, ' '),
            transfer_to: values.loginid,
        });
        if (payment_agent_transfer.error) {
            actions.setSubmitting(false);
        }
    };

    return (
        <div className='cashier__wrapper payment-agent-transfer__container'>
            <DesktopWrapper>
                <Text
                    as='h2'
                    color='prominent'
                    weight='bold'
                    align='center'
                    className='cashier__header cashier__content-header'
                >
                    <Localize i18n_default_text='Transfer to client' />
                </Text>
            </DesktopWrapper>
            <Formik
                initialValues={{
                    // in case coming back from confirmation screen, populate the recent data to be edited
                    loginid: transfer_to || '',
                    amount: amount || '',
                    description: description || '',
                }}
                validate={validateTransferPassthrough}
                onSubmit={onTransferPassthrough}
            >
                {({ errors, isSubmitting, isValid, touched, handleChange }) => (
                    <Form noValidate>
                        <Field name='loginid'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    onChange={e => {
                                        setErrorMessage('');
                                        handleChange(e);
                                    }}
                                    className='payment-agent-transfer__input'
                                    type='text'
                                    label={localize('Client login ID')}
                                    error={touched.loginid && errors.loginid}
                                    required
                                    autoComplete='off'
                                    maxLength={20}
                                />
                            )}
                        </Field>
                        <Field name='amount'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    onChange={e => {
                                        setErrorMessage('');
                                        handleChange(e);
                                    }}
                                    className='payment-agent-transfer__input dc-input--no-placeholder'
                                    type='text'
                                    label={localize('Amount')}
                                    error={touched.amount && errors.amount}
                                    required
                                    trailing_icon={
                                        <span
                                            className={classNames(
                                                'symbols',
                                                `symbols--${(currency || '').toLowerCase()}`
                                            )}
                                        >
                                            {getCurrencyDisplayCode(currency)}
                                        </span>
                                    }
                                    autoComplete='off'
                                    maxLength='30'
                                />
                            )}
                        </Field>
                        <Field name='description'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    onChange={e => {
                                        setErrorMessage('');
                                        handleChange(e);
                                    }}
                                    className='payment-agent-transfer__input-area'
                                    type='textarea'
                                    label={localize('Description')}
                                    error={errors.description}
                                    required
                                    autoComplete='off'
                                    has_character_counter
                                    max_characters='250'
                                />
                            )}
                        </Field>
                        <div className='cashier__form-submit'>
                            <Button
                                className='cashier__form-submit-button'
                                type='submit'
                                is_disabled={!isValid || isSubmitting}
                                primary
                                large
                            >
                                <Localize i18n_default_text='Transfer' />
                            </Button>
                        </div>
                        <FormError error={error} />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

PaymentAgentTransferForm.propTypes = {
    amount: PropTypes.string,
    balance: PropTypes.string,
    currency: PropTypes.string,
    description: PropTypes.string,
    error: PropTypes.object,
    requestTryPaymentAgentTransfer: PropTypes.func,
    setErrorMessage: PropTypes.func,
    transfer_limit: PropTypes.object,
    transfer_to: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    balance: client.balance,
    currency: client.currency,
    amount: modules.cashier.general.config.payment_agent_transfer.confirm.amount,
    description: modules.cashier.general.config.payment_agent_transfer.confirm.description,
    error: modules.cashier.general.config.payment_agent_transfer.error,
    requestTryPaymentAgentTransfer: modules.cashier.general.requestTryPaymentAgentTransfer,
    setErrorMessage: modules.cashier.general.setErrorMessage,
    transfer_limit: modules.cashier.general.config.payment_agent_transfer.transfer_limit,
    transfer_to: modules.cashier.general.config.payment_agent_transfer.confirm.client_id,
}))(PaymentAgentTransferForm);

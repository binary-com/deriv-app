import classNames from 'classnames';
import React from 'react';
import { Field, FieldProps, Formik, Form } from 'formik';
import { Button, DesktopWrapper, Input, Text } from '@deriv/components';
import { getDecimalPlaces, validNumber, getCurrencyDisplayCode } from '@deriv/shared';
import { PaymentAgentTransferRequest } from '@deriv/api-types';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { RootStore, TReactChangeEvent } from 'Types';
import ErrorDialog from 'Components/error-dialog';
import './payment-agent-transfer-form.scss';

type TValidateTransferValueProps = {
    amount: number;
    loginid: string;
    description: string;
};

type TValidateTransferProps = {
    balance: string;
    currency: string;
    transfer_limit: {
        min?: string | number;
        max?: string | number;
    };
};

type TPaymentAgentTransferForm = {
    amount: number;
    balance: string;
    currency: string;
    description: string;
    error: object;
    requestTryPaymentAgentTransfer: (arg: PaymentAgentTransferRequest) => {
        error?: string;
    };
    setErrorMessage: (error: string) => void;
    transfer_limit: {
        min?: string | number;
        max?: string | number;
    };
    transfer_to: string;
};

const validateTransfer = (
    values: TValidateTransferValueProps,
    { balance, currency, transfer_limit = {} }: TValidateTransferProps
) => {
    const errors: { loginid?: string; amount?: string; description?: string } = {};

    if (!values.loginid || !/^[A-Za-z]+[0-9]+$/.test(values.loginid)) {
        errors.loginid = localize('Please enter a valid client login ID.');
    }

    const { is_ok, message } = validNumber(values.amount, {
        type: 'float',
        decimals: getDecimalPlaces(currency),
        ...(transfer_limit.min &&
            transfer_limit.max && {
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
}: TPaymentAgentTransferForm) => {
    const validateTransferPassthrough = (values: TValidateTransferValueProps) =>
        validateTransfer(values, {
            balance,
            currency,
            transfer_limit,
        });

    const onTransferPassthrough = async (
        values: TValidateTransferValueProps,
        actions: { setSubmitting: (status: boolean) => void }
    ) => {
        const payment_agent_transfer = await requestTryPaymentAgentTransfer({
            amount: values.amount,
            currency,
            description: values.description.replace(/\n/g, ' '),
            paymentagent_transfer: 1,
            transfer_to: values.loginid,
        });
        if (payment_agent_transfer.error) {
            actions.setSubmitting(false);
        }
    };

    return (
        <div
            className='cashier__wrapper payment-agent-transfer-form__container'
            data-testid='dt_payment_agent_transfer_form_container'
        >
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
                    amount: amount || 0,
                    description: description || '',
                }}
                validate={validateTransferPassthrough}
                onSubmit={onTransferPassthrough}
            >
                {({ errors, isSubmitting, isValid, touched, handleChange }) => (
                    <Form noValidate>
                        <Field name='loginid'>
                            {({ field }: FieldProps) => (
                                <Input
                                    {...field}
                                    onChange={(e: TReactChangeEvent) => {
                                        setErrorMessage('');
                                        handleChange(e);
                                    }}
                                    className='payment-agent-transfer-form__input'
                                    data-testid='dt_payment_agent_transfer_form_input_loginid'
                                    type='text'
                                    label={localize('Client account number')}
                                    error={touched.loginid && errors.loginid}
                                    required
                                    autoComplete='off'
                                    maxLength={20}
                                />
                            )}
                        </Field>
                        <Field name='amount'>
                            {({ field }: FieldProps) => (
                                <Input
                                    {...field}
                                    onChange={(e: TReactChangeEvent) => {
                                        setErrorMessage('');
                                        handleChange(e);
                                    }}
                                    className='payment-agent-transfer-form__input dc-input--no-placeholder'
                                    data-testid='dt_payment_agent_transfer_form_input_amount'
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
                            {({ field }: FieldProps) => (
                                <Input
                                    {...field}
                                    onChange={(e: TReactChangeEvent) => {
                                        setErrorMessage('');
                                        handleChange(e);
                                    }}
                                    className='payment-agent-transfer-form__input-area'
                                    data-testid='dt_payment_agent_transfer_form_input_description'
                                    type='textarea'
                                    label={localize('Description')}
                                    error={errors.description}
                                    required
                                    autoComplete='off'
                                    has_character_counter
                                    max_characters={250}
                                />
                            )}
                        </Field>
                        <div className='cashier__form-submit'>
                            <Button
                                className='cashier__form-submit-button payment-agent-transfer-form__submit-button'
                                type='submit'
                                is_disabled={!isValid || isSubmitting}
                                primary
                                large
                            >
                                <Localize i18n_default_text='Transfer' />
                            </Button>
                        </div>
                        <ErrorDialog error={error} />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default connect(({ client, modules }: RootStore) => ({
    balance: client.balance,
    currency: client.currency,
    amount: modules.cashier.payment_agent_transfer.confirm.amount,
    description: modules.cashier.payment_agent_transfer.confirm.description,
    error: modules.cashier.payment_agent_transfer.error,
    requestTryPaymentAgentTransfer: modules.cashier.payment_agent_transfer.requestTryPaymentAgentTransfer,
    setErrorMessage: modules.cashier.payment_agent_transfer.error.setErrorMessage,
    transfer_limit: modules.cashier.payment_agent_transfer.transfer_limit,
    transfer_to: modules.cashier.payment_agent_transfer.confirm.client_id,
}))(PaymentAgentTransferForm);

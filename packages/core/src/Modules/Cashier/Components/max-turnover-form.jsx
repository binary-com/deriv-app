import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { hasCorrectDecimalPlaces, getDecimalPlaces } from '@deriv/shared';
import { Button, Input } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services';

const MaxTurnoverForm = ({ onMount, setErrorConfig, currency }) => {
    const initial_values = {
        max_30day_turnover: '',
    };

    const validateFields = values => {
        const errors = {};
        const is_number = /^\d+(\.\d+)?$/;
        const max_number = 9999999999999;

        const required_message = localize('Please enter max 30 days turnover.');
        const valid_number_message = localize('Should be valid number');
        const max_number_message = localize('Reached maximum number of digits');
        const max_decimal_message = (
            <Localize
                i18n_default_text='Reached maximum number of decimals: {{decimal}}'
                values={{ decimal: getDecimalPlaces(currency) }}
            />
        );

        if (!values.max_30day_turnover) {
            errors.max_30day_turnover = required_message;
        } else if (!is_number.test(values.max_30day_turnover)) {
            errors.max_30day_turnover = valid_number_message;
        } else if (+values.max_30day_turnover > max_number) {
            errors.max_30day_turnover = max_number_message;
        } else if (!hasCorrectDecimalPlaces(currency, values.max_30day_turnover)) {
            errors.max_30day_turnover = max_decimal_message;
        }

        return errors;
    };

    const handleSubmit = (values, { setSubmitting, setStatus }) => {
        setSubmitting(true);
        WS.send({ set_self_exclusion: 1, max_30day_turnover: values.max_30day_turnover }).then(response => {
            if (response.error) {
                setStatus(response.error);
            } else {
                setErrorConfig('is_self_exclusion_max_turnover_set', false);
                onMount();
            }
            setSubmitting(false);
        });
    };

    return (
        <div className='max-turnover'>
            <h2 className='max-turnover__title'>{localize('Set limits')}</h2>
            <p className='max-turnover__desc'>
                {localize('Please set 30 days maximum total stake limits before deposit')}
            </p>

            <Formik initialValues={initial_values} onSubmit={handleSubmit} validate={validateFields}>
                {({ values, errors, isValid, touched, handleChange, handleBlur, isSubmitting, dirty, status }) => (
                    <Form>
                        <Field name='max_30day_turnover'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    data-lpignore='true'
                                    type='text'
                                    className='max-turnover__input'
                                    label={localize('30 days max total stake') + ` (${currency})`}
                                    value={values.max_30day_turnover}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    hint={localize('Limits your max stake for 30 days for all deriv platforms')}
                                    required
                                    error={touched.max_30day_turnover && errors.max_30day_turnover}
                                />
                            )}
                        </Field>
                        <p className='max-turnover__error'>{status}</p>
                        <Button disabled={!dirty || !isValid || isSubmitting} primary large type='submit'>
                            {localize('Set limit')}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

MaxTurnoverForm.propTypes = {
    currency: PropTypes.string,
    onMount: PropTypes.func,
    setErrorConfig: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    currency: client.currency,
    onMount: modules.cashier.onMount,
    setErrorConfig: modules.cashier.setErrorConfig,
}))(MaxTurnoverForm);

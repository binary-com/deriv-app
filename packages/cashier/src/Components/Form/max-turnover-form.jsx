import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { getDecimalPlaces, routes, validNumber, WS } from '@deriv/shared';
import { Button, Input, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MaxTurnoverForm = ({
    onMount,
    setErrorConfig,
    currency,
    removeNotificationByKey,
    removeNotificationMessageByKey,
}) => {
    const initial_values = {
        max_30day_turnover: '',
    };

    const validateFields = values => {
        // TODO: [self-exclusion] handle shared self exclusion validation
        const errors = {};
        const min_number = 1;

        if (!values.max_30day_turnover) {
            errors.max_30day_turnover = localize('This field is required.');
        } else {
            const { is_ok, message } = validNumber(values.max_30day_turnover, {
                type: 'float',
                decimals: getDecimalPlaces(currency),
                min: min_number,
            });
            if (!is_ok) errors.max_30day_turnover = message;
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

                // Clear "max_turnover_limit_not_set" notification.
                removeNotificationByKey({ key: 'max_turnover_limit_not_set' });
                removeNotificationMessageByKey({ key: 'max_turnover_limit_not_set' });
            }
            setSubmitting(false);
        });
    };

    return (
        <div className='max-turnover'>
            <Text as='h2' weight='bold' align='center' className='max-turnover__title'>
                {localize('30 days max total stake')}
            </Text>

            <Formik initialValues={initial_values} onSubmit={handleSubmit} validate={validateFields}>
                {({ values, errors, isValid, handleChange, handleBlur, isSubmitting, dirty, status }) => (
                    <Form className='max-turnover__form'>
                        <Field name='max_30day_turnover'>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    data-lpignore='true'
                                    type='text'
                                    className='max-turnover__input'
                                    label={
                                        <Localize
                                            i18n_default_text='30 days max total stake {{currency}}'
                                            values={{ currency }}
                                        />
                                    }
                                    value={values.max_30day_turnover}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    hint={localize('Limits your total stake for 30 days across all Deriv platforms.')}
                                    maxLength='13'
                                    required
                                    error={errors.max_30day_turnover}
                                />
                            )}
                        </Field>

                        <p className='max-turnover__desc'>
                            <Localize
                                i18n_default_text='You can further control the amount of money and time you spend on your trading activities on the <0>Self-exclusion</0> page.'
                                components={[
                                    <NavLink key={0} className='link link--orange' to={routes.self_exclusion} />,
                                ]}
                            />
                        </p>

                        <p className='max-turnover__error'>{status}</p>
                        <Button
                            className='max-turnover__button'
                            disabled={!dirty || !isValid || isSubmitting}
                            primary
                            large
                            type='submit'
                        >
                            {localize('Set')}
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
    removeNotificationByKey: PropTypes.func,
    removeNotificationMessageByKey: PropTypes.func,
};

export default connect(({ client, modules, ui }) => ({
    currency: client.currency,
    onMount: modules.cashier.general.onMount,
    setErrorConfig: modules.cashier.general.setErrorConfig,
    removeNotificationByKey: ui.removeNotificationByKey,
    removeNotificationMessageByKey: ui.removeNotificationMessageByKey,
}))(MaxTurnoverForm);

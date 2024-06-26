import React from 'react';
import classNames from 'classnames';
import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { Button, Div100vhContainer, FadeWrapper, Input, Modal, PageOverlay } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';

const SelfExclusionForm = props => {
    const [max_losses_error, setMaxLossesError] = React.useState('');
    const {
        is_onscreen_keyboard_active,
        is_logged_in,
        initial_values,
        api_max_losses,
        onRunButtonClick,
        resetSelfExclusion,
        updateSelfExclusion,
        setRunLimit,
        is_mobile,
    } = props;

    React.useEffect(() => {
        if (!is_logged_in) {
            resetSelfExclusion();
        }
    });

    const onSubmitLimits = async values => {
        if (values.form_max_losses !== api_max_losses) {
            const set_losses = await updateSelfExclusion({ max_losses: values.form_max_losses });
            if (set_losses?.error) {
                setMaxLossesError(localize(set_losses.error.message));
                return;
            }
        }
        setRunLimit(values.run_limit);
        onRunButtonClick();
    };
    const validateFields = values => {
        const errors = {};
        // Regex
        const is_number = /^\d+(\.\d+)?$/;
        const is_integer = /^\d+$/;
        const max_number = 9999999999999;

        // Messages
        const requested_field_message = localize('This field is required.');
        const valid_number_message = localize('Should be a valid number');
        const max_number_message = localize('Reached maximum number of digits');
        const max_decimal_message = localize('Reached maximum number of decimals');
        const max_losses_limit_message = localize('Please enter a number between 0 and {{api_max_losses}}.', {
            api_max_losses,
        });
        const requested_fields = ['run_limit', 'form_max_losses'];
        const only_numbers = ['run_limit', 'form_max_losses'];
        const decimal_limit = ['form_max_losses'];
        const has_max_limit = ['form_max_losses'];

        const only_integers = ['run_limit'];

        requested_fields.forEach(item => {
            if (!values[item]) {
                errors[item] = requested_field_message;
            }
        });

        only_numbers.forEach(item => {
            if (values[item]) {
                if (!is_number.test(values[item])) {
                    errors[item] = valid_number_message;
                } else if (+values[item] > max_number) {
                    errors[item] = max_number_message;
                }
            }
        });

        only_integers.forEach(item => {
            if (values[item]) {
                if (!is_integer.test(values[item])) {
                    errors[item] = valid_number_message;
                }
            }
        });

        decimal_limit.forEach(item => {
            const amount_decimal_array = values[item].toString().split('.')[1];
            const amount_decimal_places = amount_decimal_array ? amount_decimal_array.length || 0 : 0;
            if (amount_decimal_places > 2) {
                errors[item] = max_decimal_message;
            }
        });
        has_max_limit.forEach(item => {
            if (api_max_losses !== 0 && api_max_losses !== values[item] && api_max_losses < values[item]) {
                errors[item] = max_losses_limit_message;
            } else {
                setMaxLossesError('');
            }
        });

        return errors;
    };

    return (
        <div className='db-self-exclusion'>
            <div className='db-self-exclusion__content'>
                <div className='db-self-exclusion__info'>
                    {localize('Enter limits to stop your bot from trading when any of these conditions are met.')}
                </div>
                <Formik initialValues={initial_values} validate={validateFields} onSubmit={onSubmitLimits}>
                    {({ values, touched, errors, isValid, handleChange }) => {
                        return (
                            <Form>
                                <div className='db-self-exclusion__form-group'>
                                    <Field name='form_max_losses'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                className='db-self-exclusion__input'
                                                type='text'
                                                label={localize('Daily loss limit')}
                                                value={values.form_max_losses}
                                                onChange={handleChange}
                                                error={max_losses_error || (touched[field.name] && errors[field.name])}
                                                hint={localize(
                                                    'Limits your potential losses for the day across all Deriv platforms.'
                                                )}
                                            />
                                        )}
                                    </Field>
                                </div>
                                <div className='db-self-exclusion__form-group'>
                                    <Field name='run_limit'>
                                        {({ field }) => {
                                            return (
                                                <Input
                                                    {...field}
                                                    className='db-self-exclusion__input'
                                                    type='text'
                                                    label={localize('Maximum consecutive trades')}
                                                    value={values.run_limit}
                                                    onChange={handleChange}
                                                    error={touched[field.name] && errors.run_limit}
                                                    hint={localize(
                                                        'Maximum number of trades your bot will execute for this run.'
                                                    )}
                                                />
                                            );
                                        }}
                                    </Field>
                                </div>
                                <div
                                    className={classNames('db-self-exclusion__footer', {
                                        'db-self-exclusion__footer--relative': is_mobile && is_onscreen_keyboard_active,
                                    })}
                                >
                                    <div className='db-self-exclusion__footer-btn-group'>
                                        <Button
                                            large
                                            text={localize('Cancel')}
                                            onClick={resetSelfExclusion}
                                            secondary
                                            type='button'
                                        />
                                        <Button
                                            type='submit'
                                            large
                                            text={localize('Apply and run')}
                                            is_disabled={
                                                !isValid ||
                                                !values.run_limit ||
                                                !values.form_max_losses ||
                                                max_losses_error !== ''
                                            }
                                            primary
                                        />
                                    </div>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
};

const SelfExclusion = observer(({ onRunButtonClick }) => {
    const { self_exclusion } = useDBotStore();
    const { ui, client } = useStore();
    const { is_restricted, resetSelfExclusion, initial_values, api_max_losses, run_limit, setRunLimit } =
        self_exclusion;
    const { is_onscreen_keyboard_active, is_desktop } = ui;
    const { is_logged_in, updateSelfExclusion, virtual_account_loginid } = client;

    const self_exclusion_form_props = {
        is_onscreen_keyboard_active,
        is_logged_in,
        initial_values,
        api_max_losses,
        onRunButtonClick,
        resetSelfExclusion,
        updateSelfExclusion,
        setRunLimit,
        virtual_account_loginid,
        run_limit,
        is_desktop,
    };

    return (
        <>
            {!is_desktop ? (
                <FadeWrapper is_visible={is_restricted} className='limits__wrapper' keyname='limitis__wrapper'>
                    <PageOverlay header={localize('Limits')} onClickClose={resetSelfExclusion}>
                        <Div100vhContainer className='limits__wrapper--is-mobile'>
                            <SelfExclusionForm {...self_exclusion_form_props} />
                        </Div100vhContainer>
                    </PageOverlay>
                </FadeWrapper>
            ) : (
                <Modal
                    is_open={is_restricted}
                    has_close_icon
                    width='440px'
                    height='374px'
                    toggleModal={resetSelfExclusion}
                    className='db-self-exclusion__modal'
                    title={localize('Limits')}
                >
                    <SelfExclusionForm {...self_exclusion_form_props} />
                </Modal>
            )}
        </>
    );
});

SelfExclusion.propTypes = {
    onRunButtonClick: PropTypes.func,
};

export default SelfExclusion;

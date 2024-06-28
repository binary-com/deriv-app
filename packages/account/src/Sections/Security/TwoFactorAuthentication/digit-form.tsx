import React from 'react';
import clsx from 'clsx';
import { Formik, Form, Field, FormikProps, FormikHelpers, FieldProps } from 'formik';
import { Input, Button } from '@deriv/components';
import { getPropertyValue, WS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

type TResponse = {
    error?: {
        message: string;
        code: string;
    };
};

type TDigitFormValues = {
    digit_code: string;
};

const DigitForm = observer(() => {
    const { client, common } = useStore();
    const { is_language_changing } = common;
    const { has_enabled_two_fa, setTwoFAChangedStatus, setTwoFAStatus } = client;
    const [is_success, setSuccess] = React.useState(false);
    const [is_ready_for_verification, setReadyForVerification] = React.useState(false);

    const button_text = has_enabled_two_fa ? localize('Disable') : localize('Enable');
    const formik_ref = React.useRef<FormikProps<TDigitFormValues>>(null);
    let enable_response: TResponse;

    const initial_form = {
        digit_code: '',
    };

    React.useEffect(() => {
        if (is_language_changing) {
            formik_ref.current?.setFieldTouched('digit_code');
        }
    }, [is_language_changing]);

    const validateFields = async (values: TDigitFormValues) => {
        const digit_code = values?.digit_code;
        if (!digit_code) {
            return { digit_code: localize('Digit code is required.') };
        } else if (digit_code.length !== 6) {
            return { digit_code: localize('Length of digit code must be 6 characters.') };
        } else if (!/^\d{6}$/g.test(digit_code)) {
            return { digit_code: localize('Digit code must only contain numbers.') };
        } else if (is_ready_for_verification && formik_ref.current?.isValid) {
            const totp_action = has_enabled_two_fa ? 'disable' : 'enable';
            enable_response = await WS.authorized.accountSecurity({
                account_security: 1,
                totp_action,
                otp: values.digit_code,
            });
            if (enable_response?.error) {
                const { code, message } = enable_response.error;
                if (code === 'InvalidOTP')
                    return { digit_code: localize("That's not the right code. Please try again.") };
                return { digit_code: message };
            }
        }
        return {};
    };

    const handleSubmit = async (values: TDigitFormValues, { resetForm }: FormikHelpers<TDigitFormValues>) => {
        if (!enable_response.error) {
            const is_enabled_response = !!getPropertyValue(enable_response, ['account_security', 'totp', 'is_enabled']);
            setSuccess(true);
            resetForm();
            setTwoFAStatus(is_enabled_response);
            setTwoFAChangedStatus(true);
        }
    };

    return (
        <Formik initialValues={initial_form} onSubmit={handleSubmit} validate={validateFields} innerRef={formik_ref}>
            {({ values, isValid, handleChange, handleBlur, isSubmitting, dirty }) => (
                <Form noValidate>
                    <div className='two-factor__input-group' data-testid='dt_digitform_2fa'>
                        <Field name='digit_code'>
                            {({ field, meta }: FieldProps) => (
                                <Input
                                    {...field}
                                    data-lpignore='true'
                                    type='text'
                                    className='two-factor__input'
                                    label={localize('Authentication code')}
                                    value={values.digit_code}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        handleChange(e);
                                        setReadyForVerification(false);
                                    }}
                                    onBlur={handleBlur}
                                    required
                                    error={meta.touched ? meta.error : undefined}
                                    maxLength={6}
                                    autoComplete='off'
                                />
                            )}
                        </Field>
                        <Button
                            className={clsx('two-factor__button', {
                                'two-factor__button--success': is_success,
                            })}
                            type='submit'
                            is_disabled={isSubmitting || !isValid || !dirty}
                            has_effect
                            is_loading={isSubmitting}
                            is_submit_success={is_success}
                            text={button_text}
                            onClick={() => {
                                setReadyForVerification(true);
                            }}
                            large
                            primary
                        />
                    </div>
                </Form>
            )}
        </Formik>
    );
});

export default DigitForm;

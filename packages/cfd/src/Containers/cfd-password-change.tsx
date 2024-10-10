import React from 'react';
import { Form, Formik, FormikErrors, FormikHelpers, FormikValues } from 'formik';
import { observer, useStore } from '@deriv/stores';
import { FormSubmitButton, PasswordInput, PasswordMeter, Text } from '@deriv/components';
import { isDesktop, WS, getErrorMessages } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import { CATEGORY, CFD_PLATFORMS, PRODUCT } from '../Helpers/cfd-config';
import { validatePassword } from '../Helpers/constants';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';
import CfdPasswordModalTnc from './cfd-password-modal-tnc';

export type TCFDPasswordFormValues = { password: string };
export type TCFDPasswordFormChangeValues = { old_password: string; new_password: string };

type TCFDPasswordFormReusedProps = {
    platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
    error_message: string;
    validatePassword: (values: TCFDPasswordFormValues) => FormikErrors<TCFDPasswordFormValues>;
};

type TCFDPasswordChangeProps = TCFDPasswordFormReusedProps & {
    error_type?: string;
    form_error?: string;
    onCancel: () => void;
    onForgotPassword: () => void;
    setNewPasswordValue?: React.Dispatch<React.SetStateAction<string>>;
    should_set_trading_password: boolean;
    need_tnc: boolean;
};

type TOnSubmitPasswordChange = (
    values: TCFDPasswordFormChangeValues,
    actions: FormikHelpers<TCFDPasswordFormChangeValues>
) => Promise<void>;

const CFDPasswordChange = observer(
    ({
        error_type,
        form_error,
        onCancel,
        onForgotPassword,
        setNewPasswordValue,
        should_set_trading_password,
        platform,
        need_tnc,
    }: TCFDPasswordChangeProps) => {
        const { isMobile } = useDevice();
        const { ui, modules } = useStore();
        const { product, account_type } = useCfdStore();
        const { cfd } = modules;
        const { setIsMt5PasswordChangedModalVisible, setIsFromMt5MigrationModal } = cfd;
        const { is_mt5_migration_modal_enabled } = ui;
        const has_cancel_button = (isDesktop() ? !should_set_trading_password : true) || error_type === 'PasswordReset';
        const [checked, setChecked] = React.useState(
            !(product === PRODUCT.ZEROSPREAD && account_type.category === CATEGORY.REAL)
        );

        const handleCancel = () => {
            if (!has_cancel_button) {
                return undefined;
            }
            if (should_set_trading_password) {
                return onCancel();
            }

            return onForgotPassword();
        };

        const validate = (values: FormikValues) => {
            const errors: FormikErrors<{
                old_password: string;
                new_password: string;
            }> = {};

            if (!values.old_password) {
                errors.old_password = localize('This field is required');
            }
            if (!values.new_password) {
                errors.new_password = localize('This field is required');
            }

            if (validatePassword(values.new_password)) errors.new_password = validatePassword(values.new_password);

            return errors;
        };

        const handleSubmit: TOnSubmitPasswordChange = async (values, actions) => {
            const response = await WS.tradingPlatformPasswordChange({
                old_password: values.old_password,
                new_password: values.new_password,
                platform: CFD_PLATFORMS.MT5,
            });

            if (response.error) {
                if (response.error.code === 'PasswordError')
                    actions.setFieldError('old_password', response.error.message);
                if (response.error.code === 'InputValidationFailed')
                    actions.setFieldError(
                        'new_password',
                        // Localize is employed to convert the customized error message since the backend error lacks clarity.
                        localize(
                            'Please include at least 1 special character such as ( _ @ ? ! / # ) in your password.'
                        )
                    );
            }

            if (!response.error) {
                if (is_mt5_migration_modal_enabled) setIsFromMt5MigrationModal(true);
                setIsMt5PasswordChangedModalVisible(true);
                setNewPasswordValue?.(values.new_password);
                onCancel();
            }
        };

        return (
            <Formik
                initialValues={{
                    old_password: '',
                    new_password: '',
                }}
                validateOnBlur
                validateOnChange
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ errors, isSubmitting, handleBlur, handleChange, touched, values, isValid }) => {
                    return (
                        <Form className='cfd-password-change__content'>
                            <div className='cfd-password-modal__content cfd-password-change__container dc-modal__container_cfd-password-modal__body'>
                                <div className='cfd-password-change-modal-description'>
                                    <Text as='p' size='xs'>
                                        <Localize i18n_default_text='To enhance your MT5 account security we have upgraded our password policy.' />
                                    </Text>
                                    <Text as='p' size='xs'>
                                        <Localize i18n_default_text='Please update your password accordingly.' />
                                    </Text>
                                </div>
                                <div className='input-element'>
                                    <PasswordInput
                                        autoComplete='old-password'
                                        label={localize('Current password')}
                                        error={touched.old_password && errors.old_password}
                                        name='old_password'
                                        value={values.old_password}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        data_testId={`dt_mt5_old_password`}
                                    />
                                </div>
                                <div className='input-element'>
                                    <PasswordMeter
                                        input={values.new_password}
                                        has_error={!!(touched.new_password && errors.new_password)}
                                        custom_feedback_messages={getErrorMessages().password_warnings}
                                    >
                                        <PasswordInput
                                            autoComplete='new-password'
                                            label={localize('New password')}
                                            error={touched.new_password && errors.new_password}
                                            name='new_password'
                                            value={values.new_password}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            data_testId={`dt_mt5_new_password`}
                                        />
                                    </PasswordMeter>
                                </div>
                                <div className='cfd-password-change__error-message'>
                                    <ol className='cfd-password-change-list-container'>
                                        <li className='cfd-password-change-list'>
                                            <Text as='p' size='xs'>
                                                <Localize i18n_default_text='8 to 16 characters' />
                                            </Text>
                                        </li>
                                        <li className='cfd-password-change-list'>
                                            <Text as='p' size='xs'>
                                                <Localize i18n_default_text='A special character such as ( _ @ ? ! / # )' />
                                            </Text>
                                        </li>
                                        <li className='cfd-password-change-list'>
                                            <Text as='p' size='xs'>
                                                <Localize i18n_default_text='An uppercase letter' />
                                            </Text>
                                        </li>
                                        <li className='cfd-password-change-list'>
                                            <Text as='p' size='xs'>
                                                <Localize i18n_default_text='A lowercase letter' />
                                            </Text>
                                        </li>
                                        <li className='cfd-password-change-list'>
                                            <Text as='p' size='xs'>
                                                <Localize i18n_default_text='A number' />
                                            </Text>
                                        </li>
                                    </ol>
                                </div>
                                {product === PRODUCT.ZEROSPREAD && account_type.category === CATEGORY.REAL && (
                                    <CfdPasswordModalTnc
                                        className='cfd-password-modal-tnc--bottom'
                                        platform={platform}
                                        checked={checked}
                                        onCheck={() => setChecked(prev => !prev)}
                                        need_tnc={need_tnc}
                                    />
                                )}
                            </div>
                            <div className='cfd-password-change__footer-button'>
                                <FormSubmitButton
                                    is_disabled={!values.old_password || !values.new_password || !isValid || !checked}
                                    has_cancel={has_cancel_button}
                                    is_absolute={isMobile}
                                    cancel_label={localize('Forgot password?')}
                                    onCancel={handleCancel}
                                    is_loading={isSubmitting}
                                    label={localize('Change my password')}
                                    is_center={should_set_trading_password}
                                    form_error={form_error}
                                />
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
);

export default CFDPasswordChange;

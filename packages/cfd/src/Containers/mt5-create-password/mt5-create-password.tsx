import React from 'react';
import { Formik, FormikErrors, FormikHelpers } from 'formik';
import { FormSubmitButton, PasswordInput, PasswordMeter, Text, Icon } from '@deriv/components';
import { getCFDPlatformLabel, getCFDPlatformNames, getErrorMessages } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import { CATEGORY, CFD_PLATFORMS } from '../../Helpers/cfd-config';
import './mt5-create-password.scss';
import '../../sass/cfd.scss';
import CfdPasswordModalTnc from '../cfd-password-modal-tnc';
// This component is for first MT5 password modal

export type TCFDPasswordFormValues = { password: string };

type TCFDPasswordFormReusedProps = {
    platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
    error_message: string;
    validatePassword?: (values: TCFDPasswordFormValues) => FormikErrors<TCFDPasswordFormValues>;
};

type TOnSubmitPassword = (values: TCFDPasswordFormValues, actions: FormikHelpers<TCFDPasswordFormValues>) => void;
type TCFDCreatePasswordProps = TCFDPasswordFormReusedProps & {
    password: string;
    onSubmit: TOnSubmitPassword;
    need_tnc: boolean;
};

const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    handleChange: (el: React.ChangeEvent<HTMLInputElement>) => void,
    validateForm: (values?: TCFDPasswordFormValues) => Promise<FormikErrors<TCFDPasswordFormValues>>,
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void
) => {
    handleChange(e);
    validateForm().then(() => {
        setFieldTouched('password', true);
    });
};

const MT5CreatePassword = ({
    password,
    platform,
    validatePassword,
    onSubmit,
    error_message,
    need_tnc,
}: TCFDCreatePasswordProps) => {
    const { account_type } = useCfdStore();
    const [checked, setChecked] = React.useState(!(need_tnc && account_type.category === CATEGORY.REAL));

    return (
        <Formik
            initialValues={{
                password,
            }}
            enableReinitialize
            validate={validatePassword}
            onSubmit={onSubmit}
        >
            {({
                errors,
                isSubmitting,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldTouched,
                touched,
                values,
                validateForm,
            }) => (
                <React.Fragment>
                    <form className='mt5-password-modal-form'>
                        <div
                            className='mt5-password-modal__content dc-modal__container_mt5-password-modal__body'
                            data-testid='dt_mt5_create_password'
                        >
                            <div className='mt5-password-modal__create-password-content'>
                                <div className='mt5-password-modal__create-password-icon'>
                                    <Icon icon='IcMt5Password' size={100} />
                                </div>

                                <Text
                                    size='xs'
                                    align='left'
                                    className='mt5-password-modal__create-password-description'
                                >
                                    <Localize
                                        i18n_default_text='Create a password for your {{platform}} account:'
                                        values={{ platform: getCFDPlatformNames(platform) }}
                                    />
                                </Text>
                                <div className='mt5-password-modal__mt5-input-element'>
                                    <PasswordMeter
                                        input={values.password}
                                        has_error={!!(touched.password && errors.password)}
                                        custom_feedback_messages={getErrorMessages().password_warnings}
                                    >
                                        {({ has_warning }: { has_warning: boolean }) => (
                                            <PasswordInput
                                                autoComplete='new-password'
                                                label={localize('{{platform}} password', {
                                                    platform: getCFDPlatformLabel(platform),
                                                })}
                                                error={
                                                    (touched.password && errors.password) ||
                                                    (values.password.length === 0 ? error_message : '')
                                                }
                                                name='password'
                                                value={values.password}
                                                onBlur={handleBlur}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    handlePasswordInputChange(
                                                        e,
                                                        handleChange,
                                                        validateForm,
                                                        setFieldTouched
                                                    );
                                                }}
                                                data_testId={`dt_${platform}_password`}
                                                hint={
                                                    (!has_warning || values.password.length === 0) &&
                                                    localize('This password works for all your Deriv MT5 accounts.')
                                                }
                                            />
                                        )}
                                    </PasswordMeter>
                                </div>
                                {account_type.category === CATEGORY.REAL && (
                                    <CfdPasswordModalTnc
                                        platform={platform}
                                        checked={checked}
                                        onCheck={() => setChecked(prev => !prev)}
                                        need_tnc={need_tnc}
                                    />
                                )}
                            </div>
                            <div className='mt5-password-modal__submit-button'>
                                <FormSubmitButton
                                    is_disabled={!values.password || !checked || Object.keys(errors).length > 0}
                                    is_loading={isSubmitting}
                                    label={localize('Create account')}
                                    onClick={handleSubmit}
                                />
                            </div>
                        </div>
                    </form>
                </React.Fragment>
            )}
        </Formik>
    );
};
export default MT5CreatePassword;

import React, { useEffect, useRef, useState } from 'react';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { TSocketError } from '@deriv/api-v2/types';
import {
    WalletButton,
    WalletButtonGroup,
    WalletPasswordFieldLazy,
    WalletText,
    WalletTextField,
} from '../../../../components';
import PasswordViewerIcon from '../../../../components/Base/WalletPasswordField/PasswordViewerIcon';
import { passwordRequirements } from '../../../../constants/password';
import useDevice from '../../../../hooks/useDevice';
import { validPasswordMT5 } from '../../../../utils/password-validation';
import { PlatformDetails } from '../../constants';
import { TPlatformPasswordChange } from '../../modals/MT5PasswordModal/MT5PasswordModal';
import './MT5ResetPasswordModal.scss';

type TFormInitialValues = {
    currentPassword: string;
    newPassword: string;
};

type TProps = {
    formError: TSocketError<'trading_platform_password_change'> | null;
    isLoading: boolean;
    onClickSubmitPasswordChange: (values: TPlatformPasswordChange) => void;
    sendEmailVerification: () => void;
};

const MT5ResetPasswordModal: React.FC<TProps> = ({
    formError,
    isLoading,
    onClickSubmitPasswordChange,
    sendEmailVerification,
}) => {
    const { title } = PlatformDetails.mt5;
    const { isDesktop, isMobile } = useDevice();
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);

    const initialValues: TFormInitialValues = { currentPassword: '', newPassword: '' };
    const formikRef = useRef<FormikProps<TFormInitialValues> | null>(null);

    useEffect(() => {
        if (formError) {
            if (formError.error.code === 'PasswordError') {
                formikRef.current?.setErrors({ currentPassword: formError.error?.message });
            } else {
                formikRef.current?.setErrors({ newPassword: formError.error?.message });
            }
        }
    }, [formError]);

    const validateCurrentPassword = (value: string) => {
        if (!value) return 'The field is required';
    };

    const handleOnSubmit = (values: TFormInitialValues) => {
        onClickSubmitPasswordChange({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
        });
    };

    return (
        <div className='wallets-mt5-reset'>
            {isDesktop && (
                <div className='wallets-mt5-reset__header'>
                    <WalletText as='h2' weight='bold'>
                        {title} latest password requirements
                    </WalletText>
                </div>
            )}
            <Formik initialValues={initialValues} innerRef={formikRef} onSubmit={values => handleOnSubmit(values)}>
                {({ errors, handleChange, values }) => (
                    <Form>
                        <div className='wallets-mt5-reset__container'>
                            <div className='wallets-mt5-reset__content'>
                                <WalletText size='sm'>
                                    To enhance your MT5 account security we have upgraded our password policy.
                                    <br />
                                    Please update your password accordingly.
                                </WalletText>
                                <div className='wallets-mt5-reset__fields'>
                                    <Field name='currentPassword' validate={validateCurrentPassword}>
                                        {({ field, form }: FieldProps) => {
                                            return (
                                                <WalletTextField
                                                    autoComplete='current-password'
                                                    errorMessage={form.errors[field.name]}
                                                    isInvalid={Boolean(form.errors[field.name])}
                                                    label='Current password'
                                                    name={field.name}
                                                    onBlur={field.onBlur}
                                                    onChange={handleChange}
                                                    renderRightIcon={() => (
                                                        <PasswordViewerIcon
                                                            setViewPassword={setIsCurrentPasswordVisible}
                                                            viewPassword={isCurrentPasswordVisible}
                                                        />
                                                    )}
                                                    type={isCurrentPasswordVisible ? 'text' : 'password'}
                                                    value={values.currentPassword}
                                                />
                                            );
                                        }}
                                    </Field>
                                    <WalletPasswordFieldLazy
                                        label='New Password'
                                        mt5Policy
                                        name='newPassword'
                                        onChange={handleChange}
                                        password={values.newPassword}
                                        passwordError={!!errors?.newPassword}
                                        serverErrorMessage={errors?.newPassword}
                                    />
                                </div>
                                <ul className='wallets-mt5-reset__requirements'>
                                    {passwordRequirements.map(requirement => (
                                        <li key={requirement}>
                                            <WalletText size='sm'>{requirement}</WalletText>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className='wallets-mt5-reset__footer'>
                            <WalletButtonGroup isFlex isFullWidth={isMobile}>
                                <WalletButton
                                    onClick={sendEmailVerification}
                                    size={isMobile ? 'lg' : 'md'}
                                    variant='outlined'
                                >
                                    Forgot password?
                                </WalletButton>
                                <WalletButton
                                    disabled={!!errors.currentPassword || !validPasswordMT5(values.newPassword)}
                                    isLoading={isLoading}
                                    size={isMobile ? 'lg' : 'md'}
                                    type='submit'
                                >
                                    Change my password
                                </WalletButton>
                            </WalletButtonGroup>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default MT5ResetPasswordModal;

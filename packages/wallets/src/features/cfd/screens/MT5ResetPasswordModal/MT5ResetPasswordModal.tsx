import React, { useEffect, useRef, useState } from 'react';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { TSocketError } from '@deriv/api-v2/types';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { WalletButtonGroup, WalletPasswordFieldLazy, WalletTextField } from '../../../../components';
import PasswordViewerIcon from '../../../../components/Base/WalletPasswordField/PasswordViewerIcon';
import { getPasswordRequirements } from '../../../../constants/password';
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
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);

    const walletButtonSizes = isDesktop ? 'md' : 'lg';
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
        if (!value) return localize('The field is required');
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
                    <Text as='h2' weight='bold'>
                        <Localize i18n_default_text='{{title}} latest password requirements' values={{ title }} />
                    </Text>
                </div>
            )}
            <Formik initialValues={initialValues} innerRef={formikRef} onSubmit={values => handleOnSubmit(values)}>
                {({ errors, handleChange, values }) => (
                    <Form>
                        <div className='wallets-mt5-reset__container'>
                            <div className='wallets-mt5-reset__content'>
                                <Text size='sm'>
                                    <Localize
                                        components={[<br key={0} />]}
                                        i18n_default_text='To enhance your MT5 account security we have upgraded our password policy.<0 />Please update your password accordingly.'
                                    />
                                </Text>
                                <div className='wallets-mt5-reset__fields'>
                                    <Field name='currentPassword' validate={validateCurrentPassword}>
                                        {({ field, form }: FieldProps) => {
                                            return (
                                                <WalletTextField
                                                    autoComplete='current-password'
                                                    errorMessage={form.errors[field.name]}
                                                    isInvalid={Boolean(form.errors[field.name])}
                                                    label={localize('Current password')}
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
                                        label={localize('New Password')}
                                        mt5Policy
                                        name='newPassword'
                                        onChange={handleChange}
                                        password={values.newPassword}
                                        passwordError={!!errors?.newPassword}
                                        serverErrorMessage={errors?.newPassword}
                                    />
                                </div>
                                <ul className='wallets-mt5-reset__requirements'>
                                    {getPasswordRequirements(localize).map(requirement => (
                                        <li key={requirement}>
                                            <Text size='sm'>{requirement}</Text>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className='wallets-mt5-reset__footer'>
                            <WalletButtonGroup isFlex isFullWidth={!isDesktop}>
                                <Button
                                    borderWidth='sm'
                                    color='black'
                                    onClick={sendEmailVerification}
                                    size={walletButtonSizes}
                                    textSize='sm'
                                    variant='outlined'
                                >
                                    <Localize i18n_default_text='Forgot password?' />
                                </Button>
                                <Button
                                    disabled={!!errors.currentPassword || !validPasswordMT5(values.newPassword)}
                                    isLoading={isLoading}
                                    size={walletButtonSizes}
                                    textSize='sm'
                                    type='submit'
                                >
                                    <Localize i18n_default_text='Change my password' />
                                </Button>
                            </WalletButtonGroup>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default MT5ResetPasswordModal;

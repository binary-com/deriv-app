import React, { useState } from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useTradingPlatformInvestorPasswordChange } from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button, Text, useDevice } from '@deriv-com/ui';
import { WalletPasswordFieldLazy, WalletTextField } from '../../../../../components/Base';
import PasswordViewerIcon from '../../../../../components/Base/WalletPasswordField/PasswordViewerIcon';
import { useModal } from '../../../../../components/ModalProvider';
import { validPasswordMT5 } from '../../../../../utils/password-validation';
import { PlatformDetails } from '../../../constants';

type TFormInitialValues = {
    currentPassword: string;
    newPassword: string;
};

type TProps = {
    sendEmail?: VoidFunction;
    setNextScreen?: VoidFunction;
};

const MT5ChangeInvestorPasswordInputsScreen: React.FC<TProps> = ({ sendEmail, setNextScreen }) => {
    const { getModalState } = useModal();
    const { localize } = useTranslations();

    const mt5AccountId = getModalState('accountId') ?? '';
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [hasCurrentPasswordFieldTouched, setHasCurrentPasswordFieldTouched] = useState(false);
    const { isDesktop } = useDevice();
    const buttonTextSize = isDesktop ? 'sm' : 'md';

    const {
        error: changeInvestorPasswordError,
        mutateAsync: changeInvestorPassword,
        status: changeInvestorPasswordStatus,
    } = useTradingPlatformInvestorPasswordChange();

    const initialValues: TFormInitialValues = { currentPassword: '', newPassword: '' };

    const validateCurrentPassword = (value: string) => {
        if (!value) return localize('The field is required');
        return undefined;
    };

    const onFormSubmitHandler = async (values: TFormInitialValues) => {
        await changeInvestorPassword({
            account_id: mt5AccountId,
            new_password: values.newPassword,
            old_password: values.currentPassword,
            platform: PlatformDetails.mt5.platform,
        });
        setNextScreen?.();
    };

    return (
        <ActionScreen
            actionButtons={
                <Formik initialValues={initialValues} onSubmit={onFormSubmitHandler}>
                    {({ handleChange, values }) => (
                        <Form className='wallets-change-investor-password-screens__form'>
                            <div className='wallets-change-investor-password-screens__form-fields'>
                                <Field name='currentPassword' validate={validateCurrentPassword}>
                                    {({ field, form }: FieldProps) => {
                                        return (
                                            <WalletTextField
                                                autoComplete='current-password'
                                                errorMessage={hasCurrentPasswordFieldTouched && form.errors[field.name]}
                                                isInvalid={
                                                    hasCurrentPasswordFieldTouched && Boolean(form.errors[field.name])
                                                }
                                                label={localize('Current investor password')}
                                                name={field.name}
                                                onBlur={e => {
                                                    setHasCurrentPasswordFieldTouched(true);
                                                    field.onBlur(e);
                                                }}
                                                onChange={field.onChange}
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
                                    autoComplete='new-password'
                                    label={localize('New investor password')}
                                    message={localize(
                                        'Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.'
                                    )}
                                    mt5Policy
                                    name='newPassword'
                                    onChange={handleChange}
                                    password={values.newPassword}
                                    showMessage
                                />
                            </div>
                            <div className='wallets-change-investor-password-screens__form-buttons'>
                                <Button
                                    disabled={!values.currentPassword || !validPasswordMT5(values.newPassword)}
                                    isLoading={changeInvestorPasswordStatus === 'loading'}
                                    size='lg'
                                    textSize={buttonTextSize}
                                    type='submit'
                                >
                                    <Localize i18n_default_text='Change investor password' />
                                </Button>
                                <Button
                                    color='primary-transparent'
                                    onClick={sendEmail}
                                    size='lg'
                                    textSize={buttonTextSize}
                                    variant='ghost'
                                >
                                    <Localize i18n_default_text='Create or reset investor password' />
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            }
            description={
                <>
                    <Text align='start' size='sm'>
                        <Localize i18n_default_text='Use this password to grant viewing access to another user. While they may view your trading account, they will not be able to trade or take any other actions.' />
                    </Text>
                    <Text align='start' size='sm'>
                        <Localize i18n_default_text='If this is the first time you try to create a password, or you have forgotten your password, please reset it.' />
                    </Text>
                    {changeInvestorPasswordError && (
                        <Text align='center' color='error' size='sm'>
                            {changeInvestorPasswordError?.error?.message}
                        </Text>
                    )}
                </>
            }
            descriptionSize='sm'
        />
    );
};

export default MT5ChangeInvestorPasswordInputsScreen;

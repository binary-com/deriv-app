import { InlineMessage, Modal, Text, PasswordInput, FormSubmitButton } from '@deriv/components';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { CFD_PLATFORMS, WS, validLength, validMT5Password, getErrorMessages } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import React from 'react';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import { Formik, FormikErrors, FormikHelpers, FormikProps } from 'formik';
import { TCFDPasswordFormValues } from 'Containers/cfd-password-modal';

const MT5MigrationBackSideContent = observer(() => {
    const { ui, common, client } = useStore();
    const { toggleMT5MigrationModal, setMT5MigrationModalEnabled, is_mobile } = ui;
    const { email } = client;
    const { setAppstorePlatform } = common;
    const { setJurisdictionSelectedShortcode, setSentEmailModalStatus, submitMt5Password } = useCfdStore();
    const { getEligibleAccountToMigrate } = useMT5SVGEligibleToMigrate();
    const formik_ref = React.useRef<FormikProps<TCFDPasswordFormValues>>(null);

    const initial_values: TCFDPasswordFormValues = {
        password: '',
    };

    const content_size = is_mobile ? 'xxs' : 'xs';

    const closeModal = () => {
        setAppstorePlatform(CFD_PLATFORMS.MT5);
        setJurisdictionSelectedShortcode(getEligibleAccountToMigrate());
        toggleMT5MigrationModal(false);
    };

    const onConfirmMigration = (values: TCFDPasswordFormValues, actions: FormikHelpers<TCFDPasswordFormValues>) => {
        submitMt5Password(values, actions).then(() => {
            closeModal();
        });
    };

    const onForgotPassword = () => {
        setMT5MigrationModalEnabled(false);
        toggleMT5MigrationModal(false);
        WS.verifyEmail(email, 'trading_platform_mt5_password_reset', {
            url_parameters: {
                redirect_to: 10,
            },
        });
        setSentEmailModalStatus(true);
    };

    const validatePassword = (values: TCFDPasswordFormValues) => {
        const errors: FormikErrors<TCFDPasswordFormValues> = {};
        if (
            !validLength(values.password, {
                min: 8,
                max: 25,
            })
        ) {
            errors.password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
                min_number: 8,
                max_number: 25,
            });
        } else if (!validMT5Password(values.password)) {
            errors.password = getErrorMessages().password();
        }
        if (values.password?.toLowerCase() === email.toLowerCase()) {
            errors.password = localize('Your password cannot be the same as your email address.');
        }
        return errors;
    };

    return (
        <Formik
            initialValues={initial_values}
            enableReinitialize
            validate={validatePassword}
            innerRef={formik_ref}
            validateOnMount
            onSubmit={onConfirmMigration}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form onSubmit={handleSubmit}>
                    <div className='mt5-migration-modal__container'>
                        <div className='mt5-migration-modal__password-header-container'>
                            <Text as='p' size={content_size}>
                                <Localize i18n_default_text='Enter your Deriv MT5 password to upgrade your account(s).' />
                            </Text>
                        </div>
                        <div className='mt5-migration-modal__password-input-container'>
                            <PasswordInput
                                autoComplete='off'
                                label={localize('Deriv MT5 password')}
                                name='password'
                                value={values.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='mt5-migration-modal__password-hint'>
                            <InlineMessage type='information' size='sm'>
                                <Text as='p' size='xxs'>
                                    <Localize i18n_default_text="We've introduced additional password requirements to increase your account security. Your password should:" />
                                </Text>
                                <ul className='mt5-migration-modal__password-hint-items'>
                                    <li>
                                        <Text as='p' size='xxs' weight='bold'>
                                            <Localize i18n_default_text='Be between 8 to 16 characters.' />
                                        </Text>
                                    </li>

                                    <li>
                                        <Text as='p' size='xxs' weight='bold'>
                                            <Localize i18n_default_text='Contain at least one special character.' />
                                        </Text>
                                    </li>
                                </ul>
                                <Text as='p' size='xxs'>
                                    <Localize i18n_default_text="If your current password doesn't match these requirements, you'll need to create a new one in the next step." />
                                </Text>
                            </InlineMessage>
                        </div>
                    </div>
                    <Modal.Footer>
                        <FormSubmitButton
                            is_disabled={!!errors.password || isSubmitting}
                            is_absolute={is_mobile}
                            label={localize('Upgrade')}
                            has_cancel
                            onCancel={onForgotPassword}
                            cancel_label={localize('Forgot password?')}
                            is_loading={isSubmitting}
                        />
                    </Modal.Footer>
                </form>
            )}
        </Formik>
    );
});

export default MT5MigrationBackSideContent;

import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import {
    DesktopWrapper,
    FormSubmitButton,
    Icon,
    MobileWrapper,
    MobileDialog,
    Modal,
    PasswordInput,
    PasswordMeter,
    Text,
} from '@deriv/components';
import { isMobile, validLength, validPassword, getErrorMessages } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { TAccountType } from 'Types';
import { useStores } from 'Stores';
import './mt5-password-modal.scss';

const getSubmitText = (account_title: string, category: string) => {
    if (category === 'real') {
        return localize(
            'You have created a DMT5 {{account_title}} account. To start trading, transfer funds from your Deriv account into this account.',
            { account_title }
        );
    }

    return localize('You have created a DMT5 {{account_title}} account.', { account_title });
};

const getIconFromType = (type: TAccountType) => {
    switch (type) {
        case 'synthetic':
            return <Icon icon='IcMt5SyntheticPlatform' size={128} />;
        case 'financial':
            return <Icon icon='IcMt5FinancialPlatform' size={128} />;
        default:
            return <Icon icon='IcMt5FinancialStpPlatform' size={128} />;
    }
};

const MT5PasswordForm = ({ ...props }) => (
    <Formik
        initialValues={{
            password: '',
        }}
        validate={props.validatePassword}
        onSubmit={(values, actions) => {
            props.submitMt5Password(values.password, actions.setSubmitting);
        }}
    >
        {({
            handleSubmit,
            // setFieldValue,
            setFieldTouched,
            handleChange,
            handleBlur,
            errors,
            values,
            isSubmitting,
            touched,
        }) => (
            <form onSubmit={handleSubmit}>
                <div className='mt5-password-modal__content'>
                    <div className='dc-modal__container_mt5-password-modal__body'>
                        <div className='input-element'>
                            <PasswordMeter
                                input={values.password}
                                has_error={!!(touched.password && errors.password)}
                                custom_feedback_messages={getErrorMessages().password_warnings}
                            >
                                {({ has_warning }: { has_warning: boolean }) => (
                                    <PasswordInput
                                        autoComplete='new-password'
                                        label={localize('Create a password')}
                                        error={touched.password && errors.password}
                                        hint={
                                            !has_warning &&
                                            localize(
                                                'Minimum of eight lower and uppercase English letters with numbers'
                                            )
                                        }
                                        name='password'
                                        value={values.password}
                                        onBlur={handleBlur}
                                        onChange={(e: Event) => {
                                            setFieldTouched('password', true);
                                            handleChange(e);
                                        }}
                                    />
                                )}
                            </PasswordMeter>
                        </div>
                        <Text align='center' size='xxs' styles={{ padding: '0 1rem' }}>
                            <Localize i18n_default_text='To get an DMT5 app, we need to confirm your account password. We do this to protect your account against unauthorized action.' />
                        </Text>
                        {props.is_real_financial_stp && (
                            <div className='dc-modal__container_mt5-password-modal__description'>
                                <Localize i18n_default_text='Your MT5 Financial STP account will be opened through Deriv (FX) Ltd. All trading in this account is subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA). All other accounts, including your Deriv account, are not subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA).' />
                            </div>
                        )}
                    </div>
                </div>
                <div className='dc-modal__container_mt5-password-modal__footer'>
                    <FormSubmitButton
                        is_disabled={isSubmitting || !values.password || Object.keys(errors).length > 0}
                        has_cancel
                        cancel_label={localize('Reset password')}
                        onCancel={props.closeModal}
                        is_absolute={isMobile()}
                        is_loading={isSubmitting}
                        label={localize('Next')}
                        form_error={props.form_error}
                    />
                </div>
            </form>
        )}
    </Formik>
);

const MT5PasswordModal = () => {
    const { client_store, mt5_store } = useStores();
    const {
        account_title,
        account_type,
        disableMt5PasswordModal,
        error_message,
        has_mt5_error,
        is_mt5_success_dialog_enabled,
        is_mt5_password_modal_enabled,
        setError,
        setMt5SuccessDialog,
        submitMt5Password,
    } = mt5_store;

    const { email_address } = client_store;

    const validatePassword = (values: { password: string }) => {
        const errors: {
            password?: string;
        } = {};

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
        } else if (!validPassword(values.password)) {
            errors.password = getErrorMessages().password();
        }
        if (values.password.toLowerCase() === email_address?.toLowerCase()) {
            errors.password = localize('Your password cannot be the same as your email address.');
        }

        return errors;
    };

    const closeDialogs = () => {
        setMt5SuccessDialog(false);
        setError(false);
    };

    const closeModal = () => {
        closeDialogs();
        disableMt5PasswordModal();
    };

    // const closeOpenSuccess = () => {
    //     disableMt5PasswordModal();
    //     closeDialogs();
    //     if (account_type.category === 'real') {
    //         history.push(routes.cashier_acc_transfer);
    //     }
    // };

    const IconType = () => getIconFromType(account_type.type);
    const should_show_password = is_mt5_password_modal_enabled && !has_mt5_error && !is_mt5_success_dialog_enabled;
    const should_show_success = !has_mt5_error && is_mt5_success_dialog_enabled;
    const is_real_financial_stp = [account_type.category, account_type.type].join('_') === 'real_financial_stp';

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='mt5-password-modal'
                    is_open={should_show_password}
                    toggleModal={closeModal}
                    title={localize('Confirm your account password')}
                    has_close_icon
                >
                    <MT5PasswordForm
                        account_title={account_title}
                        closeModal={closeModal}
                        submitMt5Password={submitMt5Password}
                        is_real_financial_stp={is_real_financial_stp}
                        validatePassword={validatePassword}
                    />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    has_full_height
                    portal_element_id='modal_root'
                    visible={should_show_password}
                    onClose={closeModal}
                    wrapper_classname='mt5-password-modal'
                >
                    <MT5PasswordForm
                        account_title={account_title}
                        closeModal={closeModal}
                        is_real_financial_stp={is_real_financial_stp}
                        submitMt5Password={submitMt5Password}
                        validatePassword={validatePassword}
                    />
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
};

MT5PasswordModal.propTypes = {
    account_title: PropTypes.string,
    account_type: PropTypes.object,
    disableMt5PasswordModal: PropTypes.func,
    email: PropTypes.string,
    error_message: PropTypes.string,
    has_mt5_error: PropTypes.bool,
    is_mt5_password_modal_enabled: PropTypes.bool,
    is_mt5_success_dialog_enabled: PropTypes.bool,
    setMt5Error: PropTypes.func,
    setMt5SuccessDialog: PropTypes.func,
    submitMt5Password: PropTypes.func,
};

export default MT5PasswordModal;

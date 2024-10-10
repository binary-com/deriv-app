import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Button, Icon, PasswordMeter, PasswordInput, FormSubmitButton, Loading, Modal, Text } from '@deriv/components';
import { validLength, validPassword, validMT5Password, getErrorMessages, WS, redirectToLogin } from '@deriv/shared';
import { localize, Localize, getLanguage } from '@deriv/translations';
import { getMtCompanies, TMtCompanies } from '../Stores/Modules/CFD/Helpers/cfd-config';
import { TResetPasswordIntent, TCFDResetPasswordModal, TError } from './props.types';
import { observer, useStore } from '@deriv/stores';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';
import { CFD_PLATFORMS } from '../Helpers/cfd-config';

const ResetPasswordIntent = ({ current_list, children, is_eu, ...props }: TResetPasswordIntent) => {
    const reset_password_intent = localStorage.getItem('cfd_reset_password_intent');
    const reset_password_type = localStorage.getItem('cfd_reset_password_type') || 'main'; // Default to main
    const has_intent =
        reset_password_intent &&
        /(real|demo)\.(financial|financial_demo|financial_stp|financial_svg|financial_bvi|financial_fx|financial_v|synthetic|synthetic_svg|synthetic_bvi|synthetic_v|all_swap_free_svg|all_zero_spread_bvi|dxtrade|all)/.test(
            reset_password_intent
        );

    let group, type, login, title, server;
    if (has_intent && current_list) {
        [server, group, type] = reset_password_intent.split('.');
        login = current_list[`mt5.${group}.${type}@${server}`].login;
        title =
            getMtCompanies(is_eu)[group as keyof TMtCompanies][type as keyof TMtCompanies['demo' | 'real']]?.title ??
            '';
    } else if (current_list) {
        [server, group, type] = (Object.keys(current_list).pop() as string).split('.');
        login = current_list[`mt5.${group}.${type}@${server}`]?.login ?? '';
        title =
            getMtCompanies(is_eu)?.[group as keyof TMtCompanies]?.[type as keyof TMtCompanies['demo' | 'real']]
                ?.title ?? '';
    } else {
        // Set a default intent
        login = '';
        title = '';
    }

    return children({
        login,
        title,
        type: reset_password_type,
        ...props,
    });
};

const CFDResetPasswordModal = observer(({ platform }: TCFDResetPasswordModal) => {
    const { client, ui } = useStore();

    const { email, is_eu, is_logged_in } = client;
    const { is_cfd_reset_password_modal_enabled, setCFDPasswordResetModal } = ui;

    const { current_list } = useCfdStore();

    React.useEffect(() => {
        if (!/reset-password/.test(location.hash)) {
            return;
        }
        setCFDPasswordResetModal(true);
    }, [setCFDPasswordResetModal]);

    const [state, setState] = React.useState<{
        error_code: string | number | undefined;
        has_error: boolean;
        error_message: string | undefined;
        is_finished: boolean;
        changed_password_type: string;
    }>({
        error_code: undefined,
        has_error: false,
        error_message: undefined,
        is_finished: false,
        changed_password_type: '',
    });

    const renderErrorBox = (error: TError) => {
        setState({
            ...state,
            error_code: error.code,
            has_error: true,
            error_message: error.message,
        });
    };
    const clearAddressBar = () => {
        localStorage.removeItem('cfd_reset_password_intent');
        localStorage.removeItem('cfd_reset_password_type');
        localStorage.removeItem('cfd_reset_password_code');
    };
    const validatePassword = (values: { new_password: string }) => {
        const errors: { new_password?: string } = {};
        const max_length = platform === CFD_PLATFORMS.DXTRADE ? 25 : 16;

        if (
            !validLength(values.new_password, {
                min: 8,
                max: max_length,
            })
        ) {
            errors.new_password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
                min_number: 8,
                max_number: max_length,
            });
        } else if (platform !== CFD_PLATFORMS.DXTRADE && !validMT5Password(values.new_password)) {
            errors.new_password = getErrorMessages().special_characters();
        } else if (!validPassword(values.new_password)) {
            errors.new_password = getErrorMessages().special_characters();
        }
        if (values.new_password.toLowerCase() === email.toLowerCase()) {
            errors.new_password = localize('Your password cannot be the same as your email address.');
        }

        return errors;
    };

    const resetPassword = (
        values: { new_password: string },
        password_type: string,
        login: string,
        actions: FormikHelpers<{ new_password: string }>
    ) => {
        const { setSubmitting } = actions;
        setSubmitting(true);
        const request = {
            account_id: login,
            platform: CFD_PLATFORMS.MT5,
            new_password: values.new_password,
            verification_code: localStorage.getItem('cfd_reset_password_code'),
        };

        WS.tradingPlatformInvestorPasswordReset(request).then((response: { error: TError; password_type: string }) => {
            if (response?.error?.code) {
                renderErrorBox(response.error);
            } else {
                setState({
                    ...state,
                    is_finished: true,
                    changed_password_type: password_type,
                });
                clearAddressBar();
            }
            setSubmitting(false);
        });
    };
    const getIsListFetched = () => {
        return Object.keys(current_list).length !== 0;
    };

    const is_invalid_investor_token = !getIsListFetched() && localStorage.getItem('cfd_reset_password_code');

    return (
        <Modal
            className='cfd-reset-password-modal'
            is_open={is_cfd_reset_password_modal_enabled && !is_invalid_investor_token}
            toggleModal={() => setCFDPasswordResetModal(false)}
            title={
                platform === CFD_PLATFORMS.DXTRADE
                    ? localize('Reset Deriv X investor password')
                    : localize('Reset Deriv MT5 investor password')
            }
            onMount={() => redirectToLogin(is_logged_in, getLanguage(), true)}
            should_header_stick_body={false}
        >
            {!getIsListFetched() && !state.has_error && <Loading is_fullscreen={false} />}
            {getIsListFetched() && !state.has_error && !state.is_finished && (
                <ResetPasswordIntent current_list={current_list} is_eu={is_eu}>
                    {({ type, login }) => (
                        <Formik
                            initialValues={{ new_password: '' }}
                            validate={validatePassword}
                            onSubmit={(values, actions) => resetPassword(values, type, login, actions)}
                        >
                            {({ handleSubmit, errors, values, isSubmitting, handleChange, handleBlur, touched }) => (
                                <form autoComplete='off' onSubmit={handleSubmit}>
                                    <div className='cfd-reset-password'>
                                        <div className='cfd-reset-password__container'>
                                            <div className='cfd-reset-password__password-area'>
                                                <PasswordMeter
                                                    input={values.new_password}
                                                    has_error={!!(touched.new_password && errors.new_password)}
                                                    custom_feedback_messages={getErrorMessages().password_warnings}
                                                >
                                                    {({ has_warning }: { has_warning: boolean }) => (
                                                        <PasswordInput
                                                            autoComplete='new-password'
                                                            className='cfd-reset-password__password-field'
                                                            name='new_password'
                                                            label={localize('New {{type}} password', { type })}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.new_password && errors.new_password}
                                                            value={values.new_password}
                                                            data-lpignore='true'
                                                            required
                                                            hint={
                                                                !has_warning &&
                                                                localize(
                                                                    'Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.'
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </PasswordMeter>
                                            </div>
                                            {platform !== CFD_PLATFORMS.DXTRADE && (
                                                <div className='cfd-reset-password__password-area'>
                                                    <Text
                                                        as='p'
                                                        size='xs'
                                                        align='center'
                                                        className='cfd-reset-password__description2'
                                                    >
                                                        <Localize i18n_default_text='Your password must contain between 8-16 characters that include uppercase and lowercase letters, and at least one number and special character such as ( _ @ ? ! / # ).' />
                                                    </Text>
                                                </div>
                                            )}
                                            {isSubmitting && <Loading is_fullscreen={false} />}
                                            {!isSubmitting && (
                                                <FormSubmitButton
                                                    is_disabled={
                                                        isSubmitting ||
                                                        !values.new_password ||
                                                        Object.keys(errors).length > 0
                                                    }
                                                    errors={errors}
                                                    is_center={true}
                                                    large
                                                    label={localize('Create {{type}} password', { type })}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    )}
                </ResetPasswordIntent>
            )}
            {state.has_error && (
                <div className='cfd-reset-password__error'>
                    <Icon icon='IcMt5Expired' size={128} />
                    <Text as='p' size='xs' weight='bold' align='center' className='cfd-reset-password__heading'>
                        {state.error_message}
                    </Text>
                    {state.error_code === 'InvalidToken' && (
                        <Text
                            as='p'
                            color='prominent'
                            size='xs'
                            align='center'
                            className='cfd-reset-password__description--is-centered'
                        >
                            <Localize i18n_default_text='Please request a new password and check your email for the new token.' />
                        </Text>
                    )}
                    <Button
                        primary
                        large
                        className='cfd-reset-password__confirm-button'
                        onClick={() => {
                            clearAddressBar();
                            setCFDPasswordResetModal(false);
                        }}
                    >
                        <Localize i18n_default_text='Ok' />
                    </Button>
                </div>
            )}
            {state.is_finished && (
                <div className='cfd-reset-password__success'>
                    <Icon icon='IcMt5PasswordUpdated' size={128} />
                    <div className='cfd-reset-password__description'>
                        <Text as='p' size='xs' align='center' weight='bold' line_height='xxl'>
                            <Localize i18n_default_text='Password saved' />
                        </Text>
                        <Localize
                            i18n_default_text='Your {{account_type}} password has been changed.'
                            values={{
                                account_type:
                                    state.changed_password_type === 'main' ? localize('main') : localize('investor'),
                            }}
                        />
                    </div>
                    <Button primary large onClick={() => setCFDPasswordResetModal(false)}>
                        <Localize i18n_default_text='Ok' />
                    </Button>
                </div>
            )}
        </Modal>
    );
});

export default React.memo(CFDResetPasswordModal);

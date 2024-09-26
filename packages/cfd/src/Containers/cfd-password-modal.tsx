import React from 'react';
import { useHistory } from 'react-router';
import { Formik, FormikErrors, FormikHelpers } from 'formik';
import { useDevice } from '@deriv-com/ui';

import { SentEmailModal } from '@deriv/account';
import {
    FormSubmitButton,
    Icon,
    MobileDialog,
    Modal,
    MultiStep,
    PasswordInput,
    PasswordMeter,
    Text,
} from '@deriv/components';
import {
    getAuthenticationStatusInfo,
    getCFDPlatformLabel,
    getErrorMessages,
    getLegalEntityName,
    routes,
    validLength,
    validPassword,
    validMT5Password,
    makeLazyLoader,
    moduleLoader,
    WS,
} from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

import { TProducts } from '../Components/props.types';
import SuccessDialog from '../Components/success-dialog/success-dialog';
import CFDPasswordModalTitle from './cfd-password-modal-title';
import TradingPlatformIcon from '../Assets/svgs/trading-platform';
import MigrationSuccessModal from '../Components/migration-success-modal';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';
import { CFD_PLATFORMS, JURISDICTION, CATEGORY, PRODUCT } from '../Helpers/cfd-config';
import { getDxCompanies, getMtCompanies, TDxCompanies, TMtCompanies } from '../Stores/Modules/CFD/Helpers/cfd-config';

import '../sass/cfd.scss';
import CfdPasswordModalTnc from './cfd-password-modal-tnc';
import classNames from 'classnames';

const CFDPasswordChange = makeLazyLoader(
    () => moduleLoader(() => import('./cfd-password-change')),
    () => <div />
)();

const CFDPasswordChangeContent = makeLazyLoader(
    () => moduleLoader(() => import('./cfd-password-change-content')),
    () => <div />
)();

const ChangePasswordConfirmation = makeLazyLoader(
    () => moduleLoader(() => import('./cfd-change-password-confirmation')),
    () => <div />
)();

export type TCFDPasswordFormValues = { password: string };

type TOnSubmitPassword = (values: TCFDPasswordFormValues, actions: FormikHelpers<TCFDPasswordFormValues>) => void;

type TPasswordModalHeaderProps = {
    should_set_trading_password: boolean;
    is_password_reset_error: boolean;
    platform: string;
    has_mt5_account?: boolean;
};

type TIconTypeProps = {
    platform: string;
    type?: string;
    show_eu_related_content: boolean;
    product?: TProducts;
};

type TCFDPasswordFormReusedProps = {
    platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
    error_message: string;
    validatePassword: (values: TCFDPasswordFormValues) => FormikErrors<TCFDPasswordFormValues>;
};

type TCFDCreatePasswordProps = TCFDPasswordFormReusedProps & {
    password: string;
    onSubmit: TOnSubmitPassword;
    is_real_financial_stp: boolean;
};

type TCFDCreatePasswordFormProps = TCFDPasswordFormReusedProps & {
    has_mt5_account: boolean;
    submitPassword: TOnSubmitPassword;
    is_real_financial_stp: boolean;
};

type TMultiStepRefProps = {
    goNextStep: () => void;
    goPrevStep: () => void;
};
type TReviewMsgForMT5 = {
    is_selected_mt5_verified: boolean;
    jurisdiction_selected_shortcode: string;
    manual_status: string;
};

type TCFDPasswordFormProps = TCFDPasswordFormReusedProps & {
    closeModal: () => void;
    error_type?: string;
    form_error?: string;
    has_mt5_account: boolean;
    is_bvi: boolean;
    is_dxtrade_allowed: boolean;
    is_real_financial_stp: boolean;
    onCancel: () => void;
    onForgotPassword: () => void;
    should_set_trading_password: boolean;
    submitPassword: TOnSubmitPassword;
};

type TCFDPasswordModalProps = {
    error_type?: string;
    form_error?: string;
    platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
};

const PasswordModalHeader = ({
    should_set_trading_password,
    is_password_reset_error,
    platform,
}: TPasswordModalHeaderProps) => {
    const { isDesktop } = useDevice();

    const element = !isDesktop ? 'p' : 'span';
    const alignment = 'center';
    const font_size = 's';

    return (
        <Text as={element} line_height='m' weight='bold' size={font_size} align={alignment}>
            {should_set_trading_password && !is_password_reset_error && platform === CFD_PLATFORMS.MT5 && (
                <Localize
                    i18n_default_text='Create a {{platform}} password'
                    values={{
                        platform: getCFDPlatformLabel(platform),
                    }}
                />
            )}
            {!should_set_trading_password && !is_password_reset_error && (
                <Localize
                    i18n_default_text='Enter your {{platform}} password'
                    values={{
                        platform: getCFDPlatformLabel(platform),
                    }}
                />
            )}
            {is_password_reset_error && <Localize i18n_default_text='Too many attempts' />}
        </Text>
    );
};
const ReviewMessageForMT5 = ({
    is_selected_mt5_verified,
    jurisdiction_selected_shortcode,
    manual_status,
}: TReviewMsgForMT5) => {
    if (is_selected_mt5_verified) {
        return <Localize i18n_default_text='Enable trading with your first transfer.' />;
    } else if (
        jurisdiction_selected_shortcode === JURISDICTION.BVI ||
        jurisdiction_selected_shortcode === JURISDICTION.VANUATU
    ) {
        if (manual_status === 'pending') {
            return <Localize i18n_default_text='We’re reviewing your documents. This should take about 1 to 3 days.' />;
        }
        return <Localize i18n_default_text='We’re reviewing your documents. This should take about 5 minutes.' />;
    } else if (jurisdiction_selected_shortcode === JURISDICTION.LABUAN) {
        return <Localize i18n_default_text='We’re reviewing your documents. This should take about 1 to 3 days.' />;
    } else if (jurisdiction_selected_shortcode === JURISDICTION.MALTA_INVEST) {
        return (
            <Localize i18n_default_text='To start trading, transfer funds from your Deriv account into this account.' />
        );
    }
    return null;
};

const IconType = React.memo(({ platform, type, show_eu_related_content, product }: TIconTypeProps) => {
    const traders_hub = window.location.pathname === routes.traders_hub;
    if (platform === CFD_PLATFORMS.DXTRADE) {
        return <Icon icon='IcRebrandingDxtradeDashboard' size={128} />;
    } else if (traders_hub) {
        if (platform === CFD_PLATFORMS.CTRADER) {
            return <TradingPlatformIcon icon='CTrader' size={128} />;
        }
        switch (type) {
            case 'synthetic':
                return <TradingPlatformIcon icon='Standard' size={128} />;
            case 'all':
                if (product === PRODUCT.ZEROSPREAD) {
                    return <TradingPlatformIcon icon='ZeroSpread' size={128} />;
                }
                return <TradingPlatformIcon icon='SwapFree' size={128} />;
            case 'financial':
                if (show_eu_related_content) {
                    return <TradingPlatformIcon icon='CFDs' size={128} />;
                }
                return <TradingPlatformIcon icon='Financial' size={128} />;
            default:
                return <TradingPlatformIcon icon='Financial' size={128} />;
        }
    } else {
        switch (type) {
            case 'synthetic':
                return <Icon icon='IcMt5StandardPlatform' size={128} />;
            case 'all':
                if (product === PRODUCT.ZEROSPREAD) {
                    return <Icon icon='IcMt5ZeroSpread' size={128} />;
                }
                return <Icon icon='IcMt5SwapFreePlatform' size={128} />;
            case 'financial':
                if (show_eu_related_content) {
                    return <Icon icon='IcMt5CfdPlatform' size={128} />;
                }
                return <Icon icon='IcMt5FinancialPlatform' size={128} />;
            default:
                return <Icon icon='IcMt5FinancialStpPlatform' size={128} />;
        }
    }
});
IconType.displayName = 'IconType';

const getCancelButtonLabel = ({
    should_set_trading_password,
    error_type,
    isDesktop,
}: Pick<TCFDPasswordFormProps, 'should_set_trading_password' | 'error_type'> & { isDesktop: boolean }) => {
    if (should_set_trading_password && error_type !== 'PasswordReset') {
        return isDesktop ? null : localize('Cancel');
    }

    return localize('Forgot password?');
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

const CreatePassword = ({
    password,
    platform,
    validatePassword,
    onSubmit,
    error_message,
    is_real_financial_stp,
}: TCFDCreatePasswordProps) => {
    const { product, account_type } = useCfdStore();
    const [checked, setChecked] = React.useState(
        !(product === PRODUCT.ZEROSPREAD && account_type.category === CATEGORY.REAL)
    );

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
                <form onSubmit={handleSubmit}>
                    <div
                        className='cfd-password-modal__content dc-modal__container_cfd-password-modal__body cfd-password-modal__create-password-content'
                        data-testid='dt_create_password'
                    >
                        <div className='cfd-password-modal__create-password-body'>
                            {platform === CFD_PLATFORMS.MT5 ? (
                                <>
                                    <Icon icon='IcMt5Password' width='100' height='100' />
                                    <Text size='xs' className='cfd-password-modal__create-password-description'>
                                        <Localize
                                            i18n_default_text='Note: You can use this password for all your {{platform}} accounts.'
                                            values={{
                                                platform: getCFDPlatformLabel(platform),
                                            }}
                                        />
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Icon icon='IcDxtradeOnePassword' width='122' height='108' />
                                    <Text
                                        size='s'
                                        align='center'
                                        weight='bold'
                                        className='cfd-password-modal__create-password-title'
                                    >
                                        <Localize
                                            i18n_default_text='Create a {{platform}} password'
                                            values={{
                                                platform: getCFDPlatformLabel(platform),
                                            }}
                                        />
                                    </Text>
                                    <Text
                                        size='xs'
                                        align='center'
                                        className='cfd-password-modal__create-password-description'
                                    >
                                        <Localize
                                            i18n_default_text='You can use this password for all your {{platform}} accounts.'
                                            values={{
                                                platform: getCFDPlatformLabel(platform),
                                            }}
                                        />
                                    </Text>
                                </>
                            )}
                            <div className='input-element'>
                                <PasswordMeter
                                    input={values.password}
                                    has_error={!!(touched.password && errors.password)}
                                    custom_feedback_messages={getErrorMessages().password_warnings}
                                >
                                    {() => (
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
                                        />
                                    )}
                                </PasswordMeter>
                            </div>
                            {is_real_financial_stp && (
                                <div className='dc-modal__container_cfd-password-modal__description'>
                                    <Localize i18n_default_text='Your MT5 Financial STP account will be opened through Deriv (FX) Ltd. All trading in this account is subject to the regulations and guidelines of the Labuan Financial Service Authority (LFSA). None of your other accounts, including your Deriv account, is subject to the regulations and guidelines of the Labuan Financial Service Authority (LFSA).' />
                                </div>
                            )}
                            {product === PRODUCT.ZEROSPREAD && account_type.category === CATEGORY.REAL && (
                                <CfdPasswordModalTnc
                                    platform={platform}
                                    checked={checked}
                                    onCheck={() => setChecked(prev => !prev)}
                                />
                            )}
                        </div>
                        <FormSubmitButton
                            is_disabled={!values.password || !checked || Object.keys(errors).length > 0}
                            is_loading={isSubmitting}
                            label={localize('Create {{platform}} password', {
                                platform: getCFDPlatformLabel(platform),
                            })}
                            is_center={platform !== CFD_PLATFORMS.MT5}
                        />
                    </div>
                </form>
            )}
        </Formik>
    );
};

const CFDCreatePasswordForm = ({
    has_mt5_account,
    platform,
    error_message,
    validatePassword,
    submitPassword,
    is_real_financial_stp,
}: TCFDCreatePasswordFormProps) => {
    const multi_step_ref = React.useRef<TMultiStepRefProps>();
    const [password, setPassword] = React.useState('');

    const onSubmit: TOnSubmitPassword = (values, actions) => {
        if (platform === CFD_PLATFORMS.MT5 && has_mt5_account) {
            setPassword(values.password);
            multi_step_ref.current?.goNextStep();
        } else {
            submitPassword(values, actions);
        }
    };

    const steps = [
        {
            component: (
                <CreatePassword
                    password={password}
                    platform={platform}
                    error_message={error_message}
                    validatePassword={validatePassword}
                    onSubmit={onSubmit}
                    is_real_financial_stp={is_real_financial_stp}
                />
            ),
        },
        {
            component: (
                <ChangePasswordConfirmation
                    className='cfd-password-modal__change-password-confirmation'
                    platform={platform}
                    onConfirm={(_values: TCFDPasswordFormValues, actions: FormikHelpers<TCFDPasswordFormValues>) =>
                        submitPassword({ password }, actions)
                    }
                    onCancel={() => multi_step_ref.current?.goPrevStep()}
                />
            ),
        },
    ];

    return <MultiStep ref={multi_step_ref} steps={steps} />;
};

const CFDPasswordForm = observer(
    ({
        closeModal,
        error_message,
        error_type,
        form_error,
        has_mt5_account,
        is_real_financial_stp,
        onCancel,
        onForgotPassword,
        platform,
        should_set_trading_password,
        submitPassword,
        validatePassword,
    }: TCFDPasswordFormProps) => {
        const { isDesktop } = useDevice();
        const { product, account_type } = useCfdStore();
        const [checked, setChecked] = React.useState(
            !(product === PRODUCT.ZEROSPREAD && account_type.category === CATEGORY.REAL)
        );

        const button_label = React.useMemo(() => {
            if (error_type === 'PasswordReset') {
                return localize('Try later');
            }
            return localize('Add account');
        }, [error_type]);

        const has_cancel_button = (isDesktop ? !should_set_trading_password : true) || error_type === 'PasswordReset';

        const cancel_button_label = getCancelButtonLabel({ should_set_trading_password, error_type, isDesktop });

        const handleCancel = () => {
            if (!has_cancel_button) {
                return undefined;
            }
            if (should_set_trading_password) {
                return onCancel();
            }

            return onForgotPassword();
        };

        if (error_type === 'PasswordReset') {
            return (
                <React.Fragment>
                    <div className='cfd-password-reset'>
                        <div className='cfd-password-modal__content cfd-password-modal__content--password-reset'>
                            <Text as='p' line_height='24' size='xs'>
                                <Localize i18n_default_text='Please try again in a minute.' />
                            </Text>
                        </div>
                        <Formik onSubmit={closeModal} initialValues={{}}>
                            {({ handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <FormSubmitButton
                                        has_cancel={has_cancel_button}
                                        cancel_label={cancel_button_label}
                                        onCancel={handleCancel}
                                        is_absolute={!isDesktop}
                                        label={button_label}
                                    />
                                </form>
                            )}
                        </Formik>
                    </div>
                </React.Fragment>
            );
        }

        if (should_set_trading_password) {
            return (
                <CFDCreatePasswordForm
                    platform={platform}
                    error_message={error_message}
                    validatePassword={validatePassword}
                    submitPassword={submitPassword}
                    has_mt5_account={has_mt5_account}
                    is_real_financial_stp={is_real_financial_stp}
                />
            );
        }

        return (
            <Formik
                initialValues={{
                    password: '',
                }}
                enableReinitialize
                validate={validatePassword}
                onSubmit={submitPassword}
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
                    <form onSubmit={handleSubmit}>
                        <div className='cfd-password-modal__content dc-modal__container_cfd-password-modal__body'>
                            {!should_set_trading_password && <CFDPasswordModalTitle platform={platform} />}
                            <div className='input-element'>
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
                                        handlePasswordInputChange(e, handleChange, validateForm, setFieldTouched);
                                    }}
                                    data_testId={`dt_${platform}_password`}
                                />
                            </div>

                            {is_real_financial_stp && (
                                <div className='dc-modal__container_cfd-password-modal__description'>
                                    <Localize
                                        i18n_default_text='Your MT5 Financial STP account will be opened through {{legal_entity_name}}. All trading in this account is subject to the regulations and guidelines of the Labuan Financial Service Authority (LFSA). None of your other accounts, including your Deriv account, is subject to the regulations and guidelines of the Labuan Financial Service Authority (LFSA).'
                                        values={{
                                            legal_entity_name: getLegalEntityName('fx'),
                                        }}
                                    />
                                </div>
                            )}
                            {error_type === 'PasswordError' && (
                                <Text size='xs' as='p' className='dc-modal__container_mt5-password-modal__hint'>
                                    <Localize
                                        i18n_default_text='Hint: You may have entered your Deriv password, which is different from your {{platform}} password.'
                                        values={{
                                            platform: getCFDPlatformLabel(platform),
                                        }}
                                    />
                                </Text>
                            )}
                            {product === PRODUCT.ZEROSPREAD && account_type.category === CATEGORY.REAL && (
                                <CfdPasswordModalTnc
                                    className='cfd-password-modal-tnc--bottom'
                                    platform={platform}
                                    checked={checked}
                                    onCheck={() => setChecked(prev => !prev)}
                                />
                            )}
                        </div>
                        <FormSubmitButton
                            is_disabled={!values.password || !checked}
                            has_cancel={has_cancel_button}
                            cancel_label={cancel_button_label}
                            onCancel={handleCancel}
                            is_absolute={!isDesktop}
                            is_loading={isSubmitting}
                            label={button_label}
                            is_center={should_set_trading_password}
                            form_error={form_error}
                        />
                    </form>
                )}
            </Formik>
        );
    }
);

const CFDPasswordModal = observer(({ form_error, platform }: TCFDPasswordModalProps) => {
    const { isDesktop, isMobileOrTabletLandscape } = useDevice();
    const isMobileOrTabletPortrait = !isDesktop && !isMobileOrTabletLandscape;
    const { client, traders_hub, ui } = useStore();

    const {
        email,
        account_status,
        landing_companies,
        is_logged_in,
        is_populating_mt5_account_list,
        is_dxtrade_allowed,
        mt5_login_list,
        updateAccountStatus,
        updateMT5Status,
    } = client;
    const { show_eu_related_content, is_eu_user, toggleAccountTransferModal } = traders_hub;
    const { is_mt5_migration_modal_enabled, setMT5MigrationModalEnabled, is_mt5_migration_modal_open } = ui;

    const {
        account_type,
        disableCFDPasswordModal,
        error_message,
        error_type,
        getAccountStatus,
        has_cfd_error,
        is_cfd_success_dialog_enabled,
        is_cfd_password_modal_enabled,
        jurisdiction_selected_shortcode,
        setError,
        setCFDSuccessDialog,
        submitMt5Password,
        submitCFDPassword,
        new_account_response,
        product,
        setMigratedMT5Accounts,
        is_mt5_password_changed_modal_visible,
        setIsMt5PasswordChangedModalVisible,
        is_mt5_password_invalid_format_modal_visible,
        setIsMt5PasswordInvalidFormatModalVisible,
        is_sent_email_modal_enabled,
        setSentEmailModalStatus,
    } = useCfdStore();

    const history = useHistory();

    const [is_password_modal_exited, setPasswordModalExited] = React.useState(true);
    const is_bvi = landing_companies?.mt_financial_company?.financial_stp?.shortcode === 'bvi';
    const has_mt5_account = Boolean(mt5_login_list?.length);
    const should_set_trading_password =
        Array.isArray(account_status?.status) &&
        account_status.status.includes(
            platform === CFD_PLATFORMS.MT5 ? 'mt5_password_not_set' : 'dxtrade_password_not_set'
        );
    const is_password_error = error_type === 'PasswordError';
    const is_password_reset = error_type === 'PasswordReset';
    const is_incorrect_mt5_password_format_error =
        error_type === 'InvalidTradingPlatformPasswordFormat' || error_type === 'IncorrectMT5PasswordFormat';

    const { poi_verified_for_bvi_labuan_vanuatu, poi_verified_for_maltainvest, poa_verified, manual_status } =
        getAuthenticationStatusInfo(account_status);

    const [is_selected_mt5_verified, setIsSelectedMT5Verified] = React.useState(false);

    const [new_password_value, setNewPasswordValue] = React.useState('');

    const getVerificationStatus = () => {
        switch (jurisdiction_selected_shortcode) {
            case JURISDICTION.SVG:
                setIsSelectedMT5Verified(true);
                break;
            case JURISDICTION.BVI:
            case JURISDICTION.VANUATU:
                setIsSelectedMT5Verified(poi_verified_for_bvi_labuan_vanuatu);
                break;
            case JURISDICTION.LABUAN:
                setIsSelectedMT5Verified(poi_verified_for_bvi_labuan_vanuatu && poa_verified);
                break;
            case JURISDICTION.MALTA_INVEST:
                setIsSelectedMT5Verified(poi_verified_for_maltainvest && poa_verified);
                break;
            default:
        }
    };

    // Usecase: Added this timeout to render the Password Change modal after the password modal is closed.
    // It is to avoid the flickering of the modal.
    React.useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (is_incorrect_mt5_password_format_error) {
            timeout = setTimeout(() => {
                setIsMt5PasswordInvalidFormatModalVisible(true);
            }, 500);
        }

        return () => clearTimeout(timeout);
    }, [is_incorrect_mt5_password_format_error, setIsMt5PasswordInvalidFormatModalVisible]);

    React.useEffect(() => {
        if (is_logged_in) {
            updateMT5Status();
            updateAccountStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        getVerificationStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jurisdiction_selected_shortcode, account_status]);

    const validatePassword = (values: TCFDPasswordFormValues) => {
        const errors: FormikErrors<TCFDPasswordFormValues> = {};
        const max_length = platform === CFD_PLATFORMS.MT5 && should_set_trading_password ? 16 : 25;
        if (
            !validLength(values.password, {
                min: 8,
                max: max_length,
            })
        ) {
            errors.password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
                min_number: 8,
                max_number: max_length,
            });
        } else if (!validPassword(values.password)) {
            errors.password = getErrorMessages().password();
        } else if (
            platform === CFD_PLATFORMS.MT5 &&
            should_set_trading_password &&
            !validMT5Password(values.password)
        ) {
            errors.password = localize(
                'Please include at least 1 special character such as ( _ @ ? ! / # ) in your password.'
            );
        }
        if (values.password?.toLowerCase() === email.toLowerCase()) {
            errors.password = localize('Your password cannot be the same as your email address.');
        }
        return errors;
    };

    const closeDialogs = () => {
        setCFDSuccessDialog(false);
        if (is_mt5_migration_modal_enabled) setMT5MigrationModalEnabled(false);
        setMigratedMT5Accounts([]);
        setError(false);
    };

    const closeModal = () => {
        setIsMt5PasswordChangedModalVisible(false);
        setIsMt5PasswordInvalidFormatModalVisible(false);
        updateMT5Status();
        closeDialogs();
        disableCFDPasswordModal();
    };

    const closeOpenSuccess = () => {
        disableCFDPasswordModal();
        closeDialogs();
        if (account_type.category === CATEGORY.REAL) {
            if (is_eu_user) {
                toggleAccountTransferModal();
            } else {
                sessionStorage.setItem('cfd_transfer_to_login_id', new_account_response.login || '');
                history.push(routes.cashier_acc_transfer);
            }
        }
    };

    const handleForgotPassword = () => {
        closeModal();
        let redirect_to = platform === CFD_PLATFORMS.MT5 ? 1 : 2;

        // if account type is real convert redirect_to from 1 or 2 to 10 or 20
        // and if account type is demo convert redirect_to from 1 or 2 to 11 or 21
        if (account_type.category === CATEGORY.REAL) {
            redirect_to = Number(`${redirect_to}0`);
        } else if (account_type.category === CATEGORY.DEMO) {
            redirect_to = Number(`${redirect_to}1`);
        }

        const password_reset_code =
            platform === CFD_PLATFORMS.MT5
                ? 'trading_platform_mt5_password_reset'
                : 'trading_platform_dxtrade_password_reset';
        WS.verifyEmail(email, password_reset_code, {
            url_parameters: {
                redirect_to,
            },
        });
        setSentEmailModalStatus(true);
    };

    const submitPassword: TOnSubmitPassword = (values, actions) => {
        if (platform === CFD_PLATFORMS.MT5) {
            submitMt5Password(
                {
                    ...values,
                },
                actions
            );
        } else {
            (values as TCFDPasswordFormValues & { platform: string }).platform = platform;
            submitCFDPassword(values, actions);
        }
    };

    const should_show_password =
        is_cfd_password_modal_enabled &&
        !is_cfd_success_dialog_enabled &&
        (!has_cfd_error || is_password_error || is_password_reset);

    const should_show_success_modals = !has_cfd_error && is_cfd_success_dialog_enabled && is_password_modal_exited;

    const should_show_success = should_show_success_modals && !is_mt5_migration_modal_enabled;

    const should_show_migration_success =
        should_show_success_modals &&
        is_mt5_migration_modal_enabled &&
        !is_populating_mt5_account_list &&
        !is_mt5_migration_modal_open;

    const should_show_sent_email_modal = is_sent_email_modal_enabled && is_password_modal_exited;

    const is_real_financial_stp = [account_type.category, account_type.type].join('_') === 'real_financial_stp';

    const should_show_password_modal = React.useMemo(() => {
        if (should_show_password) {
            return should_set_trading_password ? true : isDesktop;
        }
        return false;
    }, [should_set_trading_password, should_show_password]);

    const should_show_password_dialog = React.useMemo(() => {
        if (should_show_password) {
            if (!should_set_trading_password) return !isDesktop;
        }
        return false;
    }, [isDesktop, should_set_trading_password, should_show_password]);

    const success_modal_submit_label = React.useMemo(() => {
        if (account_type.category === CATEGORY.REAL) {
            if (platform === CFD_PLATFORMS.MT5) {
                return is_eu_user || is_selected_mt5_verified ? localize('Transfer now') : localize('OK');
            }
            return localize('Transfer now');
        }
        return localize('Continue');
    }, [platform, account_type, is_eu_user, is_selected_mt5_verified]);

    const success_modal_cancel_label = React.useMemo(() => {
        if (is_eu_user && account_type.category === 'real' && platform === CFD_PLATFORMS.MT5) {
            return localize('Maybe later');
        }
        return '';
    }, [platform, account_type, is_eu_user]);

    const getSubmitText = () => {
        const { category, type } = account_type;
        if (!category && !type) return '';

        const category_label = category === CATEGORY.REAL ? localize('real') : localize('demo');
        let type_label = '';
        switch (platform) {
            case CFD_PLATFORMS.MT5:
                type_label = getMtCompanies(show_eu_related_content, product)[category as keyof TMtCompanies][
                    type as keyof TMtCompanies['demo' | 'real']
                ].short_title;
                break;
            case CFD_PLATFORMS.DXTRADE:
                type_label =
                    getDxCompanies()[category as keyof TDxCompanies][type as keyof TDxCompanies['demo' | 'real']]
                        .short_title;
                break;
            default:
                type_label = '';
                break;
        }

        const accountTypes = () => {
            if (platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER) {
                return '';
            }
            return type_label;
        };

        if (category === CATEGORY.REAL) {
            return (
                <React.Fragment>
                    {platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER ? (
                        <Localize
                            i18n_default_text='Congratulations, you have successfully created your <0/>{{category}} {{platform}} {{type}} account. To start trading, <1 />transfer funds <2 />from your Deriv account into this account.'
                            values={{
                                type: accountTypes(),
                                platform: getCFDPlatformLabel(platform),
                                category: category_label,
                            }}
                            components={[
                                <br key={0} />,
                                platform === CFD_PLATFORMS.CTRADER && <br key={1} />,
                                platform === CFD_PLATFORMS.DXTRADE && <br key={2} />,
                            ]}
                        />
                    ) : (
                        <React.Fragment>
                            <Localize
                                i18n_default_text='Your Deriv MT5 {{type}} account is ready. '
                                values={{
                                    type: accountTypes(),
                                }}
                            />
                            <ReviewMessageForMT5
                                is_selected_mt5_verified={is_selected_mt5_verified}
                                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                                manual_status={manual_status}
                            />
                        </React.Fragment>
                    )}
                </React.Fragment>
            );
        }

        if (platform === CFD_PLATFORMS.MT5) {
            return (
                <Localize
                    i18n_default_text='Your demo {{deriv}} {{type}} account is ready.'
                    values={{
                        type: accountTypes(),
                        deriv: 'Deriv MT5',
                    }}
                />
            );
        }

        return (
            <Localize
                i18n_default_text='Congratulations, you have successfully created your <0/>{{category}} {{platform}} {{type}} account. '
                values={{
                    type: accountTypes(),
                    platform: is_eu_user ? '' : getCFDPlatformLabel(platform),
                    category: category_label,
                }}
                components={[<br key={0} />]}
            />
        );
    };

    const cfd_password_form = (
        <CFDPasswordForm
            is_bvi={is_bvi}
            closeModal={closeModal}
            error_type={error_type}
            error_message={error_type !== 'InvalidTradingPlatformPasswordFormat' ? error_message : ''}
            has_mt5_account={has_mt5_account}
            form_error={form_error}
            should_set_trading_password={should_set_trading_password}
            is_real_financial_stp={is_real_financial_stp}
            validatePassword={validatePassword}
            onForgotPassword={handleForgotPassword}
            submitPassword={submitPassword}
            platform={platform}
            is_dxtrade_allowed={is_dxtrade_allowed}
            onCancel={closeModal}
        />
    );

    const password_modal = (
        <Modal
            className={classNames('cfd-password-modal', {
                'cfd-password-modal__mt5': platform === CFD_PLATFORMS.MT5 && should_set_trading_password,
            })}
            has_close_icon
            is_open={should_show_password_modal}
            toggleModal={closeModal}
            should_header_stick_body
            renderTitle={() => (
                <PasswordModalHeader
                    should_set_trading_password={should_set_trading_password}
                    is_password_reset_error={is_password_reset}
                    platform={platform}
                />
            )}
            onUnmount={() => getAccountStatus(platform)}
            onExited={() => setPasswordModalExited(true)}
            onEntered={() => setPasswordModalExited(false)}
            width='auto'
        >
            {cfd_password_form}
        </Modal>
    );

    const password_modal_mobile = (
        <MobileDialog
            has_full_height
            portal_element_id='modal_root'
            visible={should_show_password_modal}
            onClose={closeModal}
            wrapper_classname='cfd-password-modal cfd-password-modal__mt5'
            renderTitle={() => (
                <PasswordModalHeader
                    should_set_trading_password={should_set_trading_password}
                    is_password_reset_error={is_password_reset}
                    platform={platform}
                />
            )}
        >
            {cfd_password_form}
        </MobileDialog>
    );

    const password_dialog = (
        <MobileDialog
            has_full_height
            portal_element_id='modal_root'
            visible={should_show_password_dialog}
            onClose={closeModal}
            wrapper_classname='cfd-password-modal'
            renderTitle={() => (
                <PasswordModalHeader
                    should_set_trading_password={should_set_trading_password}
                    has_mt5_account={has_mt5_account}
                    is_password_reset_error={is_password_reset}
                    platform={platform}
                />
            )}
        >
            {cfd_password_form}
        </MobileDialog>
    );

    const is_mt5_password_format_invalid_desktop = (
        <Modal
            className='cfd-password-modal'
            has_close_icon
            is_open={is_mt5_password_invalid_format_modal_visible}
            toggleModal={closeModal}
            should_header_stick_body
            title={localize('Deriv MT5 latest password requirements')}
            width='auto'
        >
            <CFDPasswordChange
                error_type={error_type}
                error_message={error_message}
                form_error={form_error}
                should_set_trading_password={should_set_trading_password}
                setNewPasswordValue={setNewPasswordValue}
                validatePassword={validatePassword}
                onForgotPassword={handleForgotPassword}
                platform={CFD_PLATFORMS.MT5}
                onCancel={closeModal}
            />
        </Modal>
    );

    const is_mt5_password_format_invalid = (
        <MobileDialog
            has_full_height
            portal_element_id='modal_root'
            visible={is_mt5_password_invalid_format_modal_visible}
            onClose={closeModal}
            wrapper_classname='cfd-password-modal cfd-password-change__wrapper'
            header_classname='cfd-password-change__header'
            renderTitle={() => localize('Deriv MT5 latest password requirements')}
        >
            <CFDPasswordChange
                error_type={error_type}
                error_message={error_message}
                form_error={form_error}
                should_set_trading_password={should_set_trading_password}
                setNewPasswordValue={setNewPasswordValue}
                validatePassword={validatePassword}
                onForgotPassword={handleForgotPassword}
                platform={CFD_PLATFORMS.MT5}
                onCancel={closeModal}
            />
        </MobileDialog>
    );

    const invalid_mt5_password_modal = isMobileOrTabletPortrait
        ? is_mt5_password_format_invalid
        : is_mt5_password_format_invalid_desktop;

    return (
        <React.Fragment>
            {platform === CFD_PLATFORMS.MT5 && !isDesktop && password_modal_mobile}
            {password_modal}
            {password_dialog}
            <SuccessDialog
                is_open={should_show_success}
                toggleModal={closeModal}
                onCancel={closeModal}
                onSubmit={
                    !is_eu_user && platform === CFD_PLATFORMS.MT5 && !is_selected_mt5_verified
                        ? closeModal
                        : closeOpenSuccess
                }
                classNameMessage='cfd-password-modal__message'
                message={getSubmitText()}
                icon={
                    <IconType
                        platform={platform}
                        type={account_type.type}
                        show_eu_related_content={show_eu_related_content}
                        product={product}
                    />
                }
                icon_size='xlarge'
                text_submit={success_modal_submit_label}
                text_cancel={success_modal_cancel_label}
                has_cancel={
                    platform === CFD_PLATFORMS.MT5
                        ? (is_eu_user || is_selected_mt5_verified) && account_type.category === CATEGORY.REAL
                        : account_type.category === CATEGORY.REAL
                }
                has_close_icon={false}
                width='auto'
                is_medium_button={!isDesktop}
            />
            <MigrationSuccessModal is_open={should_show_migration_success} closeModal={closeModal} />
            <SentEmailModal
                is_open={should_show_sent_email_modal}
                identifier_title='trading_password'
                onClose={() => setSentEmailModalStatus(false)}
                onClickSendEmail={handleForgotPassword}
            />
            {is_incorrect_mt5_password_format_error && invalid_mt5_password_modal}
            {is_mt5_password_changed_modal_visible && (
                <CFDPasswordChangeContent closeModal={closeModal} password_value={new_password_value} />
            )}
        </React.Fragment>
    );
});

export default CFDPasswordModal;

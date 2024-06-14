import React from 'react';
import { FormikErrors } from 'formik';
import { useHistory } from 'react-router';
import { SentEmailModal } from '@deriv/account';
import { MobileDialog, Modal } from '@deriv/components';
import {
    getAuthenticationStatusInfo,
    getCFDPlatformLabel,
    getErrorMessages,
    getFormattedJurisdictionCode,
    isDesktop,
    isMobileOrTablet,
    routes,
    validLength,
    validPassword,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import {
    useAccountStatus,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useCreateOtherCFDAccount,
    useSettings,
    useTradingPlatformPasswordChange,
    useVerifyEmail,
} from '@deriv/api';
import { getDxCompanies, getMtCompanies, TMtCompanies, TDxCompanies } from 'Stores/Modules/CFD/Helpers/cfd-config';
import SuccessDialog from 'Components/success-dialog.jsx';
import 'sass/cfd.scss';
import './cfd-password-modal.scss';
import { observer, useStore } from '@deriv/stores';
import { useCfdStore } from 'Stores/Modules/CFD/Helpers/useCfdStores';
import { PasswordModalHeader } from './password-modal-header';
import { CFDPasswordForm } from './cfd-password-form';
import { IconType } from './icon-type';
import { TCFDPasswordFormValues, TOnSubmitPassword } from './types';
import { CFD_PLATFORMS, CATEGORY, JURISDICTION, MARKET_TYPE, QUERY_STATUS } from 'Helpers/cfd-config';

type TReviewMsgForMT5 = {
    is_selected_mt5_verified: boolean;
    jurisdiction_selected_shortcode: string;
    manual_status: string;
};

type TCFDPasswordModalProps = {
    error_type?: string;
    form_error?: string;
    platform: string;
};

type TAccountType = 'all' | 'financial' | 'gaming' | 'demo';

type TAccountCategory = 'real' | 'demo';

type TCFDOtherPlatform = 'dxtrade' | 'ctrader';

const ReviewMessageForMT5 = ({
    is_selected_mt5_verified,
    jurisdiction_selected_shortcode,
    manual_status,
}: TReviewMsgForMT5) => {
    if (is_selected_mt5_verified) {
        return (
            <Localize i18n_default_text='To start trading, transfer funds from your Deriv account into this account.' />
        );
    } else if (
        jurisdiction_selected_shortcode === JURISDICTION.BVI ||
        jurisdiction_selected_shortcode === JURISDICTION.VANUATU
    ) {
        if (manual_status === 'pending') {
            return <Localize i18n_default_text='We’re reviewing your documents. This should take about 1 to 3 days.' />;
        }
        return <Localize i18n_default_text='We’re reviewing your documents. This should take about 5 minutes.' />;
    } else if (
        jurisdiction_selected_shortcode === JURISDICTION.LABUAN ||
        jurisdiction_selected_shortcode === JURISDICTION.MALTA_INVEST
    ) {
        return <Localize i18n_default_text='We’re reviewing your documents. This should take about 1 to 3 days.' />;
    }
    return null;
};

const CFDPasswordModal = observer(({ form_error, platform }: TCFDPasswordModalProps) => {
    const { client, traders_hub } = useStore();

    const {
        email,
        account_status,
        landing_companies,
        is_logged_in,
        is_dxtrade_allowed,
        mt5_login_list,
        updateAccountStatus,
    } = client;
    const { show_eu_related_content } = traders_hub;

    const {
        account_title,
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
    } = useCfdStore();

    const history = useHistory();
    const { mutateAsync: tradingPlatformPasswordChange } = useTradingPlatformPasswordChange();
    const {
        data: mt5_account_data,
        mutate: createMT5Account,
        status: mt5_create_account_status,
        error: mt5_create_account_error,
    } = useCreateMT5Account();
    const {
        mutate: createCFDAccount,
        status: cfd_create_account_status,
        error: cfd_create_account_error,
    } = useCreateOtherCFDAccount();
    const { mutate: verifyEmail } = useVerifyEmail();
    const { data: availableMT5Accounts } = useAvailableMT5Accounts();
    const { data: settings } = useSettings();
    const { data: account_status_hook } = useAccountStatus();

    const [is_password_modal_exited, setPasswordModalExited] = React.useState(true);
    const is_bvi = landing_companies?.mt_financial_company?.financial_stp?.shortcode === JURISDICTION.BVI;
    const has_mt5_account = Boolean(mt5_login_list?.length);
    const should_set_trading_password =
        Array.isArray(account_status?.status) &&
        account_status.status.includes(
            platform === CFD_PLATFORMS.MT5 ? 'mt5_password_not_set' : 'dxtrade_password_not_set'
        );
    const is_password_error = error_type === 'PasswordError';
    const is_password_reset = error_type === 'PasswordReset';
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);

    const { poi_verified_for_bvi_labuan_vanuatu, poi_verified_for_maltainvest, poa_verified, manual_status } =
        getAuthenticationStatusInfo(account_status);

    const [is_selected_mt5_verified, setIsSelectedMT5Verified] = React.useState(false);

    const marketType = account_type.type;
    const accountType = marketType === MARKET_TYPE.SYNTHETIC ? MARKET_TYPE.GAMING : marketType;

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

    React.useEffect(() => {
        if (is_logged_in) {
            updateAccountStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        getVerificationStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jurisdiction_selected_shortcode, account_status]);

    React.useEffect(() => {
        if (mt5_create_account_status === QUERY_STATUS.ERROR && mt5_create_account_error) {
            setError(true, mt5_create_account_error as unknown as Error);
        }
        if (mt5_create_account_status === QUERY_STATUS.SUCCESS) {
            setError(false);
            setCFDSuccessDialog(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mt5_create_account_status, mt5_create_account_error]);

    React.useEffect(() => {
        if (cfd_create_account_status === QUERY_STATUS.ERROR && mt5_create_account_error) {
            setError(true, cfd_create_account_error as unknown as Error);
        }
        if (cfd_create_account_status === QUERY_STATUS.SUCCESS) {
            setError(false);
            setCFDSuccessDialog(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cfd_create_account_status, cfd_create_account_error]);

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
        } else if (!validPassword(values.password)) {
            errors.password = getErrorMessages().password();
        }
        if (values.password?.toLowerCase() === email.toLowerCase()) {
            errors.password = localize('Your password cannot be the same as your email address.');
        }
        return errors;
    };

    const closeDialogs = () => {
        setCFDSuccessDialog(false);
        setError(false);
    };

    const closeModal = () => {
        closeDialogs();
        disableCFDPasswordModal();
    };

    const closeOpenSuccess = () => {
        disableCFDPasswordModal();
        closeDialogs();
        if (account_type.category === CATEGORY.REAL && mt5_create_account_status === 'success') {
            sessionStorage.setItem('cfd_transfer_to_login_id', mt5_account_data?.login || '');
            history.push(routes.cashier_acc_transfer);
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
        verifyEmail({
            verify_email: email,
            type: password_reset_code,
            url_parameters: {
                redirect_to,
            },
        });
        setIsSentEmailModalOpen(true);
    };

    const submitPassword: TOnSubmitPassword = (values, actions) => {
        (async () => {
            if (platform === CFD_PLATFORMS.MT5) {
                if (account_status_hook?.is_mt5_password_not_set) {
                    await tradingPlatformPasswordChange({
                        new_password: values.password,
                        platform: CFD_PLATFORMS.MT5,
                    });
                }
                createMT5Account({
                    payload: {
                        account_type:
                            account_type.category === CATEGORY.DEMO
                                ? CATEGORY.DEMO
                                : (accountType as unknown as TAccountType),
                        address: settings?.address_line_1 || '',
                        city: settings?.address_city || '',
                        company: JURISDICTION.SVG,
                        country: settings?.country_code || '',
                        email: settings?.email || '',
                        leverage: availableMT5Accounts?.find(acc => acc.market_type === marketType)?.leverage || 500,
                        mainPassword: values.password,
                        ...(marketType === MARKET_TYPE.FINANCIAL && { mt5_account_type: MARKET_TYPE.FINANCIAL }),
                        ...(marketType === MARKET_TYPE.ALL && { sub_account_category: 'swap_free' }),
                        name: settings?.first_name || '',
                        phone: settings?.phone || '',
                        state: settings?.address_state || '',
                        zipCode: settings?.address_postcode || '',
                    },
                });

                if (mt5_create_account_status === QUERY_STATUS.SUCCESS) {
                    actions.setStatus({ success: true });
                    actions.setSubmitting(false);
                } else if (mt5_create_account_status === QUERY_STATUS.ERROR && mt5_create_account_error) {
                    actions.resetForm({});
                    actions.setSubmitting(false);
                    actions.setStatus({ success: false });
                }
            } else {
                if (CFD_PLATFORMS.DXTRADE && account_status_hook?.is_dxtrade_password_not_set) {
                    await tradingPlatformPasswordChange({
                        new_password: values.password,
                        platform: CFD_PLATFORMS.DXTRADE,
                    });
                }
                createCFDAccount({
                    payload: {
                        account_type: account_type.category as unknown as TAccountCategory,
                        market_type: MARKET_TYPE.ALL,
                        password: values.password,
                        platform: platform as unknown as TCFDOtherPlatform,
                    },
                });
                if (cfd_create_account_status === QUERY_STATUS.SUCCESS) {
                    actions.setStatus({ success: true });
                    actions.setSubmitting(false);
                } else if (cfd_create_account_status === QUERY_STATUS.ERROR && cfd_create_account_error) {
                    actions.resetForm({});
                    actions.setSubmitting(false);
                    actions.setStatus({ success: false });
                }
            }
        })().catch(error => {
            setError(true, error);
        });
    };

    const should_show_password =
        is_cfd_password_modal_enabled &&
        !is_cfd_success_dialog_enabled &&
        (!has_cfd_error || is_password_error || is_password_reset);

    const should_show_success =
        !has_cfd_error && is_cfd_success_dialog_enabled && is_cfd_password_modal_enabled && is_password_modal_exited;

    const should_show_sent_email_modal = is_sent_email_modal_open && is_password_modal_exited;

    const is_real_financial_stp = [account_type.category, account_type.type].join('_') === 'real_financial_stp';

    const should_show_password_modal = React.useMemo(() => {
        if (should_show_password) {
            return should_set_trading_password ? true : isDesktop();
        }
        return false;
    }, [should_set_trading_password, should_show_password]);

    const should_show_password_dialog = React.useMemo(() => {
        if (should_show_password) {
            if (!should_set_trading_password) return isMobileOrTablet();
        }
        return false;
    }, [should_set_trading_password, should_show_password]);

    const success_modal_submit_label = React.useMemo(() => {
        if (account_type.category === CATEGORY.REAL) {
            if (platform === CFD_PLATFORMS.MT5) {
                return is_selected_mt5_verified ? localize('Transfer now') : localize('OK');
            }
            return localize('Transfer now');
        }
        return localize('Continue');
    }, [platform, account_type, is_selected_mt5_verified]);

    const getSubmitText = () => {
        const { category, type } = account_type;
        if (!category && !type) return '';

        const category_label = category === CATEGORY.REAL ? localize('real') : localize('demo');
        let type_label = '';
        switch (platform) {
            case CFD_PLATFORMS.MT5:
                type_label =
                    getMtCompanies(show_eu_related_content)[category as keyof TMtCompanies][
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

        const jurisdiction_label =
            jurisdiction_selected_shortcode && getFormattedJurisdictionCode(jurisdiction_selected_shortcode);
        const mt5_platform_label = jurisdiction_selected_shortcode !== JURISDICTION.MALTA_INVEST ? 'Deriv MT5' : '';

        const accountTypes = () => {
            if (platform === CFD_PLATFORMS.DXTRADE && type_label === 'Standard') {
                return 'Synthetic';
            } else if (platform === CFD_PLATFORMS.CTRADER) {
                return 'CFDs';
            }
            return type_label;
        };

        if (category === CATEGORY.REAL) {
            return (
                <React.Fragment>
                    <Localize
                        i18n_default_text='Congratulations, you have successfully created your <0/>{{category}} {{platform}} {{type}} {{jurisdiction_selected_shortcode}} account. '
                        values={{
                            type: accountTypes(),
                            platform:
                                platform === CFD_PLATFORMS.MT5 ? mt5_platform_label : getCFDPlatformLabel(platform),
                            category: category_label,
                            jurisdiction_selected_shortcode:
                                platform === CFD_PLATFORMS.MT5 && !show_eu_related_content ? jurisdiction_label : '',
                        }}
                        components={[<br key={0} />]}
                    />
                    {platform === CFD_PLATFORMS.DXTRADE ? (
                        <Localize i18n_default_text='To start trading, transfer funds from your Deriv account into this account.' />
                    ) : (
                        <ReviewMessageForMT5
                            is_selected_mt5_verified={is_selected_mt5_verified}
                            jurisdiction_selected_shortcode={jurisdiction_label}
                            manual_status={manual_status}
                        />
                    )}
                </React.Fragment>
            );
        }

        return (
            <Localize
                i18n_default_text='Congratulations, you have successfully created your <0/>{{category}} {{platform}} {{type}} account. '
                values={{
                    type: accountTypes(),
                    platform: getCFDPlatformLabel(platform),
                    category: category_label,
                }}
                components={[<br key={0} />]}
            />
        );
    };

    const cfd_password_form = (
        <CFDPasswordForm
            is_bvi={is_bvi}
            account_title={account_title}
            account_type={account_type}
            closeModal={closeModal}
            error_type={error_type}
            error_message={error_message}
            has_mt5_account={has_mt5_account}
            form_error={form_error}
            jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
            should_set_trading_password={should_set_trading_password}
            is_real_financial_stp={is_real_financial_stp}
            validatePassword={validatePassword}
            onForgotPassword={handleForgotPassword}
            submitPassword={submitPassword}
            platform={platform}
            is_dxtrade_allowed={is_dxtrade_allowed}
            onCancel={closeModal}
            show_eu_related_content={show_eu_related_content}
        />
    );

    const password_modal = (
        <Modal
            className='cfd-password-modal'
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
            width={isMobileOrTablet() ? '32.8rem' : 'auto'}
        >
            {cfd_password_form}
        </Modal>
    );

    const password_dialog = (
        <MobileDialog
            has_full_height
            portal_element_id='modal_root'
            visible={should_show_password_dialog}
            onClose={closeModal}
            wrapper_classname='cfd-password-modal'
        >
            <PasswordModalHeader
                should_set_trading_password={should_set_trading_password}
                has_mt5_account={has_mt5_account}
                is_password_reset_error={is_password_reset}
                platform={platform}
            />

            {cfd_password_form}
        </MobileDialog>
    );

    return (
        <React.Fragment>
            {password_modal}
            {password_dialog}
            <SuccessDialog
                is_open={should_show_success}
                toggleModal={closeModal}
                onCancel={closeModal}
                onSubmit={platform === CFD_PLATFORMS.MT5 && !is_selected_mt5_verified ? closeModal : closeOpenSuccess}
                classNameMessage='cfd-password-modal__message'
                message={getSubmitText()}
                icon={
                    <IconType
                        platform={platform}
                        type={account_type.type}
                        show_eu_related_content={show_eu_related_content}
                    />
                }
                icon_size='xlarge'
                text_submit={success_modal_submit_label}
                has_cancel={
                    platform === CFD_PLATFORMS.MT5
                        ? is_selected_mt5_verified && account_type.category === CATEGORY.REAL
                        : account_type.category === CATEGORY.REAL
                }
                has_close_icon={false}
                width={isMobileOrTablet() ? '32.8rem' : 'auto'}
                is_medium_button={isMobileOrTablet()}
            />
            <SentEmailModal
                is_open={should_show_sent_email_modal}
                identifier_title='trading_password'
                onClose={() => setIsSentEmailModalOpen(false)}
                onClickSendEmail={handleForgotPassword}
            />
        </React.Fragment>
    );
});

export default CFDPasswordModal;

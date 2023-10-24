import React from 'react';
import { FormikErrors } from 'formik';
import { useHistory } from 'react-router';
import { SentEmailModal } from '@deriv/account';
import {
    getDxCompanies,
    getMtCompanies,
    getDerivezCompanies,
    getFormattedJurisdictionCode,
    TMtCompanies,
    TDxCompanies,
    TDerivezCompanies,
} from '../../Stores/Modules/CFD/Helpers/cfd-config';
import { MobileDialog, Modal } from '@deriv/components';
import {
    CFD_PLATFORMS,
    getAuthenticationStatusInfo,
    getCFDPlatformLabel,
    getErrorMessages,
    isDesktop,
    isMobile,
    Jurisdiction,
    routes,
    validLength,
    validPassword,
    WS,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import SuccessDialog from '../../Components/success-dialog.jsx';
import '../../sass/cfd.scss';
import './cfd-password-modal.scss';

import { observer, useStore } from '@deriv/stores';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import { PasswordModalHeader } from './password-modal-header';
import { IconType } from './icon-type';
import { TCFDPasswordFormValues, TOnSubmitPassword } from './types';
import { CFDPasswordForm } from './cfd-password-form';

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

const ReviewMessageForMT5 = ({
    is_selected_mt5_verified,
    jurisdiction_selected_shortcode,
    manual_status,
}: TReviewMsgForMT5) => {
    if (is_selected_mt5_verified) {
        return (
            <Localize i18n_default_text='To start trading, top-up funds from your Deriv account into this account.' />
        );
    } else if ([Jurisdiction.BVI, Jurisdiction.VANUATU].includes(jurisdiction_selected_shortcode)) {
        if (manual_status === 'pending') {
            return <Localize i18n_default_text='We’re reviewing your documents. This should take about 1 to 3 days.' />;
        }
        return <Localize i18n_default_text='We’re reviewing your documents. This should take about 5 minutes.' />;
    } else if ([Jurisdiction.LABUAN, Jurisdiction.MALTA_INVEST].includes(jurisdiction_selected_shortcode)) {
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
        submitMt5Password,
        submitCFDPassword,
        new_account_response,
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
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);

    const { poi_verified_for_bvi_labuan_vanuatu, poi_verified_for_maltainvest, poa_verified, manual_status } =
        getAuthenticationStatusInfo(account_status);

    const [is_selected_mt5_verified, setIsSelectedMT5Verified] = React.useState(false);

    const getVerificationStatus = () => {
        switch (jurisdiction_selected_shortcode) {
            case Jurisdiction.SVG:
                setIsSelectedMT5Verified(true);
                break;
            case Jurisdiction.BVI:
            case Jurisdiction.VANUATU:
                setIsSelectedMT5Verified(poi_verified_for_bvi_labuan_vanuatu);
                break;
            case Jurisdiction.LABUAN:
                setIsSelectedMT5Verified(poi_verified_for_bvi_labuan_vanuatu && poa_verified);
                break;
            case Jurisdiction.MALTA_INVEST:
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
        if (account_type.category === 'real') {
            sessionStorage.setItem('cfd_transfer_to_login_id', new_account_response.login || '');
            history.push(routes.cashier_acc_transfer);
        }
    };

    const handleForgotPassword = () => {
        closeModal();
        let redirect_to = platform === CFD_PLATFORMS.MT5 ? 1 : 2;

        // if account type is real convert redirect_to from 1 or 2 to 10 or 20
        // and if account type is demo convert redirect_to from 1 or 2 to 11 or 21
        if (account_type.category === 'real') {
            redirect_to = Number(`${redirect_to}0`);
        } else if (account_type.category === 'demo') {
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
        setIsSentEmailModalOpen(true);
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
            if (!should_set_trading_password) return isMobile();
        }
        return false;
    }, [should_set_trading_password, should_show_password]);

    const success_modal_submit_label = React.useMemo(() => {
        if (account_type.category === 'real') {
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

        const category_label = category === 'real' ? localize('real') : localize('demo');
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
            case CFD_PLATFORMS.DERIVEZ:
                type_label =
                    getDerivezCompanies()[category as keyof TDerivezCompanies][
                        type as keyof TDerivezCompanies['demo' | 'real']
                    ].short_title;
                break;
            default:
                type_label = '';
                break;
        }

        const jurisdiction_label =
            jurisdiction_selected_shortcode && getFormattedJurisdictionCode(jurisdiction_selected_shortcode);
        const mt5_platform_label = jurisdiction_selected_shortcode !== Jurisdiction.MALTA_INVEST ? 'Deriv MT5' : '';

        const accountTypes = () => {
            if (platform === 'dxtrade' && type_label === 'Derived') {
                return 'Synthetic';
            } else if (platform === 'derivez' || platform === 'ctrader') {
                return 'CFDs';
            }
            return type_label;
        };

        if (category === 'real') {
            let platformName = '';
            switch (platform) {
                case CFD_PLATFORMS.MT5:
                    platformName = mt5_platform_label;
                    break;
                case CFD_PLATFORMS.DERIVEZ:
                    platformName = 'Deriv Ez';
                    break;
                default:
                    platformName = 'Deriv X';
                    break;
            }

            return (
                <React.Fragment>
                    <Localize
                        i18n_default_text='Congratulations, you have successfully created your {{category}} <0>{{platform}}</0> <1>{{type}} {{jurisdiction_selected_shortcode}}</1> account. '
                        values={{
                            // TODO: remove below condition once deriv x changes are completed
                            type: accountTypes(),
                            platform:
                                platform === CFD_PLATFORMS.MT5 ? mt5_platform_label : getCFDPlatformLabel(platform),
                            category: category_label,
                            jurisdiction_selected_shortcode:
                                platform === CFD_PLATFORMS.MT5 && !show_eu_related_content ? jurisdiction_label : '',
                        }}
                        components={[<span key={0} className='cfd-account__platform' />, <strong key={1} />]}
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
                i18n_default_text='Congratulations, you have successfully created your {{category}} <0>{{platform}}</0> <1>{{type}}</1> account. '
                values={{
                    type: accountTypes(),
                    platform: platform === CFD_PLATFORMS.MT5 ? 'MT5' : getCFDPlatformLabel(platform),
                    category: category_label,
                }}
                components={[<span key={0} className='cfd-account__platform' />, <strong key={1} />]}
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
            width={isMobile() ? '32.8rem' : 'auto'}
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
                        ? is_selected_mt5_verified && account_type.category === 'real'
                        : account_type.category === 'real'
                }
                has_close_icon={false}
                width={isMobile() ? '32.8rem' : 'auto'}
                is_medium_button={isMobile()}
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

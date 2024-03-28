/* eslint-disable react/display-name */
import React from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { RiskToleranceWarningModal, TestWarningModal } from '@deriv/account';
import { Button, DesktopWrapper, MobileDialog, MobileWrapper, Modal, Text, UILoader } from '@deriv/components';
import { ContentFlag, WS, moduleLoader, routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import AddCurrency from './add-currency.jsx';
import AddOrManageAccounts from './add-or-manage-accounts.jsx';
import ChooseCurrency from './choose-currency.jsx';
import FinishedAddCurrency from './finished-add-currency.jsx';
import FinishedSetCurrency from './finished-set-currency.jsx';
import SetCurrency from './set-currency.jsx';
import SignupErrorContent from './signup-error-content.jsx';
import StatusDialogContainer from './status-dialog-container.jsx';
import { Analytics } from '@deriv-com/analytics';
import 'Sass/details-form.scss';
import 'Sass/account-wizard.scss';
import 'Sass/real-account-signup.scss';

const AccountWizard = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "account-wizard-modal" */ './account-wizard.jsx'))
);

const modal_pages_indices = {
    account_wizard: 0,
    add_or_manage_account: 1,
    finished_set_currency: 2,
    status_dialog: 3,
    set_currency: 4,
    signup_error: 5,
    choose_crypto_currency: 6,
    add_currency: 7,
    finished_add_currency: 8,
    restricted_country_signup_error: 9,
    invalid_input_error: 10,
};
let active_modal_index_no = 0;

const WizardHeading = ({ country_standpoint, currency, is_isle_of_man_residence, real_account_signup_target }) => {
    const maltainvest_signup = real_account_signup_target === 'maltainvest';
    const iom_signup = real_account_signup_target === 'iom';
    const deposit_cash_signup = real_account_signup_target === 'deposit_cash';

    if ((!maltainvest_signup && !currency) || active_modal_index_no === modal_pages_indices.set_currency) {
        return <Localize i18n_default_text='Set a currency for your real account' />;
    }

    if (deposit_cash_signup) {
        return <Localize i18n_default_text='Add a Deriv Gaming account' />;
    }

    if (iom_signup && is_isle_of_man_residence) {
        return <Localize i18n_default_text='Add a Deriv account' />;
    }

    switch (real_account_signup_target) {
        case 'malta':
            if (
                country_standpoint.is_united_kingdom ||
                country_standpoint.is_rest_of_eu ||
                country_standpoint.is_belgium
            ) {
                return <Localize i18n_default_text='Add a real Deriv Options account' />;
            }
            return <Localize i18n_default_text='Add a Derived account' />;
        case 'iom':
            if (country_standpoint.is_united_kingdom) {
                return <Localize i18n_default_text='Add a real Deriv Gaming account' />;
            }
            return <Localize i18n_default_text='Add a Derived account' />;
        case 'maltainvest':
            if (
                country_standpoint.is_united_kingdom ||
                country_standpoint.is_france ||
                country_standpoint.is_other_eu ||
                country_standpoint.is_rest_of_eu
            ) {
                return <Localize i18n_default_text='Setup your account' />;
            }
            return <Localize i18n_default_text='Add a Deriv Financial account' />;
        case 'samoa':
            return <Localize i18n_default_text='Terms of use' />;
        default:
            return <Localize i18n_default_text='Add a Deriv account' />;
    }
};

const RealAccountSignup = observer(({ history, state_index, is_trading_experience_incomplete }) => {
    const { ui, client, traders_hub, modules } = useStore();
    const {
        available_crypto_currencies,
        country_standpoint,
        currency,
        fetchAccountSettings,
        has_fiat,
        has_active_real_account: has_real_account,
        is_from_restricted_country,
        realAccountSignup,
        redirectToLegacyPlatform,
    } = client;
    const {
        closeRealAccountSignup,
        deposit_real_account_signup_target,
        is_real_acc_signup_on,
        real_account_signup_target,
        setIsTradingAssessmentForNewUserEnabled,
        setIsClosingCreateRealAccountModal,
        setRealAccountSignupParams: setParams,
        setShouldShowAppropriatenessWarningModal,
        setShouldShowRiskWarningModal,
        should_show_appropriateness_warning_modal,
        should_show_risk_warning_modal,
        setShouldShowOneTimeDepositModal,
        real_account_signup: state_value,
        is_trading_assessment_for_new_user_enabled,
    } = ui;
    const { content_flag, show_eu_related_content, toggleIsTourOpen } = traders_hub;
    const deposit_target = modules.cashier.general_store.deposit_target;
    const setIsDeposit = modules.cashier.general_store.setIsDeposit;
    const should_show_all_available_currencies = modules.cashier.general_store.should_show_all_available_currencies;
    const is_belgium_residence = client.residence === 'be'; // TODO: [deriv-eu] refactor this once more residence checks are required
    const is_isle_of_man_residence = client.residence === 'im'; // TODO: [deriv-eu] refactor this once more residence checks are required
    const [current_action, setCurrentAction] = React.useState(null);
    const [is_loading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [is_risk_warning_visible, setIsRiskWarningVisible] = React.useState(false);
    const [real_account_form_data, setRealAccountFormData] = React.useState({});
    const [risk_warning_title, setRiskWarningTitle] = React.useState('');
    const [modal_content] = React.useState([
        {
            action: 'signup',
            body: local_props => (
                <React.Suspense fallback={<UILoader />}>
                    <AccountWizard
                        setIsRiskWarningVisible={setIsRiskWarningVisible}
                        onFinishSuccess={showStatusDialog}
                        onOpenDepositModal={closeModalthenOpenDepositModal}
                        onOpenWelcomeModal={closeModalthenOpenWelcomeModal}
                        is_loading={local_props.is_loading}
                        setLoading={setLoading}
                        onError={showErrorModal}
                        onClose={closeModal}
                        realAccountSignup={realAccountSignup}
                        setRealAccountFormData={setRealAccountFormData}
                    />
                </React.Suspense>
            ),
            title: WizardHeading,
        },
        {
            action: 'multi',
            body: local_props => (
                <AddOrManageAccounts
                    onSuccessSetAccountCurrency={showSetCurrencySuccess}
                    is_loading={local_props.is_loading}
                    setLoading={setLoading}
                    onError={showErrorModal}
                    is_add_crypto={local_props.real_account_signup_target === 'add_crypto'}
                    is_add_fiat={local_props.real_account_signup_target === 'add_fiat'}
                    is_add_currency={local_props.real_account_signup_target === 'add_currency'}
                    deposit_target={local_props.deposit_target}
                    onClose={closeModal}
                />
            ),
            title: local_props => {
                if (local_props.real_account_signup_target === 'add_crypto') {
                    return localize('Create a cryptocurrency account');
                } else if (local_props.real_account_signup_target === 'add_fiat') {
                    return localize('Add a Deriv real account');
                } else if (local_props.real_account_signup_target === 'add_currency') {
                    return localize('Create a new account');
                } else if (local_props.has_fiat && local_props.available_crypto_currencies?.length === 0) {
                    return localize('Manage account');
                }
                return localize('Add or manage account');
            },
        },
        {
            body: local_props => (
                <FinishedSetCurrency
                    prev={local_props.state_value.previous_currency}
                    current={local_props.state_value.current_currency}
                    onCancel={closeSetCurrencySuccessModal}
                    onSubmit={closeModalThenOpenCashier}
                    deposit_real_account_signup_target={local_props.deposit_real_account_signup_target}
                    deposit_target={local_props.deposit_target}
                    closeRealAccountSignup={closeRealAccountSignup}
                    setIsDeposit={setIsDeposit}
                    history={history}
                />
            ),
            title: local_props =>
                local_props.has_fiat && local_props.available_crypto_currencies?.length === 0
                    ? localize('Manage account')
                    : localize('Add or manage account'),
        },
        {
            body: local_props => (
                <StatusDialogContainer
                    currency={local_props.state_value.currency}
                    closeModal={closeSetCurrencySuccessModal}
                />
            ),
        },
        {
            body: local_props => (
                <SetCurrency
                    is_loading={local_props.is_loading}
                    setLoading={setLoading}
                    onError={showErrorModal}
                    onClose={closeModal}
                    onSuccessSetAccountCurrency={showSetCurrencySuccess}
                />
            ),
            title: WizardHeading,
        },
        {
            body: local_props => (
                <SignupErrorContent
                    message={
                        local_props.state_value.error_message || local_props.state_value.error_code?.message_to_client
                    }
                    code={local_props.state_value.error_code}
                    onConfirm={() => onErrorConfirm(local_props.state_value.error_code)}
                />
            ),
            title: local_props => {
                if (local_props?.real_account_signup_target === 'add_crypto') {
                    return localize('Create a cryptocurrency account');
                } else if (local_props?.real_account_signup_target === 'add_fiat') {
                    return localize('Add a Deriv real account');
                } else if (local_props?.real_account_signup_target === 'add_currency') {
                    return localize('Create a new account');
                } else if (local_props?.has_fiat && local_props?.available_crypto_currencies?.length === 0) {
                    return localize('Manage account');
                }
                return localize('Add or manage account');
            },
        },
        {
            body: () => <ChooseCurrency className='account-wizard__body' onError={showErrorModal} />,
            title: local_props =>
                local_props.should_show_all_available_currencies
                    ? localize('Choose an account')
                    : localize('Choose a cryptocurrency account'),
        },
        {
            body: () => <AddCurrency className='account-wizard__body' onError={showErrorModal} />,
            title: () => localize('Create a new account'),
        },
        {
            body: local_props => (
                <FinishedAddCurrency
                    redirectToLegacyPlatform={redirectToLegacyPlatform}
                    prev={local_props.state_value.previous_currency}
                    current={local_props.state_value.current_currency}
                    onSubmit={closeModalThenOpenCashier}
                    deposit_real_account_signup_target={local_props.deposit_real_account_signup_target}
                    deposit_target={local_props.deposit_target}
                    closeRealAccountSignup={closeRealAccountSignup}
                    setIsDeposit={setIsDeposit}
                    history={history}
                />
            ),
        },
        {
            body: local_props => (
                <SignupErrorContent
                    message={
                        local_props.state_value.error_message || local_props.state_value.error_code?.message_to_client
                    }
                    code={local_props.state_value.error_code}
                    onConfirm={closeRealAccountSignup}
                    className='restricted-country-error'
                />
            ),
        },
        {
            body: local_props => (
                <SignupErrorContent
                    message={
                        local_props.state_value.error_message || local_props.state_value.error_code?.message_to_client
                    }
                    code={local_props.state_value.error_code}
                    onConfirm={onErrorConfirm}
                    error_field={local_props.state_value}
                    className='invalid-input-error'
                />
            ),
        },
    ]);

    const [assessment_decline, setAssessmentDecline] = React.useState(false);

    const trackEvent = React.useCallback(
        payload => {
            if (real_account_signup_target === 'maltainvest') return;

            Analytics.trackEvent('ce_real_account_signup_form', {
                form_source: document.referrer,
                form_name: 'real_account_signup_form',
                landing_company: real_account_signup_target,
                ...payload,
            });
        },
        [real_account_signup_target]
    );

    React.useEffect(() => {
        if (is_real_acc_signup_on) {
            trackEvent({ action: 'open' });
        }
    }, [is_real_acc_signup_on, trackEvent]);

    const getModalHeight = () => {
        if (is_from_restricted_country) return '304px';
        else if ([invalid_input_error, status_dialog].includes(getActiveModalIndex())) return 'auto';
        if (!currency || getActiveModalIndex() === modal_pages_indices.set_currency) return '688px'; // Set currency modal
        if (has_real_account && currency) {
            if (show_eu_related_content && getActiveModalIndex() === modal_pages_indices.add_or_manage_account) {
                // Manage account
                return '420px'; // Since crypto is disabled for EU clients, lower the height of modal
            }
            if (
                [modal_pages_indices.finished_set_currency, modal_pages_indices.finished_add_currency].includes(
                    getActiveModalIndex()
                )
            ) {
                return 'auto';
            }
        }
        return '740px'; // Account wizard modal
    };
    const getModalWidth = () => {
        if (is_from_restricted_country || getActiveModalIndex() === modal_pages_indices.invalid_input_error)
            return '440px';
        return !has_close_icon ? 'auto' : '955px';
    };

    const closeModalthenOpenDepositModal = () => {
        closeRealAccountSignup();
        setShouldShowOneTimeDepositModal(true);
    };

    const showStatusDialog = curr => {
        setParams({
            active_modal_index: modal_pages_indices.status_dialog,
            currency: curr,
        });
    };
    const closeModalthenOpenWelcomeModal = curr => {
        closeRealAccountSignup();
        setParams({
            currency: curr,
        });
    };

    const closeModalThenOpenCashier = () => {
        closeRealAccountSignup();
        history.push(routes.cashier_deposit);
    };

    const showSetCurrencySuccess = (previous_currency, current_currency, target) => {
        setParams({
            previous_currency,
            current_currency,
            active_modal_index: target
                ? modal_pages_indices.finished_add_currency
                : modal_pages_indices.finished_set_currency,
        });
    };

    const setLoading = is_loading_val => {
        setIsLoading(is_loading_val);
    };

    const cacheFormValues = payload => {
        localStorage.setItem(
            'real_account_signup_wizard',
            JSON.stringify(
                payload.map(item => {
                    if (typeof item.form_value === 'object') {
                        return item.form_value;
                    }
                    return false;
                })
            )
        );
    };

    const showErrorModal = (err, payload) => {
        if (payload) {
            cacheFormValues(payload);
        }

        setCurrentAction(modal_content[getActiveModalIndex()]?.action);
        setError(err);

        trackEvent({
            action: 'other_error',
            real_signup_error_message: err,
        });
    };

    React.useEffect(() => {
        setRiskWarningTitle(localize('Risk Tolerance Warning'));
        return () => setIsTradingAssessmentForNewUserEnabled(is_trading_experience_incomplete);
    }, []);

    // setCurrentAction callback useEffect to set error details
    React.useEffect(() => {
        if (!error) return;
        setParams({
            active_modal_index: ['InputValidationFailed', 'PoBoxInAddress', 'InvalidPhone'].includes(error.code)
                ? modal_pages_indices.invalid_input_error
                : modal_pages_indices.signup_error,
            error_message: error.message,
            error_code: error.code,
            ...(error.code === 'InputValidationFailed' && { error_details: error.details }),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    React.useEffect(() => {
        if (!is_from_restricted_country) return;
        setParams({
            active_modal_index: modal_pages_indices.restricted_country_signup_error,
            error_message: localize('Adding more real accounts has been restricted for your country.'),
            error_code: 'InvalidAccount',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_from_restricted_country, is_real_acc_signup_on]);

    const closeSetCurrencySuccessModal = e => {
        // Do not close modal on external link and popover click event
        if (
            e?.target.getAttribute('rel') === 'noopener noreferrer' ||
            e?.target.closest('.redirect-notice') ||
            e?.target.closest('.dc-popover__bubble')
        ) {
            return;
        }
        if (getActiveModalIndex() !== modal_pages_indices.status_dialog) {
            sessionStorage.removeItem('post_real_account_signup');
            localStorage.removeItem('real_account_signup_wizard');
        }
        closeRealAccountSignup();
    };

    const closeModal = e => {
        // Do not close modal on external link and popover click event
        if (
            !e ||
            e?.target.getAttribute('rel') === 'noopener noreferrer' ||
            e?.target.closest('.redirect-notice') ||
            e?.target.closest('.dc-popover__bubble')
        ) {
            return;
        }
        if (getActiveModalIndex() !== modal_pages_indices.status_dialog) {
            sessionStorage.removeItem('post_real_account_signup');
            localStorage.removeItem('real_account_signup_wizard');
        }

        if (modal_content[getActiveModalIndex()].action === 'signup') {
            setIsClosingCreateRealAccountModal(true);
            if ([ContentFlag.EU_REAL, ContentFlag.EU_DEMO].includes(content_flag)) {
                toggleIsTourOpen(true);
            }

            return;
        }
        closeRealAccountSignup();
        redirectToLegacyPlatform();
    };

    const onErrorConfirm = err_code => {
        const addOrManageAccountErrorType = ['CurrencyTypeNotAllowed', 'DuplicateCurrency'];
        setLoading(true);
        setParams({
            active_modal_index:
                current_action === 'multi' || addOrManageAccountErrorType.includes(err_code)
                    ? modal_pages_indices.add_or_manage_account
                    : modal_pages_indices.account_wizard,
        });
    };

    const getIsManageTarget = () => {
        return real_account_signup_target === 'manage';
    };

    const getActiveModalIndex = () => {
        if (real_account_signup_target === 'choose') {
            active_modal_index_no = modal_pages_indices.choose_crypto_currency;
            return active_modal_index_no;
        }
        if (['add_crypto', 'add_fiat', 'add_currency'].includes(real_account_signup_target)) {
            active_modal_index_no = modal_pages_indices.add_or_manage_account;
            return active_modal_index_no;
        }
        if (state_value.active_modal_index === -1) {
            if (has_real_account && currency && getIsManageTarget()) {
                active_modal_index_no = modal_pages_indices.add_or_manage_account;
            } else {
                active_modal_index_no =
                    real_account_signup_target === 'set_currency'
                        ? modal_pages_indices.set_currency
                        : modal_pages_indices.account_wizard;
            }
        } else {
            active_modal_index_no = state_value.active_modal_index;
        }
        return active_modal_index_no;
    };

    // set title and body of the modal
    const { title: Title, body: ModalContent } = modal_content[getActiveModalIndex()];
    const {
        account_wizard,
        add_or_manage_account,
        finished_set_currency,
        status_dialog,
        set_currency,
        signup_error,
        restricted_country_signup_error,
        invalid_input_error,
    } = modal_pages_indices;

    const has_close_icon = [account_wizard, add_or_manage_account, set_currency, signup_error].includes(
        getActiveModalIndex()
    );

    const handleOnAccept = async () => {
        setLoading(true);
        try {
            const response = await realAccountSignup({ ...real_account_form_data, accept_risk: 1 });
            WS.authorized.getAccountStatus().then(status => {
                const { get_account_status } = status;
                setShouldShowAppropriatenessWarningModal(false);
                if (
                    real_account_signup_target === 'maltainvest' &&
                    !get_account_status?.status?.includes('cashier_locked')
                ) {
                    closeModalthenOpenDepositModal();
                } else {
                    showStatusDialog(response?.new_account_maltainvest?.currency.toLowerCase());
                }
            });
        } catch (sign_up_error) {
            // TODO: Handle Error
        } finally {
            fetchAccountSettings();
            setLoading(false);
        }
    };

    const handleOnDecline = async () => {
        setLoading(true);
        setAssessmentDecline(true);
        try {
            await realAccountSignup({ ...real_account_form_data, accept_risk: 0 });
        } catch (sign_up_error) {
            setRiskWarningTitle(localize('24-hour Cool Down Warning'));
            if (sign_up_error.code === 'AppropriatenessTestFailed') {
                setShouldShowAppropriatenessWarningModal(false);
                setShouldShowRiskWarningModal(true);
            }
            // TODO: Handle Error case
        } finally {
            fetchAccountSettings();
            setLoading(false);
        }
    };

    const handleRiskAcceptance = () => {
        closeRealAccountSignup();
        setShouldShowRiskWarningModal(false);
        setAssessmentDecline(false);
    };

    if (assessment_decline) {
        return (
            <RiskToleranceWarningModal
                show_risk_modal={assessment_decline}
                title={risk_warning_title}
                handleAcceptRisk={handleRiskAcceptance}
                body_content={
                    <Localize
                        i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the risk of losing your money. <0/><0/>
                        As you have declined our previous warning, you would need to wait 24 hours before you can proceed further.'
                        components={[<br key={0} />]}
                    />
                }
            />
        );
    } else if (is_trading_assessment_for_new_user_enabled && should_show_risk_warning_modal) {
        return (
            <RiskToleranceWarningModal
                show_risk_modal={should_show_risk_warning_modal}
                title={risk_warning_title}
                handleAcceptRisk={handleRiskAcceptance}
                body_content={
                    <Localize
                        i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the high risk of losing your money. <0/><0/> To continue, kindly note that you would need to wait 24 hours before you can proceed further.'
                        components={[<br key={0} />]}
                    />
                }
            />
        );
    } else if (should_show_appropriateness_warning_modal) {
        return (
            <TestWarningModal
                show_risk_modal={should_show_appropriateness_warning_modal}
                body_content={
                    <Text as='p' size='xs'>
                        <Localize
                            i18n_default_text='In providing our services to you, we are required to ask you for some information to assess if a given product or service is appropriate for you and whether you have the experience and knowledge to understand the risks involved.<0/><0/>'
                            components={[<br key={0} />]}
                        />
                        <Localize
                            i18n_default_text='On the basis of the information provided in relation to your knowledge and experience, we consider that the investments available via this website are not appropriate for you.<0/><0/>'
                            components={[<br key={0} />]}
                        />
                        <Localize i18n_default_text='By clicking ‘Accept’ and proceeding with the account opening, you should note that you may be exposing yourself to risks. These risks, which may be significant, include the risk of losing the entire sum invested, and you may not have the knowledge and experience to properly assess or mitigate them.' />
                    </Text>
                }
                footer_content={
                    <React.Fragment>
                        <Button type='button' large text={localize('Decline')} secondary onClick={handleOnDecline} />
                        <Button
                            type='button'
                            large
                            text={localize('Accept')}
                            primary
                            onClick={handleOnAccept}
                            is_loading={is_loading}
                        />
                    </React.Fragment>
                }
            />
        );
    }

    return (
        <React.Fragment>
            {is_real_acc_signup_on && (
                <React.Fragment>
                    <DesktopWrapper>
                        <Modal
                            id='real_account_signup_modal'
                            className={classNames('real-account-signup-modal', {
                                'dc-modal__container_real-account-signup-modal--error': [
                                    signup_error,
                                    restricted_country_signup_error,
                                    invalid_input_error,
                                ].includes(getActiveModalIndex()),
                                'dc-modal__container_real-account-signup-modal--success': [
                                    finished_set_currency,
                                    status_dialog,
                                ].includes(getActiveModalIndex()),
                            })}
                            is_open={is_real_acc_signup_on}
                            is_risk_warning_visible={is_risk_warning_visible}
                            has_close_icon={real_account_signup_target !== 'samoa'}
                            is_title_centered={real_account_signup_target === 'samoa'}
                            renderTitle={() => {
                                if (Title && ![finished_set_currency, status_dialog].includes(getActiveModalIndex())) {
                                    return (
                                        <Title
                                            available_crypto_currencies={available_crypto_currencies}
                                            country_standpoint={country_standpoint}
                                            currency={currency}
                                            has_fiat={has_fiat}
                                            is_belgium_residence={is_belgium_residence}
                                            is_eu={show_eu_related_content}
                                            is_isle_of_man_residence={is_isle_of_man_residence}
                                            real_account_signup_target={real_account_signup_target}
                                            should_show_all_available_currencies={should_show_all_available_currencies}
                                        />
                                    );
                                }

                                return null;
                            }}
                            toggleModal={closeModal}
                            height={getModalHeight()}
                            width={getModalWidth()}
                            elements_to_ignore={[document.querySelector('.modal-root')]}
                        >
                            <ModalContent
                                state_value={state_value}
                                passthrough={state_index}
                                is_loading={is_loading}
                                real_account_signup_target={real_account_signup_target}
                                deposit_real_account_signup_target={deposit_real_account_signup_target}
                                deposit_target={deposit_target}
                            />
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='modal_root'
                            wrapper_classname='account-signup-mobile-dialog'
                            visible={is_real_acc_signup_on}
                            onClose={closeModal}
                            renderTitle={() => {
                                if (Title) {
                                    return (
                                        <Title
                                            country_standpoint={country_standpoint}
                                            currency={currency}
                                            is_belgium_residence={is_belgium_residence}
                                            is_isle_of_man_residence={is_isle_of_man_residence}
                                            real_account_signup_target={real_account_signup_target}
                                            should_show_all_available_currencies={should_show_all_available_currencies}
                                        />
                                    );
                                }

                                return null;
                            }}
                        >
                            <ModalContent
                                state_value={state_value}
                                passthrough={state_index}
                                is_loading={is_loading}
                                real_account_signup_target={real_account_signup_target}
                                deposit_real_account_signup_target={deposit_real_account_signup_target}
                                deposit_target={deposit_target}
                            />
                        </MobileDialog>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
});

export default withRouter(RealAccountSignup);

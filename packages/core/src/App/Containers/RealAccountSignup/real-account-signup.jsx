/* eslint-disable react/display-name */
import classNames from 'classnames';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
import { routes, isNavigationFromPlatform } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import AccountWizard from './account-wizard.jsx';
import AddOrManageAccounts from './add-or-manage-accounts.jsx';
import ChooseCryptoCurrency from './choose-crypto-currency.jsx';
import SetCurrency from './set-currency.jsx';
import FinishedSetCurrency from './finished-set-currency.jsx';
import SignupErrorContent from './signup-error-content.jsx';
import StatusDialogContainer from './status-dialog-container.jsx';
import 'Sass/account-wizard.scss';
import 'Sass/real-account-signup.scss';

const modal_pages_indices = {
    account_wizard: 0,
    add_or_manage_account: 1,
    finished_set_currency: 2,
    status_dialog: 3,
    set_currency: 4,
    signup_error: 5,
    choose_crypto_currency: 6,
};

const WizardHeading = ({ real_account_signup_target, currency, is_isle_of_man_residence, is_belgium_residence }) => {
    if (!currency && real_account_signup_target !== 'maltainvest') {
        return <Localize i18n_default_text='Set a currency for your real account' />;
    }

    if (
        (real_account_signup_target === 'malta' && is_belgium_residence) ||
        real_account_signup_target === 'deposit_cash'
    ) {
        return <Localize i18n_default_text='Add a Deriv Synthetic account' />;
    }

    if (real_account_signup_target === 'iom' && is_isle_of_man_residence) {
        return <Localize i18n_default_text='Add a Deriv account' />;
    }
    switch (real_account_signup_target) {
        case 'malta':
        case 'iom':
            return <Localize i18n_default_text='Add a Deriv Synthetic Indices account' />;
        case 'maltainvest':
            return <Localize i18n_default_text='Add a Deriv Financial account' />;
        case 'samoa':
            return <Localize i18n_default_text='Terms of use' />;
        default:
            return <Localize i18n_default_text='Add a Deriv account' />;
    }
};

const RealAccountSignup = ({
    available_crypto_currencies,
    closeRealAccountSignup,
    continueRoute,
    currency,
    deposit_target,
    has_fiat,
    has_real_account,
    history,
    is_belgium_residence,
    is_isle_of_man_residence,
    is_eu,
    is_real_acc_signup_on,
    real_account_signup_target,
    routing_history,
    setIsDeposit,
    setParams,
    should_show_all_available_currencies,
    state_index,
    state_value,
    deposit_real_account_signup_target,
}) => {
    const [current_action, setCurrentAction] = React.useState(null);
    const [is_loading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [modal_content] = React.useState([
        {
            action: 'signup',
            body: local_props => (
                <AccountWizard
                    onFinishSuccess={showStatusDialog}
                    onOpenWelcomeModal={closeModalthenOpenWelcomeModal}
                    is_loading={local_props.is_loading}
                    setLoading={setLoading}
                    onError={showErrorModal}
                    onClose={closeModal}
                />
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
                />
            ),
            title: local_props => {
                if (local_props.real_account_signup_target === 'add_crypto') {
                    return localize('Create a cryptocurrency account');
                } else if (local_props.real_account_signup_target === 'add_fiat') {
                    return localize('Add a Deriv real account');
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
                    onCancel={closeModal}
                    onSubmit={closeModalThenOpenCashier}
                    deposit_real_account_signup_target={local_props.deposit_real_account_signup_target}
                    deposit_target={local_props.deposit_target}
                    closeRealAccountSignup={closeRealAccountSignup}
                    continueRoute={continueRoute}
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
                <StatusDialogContainer currency={local_props.state_value.currency} closeModal={closeModal} />
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
                    message={local_props.state_value.error_message}
                    code={local_props.state_value.error_code}
                    onConfirm={onErrorConfirm}
                />
            ),
            title: () => localize('Add a real account'),
        },
        {
            body: () => <ChooseCryptoCurrency className='account-wizard__body' onError={showErrorModal} />,
            title: local_props =>
                local_props.should_show_all_available_currencies
                    ? localize('Choose an account')
                    : localize('Choose a cryptocurrency account'),
        },
    ]);

    const getModalHeight = () => {
        if (getActiveModalIndex() === modal_pages_indices.status_dialog) return 'auto';
        if (!currency) return '688px'; // Set currency modal
        if (has_real_account && currency) {
            if (is_eu && getActiveModalIndex() === modal_pages_indices.add_or_manage_account) {
                // Manage account
                return '420px'; // Since crypto is disabled for EU clients, lower the height of modal
            }
            if (getActiveModalIndex() === modal_pages_indices.finished_set_currency) {
                return 'auto';
            }
            return '644px'; // Add or manage account modal
        }
        return '740px'; // Account wizard modal
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

    const showSetCurrencySuccess = (previous_currency, current_currency) => {
        setParams({
            previous_currency,
            current_currency,
            active_modal_index: modal_pages_indices.finished_set_currency,
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
    };

    // setCurrentAction callback useEffect to set error details
    React.useEffect(() => {
        if (!error) return;
        setParams({
            active_modal_index: modal_pages_indices.signup_error,
            error_message: error.message,
            error_code: error.code,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    const closeModal = e => {
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

        if (isNavigationFromPlatform(routing_history, routes.smarttrader)) {
            window.location = routes.smarttrader;
        }
    };

    const onErrorConfirm = () => {
        setParams({
            active_modal_index:
                current_action === 'multi'
                    ? modal_pages_indices.add_or_manage_account
                    : modal_pages_indices.account_wizard,
        });
    };

    const getIsManageTarget = () => {
        return real_account_signup_target === 'manage';
    };

    const getActiveModalIndex = () => {
        let active_modal_index_no;
        if (real_account_signup_target === 'choose') {
            active_modal_index_no = modal_pages_indices.choose_crypto_currency;
            return active_modal_index_no;
        }
        if (['add_crypto', 'add_fiat'].includes(real_account_signup_target)) {
            active_modal_index_no = modal_pages_indices.add_or_manage_account;
            return active_modal_index_no;
        }
        if (state_value.active_modal_index === -1) {
            if (has_real_account && currency && getIsManageTarget()) {
                active_modal_index_no = modal_pages_indices.add_or_manage_account;
            } else {
                active_modal_index_no = !currency
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
    } = modal_pages_indices;

    const has_close_icon = [account_wizard, add_or_manage_account, set_currency, signup_error].includes(
        getActiveModalIndex()
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    id='real_account_signup_modal'
                    className={classNames('real-account-signup-modal', {
                        'dc-modal__container_real-account-signup-modal--error': getActiveModalIndex() === signup_error,
                        'dc-modal__container_real-account-signup-modal--success': [
                            finished_set_currency,
                            status_dialog,
                        ].includes(getActiveModalIndex()),
                    })}
                    is_open={is_real_acc_signup_on}
                    has_close_icon={real_account_signup_target !== 'samoa'}
                    is_title_centered={real_account_signup_target === 'samoa'}
                    renderTitle={() => {
                        if (Title && ![finished_set_currency, status_dialog].includes(getActiveModalIndex())) {
                            return (
                                <Title
                                    real_account_signup_target={real_account_signup_target}
                                    currency={currency}
                                    is_isle_of_man_residence={is_isle_of_man_residence}
                                    is_belgium_residence={is_belgium_residence}
                                    is_eu={is_eu}
                                    has_fiat={has_fiat}
                                    available_crypto_currencies={available_crypto_currencies}
                                    should_show_all_available_currencies={should_show_all_available_currencies}
                                />
                            );
                        }

                        return null;
                    }}
                    toggleModal={closeModal}
                    height={getModalHeight()}
                    width={!has_close_icon ? 'auto' : '904px'}
                >
                    {is_real_acc_signup_on && (
                        <ModalContent
                            state_value={state_value}
                            passthrough={state_index}
                            is_loading={is_loading}
                            real_account_signup_target={real_account_signup_target}
                            deposit_real_account_signup_target={deposit_real_account_signup_target}
                            deposit_target={deposit_target}
                        />
                    )}
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
                                    real_account_signup_target={real_account_signup_target}
                                    currency={currency}
                                    is_isle_of_man_residence={is_isle_of_man_residence}
                                    is_belgium_residence={is_belgium_residence}
                                    should_show_all_available_currencies={should_show_all_available_currencies}
                                />
                            );
                        }
                        return null;
                    }}
                >
                    {is_real_acc_signup_on && (
                        <ModalContent
                            state_value={state_value}
                            passthrough={state_index}
                            is_loading={is_loading}
                            real_account_signup_target={real_account_signup_target}
                            deposit_real_account_signup_target={deposit_real_account_signup_target}
                            deposit_target={deposit_target}
                        />
                    )}
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default connect(({ ui, client, common, modules }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    has_fiat: client.has_fiat,
    has_real_account: client.has_active_real_account,
    continueRoute: modules.cashier.continueRoute,
    currency: client.currency,
    deposit_target: modules.cashier.deposit_target,
    is_eu: client.is_eu,
    is_real_acc_signup_on: ui.is_real_acc_signup_on,
    real_account_signup_target: ui.real_account_signup_target,
    closeRealAccountSignup: ui.closeRealAccountSignup,
    setParams: ui.setRealAccountSignupParams,
    residence: client.residence,
    is_isle_of_man_residence: client.residence === 'im', // TODO: [deriv-eu] refactor this once more residence checks are required
    is_belgium_residence: client.residence === 'be', // TODO: [deriv-eu] refactor this once more residence checks are required
    setIsDeposit: modules.cashier.setIsDeposit,
    should_show_all_available_currencies: modules.cashier.should_show_all_available_currencies,
    state_value: ui.real_account_signup,
    routing_history: common.app_routing_history,
    deposit_real_account_signup_target: ui.deposit_real_account_signup_target,
}))(withRouter(RealAccountSignup));

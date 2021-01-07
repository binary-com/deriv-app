import classNames from 'classnames';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
import { routes, isNavigationFromPlatform } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import ModalLoginPrompt from './modal-login-prompt.jsx';
import AccountWizard from './account-wizard.jsx';
import AddOrManageAccounts from './add-or-manage-accounts.jsx';
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
};

const WizardHeading = ({ real_account_signup_target, currency, is_isle_of_man_residence, is_belgium_residence }) => {
    if (!currency && real_account_signup_target !== 'maltainvest') {
        return <Localize i18n_default_text='Set a currency for your real account' />;
    }

    if (real_account_signup_target === 'malta' && is_belgium_residence) {
        return <Localize i18n_default_text='Add a Deriv Synthetic account' />;
    }

    if (real_account_signup_target === 'iom' && is_isle_of_man_residence) {
        return <Localize i18n_default_text='Add a Deriv account' />;
    }

    switch (real_account_signup_target) {
        case 'malta':
        case 'iom':
            return <Localize i18n_default_text='Add a Deriv Synthetic account' />;
        case 'maltainvest':
            return <Localize i18n_default_text='Add a Deriv Financial account' />;
        case 'samoa':
            return <Localize i18n_default_text='Terms of use' />;
        default:
            return <Localize i18n_default_text='Add a Deriv account' />;
    }
};

class RealAccountSignup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current_action: null,
            is_loading: false,
            modal_content: [
                {
                    action: 'signup',
                    body: () => (
                        <AccountWizard
                            onFinishSuccess={this.showStatusDialog}
                            onOpenWelcomeModal={this.closeModalthenOpenWelcomeModal}
                            is_loading={this.state.is_loading}
                            setLoading={this.setLoading}
                            onError={this.showErrorModal}
                            onClose={this.closeModal}
                            onSuccessSetAccountCurrency={this.showSetCurrencySuccess}
                        />
                    ),
                    title: WizardHeading,
                },
                {
                    action: 'multi',
                    body: () => (
                        <AddOrManageAccounts
                            onSuccessSetAccountCurrency={this.showSetCurrencySuccess}
                            onSuccessAddCurrency={this.showStatusDialog}
                            is_loading={this.state.is_loading}
                            setLoading={this.setLoading}
                            onError={this.showErrorModal}
                        />
                    ),
                    title: () => (this.props.is_eu ? localize('Manage account') : localize('Add or manage account')),
                },
                {
                    body: () => (
                        <FinishedSetCurrency
                            prev={this.props.state_value.previous_currency}
                            current={this.props.state_value.current_currency}
                            onCancel={this.closeModal}
                            onSubmit={this.closeModalThenOpenCashier}
                        />
                    ),
                    title: () => localize('Add or manage account'),
                },
                {
                    body: () => (
                        <StatusDialogContainer
                            currency={this.props.state_value.currency}
                            closeModal={this.closeModal}
                        />
                    ),
                },
                {
                    body: () => (
                        <SetCurrency
                            setLoading={this.setLoading}
                            is_loading={this.state.is_loading}
                            onError={this.showErrorModal}
                            onClose={this.closeModal}
                            onSuccessSetAccountCurrency={this.showSetCurrencySuccess}
                        />
                    ),
                    title: WizardHeading,
                },
                {
                    body: () => (
                        <SignupErrorContent
                            message={this.props.state_value.error_message}
                            code={this.props.state_value.error_code}
                            onConfirm={this.onErrorConfirm}
                        />
                    ),
                    title: () => localize('Add a real account'),
                },
            ],
        };
    }

    get modal_height() {
        const { currency, has_real_account, is_eu } = this.props;
        if (this.active_modal_index === modal_pages_indices.status_dialog) return 'auto';
        if (!currency) return '688px'; // Set currency modal
        if (has_real_account && currency) {
            if (is_eu && this.active_modal_index === modal_pages_indices.add_or_manage_account) {
                // Manage account
                return '420px'; // Since crypto is disabled for EU clients, lower the height of modal
            }
            if (this.active_modal_index === modal_pages_indices.finished_set_currency) {
                return 'auto';
            }
            return '644px'; // Add or manage account modal
        }
        return '740px'; // Account wizard modal
    }

    showStatusDialog = currency => {
        this.props.setParams({
            active_modal_index: modal_pages_indices.status_dialog,
            currency,
        });
    };

    closeModalthenOpenWelcomeModal = currency => {
        this.props.closeRealAccountSignup();
        setTimeout(() => {
            this.props.toggleWelcomeModal({ is_visible: true, should_persist: true });
        }, 300);
        this.props.setParams({
            currency,
        });
    };

    closeModalThenOpenCashier = () => {
        this.props.closeRealAccountSignup();
        this.props.history.push(routes.cashier_deposit);
    };

    showSetCurrencySuccess = (previous_currency, current_currency) => {
        this.props.setParams({
            previous_currency,
            current_currency,
            active_modal_index: modal_pages_indices.finished_set_currency,
        });
    };

    setLoading = is_loading => {
        this.setState({ is_loading });
    };

    cacheFormValues = payload => {
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

    showErrorModal = (error, payload) => {
        if (payload) {
            this.cacheFormValues(payload);
        }

        this.setState({ current_action: this.state.modal_content[this.active_modal_index]?.action }, () => {
            this.props.setParams({
                active_modal_index: modal_pages_indices.signup_error,
                error_message: error.message,
                error_code: error.code,
            });
        });
    };

    closeModal = e => {
        // Do not close modal on external link click event
        if (e?.target.getAttribute('rel') === 'noopener noreferrer' || e?.target.closest('.redirect-notice')) {
            return;
        }
        if (this.active_modal_index !== modal_pages_indices.status_dialog) {
            sessionStorage.removeItem('post_real_account_signup');
            localStorage.removeItem('real_account_signup_wizard');
        }
        this.props.closeRealAccountSignup();

        if (isNavigationFromPlatform(this.props.routing_history, routes.smarttrader)) {
            window.location = routes.smarttrader;
        }
    };

    onErrorConfirm = () => {
        this.props.setParams({
            active_modal_index:
                this.state.current_action === 'multi'
                    ? modal_pages_indices.add_or_manage_account
                    : modal_pages_indices.account_wizard,
        });
    };

    get is_manage_target() {
        return this.props.real_account_signup_target === 'manage';
    }

    get active_modal_index() {
        let active_modal_index_no;
        if (this.props.state_value.active_modal_index === -1) {
            if (this.props.has_real_account && this.props.currency && this.is_manage_target) {
                active_modal_index_no = modal_pages_indices.add_or_manage_account;
            } else {
                active_modal_index_no = !this.props.currency
                    ? modal_pages_indices.set_currency
                    : modal_pages_indices.account_wizard;
            }
        } else {
            active_modal_index_no = this.props.state_value.active_modal_index;
        }
        return active_modal_index_no;
    }

    static text_cancel = () => {
        const post_signup = JSON.parse(sessionStorage.getItem('post_real_account_signup'));
        if (post_signup) {
            return localize('Continue to DMT5');
        }
        return localize('Maybe later');
    };

    render() {
        const { is_real_acc_signup_on, is_logged_in } = this.props;
        const { title: Title, body: ModalContent } = is_logged_in
            ? this.state.modal_content[this.active_modal_index]
            : {
                  title: this.state.modal_content[this.active_modal_index].title
                      ? () => this.state.modal_content[this.active_modal_index].title
                      : null,
                  body: ModalLoginPrompt,
              };
        const {
            account_wizard,
            add_or_manage_account,
            finished_set_currency,
            status_dialog,
            set_currency,
            signup_error,
        } = modal_pages_indices;

        const has_close_icon = [account_wizard, add_or_manage_account, set_currency, signup_error].includes(
            this.active_modal_index
        );

        return (
            <>
                <DesktopWrapper>
                    <Modal
                        id='real_account_signup_modal'
                        className={classNames('real-account-signup-modal', {
                            'dc-modal__container_real-account-signup-modal--error':
                                this.active_modal_index === signup_error,
                            'dc-modal__container_real-account-signup-modal--success': [
                                finished_set_currency,
                                status_dialog,
                            ].includes(this.active_modal_index),
                        })}
                        is_open={is_real_acc_signup_on}
                        has_close_icon={this.props.real_account_signup_target !== 'samoa'}
                        is_title_centered={this.props.real_account_signup_target === 'samoa'}
                        renderTitle={() => {
                            if (Title && ![finished_set_currency, status_dialog].includes(this.active_modal_index)) {
                                return <Title {...this.props} />;
                            }
                            return null;
                        }}
                        toggleModal={this.closeModal}
                        height={this.modal_height}
                        width={!has_close_icon ? 'auto' : '904px'}
                    >
                        <ModalContent passthrough={this.props.state_index} is_loading={this.state.is_loading} />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='modal_root'
                        wrapper_classname='account-signup-mobile-dialog'
                        visible={is_real_acc_signup_on}
                        onClose={this.closeModal}
                        renderTitle={() => {
                            if (Title) {
                                return <Title {...this.props} />;
                            }
                            return null;
                        }}
                    >
                        <ModalContent passthrough={this.props.state_index} is_loading={this.state.is_loading} />
                    </MobileDialog>
                </MobileWrapper>
            </>
        );
    }
}

export default connect(({ ui, client, common }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    can_change_fiat_currency: client.can_change_fiat_currency,
    has_real_account: client.has_active_real_account,
    currency: client.currency,
    is_eu: client.is_eu,
    is_real_acc_signup_on: ui.is_real_acc_signup_on,
    real_account_signup_target: ui.real_account_signup_target,
    is_logged_in: client.is_logged_in,
    closeRealAccountSignup: ui.closeRealAccountSignup,
    toggleWelcomeModal: ui.toggleWelcomeModal,
    setParams: ui.setRealAccountSignupParams,
    residence: client.residence,
    is_isle_of_man_residence: client.residence === 'im', // TODO: [deriv-eu] refactor this once more residence checks are required
    is_belgium_residence: client.residence === 'be', // TODO: [deriv-eu] refactor this once more residence checks are required
    state_value: ui.real_account_signup,
    routing_history: common.app_routing_history,
}))(withRouter(RealAccountSignup));

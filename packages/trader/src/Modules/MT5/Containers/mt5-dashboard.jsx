import React from 'react';
import { withRouter } from 'react-router';
import { DesktopWrapper, Icon, MobileWrapper, Tabs, PageError, Loading, Text } from '@deriv/components';
// TODO: [mt5-redesign] replace tabs with radiogroup once card component is ready
// import { DesktopWrapper, Icon, MobileWrapper, RadioGroup } from '@deriv/components';
import { isEmptyObject, isMobile, routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import LoadingMT5RealAccountDisplay from './loading-mt5-real-account-display.jsx';
import MissingRealAccount from './missing-real-account.jsx';
import MT5AccountOpeningRealFinancialStpModal from './mt5-account-opening-real-financial-stp-modal.jsx';
import CompareAccountsModal from './mt5-compare-accounts-modal.jsx';
import MT5DashboardContainer from './mt5-dashboard-container.jsx';
import MT5PasswordManagerModal from './mt5-password-manager-modal.jsx';
import MT5PasswordModal from './mt5-password-modal.jsx';
import MT5ServerErrorDialog from './mt5-server-error-dialog.jsx';
import Mt5TopUpDemoModal from './mt5-top-up-demo-modal.jsx';
import MT5ResetPasswordModal from './mt5-reset-password-modal.jsx';
import Mt5FinancialStpPendingDialog from '../Components/mt5-financial-stp-pending-dialog.jsx';
import { MT5DemoAccountDisplay } from '../Components/mt5-demo-account-display.jsx';
import { MT5RealAccountDisplay } from '../Components/mt5-real-account-display.jsx';
import { getPlatformMt5DownloadLink } from '../Helpers/constants';
import 'Sass/app/modules/mt5/mt5-dashboard.scss';

const LoadTab = ({ children, is_loading, loading_component, ...props }) => {
    const LoadingComponent = loading_component;
    if (is_loading) {
        return <LoadingComponent />;
    }

    return <Tabs {...props}>{children}</Tabs>;
};

class MT5Dashboard extends React.Component {
    state = {
        active_index: 0,
        is_account_needed_modal_open: false,
        is_demo_tab: true,
        required_account: {},
        password_manager: {
            is_visible: false,
            selected_login: '',
            selected_account: '',
            selected_account_type: '',
            selected_account_group: '',
            selected_server: '',
        },
    };

    async componentDidMount() {
        this.updateActiveIndex(this.getIndexToSet());
        this.openResetPassword();
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    componentDidUpdate() {
        this.updateActiveIndex();
        this.props.checkShouldOpenAccount();
    }

    openResetPassword = () => {
        if (!/reset-password/.test(this.props.location.hash)) {
            return;
        }

        this.props.setMt5PasswordResetModal(true);
    };

    getIndexToSet = () => {
        const hash = this.props.location.hash;
        if (hash) {
            return /demo/.test(this.props.location.hash) ? 1 : 0;
        }
        return undefined;
    };

    updateActiveIndex = index => {
        const updated_state = {};
        // updateActiveIndex is called in componentDidUpdate causing tab_index to always revert back to 0
        if (index === 1) updated_state.is_demo_tab = true;
        else if (index === 0) updated_state.is_demo_tab = false;

        const index_to_set = this.getIndexToSet();
        if (this.state.active_index !== index_to_set) {
            updated_state.active_index = index_to_set;
        }

        if (!isEmptyObject(updated_state)) {
            this.setState(updated_state);
        }
    };

    openAccountTransfer = (data, meta) => {
        if (meta.category === 'real') {
            sessionStorage.setItem('mt5_transfer_to_login_id', data.login);
            this.props.disableMt5PasswordModal();
            this.props.history.push(routes.cashier_acc_transfer);
        } else {
            this.props.setCurrentAccount(data, meta);
            this.props.openTopUpModal();
        }
    };

    togglePasswordManagerModal = (login, title, group, type, server) => {
        this.setState(prev_state => ({
            active_index: prev_state.active_index,
            password_manager: {
                is_visible: !prev_state.password_manager.is_visible,
                selected_login: typeof login === 'string' ? login : '',
                selected_account: typeof title === 'string' ? title : '',
                selected_account_group: group,
                selected_account_type: type,
                selected_server: server,
            },
        }));
    };

    openRealPasswordModal = account_type => {
        this.props.setAccountType(account_type);
        this.props.openPasswordModal();
    };

    render() {
        const {
            account_settings,
            account_status,
            beginRealSignupForMt5,
            country,
            createMT5Account,
            current_list,
            isAccountOfTypeDisabled,
            is_accounts_switcher_on,
            is_eu,
            is_eu_country,
            is_fully_authenticated,
            is_loading,
            is_logged_in,
            is_logging_in,
            is_mt5_allowed,
            is_pending_authentication,
            is_virtual,
            landing_companies,
            has_malta_account,
            has_maltainvest_account,
            has_mt5_account,
            has_mt5_real_account_error,
            has_mt5_demo_account_error,
            mt5_disabled_signup_types,
            has_real_account,
            NotificationMessages,
            openAccountNeededModal,
            residence,
            residence_list,
            standpoint,
            toggleAccountsDialog,
            toggleShouldShowRealAccountsList,
            can_have_more_real_synthetic_mt5,
            upgradeable_landing_companies,
        } = this.props;
        const should_show_missing_real_account =
            !is_eu && is_logged_in && !has_real_account && upgradeable_landing_companies?.length > 0;
        if ((!country && is_logged_in) || is_logging_in) return <Loading />; // Wait for country name to be loaded before rendering

        const has_mt5_account_error = this.state.is_demo_tab ? has_mt5_demo_account_error : has_mt5_real_account_error;

        return (
            <React.Fragment>
                {is_mt5_allowed || !is_logged_in ? (
                    <div className='mt5-dashboard__container'>
                        <NotificationMessages />
                        <div className='mt5-dashboard'>
                            <div className='mt5-dashboard__welcome-message'>
                                <h1 className='mt5-dashboard__welcome-message--heading'>
                                    <Localize i18n_default_text='Welcome to Deriv MT5 (DMT5) dashboard' />
                                </h1>
                            </div>
                            {has_mt5_account_error && (
                                <div className='mt5-dashboard__accounts-error'>
                                    <Text
                                        as='p'
                                        className='mt5-dashboard__accounts-error-message'
                                        lineHeight='l'
                                        size='xxs'
                                        color='prominent'
                                        weight='normal'
                                        align='center'
                                    >
                                        <Localize i18n_default_text='Due to an issue on our server, some of your MT5 accounts are unavailable at the moment. Please bear with us and thank you for your patience.' />
                                    </Text>
                                </div>
                            )}
                            <div className='mt5-dashboard__accounts-display'>
                                <MT5PasswordManagerModal
                                    is_visible={this.state.password_manager.is_visible}
                                    selected_login={this.state.password_manager.selected_login}
                                    selected_account={this.state.password_manager.selected_account}
                                    selected_account_group={this.state.password_manager.selected_account_group}
                                    selected_account_type={this.state.password_manager.selected_account_type}
                                    selected_server={this.state.password_manager.selected_server}
                                    toggleModal={this.togglePasswordManagerModal}
                                />
                                <LoadTab
                                    active_index={this.state.active_index}
                                    top
                                    center
                                    is_loading={is_loading}
                                    is_logged_in={is_logged_in}
                                    loading_component={LoadingMT5RealAccountDisplay}
                                    onTabItemClick={this.updateActiveIndex}
                                    should_update_hash
                                >
                                    <div label={localize('Real account')} data-hash='real'>
                                        <React.Fragment>
                                            {should_show_missing_real_account && (
                                                <MissingRealAccount onClickSignup={beginRealSignupForMt5} />
                                            )}
                                            <MT5RealAccountDisplay
                                                is_accounts_switcher_on={is_accounts_switcher_on}
                                                is_eu={is_eu}
                                                is_eu_country={is_eu_country}
                                                is_logged_in={is_logged_in}
                                                has_maltainvest_account={has_maltainvest_account}
                                                has_malta_account={has_malta_account}
                                                has_mt5_account_error={mt5_disabled_signup_types.real}
                                                openAccountNeededModal={openAccountNeededModal}
                                                current_list={current_list}
                                                account_status={account_status}
                                                has_mt5_account={has_mt5_account}
                                                onSelectAccount={createMT5Account}
                                                account_settings={account_settings}
                                                landing_companies={landing_companies}
                                                is_pending_authentication={is_pending_authentication}
                                                is_fully_authenticated={is_fully_authenticated}
                                                is_virtual={is_virtual}
                                                openAccountTransfer={this.openAccountTransfer}
                                                openPasswordManager={this.togglePasswordManagerModal}
                                                openPasswordModal={this.openRealPasswordModal}
                                                isAccountOfTypeDisabled={isAccountOfTypeDisabled}
                                                has_real_account={has_real_account}
                                                standpoint={standpoint}
                                                toggleAccountsDialog={toggleAccountsDialog}
                                                toggleShouldShowRealAccountsList={toggleShouldShowRealAccountsList}
                                                can_have_more_real_synthetic_mt5={can_have_more_real_synthetic_mt5}
                                                residence={residence}
                                                residence_list={residence_list}
                                            />
                                        </React.Fragment>
                                    </div>
                                    <div label={localize('Demo account')} data-hash='demo'>
                                        <MT5DemoAccountDisplay
                                            is_eu={is_eu}
                                            is_logged_in={is_logged_in}
                                            has_maltainvest_account={has_maltainvest_account}
                                            has_mt5_account_error={mt5_disabled_signup_types.demo}
                                            openAccountNeededModal={openAccountNeededModal}
                                            standpoint={standpoint}
                                            is_loading={is_loading}
                                            has_mt5_account={has_mt5_account}
                                            current_list={current_list}
                                            onSelectAccount={createMT5Account}
                                            landing_companies={landing_companies}
                                            openAccountTransfer={this.openAccountTransfer}
                                            openPasswordManager={this.togglePasswordManagerModal}
                                            residence={residence}
                                        />
                                    </div>
                                </LoadTab>
                                {/* TODO: [mt5-redesign] replace tabs with radiogroup once card component is ready */}
                                {/* {!is_loading && ( */}
                                {/*    <RadioGroup */}
                                {/*        className='radio-group__save-type' */}
                                {/*        name='account_type' */}
                                {/*        items={[ */}
                                {/*            { */}
                                {/*                id: 'demo', */}
                                {/*                label: localize('Demo'), */}
                                {/*                value: 'demo', */}
                                {/*            }, */}
                                {/*            { */}
                                {/*                id: 'real', */}
                                {/*                label: localize('Real'), */}
                                {/*                value: 'real', */}
                                {/*            }, */}
                                {/*        ]} */}
                                {/*        selected={this.state.is_demo_tab ? 'demo' : 'real'} */}
                                {/*        onToggle={e => this.updateActiveIndex(e.target.value === 'demo' ? 0 : 1)} */}
                                {/*    /> */}
                                {/* )} */}
                                {/* {this.state.is_demo_tab ? ( */}
                                {/*    <MT5DemoAccountDisplay */}
                                {/*        is_eu={is_eu} */}
                                {/* TODO: remove eslint disable once this is uncommented */}
                                {/* eslint-disable-next-line max-len */}
                                {/*        is_logged_in={is_logged_in} */}
                                {/*        has_maltainvest_account={has_maltainvest_account} */}
                                {/*        openAccountNeededModal={openAccountNeededModal} */}
                                {/*        standpoint={standpoint} */}
                                {/*        is_loading={is_loading} */}
                                {/*        has_mt5_account={has_mt5_account} */}
                                {/*        current_list={current_list} */}
                                {/*        onSelectAccount={createMT5Account} */}
                                {/*        landing_companies={landing_companies} */}
                                {/*        openAccountTransfer={this.openAccountTransfer} */}
                                {/*        openPasswordManager={this.togglePasswordManagerModal} */}
                                {/*    /> */}
                                {/* ) : ( */}
                                {/*    <React.Fragment> */}
                                {/*        {should_show_missing_real_account && ( */}
                                {/*            <MissingRealAccount onClickSignup={beginRealSignupForMt5} /> */}
                                {/*        )} */}
                                {/*        <MT5RealAccountDisplay */}
                                {/*            is_eu={is_eu} */}
                                {/* TODO: remove eslint disable once this is uncommented */}
                                {/* eslint-disable-next-line max-len */}
                                {/*            is_eu_country={is_eu_country} */}
                                {/*            is_logged_in={is_logged_in} */}
                                {/*            has_maltainvest_account={has_maltainvest_account} */}
                                {/*            has_malta_account={has_malta_account} */}
                                {/*            openAccountNeededModal={openAccountNeededModal} */}
                                {/*            current_list={current_list} */}
                                {/*            account_status={account_status} */}
                                {/*            has_mt5_account={has_mt5_account} */}
                                {/*            onSelectAccount={createMT5Account} */}
                                {/*            account_settings={account_settings} */}
                                {/*            landing_companies={landing_companies} */}
                                {/*            is_pending_authentication={is_pending_authentication} */}
                                {/*            is_fully_authenticated={is_fully_authenticated} */}
                                {/*            openAccountTransfer={this.openAccountTransfer} */}
                                {/*            openPasswordManager={this.togglePasswordManagerModal} */}
                                {/*            openPasswordModal={this.openRealPasswordModal} */}
                                {/*            has_real_account={has_real_account} */}
                                {/*            standpoint={standpoint} */}
                                {/*        /> */}
                                {/*    </React.Fragment> */}
                                {/* )} */}
                                <CompareAccountsModal />
                                <div className='mt5-dashboard__maintenance'>
                                    <Icon
                                        icon='IcAlertWarning'
                                        size={isMobile() ? 28 : 16}
                                        className='mt5-dashboard__maintenance-icon'
                                    />
                                    <div className='mt5-dashboard__maintenance-text'>
                                        <Localize i18n_default_text='Server maintenance starting 01:00 GMT every Sunday. This process may take up to 2 hours to complete. Service may be disrupted during this time.' />
                                    </div>
                                </div>
                            </div>
                            <DesktopWrapper>
                                <MT5DashboardContainer />
                            </DesktopWrapper>
                            <MobileWrapper>
                                <div className='mt5-dashboard__download-center'>
                                    <h1 className='mt5-dashboard__download-center--heading'>
                                        <Localize i18n_default_text='Download the MT5 app' />
                                    </h1>
                                    <div className='mt5-dashboard__download-center-options--mobile'>
                                        <div className='mt5-dashboard__download-center-options--mobile-devices'>
                                            <Icon icon='IcMt5DeviceTablet' width={133} height={106} />
                                            <Icon icon='IcMt5DevicePhone' width={48} height={74} />
                                        </div>
                                        <div className='mt5-dashboard__download-center-options--mobile-links'>
                                            <a
                                                href={getPlatformMt5DownloadLink('android')}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                <Icon icon='IcInstallationGoogle' width={135} height={40} />
                                            </a>
                                            <a
                                                href={getPlatformMt5DownloadLink('ios')}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                <Icon icon='IcInstallationApple' width={135} height={40} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </MobileWrapper>
                            <Mt5TopUpDemoModal />
                            <MT5PasswordModal />
                            <MT5ServerErrorDialog />
                            <MT5AccountOpeningRealFinancialStpModal />
                            <Mt5FinancialStpPendingDialog />
                            <MT5ResetPasswordModal />
                        </div>
                    </div>
                ) : (
                    <PageError
                        buttonSize={'medium'}
                        header={
                            <Localize
                                i18n_default_text='DMT5 is not available in {{country}}'
                                values={{ country: account_settings.residence }}
                                components={[<br key={0} />]}
                            />
                        }
                        messages={[<Localize key={0} i18n_default_text='Please explore our other platforms.' />]}
                        redirect_urls={[routes.trade, routes.bot]}
                        redirect_labels={[
                            <Localize key={0} i18n_default_text='Explore DTrader' />,
                            <Localize key={1} i18n_default_text='Explore DBot' />,
                        ]}
                    />
                )}
            </React.Fragment>
        );
    }
}

export default withRouter(
    connect(({ client, modules, ui }) => ({
        beginRealSignupForMt5: modules.mt5.beginRealSignupForMt5,
        checkShouldOpenAccount: modules.mt5.checkShouldOpenAccount,
        country: client.account_settings.residence,
        client_email: client.email_address,
        createMT5Account: modules.mt5.createMT5Account,
        current_list: modules.mt5.current_list,
        landing_companies: client.landing_companies,
        isAccountOfTypeDisabled: client.isAccountOfTypeDisabled,
        is_logged_in: client.is_logged_in,
        is_logging_in: client.is_logging_in,
        is_eu: client.is_eu,
        is_eu_country: client.is_eu_country,
        is_virtual: client.is_virtual,
        is_mt5_allowed: client.is_mt5_allowed,
        mt5_disabled_signup_types: client.mt5_disabled_signup_types,
        has_maltainvest_account: client.has_maltainvest_account,
        has_malta_account: client.has_malta_account,
        can_upgrade_to: client.can_upgrade_to,
        account_settings: client.account_settings,
        disableMt5PasswordModal: modules.mt5.disableMt5PasswordModal,
        is_pending_authentication: client.is_pending_authentication,
        is_compare_accounts_visible: modules.mt5.is_compare_accounts_visible,
        is_fully_authenticated: client.is_fully_authenticated,
        openPasswordModal: modules.mt5.enableMt5PasswordModal,
        openAccountNeededModal: ui.openAccountNeededModal,
        is_loading: client.is_populating_mt5_account_list,
        residence: client.residence,
        residence_list: client.residence_list,
        has_mt5_account: modules.mt5.has_mt5_account,
        has_mt5_real_account_error: client.has_account_error_in_mt5_real_list,
        has_mt5_demo_account_error: client.has_account_error_in_mt5_demo_list,
        has_real_account: client.has_active_real_account,
        setAccountType: modules.mt5.setAccountType,
        setMt5PasswordResetModal: modules.mt5.setMt5PasswordResetModal,
        setCurrentAccount: modules.mt5.setCurrentAccount,
        standpoint: client.standpoint,
        toggleCompareAccounts: modules.mt5.toggleCompareAccountsModal,
        is_accounts_switcher_on: ui.is_accounts_switcher_on,
        openTopUpModal: ui.openTopUpModal,
        NotificationMessages: ui.notification_messages_ui,
        onMount: modules.mt5.onMount,
        onUnmount: modules.mt5.onUnmount,
        toggleAccountsDialog: ui.toggleAccountsDialog,
        toggleShouldShowRealAccountsList: ui.toggleShouldShowRealAccountsList,
        can_have_more_real_synthetic_mt5: client.can_have_more_real_synthetic_mt5,
        upgradeable_landing_companies: client.upgradeable_landing_companies,
    }))(MT5Dashboard)
);

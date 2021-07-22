import React from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { DesktopWrapper, Icon, MobileWrapper, Tabs, PageError, Loading, Text } from '@deriv/components';
import { isEmptyObject, isMobile, routes, getCFDPlatformLabel, CFD_PLATFORMS } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { ResetTradingPasswordModal } from '@deriv/account';
import { connect } from 'Stores/connect';
import LoadingCFDRealAccountDisplay from './loading-cfd-real-account-display.jsx';
import MissingRealAccount from './missing-real-account.jsx';
import MT5AccountOpeningRealFinancialStpModal from './mt5-account-opening-real-financial-stp-modal.jsx';
import CompareAccountsModal from './compare-accounts-modal.jsx';
import CFDDashboardContainer from './cfd-dashboard-container.jsx';
import CFDPasswordManagerModal from './cfd-password-manager-modal.jsx';
import CFDPasswordModal from './cfd-password-modal.jsx';
import CFDServerErrorDialog from './cfd-server-error-dialog.jsx';
import CFDTopUpDemoModal from './cfd-top-up-demo-modal.jsx';
import CFDResetPasswordModal from './cfd-reset-password-modal.jsx';
import { general_messages } from '../Constants/cfd-shared-strings';
import CFDFinancialStpPendingDialog from '../Components/cfd-financial-stp-pending-dialog.jsx';
import { CFDDemoAccountDisplay } from '../Components/cfd-demo-account-display.jsx';
import { CFDRealAccountDisplay } from '../Components/cfd-real-account-display.jsx';
import { getPlatformMt5DownloadLink, getPlatformDXTradeDownloadLink } from '../Helpers/constants';
import 'Sass/app/modules/mt5/cfd-dashboard.scss';

const LoadTab = ({ children, is_loading, loading_component, ...props }) => {
    const LoadingComponent = loading_component;
    if (is_loading) {
        return <LoadingComponent />;
    }

    return <Tabs {...props}>{children}</Tabs>;
};

class CFDDashboard extends React.Component {
    state = {
        is_real_enabled: this.props.platform === CFD_PLATFORMS.MT5,
        active_index: this.props.platform === CFD_PLATFORMS.MT5 ? 0 : 1,
        is_account_needed_modal_open: false,
        is_demo_tab: true,
        required_account: {},
        is_notification_loaded: false,
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

        this.props.setCFDPasswordResetModal(true);
    };

    getIndexToSet = () => {
        // TODO: remove this when real accounts are enabled for Deriv X
        if (!this.state.is_real_enabled) {
            return 1;
        }

        const hash = this.props.location.hash;
        if (hash) {
            return /demo/.test(this.props.location.hash) ? 1 : 0;
        }
        return undefined;
    };

    stopNotificationLoading = () => {
        this.setState({ is_notification_loaded: true });
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
            sessionStorage.setItem('cfd_transfer_to_login_id', data.login);
            this.props.disableCFDPasswordModal();
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
            createCFDAccount,
            current_list,
            dxtrade_accounts_list_error,
            isAccountOfTypeDisabled,
            is_accounts_switcher_on,
            is_dark_mode_on,
            is_eu,
            is_eu_country,
            is_fully_authenticated,
            is_loading,
            is_logged_in,
            is_logging_in,
            is_mt5_allowed,
            is_dxtrade_allowed,
            is_pending_authentication,
            is_virtual,
            landing_companies,
            has_malta_account,
            has_maltainvest_account,
            has_cfd_account,
            has_mt5_real_account_error,
            has_mt5_demo_account_error,
            has_dxtrade_account_error,
            mt5_disabled_signup_types,
            dxtrade_disabled_signup_types,
            has_real_account,
            NotificationMessages,
            platform,
            openAccountNeededModal,
            residence,
            residence_list,
            standpoint,
            toggleAccountsDialog,
            toggleShouldShowRealAccountsList,
            can_have_more_real_synthetic_mt5,
            upgradeable_landing_companies,
            is_reset_trading_password_modal_visible,
            toggleResetTradingPasswordModal,
            enableApp,
            disableApp,
            verification_code,
        } = this.props;

        const should_show_missing_real_account =
            !is_eu && is_logged_in && !has_real_account && upgradeable_landing_companies?.length > 0;
        if ((!country && is_logged_in) || is_logging_in) return <Loading />; // Wait for country name to be loaded before rendering

        const has_mt5_account_error = this.state.is_demo_tab ? has_mt5_demo_account_error : has_mt5_real_account_error;

        const has_cfd_account_error =
            platform === CFD_PLATFORMS.MT5
                ? has_mt5_account_error
                : has_dxtrade_account_error || dxtrade_accounts_list_error;

        if (is_logged_in && !landing_companies) return <Loading />;

        if (platform === CFD_PLATFORMS.DXTRADE && !is_dxtrade_allowed) return <Redirect to={routes.mt5} />;

        return (
            <React.Fragment>
                {is_mt5_allowed || platform === CFD_PLATFORMS.DXTRADE || !is_logged_in ? (
                    <div className='cfd-dashboard__container'>
                        <NotificationMessages
                            is_mt5
                            is_notification_loaded={this.state.is_notification_loaded}
                            stopNotificationLoading={this.stopNotificationLoading}
                        />
                        <div className='cfd-dashboard'>
                            <div className='cfd-dashboard__welcome-message'>
                                <h1 className='cfd-dashboard__welcome-message--heading'>
                                    {general_messages.getWelcomeHeader(is_logged_in, platform)}
                                </h1>
                            </div>
                            {has_cfd_account_error && (
                                <div className='cfd-dashboard__accounts-error'>
                                    <Text
                                        as='p'
                                        className='cfd-dashboard__accounts-error-message'
                                        lineHeight='l'
                                        size='xxs'
                                        color='prominent'
                                        weight='normal'
                                        align='center'
                                    >
                                        <Localize
                                            i18n_default_text='Due to an issue on our server, some of your {{platform}} accounts are unavailable at the moment. Please bear with us and thank you for your patience.'
                                            values={{
                                                platform: getCFDPlatformLabel(platform),
                                            }}
                                        />
                                    </Text>
                                </div>
                            )}
                            <div className='cfd-dashboard__accounts-display'>
                                <CFDPasswordManagerModal
                                    is_visible={this.state.password_manager.is_visible}
                                    platform={platform}
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
                                    loading_component={LoadingCFDRealAccountDisplay}
                                    onTabItemClick={this.updateActiveIndex}
                                    should_update_hash
                                >
                                    {platform === CFD_PLATFORMS.MT5 && (
                                        <div label={localize('Real account')} data-hash='real'>
                                            <React.Fragment>
                                                {should_show_missing_real_account && (
                                                    <MissingRealAccount
                                                        onClickSignup={beginRealSignupForMt5}
                                                        platform={platform}
                                                    />
                                                )}
                                                <CFDRealAccountDisplay
                                                    is_accounts_switcher_on={is_accounts_switcher_on}
                                                    is_eu={is_eu}
                                                    is_eu_country={is_eu_country}
                                                    is_logged_in={is_logged_in}
                                                    has_maltainvest_account={has_maltainvest_account}
                                                    has_malta_account={has_malta_account}
                                                    has_cfd_account_error={
                                                        platform === CFD_PLATFORMS.MT5
                                                            ? mt5_disabled_signup_types.real
                                                            : dxtrade_disabled_signup_types.real ||
                                                              !!dxtrade_accounts_list_error
                                                    }
                                                    openAccountNeededModal={openAccountNeededModal}
                                                    current_list={current_list}
                                                    account_status={account_status}
                                                    has_cfd_account={has_cfd_account}
                                                    onSelectAccount={createCFDAccount}
                                                    account_settings={account_settings}
                                                    landing_companies={landing_companies}
                                                    is_pending_authentication={is_pending_authentication}
                                                    is_fully_authenticated={is_fully_authenticated}
                                                    is_virtual={is_virtual}
                                                    openAccountTransfer={this.openAccountTransfer}
                                                    openPasswordManager={this.togglePasswordManagerModal}
                                                    openPasswordModal={this.openRealPasswordModal}
                                                    platform={platform}
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
                                    )}
                                    <div label={localize('Demo account')} data-hash='demo'>
                                        <CFDDemoAccountDisplay
                                            is_eu={is_eu}
                                            is_logged_in={is_logged_in}
                                            has_maltainvest_account={has_maltainvest_account}
                                            has_cfd_account_error={
                                                platform === CFD_PLATFORMS.MT5
                                                    ? mt5_disabled_signup_types.demo
                                                    : dxtrade_disabled_signup_types.demo ||
                                                      !!dxtrade_accounts_list_error
                                            }
                                            openAccountNeededModal={openAccountNeededModal}
                                            standpoint={standpoint}
                                            is_loading={is_loading}
                                            has_cfd_account={has_cfd_account}
                                            current_list={current_list}
                                            onSelectAccount={createCFDAccount}
                                            landing_companies={landing_companies}
                                            openAccountTransfer={this.openAccountTransfer}
                                            openPasswordManager={this.togglePasswordManagerModal}
                                            platform={platform}
                                            residence={residence}
                                        />
                                    </div>
                                </LoadTab>
                                <CompareAccountsModal platform={platform} />
                                <div className='cfd-dashboard__maintenance'>
                                    <Icon
                                        icon='IcAlertWarning'
                                        size={isMobile() ? 28 : 16}
                                        className='cfd-dashboard__maintenance-icon'
                                    />
                                    <div className='cfd-dashboard__maintenance-text'>
                                        {platform === CFD_PLATFORMS.DXTRADE && (
                                            <Localize i18n_default_text='Server maintenance starts at 06:00 GMT every Sunday and may last up to 2 hours. Service may be disrupted during this time.' />
                                        )}
                                        {platform === CFD_PLATFORMS.MT5 && (
                                            <Localize i18n_default_text='Server maintenance starting 01:00 GMT every Sunday. This process may take up to 2 hours to complete. Service may be disrupted during this time.' />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <DesktopWrapper>
                                <CFDDashboardContainer
                                    platform={platform}
                                    active_index={this.state.active_index}
                                    is_dark_mode_on={is_dark_mode_on}
                                />
                            </DesktopWrapper>
                            <MobileWrapper>
                                {/* <div className='cfd-dashboard__download-center'>
                                    If you have the app, launch it
                                    {platform === CFD_PLATFORMS.DXTRADE && (
                                        <React.Fragment>
                                            <div className='cfd-dashboard__download-center-options--mobile'>
                                                <Icon icon='IcDxtradeDeviceDesktop' width={128} height={83} />
                                                <Icon icon='IcDxtradeDeviceLaptop' width={81} height={54} />
                                            </div>
                                            <div className='cfd-dashboard__download-center-options--mobile'>
                                                <a
                                                    className='cfd-dashboard__dxtrade-download'
                                                    href={getDXTradeWebTerminalLink(
                                                        this.state.active_index === 0 ? 'real' : 'demo'
                                                    )}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                >
                                                    <Icon
                                                        className='cfd-dashboard__dxtrade-download--icon'
                                                        icon='IcBrandDxtrade'
                                                        width={32}
                                                        height={32}
                                                    />
                                                    <div className='cfd-dashboard__dxtrade-download-text'>
                                                        <Text
                                                            className='cfd-dashboard__dxtrade-download--title'
                                                            color='colored-background'
                                                            size='xxs'
                                                            weight='bold'
                                                        >
                                                            <Localize i18n_default_text='Web terminal' />
                                                        </Text>
                                                    </div>
                                                </a>
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div> */}
                                <div className='cfd-dashboard__download-center'>
                                    <h1 className='cfd-dashboard__download-center--heading'>
                                        {platform === CFD_PLATFORMS.MT5 && (
                                            <Localize i18n_default_text='Download the MT5 app' />
                                        )}
                                        {platform === CFD_PLATFORMS.DXTRADE && (
                                            <Localize i18n_default_text='Download the Deriv X app' />
                                        )}
                                    </h1>
                                    <div className='cfd-dashboard__download-center-options--mobile'>
                                        <div className='cfd-dashboard__download-center-options--mobile-devices'>
                                            {platform === CFD_PLATFORMS.MT5 && (
                                                <React.Fragment>
                                                    <Icon icon='IcMt5DeviceTablet' width={133} height={106} />
                                                    <Icon icon='IcMt5DevicePhone' width={48} height={74} />
                                                </React.Fragment>
                                            )}
                                            {platform === CFD_PLATFORMS.DXTRADE && (
                                                <React.Fragment>
                                                    <Icon icon='IcDxtradeDeviceTablet' width={133} height={106} />
                                                    <Icon icon='IcDxtradeDevicePhone' width={48} height={74} />
                                                </React.Fragment>
                                            )}
                                        </div>
                                        <div className='cfd-dashboard__download-center-options--mobile-links'>
                                            <a
                                                href={
                                                    platform === CFD_PLATFORMS.MT5
                                                        ? getPlatformMt5DownloadLink('android')
                                                        : getPlatformDXTradeDownloadLink('android')
                                                }
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                <Icon icon='IcInstallationGoogle' width={135} height={40} />
                                            </a>
                                            <a
                                                href={
                                                    platform === CFD_PLATFORMS.MT5
                                                        ? getPlatformMt5DownloadLink('ios')
                                                        : getPlatformDXTradeDownloadLink('ios')
                                                }
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                <Icon icon='IcInstallationApple' width={135} height={40} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </MobileWrapper>
                            <CFDTopUpDemoModal platform={platform} />
                            <CFDPasswordModal platform={platform} has_suspended_account={has_cfd_account_error} />
                            <CFDServerErrorDialog />
                            {platform === CFD_PLATFORMS.MT5 && (
                                <React.Fragment>
                                    <MT5AccountOpeningRealFinancialStpModal />
                                    <CFDFinancialStpPendingDialog />
                                </React.Fragment>
                            )}
                            <CFDResetPasswordModal platform={platform} />
                            <ResetTradingPasswordModal
                                platform={platform}
                                enableApp={enableApp}
                                disableApp={disableApp}
                                toggleResetTradingPasswordModal={toggleResetTradingPasswordModal}
                                is_visible={is_reset_trading_password_modal_visible}
                                is_loading={is_loading}
                                verification_code={verification_code}
                            />
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
        beginRealSignupForMt5: modules.cfd.beginRealSignupForMt5,
        checkShouldOpenAccount: modules.cfd.checkShouldOpenAccount,
        country: client.account_settings.residence,
        client_email: client.email_address,
        createCFDAccount: modules.cfd.createCFDAccount,
        current_list: modules.cfd.current_list,
        landing_companies: client.landing_companies,
        isAccountOfTypeDisabled: client.isAccountOfTypeDisabled,
        is_logged_in: client.is_logged_in,
        is_logging_in: client.is_logging_in,
        is_eu: client.is_eu,
        is_eu_country: client.is_eu_country,
        is_virtual: client.is_virtual,
        is_mt5_allowed: client.is_mt5_allowed,
        is_dxtrade_allowed: client.is_dxtrade_allowed,
        mt5_disabled_signup_types: client.mt5_disabled_signup_types,
        dxtrade_disabled_signup_types: client.dxtrade_disabled_signup_types,
        has_maltainvest_account: client.has_maltainvest_account,
        has_malta_account: client.has_malta_account,
        can_upgrade_to: client.can_upgrade_to,
        account_settings: client.account_settings,
        disableCFDPasswordModal: modules.cfd.disableCFDPasswordModal,
        dxtrade_accounts_list_error: client.dxtrade_accounts_list_error,
        is_pending_authentication: client.is_pending_authentication,
        is_compare_accounts_visible: modules.cfd.is_compare_accounts_visible,
        is_fully_authenticated: client.is_fully_authenticated,
        openPasswordModal: modules.cfd.enableCFDPasswordModal,
        openAccountNeededModal: ui.openAccountNeededModal,
        is_loading: client.is_populating_mt5_account_list,
        residence: client.residence,
        residence_list: client.residence_list,
        has_cfd_account: modules.cfd.has_cfd_account,
        has_mt5_real_account_error: client.has_account_error_in_mt5_real_list,
        has_mt5_demo_account_error: client.has_account_error_in_mt5_demo_list,
        has_dxtrade_account_error: client.has_account_error_in_dxtrade_list,
        has_real_account: client.has_active_real_account,
        setAccountType: modules.cfd.setAccountType,
        setCFDPasswordResetModal: modules.cfd.setCFDPasswordResetModal,
        setCurrentAccount: modules.cfd.setCurrentAccount,
        standpoint: client.standpoint,
        toggleCompareAccounts: modules.cfd.toggleCompareAccountsModal,
        is_accounts_switcher_on: ui.is_accounts_switcher_on,
        openTopUpModal: ui.openTopUpModal,
        NotificationMessages: ui.notification_messages_ui,
        onMount: modules.cfd.onMount,
        onUnmount: modules.cfd.onUnmount,
        toggleAccountsDialog: ui.toggleAccountsDialog,
        toggleShouldShowRealAccountsList: ui.toggleShouldShowRealAccountsList,
        can_have_more_real_synthetic_mt5: client.can_have_more_real_synthetic_mt5,
        upgradeable_landing_companies: client.upgradeable_landing_companies,
        is_dark_mode_on: ui.is_dark_mode_on,
        disableApp: ui.disableApp,
        enableApp: ui.enableApp,
        is_reset_trading_password_modal_visible: ui.is_reset_trading_password_modal_visible,
        toggleResetTradingPasswordModal: ui.setResetTradingPasswordModalOpen,
        verification_code: client.verification_code.trading_platform_password_reset,
    }))(CFDDashboard)
);

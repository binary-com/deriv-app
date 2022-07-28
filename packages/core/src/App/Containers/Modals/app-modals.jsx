import React from 'react';
import { useLocation } from 'react-router-dom';
import { moduleLoader } from '@deriv/shared';
import { connect } from 'Stores/connect';
import MT5AccountNeededModal from 'App/Components/Elements/Modals/mt5-account-needed-modal.jsx';
import RedirectNoticeModal from 'App/Components/Elements/Modals/RedirectNotice';
import CooldownWarningModal from './cooldown-warning-modal.jsx';
import TradingAssessmentExistingUser from './trading-assessment-existing-user.jsx';
import CompletedAssessmentModal from './completed-assessment-modal.jsx';

const AccountSignupModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "account-signup-modal" */ '../AccountSignupModal'))
);
const CloseMxMltAccountModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "close-mx-mlt-account-modal" */ '../CloseMxMltAccountModal'))
);
const ResetOrUnlinkPasswordModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "reset-or-unlink-password-modal" */ '../ResetOrUnlinkPasswordModal'))
);
const RedirectToLoginModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "reset-password-modal" */ '../RedirectToLoginModal'))
);
const SetResidenceModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "set-residence-modal"  */ '../SetResidenceModal'))
);
const RealityCheckModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "reality-check-modal"  */ '../RealityCheckModal'))
);
const WelcomeModal = React.lazy(() =>
    moduleLoader(() => import(/* webpackChunkName: "welcome-modal"  */ '../WelcomeModal'))
);
const ResetEmailModal = React.lazy(() => import(/* webpackChunkName: "reset-email-modal"  */ '../ResetEmailModal'));

const UpdateEmailModal = React.lazy(() => import(/* webpackChunkName: "update-email-modal"  */ '../UpdateEmailModal'));

const CloseUKAccountModal = React.lazy(() =>
    import(/* webpackChunkName: "close-mx-mlt-account-modal" */ '../CloseUKAccountModal')
);
const AppModals = ({
    is_account_needed_modal_on,
    is_welcome_modal_visible,
    is_reality_check_visible,
    is_set_residence_modal_visible,
    is_close_mx_mlt_account_modal_visible,
    is_close_uk_account_modal_visible,
    is_eu,
    is_logged_in,
    should_show_cooldown_warning_modal,
    should_show_assessment_complete_modal,
    is_trading_assessment_for_new_user_enabled,
    fetchFinancialAssessment,
    setCFDScore,
    cfd_score,
    active_account_landing_company,
}) => {
    const url_params = new URLSearchParams(useLocation().search);
    const url_action_param = url_params.get('action');

    React.useEffect(() => {
        const fetchFinancialScore = async () => {
            try {
                const response = await fetchFinancialAssessment();
                setCFDScore(response?.cfd_score ?? 0);
            } catch (err) {}
        };
        if (is_logged_in) {
            fetchFinancialScore();
        }
    }, [is_logged_in]);

    let ComponentToLoad = null;
    switch (url_action_param) {
        case 'redirect_to_login':
            ComponentToLoad = <RedirectToLoginModal />;
            break;
        case 'reset_password':
            ComponentToLoad = <ResetOrUnlinkPasswordModal />;
            break;
        case 'signup':
            ComponentToLoad = <AccountSignupModal />;
            break;
        case 'request_email':
            ComponentToLoad = <ResetEmailModal />;
            break;
        case 'system_email_change':
            ComponentToLoad = <UpdateEmailModal />;
            break;
        default:
            if (is_set_residence_modal_visible) {
                ComponentToLoad = <SetResidenceModal />;
            }
            break;
    }
    if (is_close_mx_mlt_account_modal_visible) {
        ComponentToLoad = <CloseMxMltAccountModal />;
    }
    if (is_close_uk_account_modal_visible) {
        ComponentToLoad = <CloseUKAccountModal />;
    }

    if (is_welcome_modal_visible) {
        ComponentToLoad = <WelcomeModal />;
    }

    if (is_account_needed_modal_on) {
        ComponentToLoad = <MT5AccountNeededModal />;
    }

    if (is_reality_check_visible) {
        ComponentToLoad = <RealityCheckModal />;
    }

    if (
        is_logged_in &&
        active_account_landing_company === 'maltainvest' &&
        !is_trading_assessment_for_new_user_enabled &&
        cfd_score === 0
    ) {
        ComponentToLoad = <TradingAssessmentExistingUser />;
    }

    if (should_show_cooldown_warning_modal) {
        ComponentToLoad = <CooldownWarningModal />;
    }

    if (should_show_assessment_complete_modal) {
        ComponentToLoad = <CompletedAssessmentModal />;
    }

    return (
        <>
            <RedirectNoticeModal is_logged_in={is_logged_in} is_eu={is_eu} portal_id='popup_root' />
            {ComponentToLoad ? <React.Suspense fallback={<div />}>{ComponentToLoad}</React.Suspense> : null}
        </>
    );
};

export default connect(({ client, ui }) => ({
    is_welcome_modal_visible: ui.is_welcome_modal_visible,
    is_account_needed_modal_on: ui.is_account_needed_modal_on,
    is_close_mx_mlt_account_modal_visible: ui.is_close_mx_mlt_account_modal_visible,
    is_close_uk_account_modal_visible: ui.is_close_uk_account_modal_visible,
    is_set_residence_modal_visible: ui.is_set_residence_modal_visible,
    is_real_acc_signup_on: ui.is_real_acc_signup_on,
    is_eu: client.is_eu,
    is_logged_in: client.is_logged_in,
    is_reality_check_visible: client.is_reality_check_visible,
    has_maltainvest_account: client.has_maltainvest_account,
    fetchFinancialAssessment: client.fetchFinancialAssessment,
    setCFDScore: client.setCFDScore,
    cfd_score: client.cfd_score,
    setShouldShowVerifiedAccount: ui.setShouldShowVerifiedAccount,
    should_show_cooldown_warning_modal: ui.should_show_cooldown_warning_modal,
    should_show_assessment_complete_modal: ui.should_show_assessment_complete_modal,
    is_trading_assessment_for_new_user_enabled: ui.is_trading_assessment_for_new_user_enabled,
    active_account_landing_company: client.active_account_landing_company,
}))(AppModals);

import React from 'react';
import { isBot, isMT5 } from '@deriv/shared/utils/platform';
import { urlFor } from '@deriv/shared/utils/url';
import DenialOfServiceModal from 'App/Components/Elements/Modals/DenialOfServiceModal';
import { connect } from 'Stores/connect';

const AccountSignupModal = React.lazy(() =>
    import(/* webpackChunkName: "account-signup-modal" */ '../AccountSignupModal')
);
const ResetPasswordModal = React.lazy(() =>
    import(/* webpackChunkName: "reset-password-modal" */ '../ResetPasswordModal')
);
const SetResidenceModal = React.lazy(() =>
    import(/* webpackChunkName: "set-residence-modal"  */ '../SetResidenceModal')
);

const AppModals = ({
    is_denial_of_service_modal_visible,
    is_set_residence_modal_visible,
    url_action_param,
    switchAccount,
    virtual_account_loginid,
}) => {
    let ComponentToLoad = null;
    switch (url_action_param) {
        case 'reset_password':
            ComponentToLoad = <ResetPasswordModal />;
            break;
        case 'signup':
            ComponentToLoad = <AccountSignupModal />;
            break;
        default:
            if (is_denial_of_service_modal_visible) {
                const denialOfServiceOnCancel = () => {
                    const trade_link = isMT5() ? 'user/metatrader' : 'trading';
                    const link_to = isBot() ? 'bot' : trade_link;
                    window.open(urlFor(link_to, { legacy: true }));
                };

                const denialOfServiceOnConfirm = async () => {
                    await switchAccount(virtual_account_loginid);
                };

                ComponentToLoad = (
                    <DenialOfServiceModal
                        onConfirm={denialOfServiceOnConfirm}
                        onCancel={denialOfServiceOnCancel}
                        is_visible={is_denial_of_service_modal_visible}
                    />
                );
            } else if (is_set_residence_modal_visible) {
                ComponentToLoad = <SetResidenceModal />;
            }
            break;
    }

    return ComponentToLoad ? <React.Suspense fallback={<div />}>{ComponentToLoad}</React.Suspense> : null;
};

export default connect(({ client, ui }) => ({
    is_set_residence_modal_visible: ui.is_set_residence_modal_visible,
    is_denial_of_service_modal_visible: !client.is_client_allowed_to_visit,
    switchAccount: client.switchAccount,
    virtual_account_loginid: client.virtual_account_loginid,
}))(AppModals);

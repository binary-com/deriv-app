import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { connect } from 'Stores/connect';
import ResetTradingPasswordModal from '../Components/reset-trading-password-modal';

const ResetTradingPassword = ({
    enableApp,
    disableApp,
    toggleResetTradingPasswordModal,
    verification_code,
    is_visible,
    is_loading,
}) => {
    const location = useLocation();
    const query_params = new URLSearchParams(location.search);
    const [platform] = React.useState(query_params.get('platform'));

    return (
        <ResetTradingPasswordModal
            platform={platform}
            enableApp={enableApp}
            disableApp={disableApp}
            toggleResetTradingPasswordModal={toggleResetTradingPasswordModal}
            is_visible={is_visible}
            is_loading={is_loading}
            verification_code={verification_code}
        />
    );
};

ResetTradingPassword.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    toggleResetTradingPasswordModal: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ ui, client }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_loading: ui.is_loading,
    is_visible: ui.is_reset_trading_password_modal_visible,
    toggleResetTradingPasswordModal: ui.setResetTradingPasswordModalOpen,
    verification_code: client.verification_code.trading_platform_password_reset,
}))(ResetTradingPassword);

import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { connect } from 'Stores/connect';

const FormError = ({ disableApp, enableApp, setErrorMessage, error = {} }) => {
    const history = useHistory();
    const [is_visible, setIsVisible] = React.useState(false);
    const [details, setDetails] = React.useState({
        title: '',
        cancel_button_text: undefined,
        confirm_button_text: '',
        onConfirm: undefined,
        message: '',
    });

    React.useEffect(() => {
        // avoid resetting the text when dismissing the pop up
        if (error.message) {
            mapErrorToDetails(error.code, error.message);
        }
    }, [error.code]);

    React.useEffect(() => {
        setErrorVisibility(!!error.message);
    }, [error.message]);

    const mapErrorToDetails = (error_code, error_message) => {
        if (error_code === 'Fiat2CryptoTransferOverLimit') {
            setDetails({
                title: localize('Please verify your identity'),
                cancel_button_text: localize('Cancel'),
                confirm_button_text: localize('Verify identity'),
                onConfirm: () => history.push(routes.proof_of_identity),
                message: error_message,
            });
        } else {
            setDetails({
                title: localize('Cashier Error'),
                cancel_button_text: undefined,
                confirm_button_text: localize('OK'),
                onConfirm: undefined,
                message: error_message,
            });
        }
    };

    const setErrorVisibility = is_error_visible => {
        setIsVisible(is_error_visible);
    };

    const dismissError = () => {
        setErrorMessage('');
        setErrorVisibility(false);
    };

    return (
        <Dialog
            title={details.title}
            confirm_button_text={details.confirm_button_text}
            cancel_button_text={details.cancel_button_text}
            onConfirm={() => {
                if (typeof details.onConfirm === 'function') {
                    details.onConfirm();
                }
                dismissError();
            }}
            onCancel={details.cancel_button_text ? dismissError : undefined}
            disableApp={disableApp}
            enableApp={enableApp}
            is_visible={is_visible}
            portal_element_id='modal_root'
        >
            {/* to avoid the message disappearing before the pop-up */}
            {/* use details.message instead of error.message */}
            {/* since the setErrorVisibility hook gets called after error.message is removed */}
            {details.message}
        </Dialog>
    );
};

FormError.propTypes = {
    error: PropTypes.object,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    setErrorMessage: PropTypes.func,
};

export default connect(({ modules, ui }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    setErrorMessage: modules.cashier.general.setErrorMessage,
}))(FormError);

import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { PageErrorContainer } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';

const ErrorComponent = ({
    header,
    message,
    redirect_label,
    redirectOnClick = null,
    should_clear_error_on_click,
    setError,
    redirect_to = routes.traders_hub,
    should_show_refresh = true,
    should_redirect = true,
}) => {
    const history = useHistory();

    React.useEffect(() => {
        if (!history) return undefined;
        return history.listen(() => {
            if (typeof setError === 'function') {
                setError(false, null);
            }
        });
    }, [history, setError]);

    const refresh_message = should_show_refresh ? localize('Please refresh this page to continue.') : '';

    return (
        <PageErrorContainer
            error_header={header ?? ''}
            error_messages={message ? [message, refresh_message] : []}
            redirect_urls={[redirect_to]}
            redirect_labels={(redirect_label === false && []) || [redirect_label || localize('Refresh')]}
            buttonOnClick={redirectOnClick || (() => location.reload())}
            should_clear_error_on_click={should_clear_error_on_click}
            setError={setError}
            should_redirect={should_redirect}
        />
    );
};

ErrorComponent.propTypes = {
    header: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    redirectOnClick: PropTypes.func || PropTypes.object,
    redirect_label: PropTypes.string,
    setError: PropTypes.func,
    should_clear_error_on_click: PropTypes.bool,
    should_redirect: PropTypes.bool,
    redirect_to: PropTypes.string,
    should_show_refresh: PropTypes.bool,
};

export default ErrorComponent;

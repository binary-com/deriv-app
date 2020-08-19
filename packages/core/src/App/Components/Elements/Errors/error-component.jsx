import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { PageError } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';

const ErrorComponent = ({
    header,
    message,
    redirect_label,
    redirectOnClick,
    with_history,
    setError,
    where_to = routes.trade,
    should_show_refresh = true,
}) => {
    const history = useHistory();

    let buttonOnClick;
    if (with_history) {
        buttonOnClick = history.push;
    } else {
        buttonOnClick = redirectOnClick || (() => location.reload());
    }

    const refresh_message = should_show_refresh ? (
        <Localize i18n_default_text='Please refresh this page to continue.' />
    ) : (
        ''
    );

    return (
        <PageError
            header={header || <Localize i18n_default_text='Something’s not right' />}
            messages={
                message
                    ? [message, refresh_message]
                    : [
                          <Localize
                              key={0}
                              i18n_default_text='Sorry, an error occured while processing your request.'
                          />,
                          refresh_message,
                      ]
            }
            redirect_url={where_to}
            redirect_label={redirect_label || <Localize i18n_default_text='Refresh' />}
            buttonOnClick={buttonOnClick}
            with_history={with_history}
            setError={setError}
        />
    );
};

ErrorComponent.propTypes = {
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    type: PropTypes.string,
};

export default ErrorComponent;

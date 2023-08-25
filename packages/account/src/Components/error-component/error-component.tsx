import React from 'react';
import { PageError } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';

type TErrorComponent = {
    header: JSX.Element | string;
    message: JSX.Element | string;
    redirect_label: string;
    redirectOnClick: (() => void) | null;
    should_show_refresh: boolean;
};

const ErrorComponent = ({
    header,
    message,
    redirect_label,
    redirectOnClick,
    should_show_refresh = true,
}: Partial<TErrorComponent>) => {
    const refresh_message: string = should_show_refresh ? localize('Please refresh this page to continue.') : '';

    return (
        <PageError
            header={header || localize('Oops, something went wrong.')}
            messages={
                message
                    ? [message, refresh_message]
                    : [localize('Sorry, an error occurred while processing your request.'), refresh_message]
            }
            redirect_urls={[routes.trade]}
            redirect_labels={[redirect_label ?? localize('Refresh')]}
            buttonOnClick={redirectOnClick ?? (() => location.reload())}
        />
    );
};

export default ErrorComponent;

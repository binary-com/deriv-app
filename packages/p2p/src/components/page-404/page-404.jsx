import React from 'react';
import { PageError } from '@deriv-app/components';
import { routes, getUrlBase } from '@deriv-app/shared';
import { localize } from 'Components/i18next';

const Page404 = () => (
    <PageError
        header={localize('We couldn’t find that page')}
        messages={[
            localize('You may have followed a broken link, or the page has moved to a new address.'),
            localize('Error code: {{error_code}} page not found', { error_code: 404 }),
        ]}
        redirect_urls={[routes.p2p_buy_sell]}
        redirect_labels={[localize('Return to P2P')]}
        classNameImage='page-404__image'
        image_url={getUrlBase('/public/images/common/404.png')}
    />
);

export default Page404;

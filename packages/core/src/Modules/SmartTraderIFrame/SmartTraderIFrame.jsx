import React from 'react';
import { deriv_urls, getPlatformFromUrl } from '@deriv/shared';

const SmartTraderIFrame = () => {
    const { is_staging_deriv_app, is_localhost } = getPlatformFromUrl();

    let base_link = '';

    if (is_staging_deriv_app) {
        base_link = deriv_urls.SMARTTRADER_STAGING;
    } else if (is_localhost) {
        base_link = deriv_urls.SMARTTRADER_TESTLINK;
    } else {
        base_link = deriv_urls.SMARTTRADER_PRODUCTION;
    }

    return (
        <iframe
            id='localstorage-sync'
            src={`${base_link}/localstorage-sync.html`}
            style={{ display: 'none', visibility: 'hidden' }}
            sandbox='allow-same-origin allow-scripts'
        />
    );
};

export default SmartTraderIFrame;

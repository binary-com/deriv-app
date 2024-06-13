import React from 'react';
import { getUrlP2P } from '@deriv/shared';

const P2PIFrame = () => {
    const base_link = getUrlP2P();

    return (
        <iframe
            id='localstorage-sync__p2p'
            src={`${base_link}/localstorage-sync.html`}
            style={{ display: 'none', visibility: 'hidden' }}
            sandbox='allow-same-origin allow-scripts'
        />
    );
};

export default P2PIFrame;

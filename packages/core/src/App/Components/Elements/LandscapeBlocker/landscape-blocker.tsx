import React from 'react';
import { useLocation } from 'react-router-dom';
import { isDisabledLandscapeBlockerRoute } from '@deriv/shared';
import LandscapeBlockerSvg from 'Assets/SvgComponents/settings/landscape-blocker.svg';
import './landscape-blocker.scss';

const LandscapeBlocker = () => {
    const location = useLocation();
    const pathname = location?.pathname;
    const is_hidden_landscape_blocker = isDisabledLandscapeBlockerRoute(pathname);

    if (is_hidden_landscape_blocker) return null;

    return (
        <div id='landscape_blocker' className='landscape-blocker'>
            <div className='landscape-blocker__icon'>
                <LandscapeBlockerSvg />
            </div>
            <div className='landscape-blocker__message--landscape'>
                Please adjust your screen size for optimal viewing.
            </div>
            <div className='landscape-blocker__message--portrait'>
                Please adjust your <br />
                screen size for <br />
                optimal viewing.
            </div>
        </div>
    );
};

export default LandscapeBlocker;

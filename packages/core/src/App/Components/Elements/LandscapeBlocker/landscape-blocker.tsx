import React from 'react';
import { useLocation } from 'react-router-dom';
import { isDisabledLandscapeRoute } from '@deriv/shared';
import './landscape-blocker.scss';

const LandscapeBlocker = () => {
    const location = useLocation();
    const pathname = location?.pathname;
    const is_hidden_landscape_blocker = isDisabledLandscapeRoute(pathname);

    if (is_hidden_landscape_blocker) return null;

    return (
        <div id='landscape_blocker' className='landscape-blocker'>
            <div className='landscape-blocker__icon'>
                <svg xmlns='http://www.w3.org/2000/svg' width='80' height='62' fill='none'>
                    <path
                        fill='#85ACB0'
                        d='M52.308 62H9.23a9.204 9.204 0 0 1-6.524-2.727A9.345 9.345 0 0 1 0 52.7V9.3a9.344 9.344 0 0 1 2.707-6.573A9.205 9.205 0 0 1 9.23 0h61.538a9.204 9.204 0 0 1 6.524 2.727A9.345 9.345 0 0 1 80 9.3v24.8a3.104 3.104 0 0 1-1.538 2.685 3.058 3.058 0 0 1-3.077 0 3.104 3.104 0 0 1-1.539-2.685V9.3a3.117 3.117 0 0 0-.902-2.19 3.07 3.07 0 0 0-2.175-.91H9.231a3.07 3.07 0 0 0-2.175.91 3.116 3.116 0 0 0-.902 2.19v43.4c.001.822.325 1.61.902 2.19a3.07 3.07 0 0 0 2.175.91h43.077c1.1 0 2.115.59 2.664 1.55.55.959.55 2.14 0 3.1A3.073 3.073 0 0 1 52.308 62Z'
                    />
                    <path
                        fill='#FF444F'
                        d='M76.923 62H64.615c-1.1 0-2.115-.592-2.664-1.55a3.121 3.121 0 0 1 0-3.1 3.073 3.073 0 0 1 2.664-1.55h9.231v-9.3c0-1.109.587-2.132 1.539-2.686a3.058 3.058 0 0 1 3.076 0A3.104 3.104 0 0 1 80 46.5v12.4c0 .822-.324 1.611-.901 2.192a3.066 3.066 0 0 1-2.176.908ZM52.352 31.045h12.307c1.1 0 2.116.59 2.665 1.55.55.96.55 2.14 0 3.1a3.072 3.072 0 0 1-2.665 1.55h-9.23v9.3a3.104 3.104 0 0 1-1.539 2.685 3.058 3.058 0 0 1-3.077 0 3.104 3.104 0 0 1-1.538-2.685v-12.4c0-.822.324-1.61.9-2.192a3.066 3.066 0 0 1 2.177-.908Z'
                    />
                    <path
                        fill='#85ACB0'
                        d='M33.846 18.6H3.077c-1.1 0-2.115-.591-2.665-1.55-.55-.96-.55-2.141 0-3.1a3.073 3.073 0 0 1 2.665-1.55h30.77a3.07 3.07 0 0 0 2.174-.91 3.117 3.117 0 0 0 .902-2.19V3.1c0-1.108.587-2.131 1.539-2.685a3.058 3.058 0 0 1 3.076 0A3.104 3.104 0 0 1 43.078 3.1v6.2a9.344 9.344 0 0 1-2.707 6.573 9.205 9.205 0 0 1-6.524 2.727Z'
                    />
                    <path
                        fill='#FF444F'
                        d='M76.923 62a3.055 3.055 0 0 1-2.175-.909L54.66 40.852c-.755-.787-1.042-1.917-.755-2.973a3.092 3.092 0 0 1 2.154-2.17c1.048-.29 2.17 0 2.951.76l20.088 20.24a3.114 3.114 0 0 1 0 4.384 3.064 3.064 0 0 1-2.175.907Z'
                    />
                </svg>
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

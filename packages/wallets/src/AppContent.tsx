import React from 'react';
import { useFetch } from '@deriv/api';
import IcBrandingDerivEzDashboard from './assets/ic-branding-derivez-dashboard.svg';

const AppContent: React.FC = () => {
    const { data } = useFetch('time', { options: { refetchInterval: 1000 } });

    return (
        <div
            style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '100%',
                fontSize: 30,
            }}
        >
            <IcBrandingDerivEzDashboard width={50} height={50} />
            <h1>Server Time</h1>
            <br />
            <br />
            {data?.time && <h1>{new Date(data?.time * 1000).toLocaleString()}</h1>}
        </div>
    );
};

export default AppContent;

import React, { useEffect, useState } from 'react';
import { Loading } from '@deriv/components';
import { useDepositFiatAddress } from '@deriv/hooks';
import './deposit-fiat-iframe.scss';

const DepositFiatIframe: React.FC = () => {
    const { data, isSuccess } = useDepositFiatAddress();
    const [show_loader, setShowLoader] = useState(true);

    return (
        <React.Fragment>
            {show_loader && <Loading className='deposit-fiat-iframe__loader' is_fullscreen={false} />}
            {isSuccess && (
                <iframe
                    className='deposit-fiat-iframe__iframe'
                    onLoad={() => setShowLoader(false)}
                    src={data}
                    style={!show_loader ? { display: 'block' } : { display: 'none' }}
                />
            )}
        </React.Fragment>
    );
};

export default DepositFiatIframe;

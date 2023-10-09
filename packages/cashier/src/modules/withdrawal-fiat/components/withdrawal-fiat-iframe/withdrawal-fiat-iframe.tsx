import React, { useState, useEffect } from 'react';
import { Loading } from '@deriv/components';
import { useWithdrawalFiatAddress } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { ErrorState } from '../../../../components/error-state';
import './withdrawal-fiat-iframe.scss';

const WithdrawalFiatIframe = observer(() => {
    const { data: iframe_url, error, resetVerificationCode } = useWithdrawalFiatAddress();
    const [is_loading, setIsLoading] = useState(true);

    // Go back to withdrawal email verification page and reset the verification_code on switching tabs inside cashier
    useEffect(() => {
        return () => {
            if (!is_loading) {
                resetVerificationCode();
            }
        };
    }, []);

    // To show loading state when switching theme
    useEffect(() => {
        setIsLoading(true);
        if (iframe_url) resetVerificationCode();
    }, [iframe_url]);

    if (error) return <ErrorState error={error} />;

    return (
        <React.Fragment>
            {is_loading && <Loading is_fullscreen={false} />}
            {iframe_url && (
                <iframe
                    key={iframe_url}
                    className='withdrawal-fiat-iframe__iframe'
                    onLoad={() => setIsLoading(false)}
                    src={iframe_url}
                    style={{ display: is_loading ? 'none' : 'block' }}
                    data-testid='dt_withdrawal_fiat_iframe_iframe'
                />
            )}
        </React.Fragment>
    );
});

export default WithdrawalFiatIframe;

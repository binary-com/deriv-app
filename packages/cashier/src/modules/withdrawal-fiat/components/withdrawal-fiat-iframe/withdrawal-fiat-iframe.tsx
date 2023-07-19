import React from 'react';
import { Loading } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useWithdrawalFiatAddress } from '@deriv/hooks';
import ErrorStore from '../../../../stores/error-store';
import Error from '../../../../components/error';
import './withdrawal-fiat-iframe.scss';

const WithdrawalFiatIframe = observer(() => {
    const { data: iframe_url, error, isSuccess, resetVerificationCode } = useWithdrawalFiatAddress();
    const [is_loading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        return () => resetVerificationCode(); // redirects the user back to email verification page
    }, []);

    if (error) return <Error error={error as ErrorStore} />;

    return (
        <React.Fragment>
            {is_loading && <Loading className='withdrawal-fiat-loader' />}
            {isSuccess && (
                <iframe
                    className='withdrawal-fiat-iframe'
                    onLoad={() => setIsLoading(false)}
                    src={iframe_url}
                    style={{ display: is_loading ? 'none' : 'block' }}
                    data-testid='dt_withdrawal_fiat_iframe'
                />
            )}
        </React.Fragment>
    );
});

export default WithdrawalFiatIframe;

import React, { useEffect, useState } from 'react';
import { useAuthorize, useCashierFiatAddress } from '@deriv/api-v2';
import { Loader, WalletsErrorScreen } from '../../../../components';
import { isServerError } from '../../../../utils/utils';
import './DepositFiat.scss';

const DepositFiat = () => {
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { data: iframeUrl, error: depositError, isError, mutate } = useCashierFiatAddress();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthorizeSuccess) {
            mutate('deposit');
        }
    }, [isAuthorizeSuccess, mutate]);

    if (isError && isServerError(depositError.error))
        return <WalletsErrorScreen message={depositError.error.message} />;

    return (
        <React.Fragment>
            {isLoading && <Loader />}
            {iframeUrl && (
                <iframe
                    className='wallets-deposit-fiat__iframe'
                    data-testid='dt_deposit-fiat-iframe'
                    key={iframeUrl}
                    onLoad={() => setIsLoading(false)}
                    src={iframeUrl}
                    style={{ display: isLoading ? 'none' : 'block' }}
                />
            )}
        </React.Fragment>
    );
};

export default DepositFiat;

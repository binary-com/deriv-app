import React, { ButtonHTMLAttributes, useEffect, useState } from 'react';
import { useCashierFiatAddress } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { isServerError } from '../../../../utils/utils';
import { WithdrawalErrorScreen } from '../../screens';
import './WithdrawalFiat.scss';

interface WithdrawalFiatProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    verificationCode?: string;
}

const WithdrawalFiat: React.FC<WithdrawalFiatProps> = ({ verificationCode }) => {
    const { data: iframeUrl, error, isLoading: isWithdrawalFiatLoading, mutateAsync } = useCashierFiatAddress();
    const [isIframeLoading, setIsIframeLoading] = useState(true);
    const withdrawalFiatError = error?.error;

    useEffect(() => {
        if (verificationCode) {
            mutateAsync('withdraw', {
                verification_code: verificationCode,
            });
        }
    }, [mutateAsync, verificationCode]);

    if (isWithdrawalFiatLoading) return <Loader />;

    if (isServerError(withdrawalFiatError)) {
        return <WithdrawalErrorScreen error={withdrawalFiatError} />;
    }

    return (
        <React.Fragment>
            {isIframeLoading && <Loader />}
            {iframeUrl && (
                <iframe
                    className='wallets-withdrawal-fiat__iframe'
                    data-testid='dt_wallets_withdrawal_fiat_iframe'
                    key={iframeUrl}
                    onLoad={() => setIsIframeLoading(false)}
                    src={iframeUrl}
                    style={{ display: isIframeLoading ? 'none' : 'block' }}
                />
            )}
        </React.Fragment>
    );
};

export default WithdrawalFiat;

import React, { useEffect, useState } from 'react';
import { useActiveAccount, useCurrencyConfig } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { PageContainer } from '../../components';
import { WithdrawalCryptoModule, WithdrawalFiatModule, WithdrawalVerificationModule } from '../../lib';

const Withdrawal = () => {
    const { getConfig, isSuccess: isCurrencyConfigSuccess } = useCurrencyConfig();
    const { data: activeAccount } = useActiveAccount();
    const [verificationCode, setVerificationCode] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const verificationQueryParam = queryParams.get('verification');

        if (verificationQueryParam) {
            setVerificationCode(verificationQueryParam);

            const url = new URL(window.location.href);
            url.searchParams.delete('verification'); // Remove the 'verification_code' query parameter
            window.history.replaceState({}, document.title, url.toString());
        }
    }, []);

    if (verificationCode) {
        if (isCurrencyConfigSuccess && activeAccount?.currency) {
            if (getConfig(activeAccount?.currency)?.is_fiat) {
                return (
                    <PageContainer>
                        <WithdrawalFiatModule verificationCode={verificationCode} />
                    </PageContainer>
                );
            }
            return (
                <PageContainer>
                    <WithdrawalCryptoModule
                        setVerificationCode={setVerificationCode}
                        verificationCode={verificationCode}
                    />
                </PageContainer>
            );
        }
        return (
            <PageContainer>
                <Loader />
            </PageContainer>
        );
    }
    return (
        <PageContainer>
            <WithdrawalVerificationModule withdrawalType='payment_withdraw' />
        </PageContainer>
    );
};

export default Withdrawal;

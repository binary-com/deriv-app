import React, { useEffect, useState } from 'react';
import { useActiveWalletAccount, useAuthorize, useBalance } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { WithdrawalCryptoModule, WithdrawalFiatModule, WithdrawalVerificationModule } from '../../modules';
import { WithdrawalNoBalance } from '../../screens';

const WalletWithdrawal = () => {
    const { switchAccount } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: balanceData, isLoading, isRefetching, refetch } = useBalance();
    const [verificationCode, setVerificationCode] = useState('');
    const [resendEmail, setResendEmail] = useState(false);

    const isBalanceLoading = isLoading && !isRefetching;

    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const loginidQueryParam = queryParams.get('loginid');
        const verificationQueryParam = queryParams.get('verification');
        const localVerificationCode = localStorage.getItem('verification_code.payment_withdraw');

        // if loginid query param doesn't match active wallet's loginid on mount, initiate account switching
        if (loginidQueryParam && loginidQueryParam !== activeWallet?.loginid) {
            switchAccount(loginidQueryParam);
            return;
        }

        // for third party redirections where verification code is fetched from local storage value saved in client store
        if (localVerificationCode) {
            setVerificationCode(localVerificationCode);
            localStorage.removeItem('verification_code.payment_withdraw');
        }

        // given that loginid query param matches active wallet's loginid on mount, clear query params and proceed
        if (verificationQueryParam) {
            setVerificationCode(verificationQueryParam);

            const url = new URL(window.location.href);
            url.searchParams.delete('loginid');
            url.searchParams.delete('verification');
            window.history.replaceState({}, document.title, url.toString());
        }
    }, [activeWallet?.loginid, switchAccount]);

    const isCrypto = activeWallet?.currency_config?.is_crypto;

    if (!activeWallet || isBalanceLoading) {
        return <Loader />;
    }

    if (
        balanceData.accounts &&
        !isBalanceLoading &&
        balanceData.accounts[activeWallet?.loginid ?? 'USD'].balance <= 0
    ) {
        return <WithdrawalNoBalance activeWallet={activeWallet} />;
    }

    if (activeWallet?.currency && verificationCode && !isBalanceLoading) {
        return isCrypto ? (
            <WithdrawalCryptoModule
                setResendEmail={setResendEmail}
                setVerificationCode={setVerificationCode}
                verificationCode={verificationCode}
            />
        ) : (
            <WithdrawalFiatModule verificationCode={verificationCode} />
        );
    }

    return <WithdrawalVerificationModule resendEmail={resendEmail} />;
};

export default WalletWithdrawal;

import React, { useEffect, useState } from 'react';
import { useActiveWalletAccount, useAuthorize, useBalance } from '@deriv/api-v2';
import { Loader } from '../../../../components';
import { WithdrawalCryptoModule, WithdrawalFiatModule, WithdrawalVerificationModule } from '../../modules';
import { WithdrawalNoBalance } from '../../screens';

const WalletWithdrawal = () => {
    const { switchAccount } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: balanceData, isLoading, isRefetching: isBalanceRefetching, refetch } = useBalance();
    const [verificationCode, setVerificationCode] = useState('');
    const [resendEmail, setResendEmail] = useState(false);

    useEffect(() => {
        if (balanceData) refetch();
    }, [balanceData]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const loginidQueryParam = queryParams.get('loginid');
        const verificationQueryParam = queryParams.get('verification');

        // if loginid query param doesn't match active wallet's loginid on mount, initiate account switching
        if (loginidQueryParam && loginidQueryParam !== activeWallet?.loginid) {
            switchAccount(loginidQueryParam);
            return;
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

    if (isBalanceRefetching || isLoading || !activeWallet || !balanceData) return <Loader />;
    if (
        activeWallet.balance <= 0 ||
        (balanceData.accounts && balanceData.accounts[activeWallet?.loginid ?? 'USD'].balance <= 0)
    )
        return <WithdrawalNoBalance activeWallet={activeWallet} />;

    if (activeWallet?.currency && balanceData.balance && verificationCode) {
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

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useCreateOtherCFDAccount,
    useDxtradeAccountsList,
} from '@deriv/api-v2';
import { SentEmailContent, WalletError } from '../../../../components';
import { ModalStepWrapper, ModalWrapper } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import useSendPasswordResetEmail from '../../../../hooks/useSendPasswordResetEmail';
import { PlatformDetails } from '../../constants';
import { CreatePasswordModal } from '../CreatePasswordModal';
import { EnterPasswordModal } from '../EnterPasswordModal';
import { PasswordLimitExceededModal } from '../PasswordLimitExceededModal';
import { SuccessModal } from '../SuccessModal';
import './DxtradeEnterPasswordModal.scss';

const DxtradeEnterPasswordModal = () => {
    const history = useHistory();
    const { isMobile } = useDevice();
    const [password, setPassword] = useState('');
    const { data: getAccountStatus, isSuccess: accountStatusSuccess } = useAccountStatus();
    const {
        data: createdAccount,
        error,
        isLoading,
        isSuccess: isCreateAccountSuccessful,
        mutateAsync,
        status,
    } = useCreateOtherCFDAccount();
    const { data: dxtradeAccount, isSuccess: dxtradeAccountListSuccess } = useDxtradeAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const {
        error: resetPasswordError,
        isLoading: isResetPasswordLoading,
        isSuccess: isResetPasswordSuccessful,
        sendEmail,
    } = useSendPasswordResetEmail();
    const { hide, show } = useModal();
    const accountType = activeWallet?.is_virtual ? 'demo' : 'real';
    const dxtradePlatform = PlatformDetails.dxtrade.platform;

    const isDxtradePasswordNotSet = getAccountStatus?.is_dxtrade_password_not_set;

    const onSubmit = useCallback(async () => {
        await mutateAsync({
            payload: {
                account_type: accountType,
                market_type: 'all',
                password,
                platform: dxtradePlatform,
            },
        }).catch(() => setPassword(''));
    }, [mutateAsync, accountType, password, dxtradePlatform]);

    const dxtradeBalance = useMemo(() => {
        return dxtradeAccount?.find(account => account.market_type === 'all')?.display_balance;
    }, [dxtradeAccount]);

    const successDescription = useMemo(() => {
        return accountType === 'demo'
            ? `Let's practise trading with ${dxtradeBalance} virtual funds.`
            : `Transfer funds from your ${activeWallet?.currency} Wallet to your ${PlatformDetails.dxtrade.title} account to start trading.`;
    }, [accountType, activeWallet?.currency, dxtradeBalance]);

    useEffect(() => {
        if (!isResetPasswordSuccessful) return;
        if (!isDxtradePasswordNotSet && isMobile) {
            show(
                <ModalStepWrapper>
                    <SentEmailContent onErrorButtonClick={hide} platform={dxtradePlatform} />
                </ModalStepWrapper>
            );
        } else if (!isDxtradePasswordNotSet) {
            show(
                <ModalWrapper>
                    <SentEmailContent onErrorButtonClick={hide} platform={dxtradePlatform} />
                </ModalWrapper>
            );
        }
    }, [dxtradePlatform, hide, isDxtradePasswordNotSet, isMobile, isResetPasswordSuccessful, show]);

    if (status === 'error' && error?.error?.code === 'PasswordReset') {
        return (
            <PasswordLimitExceededModal
                onPrimaryClick={hide}
                onSecondaryClick={() => {
                    sendEmail({
                        platform: dxtradePlatform,
                    });
                }}
            />
        );
    }
    if (status === 'error' && error?.error?.code !== 'PasswordError') {
        return <WalletError errorMessage={error?.error.message} onClick={hide} title={error?.error?.code} />;
    }

    if (resetPasswordError) {
        return (
            <WalletError
                errorMessage={resetPasswordError?.error.message}
                onClick={hide}
                title={resetPasswordError?.error?.code}
            />
        );
    }

    if (!isCreateAccountSuccessful && accountStatusSuccess) {
        return isDxtradePasswordNotSet ? (
            <CreatePasswordModal
                isLoading={isLoading}
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={onSubmit}
                password={password}
                platform={dxtradePlatform}
            />
        ) : (
            <EnterPasswordModal
                isForgotPasswordLoading={isResetPasswordLoading}
                isLoading={isLoading}
                marketType='all'
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={onSubmit}
                onSecondaryClick={() => {
                    sendEmail({
                        platform: dxtradePlatform,
                    });
                }}
                password={password}
                passwordError={error?.error?.code === 'PasswordError'}
                platform={dxtradePlatform}
                setPassword={setPassword}
            />
        );
    }
    if (isCreateAccountSuccessful && dxtradeAccountListSuccess) {
        return (
            <SuccessModal
                description={successDescription}
                displayBalance={dxtradeBalance ?? ''}
                marketType='all'
                onPrimaryClick={() => {
                    hide();
                    history.push('/wallets/cashier/transfer', { toAccountLoginId: createdAccount?.account_id });
                }}
                onSecondaryClick={hide}
                platform={dxtradePlatform}
            />
        );
    }
    return null;
};

export default DxtradeEnterPasswordModal;

import React, { useCallback, useMemo, useState } from 'react';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useMT5AccountsList,
    useSettings,
    useTradingPlatformPasswordChange,
    useVerifyEmail,
} from '@deriv/api-v2';
import { SentEmailContent, WalletError, WalletSuccessResetMT5Password } from '../../../../components';
import { ModalStepWrapper, ModalWrapper, WalletButton } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { platformPasswordResetRedirectLink } from '../../../../utils/cfd';
import { validPassword, validPasswordMT5 } from '../../../../utils/password-validation';
import { CFD_PLATFORMS, PlatformDetails } from '../../constants';
import { CreatePassword, EnterPassword, MT5ResetPasswordModal } from '../../screens';
import MT5AccountAdded from '../MT5AccountAdded/MT5AccountAdded';
import { MT5PasswordModalFooter, SuccessModalFooter } from './MT5PasswordModalFooters';

type TProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
};

export type TPlatformPasswordChange = {
    currentPassword: string;
    newPassword: string;
};

const MT5PasswordModal: React.FC<TProps> = ({ marketType, platform }) => {
    const {
        data: createMT5AccountData,
        error: createMT5AccountError,
        isLoading: createMT5AccountLoading,
        isSuccess: createMT5AccountSuccess,
        mutate: createMT5AccountMutate,
        status: createMT5AccountStatus,
    } = useCreateMT5Account();
    const {
        error: tradingPasswordChangeError,
        isLoading: tradingPlatformPasswordChangeLoading,
        isSuccess: tradingPasswordChangeSuccess,
        mutateAsync: tradingPasswordChangeMutateAsync,
    } = useTradingPlatformPasswordChange();
    const { data: accountStatusData } = useAccountStatus();
    const { data: activeWalletData } = useActiveWalletAccount();
    const { data: availableMT5AccountsData } = useAvailableMT5Accounts();
    const {
        error: emailVerificationError,
        mutate: emailVerificationMutate,
        status: emailVerificationStatus,
    } = useVerifyEmail();
    const { data: mt5AccountsData } = useMT5AccountsList();
    const { isMobile } = useDevice();
    const { getModalState, hide, show } = useModal();
    const { data: settingsData } = useSettings();

    const { email } = settingsData;

    const [password, setPassword] = useState('');

    const isMT5PasswordNotSet = accountStatusData?.is_mt5_password_not_set;
    const hasMT5Account = mt5AccountsData?.find(account => account.login);
    const isDemo = activeWalletData?.is_virtual;
    const selectedJurisdiction = getModalState('selectedJurisdiction');
    const { platform: mt5Platform, title: mt5Title } = PlatformDetails.mt5;

    const updateMT5Password =
        createMT5AccountStatus === 'error' &&
        (createMT5AccountError?.error?.code === 'InvalidTradingPlatformPasswordFormat' ||
            createMT5AccountError?.error?.code === 'IncorrectMT5PasswordFormat');

    const onSubmit = useCallback(async () => {
        const accountType = marketType === 'synthetic' ? 'gaming' : marketType;
        const categoryAccountType = activeWalletData?.is_virtual ? 'demo' : accountType;

        // ====== Create MT5 Account ======
        // In order to create account, we need to set a password through trading_platform_password_change endpoint first,
        // then only mt5_create_account can be called, otherwise it will response an error for password required.
        // =================================

        if (isMT5PasswordNotSet) {
            await tradingPasswordChangeMutateAsync({
                new_password: password,
                platform: mt5Platform,
            });
        }

        createMT5AccountMutate({
            payload: {
                account_type: categoryAccountType,
                address: settingsData?.address_line_1 ?? '',
                city: settingsData?.address_city ?? '',
                company: selectedJurisdiction,
                country: settingsData?.country_code ?? '',
                email: settingsData?.email ?? '',
                leverage: availableMT5AccountsData?.find(acc => acc.market_type === marketType)?.leverage ?? 500,
                mainPassword: password,
                ...(marketType === 'financial' && { mt5_account_type: 'financial' }),
                ...(selectedJurisdiction &&
                    (selectedJurisdiction !== 'labuan'
                        ? {
                              account_type: categoryAccountType,
                              ...(selectedJurisdiction === 'financial' && { mt5_account_type: 'financial' }),
                          }
                        : {
                              account_type: 'financial',
                              mt5_account_type: 'financial_stp',
                          })),
                ...(marketType === 'all' && { sub_account_category: 'swap_free' }),
                name: settingsData?.first_name ?? '',
                phone: settingsData?.phone ?? '',
                state: settingsData?.address_state ?? '',
                zipCode: settingsData?.address_postcode ?? '',
            },
        });
    }, [
        activeWalletData?.is_virtual,
        availableMT5AccountsData,
        createMT5AccountMutate,
        isMT5PasswordNotSet,
        marketType,
        mt5Platform,
        password,
        selectedJurisdiction,
        settingsData?.address_city,
        settingsData?.address_line_1,
        settingsData?.address_postcode,
        settingsData?.address_state,
        settingsData?.country_code,
        settingsData?.email,
        settingsData?.first_name,
        settingsData?.phone,
        tradingPasswordChangeMutateAsync,
    ]);

    const sendEmailVerification = useCallback(() => {
        if (email) {
            emailVerificationMutate({
                type: 'trading_platform_mt5_password_reset',
                url_parameters: {
                    redirect_to: platformPasswordResetRedirectLink(CFD_PLATFORMS.MT5, activeWalletData?.is_virtual),
                },
                verify_email: email,
            });
        }
    }, [activeWalletData?.is_virtual, email, emailVerificationMutate]);

    const onSubmitPasswordChange = useCallback(
        ({ currentPassword, newPassword }: TPlatformPasswordChange) => {
            tradingPasswordChangeMutateAsync({
                new_password: newPassword,
                old_password: currentPassword,
                platform: mt5Platform,
            });
            setPassword(newPassword);
        },
        [mt5Platform, tradingPasswordChangeMutateAsync]
    );

    const renderTitle = useCallback(() => {
        const accountAction = hasMT5Account ? 'Add' : 'Create';
        const accountType = isDemo ? 'demo' : 'real';

        return updateMT5Password
            ? `${mt5Title} latest password requirements`
            : `${accountAction} a ${accountType} ${mt5Title} account`;
    }, [hasMT5Account, isDemo, mt5Title, updateMT5Password]);

    const renderFooter = useCallback(() => {
        if (createMT5AccountSuccess) return <SuccessModalFooter isDemo={isDemo} />;

        if (isMT5PasswordNotSet)
            return (
                <WalletButton
                    disabled={
                        !password ||
                        createMT5AccountLoading ||
                        tradingPlatformPasswordChangeLoading ||
                        !validPasswordMT5(password)
                    }
                    isFullWidth
                    isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                    onClick={onSubmit}
                    size='lg'
                >
                    Create {mt5Title} password
                </WalletButton>
            );

        return (
            <MT5PasswordModalFooter
                disabled={
                    !password ||
                    createMT5AccountLoading ||
                    tradingPlatformPasswordChangeLoading ||
                    !validPassword(password)
                }
                isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                onPrimaryClick={onSubmit}
                onSecondaryClick={() => sendEmailVerification()}
            />
        );
    }, [
        createMT5AccountLoading,
        createMT5AccountSuccess,
        isDemo,
        isMT5PasswordNotSet,
        mt5Title,
        onSubmit,
        password,
        sendEmailVerification,
        tradingPlatformPasswordChangeLoading,
    ]);

    const PasswordComponent = useMemo(() => {
        if (isMT5PasswordNotSet)
            return (
                <CreatePassword
                    isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    password={password}
                    platform={mt5Platform}
                />
            );

        if (updateMT5Password)
            return (
                <MT5ResetPasswordModal
                    formError={tradingPasswordChangeError}
                    isLoading={tradingPlatformPasswordChangeLoading}
                    onClickSubmitPasswordChange={onSubmitPasswordChange}
                    sendEmailVerification={() => sendEmailVerification()}
                />
            );

        return (
            <EnterPassword
                isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                marketType={marketType}
                modalTitle='Enter your Deriv MT5 password'
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={onSubmit}
                onSecondaryClick={() => sendEmailVerification()}
                password={password}
                passwordError={createMT5AccountError?.error?.code === 'PasswordError'}
                platform={mt5Platform}
                setPassword={setPassword}
            />
        );
    }, [
        createMT5AccountError?.error?.code,
        createMT5AccountLoading,
        isMT5PasswordNotSet,
        marketType,
        mt5Platform,
        onSubmit,
        onSubmitPasswordChange,
        password,
        sendEmailVerification,
        updateMT5Password,
        tradingPasswordChangeError,
        tradingPlatformPasswordChangeLoading,
    ]);

    if (emailVerificationStatus === 'error') {
        return (
            <WalletError
                errorMessage={emailVerificationError?.error?.message ?? ''}
                onClick={hide}
                title={emailVerificationError?.error?.code ?? 'Error'}
            />
        );
    }

    if (emailVerificationStatus === 'success') {
        return (
            <ModalWrapper isFullscreen={isMobile}>
                <SentEmailContent platform={CFD_PLATFORMS.MT5} />
            </ModalWrapper>
        );
    }

    if (tradingPasswordChangeSuccess) {
        return (
            <WalletSuccessResetMT5Password
                onClickSuccess={async () => {
                    await onSubmit();
                    show(
                        <MT5AccountAdded account={createMT5AccountData} marketType={marketType} platform={platform} />
                    );
                }}
                title={mt5Title}
            />
        );
    }

    if (createMT5AccountSuccess && !isMT5PasswordNotSet) {
        return <MT5AccountAdded account={createMT5AccountData} marketType={marketType} platform={platform} />;
    }

    if (
        createMT5AccountStatus === 'error' &&
        createMT5AccountError?.error?.code !== 'PasswordError' &&
        !updateMT5Password
    ) {
        return (
            <WalletError
                errorMessage={createMT5AccountError?.error.message}
                onClick={hide}
                title={createMT5AccountError?.error?.code}
            />
        );
    }

    if (isMobile) {
        return (
            <ModalStepWrapper renderFooter={!updateMT5Password ? renderFooter : undefined} title={renderTitle()}>
                {PasswordComponent}
            </ModalStepWrapper>
        );
    }

    return <ModalWrapper hideCloseButton={createMT5AccountSuccess}>{PasswordComponent}</ModalWrapper>;
};

export default MT5PasswordModal;

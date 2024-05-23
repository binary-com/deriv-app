import React, { ComponentProps, FC } from 'react';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components';
import useDevice from '../../../../hooks/useDevice';
import { PlatformDetails } from '../../constants';
import { EnterPassword } from '../../screens';

const EnterPasswordModal: FC<ComponentProps<typeof EnterPassword>> = ({
    isForgotPasswordLoading,
    isLoading,
    marketType,
    onPasswordChange,
    onPrimaryClick,
    onSecondaryClick,
    password,
    passwordError,
    platform,
    setPassword,
}) => {
    const { isMobile } = useDevice();

    const title = `Enter your ${PlatformDetails[platform].title} password`;

    if (isMobile) {
        return (
            <ModalStepWrapper
                renderFooter={() => {
                    return (
                        <WalletButtonGroup isFullWidth>
                            <WalletButton
                                isFullWidth
                                isLoading={isForgotPasswordLoading}
                                onClick={onSecondaryClick}
                                size={isMobile ? 'lg' : 'md'}
                                variant='outlined'
                            >
                                Forgot password?
                            </WalletButton>
                            <WalletButton
                                disabled={!password || isLoading}
                                isFullWidth
                                isLoading={isLoading}
                                onClick={onPrimaryClick}
                                size={isMobile ? 'lg' : 'md'}
                            >
                                Add account
                            </WalletButton>
                        </WalletButtonGroup>
                    );
                }}
                title={title}
            >
                <EnterPassword
                    isForgotPasswordLoading={isForgotPasswordLoading}
                    isLoading={isLoading}
                    marketType={marketType}
                    onPasswordChange={onPasswordChange}
                    onPrimaryClick={onPrimaryClick}
                    onSecondaryClick={onSecondaryClick}
                    password={password}
                    passwordError={passwordError}
                    platform={platform}
                    setPassword={setPassword}
                />
            </ModalStepWrapper>
        );
    }

    return (
        <ModalWrapper>
            <EnterPassword
                isForgotPasswordLoading={isForgotPasswordLoading}
                isLoading={isLoading}
                marketType={marketType}
                modalTitle={title}
                onPasswordChange={onPasswordChange}
                onPrimaryClick={onPrimaryClick}
                onSecondaryClick={onSecondaryClick}
                password={password}
                passwordError={passwordError}
                platform={platform}
                setPassword={setPassword}
            />
        </ModalWrapper>
    );
};

export default EnterPasswordModal;

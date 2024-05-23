import React, { FC, useCallback } from 'react';
import { Trans } from 'react-i18next';
import { DerivLightIcMt5PasswordUpdatedIcon, DerivLightMt5SuccessPasswordResetIcon } from '@deriv/quill-icons';
import useDevice from '../../hooks/useDevice';
import { ModalStepWrapper, WalletButton } from '../Base';
import { useModal } from '../ModalProvider';
import { WalletsActionScreen } from '../WalletsActionScreen';

type WalletSuccessResetMT5PasswordProps = {
    isInvestorPassword?: boolean;
    onClickSuccess?: () => void;
    title: string;
};

const WalletSuccessResetMT5Password: FC<WalletSuccessResetMT5PasswordProps> = ({
    isInvestorPassword = false,
    onClickSuccess,
    title,
}) => {
    const { hide } = useModal();
    const { isMobile } = useDevice();

    const handleSuccess = useCallback(() => {
        onClickSuccess?.();
        hide();
    }, [onClickSuccess, hide]);

    const renderButtons = useCallback(() => {
        return (
            <WalletButton isFullWidth={isMobile} onClick={handleSuccess} size='lg'>
                {isInvestorPassword ? <Trans defaults='Ok' /> : <Trans defaults='Done' />}
            </WalletButton>
        );
    }, [handleSuccess, isInvestorPassword, isMobile]);

    return (
        <ModalStepWrapper
            renderFooter={isMobile ? renderButtons : undefined}
            shouldHideFooter={!isMobile}
            title={isInvestorPassword ? `Reset ${title} password` : `Manage ${title} password`}
        >
            <div className='wallets-reset-mt5-password'>
                <WalletsActionScreen
                    description={
                        isInvestorPassword
                            ? 'Your investor password has been changed.'
                            : `You have a new ${title} password to log in to your ${title} accounts on the web and mobile apps.`
                    }
                    descriptionSize='sm'
                    icon={
                        isInvestorPassword ? (
                            <DerivLightIcMt5PasswordUpdatedIcon height={100} width={100} />
                        ) : (
                            <DerivLightMt5SuccessPasswordResetIcon height={100} width={100} />
                        )
                    }
                    renderButtons={isMobile ? undefined : renderButtons}
                    title={isInvestorPassword ? 'Password saved' : 'Success'}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletSuccessResetMT5Password;

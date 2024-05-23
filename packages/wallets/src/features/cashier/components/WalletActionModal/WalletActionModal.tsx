import React from 'react';
import { ModalWrapper, WalletButton, WalletText } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import './WalletActionModal.scss';

type TWalletActionModal = {
    actionButtonsOptions: {
        isPrimary?: boolean;
        onClick: VoidFunction;
        text: string;
    }[];
    description?: string;
    hideCloseButton?: React.ComponentProps<typeof ModalWrapper>['hideCloseButton'];
    title: string;
};

const WalletActionModal: React.FC<TWalletActionModal> = ({
    actionButtonsOptions,
    description,
    hideCloseButton = false,
    title,
}) => {
    const { isMobile } = useDevice();

    return (
        <ModalWrapper hideCloseButton={hideCloseButton}>
            <div className='wallets-action-modal'>
                <WalletText lineHeight={isMobile ? 'md' : 'xl'} weight='bold'>
                    {title}
                </WalletText>
                <WalletText lineHeight={isMobile ? 'sm' : 'lg'} size='sm'>
                    {description}
                </WalletText>
                {!!actionButtonsOptions.length && (
                    <div className='wallets-action-modal__buttons-container'>
                        {actionButtonsOptions.map(action => (
                            <WalletButton
                                key={action.text}
                                onClick={action.onClick}
                                size='lg'
                                variant={action.isPrimary ? 'contained' : 'outlined'}
                            >
                                {action.text}
                            </WalletButton>
                        ))}
                    </div>
                )}
            </div>
        </ModalWrapper>
    );
};

export default WalletActionModal;

import React from 'react';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { ModalWrapper } from '../../../../components/Base';
import './WalletActionModal.scss';

type TWalletActionModal = {
    actionButtonsOptions: {
        isPrimary?: boolean;
        onClick: VoidFunction;
        text: string;
    }[];
    description?: JSX.Element | string;
    hideCloseButton?: React.ComponentProps<typeof ModalWrapper>['hideCloseButton'];
    title: string;
};

const WalletActionModal: React.FC<TWalletActionModal> = ({
    actionButtonsOptions,
    description,
    hideCloseButton = false,
    title,
}) => {
    const { isDesktop } = useDevice();

    return (
        <ModalWrapper hideCloseButton={hideCloseButton}>
            <div className='wallets-action-modal'>
                <Text align='start' lineHeight={isDesktop ? 'xl' : 'md'} weight='bold'>
                    {title}
                </Text>
                <Text align='start' lineHeight={isDesktop ? 'lg' : 'sm'} size='sm'>
                    {description}
                </Text>
                {!!actionButtonsOptions.length && (
                    <div className='wallets-action-modal__buttons-container'>
                        {actionButtonsOptions.map(action => (
                            <Button
                                borderWidth='sm'
                                color={action.isPrimary ? 'primary' : 'black'}
                                key={action.text}
                                onClick={action.onClick}
                                size='lg'
                                textSize='md'
                                variant={action.isPrimary ? 'contained' : 'outlined'}
                            >
                                {action.text}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </ModalWrapper>
    );
};

export default WalletActionModal;

import React, { ComponentProps, FC } from 'react';
import { Localize } from '@deriv-com/translations';
import { Button, Text } from '@deriv-com/ui';
import { WalletDialog } from '../Base';
import './WalletDisabledAccountModal.scss';

type WalletDisabledAccountModalProps = ComponentProps<typeof WalletDialog> & {
    accountType: string;
};

const WalletDisabledAccountModal: FC<WalletDisabledAccountModalProps> = ({ accountType, isVisible, onClose }) => {
    return (
        <WalletDialog
            className='wallets-disabled-account-modal'
            isVisible={isVisible}
            onClose={onClose}
            shouldCloseOnOverlayClick
        >
            <WalletDialog.Header onClose={onClose}>
                <Localize i18n_default_text='{{accountType}} account disabled ' values={{ accountType }} />
            </WalletDialog.Header>
            <WalletDialog.Content>
                <Text align='start' size='sm'>
                    <Localize i18n_default_text='Contact us via live chat for more details.' />
                </Text>
            </WalletDialog.Content>
            <WalletDialog.Footer>
                <Button
                    color='primary'
                    onClick={() => {
                        window.LiveChatWidget.call('maximize');
                    }}
                >
                    <Localize i18n_default_text='Live chat' />
                </Button>
            </WalletDialog.Footer>
        </WalletDialog>
    );
};

export default WalletDisabledAccountModal;

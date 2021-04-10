import React from 'react';
import { Button, Modal, RealWalletCard, Text, Icon } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { getWalletLabels } from 'Constants/component-labels';

type TNewWalletModalProps = {
    onClose: () => void;
    onConfirm: () => void;
    is_open: boolean;
};

const NewWalletModal: React.FC<TNewWalletModalProps> = ({ onClose, onConfirm, is_open }: TNewWalletModalProps) => {
    return (
        <Modal className='new-wallet-dialog' is_open={is_open} small width={'284px'}>
            <Modal.Body>
                <div className='new-wallet-dialog__container'>
                    <div className='new-wallet-dialog__title'>
                        <Text weight='bold' size={isMobile() ? 'xsm' : 'm'} align='center'>
                            {localize('Your new wallet')}
                        </Text>
                    </div>
                    <div className='new-wallet-dialog__wallet'>
                        <RealWalletCard
                            amount={100}
                            currency='USD'
                            is_actions_footer
                            wallet_name='Credit/Debit USD Wallet'
                            width='216'
                            getWalletLabels={getWalletLabels}
                        />
                        <div className='new-wallet-dialog__success-icon new-wallet-dialog__success-icon-shadow' />
                        <Icon
                            className='new-wallet-dialog__success-icon'
                            icon='IcCheckmarkCircle'
                            custom_color='var(--status-success)'
                            size={40}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose} has_effect text={localize('Maybe later')} secondary large />
                <Button has_effect onClick={onConfirm} text={localize('Deposit now')} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default NewWalletModal;

import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Modal } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';

type TAccountVerificationRequiredModalProps = {
    is_visible: boolean;
    onConfirm: () => void;
};

const AccountVerificationRequiredModal = observer(
    ({ is_visible, onConfirm }: TAccountVerificationRequiredModalProps) => {
        const history = useHistory();
        const {
            ui: { is_mobile },
        } = useStore();
        return (
            <Modal
                is_open={is_visible}
                is_vertical_centered={is_mobile}
                className='account-verification-required-modal'
                toggleModal={onConfirm}
                title={localize('Account verification required')}
                width='440px'
                height={is_mobile ? 'auto' : '220px'}
            >
                <Modal.Body className='account-verification-required-modal-text'>
                    <Localize i18n_default_text='Please submit your proof of identity and proof of address to verify your account and continue trading.' />
                </Modal.Body>

                <div className='account-verification-required-modal-button'>
                    <Modal.Footer>
                        <Button
                            has_effect
                            text={localize('Submit Proof')}
                            onClick={() => history.push(routes.proof_of_identity)}
                            primary
                        />
                    </Modal.Footer>
                </div>
            </Modal>
        );
    }
);

export default AccountVerificationRequiredModal;

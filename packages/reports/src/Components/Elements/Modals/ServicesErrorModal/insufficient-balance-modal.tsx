import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Modal } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';

type TInsufficientBalanceModal = RouteComponentProps & {
    is_virtual?: boolean;
    is_visible: boolean;
    message: string;
    toggleModal: () => void;
};

const InsufficientBalanceModal = observer(
    ({ history, is_virtual, is_visible, message, toggleModal }: TInsufficientBalanceModal) => {
        const {
            ui: { is_mobile },
        } = useStore();
        return (
            <Modal
                id='dt_insufficient_balance_modal'
                is_open={is_visible}
                small
                is_vertical_centered={is_mobile}
                toggleModal={toggleModal}
                title={localize('Insufficient balance')}
            >
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={is_virtual ? localize('OK') : localize('Deposit now')}
                        onClick={() => {
                            if (!is_virtual) {
                                history?.push?.(routes.cashier_deposit);
                            } else {
                                toggleModal();
                            }
                        }}
                        primary
                    />
                </Modal.Footer>
            </Modal>
        );
    }
);

export default withRouter(InsufficientBalanceModal);

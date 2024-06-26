import React from 'react';
import { MobileDialog, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

type TestWarningModalProps = {
    show_risk_modal: boolean;
    body_content: JSX.Element;
    footer_content: JSX.Element;
};

const TestWarningModal = ({ show_risk_modal, body_content, footer_content }: TestWarningModalProps) => {
    const { isDesktop } = useDevice();
    return (
        <React.Fragment>
            {isDesktop ? (
                <Modal
                    width='44rem'
                    has_close_icon={false}
                    title={localize('Appropriateness Test Warning')}
                    is_open={show_risk_modal}
                >
                    <Modal.Body>{body_content}</Modal.Body>
                    <Modal.Footer>{footer_content}</Modal.Footer>
                </Modal>
            ) : (
                <MobileDialog
                    wrapper_classname='test-warning'
                    portal_element_id='modal_root'
                    visible={show_risk_modal}
                    title={localize('Appropriateness Test Warning')}
                    has_close_icon={false}
                >
                    <Modal.Body>{body_content}</Modal.Body>
                    <Modal.Footer>{footer_content}</Modal.Footer>
                </MobileDialog>
            )}
        </React.Fragment>
    );
};

export default TestWarningModal;

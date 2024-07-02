import PropTypes from 'prop-types';
import React from 'react';
import { Button, MobileFullPageModal, Modal, Text } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { localize, Localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import FormError from 'Components/section-error';
import OrderDetailsComplainModalRadioGroup from './order-details-complain-modal-radio-group.jsx';
import 'Components/order-details/order-details-complain-modal.scss';

const ComplainExplanation = () => (
    <div className='order-details-complain-modal__explanation'>
        <Text size='xxs'>
            <Localize i18n_default_text="If your complaint isn't listed here, please contact our Customer Support team." />
        </Text>
    </div>
);

const ComplainFooter = ({ dispute_reason, disputeOrderRequest, error_message, hideComplainOrderModal }) => (
    <React.Fragment>
        {error_message && <FormError message={error_message} />}
        <Button.Group>
            <Button secondary type='button' onClick={hideComplainOrderModal} large>
                <Localize i18n_default_text='Cancel' />
            </Button>
            <Button is_disabled={!dispute_reason} primary large onClick={disputeOrderRequest}>
                <Localize i18n_default_text='Submit' />
            </Button>
        </Button.Group>
    </React.Fragment>
);

const OrderDetailsComplainModal = ({
    id,
    is_buy_order_for_user,
    hideComplainOrderModal,
    should_show_complain_modal,
}) => {
    const { isDesktop } = useDevice();
    const isMounted = useIsMounted();
    const [dispute_reason, setDisputeReason] = React.useState('');
    const [error_message, setErrorMessage] = React.useState('');

    const disputeOrderRequest = () => {
        requestWS({
            p2p_order_dispute: 1,
            id,
            dispute_reason,
        }).then(response => {
            if (isMounted()) {
                if (response.error) {
                    setErrorMessage(response.error.message);
                }
                hideComplainOrderModal();
            }
        });
    };

    const onCheckboxChange = reason => setDisputeReason(reason);

    if (!isDesktop) {
        return (
            <MobileFullPageModal
                body_className='order-details-complain-modal__body'
                className='order-details-complain-modal'
                height_offset='80px'
                is_flex
                is_modal_open={should_show_complain_modal}
                page_header_className='order-details-complain-modal__header'
                page_header_text={localize('Complaint')}
                pageHeaderReturnFn={hideComplainOrderModal}
                renderPageFooterChildren={() => (
                    <ComplainFooter
                        dispute_reason={dispute_reason}
                        disputeOrderRequest={disputeOrderRequest}
                        error_message={error_message}
                        hideComplainOrderModal={hideComplainOrderModal}
                    />
                )}
                page_footer_className='order-details-complain-modal__footer'
            >
                <OrderDetailsComplainModalRadioGroup
                    is_buy_order_for_user={is_buy_order_for_user}
                    dispute_reason={dispute_reason}
                    onCheckboxChange={onCheckboxChange}
                />
                <ComplainExplanation />
            </MobileFullPageModal>
        );
    }

    return (
        <Modal
            className='order-details-complain-modal'
            is_open={should_show_complain_modal}
            toggleModal={hideComplainOrderModal}
            has_close_icon
            renderTitle={() => (
                <Text color='prominent' weight='bold'>
                    <Localize i18n_default_text="What's your complaint?" />
                </Text>
            )}
            width='440px'
            height='500px'
        >
            <Modal.Body className='order-details-complain-modal__body'>
                <OrderDetailsComplainModalRadioGroup
                    is_buy_order_for_user={is_buy_order_for_user}
                    dispute_reason={dispute_reason}
                    onCheckboxChange={onCheckboxChange}
                />
                <ComplainExplanation />
            </Modal.Body>
            <Modal.Footer>
                <div className='order-details-complain-modal__footer'>
                    <ComplainFooter
                        dispute_reason={dispute_reason}
                        disputeOrderRequest={disputeOrderRequest}
                        error_message={error_message}
                        hideComplainOrderModal={hideComplainOrderModal}
                    />
                </div>
            </Modal.Footer>
        </Modal>
    );
};

OrderDetailsComplainModal.propTypes = {
    dispute_reason: PropTypes.string,
    hideComplainOrderModal: PropTypes.func,
    id: PropTypes.string,
    is_buy_order_for_user: PropTypes.bool,
    onCheckboxChange: PropTypes.func,
    should_show_complain_modal: PropTypes.bool,
};

export default OrderDetailsComplainModal;

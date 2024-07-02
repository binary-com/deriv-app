import React, { Fragment, useEffect } from 'react';
import { Analytics } from '@deriv-com/analytics';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import { Modal, MobileDialog } from '@deriv/components';
import { SetupRealAccountOrGoToDemoModalContent } from './setup-real-account-or-go-to-demo-modal-content';
import './setup-real-account-or-go-to-demo-modal.scss';

const SetupRealAccountOrGoToDemoModal = observer(() => {
    const { isMobile } = useDevice();
    const { traders_hub } = useStore();
    const { is_setup_real_account_or_go_to_demo_modal_visible } = traders_hub;

    useEffect(() => {
        if (is_setup_real_account_or_go_to_demo_modal_visible) {
            Analytics.trackEvent('ce_tradershub_popup', {
                action: 'open',
                form_name: 'traders_hub_default',
                account_mode: 'demo',
                popup_name: 'setup_real_or_go_demo',
                popup_type: 'with_cta',
            });
        }
    }, [is_setup_real_account_or_go_to_demo_modal_visible]);

    return (
        <Fragment>
            {isMobile ? (
                <MobileDialog
                    portal_element_id='modal_root'
                    visible={is_setup_real_account_or_go_to_demo_modal_visible}
                    has_close_icon={false}
                    has_full_height
                    header_classname='setup-real-account-or-go-to-demo-modal__responsive-header'
                    wrapper_classname='setup-real-account-or-go-to-demo-modal__responsive-wrapper'
                >
                    <SetupRealAccountOrGoToDemoModalContent is_responsive />
                </MobileDialog>
            ) : (
                <Modal is_open={is_setup_real_account_or_go_to_demo_modal_visible} width='400px' has_close_icon={false}>
                    <SetupRealAccountOrGoToDemoModalContent />
                </Modal>
            )}
        </Fragment>
    );
});

export default SetupRealAccountOrGoToDemoModal;

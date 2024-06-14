import React from 'react';
import { DesktopWrapper, MobileDialog, MobileOrTabletWrapper, Modal, UILoader } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import VerificationModalContent from './verification-modal-content';

import './verification-modal.scss';
import { localize } from '@deriv/translations';

const VerificationModal = observer(() => {
    const { ui, client } = useStore();
    const { authentication_status } = client;
    const { is_verification_modal_visible, setIsVerificationModalVisible, setIsVerificationSubmitted } = ui;

    const should_show_poi = !['pending', 'verified'].includes(authentication_status.identity_status);
    const should_show_poa = !['pending', 'verified'].includes(authentication_status.document_status);

    let modal_title;

    if (should_show_poi && should_show_poa) {
        modal_title = localize('Submit your proof of identity and address');
    } else if (should_show_poi && !should_show_poa) {
        modal_title = localize('Submit your proof of identity');
    } else {
        modal_title = localize('Submit your proof of address');
    }

    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    className='verification-modal'
                    is_open={is_verification_modal_visible}
                    title={modal_title}
                    toggleModal={() => setIsVerificationModalVisible(false)}
                    height='70rem'
                    width='99.6rem'
                    exit_classname='verification-modal--custom-exit'
                >
                    <VerificationModalContent
                        onFinish={() => {
                            setIsVerificationModalVisible(false);
                            setIsVerificationSubmitted(true);
                        }}
                    />
                </Modal>
            </DesktopWrapper>
            <MobileOrTabletWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={modal_title}
                    wrapper_classname='verification-modal'
                    visible={is_verification_modal_visible}
                    onClose={() => setIsVerificationModalVisible(false)}
                >
                    <VerificationModalContent
                        onFinish={() => {
                            setIsVerificationModalVisible(false);
                            setIsVerificationSubmitted(true);
                        }}
                    />
                </MobileDialog>
            </MobileOrTabletWrapper>
        </React.Suspense>
    );
});

export default VerificationModal;

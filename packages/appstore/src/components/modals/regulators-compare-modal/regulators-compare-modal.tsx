import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { Modal, MobileDialog, UILoader } from '@deriv/components';
import RegulatorsCompareModalContent from './regulators-compare-modal-content';
import './regulators-compare-modal.scss';

const RegulatorsCompareModal = () => {
    const { isDesktop } = useDevice();
    const { traders_hub, ui } = useStore();
    const { is_regulators_compare_modal_visible, toggleRegulatorsCompareModal } = traders_hub;
    const { disableApp, enableApp } = ui;
    const closeModal = () => {
        toggleRegulatorsCompareModal();
    };

    return (
        <React.Suspense fallback={<UILoader />}>
            {isDesktop ? (
                <Modal
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_open={is_regulators_compare_modal_visible}
                    title={<Localize i18n_default_text='Non-EU and EU regulation' />}
                    toggleModal={closeModal}
                    height='792px'
                    width='792px'
                >
                    <RegulatorsCompareModalContent />
                </Modal>
            ) : (
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={<Localize i18n_default_text='Non-EU and EU regulation' />}
                    visible={is_regulators_compare_modal_visible}
                    onClose={closeModal}
                >
                    <RegulatorsCompareModalContent />
                </MobileDialog>
            )}
        </React.Suspense>
    );
};

export default observer(RegulatorsCompareModal);

import React from 'react';
import { Button, Modal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { isDesktop, CFD_PLATFORMS } from '@deriv/shared';

const CFDServerMaintenanceModal = observer(() => {
    const { modules, common } = useStore();
    const { cfd } = modules;
    const { platform } = common;

    const { setServerMaintenanceModal, is_server_maintenance_modal_visible } = cfd;

    const getMaintenanceTime = () => {
        switch (platform) {
            case CFD_PLATFORMS.DXTRADE:
                return '08:00 GMT';
            case CFD_PLATFORMS.CTRADER:
                return '10:00 GMT';
            case CFD_PLATFORMS.MT5:
            default:
                return '03:00 GMT';
        }
    };

    return (
        <Modal
            className='cfd-password-modal'
            is_open={is_server_maintenance_modal_visible}
            title={localize('Undergoing server maintenance')}
            toggleModal={() => setServerMaintenanceModal(false)}
            has_close_icon
            width={isDesktop() ? '440px' : '328px'}
        >
            <Modal.Body>
                <Localize
                    i18n_default_text={`We’re currently performing server maintenance, which may continue until <0>${getMaintenanceTime()}</0>. Please expect some disruptions during this time.`}
                    components={[<strong key={0} />]}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' onClick={() => setServerMaintenanceModal(false)} secondary medium>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CFDServerMaintenanceModal;

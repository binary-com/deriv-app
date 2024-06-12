import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { DerivGoModalResponsive } from './deriv-go-modal-responsive/deriv-go-modal-responsive';
import { DerivGoModalDesktop } from './deriv-go-modal-desktop/deriv-go-modal-desktop';
import './deriv-go-modal.scss';

const DerivGoModal = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    return is_mobile ? <DerivGoModalResponsive /> : <DerivGoModalDesktop />;
});

export default DerivGoModal;

import React from 'react';
import { getUrlSmartTrader } from '@deriv/shared';
import MarketUnavailableModal from '../Elements/Modals/MarketUnavailableModal';
import ServicesErrorModal from '../Elements/Modals/ServicesErrorModal';
import AccountVerificationPendingModal from '../Elements/Modals/AccountVerificationPendingModal';
import { observer, useStore } from '@deriv/stores';

const TradeModals = observer(() => {
    const { ui, client, common } = useStore();
    const { is_virtual, is_logged_in } = client;

    const { services_error } = common;
    const {
        is_mf_verification_pending_modal_visible,
        is_services_error_visible,
        setHasOnlyForwardingContracts,
        setIsMFVericationPendingModal,
        toggleServicesErrorModal,
    } = ui;
    const resetToPreviousMarket = () => {
        setHasOnlyForwardingContracts(false);
    };

    const marketUnavailableOnConfirm = () => {
        resetToPreviousMarket();
    };

    const marketUnavailableOnCancel = () => {
        window.open(getUrlSmartTrader());
        resetToPreviousMarket();
    };

    const servicesErrorModalOnConfirm = () => {
        toggleServicesErrorModal(false);
    };

    return (
        <React.Fragment>
            <MarketUnavailableModal onConfirm={marketUnavailableOnConfirm} onCancel={marketUnavailableOnCancel} />

            <ServicesErrorModal
                onConfirm={servicesErrorModalOnConfirm}
                services_error={services_error}
                is_visible={is_services_error_visible}
                is_virtual={is_virtual}
                is_logged_in={is_logged_in}
            />

            <AccountVerificationPendingModal
                is_visible={is_mf_verification_pending_modal_visible}
                onConfirm={() => setIsMFVericationPendingModal(false)}
            />
        </React.Fragment>
    );
});

export default TradeModals;

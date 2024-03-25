import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { useHistory } from 'react-router-dom';
import { localize, Localize } from '@deriv/translations';
import { Text, Dialog } from '@deriv/components';
import { isMobile, getAuthenticationStatusInfo, routes, Jurisdiction } from '@deriv/shared';
import './failed-verification-modal.scss';

type TFailedVerificationModal = {
    should_resubmit_poi: boolean;
    should_resubmit_poa: boolean;
    from_account: string;
    is_from_multipliers: boolean;
    has_mf_mt5_account: boolean;
};

const FailedVerificationModalContent = ({
    should_resubmit_poi,
    should_resubmit_poa,
    from_account,
    is_from_multipliers,
    has_mf_mt5_account,
}: TFailedVerificationModal) => {
    return (
        <React.Fragment>
            <Text size={isMobile() ? 'xxs' : 'xs'}>
                <Localize i18n_default_text='The following documents you submitted did not pass our checks:' />
            </Text>
            <div className='failed-verification-modal__failed_list'>
                {should_resubmit_poi && (
                    <Text
                        size={isMobile() ? 'xxs' : 'xs'}
                        line_height='xl'
                        className='failed-verification-modal__failed_list-item'
                    >
                        <Localize i18n_default_text='Proof of identity' />
                    </Text>
                )}
                {should_resubmit_poa && (
                    <Text
                        size={isMobile() ? 'xxs' : 'xs'}
                        line_height='xl'
                        className='failed-verification-modal__failed_list-item'
                    >
                        <Localize i18n_default_text='Proof of address.' />
                    </Text>
                )}
            </div>
            {!is_from_multipliers && has_mf_mt5_account ? (
                <Text size={isMobile() ? 'xxs' : 'xs'}>
                    <Localize i18n_default_text='To proceed, resubmit these documents' />
                </Text>
            ) : (
                <Text size={isMobile() ? 'xxs' : 'xs'}>
                    <Localize
                        i18n_default_text='If you’d like to get the {{from_account}} account, resubmit these documents.'
                        values={{ from_account }}
                    />
                </Text>
            )}
        </React.Fragment>
    );
};

const FailedVerificationModal = () => {
    const {
        traders_hub,
        ui,
        modules: { cfd },
        client,
    } = useStores();
    const {
        is_failed_verification_modal_visible,
        mt5_existing_account,
        toggleFailedVerificationModalVisibility,
        open_failed_verification_for,
        startTrade,
    } = traders_hub;
    const { account_status } = client;
    const { toggleCFDVerificationModal, current_list } = cfd;
    const { disableApp, enableApp, is_mt5_verification_failed_modal, setIsMT5VerificationFailedModal } = ui;
    const is_from_multipliers = open_failed_verification_for === 'multipliers';
    const has_mf_mt5_account = Object.keys(current_list)
        .map(key => current_list[key])
        .some(account => account.landing_company_short === Jurisdiction.MALTA_INVEST);

    const { poi_resubmit_for_maltainvest, poi_resubmit_for_bvi_labuan_vanuatu, need_poa_resubmission } =
        getAuthenticationStatusInfo(account_status);
    const history = useHistory();

    const closeModal = () => {
        setIsMT5VerificationFailedModal(false);
        if (is_mt5_verification_failed_modal) {
            toggleFailedVerificationModalVisibility();
            startTrade(mt5_existing_account.platform, mt5_existing_account);
            return;
        }
        toggleFailedVerificationModalVisibility();
    };

    const onConfirmModal = () => {
        setIsMT5VerificationFailedModal(false);
        toggleFailedVerificationModalVisibility();
        if (is_from_multipliers) {
            if (should_resubmit_poi()) {
                history.push(routes.proof_of_identity);
            } else {
                history.push(routes.proof_of_address);
            }
        } else {
            toggleCFDVerificationModal();
        }
    };

    const should_resubmit_poi = () => {
        if (is_from_multipliers || open_failed_verification_for === 'maltainvest') {
            return poi_resubmit_for_maltainvest;
        }
        return poi_resubmit_for_bvi_labuan_vanuatu;
    };
    const should_resubmit_poa = need_poa_resubmission;
    const from_account_label = is_from_multipliers ? localize('Multipliers') : localize('MT5');

    return (
        <Dialog
            title={localize('Why did my verification fail?')}
            confirm_button_text={localize('Resubmit documents')}
            cancel_button_text={localize('Maybe later')}
            is_closed_on_cancel
            disableApp={disableApp}
            enableApp={enableApp}
            is_closed_on_confirm
            is_visible={is_failed_verification_modal_visible}
            onCancel={closeModal}
            onConfirm={onConfirmModal}
            className='failed-verification-modal'
        >
            <FailedVerificationModalContent
                should_resubmit_poi={should_resubmit_poi()}
                should_resubmit_poa={should_resubmit_poa}
                from_account={from_account_label}
                is_from_multipliers={is_from_multipliers}
                has_mf_mt5_account={has_mf_mt5_account}
            />
        </Dialog>
    );
};

export default observer(FailedVerificationModal);

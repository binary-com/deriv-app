import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { PoiPoaDocsSubmitted } from '@deriv/account';
import { AccountStatusResponse } from '@deriv/api-types';
import { Button, Icon, Loading, MobileDialog, Modal, Text, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getAuthenticationStatusInfo, isMobileOrTablet, WS, isPOARequiredForMT5 } from '@deriv/shared';
import CFDFinancialStpRealAccountSignup from './cfd-financial-stp-real-account-signup';
import { observer, useStore } from '@deriv/stores';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';
import { JURISDICTION } from '../Helpers/cfd-config';

const SwitchToRealAccountMessage = ({ onClickOk }: { onClickOk: () => void }) => (
    <div className='da-icon-with-message'>
        <Icon icon={'IcPoaLock'} size={128} />
        <Text className='da-icon-with-message__text' as='p' size={isMobileOrTablet() ? 'xs' : 's'} weight='bold'>
            {localize('Switch to your real account to submit your documents')}
        </Text>
        <Button
            has_effect
            text={localize('Ok')}
            onClick={() => {
                onClickOk();
            }}
            className='da-icon-with-message__button'
            primary
        />
    </div>
);

const CFDDbviOnboarding = observer(() => {
    const { isDesktop } = useDevice();
    const { client, ui } = useStore();

    const { account_status, fetchAccountSettings, is_virtual, updateAccountStatus, updateMT5Status } = client;
    const { disableApp, enableApp } = ui;

    const {
        has_created_account_for_selected_jurisdiction,
        has_submitted_cfd_personal_details,
        is_cfd_verification_modal_visible,
        jurisdiction_selected_shortcode,
        enableCFDPasswordModal,
        toggleCFDVerificationModal,
    } = useCfdStore();

    const [showSubmittedModal, setShowSubmittedModal] = React.useState(true);
    const [is_loading, setIsLoading] = React.useState(false);

    const getAccountStatusFromAPI = () => {
        WS.authorized.getAccountStatus().then((response: AccountStatusResponse) => {
            const { get_account_status } = response;
            if (get_account_status?.authentication) {
                const { poi_acknowledged_for_maltainvest, poi_acknowledged_for_bvi_labuan_vanuatu, poa_acknowledged } =
                    getAuthenticationStatusInfo(get_account_status);
                if (jurisdiction_selected_shortcode === JURISDICTION.MALTA_INVEST) {
                    setShowSubmittedModal(poi_acknowledged_for_maltainvest && poa_acknowledged);
                } else {
                    /**
                     * Need to retrigger POA when user has not explicitly submitted Address proof docs
                     */
                    const is_poa_required_for_mt5 = isPOARequiredForMT5(
                        account_status,
                        jurisdiction_selected_shortcode
                    );
                    setShowSubmittedModal(
                        poi_acknowledged_for_bvi_labuan_vanuatu &&
                            has_submitted_cfd_personal_details &&
                            !is_poa_required_for_mt5
                    );
                }
            }

            setIsLoading(false);
        });
        setIsLoading(false);
    };

    React.useEffect(() => {
        if (is_cfd_verification_modal_visible) {
            setIsLoading(true);
            getAccountStatusFromAPI();
            fetchAccountSettings();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_cfd_verification_modal_visible]);

    const getModalContent = () => {
        if (is_loading) {
            return <Loading is_fullscreen={false} />;
        } else if (is_virtual) {
            return <SwitchToRealAccountMessage onClickOk={toggleCFDVerificationModal} />;
        }
        return showSubmittedModal ? (
            <PoiPoaDocsSubmitted
                onClickOK={toggleCFDVerificationModal}
                updateAccountStatus={updateAccountStatus}
                account_status={account_status}
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                has_created_account_for_selected_jurisdiction={has_created_account_for_selected_jurisdiction}
                openPasswordModal={enableCFDPasswordModal}
            />
        ) : (
            <CFDFinancialStpRealAccountSignup
                onFinish={() => {
                    updateMT5Status();
                    if (has_created_account_for_selected_jurisdiction) {
                        setShowSubmittedModal(true);
                    } else {
                        toggleCFDVerificationModal();
                        enableCFDPasswordModal();
                    }
                }}
            />
        );
    };

    const getModalTitle = () =>
        has_created_account_for_selected_jurisdiction
            ? localize('Submit your proof of identity and address')
            : localize('Add a real MT5 account');

    return (
        <React.Suspense fallback={<UILoader />}>
            {isDesktop ? (
                <Modal
                    className='cfd-financial-stp-modal'
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_open={is_cfd_verification_modal_visible}
                    title={getModalTitle()}
                    toggleModal={toggleCFDVerificationModal}
                    height='700px'
                    width='996px'
                    onMount={() => getAccountStatusFromAPI()}
                    exit_classname='cfd-modal--custom-exit'
                >
                    {getModalContent()}
                </Modal>
            ) : (
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={getModalTitle()}
                    wrapper_classname='cfd-financial-stp-modal'
                    visible={is_cfd_verification_modal_visible}
                    onClose={toggleCFDVerificationModal}
                >
                    {getModalContent()}
                </MobileDialog>
            )}
        </React.Suspense>
    );
});

export default CFDDbviOnboarding;

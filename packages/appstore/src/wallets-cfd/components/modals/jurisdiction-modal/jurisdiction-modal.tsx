import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader } from '@deriv/components';
import JurisdictionModalContentWrapper from './jurisdiction-modal-content-wrapper';
import JurisdictionModalTitle from './jurisdiction-modal-title';
import DynamicLeverageModalContent from '../dynamic-leverage/dynamic-leverage-modal-content';
import { DynamicLeverageContext } from '../dynamic-leverage/dynamic-leverage-context';
import { WalletModal } from '../../containers/WalletModal';
import { useModal } from 'src/wallets-cfd/context/ModalProvider';

import { observer, useStore } from '@deriv/stores';
import { useCfdStore } from '@deriv/cfd/src/Stores/Modules/CFD/Helpers/useCfdStores';
import { TJurisdictionModalProps } from '@deriv/cfd/src/Containers/props.types';

const JurisdictionModal = observer(({ openPasswordModal }: TJurisdictionModalProps) => {
    const { traders_hub, ui, common } = useStore();

    const { show_eu_related_content } = traders_hub;
    const { disableApp, enableApp } = ui;
    const { platform } = common;

    const { account_type, is_jurisdiction_modal_visible, toggleJurisdictionModal } = useCfdStore();

    const [is_dynamic_leverage_visible, setIsDynamicLeverageVisible] = React.useState(false);

    const toggleDynamicLeverage: React.MouseEventHandler<HTMLSpanElement> = event => {
        event.stopPropagation();
        setIsDynamicLeverageVisible(!is_dynamic_leverage_visible);
    };

    const onJurisdictionModalToggle = () => {
        setIsDynamicLeverageVisible(false);
        toggleJurisdictionModal();
    };

    const modal_content = (
        <div
            data-testid='modal_content'
            className={classNames('jurisdiction-modal__wrapper', {
                'jurisdiction-modal__flipped': is_dynamic_leverage_visible,
            })}
        >
            <JurisdictionModalContentWrapper openPasswordModal={openPasswordModal} />
            <DynamicLeverageModalContent />
        </div>
    );

    const { hide } = useModal();

    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <DynamicLeverageContext.Provider value={{ is_dynamic_leverage_visible, toggleDynamicLeverage }}>
                    <DesktopWrapper>
                        <WalletModal
                            className='jurisdiction-modal'
                            has_close_icon={!is_dynamic_leverage_visible}
                            onClickCloseIcon={hide}
                        >
                            {/* <Modal
                                className='jurisdiction-modal'
                                disableApp={disableApp}
                                enableApp={enableApp}
                                exit_classname='cfd-modal--custom-exit'
                                is_open={is_jurisdiction_modal_visible}
                                toggleModal={onJurisdictionModalToggle}
                                type='button'
                                width={account_type.type === 'financial' ? '1200px' : '1040px'}
                                has_close_icon={!is_dynamic_leverage_visible}
                                title={
                                    <JurisdictionModalTitle
                                        show_eu_related_content={show_eu_related_content}
                                        account_type={account_type.type}
                                        platform={platform}
                                    />
                                }
                            > */}
                            {modal_content}
                            {/* </Modal> */}
                        </WalletModal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='deriv_app'
                            visible={is_jurisdiction_modal_visible}
                            onClose={onJurisdictionModalToggle}
                            has_close_icon={!is_dynamic_leverage_visible}
                            title={
                                <JurisdictionModalTitle
                                    show_eu_related_content={show_eu_related_content}
                                    account_type={account_type.type}
                                    platform={platform}
                                />
                            }
                        >
                            {modal_content}
                        </MobileDialog>
                    </MobileWrapper>
                </DynamicLeverageContext.Provider>
            </React.Suspense>
        </div>
    );
});

export default JurisdictionModal;

import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader } from '@deriv/components';
import { TJurisdictionModalProps } from '../props.types';
import { observer, useStore } from '@deriv/stores';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import { DynamicLeverageContext } from '../dynamic-leverage/dynamic-leverage-context';
import DynamicLeverageModalContent from '../dynamic-leverage/dynamic-leverage-modal-content';
import JurisdictionModalContentWrapper from './jurisdiction-modal-content-wrapper';
import JurisdictionModalTitle from './jurisdiction-modal-title';
import { MARKET_TYPE } from '../../Helpers/cfd-config';

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
            className={classNames(`jurisdiction-modal__wrapper--${account_type.type}`, {
                'jurisdiction-modal__flipped': is_dynamic_leverage_visible,
            })}
        >
            <JurisdictionModalContentWrapper openPasswordModal={openPasswordModal} />
            {is_dynamic_leverage_visible && <DynamicLeverageModalContent />}
        </div>
    );

    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <DynamicLeverageContext.Provider value={{ is_dynamic_leverage_visible, toggleDynamicLeverage }}>
                    <DesktopWrapper>
                        <Modal
                            className='jurisdiction-modal'
                            disableApp={disableApp}
                            enableApp={enableApp}
                            exit_classname='cfd-modal--custom-exit'
                            is_open={is_jurisdiction_modal_visible}
                            toggleModal={onJurisdictionModalToggle}
                            type='button'
                            width={account_type.type === MARKET_TYPE.FINANCIAL ? '120rem' : '104rem'}
                            height={'82rem'}
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
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='deriv_app'
                            visible={is_jurisdiction_modal_visible}
                            onClose={onJurisdictionModalToggle}
                            has_close_icon={!is_dynamic_leverage_visible}
                            header_classname='jurisdiction-modal__header'
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

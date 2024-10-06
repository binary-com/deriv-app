import React from 'react';
import { MobileFullPageModal, Modal, Tabs } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { tabs_title } from 'Constants/load-modal';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendSwitchLoadStrategyTabEvent } from '../../analytics/rudderstack-bot-builder';
import { rudderStackSendCloseEvent } from '../../analytics/rudderstack-common-events';
import { LOAD_MODAL_TABS } from '../../analytics/utils';
import GoogleDrive from './google-drive';
import Local from './local';
import LocalFooter from './local-footer';
import Recent from './recent';
import RecentFooter from './recent-footer';

const LoadModal: React.FC = observer(() => {
    const { ui } = useStore();
    const { load_modal, dashboard } = useDBotStore();
    const {
        active_index,
        is_load_modal_open,
        loaded_local_file,
        onEntered,
        recent_strategies,
        setActiveTabIndex,
        toggleLoadModal,
        tab_name,
    } = load_modal;
    const { setPreviewOnPopup } = dashboard;
    const { is_desktop } = ui;
    const header_text = localize('Load strategy');

    const handleTabItemClick = (active_index: number) => {
        setActiveTabIndex(active_index);
        rudderStackSendSwitchLoadStrategyTabEvent({
            load_strategy_tab: LOAD_MODAL_TABS[active_index + (!is_desktop ? 1 : 0)],
        });
    };

    if (!is_desktop) {
        return (
            <MobileFullPageModal
                is_modal_open={is_load_modal_open}
                className='load-strategy__wrapper'
                header={header_text}
                onClickClose={() => {
                    setPreviewOnPopup(false);
                    toggleLoadModal();
                    rudderStackSendCloseEvent({
                        subform_name: 'load_strategy',
                        load_strategy_tab: LOAD_MODAL_TABS[active_index + 1],
                    });
                }}
                height_offset='80px'
                page_overlay
            >
                <Tabs active_index={active_index} onTabItemClick={handleTabItemClick} top>
                    <div label={localize('Local')}>
                        <Local />
                    </div>
                    <div label='Google Drive'>
                        <GoogleDrive />
                    </div>
                </Tabs>
            </MobileFullPageModal>
        );
    }

    const is_file_loaded = !!loaded_local_file && tab_name === tabs_title.TAB_LOCAL;
    const has_recent_strategies = recent_strategies.length > 0 && tab_name === tabs_title.TAB_RECENT;

    return (
        <Modal
            title={header_text}
            className='load-strategy'
            width='1000px'
            height='80vh'
            is_open={is_load_modal_open}
            toggleModal={() => {
                toggleLoadModal();
                rudderStackSendCloseEvent({
                    subform_name: 'load_strategy',
                    load_strategy_tab: LOAD_MODAL_TABS[active_index + (!is_desktop ? 1 : 0)],
                });
            }}
            onEntered={onEntered}
            elements_to_ignore={[document.querySelector('.injectionDiv')]}
        >
            <Modal.Body>
                <Tabs active_index={active_index} onTabItemClick={handleTabItemClick} top header_fit_content>
                    <div label={localize('Recent')}>
                        <Recent />
                    </div>
                    <div label={localize('Local')}>
                        <Local />
                    </div>
                    <div label='Google Drive'>
                        <GoogleDrive />
                    </div>
                </Tabs>
            </Modal.Body>
            {has_recent_strategies && (
                <Modal.Footer has_separator>
                    <RecentFooter />
                </Modal.Footer>
            )}
            {is_file_loaded && (
                <Modal.Footer has_separator>
                    <LocalFooter />
                </Modal.Footer>
            )}
        </Modal>
    );
});

export default LoadModal;

import * as React from 'react';
import { createPortal } from 'react-dom';
import { isMobileOrTablet } from '@deriv/shared';
import PopupBody from './popup-body';
import PopupContext, { TPopupContext } from './popup-context';
import PopupHeader from './popup-header';
import PopupOverlay from './popup-overlay';
import PopupOverlayContainer from './popup-overlay-container';
import MobileFullPageModal from '../mobile-full-page-modal';
import Modal from '../modal';

const Popup = ({
    Component,
    active_tab_icon_color,
    balance,
    close_icon_color,
    currency,
    header_background_color,
    header_banner_text,
    header_big_text,
    header_button_text,
    header_contents_color,
    header_icon,
    onHeaderButtonClick,
    should_show_popup,
    tab_icon_color,
    tabs_detail,
    title,
    togglePopupModal,
}: TPopupContext) => {
    const [overlay_ref, setOverlayRef] = React.useState<HTMLDivElement | null>();
    const [is_overlay_shown, setIsOverlayShown] = React.useState(false);
    const context_value = {
        Component,
        active_tab_icon_color,
        balance,
        close_icon_color,
        currency,
        header_background_color,
        header_banner_text,
        header_big_text,
        header_button_text,
        header_contents_color,
        header_icon,
        is_overlay_shown,
        onHeaderButtonClick,
        overlay_ref,
        setIsOverlayShown,
        tab_icon_color,
        tabs_detail,
        title,
        togglePopupModal,
        should_show_popup: false,
    };

    if (isMobileOrTablet()) {
        return createPortal(
            <PopupContext.Provider value={context_value}>
                <div className='dc-popup'>
                    <MobileFullPageModal
                        container_children={<PopupOverlayContainer refSetter={ref => setOverlayRef(ref)} />}
                        header_background_color={header_background_color}
                        height_offset='39px'
                        is_flex
                        is_popup
                        is_modal_open={should_show_popup}
                        onClickClose={togglePopupModal}
                        page_header_className='dc-popup__mobile-full-page-modal-header'
                        renderPageHeader={PopupHeader}
                        should_header_stick_body
                    >
                        <Modal.Body className='dc-popup__body'>
                            <PopupBody />
                        </Modal.Body>
                    </MobileFullPageModal>
                </div>
            </PopupContext.Provider>,
            document.getElementById('popup_root')!
        );
    }

    return (
        <PopupContext.Provider value={context_value}>
            <div className='dc-popup'>
                <Modal
                    className='popup'
                    has_close_icon={false}
                    header={<PopupHeader />}
                    header_background_color={header_background_color}
                    height='636px'
                    is_open={should_show_popup}
                    should_header_stick_body
                    toggleModal={togglePopupModal}
                    width='776px'
                >
                    <Modal.Body className='dc-popup__body'>
                        <PopupBody />
                    </Modal.Body>
                    <PopupOverlayContainer refSetter={ref => setOverlayRef(ref)} />
                </Modal>
            </div>
        </PopupContext.Provider>
    );
};

Popup.Overlay = PopupOverlay;

export default Popup;

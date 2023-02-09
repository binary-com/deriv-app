import React from 'react';
import { MobileFullPageModal, Text, Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { isMobile } from '@deriv/shared';

type TStopBotModalContent = {
    is_running: boolean;
    is_dialog_open: boolean;
    onOkButtonClick: () => void;
    closeResetDialog: () => void;
};

type TStopBotModal = {
    toggleSaveModal: () => void;
} & TStopBotModalContent;

const StopBotModalContent = ({
    is_running,
    is_dialog_open,
    onOkButtonClick,
    closeResetDialog,
}: TStopBotModalContent) => {
    const confirm_button_text = is_running ? localize('Stop my bot') : localize('Keep my contract');
    const cancel_button_text = is_running ? localize('Back') : localize('Close my contract');
    const title_text = is_running ? localize('Stop your current bot?') : localize('Keep your current contract?');
    return (
        <React.Fragment>
            <Dialog
                portal_element_id='modal_root'
                title={title_text}
                is_visible={is_dialog_open}
                confirm_button_text={confirm_button_text}
                onConfirm={onOkButtonClick}
                cancel_button_text={cancel_button_text}
                onCancel={closeResetDialog}
                is_mobile_full_width={false}
                className={'toolbar__dialog'}
                has_close_icon
            >
                {is_running ? (
                    <>
                        <Text as='p' line_height='s' size='xs' styles={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
                            {localize(
                                'Stopping the current bot will load the Quick Strategy you just created to the workspace.'
                            )}
                        </Text>
                        <Text as='p' line_height='s' size='xs'>
                            {localize(' Any open contracts can be viewed on the ')}
                            <Text
                                as='span'
                                line_height='s'
                                size='xs'
                                styles={{ color: 'var(--button-primary-default)' }}
                            >
                                <strong>{localize('Reports')}</strong>
                            </Text>
                            {localize(' page.')}
                        </Text>
                    </>
                ) : (
                    <>
                        <Text as='p' line_height='s' size='xs' styles={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
                            {localize(
                                'Close your contract now or keep it running. If you decide to keep it running, you can check and close it later on the '
                            )}
                            <Text
                                as='span'
                                line_height='s'
                                size='xs'
                                styles={{ color: 'var(--button-primary-default)' }}
                            >
                                <strong>{localize('Reports')}</strong>
                            </Text>
                            {localize(' page.')}
                        </Text>
                        <Text as='p' line_height='s' size='xs'>
                            {localize('The Quick Strategy you just created will be loaded to the workspace.')}
                        </Text>
                    </>
                )}
            </Dialog>
        </React.Fragment>
    );
};

const StopBotModal = ({
    is_running,
    is_dialog_open,
    onOkButtonClick,
    closeResetDialog,
    toggleSaveModal,
}: TStopBotModal) => {
    const is_mobile = isMobile();
    // is_dialog_open = true; //!TODO to check, remove it after set implementation
    return is_mobile ? (
        <MobileFullPageModal
            is_modal_open={is_dialog_open}
            className='save-modal__wrapper'
            header={localize('Save strategy')}
            onClickClose={toggleSaveModal}
            height_offset='80px'
            page_overlay
        >
            <StopBotModalContent
                is_running={is_running}
                is_dialog_open={is_dialog_open}
                onOkButtonClick={onOkButtonClick}
                closeResetDialog={closeResetDialog}
            />
        </MobileFullPageModal>
    ) : (
        <StopBotModalContent
            is_running={is_running}
            is_dialog_open={is_dialog_open}
            onOkButtonClick={onOkButtonClick}
            closeResetDialog={closeResetDialog}
        />
    );
};

export default connect(({ run_panel, toolbar, quick_strategy }: RootStore) => ({
    is_dialog_open: toolbar.is_dialog_open,
    is_running: run_panel.is_running, //!TODO replace it after set implementation
    onOkButtonClick: toolbar.onResetOkButtonClick, //!TODO replace it after set implementation
    closeResetDialog: toolbar.closeResetDialog, //!TODO replace it after set implementation
    toggleSaveModal: quick_strategy.toggleSaveModal, //!TODO replace it after set implementation
}))(StopBotModal);

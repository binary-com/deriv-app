import { Dialog, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';

export type TStopBotModalContent = {
    is_running: boolean;
    is_dialog_open: boolean;
    is_contract_dialog_open: boolean;
    is_stop_bot_dialog_open: boolean;
    is_multiplier: boolean;
    closeMultiplierContract: () => void;
    onOkButtonClick: () => void;
    toggleStopBotDialog: () => void;
};

const StopBotModalContent = ({
    is_running,
    is_multiplier,
    is_contract_dialog_open,
    is_stop_bot_dialog_open,
    closeMultiplierContract,
    onOkButtonClick,
    toggleStopBotDialog,
}: TStopBotModalContent) => {
    const confirm_button_text = is_running && is_multiplier ? localize('Keep my contract') : localize('Stop my bot');
    const cancel_button_text = is_running && is_multiplier ? localize('Close my contract') : localize('Back');
    const title_text =
        is_running && is_multiplier ? localize('Keep your current contract?') : localize('Stop your current bot?');
    const toggle_dialog_or_stop = is_running && is_multiplier ? closeMultiplierContract : toggleStopBotDialog;

    return (
        <React.Fragment>
            <Dialog
                portal_element_id='modal_root'
                title={title_text}
                is_visible={is_running ? is_stop_bot_dialog_open : is_contract_dialog_open}
                confirm_button_text={confirm_button_text}
                onConfirm={onOkButtonClick}
                cancel_button_text={cancel_button_text}
                onCancel={toggle_dialog_or_stop}
                is_mobile_full_width={false}
                className={'toolbar__dialog'}
                has_close_icon
            >
                {is_running && is_multiplier ? (
                    <>
                        <Text as='p' line_height='s' size='xs' styles={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
                            {localize(
                                'Close your contract now or keep it running. If you decide to keep it running, you can check and close it later on the '
                            )}
                            <Text as='span' line_height='s' size='xs'>
                                <strong>{localize('Reports')}</strong>
                            </Text>
                            {localize(' page.')}
                        </Text>
                        <Text as='p' line_height='s' size='xs'>
                            {localize('The Quick Strategy you just created will be loaded to the workspace.')}
                        </Text>
                    </>
                ) : (
                    <>
                        <Text as='p' line_height='s' size='xs' styles={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
                            {localize(
                                'Stopping the current bot will load the Quick Strategy you just created to the workspace.'
                            )}
                        </Text>
                        <Text as='p' line_height='s' size='xs'>
                            {localize(' Any open contracts can be viewed on the ')}
                            <Text as='span' line_height='s' size='xs'>
                                <strong>{localize('Reports')}</strong>
                            </Text>
                            {localize(' page.')}
                        </Text>
                    </>
                )}
            </Dialog>
        </React.Fragment>
    );
};

export default StopBotModalContent;

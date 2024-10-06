import React from 'react';
import { observer } from '@deriv/stores';
import { useDBotStore } from '../../stores/useDBotStore';
import StopBotModalContent from './stop-bot-modal-content';

const StopBotModal: React.FC = observer(() => {
    const { run_panel, quick_strategy, summary_card } = useDBotStore();

    const { is_contract_dialog_open, is_stop_bot_dialog_open, toggleStopBotDialog } = quick_strategy;
    const { is_running, closeMultiplierContract, stopMyBot, is_dialog_open } = run_panel;
    const { is_multiplier } = summary_card;

    return (
        <StopBotModalContent
            is_running={is_running}
            onOkButtonClick={stopMyBot}
            is_contract_dialog_open={is_contract_dialog_open}
            is_stop_bot_dialog_open={is_stop_bot_dialog_open}
            is_multiplier={is_multiplier}
            closeMultiplierContract={closeMultiplierContract}
            is_dialog_open={is_dialog_open}
            toggleStopBotDialog={toggleStopBotDialog}
        />
    );
});

export default StopBotModal;

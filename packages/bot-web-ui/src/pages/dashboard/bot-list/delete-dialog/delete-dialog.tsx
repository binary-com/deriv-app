import React from 'react';
import localForage from 'localforage';
import LZString from 'lz-string';
import { getSavedWorkspaces } from '@deriv/bot-skeleton';
import { Dialog, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { NOTIFICATION_TYPE } from 'Components/bot-notification/bot-notification-utils';
import { TStrategy } from 'Types';
import { useDBotStore } from 'Stores/useDBotStore';
import './delete-dialog.scss';

const DeleteDialog = observer(() => {
    const { load_modal, dashboard } = useDBotStore();
    const {
        is_delete_modal_open,
        onToggleDeleteDialog,
        selected_strategy_id,
        setDashboardStrategies,
        loadStrategyToBuilder,
        refreshStrategiesTheme,
        resetBotBuilderStrategy,
    } = load_modal;
    const { setOpenSettings } = dashboard;

    const resetStrategiesAfterDelete = async (deleted_strategy_id: string, updated_workspaces: Array<TStrategy>) => {
        if (updated_workspaces.length) {
            if (selected_strategy_id === deleted_strategy_id) {
                await loadStrategyToBuilder(updated_workspaces?.[0]);
            }
            // Change preview strategy to the one that was previously previewed
            await refreshStrategiesTheme();
        } else {
            resetBotBuilderStrategy();
        }
    };

    const removeBotStrategy = async (strategy_id: string) => {
        const workspaces = await getSavedWorkspaces();
        const updated_workspaces = workspaces.filter(
            (strategy_from_workspace: TStrategy) => strategy_from_workspace.id !== strategy_id
        );
        setDashboardStrategies(updated_workspaces);
        // TODO: Need to move this to skeleton
        localForage.setItem('saved_workspaces', LZString.compress(JSON.stringify(updated_workspaces)));
        await resetStrategiesAfterDelete(strategy_id, updated_workspaces);
        onToggleDeleteDialog(false);
    };

    return (
        <div>
            <Dialog
                title={localize('Delete bot')}
                is_visible={is_delete_modal_open}
                confirm_button_text={localize('Yes, delete')}
                onConfirm={() => {
                    removeBotStrategy(selected_strategy_id);
                    onToggleDeleteDialog(false);
                    setOpenSettings(NOTIFICATION_TYPE.BOT_DELETE);
                }}
                cancel_button_text={localize('No')}
                onCancel={() => {
                    onToggleDeleteDialog(false);
                }}
                is_mobile_full_width={false}
                className={'dc-dialog__delete-strategy--delete'}
                has_close_icon
            >
                <div>
                    <Text color='prominent' line_height='s' size='xs'>
                        {localize('Your bot will be permanently deleted when you hit ')}
                        <strong>{localize('Yes, delete.')}</strong>
                    </Text>
                </div>
                <div>
                    <Text color='prominent' line_height='xl' size='xs'>
                        {localize('Are you sure you want to delete it?')}
                    </Text>
                </div>
            </Dialog>
        </div>
    );
});

export default DeleteDialog;

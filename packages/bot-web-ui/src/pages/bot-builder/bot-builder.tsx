import React from 'react';
import classNames from 'classnames';
import { useRemoteConfig } from '@deriv/api';
import { useIsMounted } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { botNotification } from 'Components/bot-notification/bot-notification';
import { notification_message } from 'Components/bot-notification/bot-notification-utils';
import initDatadogLogs from 'Utils/datadog-logs';
import { TBlocklyEvents } from 'Types';
import LoadModal from '../../components/load-modal';
import { useDBotStore } from '../../stores/useDBotStore';
import SaveModal from '../dashboard/load-bot-preview/save-modal';
import BotBuilderTourHandler from '../tutorials/dbot-tours/bot-builder-tour';
import QuickStrategy1 from './quick-strategy';
import WorkspaceWrapper from './workspace-wrapper';

const BotBuilder = observer(() => {
    const { ui } = useStore();
    const { dashboard, app, run_panel, toolbar, quick_strategy, blockly_store } = useDBotStore();
    const { active_tab, active_tour, is_preview_on_popup } = dashboard;
    const { is_open } = quick_strategy;
    const { is_running } = run_panel;
    const { is_loading } = blockly_store;
    const is_blockly_listener_registered = React.useRef(false);
    const is_blockly_delete_listener_registered = React.useRef(false);
    const { is_desktop } = ui;
    const { onMount, onUnmount } = app;
    const el_ref = React.useRef<HTMLInputElement | null>(null);
    const isMounted = useIsMounted();
    const { data: remote_config_data } = useRemoteConfig(isMounted());
    let end_drag_id: null | string = null;
    let selection_id: null | string = null;

    React.useEffect(() => {
        initDatadogLogs(remote_config_data.tracking_datadog);
        window.is_datadog_logging_enabled = remote_config_data.tracking_datadog; // This will be used in the middleware inside of bot-skeleton to check if datadog is enabled before logging
    }, [remote_config_data.tracking_datadog]);

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, [onMount, onUnmount]);

    React.useEffect(() => {
        const workspace = window.Blockly?.derivWorkspace;
        if (workspace && is_running && !is_blockly_listener_registered.current) {
            is_blockly_listener_registered.current = true;
            workspace.addChangeListener(handleBlockChangeOnBotRun);
        } else {
            removeBlockChangeListener();
        }

        return () => {
            if (workspace && is_blockly_listener_registered.current) {
                removeBlockChangeListener();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_running]);

    const handleBlockChangeOnBotRun = (e: Event) => {
        const { is_reset_button_clicked } = toolbar;
        if (e.type !== 'ui' && !is_reset_button_clicked) {
            botNotification(notification_message.workspace_change);
            removeBlockChangeListener();
        } else if (is_reset_button_clicked) {
            removeBlockChangeListener();
        }
    };

    const removeBlockChangeListener = () => {
        is_blockly_listener_registered.current = false;
        window.Blockly?.derivWorkspace?.removeChangeListener(handleBlockChangeOnBotRun);
    };

    React.useEffect(() => {
        const workspace = window.Blockly?.derivWorkspace;
        if (workspace && !is_blockly_delete_listener_registered.current) {
            is_blockly_delete_listener_registered.current = true;
            workspace.addChangeListener(handleBlockDelete);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_loading]);

    const handleBlockDelete = (e: TBlocklyEvents) => {
        if (e.type === 'ui' && e.element === 'selected' && !e.group?.includes('dbot-')) {
            selection_id = e.oldValue;
        }
        if (e.type === 'endDrag' && !e.group?.includes('dbot-')) {
            end_drag_id = e.group;
        }
        if (e.type === 'delete' && (end_drag_id === e.group || selection_id === e.blockId)) {
            handleBlockDeleteNotification();
            end_drag_id = null;
        }
    };

    const handleBlockDeleteNotification = () => {
        botNotification(notification_message.block_delete, {
            label: localize('Undo'),
            onClick: closeToast => {
                window.Blockly.derivWorkspace.undo();
                closeToast?.();
            },
        });
    };

    return (
        <>
            <div
                className={classNames('bot-builder', {
                    'bot-builder--active': active_tab === 1 && !is_preview_on_popup,
                    'bot-builder--inactive': is_preview_on_popup,
                    'bot-builder--tour-active': active_tour,
                })}
            >
                {is_preview_on_popup ? null : (
                    <div id='scratch_div' ref={el_ref}>
                        <WorkspaceWrapper />
                    </div>
                )}
            </div>
            {active_tab === 1 && <BotBuilderTourHandler is_mobile={!is_desktop} />}
            {/* removed this outside from toolbar becuase it needs to loaded seperately without dependency */}
            <LoadModal />
            <SaveModal />
            {is_open && <QuickStrategy1 />}
        </>
    );
});

export default BotBuilder;

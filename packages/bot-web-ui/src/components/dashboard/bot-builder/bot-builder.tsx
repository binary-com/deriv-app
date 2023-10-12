import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { RudderStack, TActions } from '@deriv/analytics';
import { observer } from '@deriv/stores';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from '../../../stores/useDBotStore';
import BotSnackbar from '../../bot-snackbar';
import LoadModal from '../../load-modal';
import SaveModal from '../dashboard-component/load-bot-preview/save-modal';
import BotBuilderTourHandler from '../dbot-tours/bot-builder-tour';
import QuickStrategy from '../quick-strategy';
import WorkspaceWrapper from './workspace-wrapper';

const BotBuilder = observer(() => {
    const { dashboard, app, run_panel } = useDBotStore();
    const { active_tab, active_tour, is_preview_on_popup } = dashboard;
    const { is_running } = run_panel;
    const is_blockly_listener_registered = useRef(false);
    const [show_snackbar, setShowSnackbar] = useState(false);

    const { onMount, onUnmount } = app;
    const el_ref = React.useRef<HTMLInputElement | null>(null);

    const trackRudderStackForBotBuilder = (action: TActions) => {
        RudderStack.track('ce_bot_builder_form', {
            action,
            form_source: 'ce_bot_builder_form',
        });
    };

    React.useEffect(() => {
        if (active_tab === DBOT_TABS.BOT_BUILDER) {
            trackRudderStackForBotBuilder('open');
            return () => {
                trackRudderStackForBotBuilder('close');
            };
        }
    }, [active_tab]);

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, []);

    const handleBlockChangeOnBotRun = (e: Event) => {
        if (e.type !== 'ui') {
            setShowSnackbar(true);
            removeBlockChangeListener();
        }
    };

    const removeBlockChangeListener = () => {
        is_blockly_listener_registered.current = false;
        window.Blockly?.derivWorkspace?.removeChangeListener(handleBlockChangeOnBotRun);
    };

    React.useEffect(() => {
        const workspace = window.Blockly?.derivWorkspace;
        if (workspace && is_running && !is_blockly_listener_registered.current) {
            is_blockly_listener_registered.current = true;
            workspace.addChangeListener(handleBlockChangeOnBotRun);
        } else {
            setShowSnackbar(false);
            removeBlockChangeListener();
        }

        return () => {
            if (workspace && is_blockly_listener_registered.current) {
                removeBlockChangeListener();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_running]);

    return (
        <>
            <BotSnackbar
                is_open={show_snackbar}
                message='Changes you make will not affect your running bot.'
                handleClose={() => setShowSnackbar(false)}
            />
            <div
                className={classNames('bot-builder', {
                    'bot-builder--active': active_tab === 1 && !is_preview_on_popup,
                    'bot-builder--inactive': is_preview_on_popup,
                    'bot-builder--tour-active': active_tour,
                })}
            >
                {is_preview_on_popup ? null : (
                    <div
                        id='scratch_div'
                        ref={el_ref}
                        style={{
                            width: 'calc(100vw - 3.2rem)',
                            height: 'var(--bot-content-height)',
                        }}
                    >
                        <WorkspaceWrapper />
                    </div>
                )}
            </div>
            {active_tab === 1 && <BotBuilderTourHandler />}
            {/* removed this outside from toolbar becuase it needs to loaded seperately without dependency */}
            <LoadModal />
            <SaveModal />
            <QuickStrategy />
        </>
    );
});

export default BotBuilder;

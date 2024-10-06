import React, { useEffect } from 'react';
import classNames from 'classnames';
import { updateWorkspaceName } from '@deriv/bot-skeleton';
import dbot from '@deriv/bot-skeleton/src/scratch/dbot';
import { api_base } from '@deriv/bot-skeleton/src/services/api/api-base';
import { isDbotRTL } from '@deriv/bot-skeleton/src/utils/workspace';
import { Dialog, Tabs } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import TradingViewModal from 'Components/trading-view-chart/trading-view-modal';
import { DBOT_TABS, TAB_IDS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';
import RunPanel from '../../components/run-panel';
import Chart from '../chart';
import ChartModal from '../chart/chart-modal';
import Dashboard from '../dashboard';
import RunStrategy from '../dashboard/run-strategy';
import Tutorial from '../tutorials';
import { tour_list } from '../tutorials/dbot-tours/utils';

const AppWrapper = observer(() => {
    const { dashboard, load_modal, run_panel, quick_strategy, summary_card } = useDBotStore();
    const {
        active_tab,
        active_tour,
        is_chart_modal_visible,
        is_trading_view_modal_visible,
        setActiveTab,
        setWebSocketState,
        setActiveTour,
        setTourDialogVisibility,
    } = dashboard;
    const { onEntered, dashboard_strategies } = load_modal;
    const { is_dialog_open, is_drawer_open, dialog_options, onCancelButtonClick, onCloseDialog, onOkButtonClick } =
        run_panel;
    const { is_open } = quick_strategy;
    const { cancel_button_text, ok_button_text, title, message } = dialog_options as { [key: string]: string };
    const { clear } = summary_card;
    const { DASHBOARD, BOT_BUILDER } = DBOT_TABS;
    const init_render = React.useRef(true);
    const { ui } = useStore();
    const { url_hashed_values, is_desktop } = ui;

    const hash = ['dashboard', 'bot_builder', 'chart', 'tutorial'];

    let tab_value: number | string = active_tab;
    const GetHashedValue = (tab: number) => {
        tab_value = url_hashed_values?.split('#')[1];
        if (!tab_value) return tab;
        return Number(hash.indexOf(String(tab_value)));
    };
    const active_hash_tab = GetHashedValue(active_tab);

    const checkAndHandleConnection = () => {
        const api_status = api_base.getConnectionStatus();
        //added this check because after sleep mode all the store values refresh and is_running is false.
        const is_bot_running = document.getElementById('db-animation__stop-button') !== null;
        if (is_bot_running && (api_status === 'Closed' || api_status === 'Closing')) {
            dbot.terminateBot();
            clear();
            setWebSocketState(false);
        }
    };

    React.useEffect(() => {
        window.addEventListener('focus', checkAndHandleConnection);
        // eslint-disable-next-line react-hooks/exhaustive-deps

        return () => {
            window.removeEventListener('focus', checkAndHandleConnection);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (is_open) {
            setTourDialogVisibility(false);
        }

        if (init_render.current) {
            setActiveTab(Number(active_hash_tab));
            if (!is_desktop) handleTabChange(Number(active_hash_tab));
            init_render.current = false;
        } else {
            window.location.hash = hash[active_tab] || hash[0];
        }
        if (tour_list[active_tab] !== active_tour) {
            setActiveTour('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active_tab]);

    React.useEffect(() => {
        const trashcan_init_id = setTimeout(() => {
            if (active_tab === BOT_BUILDER && window.Blockly?.derivWorkspace?.trashcan) {
                const trashcanY = window.innerHeight - 250;
                let trashcanX;
                if (is_drawer_open) {
                    trashcanX = isDbotRTL() ? 380 : window.innerWidth - 460;
                } else {
                    trashcanX = isDbotRTL() ? 20 : window.innerWidth - 100;
                }
                window.Blockly?.derivWorkspace?.trashcan?.setTrashcanPosition(trashcanX, trashcanY);
            }
        }, 100);

        return () => {
            clearTimeout(trashcan_init_id); // Clear the timeout on unmount
        };
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active_tab, is_drawer_open]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (dashboard_strategies.length > 0) {
            // Needed to pass this to the Callback Queue as on tab changes
            // document title getting override by 'Bot | Deriv' only
            timer = setTimeout(() => {
                updateWorkspaceName();
            });
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [dashboard_strategies, active_tab]);

    const handleTabChange = React.useCallback(
        (tab_index: number) => {
            setActiveTab(tab_index);
            const el_id = TAB_IDS[tab_index];
            if (el_id) {
                const el_tab = document.getElementById(el_id);
                setTimeout(() => {
                    el_tab?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                }, 10);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [active_tab]
    );

    return (
        <React.Fragment>
            <div className='main'>
                <div
                    className={classNames('main__container', {
                        'main__container--active': active_tour && active_tab === DASHBOARD && !is_desktop,
                    })}
                >
                    <Tabs
                        active_index={active_tab}
                        className='main__tabs'
                        onTabItemChange={onEntered}
                        onTabItemClick={handleTabChange}
                        top
                    >
                        <div
                            icon='IcDashboardComponentTab'
                            label={<Localize i18n_default_text='Dashboard' />}
                            id='id-dbot-dashboard'
                        >
                            <Dashboard handleTabChange={handleTabChange} />
                        </div>
                        <div
                            icon='IcBotBuilderTabIcon'
                            label={<Localize i18n_default_text='Bot Builder' />}
                            id='id-bot-builder'
                        />
                        <div
                            icon='IcChartsTabDbot'
                            label={<Localize i18n_default_text='Charts' />}
                            id={
                                is_chart_modal_visible || is_trading_view_modal_visible
                                    ? 'id-charts--disabled'
                                    : 'id-charts'
                            }
                        >
                            <Chart show_digits_stats={false} />
                        </div>
                        <div
                            icon='IcTutorialsTabs'
                            label={<Localize i18n_default_text='Tutorials' />}
                            id='id-tutorials'
                        >
                            <div className='tutorials-wrapper'>
                                <Tutorial handleTabChange={handleTabChange} />
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
            {is_desktop ? (
                <>
                    <div className='main__run-strategy-wrapper'>
                        {active_tab !== 4 && (
                            <>
                                <RunStrategy />
                                <RunPanel />
                            </>
                        )}
                    </div>
                    <ChartModal />
                    <TradingViewModal />
                </>
            ) : (
                !is_open && active_tab !== 4 && <RunPanel />
            )}
            <Dialog
                cancel_button_text={cancel_button_text || localize('Cancel')}
                className='dc-dialog__wrapper--fixed'
                confirm_button_text={ok_button_text || localize('Ok')}
                has_close_icon
                is_mobile_full_width={false}
                is_visible={is_dialog_open}
                onCancel={onCancelButtonClick}
                onClose={onCloseDialog}
                onConfirm={onOkButtonClick || onCloseDialog}
                portal_element_id='modal_root'
                title={title}
            >
                {message}
            </Dialog>
        </React.Fragment>
    );
});

export default AppWrapper;

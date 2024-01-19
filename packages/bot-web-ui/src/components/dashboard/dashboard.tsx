import React, { useEffect } from 'react';
import classNames from 'classnames';
import { updateWorkspaceName } from '@deriv/bot-skeleton';
import { Analytics } from '@deriv/analytics';
import dbot from '@deriv/bot-skeleton/src/scratch/dbot';
import { initTrashCan } from '@deriv/bot-skeleton/src/scratch/hooks/trashcan';
import { api_base } from '@deriv/bot-skeleton/src/services/api/api-base';
import { DesktopWrapper, Dialog, MobileWrapper, Tabs } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useFeatureFlags } from '@deriv/hooks';
import Chart from 'Components/chart';
import { DBOT_TABS, TAB_IDS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';
import RunPanel from '../run-panel';
import RunStrategy from './dashboard-component/run-strategy';
import { tour_list } from './dbot-tours/utils';
import { ChartModal, DashboardComponent } from './dashboard-component';
import StrategyNotification from './strategy-notification';
import Tutorial from './tutorial-tab';
import ServerBot from './server-bot';

const Dashboard = observer(() => {
    const { dashboard, load_modal, run_panel, quick_strategy, summary_card } = useDBotStore();
    const {
        active_tab,
        active_tour,
        is_chart_modal_visible,
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
    const { url_hashed_values, is_mobile } = ui;
    const { is_next_server_bot_enabled } = useFeatureFlags();
    const hash = ['dashboard', 'bot_builder', 'chart', 'tutorial', 'server_bot'];

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
    }, []);

    React.useEffect(() => {
        if (is_open) {
            setTourDialogVisibility(false);
        }

        if (init_render.current) {
            setActiveTab(Number(active_hash_tab));
            if (is_mobile) handleTabChange(Number(active_hash_tab));
            init_render.current = false;
        } else {
            window.location.hash = hash[active_tab] || hash[0];
        }
        if (tour_list[active_tab] !== active_tour) {
            setActiveTour('');
        }
    }, [active_tab]);

    React.useEffect(() => {
        if (active_tab === BOT_BUILDER) {
            Analytics.trackEvent('ce_bot_builder_form', {
                action: 'open',
                form_source: 'bot_header_form',
            });
            if (is_drawer_open) {
                initTrashCan(400, -748);
            } else {
                initTrashCan(20);
            }
            setTimeout(() => {
                window.dispatchEvent(new Event('resize')); // make the trash can work again after resize
            }, 500);
        }
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
                el_tab?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                });
            }
        },
        [active_tab]
    );

    return (
        <React.Fragment>
            <div className='dashboard__main'>
                <div
                    className={classNames('dashboard__container', {
                        'dashboard__container--active': active_tour && active_tab === DASHBOARD && is_mobile,
                    })}
                >
                    <Tabs
                        active_index={active_tab}
                        className='dashboard__tabs'
                        onTabItemChange={onEntered}
                        onTabItemClick={handleTabChange}
                        top
                    >
                        <div
                            icon='IcDashboardComponentTab'
                            label={<Localize i18n_default_text='Dashboard' />}
                            id='id-dbot-dashboard'
                        >
                            <DashboardComponent handleTabChange={handleTabChange} />
                        </div>
                        <div
                            icon='IcBotBuilderTabIcon'
                            label={<Localize i18n_default_text='Bot Builder' />}
                            id='id-bot-builder'
                        />
                        <div
                            icon='IcChartsTabDbot'
                            label={<Localize i18n_default_text='Charts' />}
                            id={is_chart_modal_visible ? 'id-charts--disabled' : 'id-charts'}
                        >
                            <Chart />
                        </div>
                        <div
                            icon='IcTutorialsTabs'
                            label={<Localize i18n_default_text='Tutorials' />}
                            id='id-tutorials'
                        >
                            <div className='tutorials-wrapper'>
                                <Tutorial />
                            </div>
                        </div>
                        {is_next_server_bot_enabled ? (
                            <div
                                icon='IcDashboardComponentTab'
                                label={<Localize i18n_default_text='Server bot' />}
                                id='id-server-bot'
                            >
                                <ServerBot />
                            </div>
                        ) : (
                            <></>
                        )}
                    </Tabs>
                </div>
            </div>
            <DesktopWrapper>
                <div className={'dashboard__run-strategy-wrapper'}>
                    <RunStrategy />
                    <RunPanel />
                </div>
                <ChartModal />
            </DesktopWrapper>
            <MobileWrapper>{!is_open && <RunPanel />}</MobileWrapper>
            <Dialog
                cancel_button_text={cancel_button_text || localize('Cancel')}
                className={'dc-dialog__wrapper--fixed'}
                confirm_button_text={ok_button_text || localize('OK')}
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
            <StrategyNotification />
        </React.Fragment>
    );
});

export default Dashboard;

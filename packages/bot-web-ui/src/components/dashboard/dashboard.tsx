import React from 'react';
import { Tabs, DesktopWrapper, Dialog } from '@deriv/components';
import { localize } from '@deriv/translations';
import Chart from 'Components/chart';
import ReactJoyride from 'react-joyride';
import classNames from 'classnames';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import DashboardComponent from './dashboard-component';
import RunStrategy from './dashboard-component/run-strategy';
import RunPanel from '../run-panel';
import QuickStrategy from './quick-strategy';
import { DASHBOARD_TABS } from '../../constants/bot-contents';
import Tutorial from './tutorial-tab';
import {
    DBOT_ONBOARDING,
    handleJoyrideCallback,
    getTourSettings,
    setTourType,
    tour_type,
    setTourSettings,
    tour_status_ended,
} from './joyride-config';
import TourTriggrerDialog from './tour-trigger-dialog';

type TDialogOptions = {
    title: string;
    message: string;
    cancel_button_text?: string;
    ok_button_text?: string;
};

type TDashboard = {
    active_tab: number;
    dialog_options: TDialogOptions;
    has_bot_builder_tour_started: boolean;
    has_file_loaded: boolean;
    has_onboard_tour_started: boolean;
    has_tour_started: boolean;
    is_dialog_open: boolean;
    is_drawer_open: boolean;
    is_tour_dialog_visible: boolean;
    onCancelButtonClick: () => void;
    onCloseDialog: () => void;
    onEntered: () => void;
    onOkButtonClick: () => void;
    setActiveTab: (active_tab: number) => void;
    setBotBuilderTokenCheck: (param: string | number) => void;
    setBotBuilderTourState: (param: boolean) => void;
    setOnBoardingTokenCheck: (param: string | number) => void;
    setOnBoardTourRunState: (param: boolean) => void;
    setTourActive: (param: boolean) => void;
    setTourDialogVisibility: (param: boolean) => void;
    toggleStrategyModal: () => void;
    setIsTourEnded: (param: boolean) => void;
};

const Dashboard = ({
    active_tab,
    dialog_options,
    has_file_loaded,
    has_onboard_tour_started,
    has_tour_started,
    is_dialog_open,
    is_drawer_open,
    onCancelButtonClick,
    onCloseDialog,
    onEntered,
    onOkButtonClick,
    setActiveTab,
    setBotBuilderTokenCheck,
    setBotBuilderTourState,
    setOnBoardingTokenCheck,
    setOnBoardTourRunState,
    setTourActive,
    setTourDialogVisibility,
    setIsTourEnded,
    toggleStrategyModal,
}: TDashboard) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleStrategyModal();
    };

    let tour_status: { [key: string]: string };
    const setTourStatus = (param: { [key: string]: string }) => {
        if (tour_status) {
            const { action } = tour_status;
            const actions = ['skip', 'close'];

            if (actions.includes(action)) {
                if (tour_type.key === 'bot_builder_') {
                    setBotBuilderTourState(false);
                } else {
                    setOnBoardTourRunState(false);
                }
                setTourActive(false);
            }
        }
    };

    const is_tour_complete = React.useRef(true);

    let getBotBuilderToken: string | number = '';
    let getOnboardingToken: string | number = '';

    React.useEffect(() => {
        if (active_tab === 0 && has_file_loaded) {
            onEntered();
        }
        if (active_tab === 0) {
            setTourType('onboard_tour_');
            getOnboardingToken = getTourSettings('token');
            setOnBoardingTokenCheck(getOnboardingToken);
        }
        if (active_tab === 1 && !has_onboard_tour_started) {
            setTourType('bot_builder_');
            getBotBuilderToken = getTourSettings('token');
            setBotBuilderTokenCheck(getBotBuilderToken);
        }
        tour_status = getTourSettings('onboard_tour_status');
        setTourStatus(tour_status);
    }, [active_tab, handleJoyrideCallback, has_onboard_tour_started, is_tour_complete, tour_status_ended]);

    //TODO: added addeventlistner because the useeffect does not trigger
    const botStorageSetting = () => {
        tour_status = getTourSettings('bot_builder_status');
        setTourStatus(tour_status);
        if (tour_status_ended.key === 'finished') {
            if (tour_type.key === 'onboard_tour_') {
                setActiveTab(0);
                setTourDialogVisibility(true);
            } else {
                setTourDialogVisibility(true);
            }
            setIsTourEnded(true);
            is_tour_complete.current = false;
            window.removeEventListener('storage', botStorageSetting);
        }

        getBotBuilderToken = getTourSettings('token');
        if (active_tab === 1 && !storage.bot_builder_token && !has_onboard_tour_started) {
            setTourSettings(new Date().getTime(), `${tour_type.key}token`);
        }
    };
    if (!getBotBuilderToken) {
        setIsTourEnded(false);
        window.addEventListener('storage', botStorageSetting);
    }

    let storage = '';
    if (localStorage?.dbot_settings !== undefined) {
        storage = JSON.parse(localStorage?.dbot_settings);
    }

    React.useEffect(() => {
        const dbot_settings = JSON.parse(localStorage.getItem('dbot_settings') as string);
        if (active_tab === 0 && !dbot_settings?.onboard_tour_token) {
            setTourDialogVisibility(true);
        } else if (active_tab === 1 && !dbot_settings?.bot_builder_token && !has_onboard_tour_started) {
            setTourDialogVisibility(true);
        }
    }, [active_tab]);

    const { BOT_BUILDER, CHART, QUICK_STRATEGY } = DASHBOARD_TABS;

    return (
        <React.Fragment>
            <div className='dashboard__main'>
                <div className='dashboard__container'>
                    <TourTriggrerDialog />
                    {has_tour_started && (
                        <ReactJoyride
                            steps={DBOT_ONBOARDING}
                            continuous
                            callback={handleJoyrideCallback}
                            spotlightClicks
                            locale={{ back: 'Previous' }}
                            styles={{
                                buttonBack: {
                                    border: '0.2rem solid var(--text-less-prominent)',
                                    marginRight: '1rem',
                                    borderRadius: '0.4rem',
                                    color: 'var(--general-section-7)',
                                    padding: '0.6rem',
                                },
                            }}
                        />
                    )}
                    <Tabs
                        active_index={active_tab}
                        className='dashboard__tabs'
                        onTabItemChange={onEntered}
                        onTabItemClick={setActiveTab}
                        top
                    >
                        <div icon='IcDashboardComponentTab' label={localize('Dashboard')}>
                            <DashboardComponent />
                        </div>
                        <div icon='IcBotBuilderTabIcon' label={localize('Bot Builder')} id='id-bot-builder' />
                        <div
                            icon='IcQuickStrategyIcon'
                            label={localize('Quick Strategy')}
                            id='id-quick-strategy'
                            onClick={handleClick}
                        >
                            <div
                                className={classNames('quick-strategy', {
                                    'quick-strategy--open': is_drawer_open,
                                })}
                            >
                                <QuickStrategy />
                            </div>
                        </div>
                        <div icon='IcChartsTabDbot' label={localize('Charts')} id='id-charts'>
                            <Chart />
                        </div>
                        <div icon='IcTutorialsTabs' label={localize('Tutorial')} id='id-tutorials'>
                            <div className='tutorials-wrapper'>
                                <Tutorial />
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
            <DesktopWrapper>
                <div className='dashboard__run-strategy-wrapper'>
                    <RunStrategy />

                    {[BOT_BUILDER, CHART, QUICK_STRATEGY].includes(active_tab) && <RunPanel />}
                </div>
            </DesktopWrapper>
            <Dialog
                cancel_button_text={dialog_options.cancel_button_text || localize('Cancel')}
                className={'dc-dialog__wrapper--fixed'}
                confirm_button_text={dialog_options.ok_button_text || localize('OK')}
                has_close_icon
                is_mobile_full_width={false}
                is_visible={is_dialog_open}
                onCancel={onCancelButtonClick}
                onClose={onCloseDialog}
                onConfirm={onOkButtonClick || onCloseDialog}
                portal_element_id='modal_root'
                title={dialog_options.title}
            >
                {dialog_options.message}
            </Dialog>
        </React.Fragment>
    );
};

export default connect(({ dashboard, quick_strategy, run_panel, load_modal }: RootStore) => ({
    active_tab: dashboard.active_tab,
    dialog_options: run_panel.dialog_options,
    has_bot_builder_tour_started: dashboard.has_bot_builder_tour_started,
    has_file_loaded: dashboard.has_file_loaded,
    has_onboard_tour_started: dashboard.has_onboard_tour_started,
    has_tour_started: dashboard.has_tour_started,
    setTourActive: dashboard.setTourActive,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
    setBotBuilderTourState: dashboard.setBotBuilderTourState,
    setIsTourEnded: dashboard.setIsTourEnded,
    is_dialog_open: run_panel.is_dialog_open,
    is_drawer_open: run_panel.is_drawer_open,
    is_tour_dialog_visible: dashboard.is_tour_dialog_visible,
    onCancelButtonClick: run_panel.onCancelButtonClick,
    onCloseDialog: run_panel.onCloseDialog,
    onEntered: load_modal.onEntered,
    onOkButtonClick: run_panel.onOkButtonClick,
    setActiveTab: dashboard.setActiveTab,
    setBotBuilderTokenCheck: dashboard.setBotBuilderTokenCheck,
    setOnBoardingTokenCheck: dashboard.setOnBoardingTokenCheck,
    toggleStrategyModal: quick_strategy.toggleStrategyModal,
}))(Dashboard);

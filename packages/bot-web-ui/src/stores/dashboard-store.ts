import { action, computed, makeObservable, observable, reaction } from 'mobx';

import { setColors } from '@deriv/bot-skeleton';
import { isMobile } from '@deriv/shared';

import { clearInjectionDiv } from 'Constants/load-modal';

import { setTourSettings, tour_type, TTourType } from '../components/dashboard/dbot-tours/utils';

export interface IDashboardStore {
    active_tab: number;
    dialog_options: { [key: string]: string };
    faq_search_value: string | null;
    has_mobile_preview_loaded: boolean;
    is_web_socket_intialised: boolean;
    initInfoPanel: () => void;
    is_dialog_open: boolean;
    is_file_supported: boolean;
    is_info_panel_visible: boolean;
    is_preview_on_popup: boolean;
    onCloseDialog: () => void;
    onCloseTour: (param: Partial<string>) => void;
    onTourEnd: (step: number, is_tour_active: boolean) => void;
    setActiveTab: (active_tab: number) => void;
    setActiveTabTutorial: (active_tab_tutorials: number) => void;
    setFAQSearchValue: (faq_search_value: string) => void;
    setInfoPanelVisibility: (visibility: boolean) => void;
    setIsFileSupported: (is_file_supported: boolean) => void;
    setWebSocketState: (is_web_socket_intialised: boolean) => void;
    setOpenSettings: (toast_message: string, show_toast: boolean) => void;
    setPreviewOnDialog: (has_mobile_preview_loaded: boolean) => void;
    setStrategySaveType: (param: string) => void;
    show_toast: boolean;
    show_mobile_tour_dialog: boolean;
    showVideoDialog: (param: { [key: string]: string }) => void;
    strategy_save_type: string;
    toast_message: string;
}

export default class DashboardStore implements IDashboardStore {
    root_store: any;

    constructor(root_store: any) {
        makeObservable(this, {
            active_tab_tutorials: observable,
            active_tab: observable,
            dialog_options: observable,
            faq_search_value: observable,
            getFileArray: observable,
            has_file_loaded: observable,
            has_mobile_preview_loaded: observable,
            initInfoPanel: action.bound,
            active_tour: observable,
            is_dialog_open: observable,
            is_file_supported: observable,
            is_info_panel_visible: observable,
            is_preview_on_popup: observable,
            is_tour_dialog_visible: observable,
            is_web_socket_intialised: observable,
            is_dark_mode: computed,
            onCloseDialog: action.bound,
            onCloseTour: action.bound,
            onTourEnd: action.bound,
            setActiveTab: action.bound,
            setActiveTabTutorial: action.bound,
            setWebSocketState: action.bound,
            setFAQSearchValue: action.bound,
            setFileLoaded: action.bound,
            setInfoPanelVisibility: action.bound,
            setIsFileSupported: action.bound,
            setPreviewOnDialog: action.bound,
            setPreviewOnPopup: action.bound,
            setActiveTour: action.bound,
            setTourDialogVisibility: action.bound,
            setOpenSettings: action.bound,
            show_toast: observable,
            show_mobile_tour_dialog: observable,
            showVideoDialog: action.bound,
            strategy_save_type: observable,
            toast_message: observable,
            setStrategySaveType: action.bound,
            setShowMobileTourDialog: action.bound,
        });
        this.root_store = root_store;
        const {
            load_modal: { previewRecentStrategy, current_workspace_id },
        } = this.root_store;

        const refreshBotBuilderTheme = () => {
            Blockly.derivWorkspace.asyncClear();
            Blockly.Xml.domToWorkspace(
                Blockly.Xml.textToDom(Blockly.derivWorkspace.strategy_to_load),
                Blockly.derivWorkspace
            );
        };

        reaction(
            () => this.is_dark_mode,
            () => {
                setColors(this.is_dark_mode);
                if (this.active_tab === 1) {
                    refreshBotBuilderTheme();
                } else {
                    refreshBotBuilderTheme();
                    previewRecentStrategy(current_workspace_id);
                }
            }
        );
        reaction(
            () => this.is_preview_on_popup,
            async is_preview_on_popup => {
                if (is_preview_on_popup) {
                    this.setPreviewOnPopup(false);
                }
            }
        );
        this.initInfoPanel();
    }

    active_tab = 0;
    active_tab_tutorials = 0;
    active_tour_step_number = 0;
    dialog_options = {};
    faq_search_value = '';
    getFileArray = [];
    has_file_loaded = false;
    has_mobile_preview_loaded = false;
    active_tour = '';
    is_dialog_open = false;
    is_file_supported = false;
    is_info_panel_visible = false;
    is_preview_on_popup = false;
    is_tour_dialog_visible = false;
    show_toast = false;
    show_mobile_tour_dialog = false;
    strategy_save_type = 'unsaved';
    toast_message = '';
    is_web_socket_intialised = true;

    get is_dark_mode() {
        const {
            app: {
                core: {
                    ui: { is_dark_mode_on },
                },
            },
        } = this.root_store;
        return is_dark_mode_on;
    }

    setShowMobileTourDialog = (show_mobile_tour_dialog: boolean) => {
        this.show_mobile_tour_dialog = show_mobile_tour_dialog;
    };

    setWebSocketState = (is_web_socket_intialised: boolean) => {
        this.is_web_socket_intialised = is_web_socket_intialised;
    };

    setOpenSettings = (toast_message: string, show_toast = true) => {
        this.toast_message = toast_message;
        this.show_toast = show_toast;
    };

    setIsFileSupported = (is_file_supported: boolean) => {
        this.is_file_supported = is_file_supported;
    };

    initInfoPanel() {
        if (!localStorage.getItem('dbot_should_show_info')) this.is_info_panel_visible = true;
    }

    setTourActiveStep = (active_tour_step_number: number) => {
        this.active_tour_step_number = active_tour_step_number;
    };

    setPreviewOnDialog = (has_mobile_preview_loaded: boolean) => {
        this.has_mobile_preview_loaded = has_mobile_preview_loaded;
        const {
            load_modal: { onLoadModalClose },
        } = this.root_store;
        onLoadModalClose();
    };

    setStrategySaveType = (strategy_save_type: string) => {
        this.strategy_save_type = strategy_save_type;
    };

    setPreviewOnPopup = (is_preview_on_popup: boolean): void => {
        this.is_preview_on_popup = is_preview_on_popup;
    };

    setTourDialogVisibility = (is_tour_dialog_visible: boolean): void => {
        this.is_tour_dialog_visible = is_tour_dialog_visible;
    };

    setActiveTour = (active_tour: string): void => {
        this.active_tour = active_tour;
    };

    setFileLoaded = (has_file_loaded: boolean): void => {
        this.has_file_loaded = has_file_loaded;
        clearInjectionDiv('store', document.getElementById('load-strategy__blockly-container'));
    };

    onCloseDialog = (): void => {
        this.is_dialog_open = false;
    };

    setActiveTab = (active_tab: number): void => {
        this.active_tab = active_tab;
    };

    setActiveTabTutorial = (active_tab_tutorials: number): void => {
        this.active_tab_tutorials = active_tab_tutorials;
    };

    setFAQSearchValue = (faq_search_value: string): void => {
        this.faq_search_value = faq_search_value;
    };

    showVideoDialog = (param: { [key: string]: string }): void => {
        const { url, type } = param;
        const dialog_type = ['google', 'url'];
        if (dialog_type.includes(type)) {
            if (type === 'url') {
                this.dialog_options = {
                    url,
                };
            }
            this.is_dialog_open = true;
        } else {
            this.is_dialog_open = false;
        }
    };

    setInfoPanelVisibility = (is_info_panel_visible: boolean): void => {
        this.is_info_panel_visible = is_info_panel_visible;
    };

    onZoomInOutClick = (is_zoom_in: boolean): void => {
        const workspace = Blockly.mainWorkspace;
        const metrics = workspace.getMetrics();
        const addition = is_zoom_in ? 1 : -1;

        workspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, addition);
    };

    onCloseTour = (): void => {
        setTourSettings(new Date().getTime(), `${tour_type.key}_token`);
        this.setActiveTour('');
    };
    setTourEnd = (param: TTourType): void => {
        const { key } = param;
        if (!isMobile()) this.setTourDialogVisibility(true);
        setTourSettings(new Date().getTime(), `${key}_token`);
    };

    onTourEnd = (step: number, is_tour_active: boolean): void => {
        if (step === 8) {
            this.onCloseTour();
            this.setTourEnd(tour_type);
            this.setActiveTour('');
        }
        if (!is_tour_active && step === 3) {
            this.onCloseTour();
            this.setTourEnd(tour_type);
            this.setActiveTour('');
        }
    };
}

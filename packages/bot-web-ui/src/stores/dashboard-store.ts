import { observable, action } from 'mobx';
import RootStore from './root-store';

export interface IDashboardStore {
    active_tab: number;
    active_tab_tutorials: number;
    faq_search_value: string;
    dialog_options: { [key: string]: string };
    is_dialog_open: boolean;
    is_info_panel_visible: boolean;
    onCloseDialog: () => void;
    setActiveTab: (active_tab: number) => void;
    setActiveTabTutorial: (active_tab_tutorials: number) => void;
    setFAQSearchValue: (faq_search_value: string) => void;
    showVideoDialog: (url: string, component: HTMLVideoElement) => boolean;
    setInfoPanelVisibility: (visibility: boolean) => void;
}

export default class DashboardStore implements IDashboardStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
        this.root_store = root_store;
    }

    @observable active_tab = 0;
    @observable active_tab_tutorials = 0;
    @observable faq_search_value = null || '';
    @observable dialog_options = {};
    @observable is_dialog_open = false;
    @observable is_info_panel_visible = true;
    @observable has_tour_started = false;
    @observable is_tour_dialog_visible = true;

    @action.bound
    setTourDialogVisibility = (is_tour_dialog_visible: boolean): void => {
        this.is_tour_dialog_visible = is_tour_dialog_visible;
    };

    @action.bound
    setTourActive = (has_tour_started: boolean): void => {
        this.has_tour_started = has_tour_started;
    };

    @action.bound
    onCloseDialog(): void {
        this.is_dialog_open = false;
    }
    @action.bound
    setActiveTab(active_tab: number): void {
        this.active_tab = active_tab;
    }
    @action.bound
    setActiveTabTutorial(active_tab_tutorials: number): void {
        this.active_tab_tutorials = active_tab_tutorials;
    }
    @action.bound
    setFAQSearchValue(faq_search_value: string): void {
        this.faq_search_value = faq_search_value;
    }

    @action.bound
    showVideoDialog(type: string, component: HTMLVideoElement): boolean {
        if (type === 'DBotVideo') {
            this.dialog_options = {
                message: component,
            };
            return (this.is_dialog_open = true);
        }
        return (this.is_dialog_open = false);
    }

    @action.bound
    setInfoPanelVisibility(is_info_panel_visible: boolean) {
        this.is_info_panel_visible = is_info_panel_visible;
    }
}

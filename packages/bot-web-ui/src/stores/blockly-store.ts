import { action, observable } from 'mobx';
import { onWorkspaceResize } from '@deriv/bot-skeleton';
import { tabs_title } from 'Constants/bot-contents';
import { storeSetting, getSetting } from 'Utils/settings';

export interface IBlocklyStore {
    is_loading: boolean;
    active_tab: string;
    setActiveTab: (tab: string) => void;
    setContainerSize: () => void;
    onMount: () => void;
    onUnmount: () => void;
    startLoading: () => void;
    getCachedActiveTab: () => void;
    endLoading: () => void;
}

export default class BlocklyStore implements IBlocklyStore {
    private root_store?: RootStore;

    constructor(root_store: RootStore) {
        this.root_store = root_store;
    }

    @observable is_loading = false;

    @observable active_tab = tabs_title.WORKSPACE;

    @action.bound
    setActiveTab(tab: string) {
        this.active_tab = tab;
        storeSetting('active_tab', this.active_tab);
    }

    @action.bound
    setContainerSize() {
        if (this.active_tab === tabs_title.WORKSPACE) {
            onWorkspaceResize();
        }
    }

    @action.bound
    onMount() {
        window.addEventListener('resize', this.setContainerSize);
    }

    @action.bound
    getCachedActiveTab() {
        if (getSetting('active_tab')) {
            this.active_tab = getSetting('active_tab');
        }
    }

    @action.bound
    onUnmount() {
        window.removeEventListener('resize', this.setContainerSize);
    }

    @action.bound
    startLoading() {
        this.is_loading = true;
    }

    @action.bound
    endLoading() {
        this.is_loading = false;
    }
}

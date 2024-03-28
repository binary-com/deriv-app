import React from 'react';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { config, getSavedWorkspaces, load, removeExistingWorkspace, save_types, setColors } from '@deriv/bot-skeleton';
import { TStores } from '@deriv/stores/types';
import { localize } from '@deriv/translations';
import { clearInjectionDiv, tabs_title } from 'Constants/load-modal';
import { TStrategy } from 'Types';
import RootStore from './root-store';

interface ILoadModalStore {
    active_index: number;
    is_load_modal_open: boolean;
    is_explanation_expand: boolean;
    is_open_button_loading: boolean;
    is_strategy_loaded: boolean;
    loaded_local_file: File | null;
    recent_strategies: TStrategy[];
    dashboard_strategies: Array<TStrategy>;
    selected_strategy_id: string | undefined;
    is_strategy_removed: boolean;
    is_delete_modal_open: boolean;
    current_workspace_id: string;
    preview_workspace: Blockly.WorkspaceSvg | null;
    selected_strategy: TStrategy;
    tab_name: string;
    setPreviewedStrategyId: (clicked_id: string) => void;
    getSelectedStrategyID: (current_workspace_id: string) => void;
    refreshStrategies: () => void;
    loadStrategyToBuilder: (param: TStrategy) => void;
    refreshStrategiesTheme: () => void;
    handleFileChange: (
        event: React.MouseEvent | React.FormEvent<HTMLFormElement> | DragEvent,
        is_body: boolean
    ) => boolean;
    loadFileFromLocal: () => void;
    onActiveIndexChange: () => void;
    onDriveConnect: () => void;
    onDriveOpen: () => void;
    onEntered: () => void;
    onLoadModalClose: () => void;
    onToggleDeleteDialog: (is_delete_modal_open: boolean) => void;
    onZoomInOutClick: (is_zoom_in: string) => void;
    previewRecentStrategy: (workspace_id: string) => void;
    setActiveTabIndex: (index: number) => void;
    setLoadedLocalFile: (loaded_local_file: File | null) => void;
    setDashboardStrategies: (strategies: Array<TStrategy>) => void;
    setRecentStrategies: (recent_strategies: TStrategy[]) => void;
    setSelectedStrategyId: (selected_strategy_id: string) => void;
    toggleExplanationExpand: () => void;
    toggleLoadModal: () => void;
    toggleTourLoadModal: (toggle: boolean) => void;
    readFile: (is_preview: boolean, drop_event: DragEvent, file: File) => void;
    updateListStrategies: (workspaces: Array<TStrategy>) => void;
    getRecentFileIcon: (save_type: { [key: string]: string } | string) => string;
    getSaveType: (save_type: { [key: string]: string } | string) => string;
}

export default class LoadModalStore implements ILoadModalStore {
    root_store: RootStore;
    core: TStores;
    previewed_strategy_id = '';

    constructor(root_store: RootStore, core: TStores) {
        makeObservable(this, {
            active_index: observable,
            previewed_strategy_id: observable,
            is_load_modal_open: observable,
            is_explanation_expand: observable,
            is_open_button_loading: observable,
            is_strategy_loaded: observable,
            is_delete_modal_open: observable,
            is_strategy_removed: observable,
            loaded_local_file: observable,
            recent_strategies: observable,
            dashboard_strategies: observable,
            selected_strategy_id: observable,
            current_workspace_id: observable,
            preview_workspace: computed,
            selected_strategy: computed,
            tab_name: computed,
            setPreviewedStrategyId: action.bound,
            getSelectedStrategyID: action.bound,
            refreshStrategies: action.bound,
            loadStrategyToBuilder: action.bound,
            refreshStrategiesTheme: action.bound,
            handleFileChange: action.bound,
            loadFileFromRecent: action.bound,
            loadFileFromLocal: action.bound,
            onActiveIndexChange: action.bound,
            onDriveConnect: action.bound,
            onDriveOpen: action.bound,
            onEntered: action.bound,
            onLoadModalClose: action.bound,
            onZoomInOutClick: action.bound,
            previewRecentStrategy: action.bound,
            setActiveTabIndex: action.bound,
            setLoadedLocalFile: action.bound,
            setRecentStrategies: action.bound,
            setSelectedStrategyId: action.bound,
            toggleExplanationExpand: action.bound,
            toggleLoadModal: action.bound,
            toggleTourLoadModal: action.bound,
            readFile: action.bound,
            resetBotBuilderStrategy: action.bound,
            setDashboardStrategies: action.bound,
            updateListStrategies: action.bound,
        });

        this.root_store = root_store;
        this.core = core;

        reaction(
            () => this.active_index,
            () => this.onActiveIndexChange()
        );
        reaction(
            () => this.is_load_modal_open,
            async is_load_modal_open => {
                if (is_load_modal_open) {
                    this.setRecentStrategies((await getSavedWorkspaces()) || []);
                } else {
                    this.onLoadModalClose();
                }
            }
        );
    }

    recent_workspace: Blockly.WorkspaceSvg | null = null;
    local_workspace: Blockly.WorkspaceSvg | null = null;
    drop_zone: unknown;

    active_index = 0;
    is_load_modal_open = false;
    is_explanation_expand = false;
    is_open_button_loading = false;
    loaded_local_file: File | null = null;
    recent_strategies: Array<TStrategy> = [];
    dashboard_strategies: Array<TStrategy> | [] = [];
    selected_strategy_id = '';
    is_strategy_loaded = false;
    is_delete_modal_open = false;
    is_strategy_removed = false;
    current_workspace_id = '';

    get preview_workspace(): Blockly.WorkspaceSvg | null {
        if (this.tab_name === tabs_title.TAB_LOCAL) return this.local_workspace;
        if (this.tab_name === tabs_title.TAB_RECENT) return this.recent_workspace;
        return null;
    }

    get selected_strategy(): TStrategy {
        return (
            this.dashboard_strategies.find((ws: { id: string }) => ws.id === this.selected_strategy_id) ??
            this.dashboard_strategies[0]
        );
    }

    get tab_name(): string {
        if (this.core.ui.is_mobile) {
            if (this.active_index === 0) return tabs_title.TAB_LOCAL;
            if (this.active_index === 1) return tabs_title.TAB_GOOGLE;
        }
        if (this.active_index === 0) return tabs_title.TAB_RECENT;
        if (this.active_index === 1) return tabs_title.TAB_LOCAL;
        if (this.active_index === 2) return tabs_title.TAB_GOOGLE;
        return '';
    }

    setPreviewedStrategyId = (clicked_id: string) => {
        this.previewed_strategy_id = clicked_id;
    };

    getSelectedStrategyID = (current_workspace_id: string) => {
        this.current_workspace_id = current_workspace_id;
    };

    setDashboardStrategies = (strategies: Array<TStrategy>) => {
        this.dashboard_strategies = strategies;
        if (!strategies.length) {
            this.selected_strategy_id = '';
        }
    };

    getDashboardStrategies = async () => {
        const recent_strategies = await getSavedWorkspaces();
        this.dashboard_strategies = recent_strategies;
    };

    handleFileChange = (
        event: React.MouseEvent | React.FormEvent<HTMLFormElement> | DragEvent,
        is_body = true
    ): boolean => {
        let files;
        if (event.type === 'drop') {
            event.stopPropagation();
            event.preventDefault();

            ({ files } = event.dataTransfer);
        } else {
            ({ files } = event.target);
        }

        const [file] = files;

        if (!is_body) {
            if (file.name.includes('xml')) {
                this.setLoadedLocalFile(file);
                this.getDashboardStrategies();
            } else {
                return false;
            }
        }
        this.readFile(!is_body, event, file);
        event.target.value = '';
        return true;
    };

    resetBotBuilderStrategy = () => {
        const workspace = window.Blockly.derivWorkspace;
        if (workspace) {
            window.Blockly.derivWorkspace.asyncClear();
            window.Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspace.cached_xml.main), workspace);
            window.Blockly.derivWorkspace.strategy_to_load = workspace.cached_xml.main;
        }
    };

    loadStrategyToBuilder = async (strategy: TStrategy) => {
        if (strategy?.id) {
            await load({
                block_string: strategy.xml,
                strategy_id: strategy.id,
                file_name: strategy.name,
                workspace: window.Blockly?.derivWorkspace,
                from: strategy.save_type,
                drop_event: {},
                showIncompatibleStrategyDialog: false,
            });
            window.Blockly.derivWorkspace.strategy_to_load = strategy.xml;
        }
    };

    refreshStrategiesTheme = async () => {
        await load({
            block_string: this.selected_strategy?.xml,
            drop_event: {},
            workspace: this.recent_workspace,
            file_name: this.selected_strategy?.name,
            strategy_id: this.selected_strategy?.id,
            from: this.selected_strategy?.save_type,
            showIncompatibleStrategyDialog: false,
        });
    };

    loadFileFromRecent = async () => {
        this.is_open_button_loading = true;
        if (!this.selected_strategy) {
            window.Blockly.derivWorkspace.asyncClear();
            window.Blockly.Xml.domToWorkspace(
                window.Blockly.Xml.textToDom(window.Blockly.derivWorkspace.strategy_to_load),
                window.Blockly.derivWorkspace
            );
            this.is_open_button_loading = false;
            return;
        }

        removeExistingWorkspace(this.selected_strategy.id);
        await load({
            block_string: this.selected_strategy.xml,
            strategy_id: this.selected_strategy.id,
            file_name: this.selected_strategy.name,
            workspace: window.Blockly.derivWorkspace,
            from: this.selected_strategy.save_type,
            drop_event: {},
            showIncompatibleStrategyDialog: false,
        });
        const recent_files = await getSavedWorkspaces();
        recent_files.map((strategy: TStrategy) => {
            const { xml, id } = strategy;
            if (this.selected_strategy.id === id) {
                window.Blockly.derivWorkspace.strategy_to_load = xml;
            }
        });
        this.is_open_button_loading = false;
        const { toolbar } = this.root_store;
        const { setImportButtonClick } = toolbar;
        setImportButtonClick(false);
    };

    loadFileFromLocal = (): void => {
        this.is_open_button_loading = true;
        if (this.loaded_local_file) {
            this.readFile(false, {} as DragEvent, this.loaded_local_file);
        }
        this.is_open_button_loading = false;
    };

    onActiveIndexChange = (): void => {
        if (this.tab_name === tabs_title.TAB_RECENT) {
            this.previewRecentStrategy(this.selected_strategy_id);
        } else if (this.recent_workspace) {
            setTimeout(() => {
                // Dispose of recent workspace when switching away from Recent tab.
                // Process in next cycle so user doesn't have to wait.
                this.recent_workspace?.dispose();
                this.recent_workspace = null;
            });
        }

        if (this.tab_name === tabs_title.TAB_LOCAL) {
            if (!this.drop_zone) {
                this.drop_zone = document.querySelector('load-strategy__local-dropzone-area');

                if (this.drop_zone) {
                    this.drop_zone.addEventListener('drop', event => this.handleFileChange(event, false));
                }
            }
        }

        // Dispose of local workspace when switching away from Local tab.
        else if (this.local_workspace) {
            setTimeout(() => {
                this.local_workspace?.dispose();
                this.local_workspace = null;
                this.setLoadedLocalFile(null);
            }, 0);
        }

        // Forget about drop zone when not on Local tab.
        if (this.tab_name !== tabs_title.TAB_LOCAL && this.drop_zone) {
            this.drop_zone.removeEventListener('drop', event => this.handleFileChange(event, false));
        }
    };

    onDriveConnect = (): void => {
        const { google_drive } = this.root_store;

        if (google_drive.is_authorised) {
            google_drive.signOut();
        } else {
            google_drive.signIn();
        }
    };

    onDriveOpen = async () => {
        const { loadFile } = this.root_store.google_drive;
        const { xml_doc, file_name } = await loadFile();
        await load({
            block_string: xml_doc,
            file_name,
            workspace: window.Blockly.derivWorkspace,
            from: save_types.GOOGLE_DRIVE,
            drop_event: null,
            strategy_id: null,
            showIncompatibleStrategyDialog: null,
        });

        const { active_tab } = this.root_store.dashboard;
        if (active_tab === 1) this.toggleLoadModal();

        this.root_store.dashboard.is_dialog_open = false;
    };

    onEntered = (): void => {
        this.previewRecentStrategy(this.selected_strategy_id);
    };

    onLoadModalClose = (): void => {
        if (this.recent_workspace) {
            this.recent_workspace = null;
        }
        if (this.local_workspace) {
            this.local_workspace = null;
        }

        this.setActiveTabIndex(0); // Reset to first tab.
        this.setLoadedLocalFile(null);
    };

    onZoomInOutClick = (is_zoom_in: string): void => {
        if (this.preview_workspace) {
            this.preview_workspace.zoomCenter(is_zoom_in ? 1 : -1);
        }
    };

    previewRecentStrategy = (workspace_id: string): void => {
        if (!workspace_id) this.setSelectedStrategyId(this.current_workspace_id);
        else this.setSelectedStrategyId(workspace_id);
        if (!this.selected_strategy) {
            return;
        }
        const {
            dashboard: { active_tab },
        } = this.root_store;
        //removed the dispose here so on switch of tab it does not
        //throw xml error
        if (active_tab === 1 && !this.is_load_modal_open) {
            this.recent_workspace = null;
            this.setLoadedLocalFile(null);
        }

        const dark_mode = document.body.classList.contains('theme--dark');
        setColors(dark_mode);

        //to load the bot on first load
        const ref = document.getElementById('load-strategy__blockly-container');
        if (!ref) {
            // eslint-disable-next-line no-console
            console.warn('Could not find preview workspace element.');
            return;
        }
        if (this.tab_name !== tabs_title.TAB_LOCAL && this.recent_workspace) {
            clearInjectionDiv('store', ref);
            this.recent_workspace.dispose();
            this.recent_workspace = null;
        }
        if (!this.recent_workspace?.rendered) {
            this.recent_workspace = window.Blockly.inject(ref, {
                media: `${__webpack_public_path__}media/`,
                zoom: {
                    wheel: true,
                    startScale: config.workspaces.previewWorkspaceStartScale,
                },
                readOnly: true,
                scrollbars: true,
            });
        }
        this.refreshStrategiesTheme();
    };

    setActiveTabIndex = (index: number): void => {
        this.active_index = index;
    };

    setLoadedLocalFile = (loaded_local_file: File | null): void => {
        this.loaded_local_file = loaded_local_file;
    };

    setRecentStrategies = (recent_strategies: TStrategy[]): void => {
        this.recent_strategies = recent_strategies;
    };

    refreshStrategies = (): void => {
        this.setRecentStrategies(this.recent_strategies);
    };

    setSelectedStrategyId = (selected_strategy_id: string): void => {
        this.selected_strategy_id = selected_strategy_id;
    };

    toggleExplanationExpand = (): void => {
        this.is_explanation_expand = !this.is_explanation_expand;
    };

    toggleLoadModal = (): void => {
        this.is_load_modal_open = !this.is_load_modal_open;
        if (this.selected_strategy_id) this.previewRecentStrategy(this.selected_strategy_id);
        this.setLoadedLocalFile(null);
    };

    toggleTourLoadModal = (toggle = !this.is_load_modal_open) => {
        this.is_load_modal_open = toggle;
    };

    updateListStrategies = (workspaces: Array<TStrategy>): void => {
        if (workspaces) {
            (this.dashboard_strategies as Array<TStrategy>) = workspaces;
        }
    };

    getRecentFileIcon = (save_type: { [key: string]: string } | string): string => {
        switch (save_type) {
            case save_types.UNSAVED:
                return 'IcReports';
            case save_types.LOCAL:
                return 'IcMyComputer';
            case save_types.GOOGLE_DRIVE:
                return 'IcGoogleDrive';
            default:
                return 'IcReports';
        }
    };

    getSaveType = (save_type: { [key: string]: string } | string): string => {
        switch (save_type) {
            case save_types.UNSAVED:
                return localize('Unsaved');
            case save_types.LOCAL:
                return localize('Local');
            case save_types.GOOGLE_DRIVE:
                return localize('Google Drive');
            default:
                return localize('Unsaved');
        }
    };

    onToggleDeleteDialog = (is_delete_modal_open: boolean): void => {
        this.is_delete_modal_open = is_delete_modal_open;
    };

    readFile = (is_preview: boolean, drop_event: DragEvent, file: File): void => {
        const file_name = file?.name.replace(/\.[^/.]+$/, '');
        const reader = new FileReader();
        reader.onload = action(async e => {
            const load_options = {
                block_string: e?.target?.result,
                drop_event,
                from: save_types.LOCAL,
                workspace: null as Blockly.WorkspaceSvg | null,
                file_name: '',
                strategy_id: '',
                showIncompatibleStrategyDialog: false,
            };
            const ref = document.getElementById('load-strategy__blockly-container');
            if (is_preview && ref) {
                this.local_workspace = Blockly.inject(ref, {
                    media: `${__webpack_public_path__}media/`, // eslint-disable-line
                    zoom: {
                        wheel: false,
                        startScale: config.workspaces.previewWorkspaceStartScale,
                    },
                    readOnly: true,
                    scrollbars: true,
                });
                load_options.workspace = this.local_workspace;
            } else {
                load_options.workspace = window.Blockly.derivWorkspace;
                load_options.file_name = file_name;
            }
            await load(load_options);
            const { toolbar } = this.root_store;
            const { setImportButtonClick } = toolbar;
            setImportButtonClick(false);
        });
        reader.readAsText(file);
    };
}

import { observable, action, computed } from 'mobx';
import { localize } from '@deriv/translations';
import { load, config, save_types, getSavedWorkspaces, removeExistingWorkspace } from '@deriv/bot-skeleton';

export default class LoadModalStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable is_load_modal_open = false;
    @observable active_index = 0;
    @observable recent_files = [];
    @observable selected_file_id = '';
    @observable is_explanation_expand = false;
    @observable loaded_local_file = null;
    @observable is_open_button_loading = false;

    recent_workspace;
    local_workspace;
    drop_zone;

    TAB_LOCAL = 'local_tab';
    TAB_GOOGLE = 'google_tab';
    TAB_RECENT = 'recent_tab';

    @computed
    get preview_workspace() {
        if (this.tab_name === this.TAB_LOCAL) return this.local_workspace;
        if (this.tab_name === this.TAB_RECENT) return this.recent_workspace;
        return null;
    }

    @computed
    get tab_name() {
        if (this.root_store.ui.is_mobile) {
            if (this.active_index === 0) return this.TAB_LOCAL;
            if (this.active_index === 1) return this.TAB_GOOGLE;
        }
        if (this.active_index === 0) return this.TAB_RECENT;
        if (this.active_index === 1) return this.TAB_LOCAL;
        if (this.active_index === 2) return this.TAB_GOOGLE;
    }

    @action.bound
    toggleLoadModal() {
        this.is_load_modal_open = !this.is_load_modal_open;

        if (this.is_load_modal_open) {
            this.recent_files = getSavedWorkspaces() || [];
        } else {
            this.cleanUpPreview();
        }
    }

    @action.bound
    setActiveTabIndex(index) {
        this.active_index = index;

        // dispose workspace in recent tab when switch tab
        if (this.tab_name !== this.TAB_RECENT && this.recent_workspace) {
            this.recent_workspace.dispose();
        }

        // preview workspace when switch to recent tab
        if (this.tab_name === this.TAB_RECENT && this.recent_files.length) {
            if (!this.selected_file_id) {
                this.selected_file_id = this.recent_files[0].id;
            }
            this.previewWorkspace(this.selected_file_id);
        }

        // dispose workspace in local tab when switch tab
        if (this.tab_name === this.TAB_LOCAL && this.loaded_local_file && this.local_workspace) {
            this.local_workspace.dispose();
            this.loaded_local_file = null;
        }

        // add drag and drop event listerner when switch to local tab
        if (this.tab_name === this.TAB_LOCAL) {
            this.drop_zone = document.getElementById('import_dragndrop');
            if (this.drop_zone) {
                this.drop_zone.addEventListener('drop', e => this.handleFileChange(e, false));
            }
        } else if (this.drop_zone) {
            this.drop_zone.removeEventListener('drop', e => this.handleFileChange(e, false));
        }
    }

    /** --------- Recent Tab Start --------- */
    @action.bound
    onEntered() {
        if (this.recent_files.length && this.tab_name === this.TAB_RECENT) {
            this.selected_file_id = this.recent_files[0].id;
            this.previewWorkspace(this.selected_file_id);
        }
    }

    @action.bound
    previewWorkspace(id) {
        const selected_file = this.recent_files.find(file => file.id === id);
        if (!selected_file) {
            return;
        }

        const xml_file = selected_file.xml;
        this.selected_file_id = id;

        if (!this.recent_workspace || !this.recent_workspace.rendered) {
            const ref = document.getElementById('load-recent__scratch');
            this.recent_workspace = Blockly.inject(ref, {
                media: `${__webpack_public_path__}media/`, // eslint-disable-line
                zoom: {
                    wheel: false,
                    startScale: config.workspaces.previewWorkspaceStartScale,
                },
                readOnly: true,
                scrollbars: true,
            });
        } else {
            this.recent_workspace.clear();
        }

        load({ block_string: xml_file, drop_event: {}, workspace: this.recent_workspace });
    }

    @action.bound
    onZoomInOutClick(is_zoom_in) {
        this.preview_workspace?.zoomCenter?.(is_zoom_in ? 1 : -1);
    }

    @action.bound
    loadFileFromRecent() {
        this.is_open_button_loading = true;
        const selected_workspace = this.recent_files.find(file => file.id === this.selected_file_id);

        if (!selected_workspace) {
            return;
        }

        removeExistingWorkspace(selected_workspace.id);
        load({
            block_string: selected_workspace.xml,
            strategy_id: selected_workspace.id,
            file_name: selected_workspace.name,
            workspace: Blockly.derivWorkspace,
        });
        this.is_open_button_loading = false;
        this.toggleLoadModal();
    }

    @action.bound
    onExplanationToggle() {
        this.is_explanation_expand = !this.is_explanation_expand;
    }

    // eslint-disable-next-line class-methods-use-this
    getRecentFileIcon(save_type) {
        switch (save_type) {
            case save_types.UNSAVED:
                return 'IcReports';
            case save_types.LOCAL:
                return 'IcDesktop';
            case save_types.GOOGLE_DRIVE:
                return 'IcGoogleDrive';
            default:
                return 'IcReports';
        }
    }

    // eslint-disable-next-line class-methods-use-this
    getSaveType(save_type) {
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
    }
    /** --------- Recent Tab End --------- */

    /** --------- Local Tab Start --------- */
    @action.bound
    handleFileChange(event, is_body = true) {
        let files;
        if (event.type === 'drop') {
            event.stopPropagation();
            event.preventDefault();

            ({ files } = event.dataTransfer);
        } else {
            ({ files } = event.target);
        }

        files = Array.from(files);
        if (!is_body) {
            this.loaded_local_file = files[0];
        }
        this.readFile(!is_body, event, files[0]);
        event.target.value = '';
    }

    // eslint-disable-next-line class-methods-use-this
    readFile(is_preview, drop_event, file) {
        const file_name = file && file.name.replace(/\.[^/.]+$/, '');
        const reader = new FileReader();
        reader.onload = action(e => {
            const load_options = { block_string: e.target.result, drop_event, from: save_types.LOCAL };
            if (is_preview) {
                const ref = document.getElementById('load-local__scratch');
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
                load_options.workspace = Blockly.derivWorkspace;
                load_options.file_name = file_name;
            }
            load(load_options);
        });
        reader.readAsText(file);
    }

    @action.bound
    loadFileFromLocal() {
        this.is_open_button_loading = true;
        this.readFile(false, {}, this.loaded_local_file);
        this.is_open_button_loading = false;
        this.toggleLoadModal();
    }

    @action.bound
    cleanUpPreview() {
        if (this.preview_workspace) {
            this.preview_workspace.dispose();
        }

        this.selected_file_id = null;
        this.loaded_local_file = null;
    }
    /** --------- Local Tab End --------- */

    /** --------- GD Tab Start --------- */
    @action.bound
    async onDriveConnect() {
        const { google_drive } = this.root_store;

        if (google_drive.is_authorised) {
            google_drive.signOut();
        } else {
            google_drive.signIn();
        }
    }

    @action.bound
    async onDriveOpen() {
        const { google_drive } = this.root_store;
        const { loadFile } = google_drive;

        const { xml_doc, file_name } = await loadFile();

        load({ block_string: xml_doc, file_name, workspace: Blockly.derivWorkspace, from: save_types.GOOGLE_DRIVE });
        this.toggleLoadModal();
    }
    /** --------- GD Tab End --------- */
}

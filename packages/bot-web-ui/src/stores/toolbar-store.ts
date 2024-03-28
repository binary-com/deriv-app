import { action, makeObservable, observable } from 'mobx';
import { config, load, runGroupedEvents } from '@deriv/bot-skeleton';
import RootStore from './root-store';

interface IToolbarStore {
    is_animation_info_modal_open: boolean;
    is_dialog_open: boolean;
    file_name: string;
    has_undo_stack: boolean;
    has_redo_stack: boolean;
    is_reset_button_clicked: boolean;
    is_import_button_click: boolean;
    onResetClick: () => void;
    closeResetDialog: () => void;
    onResetOkButtonClick: () => void;
    onSortClick: () => void;
    onUndoClick: (is_redo: boolean) => void;
    onZoomInOutClick: (is_zoom_in: boolean) => void;
    resetDefaultStrategy: () => void;
    setHasUndoStack: () => void;
    setHasRedoStack: () => void;
    setImportButtonClick: (is_import_button_click: boolean) => void;
}

export default class ToolbarStore implements IToolbarStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
        makeObservable(this, {
            is_animation_info_modal_open: observable,
            is_dialog_open: observable,
            file_name: observable,
            has_undo_stack: observable,
            has_redo_stack: observable,
            is_reset_button_clicked: observable,
            onResetClick: action.bound,
            closeResetDialog: action.bound,
            onResetOkButtonClick: action.bound,
            onUndoClick: action.bound,
            resetDefaultStrategy: action.bound,
            setHasUndoStack: action.bound,
            setHasRedoStack: action.bound,
            setImportButtonClick: action.bound,
        });

        this.root_store = root_store;
    }

    is_animation_info_modal_open = false;
    is_dialog_open = false;
    file_name = config.default_file_name;
    has_undo_stack = false;
    has_redo_stack = false;
    is_reset_button_clicked = false;
    is_import_button_click = false;

    setImportButtonClick = (is_import_button_click: boolean) => {
        this.is_import_button_click = is_import_button_click;
    };

    setResetButtonState = (is_reset_button_clicked: boolean): void => {
        this.is_reset_button_clicked = is_reset_button_clicked;
    };

    onResetClick = (): void => {
        this.is_dialog_open = true;
    };

    closeResetDialog = (): void => {
        this.is_dialog_open = false;
    };

    onResetOkButtonClick = (): void => {
        this.setResetButtonState(true);
        runGroupedEvents(
            false,
            () => {
                this.resetDefaultStrategy();
            },
            'reset'
        );
        this.is_dialog_open = false;
    };

    resetDefaultStrategy = async () => {
        const workspace = window.Blockly.derivWorkspace;
        workspace.current_strategy_id = window.Blockly.utils.genUid();
        await load({
            block_string: workspace.cached_xml.main,
            file_name: config.default_file_name,
            workspace,
            drop_event: null,
            strategy_id: null,
            from: null,
            showIncompatibleStrategyDialog: null,
        });
        workspace.strategy_to_load = workspace.cached_xml.main;
        this.setResetButtonState(false);
    };

    onSortClick = () => {
        const {
            workspaces: {
                indentWorkspace: { x, y },
            },
        } = config;
        window.Blockly.derivWorkspace.cleanUp(x, y);
    };

    onUndoClick = (is_redo: boolean): void => {
        window.Blockly.Events.setGroup('undo_clicked');
        window.Blockly.derivWorkspace.undo(is_redo);
        window.Blockly.svgResize(window.Blockly.derivWorkspace); // Called for CommentDelete event.
        this.setHasRedoStack();
        this.setHasUndoStack();
        window.Blockly.Events.setGroup(false);
    };

    onZoomInOutClick = (is_zoom_in: boolean): void => {
        const workspace = window.Blockly.derivWorkspace;
        const metrics = workspace.getMetrics();
        const addition = is_zoom_in ? 1 : -1;

        workspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, addition);
    };

    setHasUndoStack = (): void => {
        this.has_undo_stack = window.Blockly.derivWorkspace?.hasUndoStack();
    };

    setHasRedoStack = (): void => {
        this.has_redo_stack = window.Blockly.derivWorkspace?.hasRedoStack();
    };
}

import { mockStore } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import { mock_ws } from 'Utils/mock';
import { mockDBotStore } from 'Stores/useDBotStore';
import ToolbarStore from '../toolbar-store';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

const mock_undo = jest.fn();
const mock_cleanup = jest.fn();
const mock_zoom = jest.fn();

window.Blockly = {
    derivWorkspace: {
        undo: mock_undo,
        hasRedoStack: jest.fn(),
        hasUndoStack: jest.fn(),
        cached_xml: {
            main: 'main',
        },
        getMetrics: jest.fn(() => ({
            viewWidth: 100,
            viewHeight: 100,
        })),
        zoom: mock_zoom,
        cleanUp: mock_cleanup,
    },
    utils: {
        genUid: jest.fn(),
    },
    Events: {
        setGroup: jest.fn(),
    },
    svgResize: jest.fn(),
};

describe('ToolbarStore', () => {
    const mock_store: TStores = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);
    let toolbarStore: ToolbarStore;

    beforeEach(() => {
        toolbarStore = new ToolbarStore(mock_DBot_store);
    });

    it('should initialize ToolbarStore with default values', () => {
        expect(toolbarStore.is_animation_info_modal_open).toBe(false);
        expect(toolbarStore.is_dialog_open).toBe(false);
        expect(toolbarStore.file_name).toBe('Untitled Bot');
        expect(toolbarStore.has_undo_stack).toBe(false);
        expect(toolbarStore.has_redo_stack).toBe(false);
        expect(toolbarStore.is_reset_button_clicked).toBe(false);
    });

    it('should show dialog on reset button click', () => {
        toolbarStore.onResetClick();
        expect(toolbarStore.is_dialog_open).toBe(true);
    });

    it('should hide dialog on close reset dialog click', () => {
        toolbarStore.closeResetDialog();
        expect(toolbarStore.is_dialog_open).toBe(false);
    });

    it('should not show dialog onResetOkButtonClick', () => {
        toolbarStore.onResetOkButtonClick();
        expect(toolbarStore.is_dialog_open).toBe(false);
        expect(toolbarStore.is_reset_button_clicked).toBe(true);
    });

    it('should show dialog onResetOkButtonClick while bot is running', () => {
        mock_DBot_store.run_panel.setIsRunning(true);
        toolbarStore.onResetOkButtonClick();
        expect(toolbarStore.is_reset_button_clicked).toBe(true);
    });

    it('should call reset default strategy', async () => {
        await toolbarStore.resetDefaultStrategy();
        expect(window.Blockly.derivWorkspace.strategy_to_load).toBe('main');
    });

    it('should call onSortClick', () => {
        toolbarStore.onSortClick();
        expect(mock_cleanup).toHaveBeenCalled();
    });

    it('should handle undo and redo click correctly', () => {
        toolbarStore.onUndoClick(true);
        expect(mock_undo).toHaveBeenCalledWith(true);
    });

    it('should call onZoomInOutClick ', () => {
        toolbarStore.onZoomInOutClick(true);
        expect(mock_zoom).toHaveBeenCalledWith(50, 50, 1);
    });

    it('should call onZoomInOutClick ', () => {
        toolbarStore.onZoomInOutClick(false);
        expect(mock_zoom).toHaveBeenCalledWith(50, 50, -1);
    });
});

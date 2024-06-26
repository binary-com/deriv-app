import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import WorkspaceGroup from '../workspace-group';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));

const mockOnResetClick = jest.fn();
const mockOnSortClick = jest.fn();
const mockOnUndoClick = jest.fn();
const mockOnZoomInOutClick = jest.fn();
const mockToggleLoadModal = jest.fn();
const mockToggleSaveModal = jest.fn();
const mockChartModalVisibility = jest.fn();
const mockSetPreviewOnPopup = jest.fn();
const mockSetTradingViewModalVisibility = jest.fn();

describe('WorkspaceGroup', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({});

    beforeAll(() => {
        let mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        mock_DBot_store = {
            ...mock_DBot_store,
            toolbar: {
                ...mock_DBot_store.toolbar,
                has_redo_stack: true,
                has_undo_stack: true,
                onResetClick: mockOnResetClick,
                onSortClick: mockOnSortClick,
                onUndoClick: mockOnUndoClick,
                onZoomInOutClick: mockOnZoomInOutClick,
            },
            save_modal: {
                ...mock_DBot_store.save_modal,
                toggleSaveModal: mockToggleSaveModal,
            },
            load_modal: {
                ...mock_DBot_store.load_modal,
                toggleLoadModal: mockToggleLoadModal,
                preview_workspace: null,
                selected_strategy: {
                    id: '',
                    name: '',
                    save_type: '',
                    timestamp: 0,
                    xml: '',
                },
                tab_name: '',
            },
            dashboard: {
                ...mock_DBot_store.dashboard,
                setChartModalVisibility: mockChartModalVisibility,
                setPreviewOnPopup: mockSetPreviewOnPopup,
                setTradingViewModalVisibility: mockSetTradingViewModalVisibility,
            },
        };

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render WorkspaceGroup', () => {
        render(<WorkspaceGroup />, {
            wrapper,
        });
        expect(screen.getByTestId('dt_toolbar_group_btn')).toBeInTheDocument();
    });

    it('should call reset function on clicking reset icon', () => {
        render(<WorkspaceGroup />, {
            wrapper,
        });
        const reset_button = screen.getByTestId('dt_toolbar_reset_button');
        userEvent.click(reset_button);
        expect(mockOnResetClick).toBeCalledTimes(1);
    });

    it('should call toggleLoadModal function on clicking import icon', () => {
        render(<WorkspaceGroup />, {
            wrapper,
        });
        const import_button = screen.getByTestId('dt_toolbar_import_button');
        userEvent.click(import_button);
        expect(mockToggleLoadModal).toBeCalledTimes(1);
        expect(mockSetPreviewOnPopup).toBeCalledWith(true);
    });

    it('should call toggleSaveModal function on clicking save icon', () => {
        render(<WorkspaceGroup />, {
            wrapper,
        });
        const save_button = screen.getByTestId('dt_toolbar_save_button');
        userEvent.click(save_button);
        expect(mockToggleSaveModal).toBeCalledTimes(1);
    });

    it('should call onSortClick function on clicking sort icon', () => {
        render(<WorkspaceGroup />, {
            wrapper,
        });
        const sort_button = screen.getByTestId('dt_toolbar_sort_button');
        userEvent.click(sort_button);
        expect(mockOnSortClick).toBeCalledTimes(1);
    });

    it('should call setChartModalVisibility function on clicking charts icon', () => {
        mock_store.ui.is_desktop = true;
        render(<WorkspaceGroup />, {
            wrapper,
        });
        const chart_button = screen.getByTestId('dt_toolbar_chart_button');
        userEvent.click(chart_button);
        expect(mockChartModalVisibility).toBeCalledTimes(1);
    });

    it('should call setTradingViewModalVisibility function on clicking tradingview chart icon', () => {
        mock_store.ui.is_desktop = true;
        render(<WorkspaceGroup />, {
            wrapper,
        });
        const tradingview_chart_button = screen.getByTestId('dt_toolbar_tradingview_chart_button');
        userEvent.click(tradingview_chart_button);
        expect(mockSetTradingViewModalVisibility).toBeCalledTimes(1);
    });

    it('should call onUndoClick function with false on clicking undo icon', () => {
        render(<WorkspaceGroup />, {
            wrapper,
        });
        const undo_button = screen.getByTestId('dt_toolbar_undo_button');
        userEvent.click(undo_button);
        expect(mockOnUndoClick).toBeCalledWith(false);
    });

    it('should call onUndoClick function with true on clicking redo icon', () => {
        render(<WorkspaceGroup />, {
            wrapper,
        });
        const undo_button = screen.getByTestId('dt_toolbar_redo_button');
        userEvent.click(undo_button);
        expect(mockOnUndoClick).toBeCalledWith(true);
    });

    it('should call onZoomInOutClick function with true on clicking zoomIn icon', () => {
        render(<WorkspaceGroup />, {
            wrapper,
        });
        const zoom_button = screen.getByTestId('dt_toolbar_zoom_in_button');
        userEvent.click(zoom_button);
        expect(mockOnZoomInOutClick).toBeCalledWith(true);
    });

    it('should call onZoomInOutClick function with false on clicking zoomOut icon', () => {
        render(<WorkspaceGroup />, {
            wrapper,
        });
        const zoom_button = screen.getByTestId('dt_toolbar_zoom_out_button');
        userEvent.click(zoom_button);
        expect(mockOnZoomInOutClick).toBeCalledWith(false);
    });
});

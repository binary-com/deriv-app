import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { act, render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import WorkspaceWrapper from '../workspace-wrapper';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('../stop-bot-modal', () => jest.fn(() => <div>StopBotModal</div>));

const mockTextToDom = jest.fn(() => {
    const xml_element = document.createElement('xml');
    return xml_element;
});

window.Blockly = {
    utils: {
        Xml: {
            textToDom: mockTextToDom,
        },
        xml: { textToDom: jest.fn() },
    },
    derivWorkspace: {
        options: {},
        getGesture: jest.fn(),
        getVariableMap: jest.fn(),
    },
    VerticalFlyout: jest.fn(() => ({
        workspace_: {
            createPotentialVariableMap: jest.fn(),
        },
    })),
    Options: jest.fn(),
};

describe('WorkspaceWrapper', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        act(() => {
            mock_DBot_store?.blockly_store?.setLoading(false);
            mock_DBot_store?.flyout.setVisibility(true);
        });

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    describe('should render WorkspaceWrapper with inner components', () => {
        mock_store.ui.is_desktop = true;
        beforeEach(() => {
            render(<WorkspaceWrapper />, { wrapper });
        });

        it('should render WorkspaceWrapper with Toolbox component', () => {
            const toolbox_component = screen.getByTestId('dashboard__toolbox');

            expect(toolbox_component).toBeInTheDocument();
        });

        it('should render WorkspaceWrapper with Toolbar component', () => {
            const toolbar_component = screen.getByTestId('dt_dashboard_toolbar');

            expect(toolbar_component).toBeInTheDocument();
        });

        it('should render WorkspaceWrapper with Flyout component', () => {
            const flyout_component = screen.queryByTestId('dt_themed_scrollbars');

            expect(flyout_component).toBeInTheDocument();
            expect(flyout_component).toHaveClass('flyout__content-scrollbar');
        });

        it('should render WorkspaceWrapper with StopBotModal component', () => {
            const stop_bot_modal = screen.queryByText('StopBotModal');

            expect(stop_bot_modal).toBeInTheDocument();
        });
    });

    it('should render empty DOM element when is_loading equals true', () => {
        act(() => {
            mock_DBot_store?.blockly_store?.setLoading(true);
        });

        const { container } = render(<WorkspaceWrapper />, { wrapper });

        expect(container).toBeEmptyDOMElement();
    });

    it('should not render anything in the dom when window.Blockly.derivWorkspace equals undefined', () => {
        window.Blockly.derivWorkspace = undefined;

        const { container } = render(<WorkspaceWrapper />, { wrapper });

        expect(container).toBeEmptyDOMElement();
    });
});

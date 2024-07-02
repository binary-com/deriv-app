import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Flyout from '../flyout';

jest.mock('@deriv/bot-skeleton/src/scratch/xml/main.xml', () => '<xml>sample</xml>');
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

const mockDomToBlock = jest.fn(() => ({
    getHeightWidth: jest.fn(() => ({ height: 100, width: 100 })),
    moveBy: jest.fn(),
    getSvgRoot: jest.fn(),
}));

const mockBlockMeta = {
    display_name: 'Trade Type',
    description: 'Trade Type Description',
};

const mockAddBlockNode = jest.fn();

window.Blockly = {
    Blocks: {
        variables_get: {
            meta: () => mockBlockMeta,
        },
        variables_set: {
            meta: () => mockBlockMeta,
        },
    },
    inject: () => ({}),
    Xml: {
        domToBlock: mockDomToBlock,
        NODE_BLOCK: 'BLOCK',
        NODE_LABEL: 'LABEL',
        NODE_INPUT: 'INPUT',
        NODE_BUTTON: 'BUTTON',
    },
    derivWorkspace: {
        addBlockNode: mockAddBlockNode,
        options: {},
        getGesture: jest.fn(),
        getVariableMap: jest.fn(),
        getToolboxCategoryCallback: () => jest.fn(() => []),
        getButtonCallback: () => (cb: { getTargetWorkspace: () => void }) => {
            cb.getTargetWorkspace();
            mockAddBlockNode();
        },
    },
    bindEventWithChecks_: jest.fn(),
    bindEvent_: jest.fn(),
    svgResize: jest.fn(),
    VerticalFlyout: jest.fn(() => ({
        workspace_: {
            createPotentialVariableMap: jest.fn(),
        },
    })),
    Block: {
        getDimensions: jest.fn(() => ({ width: 100, height: 100 })),
    },
    utils: {
        genUid: jest.fn(() => Date.now()),
    },
    Options: jest.fn(),
};

const mockPushDataLayer = jest.fn();

describe('Flyout', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    const mockBlockNode = document.createElement('div');
    mockBlockNode.setAttribute('type', 'variables_get');

    beforeEach(() => {
        const mock_store = mockStore({
            gtm: {
                pushDataLayer: mockPushDataLayer,
            },
        });
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render properly', () => {
        const { container } = render(<Flyout />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should render help base', () => {
        if (mock_DBot_store) {
            mock_DBot_store.flyout.is_help_content = true;
            mock_DBot_store.flyout.setVisibility(true);
        }
        render(<Flyout />, { wrapper });
        expect(screen.getByTestId('dt_flyout_help_base')).toBeInTheDocument();
    });

    it('should not show any result if the element doesnt match with config', () => {
        const element_block = document.createElement('span');
        if (mock_DBot_store) {
            mock_DBot_store.flyout.setContents([element_block]);
        }
        render(<Flyout />, { wrapper });
        expect(screen.queryByText(/results/i)).not.toBeInTheDocument();
    });

    it('should show `2 results` if there is 2 flyout content', () => {
        const element_block = document.createElement('block');
        const element_label = document.createElement('label');
        element_block.setAttribute('type', 'variables_set');
        element_label.setAttribute('type', 'variables_set');

        if (mock_DBot_store) {
            mock_DBot_store.flyout.is_help_content = false;
            mock_DBot_store?.flyout.setIsSearchFlyout(true);
            mock_DBot_store.flyout.setContents([element_block, element_label]);
        }

        render(<Flyout />, { wrapper });
        expect(screen.getByText(/2 results/i)).toBeInTheDocument();
    });

    it('should render `No results found` if there is no data', () => {
        mock_DBot_store?.flyout.setVisibility(true);
        render(<Flyout />, {
            wrapper,
        });
        expect(screen.getByText(/No results found/i)).toBeInTheDocument();
    });

    it('should send data to GTM', () => {
        mock_DBot_store?.flyout.setVisibility(true);
        mock_DBot_store?.flyout.setIsSearchFlyout(true);

        render(<Flyout />, {
            wrapper,
        });
        expect(mockPushDataLayer).toHaveBeenCalled();
    });

    it('should display flyout content with block', () => {
        const element = document.createElement('block');
        element.setAttribute('type', 'variables_set');
        mock_DBot_store?.flyout.setContents([element]);
        render(<Flyout />, {
            wrapper,
        });
        expect(screen.getByText(mockBlockMeta.display_name)).toBeInTheDocument();
    });

    it('should hide item info if block type is `variables_get` in flyout content with block', () => {
        const element = document.createElement('block');
        element.setAttribute('type', 'variables_get');
        mock_DBot_store?.flyout.setContents([element]);
        render(<Flyout />, {
            wrapper,
        });
        const item_info = screen.queryByText('Learn more');
        expect(item_info).not.toBeInTheDocument();
    });

    it('should show help content if info icon is clicked and is_search_flyout is true', () => {
        const element = document.createElement('block');
        element.setAttribute('type', 'variables_set');
        element.setAttribute('dynamic', `<span></span>`);

        if (mock_DBot_store) {
            mock_DBot_store.flyout.setIsSearchFlyout(true);
            mock_DBot_store.flyout.setContents([element]);
            mock_DBot_store.toolbox.toolbox_examples = {
                childNodes: [],
                // TODO: fix this once toolbox store is converted to TS
            } as unknown as null;
        }
        render(<Flyout />, {
            wrapper,
        });
        userEvent.click(screen.getByText(/Learn more/i));
        expect(screen.getByTestId('flyout-block-workspace')).toBeInTheDocument();
    });

    it('should show help content if info icon is clicked and is_search_flyout is false', () => {
        const element = document.createElement('block');
        element.setAttribute('type', 'variables_set');
        element.setAttribute('id', 'indicators');
        element.setAttribute('dynamic', `<span></span>`);

        if (mock_DBot_store) {
            mock_DBot_store.flyout.setIsSearchFlyout(false);
            mock_DBot_store.flyout.setContents([element]);
            mock_DBot_store.flyout.setSelectedCategory(element);
            mock_DBot_store.toolbox.toolbox_examples = {
                childNodes: [],
                // TODO: fix this once toolbox store is converted to TS
            } as unknown as null;
        }
        render(<Flyout />, {
            wrapper,
        });
        userEvent.click(screen.getByText(/Learn more/i));
        expect(screen.getByTestId('flyout-block-workspace')).toBeInTheDocument();
    });

    it('should display flyout content with label', () => {
        const label = 'Trade Type';
        const element = document.createElement('label');
        element.setAttribute('type', 'variables_set');
        element.setAttribute('text', label);

        mock_DBot_store?.flyout.setContents([element]);
        render(<Flyout />, {
            wrapper,
        });
        expect(screen.getByText(label)).toBeInTheDocument();
    });

    it('should display flyout content with input', () => {
        const name = 'Trade Type';
        const element = document.createElement('input');
        element.setAttribute('name', name);
        element.setAttribute('placeholder', name);

        mock_DBot_store?.flyout.setContents([element]);
        render(<Flyout />, {
            wrapper,
        });
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should display flyout content with button', () => {
        const name = 'Add';
        const element = document.createElement('button');
        element.setAttribute('text', name);
        element.setAttribute('placeholder', name);
        element.setAttribute('callbackKey', '1');
        element.setAttribute('id', 'btn-add');

        mock_DBot_store?.flyout.setContents([element]);
        render(<Flyout />, {
            wrapper,
        });
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should add block to the workspace if add button is clicked', () => {
        const name = 'Add';
        const element = document.createElement('button');
        element.setAttribute('text', name);
        element.setAttribute('placeholder', name);
        element.setAttribute('callbackKey', '1');
        element.setAttribute('id', 'btn-add');

        mock_DBot_store?.flyout.setContents([element]);
        render(<Flyout />, {
            wrapper,
        });
        const button_el = screen.getByRole('button', { name });
        userEvent.click(button_el);
        expect(mockAddBlockNode).toHaveBeenCalled();
    });

    it('should not add block to the workspace if add button is clicked and getButtonCallback is returning null', () => {
        const name = 'Add';
        const element = document.createElement('button');
        element.setAttribute('text', name);
        element.setAttribute('placeholder', name);
        element.setAttribute('callbackKey', '1');
        element.setAttribute('id', 'btn-add');
        mock_DBot_store?.flyout.setContents([element]);
        window.Blockly.derivWorkspace.getButtonCallback = () => null;
        render(<Flyout />, {
            wrapper,
        });
        const button_el = screen.getByRole('button', { name });
        userEvent.click(button_el);
        expect(mockAddBlockNode).not.toHaveBeenCalled();
    });
});

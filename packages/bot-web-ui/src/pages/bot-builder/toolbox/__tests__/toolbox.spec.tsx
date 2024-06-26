import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Toolbox from '../toolbox';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/xml/main.xml', () => '<xml>sample</xml>');

window.Blockly = {
    derivWorkspace: { options: { readonly: jest.fn() }, getToolboxCategoryCallback: jest.fn(() => jest.fn(() => [])) },
    Xml: {
        textToDom: () => ({
            getElementsByTagName: () => ({ length: 0 }),
            childNodes: [
                {
                    tagName: 'CATEGORY',
                    id: 'Trade parameters',
                    getAttribute: () => 'Trade parameters',
                    childNodes: [],
                    children: [],
                },
                {
                    tagName: 'CATEGORY',
                    id: 'Utility',
                    getAttribute: () => 'Utility',
                    childNodes: [
                        {
                            tagName: 'CATEGORY',
                            id: 'Math',
                            getAttribute: () => 'Math',
                            childNodes: [],
                            children: [],
                        },
                    ],
                    children: [
                        {
                            tagName: 'CATEGORY',
                            id: 'Math',
                            getAttribute: () => 'Math',
                            childNodes: [],
                            children: [],
                        },
                    ],
                },
                {
                    tagName: 'NOCATEGORY',
                    id: 'Trade parameters',
                    getAttribute: () => 'Trade parameters',
                    childNodes: [],
                    children: [],
                },
            ],
        }),
    },
};

describe('Toolbox', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({ ui: { is_desktop: true } });

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the Toolbox component', () => {
        const { container } = render(<Toolbox />, { wrapper });

        expect(container).toBeInTheDocument();
    });

    it('should render setVisibility to be false on blocks menu click', () => {
        render(<Toolbox />, { wrapper });
        const blocks_menu = screen.getByTestId('db-toolbox__title');
        expect(screen.getByTestId('db-toolbox__content-wrapper')).toHaveClass('active');

        userEvent.click(blocks_menu);
        expect(screen.getByTestId('db-toolbox__content-wrapper')).not.toHaveClass('active');
    });

    it('should render setFormVisibility to be true on quick strategy button is clicked', () => {
        render(<Toolbox />, { wrapper });

        const quick_strategy_button = screen.getByText('Quick strategy');
        userEvent.click(quick_strategy_button);
        expect(mock_DBot_store?.quick_strategy.is_open).toBeTruthy();
    });

    it('should render flyout when block menu category is clicked', () => {
        render(<Toolbox />, { wrapper });
        const block_menu_category = screen.getByText('Trade parameters');

        userEvent.click(block_menu_category);
        expect(mock_DBot_store?.flyout.is_visible).toBeTruthy();
    });

    it('should not render flyout when block menu subcategory is clicked', () => {
        render(<Toolbox />, { wrapper });
        const block_menu_subcategory = screen.getByText('Utility');

        userEvent.click(block_menu_subcategory);
        expect(mock_DBot_store?.flyout.is_visible).toBeFalsy();
    });

    it('should render flyout when block menu subcategory item is clicked', () => {
        render(<Toolbox />, { wrapper });
        const block_menu_subcategory = screen.getByText('Utility');

        userEvent.click(block_menu_subcategory);
        userEvent.click(screen.getByText('Math'));

        expect(mock_DBot_store?.flyout.is_visible).toBeTruthy();
    });

    it('should render without toolbox component on responsive device', () => {
        mock_store.ui.is_desktop = false;
        render(<Toolbox />, { wrapper });

        expect(screen.queryByTestId('db-toolbox__title')).not.toBeInTheDocument();
    });
});

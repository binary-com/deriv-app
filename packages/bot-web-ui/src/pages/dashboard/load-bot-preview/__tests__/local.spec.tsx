import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Local from '../local';

window.Blockly = {
    derivWorkspace: { asyncClear: () => ({}) },
    Xml: { domToWorkspace: () => ({}), textToDom: () => ({}) },
};

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('local', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

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

    it('should render the Local component', () => {
        const { container } = render(<Local />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render the open button to open bot builder tab', async () => {
        mock_store.ui.is_desktop = true;
        render(<Local />, { wrapper });

        const open_button = screen.getByRole('button', { name: 'Open' });
        userEvent.click(open_button);
        expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER));
    });
});

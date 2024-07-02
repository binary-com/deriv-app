import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NOTIFICATION_TYPE } from 'Components/bot-notification/bot-notification-utils';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import RecentFooter from '../recent-footer';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

window.Blockly = {
    derivWorkspace: { asyncClear: () => ({}) },
    utils: {
        xml: { textToDom: jest.fn() },
    },
    Xml: { domToWorkspace: () => ({}), textToDom: () => ({}) },
};

describe('RecentFooter', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeAll(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render RecentFooter', () => {
        const { container } = render(<RecentFooter />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should render button with Open text without loader', () => {
        render(<RecentFooter />, { wrapper });
        const openButton = screen.getByText('Open');
        expect(openButton).toBeInTheDocument();
        expect(mock_DBot_store?.load_modal?.is_open_button_loading).toBeFalsy();
    });

    it('should render import message and close load modal on open button click', async () => {
        mock_DBot_store?.load_modal?.toggleLoadModal();
        render(<RecentFooter />, { wrapper });
        const openButton = screen.getByText('Open');
        userEvent.click(openButton);

        await waitFor(() => {
            expect(mock_DBot_store?.load_modal?.is_load_modal_open).toBeFalsy();
            expect(mock_DBot_store?.dashboard?.toast_message).toBe(NOTIFICATION_TYPE.BOT_IMPORT);
        });
    });
});

import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import LocalFooter from '../local-footer';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('LocalFooter', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeAll(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render LocalFooter', () => {
        const { container } = render(<LocalFooter />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should open modal on click open button', async () => {
        render(<LocalFooter />, { wrapper });
        const open_button = screen.getByText('Open');
        await userEvent.click(open_button);
        expect(mock_DBot_store?.load_modal?.is_load_modal_open).toBeTruthy();
    });

    it('should render cancel button on mobile', () => {
        mock_store.ui.is_desktop = false;
        render(<LocalFooter />, { wrapper });
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should reset local file on cancel button click', async () => {
        mock_store.ui.is_desktop = false;
        render(<LocalFooter />, { wrapper });
        const cancel_button = screen.getByText('Cancel');
        await userEvent.click(cancel_button);
        expect(mock_DBot_store?.load_modal?.loaded_local_file).toBeNull();
    });
});

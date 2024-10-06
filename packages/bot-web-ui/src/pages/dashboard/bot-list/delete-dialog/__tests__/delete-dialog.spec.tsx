import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import DeleteDialog from '../delete-dialog';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('@deriv/bot-skeleton', () => ({
    ...jest.requireActual('@deriv/bot-skeleton'),
    getSavedWorkspaces: async () => {
        return Promise.resolve([
            {
                id: 'main',
                xml: 'xml',
                strategy_name: 'test',
                is_active: true,
            },
        ]);
    },
}));

window.Blockly = {
    derivWorkspace: {
        asyncClear: () => ({}),
        cached_xml: {
            main: {},
        },
    },
    Xml: { domToWorkspace: () => ({}), textToDom: () => ({}) },
    utils: {
        xml: {
            textToDom: () => ({}),
        },
    },
};

describe('<DeleteDialog />', () => {
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

    it('should render', () => {
        mock_DBot_store?.load_modal.onToggleDeleteDialog(true);
        const { container } = render(<DeleteDialog />, {
            wrapper,
        });
        expect(container).toBeDefined();
        expect(screen.getByText(/Are you sure you want to delete it?/)).not.toBeUndefined();
    });

    it('should close the dialog on click of "No" button', () => {
        mock_DBot_store?.load_modal.onToggleDeleteDialog(true);
        render(<DeleteDialog />, {
            wrapper,
        });
        mock_DBot_store?.quick_strategy?.toggleStopBotDialog();
        const el_no_button = screen.getByText(/No/);
        userEvent.click(el_no_button);
        expect(mock_DBot_store?.load_modal.is_delete_modal_open).toBeFalsy();
    });

    it('should delete the strategy on click of "Yes, Delete" button', () => {
        mock_DBot_store?.load_modal.onToggleDeleteDialog(true);
        render(<DeleteDialog />, {
            wrapper,
        });
        mock_DBot_store?.quick_strategy?.toggleStopBotDialog();
        const el_yes_button = screen.getByRole('button', { name: /Yes, delete/ });
        userEvent.click(el_yes_button);
        expect(mock_DBot_store?.load_modal.is_delete_modal_open).toBeFalsy();
    });

    it('should reset strategies after deleting one strategy', async () => {
        jest.mock('@deriv/bot-skeleton', () => ({
            ...jest.requireActual('@deriv/bot-skeleton'),
            getSavedWorkspaces: async () => {
                return Promise.resolve([]);
            },
        }));

        mock_DBot_store?.load_modal.onToggleDeleteDialog(true);
        mock_DBot_store?.load_modal.setSelectedStrategyId('main');
        render(<DeleteDialog />, {
            wrapper,
        });
        mock_DBot_store?.quick_strategy?.toggleStopBotDialog();
        const el_yes_button = screen.getByRole('button', { name: /Yes, delete/ });
        userEvent.click(el_yes_button);
        await waitFor(() => {
            expect(mock_DBot_store?.load_modal.is_delete_modal_open).toBeFalsy();
        });
    });
});

import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import RecentWorkspace from '../recent-workspace';
import { TRecentStrategy } from '../types';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

jest.mock('Constants/dashboard', () => ({
    ...jest.requireActual('Constants/dashboard'),
    CONTEXT_MENU: [
        ...jest.requireActual('Constants/dashboard').CONTEXT_MENU,
        {
            id: 'mock-action',
            name: 'Mock Action',
            icon: 'icon-bin',
        },
    ],
}));

const mock_strategy: TRecentStrategy = {
    id: 'mock_id',
    name: 'mock strategy name',
    xml: '<xml><fiedl>mock xml</fiedl></xml>',
    save_type: 'unsaved',
    timestamp: 1725272568114,
};

window.Blockly = {
    derivWorkspace: {
        asyncClear: jest.fn(),
    },
    Xml: { domToWorkspace: () => ({}), textToDom: () => ({}) },
    utils: {
        xml: {
            textToDom: () => ({}),
        },
    },
};

jest.useFakeTimers();

describe('<RecentWorkspace />', () => {
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

    it('should render', () => {
        const { container } = render(<RecentWorkspace workspace={mock_strategy} />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText(mock_strategy.name)).toBeInTheDocument();
    });

    it('should open the strategy on click of open icon', () => {
        mock_store.ui.is_desktop = true;
        render(<RecentWorkspace workspace={mock_strategy} />, { wrapper });
        const el_open = screen.getByTestId('dt_desktop_bot_list_action-open');
        userEvent.click(el_open);
        expect(mock_DBot_store?.load_modal?.selected_strategy_id).toBe(mock_strategy.id);
    });

    it('should open the strategy on click of open icon', () => {
        mock_store.ui.is_desktop = true;
        render(<RecentWorkspace workspace={mock_strategy} />, { wrapper });
        const el_open = screen.getByTestId('dt_desktop_bot_list_action-open');
        userEvent.click(el_open);
        expect(mock_DBot_store?.load_modal?.selected_strategy_id).toBe(mock_strategy.id);
    });

    it('should open the strategy on click of open icon on mobile', () => {
        mock_store.ui.is_desktop = false;
        render(<RecentWorkspace workspace={mock_strategy} />, { wrapper });
        const el_open = screen.getByTestId('dt_mobile_bot_list_action-open');
        userEvent.click(el_open);
        expect(mock_DBot_store?.load_modal?.selected_strategy_id).toBe(mock_strategy.id);
    });

    it('should open the save modal on click of save icon', () => {
        mock_store.ui.is_desktop = true;
        render(<RecentWorkspace workspace={mock_strategy} />, { wrapper });
        const el_save = screen.getByTestId('dt_desktop_bot_list_action-save');
        userEvent.click(el_save);
        expect(mock_DBot_store?.save_modal?.is_save_modal_open).toBeTruthy();
    });

    it('should open the delete dialog on click of delete icon', () => {
        mock_store.ui.is_desktop = true;
        render(<RecentWorkspace workspace={mock_strategy} />, { wrapper });
        const el_delete = screen.getByTestId('dt_desktop_bot_list_action-delete');
        userEvent.click(el_delete);
        expect(mock_DBot_store?.load_modal?.is_delete_modal_open).toBeTruthy();
    });

    it('should do nothing if unknown action type is passed', () => {
        mock_store.ui.is_desktop = true;
        render(<RecentWorkspace workspace={mock_strategy} />, { wrapper });
        const el_unknown = screen.getByTestId('dt_desktop_bot_list_action-undefined');
        userEvent.click(el_unknown);
    });

    it('should set the selected strategy id on click of menu', () => {
        mock_store.ui.is_desktop = false;
        render(<RecentWorkspace workspace={mock_strategy} />, { wrapper });
        const el_menu = screen.getByTestId('dt_mobile_menu_icon');
        userEvent.click(el_menu);
        expect(mock_DBot_store?.load_modal.selected_strategy_id).toBe(mock_strategy.id);
    });
});

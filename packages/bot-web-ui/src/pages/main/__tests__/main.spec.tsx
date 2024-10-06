import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Main from '../main';

jest.mock('@deriv/bot-skeleton/src/scratch/xml/main.xml', () => '<xml>sample</xml>');
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

jest.mock('@deriv/bot-skeleton/src/services/api/api-base', () => ({
    ...jest.requireActual('@deriv/bot-skeleton/src/services/api/api-base'),
    api_base: {
        getConnectionStatus: jest.fn(() => 'Closing'),
    },
}));

const mockTerminateBot = jest.fn();

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    ...jest.requireActual('@deriv/bot-skeleton/src/scratch/dbot'),
    terminateBot: async () => {
        mockTerminateBot();
        return Promise.resolve();
    },
}));

const mockUpdateWorkspaceName = jest.fn();

jest.mock('@deriv/bot-skeleton', () => ({
    ...jest.requireActual('@deriv/bot-skeleton'),
    updateWorkspaceName: () => mockUpdateWorkspaceName(),
}));

jest.useFakeTimers();

describe('<Main />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_dbot_store: RootStore | undefined;
    const mock_store = mockStore({
        ui: {
            url_hashed_values: '#undefined',
        },
    });

    beforeAll(() => {
        mock_dbot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_dbot_store}>
                    <Router>{children}</Router>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render', () => {
        mock_dbot_store?.dashboard.setActiveTour('bot_builder');
        const { container } = render(<Main />, { wrapper });
        expect(container).toBeDefined();
    });

    it('should check websocket state on focus to the window', async () => {
        render(
            <>
                <div id='db-animation__stop-button' />
                <Main />
            </>,
            { wrapper }
        );
        window.dispatchEvent(new Event('focus'));
        await waitFor(() => {
            expect(mockTerminateBot).toHaveBeenCalledTimes(1);
        });
    });

    it('should place the trashcan if the drawer is CLOSED', () => {
        mock_store.ui.url_hashed_values = '#bot_builder';
        mock_dbot_store?.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);
        mock_dbot_store?.quick_strategy?.setFormVisibility(true);
        mock_dbot_store?.run_panel?.toggleDrawer(true);
        mock_store.ui.is_desktop = true;

        const mockSetTrashcanPosition = jest.fn();
        window.Blockly = {
            derivWorkspace: {
                trashcan: {
                    setTrashcanPosition: mockSetTrashcanPosition,
                },
            },
        };

        render(<Main />, { wrapper });

        jest.advanceTimersByTime(200);
        expect(mockSetTrashcanPosition).toHaveBeenCalledTimes(1);
    });

    it('should place the trashcan if the drawer is OPEN', () => {
        mock_store.ui.url_hashed_values = '#bot_builder';
        mock_dbot_store?.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);
        mock_dbot_store?.quick_strategy?.setFormVisibility(true);
        mock_dbot_store?.run_panel?.toggleDrawer(false);
        mock_store.ui.is_desktop = true;

        const mockSetTrashcanPosition = jest.fn();
        window.Blockly = {
            derivWorkspace: {
                trashcan: {
                    setTrashcanPosition: mockSetTrashcanPosition,
                },
            },
        };

        render(<Main />, { wrapper });

        jest.advanceTimersByTime(200);
        expect(mockSetTrashcanPosition).toHaveBeenCalledTimes(1);
    });

    it('should update the browser tab title as per the selected strategy if there are any strategies available', () => {
        const mockSetTrashcanPosition = jest.fn();
        window.Blockly = {
            derivWorkspace: {
                trashcan: {
                    setTrashcanPosition: mockSetTrashcanPosition,
                },
            },
        };

        mock_dbot_store?.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);
        const mock_strategy = {
            id: 'mock-strategy',
            name: 'Martingale',
            save_type: 'unsaved',
            timestamp: 1725592657337,
            xml: '<xml><block>mock</block></xml>',
        };
        mock_dbot_store?.load_modal.setDashboardStrategies([mock_strategy]);

        render(<Main />, { wrapper });

        jest.advanceTimersByTime(10);
        expect(mockUpdateWorkspaceName).toHaveBeenCalledTimes(1);
    });

    it('should handle tab change', () => {
        render(<Main />, { wrapper });
        const el_tutorials = screen.getByText(/Tutorials/);
        const mockScrollIntoView = jest.fn();
        el_tutorials.scrollIntoView = mockScrollIntoView;
        userEvent.click(el_tutorials);
        jest.advanceTimersByTime(20);
        expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
    });

    it('should disable the chart tab if the chart popup is open', () => {
        mock_store.ui.url_hashed_values = '#';
        mock_dbot_store?.dashboard.setChartModalVisibility();
        render(<Main />, { wrapper });
        const el_chart = screen.getByText(/Charts/);
        expect(el_chart).toHaveAttribute('id', 'id-charts--disabled');
    });
});

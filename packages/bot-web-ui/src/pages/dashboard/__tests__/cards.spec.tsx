import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Cards from '../cards';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('DashboardComponent', () => {
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

    it('should render with the items', () => {
        const { container } = render(<Cards has_dashboard_strategies={false} is_mobile={false} />, { wrapper });
        expect(container).toBeDefined();
        expect(screen.getByText(/My computer/)).toBeInTheDocument();
        expect(screen.getByText(/Google Drive/)).toBeInTheDocument();
        expect(screen.getByText(/Bot Builder/)).toBeInTheDocument();
        expect(screen.getByText(/Quick strategy/)).toBeInTheDocument();
    });

    it('should open the load modal on click of "My computer"', () => {
        render(<Cards has_dashboard_strategies={false} is_mobile={false} />, { wrapper });
        const el_my_computer = screen.getByText(/My computer/);
        userEvent.click(el_my_computer);
        expect(mock_DBot_store?.load_modal?.active_index).toBe(1);
        expect(mock_DBot_store?.dashboard?.active_tab).toBe(DBOT_TABS.BOT_BUILDER);
        expect(mock_DBot_store?.load_modal?.is_load_modal_open).toBeTruthy();
        mock_DBot_store?.load_modal.toggleLoadModal();
    });

    it('should open the load modal with google drive tab selected on click of "Google Drive"', () => {
        render(<Cards has_dashboard_strategies={false} is_mobile={false} />, { wrapper });
        const el_google_drive = screen.getByText(/Google Drive/);
        userEvent.click(el_google_drive);
        expect(mock_DBot_store?.load_modal?.active_index).toBe(2);
        expect(mock_DBot_store?.dashboard?.active_tab).toBe(DBOT_TABS.BOT_BUILDER);
        expect(mock_DBot_store?.load_modal?.is_load_modal_open).toBeTruthy();
    });

    it('should open the load modal on click of "Local" on mobile', () => {
        render(<Cards has_dashboard_strategies={false} is_mobile={true} />, { wrapper });
        const el_local = screen.getByText(/Local/);
        userEvent.click(el_local);
        expect(mock_DBot_store?.load_modal?.active_index).toBe(0);
        expect(mock_DBot_store?.dashboard?.active_tab).toBe(DBOT_TABS.BOT_BUILDER);
    });

    it('should open the load modal with google drive tab selected on click of "Google Drive" on mobile', () => {
        render(<Cards has_dashboard_strategies={false} is_mobile={true} />, { wrapper });
        const el_google_drive = screen.getByText(/Google Drive/);
        userEvent.click(el_google_drive);
        expect(mock_DBot_store?.load_modal?.active_index).toBe(1);
        expect(mock_DBot_store?.dashboard?.active_tab).toBe(DBOT_TABS.BOT_BUILDER);
        expect(mock_DBot_store?.load_modal?.is_load_modal_open).toBeTruthy();
    });

    it('should selected "Bot Builder" tab on click of "Bot Builder"', () => {
        render(<Cards has_dashboard_strategies={false} is_mobile={false} />, { wrapper });
        const el_bot_builder = screen.getByText(/Bot Builder/);
        userEvent.click(el_bot_builder);
        expect(mock_DBot_store?.dashboard?.active_tab).toBe(DBOT_TABS.BOT_BUILDER);
    });

    it('should open quick strategy modal on click of "Quick Strategy"', () => {
        render(<Cards has_dashboard_strategies={true} is_mobile={false} />, { wrapper });
        const el_quick_strategy = screen.getByText(/Quick strategy/);
        userEvent.click(el_quick_strategy);
        expect(mock_DBot_store?.dashboard?.active_tab).toBe(DBOT_TABS.BOT_BUILDER);
        expect(mock_DBot_store?.quick_strategy.is_open).toBeTruthy();
    });
});

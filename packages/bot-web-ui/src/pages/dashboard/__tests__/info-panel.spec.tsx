import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import InfoPanel from '../info-panel';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('InfoPanel', () => {
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

    it('should render the InfoPanel component', () => {
        mock_store.ui.is_desktop = true;
        const { container } = render(<InfoPanel />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('Welcome to Deriv Bot!')).toBeInTheDocument();
    });

    it('should render the closing of the info panel on close icon click', () => {
        render(<InfoPanel />, { wrapper });

        const close = screen.getByTestId('close-icon');
        userEvent.click(close);
        expect(mock_DBot_store?.dashboard.is_info_panel_visible).toBeFalsy();
    });

    it('should render the switching of tabs upon clicking the text link', () => {
        render(<InfoPanel />, { wrapper });

        const guide_tab = screen.getByText('Deriv Bot - your automated trading partner');
        userEvent.click(guide_tab);
        expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.TUTORIAL));
    });

    it('should render the tutorial tab and FAQ tab', () => {
        render(<InfoPanel />, { wrapper });

        const faq_tab = screen.getByText('What is Deriv Bot?');
        userEvent.click(faq_tab);
        expect(mock_DBot_store?.dashboard.setActiveTabTutorial(1));
    });

    it('should not render to tutorial tab and FAQ tab if no link is present', () => {
        render(<InfoPanel />, { wrapper });

        const text = screen.getByText('Check out these guides and FAQs to learn more about building your bot:');
        userEvent.click(text);
        expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.TUTORIAL)).toBeUndefined();
    });
});

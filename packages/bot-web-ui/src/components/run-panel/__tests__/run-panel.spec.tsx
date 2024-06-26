import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import RunPanel from '../run-panel';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

describe('RunPanel', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeAll(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Router>{children}</Router>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render RunPanel component with content, when it is a mobile version, show_run_panel and active_tour equal empty string ', () => {
        const { container } = render(<RunPanel />, { wrapper });

        expect(container).toBeInTheDocument();
    });

    it('should render RunPanel component with content, when it is a desktop version, show_run_panel and active_tour equal "onboarding" ', () => {
        mock_DBot_store?.dashboard.setActiveTour('onboarding');
        const { container } = render(<RunPanel />, { wrapper });

        expect(container).toBeInTheDocument();
    });

    it('should render RunPanel component with content when it is mobile version', () => {
        mock_store.ui.is_desktop = false;
        mock_DBot_store?.dashboard.setActiveTour('onboarding');

        const { container } = render(<RunPanel />, { wrapper });

        expect(container).toBeInTheDocument();
    });
});

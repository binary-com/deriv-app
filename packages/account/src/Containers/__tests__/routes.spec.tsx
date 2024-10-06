import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import Routes from '../routes';

jest.mock('Components/Routes', () => ({
    ...jest.requireActual('Components/Routes'),
    BinaryRoutes: jest.fn(() => 'MockedBinaryRoutesComponent'),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    PageError: jest.fn(() => 'MockedPageErrorComponent'),
}));

describe('<Routes />', () => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(), // Deprecated
            removeListener: jest.fn(), // Deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
    const history = createBrowserHistory();

    const mock_root_store = mockStore({
        client: {
            is_logged_in: false,
            is_logging_in: false,
        },
    });

    const renderComponent = ({ store_config = mock_root_store }) =>
        render(
            <StoreProvider store={store_config}>
                <Router history={history}>
                    <Routes />
                </Router>
            </StoreProvider>
        );

    it('should show error messages when "has_error = true"', () => {
        const new_store = {
            ...mock_root_store,
            common: {
                ...mock_root_store.common,
                has_error: true,
                error: {
                    header: '',
                    message: '',
                    redirect_label: 'test label',
                    redirectOnClick: jest.fn(),
                    should_clear_error_on_click: true,
                    setError: jest.fn(),
                    redirect_to: '/testurl',
                    should_show_refresh: true,
                },
            },
        };
        renderComponent({ store_config: new_store });

        expect(screen.getByText('MockedPageErrorComponent')).toBeInTheDocument();
    });

    it('should render <BinaryRoutes /> component when "has_error = false"', () => {
        renderComponent({});

        expect(screen.getByText('MockedBinaryRoutesComponent')).toBeInTheDocument();
    });
});

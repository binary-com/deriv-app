import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { PlatformContext } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import BinaryRoutes from '../binary-routes';

jest.mock('Constants/routes-config', () => () => [{}]);
jest.mock('../route-with-sub-routes', () => jest.fn(() => <div>RouteWithSubRoutes</div>));

const mock = mockStore({
    modules: {
        common: {
            current_language: 'EN',
        },
    },
});

const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

const renderComponent = (component: React.ReactElement) => {
    const history = createBrowserHistory();

    return render(
        <PlatformContext.Provider value={{ is_appstore: false, is_deriv_crypto: false, is_pre_appstore: false }}>
            <Router history={history}>{component}</Router>
        </PlatformContext.Provider>,
        { wrapper }
    );
};

describe('<BinaryRoutes />', () => {
    it('should render Loading... then RouteWithSubRoutes with mocked route component', async () => {
        renderComponent(<BinaryRoutes is_logged_in is_logging_in={false} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('RouteWithSubRoutes')).toBeInTheDocument();
        });
    });
});

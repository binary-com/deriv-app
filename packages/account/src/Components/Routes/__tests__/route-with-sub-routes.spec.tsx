import React from 'react';
import { render, screen } from '@testing-library/react';
import { RouteWithSubRoutesRender } from '../route-with-sub-routes';
import { Redirect } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Route: jest.fn(({ exact, path }) => (
        <div>
            <span>
                Route loaded {String(exact)} {path}`
            </span>
        </div>
    )),
}));

afterEach(() => {
    jest.clearAllMocks();
});

describe('<RouteWithSubRoutes />', () => {
    it('should render one <RouteWithSubRoutesRender /> component', () => {
        render(<RouteWithSubRoutesRender />);

        expect(screen.getByText(/Route loaded/)).toBeInTheDocument();
    });

    it('should have props as passed as route', () => {
        const route = { path: '/test', component: Redirect, title: '', exact: true, to: '/root' };
        render(<RouteWithSubRoutesRender {...route} />);
        expect(screen.getByText(/route loaded true \/test/i)).toBeInTheDocument();
    });
});

import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routes } from '@deriv/shared';
import { RouteButton } from '../route-button';

describe('<RouteButton/>', () => {
    const history = createBrowserHistory();
    const renderWithRouter = (component: React.ReactElement) => {
        return render(<Router history={history}>{component}</Router>);
    };

    it('should render RouteButton component', () => {
        renderWithRouter(<RouteButton button_label='Test Route Button' route={routes.traders_hub} />);
        screen.getByRole('link', {
            name: 'Test Route Button',
        });
        expect(screen.getByText('Test Route Button')).toBeInTheDocument();
    });

    it('should navigate to route on clicking the text', () => {
        renderWithRouter(<RouteButton button_label='Test Route Button' route={routes.traders_hub} />);
        const route_btn_text = screen.getByRole('link', {
            name: 'Test Route Button',
        });
        userEvent.click(route_btn_text);
        expect(history.location.pathname).toBe(routes.traders_hub);
    });
});

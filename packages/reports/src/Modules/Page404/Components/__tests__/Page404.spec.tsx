import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import Page404 from '../Page404';
import { routes } from '@deriv/shared';

describe('Page404', () => {
    const history = createBrowserHistory();
    const renderWithRouter = (component: React.ReactNode) => render(<Router history={history}>{component}</Router>);

    it('should render Page404', () => {
        renderWithRouter(<Page404 />);
        expect(screen.getByText('We couldn’t find that page')).toBeInTheDocument();
        expect(
            screen.getByText('You may have followed a broken link, or the page has moved to a new address.')
        ).toBeInTheDocument();
        expect(screen.getByText('Error code: 404 page not found')).toBeInTheDocument();
        expect(screen.getByText('Return to trade')).toBeInTheDocument();
    });

    it('should redirect to trade page on clicking return to trade button', () => {
        renderWithRouter(<Page404 />);
        const returnToTradeButoon = screen.getByText('Return to trade');
        expect(returnToTradeButoon).toBeInTheDocument();
        returnToTradeButoon.click();
        expect(history.location.pathname).toBe(routes.trade);
    });
});

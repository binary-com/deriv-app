import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import Page404 from '../Page404';

describe('Page404', () => {
    const browser_history = createBrowserHistory();

    it('should render Page404', () => {
        render(
            <Router history={browser_history}>
                <Page404 />
            </Router>
        );

        expect(screen.getByText('We couldn’t find that page')).toBeInTheDocument();
    });
});

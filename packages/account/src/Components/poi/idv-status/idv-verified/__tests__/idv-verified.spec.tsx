import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { fireEvent, render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import IdvVerified from '../idv-verified';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    DerivLightApprovedPoiIcon: () => 'DerivLightApprovedPoiIcon',
}));
describe('<IdvVerified />', () => {
    const needs_poa_header = /your id is verified\. you will also need to submit proof of your address\./i;
    const idv_passed_header = /id verification passed/i;

    const needs_poa_text = /next, we'll need your proof of address\./i;
    const submit_text = /submit proof of address/i;

    const history = createBrowserHistory();
    const renderWithRouter = (component: React.ReactElement) => render(<Router history={history}>{component}</Router>);

    it('should render the IdvVerified component when needs_poa is true and is_from_external is false in desktop', () => {
        renderWithRouter(<IdvVerified needs_poa />);
        expect(screen.getByTestId('poi_idv_verified_container')).toBeInTheDocument();
        expect(screen.getByText(/DerivLightApprovedPoiIcon/i)).toBeInTheDocument();
        expect(screen.getByText(needs_poa_header)).toBeInTheDocument();
        expect(screen.getByText(needs_poa_text)).toBeInTheDocument();
        expect(screen.getByText(submit_text)).toBeInTheDocument();
        expect(history.location.pathname).not.toBe('/account/proof-of-address');
        fireEvent.click(screen.getByText(submit_text));
        expect(screen.getByRole('link', { name: submit_text })).toHaveAttribute('href', '/account/proof-of-address');
        expect(history.location.pathname).toBe('/account/proof-of-address');
    });

    it('should render the IdvVerified component when needs_poa is false and is_from_external is true in mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        renderWithRouter(<IdvVerified is_from_external />);
        expect(screen.getByTestId('poi_idv_verified_container')).toBeInTheDocument();
        expect(screen.getByText(/DerivLightApprovedPoiIcon/i)).toBeInTheDocument();
        expect(screen.getByText(idv_passed_header)).toBeInTheDocument();
        expect(screen.queryByText(needs_poa_text)).not.toBeInTheDocument();
        expect(screen.queryByText(submit_text)).not.toBeInTheDocument();
    });
});

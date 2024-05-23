import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { MissingPersonalDetails } from '../missing-personal-details';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(props => <div>{props.icon}</div>),
    };
});

describe('<MissingPersonalDetails />', () => {
    const renderWithRouter = component => render(<BrowserRouter>{component}</BrowserRouter>);

    it('should render the MissingPersonalDetails component', () => {
        renderWithRouter(<MissingPersonalDetails />);

        expect(screen.getByText(/your personal details are missing/i)).toBeInTheDocument();
        const btn = screen.getByRole('link', { name: /go to personal details/i });
        expect(btn).toBeInTheDocument();
        expect(btn.hasAttribute('href'));
        expect(btn.hasAttribute('/account/personal-details'));
    });

    it('should show invalid msg and update link if has_invalid_postal_code is true', () => {
        renderWithRouter(<MissingPersonalDetails has_invalid_postal_code from='proof_of_identity' />);

        expect(screen.getByText(/your postal code is invalid/i)).toBeInTheDocument();
        expect(
            screen.getByText(/please check and update your postal code before submitting proof of identity\./i)
        ).toBeInTheDocument();
        expect(screen.getByText('IcAccountMissingDetails')).toBeInTheDocument();

        const btn = screen.getByRole('link', { name: /update postal code/i });
        expect(btn).toBeInTheDocument();
        expect(btn.hasAttribute('href'));
        expect(btn.hasAttribute('/account/personal-details?from=proof_of_identity#address_postcode'));
    });

    it('should show missing msg with proper icon if has_invalid_postal_code is false', () => {
        renderWithRouter(<MissingPersonalDetails from='proof_of_identity' />);

        expect(screen.getByText(/your personal details are missing/i)).toBeInTheDocument();
        expect(
            screen.getByText(/please complete your personal details before you verify your identity\./i)
        ).toBeInTheDocument();
        expect(screen.getByText('IcAccountMissingDetails')).toBeInTheDocument();

        const btn = screen.getByRole('link', { name: /go to personal details/i });
        expect(btn).toBeInTheDocument();
        expect(btn.hasAttribute('href'));
        expect(btn.hasAttribute('/account/personal-details?from=proof_of_identity'));
    });

    it('should show missing msg with proper icon if has_invalid_postal_code is false', () => {
        render(
            <BrowserRouter>
                <MissingPersonalDetails />
            </BrowserRouter>
        );

        expect(screen.getByText(/your personal details are missing/i)).toBeInTheDocument();
        expect(
            screen.getByText(/please complete your personal details before you verify your identity\./i)
        ).toBeInTheDocument();
        expect(screen.getByText('IcAccountMissingDetails')).toBeInTheDocument();

        const btn = screen.getByRole('link', { name: /go to personal details/i });
        expect(btn).toBeInTheDocument();
        expect(btn.hasAttribute('href'));
        expect(btn.hasAttribute('/account/personal-details'));
    });
});

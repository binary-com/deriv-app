import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@deriv/components';
import { UploadComplete } from '../upload-complete';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../../../poa/poa-button', () => jest.fn(() => <div>Next</div>));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div data-testid='dt_mocked_icon' />),
    };
});

describe('<UploadComplete />', () => {
    const successful_upload_message = /Review in progress/i;
    const poi_under_review_message =
        /Your proof of identity is under review\. We’ll get back to you within 5 minutes./i;
    const poi_under_review_message_for_manual =
        /Your proof of identity is under review\. We’ll get back to you within 1–3 working days\./i;
    const redirect_button = <Button>Lorem Ipsom</Button>;
    const needs_poa_extra_submit_message = /To start trading, you also need to verify your address./i;

    const renderWithRouter = (component: React.ReactElement) => render(<BrowserRouter>{component}</BrowserRouter>);

    it('should render <UploadComplete /> component for manual upload', () => {
        renderWithRouter(<UploadComplete is_manual_upload />);
        expect(screen.getByText(successful_upload_message)).toBeInTheDocument();
        expect(screen.getByText(poi_under_review_message_for_manual)).toBeInTheDocument();
        expect(screen.getByTestId(/dt_mocked_icon/i)).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    it('should render <UploadComplete /> component for idv and onfido upload', () => {
        renderWithRouter(<UploadComplete />);

        expect(screen.getByText(successful_upload_message)).toBeInTheDocument();
        expect(screen.getByText(poi_under_review_message)).toBeInTheDocument();
        expect(screen.getByTestId(/dt_mocked_icon/i)).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should not show redirect_button if it redirect_button passed and is_from_external is true, but needs_poa is false', () => {
        renderWithRouter(<UploadComplete is_from_external redirect_button={redirect_button} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should show redirect button if needs_poa and is_from_external are false and have redirect button', () => {
        renderWithRouter(<UploadComplete redirect_button={redirect_button} />);

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should show needs_poa review message and extra submission message, and poa_buttons', () => {
        renderWithRouter(<UploadComplete needs_poa redirect_button={redirect_button} />);

        expect(screen.getByText(poi_under_review_message)).toBeInTheDocument();
        expect(screen.getByText(needs_poa_extra_submit_message)).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('Lorem Ipsom');
    });

    it('should show needs_poa review message and extra submission message, and poa_buttons but redirect_button will not display', () => {
        renderWithRouter(<UploadComplete needs_poa is_from_external redirect_button={redirect_button} />);

        expect(screen.getByText(poi_under_review_message)).toBeInTheDocument();
        expect(screen.getByText(needs_poa_extra_submit_message)).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });
});

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { screen, render } from '@testing-library/react';
import { Submitted } from '../submitted';

jest.mock('Components/poa/continue-trading-button/continue-trading-button', () => ({
    ContinueTradingButton: jest.fn(() => <div data-testid='continue-trading-button' />),
}));

describe('<Submitted />', () => {
    const renderWithRouter = (component: React.ReactNode) => {
        return render(<BrowserRouter>{component}</BrowserRouter>);
    };

    it('should render the Submitted component', () => {
        renderWithRouter(<Submitted needs_poi />);
        expect(screen.getByText('Review in progress')).toBeInTheDocument();
    });

    it('should show submit_poi message if needs_poi is true', () => {
        renderWithRouter(<Submitted needs_poi />);
        expect(screen.getByText('To start trading, you also need to verify your identity.')).toBeInTheDocument();
    });

    it('should show review message if needs_poi is true', () => {
        renderWithRouter(<Submitted needs_poi />);
        expect(
            screen.getByText('Your proof of address is under review. We’ll get back to you in 1–3 working days.')
        ).toBeInTheDocument();
    });

    it('should show ContinueTradingButton if no props are passed', () => {
        renderWithRouter(<Submitted />);
        expect(screen.getByText("Return to Trader's Hub")).toBeInTheDocument();
    });
});

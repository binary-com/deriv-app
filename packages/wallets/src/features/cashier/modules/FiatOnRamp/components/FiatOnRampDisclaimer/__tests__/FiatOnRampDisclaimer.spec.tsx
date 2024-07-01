import React from 'react';
import { useMutation } from '@deriv/api-v2';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FiatOnRampDisclaimer from '../FiatOnRampDisclaimer';

jest.mock('@deriv/api-v2', () => ({
    useMutation: jest.fn(),
}));
const mockUseMutation = useMutation as jest.Mock;

jest.mock('@deriv-com/ui', () => ({
    Loader: jest.fn(() => <div>Loading...</div>),
}));

describe('FiatOnRampDisclaimer', () => {
    beforeEach(() => {
        mockUseMutation.mockReturnValue({
            data: { service_token: { banxa: { url: 'https://mocked_banxa_url/' } } },
            isLoading: false,
            mutate: jest.fn(variables => {
                expect(variables).toEqual({ payload: { referrer: window.location.href, service: 'banxa' } });
            }),
        });
    });

    it('should render component correctly', () => {
        const handleDisclaimer = jest.fn();
        render(<FiatOnRampDisclaimer handleDisclaimer={handleDisclaimer} />);

        expect(screen.getByText('Disclaimer')).toBeInTheDocument();
        expect(
            screen.getByText(/Please note that Deriv is not responsible for the content or services provided by Banxa./)
        ).toBeInTheDocument();
        expect(screen.getByText('Back')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    it('should render loader while loading', () => {
        mockUseMutation.mockReturnValue({
            data: { service_token: { banxa: { url: 'https://mocked_banxa_url/' } } },
            isLoading: true,
            mutate: jest.fn(variables => {
                expect(variables).toEqual({ payload: { referrer: window.location.href, service: 'banxa' } });
            }),
        });
        const handleDisclaimer = jest.fn();

        render(<FiatOnRampDisclaimer handleDisclaimer={handleDisclaimer} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should call handleDisclaimer function on "Back" button click', () => {
        const handleDisclaimer = jest.fn();
        render(<FiatOnRampDisclaimer handleDisclaimer={handleDisclaimer} />);
        fireEvent.click(screen.getByText('Back'));

        expect(handleDisclaimer).toHaveBeenCalled();
    });

    it('should redirect to Banxa provider on "Continue" button click', async () => {
        const handleDisclaimer = jest.fn();
        const originalWindowOpen = window.open;
        window.open = jest.fn();

        render(<FiatOnRampDisclaimer handleDisclaimer={handleDisclaimer} />);

        fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith('https://mocked_banxa_url/', '_blank');
            expect(mockUseMutation).toHaveBeenCalledWith('service_token');
        });

        window.open = originalWindowOpen;
    });
});

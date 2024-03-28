import React from 'react';
import { useResidenceList } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { POICountrySelector } from '../POICountrySelector';

jest.mock('@deriv/api-v2', () => ({
    useResidenceList: jest.fn().mockReturnValue({ data: [] }),
}));

const mockResidenceListResponse = [
    {
        identity: {},
        text: 'Country 1',
        value: 'country1',
    },
    {
        identity: {},
        text: 'Country 2',
        value: 'country2',
    },
];

describe('POICountrySelector', () => {
    it('should render component', () => {
        render(<POICountrySelector handleNext={jest.fn()} onCountrySelect={jest.fn()} />);
        expect(screen.getByText('In which country was your document issued?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled();
    });

    it('should render error message when Verification failed', () => {
        render(<POICountrySelector errorStatus='error' handleNext={jest.fn()} onCountrySelect={jest.fn()} />);
        expect(screen.getByText('Your identity verification failed because:')).toBeInTheDocument();
        expect(
            screen.getByText('We were unable to verify the identity document with the details provided.')
        ).toBeInTheDocument();
    });

    it('should enable Next button when country is selected', async () => {
        (useResidenceList as jest.Mock).mockReturnValue({ data: mockResidenceListResponse });
        render(<POICountrySelector handleNext={jest.fn()} onCountrySelect={jest.fn()} />);
        const elCountrySelector = screen.getByRole('combobox', { name: /Country/ });
        const elNextButton = screen.getByRole('button', { name: /Next/ });
        expect(elNextButton).toBeDisabled();

        userEvent.click(elCountrySelector);
        userEvent.click(screen.getByText('Country 1'));

        await waitFor(() => {
            expect(elCountrySelector).toHaveValue('Country 1');
        });

        expect(elNextButton).toBeEnabled();
    });

    it('should call onCountrySelect when country is selected', async () => {
        (useResidenceList as jest.Mock).mockReturnValue({ data: mockResidenceListResponse });
        const onCountrySelect = jest.fn();
        render(<POICountrySelector handleNext={jest.fn()} onCountrySelect={onCountrySelect} />);
        const elCountrySelector = screen.getByRole('combobox', { name: /Country/ });

        userEvent.click(elCountrySelector);
        userEvent.click(screen.getByText('Country 1'));

        await waitFor(() => {
            expect(onCountrySelect).toHaveBeenCalledWith('country1');
        });
    });

    it('should call handleNext when Next button is clicked', async () => {
        (useResidenceList as jest.Mock).mockReturnValue({ data: mockResidenceListResponse });
        const handleNext = jest.fn();
        render(<POICountrySelector handleNext={handleNext} onCountrySelect={jest.fn()} />);
        const elCountrySelector = screen.getByRole('combobox', { name: /Country/ });
        const elNextButton = screen.getByRole('button', { name: /Next/ });

        userEvent.click(elCountrySelector);
        userEvent.click(screen.getByText('Country 1'));

        await waitFor(() => {
            expect(elCountrySelector).toHaveValue('Country 1');
        });

        userEvent.click(elNextButton);

        await waitFor(() => {
            expect(handleNext).toHaveBeenCalled();
        });
    });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { AdditionalKycInfoForm } from '../additional-kyc-info-form';
import userEvent from '@testing-library/user-event';

jest.mock('../../../../../api/src/hooks', () => ({
    useSettings: () => ({
        update: jest.fn(),
        mutation: { isLoading: false, isSuccess: false, error: null, isError: false },
        data: {
            tax_identification_number: '',
            tax_residence: '',
            place_of_birth: '',
            account_opening_reason: '',
        },
    }),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    generateValidationFunction: jest.fn(),
}));

describe('AdditionalKycInfoForm', () => {
    const setError = jest.fn();
    const mock_store = mockStore({});

    it('should render the form fields', () => {
        render(
            <StoreProvider store={mock_store}>
                <AdditionalKycInfoForm setError={setError} />
            </StoreProvider>
        );

        expect(screen.getByTestId('dt_place_of_birth')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tax_residence')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tax_identification_number')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_opening_reason')).toBeInTheDocument();
    });

    it('should submit the form when all fields are valid', async () => {
        render(
            <StoreProvider store={mock_store}>
                <AdditionalKycInfoForm setError={setError} />
            </StoreProvider>
        );

        const submit_btn = screen.getByRole('button', { name: 'Submit' });
        expect(submit_btn).toBeDisabled();

        userEvent.type(screen.getByTestId('dt_place_of_birth'), 'Ghana');
        userEvent.type(screen.getByTestId('dt_tax_residence'), 'Ghana');
        userEvent.type(screen.getByTestId('dt_tax_identification_number'), 'GHA-000000000-0');
        userEvent.type(screen.getByTestId('dt_account_opening_reason'), 'Speculative');

        await waitFor(() => {
            expect(submit_btn).toBeEnabled();
        });
        userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });

    it('should show an error message if form validation fails', async () => {
        render(
            <StoreProvider store={mock_store}>
                <AdditionalKycInfoForm setError={setError} />
            </StoreProvider>
        );

        const submit_btn = screen.getByRole('button', { name: 'Submit' });
        expect(submit_btn).toBeDisabled();

        userEvent.type(screen.getByTestId('dt_place_of_birth'), 'Ghana');
        userEvent.type(screen.getByTestId('dt_tax_residence'), 'Ghana');
        userEvent.type(screen.getByTestId('dt_tax_identification_number'), 'GHA-00000000');
        userEvent.type(screen.getByTestId('dt_account_opening_reason'), 'Speculative');

        userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });
});

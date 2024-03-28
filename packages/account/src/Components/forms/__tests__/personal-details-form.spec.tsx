import React from 'react';
import { Formik } from 'formik';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PersonalDetailsForm from '../personal-details-form';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: () => <div>Mocked Link Component</div>,
}));

describe('PersonalDetailsForm', () => {
    const mock_props = {
        editable_fields: ['salutation'],
        salutation_list: [
            { value: 'Mr', label: 'Mr' },
            { value: 'Ms', label: 'Ms' },
        ],
    };

    const renderComponent = () => {
        render(
            <Formik initialValues={{ salutation: '' }} onSubmit={jest.fn()}>
                <PersonalDetailsForm {...mock_props} />
            </Formik>
        );
    };

    it("should display the salutations 'Mr' and 'Ms' on screen", () => {
        renderComponent();

        expect(screen.getByRole('radio', { name: 'Mr' })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'Ms' })).toBeInTheDocument();
    });

    it('should select the respective salutation when radio button is clicked', () => {
        renderComponent();

        const mr_radio_input = screen.getByRole('radio', { name: 'Mr' });
        const ms_radio_input = screen.getByRole('radio', { name: 'Ms' });

        expect(mr_radio_input).not.toBeChecked();
        expect(ms_radio_input).not.toBeChecked();

        userEvent.click(mr_radio_input);
        expect(mr_radio_input).toBeChecked();
        expect(ms_radio_input).not.toBeChecked();

        userEvent.click(ms_radio_input);
        expect(mr_radio_input).not.toBeChecked();
        expect(ms_radio_input).toBeChecked();
    });

    it('should display crs confirmation checkbox if tax residence & tin fields are filled', () => {
        render(
            <Formik
                initialValues={{ tax_residence: '', tax_identification_number: '', crs_confirmation: false }}
                onSubmit={jest.fn()}
            >
                <PersonalDetailsForm is_svg />
            </Formik>
        );

        fireEvent.change(screen.getByTestId('tax_residence'), { target: { value: 'Afghanistan' } });
        fireEvent.change(screen.getByTestId('tax_identification_number'), { target: { value: '1234567890' } });

        expect(
            screen.queryByLabelText(/i confirm that my tax information is accurate and complete/i)
        ).toBeInTheDocument();
    });

    it('should hide tax residence and tin field if tin_manually_approved is true', () => {
        render(
            <Formik
                initialValues={{ tax_residence: '', tax_identification_number: '', crs_confirmation: false }}
                onSubmit={jest.fn()}
            >
                <PersonalDetailsForm tin_manually_approved />
            </Formik>
        );

        expect(screen.queryByTestId('tax_residence')).not.toBeInTheDocument();
        expect(screen.queryByTestId('tax_identification_number')).not.toBeInTheDocument();
    });
});

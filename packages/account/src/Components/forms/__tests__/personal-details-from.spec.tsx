import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonalDetailsForm from '../personal-details-form';
import { Formik } from 'formik';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: () => <div>Mocked Link Component</div>,
}));

describe('PersonalDetailsForm', () => {
    const mock_props = {
        editable_fields: ['salutation'],
        is_fully_authenticated: true,
        is_qualified_for_poa: true,
        salutation_list: [
            { value: 'Mr', label: 'Mr' },
            { value: 'Ms', label: 'Ms' },
        ],
    };

    const renderComponent = (mock_props_override = {}) => {
        const component_props = { ...mock_props, ...mock_props_override };
        return render(
            <Formik initialValues={{ salutation: '' }} onSubmit={jest.fn()}>
                <PersonalDetailsForm {...component_props} />
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
});

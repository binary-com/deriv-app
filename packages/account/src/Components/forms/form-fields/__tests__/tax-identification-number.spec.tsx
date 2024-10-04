import React from 'react';
import { Formik } from 'formik';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaxIdentificationNumber from '../tax-indentification-number';

describe('Testing <TaxIdentificationNumber/> component', () => {
    const renderFunction = (props: React.ComponentProps<typeof TaxIdentificationNumber>) =>
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <TaxIdentificationNumber {...props} />
            </Formik>
        );

    it('should render TIN Field component', () => {
        const props: React.ComponentProps<typeof TaxIdentificationNumber> = {
            required: true,
            disabled: false,
            is_tin_popover_open: true,
            setIsTinPopoverOpen: jest.fn(),
            setIsTaxResidencePopoverOpen: jest.fn(),
        };

        renderFunction(props);

        expect(screen.getByText(/Tax identification number*/)).toBeInTheDocument;
    });

    it('should render TIN Field component without required', () => {
        const props: React.ComponentProps<typeof TaxIdentificationNumber> = {
            required: false,
            disabled: false,
            is_tin_popover_open: true,
            setIsTinPopoverOpen: jest.fn(),
            setIsTaxResidencePopoverOpen: jest.fn(),
        };

        renderFunction(props);

        expect(screen.getByText(/Tax identification number/)).toBeInTheDocument;
    });

    it('should open popover dialog when hovered', () => {
        const props: React.ComponentProps<typeof TaxIdentificationNumber> = {
            required: false,
            disabled: false,
            is_tin_popover_open: true,
            setIsTinPopoverOpen: jest.fn(),
            setIsTaxResidencePopoverOpen: jest.fn(),
        };

        renderFunction(props);

        const popover = screen.getByTestId('tax_identification_number_pop_over');
        userEvent.click(popover);
        expect(props.setIsTaxResidencePopoverOpen).toBeCalledWith(false);
        expect(props.setIsTinPopoverOpen).toBeCalledWith(true);
    });
});

import React from 'react';
import { Formik } from 'formik';
import { useAuthorize, useSettings, useStatesList } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import { AddressFields } from '../AddressFields';

jest.mock('@deriv/api');

jest.mock('@deriv/quill-design', () => ({
    useBreakpoint: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('../../../components/FormFields/FormDropDownField', () => {
    return jest.fn(() => <div data-testid='dt_dropdown' />);
});

beforeEach(() => {
    (useAuthorize as jest.Mock).mockReturnValue({
        data: {
            landing_company_name: 'maltainvest',
            upgradeable_landing_companies: ['svg', 'malta'],
        },
    });
    (useSettings as jest.Mock).mockReturnValue({
        data: {
            country_code: 'id',
        },
    });
    (useStatesList as jest.Mock).mockReturnValue({
        data: [
            { text: 'Jakarta', value: 'JK' },
            { text: 'Bali', value: 'BA' },
        ],
        isFetched: true,
    });
});

const mockSubmit = jest.fn();

const addressFieldValues = {
    addressCity: '',
    addressLine1: '',
    addressLine2: '',
    addressPostcode: '',
    addressState: '',
};

const renderAddressFields = () =>
    render(
        <Formik initialValues={addressFieldValues} onSubmit={mockSubmit}>
            <AddressFields />
        </Formik>
    );

describe('AddressFields', () => {
    it('should render FormInputFields component', () => {
        (useStatesList as jest.Mock).mockReturnValue({
            data: [],
            isFetched: true,
        });
        renderAddressFields();
        const address1 = screen.getByLabelText('First line of address*');
        expect(address1).toBeInTheDocument();
        const address2 = screen.getByLabelText('Second line of address');
        expect(address2).toBeInTheDocument();
        const city = screen.getByLabelText('Town/City*');
        expect(city).toBeInTheDocument();
        const state = screen.getByLabelText('State/Province');
        expect(state).toBeInTheDocument();
        const zipCode = screen.getByLabelText('Postal/ZIP Code');
        expect(zipCode).toBeInTheDocument();
    });

    it('should render FormDropdown component if states list fetched and has values', () => {
        renderAddressFields();
        const address1 = screen.getByLabelText('First line of address*');
        expect(address1).toBeInTheDocument();
        const address2 = screen.getByLabelText('Second line of address');
        expect(address2).toBeInTheDocument();
        const city = screen.getByLabelText('Town/City*');
        expect(city).toBeInTheDocument();
        const state = screen.getByTestId('dt_dropdown');
        expect(state).toBeInTheDocument();
        const zipCode = screen.getByLabelText('Postal/ZIP Code');
        expect(zipCode).toBeInTheDocument();
    });
});

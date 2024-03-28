import React from 'react';
import { Formik } from 'formik';
import { useAuthorize, useSettings, useStatesList } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { AddressFields } from '../AddressFields';

jest.mock('@deriv/api-v2');

jest.mock('@deriv/quill-design', () => ({
    useBreakpoint: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('../../../../components/FormFields/', () => ({
    ...jest.requireActual('../../../../components/FormFields'),
    FormDropDownField: jest.fn(() => <div data-testid='dt_dropdown' />),
}));

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
        const address1 = screen.getByPlaceholderText('First line of address*');
        expect(address1).toBeInTheDocument();
        const address2 = screen.getByPlaceholderText('Second line of address');
        expect(address2).toBeInTheDocument();
        const city = screen.getByPlaceholderText('Town/City*');
        expect(city).toBeInTheDocument();
        const state = screen.getByPlaceholderText('State/Province');
        expect(state).toBeInTheDocument();
        const zipCode = screen.getByPlaceholderText('Postal/ZIP Code');
        expect(zipCode).toBeInTheDocument();
    });

    it('should render FormDropdown component if states list fetched and has values', () => {
        renderAddressFields();
        const address1 = screen.getByPlaceholderText('First line of address*');
        expect(address1).toBeInTheDocument();
        const address2 = screen.getByPlaceholderText('Second line of address');
        expect(address2).toBeInTheDocument();
        const city = screen.getByPlaceholderText('Town/City*');
        expect(city).toBeInTheDocument();
        const state = screen.getByTestId('dt_dropdown');
        expect(state).toBeInTheDocument();
        const zipCode = screen.getByPlaceholderText('Postal/ZIP Code');
        expect(zipCode).toBeInTheDocument();
    });
});

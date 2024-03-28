import React from 'react';
import { Form, Formik } from 'formik';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { usePersonalDetails } from '../../../hooks/usePersonalDetails';
import { PersonalDetailsForm } from '../PersonalDetailsForm';

jest.mock('../PersonalDetails', () => ({
    ...jest.requireActual('../PersonalDetails'),
    PersonalDetails: () => <div>Personal Details Container</div>,
}));

jest.mock('../TaxInformation', () => ({
    ...jest.requireActual('../TaxInformation'),
    TaxInformation: () => <div>Tax Information Container</div>,
}));

jest.mock('../SupportProfessionalClient', () => ({
    ...jest.requireActual('../SupportProfessionalClient'),
    SupportProfessionalClient: () => <div>Support Professional Client Container</div>,
}));

jest.mock('../../../modules/src/AddressFields', () => ({
    ...jest.requireActual('../../../modules/src/AddressFields'),
    AddressFields: () => <div>Address Fields Container</div>,
}));

jest.mock('../../../hooks/usePersonalDetails', () => ({
    ...jest.requireActual('../../../hooks/usePersonalDetails'),
    usePersonalDetails: jest.fn(),
}));

beforeEach(() => {
    (usePersonalDetails as jest.Mock).mockReturnValue({
        data: { isSupportProfessionalClient: true, isVirtual: false },
    });
});

describe('PersonalDetailsForm', () => {
    const renderComponent = (children: React.ReactNode) => {
        render(
            <APIProvider>
                <AuthProvider>
                    <Formik initialValues={{}} onSubmit={jest.fn()}>
                        <Form>{children}</Form>
                    </Formik>
                </AuthProvider>
            </APIProvider>
        );
    };

    const containers = [
        'Personal Details Container',
        'Tax Information Container',
        'Address Fields Container',
        'Support Professional Client Container',
    ];

    it('should render PersonalDetailsForm', () => {
        renderComponent(<PersonalDetailsForm />);
        const checkbox = screen.getByRole('checkbox', {
            name: 'Get updates about Deriv products, services and events.',
        });
        containers.forEach(container => expect(screen.getByText(container)).toBeInTheDocument());
        expect(screen.getByText('Email preference')).toBeInTheDocument();
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeDisabled();
    });

    it('should not render Address Fields Container and Email preference is enabled if isVirtual account', () => {
        (usePersonalDetails as jest.Mock).mockReturnValue({
            data: { isVirtual: true },
        });
        renderComponent(<PersonalDetailsForm />);
        const checkbox = screen.getByRole('checkbox', {
            name: 'Get updates about Deriv products, services and events.',
        });
        expect(screen.queryByText('Address Fields Container')).not.toBeInTheDocument();
        expect(checkbox).toBeEnabled();
    });

    it('should not render Professional Client Container when support_professional_client is 0', () => {
        (usePersonalDetails as jest.Mock).mockReturnValue({
            data: { isSupportProfessionalClient: false },
        });
        renderComponent(<PersonalDetailsForm />);
        expect(screen.queryByText('Support Professional Client Container')).not.toBeInTheDocument();
    });
});

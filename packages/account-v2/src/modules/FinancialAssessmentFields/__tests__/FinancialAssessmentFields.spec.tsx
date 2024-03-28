import React from 'react';
import { Form, Formik } from 'formik';
import { APIProvider, AuthProvider, useAuthorize } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FinancialAssessmentFields } from '../FinancialAssessmentFields';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useAuthorize: jest.fn(() => ({
        data: {
            landing_company_name: 'svg',
        },
    })),
}));

beforeEach(() => {
    jest.restoreAllMocks();
});

const initialValues = {
    accountTurnover: '',
    educationLevel: '',
    employmentIndustry: '',
    employmentStatus: '',
    estimatedWorth: '',
    incomeSource: '',
    netIncome: '',
    occupation: '',
    sourceOfWealth: '',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);

describe('FinancialAssessmentFields', () => {
    it('renders all form fields', () => {
        render(
            <Formik initialValues={initialValues} onSubmit={jest.fn()}>
                <Form>
                    <FinancialAssessmentFields />;
                </Form>
            </Formik>,
            { wrapper }
        );

        expect(screen.getByRole('combobox', { name: 'Source of income' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Employment status' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Industry of employment' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Occupation' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Source of wealth' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Level of education' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Net annual income' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Estimated net worth' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Anticipated account turnover' })).toBeInTheDocument();
    });

    it('throw error if not wrapped with Formik ', () => {
        jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
        jest.spyOn(console, 'warn').mockImplementation(() => jest.fn());
        expect(() => render(<FinancialAssessmentFields />, { wrapper })).toThrow(
            'FinancialAssessmentFields must be used within a Formik component'
        );
    });

    it('should not render employment status if landing company is maltainvest', () => {
        (useAuthorize as jest.Mock).mockReturnValue({
            data: {
                landing_company_name: 'maltainvest',
            },
        });

        render(
            <Formik initialValues={initialValues} onSubmit={jest.fn()}>
                <Form>
                    <FinancialAssessmentFields />;
                </Form>
            </Formik>,
            { wrapper }
        );

        expect(screen.queryByRole('combobox', { name: 'Employment Status' })).not.toBeInTheDocument();
    });

    it('should not render occupation if employment status is unemployed', () => {
        (useAuthorize as jest.Mock).mockReturnValue({
            data: {
                landing_company_name: 'svg',
            },
        });
        render(
            <Formik initialValues={initialValues} onSubmit={jest.fn()}>
                <Form>
                    <FinancialAssessmentFields />;
                </Form>
            </Formik>,
            { wrapper }
        );

        expect(screen.getByRole('combobox', { name: 'Occupation' })).toBeInTheDocument();
        const employmentStatus = screen.getByRole('combobox', { name: 'Employment status' });
        userEvent.type(employmentStatus, 'Unemployed');
        const unemployedOption = screen.getByRole('option', { name: 'Unemployed' });
        userEvent.click(unemployedOption);
        expect(screen.queryByRole('combobox', { name: 'Occupation' })).not.toBeInTheDocument();
    });
});

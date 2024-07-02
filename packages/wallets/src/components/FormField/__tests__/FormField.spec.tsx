import React from 'react';
import { Formik } from 'formik';
import Yup from 'yup';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormField from '../FormField';

const mockValidate = jest.fn();
jest.mock('yup', () => ({
    ...jest.requireActual('yup'),
    string: () => ({
        required: () => ({
            validateSync: mockValidate,
        }),
    }),
}));

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <Formik
        initialValues={{
            test: 'default',
        }}
        onSubmit={() => {
            null;
        }}
        screens={{
            test: <FormField name='test' />,
        }}
    >
        {() => children}
    </Formik>
);

describe('FormField', () => {
    it('should set hasTouched value when user is on focus', async () => {
        const mockUseState = jest.spyOn(React, 'useState');
        const mockSetHasTouched = jest.fn();
        (mockUseState as jest.Mock).mockImplementation(initialValue => [initialValue, mockSetHasTouched]);

        await act(async () => {
            render(<FormField defaultValue='default' name='test' />, { wrapper });
        });

        const input = screen.getByDisplayValue('default');
        input.focus();
        expect(mockSetHasTouched).toHaveBeenCalled();
    });

    it('should validate field when user typing', async () => {
        const validationSchema = Yup.string().required();

        await act(async () => {
            render(<FormField defaultValue='default' name='test' validationSchema={validationSchema} />, { wrapper });
        });

        const input = screen.getByDisplayValue('default');
        userEvent.type(input, 'test');
        expect(mockValidate).toHaveBeenCalled();
        expect(input).toHaveValue('defaulttest');
    });

    it('should catch error when trying to validate field', async () => {
        const validationSchema = Yup.string().required();
        mockValidate.mockImplementation(() => {
            throw new Yup.ValidationError('error', 'test', 'test');
        });

        await act(async () => {
            render(<FormField defaultValue='default' name='test' validationSchema={validationSchema} />, { wrapper });
        });

        const input = screen.getByDisplayValue('default');
        userEvent.type(input, 'test');
        expect(mockValidate).toHaveBeenCalled();
    });

    it('should show error message when field is invalid', async () => {
        const mockUseState = jest.spyOn(React, 'useState');
        const mockSetTouched = jest.fn();
        (mockUseState as jest.Mock).mockImplementation(initialValue => [initialValue, mockSetTouched]);

        await act(async () => {
            render(<FormField defaultValue='default' errorMessage='Field is required' isInvalid name='test' />, {
                wrapper,
            });
        });

        const input = screen.getByDisplayValue('default');
        userEvent.type(input, 'test');
        expect(screen.getByText('Field is required')).toBeInTheDocument();
    });

    it('should not allow user to type when field is disabled', async () => {
        await act(async () => {
            render(<FormField defaultValue='default' disabled name='test' />, { wrapper });
        });

        const input = screen.getByDisplayValue('default');
        userEvent.type(input, 'test');
        expect(input).toHaveValue('default');
    });
});

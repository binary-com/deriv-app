import React from 'react';
import { Formik, FormikContextType } from 'formik';
import * as formik from 'formik';
import { fireEvent, render, screen } from '@testing-library/react';
import SelfExclusionInputs from '../self-exclusion-inputs';
import SelfExclusionContext, { TSelfExclusionContext } from '../self-exclusion-context';

jest.mock('../self-exclusion-footer', () => {
    const MockSelfExclusionFooter = () => <div>SelfExclusionFooter</div>;
    return MockSelfExclusionFooter;
});

let mock_context: TSelfExclusionContext = {
    currency: '',
    currency_display: '',
    footer_ref: undefined,
    getMaxLength: jest.fn(),
    goToConfirm: jest.fn(),
    is_app_settings: false,
    is_eu: false,
    is_mf: false,
    is_tablet: false,
    session_duration_digits: false,
    handleSubmit: jest.fn(),
    overlay_ref: document.createElement('div'),
};
const mockUseFormikContext = jest.fn<FormikContextType<unknown>, []>();
jest.spyOn(formik, 'useFormikContext').mockImplementation(mockUseFormikContext);

describe('<SelfExclusionInputs />', () => {
    const common_mock_formik_context = {
        touched: {},
        isValidating: false,
        submitCount: 0,
        setStatus: jest.fn(),
        setErrors: jest.fn(),
        setSubmitting: jest.fn(),
        setTouched: jest.fn(),
        setValues: jest.fn(),
        setFieldError: jest.fn(),
        setFieldTouched: jest.fn(),
        validateForm: jest.fn(),
        validateField: jest.fn(),
        resetForm: jest.fn(),
        submitForm: jest.fn(),
        setFormikState: jest.fn(),
        handleSubmit: jest.fn(),
        handleReset: jest.fn(),
        getFieldProps: jest.fn(),
        getFieldMeta: jest.fn(),
        getFieldHelpers: jest.fn(),
        initialValues: undefined,
        initialErrors: {},
        initialTouched: {},
        registerField: jest.fn(),
        unregisterField: jest.fn(),
    };

    beforeEach(() => {
        mock_context = {
            currency: 'test currency',
            currency_display: 'test currency',
            footer_ref: undefined,
            getMaxLength: jest.fn(),
            goToConfirm: jest.fn(),
            is_app_settings: false,
            is_eu: false,
            is_mf: false,
            is_tablet: false,
            session_duration_digits: false,
            handleSubmit: jest.fn(),
            overlay_ref: document.createElement('div'),
        };
        mockUseFormikContext.mockReturnValue({
            dirty: false,
            errors: {},
            handleBlur: jest.fn(),
            handleChange: jest.fn(),
            isSubmitting: false,
            isValid: false,
            setFieldValue: jest.fn(),
            values: {},
            ...common_mock_formik_context,
        });
    });

    it('should render SelfExclusionFooter instead of Next Button', () => {
        mock_context.footer_ref = React.createRef();

        render(
            <Formik initialValues={{}} onSubmit={common_mock_formik_context.handleSubmit()}>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        expect(screen.getByText('SelfExclusionFooter')).toBeInTheDocument();
    });

    it('should render "Next" button and trigger click', () => {
        mockUseFormikContext.mockReturnValue({
            values: {},
            isSubmitting: false,
            isValid: true,
            dirty: true,
            errors: {},
            handleBlur: jest.fn(),
            handleChange: jest.fn(),
            setFieldValue: jest.fn(),
            ...common_mock_formik_context,
        });

        const mockGoToConfirm = mock_context.goToConfirm;

        render(
            <Formik initialValues={{}} onSubmit={common_mock_formik_context.handleSubmit()}>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        expect(screen.queryByText('SelfExclusionFooter')).not.toBeInTheDocument();
        const btn = screen.getByRole('button');
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveTextContent('Next');
        fireEvent.click(btn);
        expect(mockGoToConfirm).toHaveBeenCalledTimes(1);
    });

    it('Should trigger handleChange callback when the input field changes in StakeLossAndLimitsInputs', () => {
        const mockHandleChange = mockUseFormikContext().handleChange;

        render(
            <Formik initialValues={{}} onSubmit={common_mock_formik_context.handleSubmit}>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const el_input: HTMLTextAreaElement | undefined = screen
            .getAllByRole<HTMLTextAreaElement>('textbox')
            .find((e: HTMLTextAreaElement) => e.name === 'max_turnover');
        expect(el_input).toBeInTheDocument();
        fireEvent.change(el_input as Node, { target: { value: '200' } });
        expect(mockHandleChange).toHaveBeenCalledTimes(1);
    });

    it('Should trigger handleChange callback when the input field changes in SessionAndLoginLimitsInputs', () => {
        const mockHandleChange = mockUseFormikContext().handleChange;

        render(
            <Formik initialValues={{}} onSubmit={common_mock_formik_context.handleSubmit()}>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const el_input: HTMLTextAreaElement | undefined = screen
            .getAllByRole<HTMLTextAreaElement>('textbox')
            .find((e: HTMLTextAreaElement) => e.name === 'session_duration_limit');
        expect(el_input).toBeInTheDocument();
        fireEvent.change(el_input as Node, { target: { value: 500 } });
        expect(mockHandleChange).toHaveBeenCalledTimes(1);
    });

    it('Should trigger handleChange callback when the input field changes in MaximumAccountBalanceAndOpenPositionsInputs', () => {
        const mockHandleChange = mockUseFormikContext().handleChange;

        render(
            <Formik initialValues={{}} onSubmit={common_mock_formik_context.handleSubmit()}>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const el_input: HTMLTextAreaElement | undefined = screen
            .getAllByRole<HTMLTextAreaElement>('textbox')
            .find((e: HTMLTextAreaElement) => e.name === 'max_balance');
        expect(el_input).toBeInTheDocument();
        fireEvent.change(el_input as Node, { target: { value: 900 } });
        expect(mockHandleChange).toHaveBeenCalledTimes(1);
        expect(el_input?.value).toBe('900');
    });

    it('Should trigger onChange callback when the date field changes in SessionAndLoginLimitsInputs', () => {
        const mockSetFieldValue = mockUseFormikContext().setFieldValue;

        render(
            <Formik initialValues={{}} onSubmit={common_mock_formik_context.handleSubmit()}>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionInputs />
                </SelfExclusionContext.Provider>
            </Formik>
        );

        const exclude_date_input: HTMLTextAreaElement | undefined = screen
            .getAllByRole<HTMLTextAreaElement>('textbox')
            .find((e: HTMLTextAreaElement) => e.name === 'exclude_until');
        expect(exclude_date_input).toBeInTheDocument();
        fireEvent.click(exclude_date_input as Node);
        fireEvent.change(exclude_date_input as Node, { target: { value: '2012-12-12' } });
        expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
        expect(mockSetFieldValue).toHaveBeenCalledWith('exclude_until', '2012-12-12', true);
    });
});

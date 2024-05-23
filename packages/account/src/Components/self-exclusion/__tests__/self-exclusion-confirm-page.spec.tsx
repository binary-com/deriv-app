import React from 'react';
import * as formik from 'formik';
import { fireEvent, render, screen } from '@testing-library/react';
import SelfExclusionConfirmPage from '../self-exclusion-confirm-page';
import SelfExclusionContext, { TSelfExclusionContext } from '../self-exclusion-context';
import { FormikValues } from 'formik';

jest.mock('../self-exclusion-confirm-limits', () => {
    const MockConfirmLimits = () => <div>SelfExclusionConfirmLimits</div>;
    return MockConfirmLimits;
});

const mockUseFormikContext: FormikValues = jest.spyOn(formik, 'useFormikContext');

describe('<SelfExclusionConfirmPage />', () => {
    let mock_context: Required<TSelfExclusionContext> = {
        backFromConfirmLimits: jest.fn(),
        currency: '',
        currency_display: '',
        exclusion_texts: {},
        is_eu: false,
        state: {
            changed_attributes: [],
            show_confirm: false,
            submit_error_message: '',
        },
        overlay_ref: document.createElement('div'),
        is_app_settings: false,
        is_wrapper_bypassed: false,
        toggleArticle: jest.fn(),
        handleSubmit: jest.fn(),
        validateFields: jest.fn(),
    };

    beforeEach(() => {
        mock_context = {
            backFromConfirmLimits: jest.fn(),
            currency: 'test currency',
            currency_display: 'test currency',
            exclusion_texts: {},
            is_eu: false,
            state: {
                changed_attributes: [],
                show_confirm: false,
                submit_error_message: 'Submit error message',
            },
            overlay_ref: document.createElement('div'),
            is_app_settings: false,
            is_wrapper_bypassed: false,
            toggleArticle: jest.fn(),
            handleSubmit: jest.fn(),
            validateFields: jest.fn(),
        };
        mockUseFormikContext.mockReturnValue({
            isSubmitting: false,
            values: {},
        });
    });
    it('should not render SelfExclusionConfirmPage component', () => {
        mock_context.state.show_confirm = true;

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionConfirmPage />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('SelfExclusionConfirmLimits')).toBeInTheDocument();
        expect(screen.queryByText('You have set the following limits:')).not.toBeInTheDocument();
    });

    it('should render SelfExclusionConfirmPage component with options', () => {
        mock_context.exclusion_texts = {
            max_deposit: 'Max deposit is',
            max_open_bets: 'Max open bets are',
            max_total_stake: 'Max total stake is',
            session_duration_limit: 'Session duration limit is',
            timeout_until: 'Timeout until',
        };
        mock_context.state.changed_attributes = [
            'max_deposit',
            'max_open_bets',
            'max_total_stake',
            'session_duration_limit',
            'timeout_until',
        ];
        mockUseFormikContext.mockReturnValue({
            isSubmitting: false,
            values: {
                max_deposit: 987,
                max_open_bets: 13,
                max_total_stake: 97,
                session_duration_limit: 9999,
                timeout_until: 0,
            },
        });

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionConfirmPage />
            </SelfExclusionContext.Provider>
        );

        const currencies = screen.getAllByText(/test currency/);
        expect(currencies.length).toBeGreaterThan(0);
        expect(screen.getByText('Max deposit is')).toBeInTheDocument();
        expect(screen.getByText('Max open bets are')).toBeInTheDocument();
        expect(screen.getByText('Max total stake is')).toBeInTheDocument();
        expect(screen.getByText('Session duration limit is')).toBeInTheDocument();
        expect(screen.getByText('Timeout until')).toBeInTheDocument();
        expect(screen.getByText('13')).toBeInTheDocument();
    });

    it('Should trigger click on the "Back" icon', () => {
        const backFromConfirmLimits = mock_context.backFromConfirmLimits;

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionConfirmPage />
            </SelfExclusionContext.Provider>
        );

        const btn = screen.getByText('Back');
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        expect(backFromConfirmLimits).toHaveBeenCalledTimes(1);
    });

    it('should render SelfExclusionConfirmPage component for non EU', () => {
        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionConfirmPage />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('Submit error message')).toBeInTheDocument();
        expect(screen.getByText(/We’ll update your limits./)).toBeInTheDocument();
        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        expect(screen.queryByText(/You’ll be able to adjust these limits at any time./)).not.toBeInTheDocument();
        expect(screen.queryByText('SelfExclusionConfirmLimits')).not.toBeInTheDocument();
    });

    it('should render SelfExclusionConfirmPage component for EU', () => {
        mock_context.is_eu = true;

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionConfirmPage />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('Submit error message')).toBeInTheDocument();
        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        expect(screen.getByText(/You’ll be able to adjust these limits at any time./)).toBeInTheDocument();
        expect(screen.queryByText('SelfExclusionConfirmLimits')).not.toBeInTheDocument();
        expect(screen.queryByText(/We’ll update your limits./)).not.toBeInTheDocument();
    });

    it('Should trigger click on the "Accept" button for non EU', () => {
        const mockHandleSubmit = jest.fn();

        render(
            <form onSubmit={mockHandleSubmit} data-testid='form'>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionConfirmPage />
                </SelfExclusionContext.Provider>
            </form>
        );

        const btn = screen.getByRole('button');
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveTextContent('Accept');
        fireEvent.submit(screen.getByTestId('form'));
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it('Should trigger click on the "Confirm my limits" button for EU', () => {
        mock_context.is_eu = true;
        const mockHandleSubmit = jest.fn();

        render(
            <form onSubmit={mockHandleSubmit} data-testid='form'>
                <SelfExclusionContext.Provider value={mock_context}>
                    <SelfExclusionConfirmPage />
                </SelfExclusionContext.Provider>
            </form>
        );

        const btn = screen.getByRole('button');
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveTextContent('Confirm my limits');
        fireEvent.submit(screen.getByTestId('form'));
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });
});

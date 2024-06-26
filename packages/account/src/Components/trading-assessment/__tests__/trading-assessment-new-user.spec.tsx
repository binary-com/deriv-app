import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import TradingAssessmentNewUser from '../trading-assessment-new-user';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('TradingAssessmentNewUser', () => {
    const mockgotoNextStep = jest.fn();
    const mockgotoPreviousStep = jest.fn();
    const mockOnSave = jest.fn();
    const mockOnCancel = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockGetCurrentStep = jest.fn();

    const baseProps = {
        disabled_items: [],
        goToNextStep: mockgotoNextStep,
        goToPreviousStep: mockgotoPreviousStep,
        onSave: mockOnSave,
        onCancel: mockOnCancel,
        onSubmit: mockOnSubmit,
        getCurrentStep: mockGetCurrentStep,
        value: {
            cfd_experience: '',
            cfd_frequency: '',
            cfd_trading_definition: '',
            leverage_impact_trading: '',
            leverage_trading_high_risk_stop_loss: '',
            required_initial_margin: '',
            risk_tolerance: '',
            source_of_experience: '',
            trading_experience_financial_instruments: '',
            trading_frequency_financial_instruments: '',
        },
        setSubSectionIndex: jest.fn(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle the cancel event correctly', () => {
        mockGetCurrentStep.mockReturnValue(2);
        const mock_store = mockStore({});
        render(
            <StoreProvider store={mock_store}>
                <TradingAssessmentNewUser {...baseProps} />
            </StoreProvider>
        );

        const cancelButton = screen.getByRole('button', { name: /Previous/i });
        userEvent.click(cancelButton);

        expect(mockOnSave).toHaveBeenCalledWith(1, baseProps.value);
        expect(mockOnCancel).toHaveBeenCalledWith(1, mockgotoPreviousStep);
    });
});

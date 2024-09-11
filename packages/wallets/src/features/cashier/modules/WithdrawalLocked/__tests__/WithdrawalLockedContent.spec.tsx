import { fireEvent, render, screen } from '@testing-library/react';
import getWithdrawalLockedDesc, { getWithdrawalLimitReachedDesc } from '../WithdrawalLockedContent';

window.LiveChatWidget = {
    call: jest.fn(),
    get: jest.fn(),
    init: jest.fn(),
    on: jest.fn(),
};

describe('WithdrawalLockedContent', () => {
    it('should render title and description as undefined when withdrawal limit is not reached', () => {
        const result = getWithdrawalLimitReachedDesc({
            askFinancialRiskApproval: false,
            poaNeedsVerification: false,
            poaStatus: 'verified',
            poiNeedsVerification: false,
            poiStatus: 'verified',
        });

        expect(result).toBeFalsy();
    });

    it('should render title and description as undefined when withdrawal is not locked', () => {
        const result = getWithdrawalLockedDesc({
            askAuthenticate: false,
            askFixDetails: false,
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: false,
            withdrawalLockedStatus: false,
        });

        expect(result).toBeFalsy();
    });

    it('should render correct message when withdrawal limit is reached and both POI/POA has not been uploaded', () => {
        const result = getWithdrawalLimitReachedDesc({
            askFinancialRiskApproval: false,
            poaNeedsVerification: true,
            poaStatus: 'none',
            poiNeedsVerification: true,
            poiStatus: 'none',
        });

        if (result) render(result);
        expect(screen.getByText(/You have reached the withdrawal limit. Please check your/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'address' })).toBeInTheDocument();
    });

    it('should render correct message when withdrawal limit is reached and POI has not been uploaded', () => {
        const result = getWithdrawalLimitReachedDesc({
            askFinancialRiskApproval: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: true,
            poiStatus: 'none',
        });

        if (result) render(result);
        expect(screen.getByText(/You have reached the withdrawal limit. Please check your/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'address' })).toBeInTheDocument();
    });

    it('should render correct message when withdrawal limit is reached and POI has been uploaded but not yet verified', () => {
        const result = getWithdrawalLimitReachedDesc({
            askFinancialRiskApproval: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: true,
            poiStatus: 'pending',
        });

        if (result) render(result);
        expect(screen.getByText(/You have reached the withdrawal limit. Please check your/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'address' })).toBeInTheDocument();
    });

    it('should render correct message when withdrawal limit is reached and POA has not been uploaded', () => {
        const result = getWithdrawalLimitReachedDesc({
            askFinancialRiskApproval: false,
            poaNeedsVerification: true,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
        });

        if (result) render(result);
        expect(screen.getByText(/You have reached the withdrawal limit. Please check your/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'address' })).toBeInTheDocument();
    });

    it('should render correct message when withdrawal limit is reached and POA has been uploaded but not yet verified', () => {
        const result = getWithdrawalLimitReachedDesc({
            askFinancialRiskApproval: false,
            poaNeedsVerification: true,
            poaStatus: 'pending',
            poiNeedsVerification: false,
            poiStatus: 'none',
        });

        if (result) render(result);
        expect(screen.getByText(/You have reached the withdrawal limit. Please check your/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'address' })).toBeInTheDocument();
    });

    it('should render correct message when withdrawal limit is reached and askFinancialRiskApproval status received', () => {
        const result = getWithdrawalLimitReachedDesc({
            askFinancialRiskApproval: true,
            poaNeedsVerification: false,
            poaStatus: 'verified',
            poiNeedsVerification: false,
            poiStatus: 'verified',
        });

        if (result) render(result);
        expect(screen.getByText(/Please complete/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment form' })).toBeInTheDocument();
    });

    it('should render correct message when financialAssessmentRequired status received', () => {
        const result = getWithdrawalLockedDesc({
            askAuthenticate: false,
            askFixDetails: false,
            financialAssessmentRequired: true,
            noWithdrawalOrTradingStatus: false,
            withdrawalLockedStatus: false,
        });

        if (result) render(result);
        expect(screen.getByText(/Please complete the/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment' })).toBeInTheDocument();
    });

    it('should render correct message when askAuthenticate status received', () => {
        const result = getWithdrawalLockedDesc({
            askAuthenticate: true,
            askFixDetails: false,
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: false,
            withdrawalLockedStatus: false,
        });

        if (result) render(result);
        expect(screen.getByText(/Your account has not been authenticated. Please submit/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of address' })).toBeInTheDocument();
    });

    it('should render correct message when askFixDetails status received', () => {
        const result = getWithdrawalLockedDesc({
            askAuthenticate: false,
            askFixDetails: true,
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: false,
            withdrawalLockedStatus: false,
        });

        if (result) render(result);
        expect(
            screen.getByText(
                /Please go to your account settings and complete your personal details to enable withdrawals/
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'personal details' })).toBeInTheDocument();
    });

    it('should render correct message when noWithdrawalOrTradingStatus status received', () => {
        const result = getWithdrawalLockedDesc({
            askAuthenticate: false,
            askFixDetails: false,
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: true,
            withdrawalLockedStatus: false,
        });

        if (result) render(result);
        expect(screen.getByText(/Unfortunately, you can only make deposits. Please contact us/)).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        fireEvent.click(link);
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
    });

    it('should render correct message when withdrawalLockedStatus status received', () => {
        const result = getWithdrawalLockedDesc({
            askAuthenticate: false,
            askFixDetails: false,
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: false,
            withdrawalLockedStatus: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Unfortunately, you can only make deposits. Please contact us/)).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        fireEvent.click(link);
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
    });
});

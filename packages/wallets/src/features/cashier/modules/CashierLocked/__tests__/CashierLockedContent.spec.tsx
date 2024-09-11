import { fireEvent, render, screen } from '@testing-library/react';
import getCashierLockedDesc, { getSystemMaintenanceContent } from '../CashierLockedContent';

window.LiveChatWidget = {
    call: jest.fn(),
    get: jest.fn(),
    init: jest.fn(),
    on: jest.fn(),
};

describe('CashierLockedContent', () => {
    it('should render title and description as null when not system maintenance', () => {
        const result = getSystemMaintenanceContent({
            currency: 'USD',
            isCashierLocked: false,
            isCrypto: false,
            isDepositLocked: false,
            isWithdrawalLocked: false,
        });

        expect(result).toBeFalsy();
    });

    it('should render description as null when cashier is not locked', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: false,
            askCurrency: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            askSelfExclusionMaxTurnoverSet: false,
            askTinInformation: false,
            cashierLockedStatus: false,
            currency: 'USD',
            disabledStatus: false,
            documentsExpired: false,
            financialAssessmentRequired: false,
            noResidence: false,
            poaNeedsVerification: false,
            poiNeedsVerification: false,
        });

        expect(result).toBeFalsy();
    });

    it('should render correct message when system maintenance and cashier is locked', () => {
        const result = getSystemMaintenanceContent({
            currency: 'USD',
            isCashierLocked: true,
            isCrypto: false,
            isDepositLocked: false,
            isWithdrawalLocked: false,
        });

        if (result) render(result.description);
        expect(
            screen.getByText(
                'Due to system maintenance, deposits and withdrawals with your USD Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();

        if (result) render(result.title);
        expect(
            screen.getByText('USD Wallet deposits and withdrawals are temporarily unavailable.')
        ).toBeInTheDocument();
    });

    it('should render correct message when system maintenance and deposit is locked for crypto account', () => {
        const result = getSystemMaintenanceContent({
            currency: 'BTC',
            isCashierLocked: false,
            isCrypto: true,
            isDepositLocked: true,
            isWithdrawalLocked: false,
        });

        if (result) render(result.description);
        expect(
            screen.getByText(
                'Due to system maintenance, deposits with your BTC Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();

        if (result) render(result.title);
        expect(screen.getByText('BTC Wallet deposits are temporarily unavailable.')).toBeInTheDocument();
    });

    it('should render correct message when system maintenance and withdrawal is locked for crypto account', () => {
        const result = getSystemMaintenanceContent({
            currency: 'BTC',
            isCashierLocked: false,
            isCrypto: true,
            isDepositLocked: false,
            isWithdrawalLocked: true,
        });

        if (result) render(result.description);
        expect(
            screen.getByText(
                'Due to system maintenance, withdrawals with your BTC Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();

        if (result) render(result.title);
        expect(screen.getByText('BTC Wallet withdrawals are temporarily unavailable.')).toBeInTheDocument();
    });

    it('should render correct message when noResidence status received', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: false,
            askCurrency: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            askSelfExclusionMaxTurnoverSet: false,
            askTinInformation: false,
            cashierLockedStatus: false,
            currency: 'USD',
            disabledStatus: false,
            documentsExpired: false,
            financialAssessmentRequired: false,
            noResidence: true,
            poaNeedsVerification: false,
            poiNeedsVerification: false,
        });

        if (result) render(result);
        expect(screen.getByText(/You've not set your country of residence/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Personal details section' })).toBeInTheDocument();
    });

    it('should render correct message when documentsExpired status received', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: false,
            askCurrency: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            askSelfExclusionMaxTurnoverSet: false,
            askTinInformation: false,
            cashierLockedStatus: false,
            currency: 'USD',
            disabledStatus: false,
            documentsExpired: true,
            financialAssessmentRequired: false,
            noResidence: false,
            poaNeedsVerification: false,
            poiNeedsVerification: false,
        });

        if (result) render(result);
        expect(screen.getByText(/The identification documents you submitted have expired/)).toBeInTheDocument();
        expect(
            screen.getByText(/Please submit valid identity documents to unlock your USD Wallet/)
        ).toBeInTheDocument();
    });

    it('should render correct message when cashierLockedStatus status received', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: false,
            askCurrency: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            askSelfExclusionMaxTurnoverSet: false,
            askTinInformation: false,
            cashierLockedStatus: true,
            currency: 'USD',
            disabledStatus: false,
            documentsExpired: false,
            financialAssessmentRequired: false,
            noResidence: false,
            poaNeedsVerification: false,
            poiNeedsVerification: false,
        });

        if (result) render(result);
        expect(screen.getByText(/Please contact us/)).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        fireEvent.click(link);
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
    });

    it('should render correct message when disabledStatus status received', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: false,
            askCurrency: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            askSelfExclusionMaxTurnoverSet: false,
            askTinInformation: false,
            cashierLockedStatus: false,
            currency: 'USD',
            disabledStatus: true,
            documentsExpired: false,
            financialAssessmentRequired: false,
            noResidence: false,
            poaNeedsVerification: false,
            poiNeedsVerification: false,
        });

        if (result) render(result);
        expect(screen.getByText(/Please contact us/)).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        fireEvent.click(link);
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
    });

    it('should render correct message when askCurrency status received', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: false,
            askCurrency: true,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            askSelfExclusionMaxTurnoverSet: false,
            askTinInformation: false,
            cashierLockedStatus: false,
            currency: 'USD',
            disabledStatus: false,
            documentsExpired: false,
            financialAssessmentRequired: false,
            noResidence: false,
            poaNeedsVerification: false,
            poiNeedsVerification: false,
        });

        if (result) render(result);
        expect(
            screen.getByText(/Please set your account currency to enable deposits and withdrawals/)
        ).toBeInTheDocument();
    });

    it('should render correct message when askAuthenticate status received and POI needs verification', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: true,
            askCurrency: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            askSelfExclusionMaxTurnoverSet: false,
            askTinInformation: false,
            cashierLockedStatus: false,
            currency: 'USD',
            disabledStatus: false,
            documentsExpired: false,
            financialAssessmentRequired: false,
            noResidence: false,
            poaNeedsVerification: false,
            poiNeedsVerification: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Please submit your/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
    });

    it('should render correct message when askAuthenticate status received and POI/POA needs verification', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: true,
            askCurrency: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            askSelfExclusionMaxTurnoverSet: false,
            askTinInformation: false,
            cashierLockedStatus: false,
            currency: 'USD',
            disabledStatus: false,
            documentsExpired: false,
            financialAssessmentRequired: false,
            noResidence: false,
            poaNeedsVerification: true,
            poiNeedsVerification: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Your account has not been authenticated. Please submit your/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of address' })).toBeInTheDocument();
    });

    it('should render correct message when askFinancialRiskApproval status received', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: false,
            askCurrency: false,
            askFinancialRiskApproval: true,
            askFixDetails: false,
            askSelfExclusionMaxTurnoverSet: false,
            askTinInformation: false,
            cashierLockedStatus: false,
            currency: 'USD',
            disabledStatus: false,
            documentsExpired: false,
            financialAssessmentRequired: false,
            noResidence: false,
            poaNeedsVerification: false,
            poiNeedsVerification: false,
        });

        if (result) render(result);
        expect(screen.getByText(/Please complete the/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Appropriateness Test' })).toBeInTheDocument();
    });

    it('should render correct message when financialAssessmentRequired status received', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: false,
            askCurrency: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            askSelfExclusionMaxTurnoverSet: false,
            askTinInformation: false,
            cashierLockedStatus: false,
            currency: 'USD',
            disabledStatus: false,
            documentsExpired: false,
            financialAssessmentRequired: true,
            noResidence: false,
            poaNeedsVerification: false,
            poiNeedsVerification: false,
        });

        if (result) render(result);
        expect(screen.getByText(/Please complete the/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment' })).toBeInTheDocument();
    });

    it('should render correct message when askTinInformation status received', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: false,
            askCurrency: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            askSelfExclusionMaxTurnoverSet: false,
            askTinInformation: true,
            cashierLockedStatus: false,
            currency: 'USD',
            disabledStatus: false,
            documentsExpired: false,
            financialAssessmentRequired: false,
            noResidence: false,
            poaNeedsVerification: false,
            poiNeedsVerification: false,
        });

        if (result) render(result);
        expect(screen.getByText(/You have not provided your tax identification number/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Personal details' })).toBeInTheDocument();
    });

    it('should render correct message when askSelfExclusionMaxTurnoverSet status received', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: false,
            askCurrency: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            askSelfExclusionMaxTurnoverSet: true,
            askTinInformation: false,
            cashierLockedStatus: false,
            currency: 'USD',
            disabledStatus: false,
            documentsExpired: false,
            financialAssessmentRequired: false,
            noResidence: false,
            poaNeedsVerification: false,
            poiNeedsVerification: false,
        });

        if (result) render(result);
        expect(
            screen.getByText(
                /Your access to USD Wallet has been temporarily disabled as you have not set your 30-day turnover limit/
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Self-exclusion' })).toBeInTheDocument();
    });

    it('should render correct message when askFixDetails status received', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: false,
            askCurrency: false,
            askFinancialRiskApproval: false,
            askFixDetails: true,
            askSelfExclusionMaxTurnoverSet: false,
            askTinInformation: false,
            cashierLockedStatus: false,
            currency: 'USD',
            disabledStatus: false,
            documentsExpired: false,
            financialAssessmentRequired: false,
            noResidence: false,
            poaNeedsVerification: false,
            poiNeedsVerification: false,
        });

        if (result) render(result);
        expect(
            screen.getByText(
                /Please go to your account settings and complete your personal details to enable deposits and withdrawals/
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'personal details' })).toBeInTheDocument();
    });
});

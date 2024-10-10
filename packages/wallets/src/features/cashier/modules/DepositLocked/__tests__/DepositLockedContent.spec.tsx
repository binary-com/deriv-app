import { fireEvent, render, screen } from '@testing-library/react';
import getDepositLockedDesc from '../DepositLockedContent';

window.LiveChatWidget = {
    call: jest.fn(),
    get: jest.fn(),
    init: jest.fn(),
    on: jest.fn(),
};

describe('DepositLockedContent', () => {
    it('should render title and description as undefined when deposit is not locked', () => {
        const result = getDepositLockedDesc({
            askFixDetails: false,
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: false,
            isTNCNeeded: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
        });

        expect(result).toBeFalsy();
    });

    it('should render correct message when POI has not been verified', () => {
        const result = getDepositLockedDesc({
            askFixDetails: false,
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: false,
            isTNCNeeded: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: true,
            poiStatus: 'pending',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
        });

        if (result) render(result);
        expect(screen.getByText(/To enable deposits, you must check/)).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'proof of identity document verification status' })
        ).toBeInTheDocument();
    });

    it('should render correct message when POA has not been verified', () => {
        const result = getDepositLockedDesc({
            askFixDetails: false,
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: false,
            isTNCNeeded: false,
            poaNeedsVerification: true,
            poaStatus: 'pending',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
        });

        if (result) render(result);
        expect(screen.getByText(/To enable deposits, you must check/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of address document verification status' })).toBeInTheDocument();
    });

    it('should render correct message when latest TnC has not been accepted', () => {
        const result = getDepositLockedDesc({
            askFixDetails: false,
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: false,
            isTNCNeeded: true,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
        });

        if (result) render(result);
        expect(screen.getByText(/To enable deposits, you must accept/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'updated terms and conditions' })).toBeInTheDocument();
    });

    it('should render correct message when financial information is pending for MF accounts', () => {
        const result = getDepositLockedDesc({
            askFixDetails: false,
            excludedUntil: undefined,
            financialInformationNotComplete: true,
            isMFAccount: true,
            isTNCNeeded: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
        });

        if (result) render(result);
        expect(screen.getByText(/To enable deposits, you must complete/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment form' })).toBeInTheDocument();
    });

    it('should render correct message when trading experience information is pending for MF accounts', () => {
        const result = getDepositLockedDesc({
            askFixDetails: false,
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: true,
            isTNCNeeded: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: true,
            unwelcomeStatus: false,
        });

        if (result) render(result);
        expect(screen.getByText(/To enable deposits, you must complete/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment form' })).toBeInTheDocument();
    });

    it('should render correct message when askFixDetails status received', () => {
        const result = getDepositLockedDesc({
            askFixDetails: true,
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: false,
            isTNCNeeded: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
        });

        if (result) render(result);
        expect(
            screen.getByText(/Please go to your account settings and complete your personal details to enable deposits/)
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'personal details' })).toBeInTheDocument();
    });

    it('should render correct message when selfExclusion status received', () => {
        const result = getDepositLockedDesc({
            askFixDetails: false,
            excludedUntil: new Date('01/01/2100'),
            financialInformationNotComplete: false,
            isMFAccount: false,
            isTNCNeeded: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: true,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
        });

        if (result) render(result);
        expect(
            screen.getByText(/You have chosen to exclude yourself from trading on our website until 01 Jan 2100/)
        ).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        fireEvent.click(link);
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
    });

    it('should render correct message when unwelcomeStatus status received', () => {
        const result = getDepositLockedDesc({
            askFixDetails: false,
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: false,
            isTNCNeeded: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Please contact us/)).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        fireEvent.click(link);
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
    });
});

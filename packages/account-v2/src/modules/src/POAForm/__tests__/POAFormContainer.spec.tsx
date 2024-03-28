import React from 'react';
import * as routerDOM from 'react-router-dom';
import { useActiveTradingAccount, useAuthorize } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ACCOUNT_V2_ROUTES, P2P_ROUTE } from '../../../../constants/routes';
import { usePOAInfo } from '../../../../hooks/usePOAInfo';
import { isNavigationFromDerivGO, isNavigationFromP2P } from '../../../../utils/platform';
import { POAFormContainer } from '../POAFormContainer';

jest.mock('@deriv/quill-design', () => ({
    useBreakpoint: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('../../../../utils/platform');

jest.mock('../../../../containers/POAForm/AddressDetailsForm', () => ({
    AddressDetailsForm: ({ resubmitting }: { resubmitting: boolean }) => (
        <div>Address Details Form {resubmitting && 'resubmitting'}</div>
    ),
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

jest.mock('@deriv/api-v2');
jest.mock('../../../../hooks/usePOAInfo');

beforeEach(() => {
    (useAuthorize as jest.Mock).mockReturnValue({ data: {} });
    (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: false } });
    (usePOAInfo as jest.Mock).mockReturnValue({
        data: {
            documentNotRequired: false,
            documentStatus: false,
            documentSubmitted: false,
            isPOAResubmission: false,
            isPOINeeded: false,
        },
        isLoading: false,
    });
    (isNavigationFromDerivGO as jest.Mock).mockReturnValue(false);
    (isNavigationFromP2P as jest.Mock).mockReturnValue(false);
});

describe('POAFormPOAFormContainer', () => {
    it('displays the loader when isLoading is true', () => {
        (usePOAInfo as jest.Mock).mockReturnValue({
            data: {
                documentNotRequired: false,
                documentStatus: false,
                documentSubmitted: false,
                isPOAResubmission: false,
                isPOINeeded: false,
            },
            isLoading: true,
        });
        render(<POAFormContainer />);
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('displays the demo message when the active account is virtual', () => {
        (useActiveTradingAccount as jest.Mock).mockReturnValue({
            data: {
                is_virtual: true,
            },
        });
        render(<POAFormContainer />);
        expect(screen.getByText('This feature is not available for demo accounts.')).toBeInTheDocument();
    });

    it('displays the address details form when resubmitting or isPOAResubmission is true', () => {
        (usePOAInfo as jest.Mock).mockReturnValue({
            data: {
                documentNotRequired: false,
                documentStatus: false,
                documentSubmitted: false,
                isPOAResubmission: true,
                isPOINeeded: false,
            },
            isLoading: false,
        });
        render(<POAFormContainer />);
        expect(screen.getByText('Address Details Form resubmitting')).toBeInTheDocument();
    });

    it('calls the handleResubmit function when the resubmit button is clicked', async () => {
        (usePOAInfo as jest.Mock).mockReturnValue({
            data: {
                documentNotRequired: false,
                documentStatus: 'expired',
                documentSubmitted: false,
                isPOAResubmission: false,
                isPOINeeded: false,
            },
            isLoading: false,
        });
        render(<POAFormContainer />);
        userEvent.click(screen.getByText('Resubmit'));
        await waitFor(() => {
            expect(screen.getByText('Address Details Form resubmitting')).toBeInTheDocument();
        });
    });

    it('displays the address details form when documentStatus is "none"', () => {
        (usePOAInfo as jest.Mock).mockReturnValue({
            data: {
                documentNotRequired: false,
                documentStatus: 'none',
                documentSubmitted: false,
                isPOAResubmission: false,
                isPOINeeded: false,
            },
            isLoading: false,
        });

        render(<POAFormContainer />);
        expect(screen.getByText('Address Details Form')).toBeInTheDocument();
    });

    it('displays the verified message when documentStatus is "verified"', () => {
        (usePOAInfo as jest.Mock).mockReturnValue({
            data: {
                documentNotRequired: false,
                documentStatus: 'verified',
                documentSubmitted: true,
                isPOAResubmission: false,
                isPOINeeded: false,
            },
            isLoading: false,
        });

        render(<POAFormContainer />);
        expect(screen.getByText('Your documents were submitted successfully')).toBeInTheDocument();
    });

    it('redirects to P2P when the back to P2P button is clicked', () => {
        (isNavigationFromP2P as jest.Mock).mockReturnValue(true);
        (usePOAInfo as jest.Mock).mockReturnValue({
            data: {
                documentNotRequired: false,
                documentStatus: 'pending',
                documentSubmitted: false,
                isPOAResubmission: false,
                isPOINeeded: false,
            },
            isLoading: false,
        });

        const pushMock = jest.fn();
        jest.spyOn(routerDOM, 'useHistory').mockReturnValue({ push: pushMock });
        render(<POAFormContainer />);
        userEvent.click(screen.getByText('Back to P2P'));
        expect(pushMock).toHaveBeenCalledWith(P2P_ROUTE);
    });

    it('redirects to ProofOfIdentity when the Proof of identity button is clicked', () => {
        (usePOAInfo as jest.Mock).mockReturnValue({
            data: {
                documentNotRequired: false,
                documentStatus: 'none',
                documentSubmitted: true,
                isPOAResubmission: false,
                isPOINeeded: true,
            },
            isLoading: false,
        });

        const pushMock = jest.fn();
        jest.spyOn(routerDOM, 'useHistory').mockReturnValue({ push: pushMock });

        render(<POAFormContainer />);
        userEvent.click(screen.getByText('Proof of identity'));
        expect(pushMock).toHaveBeenCalledWith(ACCOUNT_V2_ROUTES.ProofOfIdentity);
    });

    it('redirects to the homepage when the Continue trading button is clicked', () => {
        (usePOAInfo as jest.Mock).mockReturnValue({
            data: {
                documentNotRequired: false,
                documentStatus: 'none',
                documentSubmitted: true,
                isPOAResubmission: false,
                isPOINeeded: false,
            },
            isLoading: false,
        });

        const pushMock = jest.fn();
        jest.spyOn(routerDOM, 'useHistory').mockReturnValue({ push: pushMock });

        render(<POAFormContainer />);
        userEvent.click(screen.getByText('Continue trading'));
        expect(pushMock).toHaveBeenCalledWith('/');
    });
});

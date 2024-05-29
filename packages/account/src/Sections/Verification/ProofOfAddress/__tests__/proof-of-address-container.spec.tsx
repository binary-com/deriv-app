import React from 'react';
import merge from 'lodash.merge';
import { screen, render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import ProofOfAddressContainer from '../proof-of-address-container';
import { BrowserRouter } from 'react-router-dom';
import { useKycAuthStatus } from '../../../../hooks';
import { AUTH_STATUS_CODES } from '@deriv/shared';
import userEvent from '@testing-library/user-event';

type TKYCAuthStatusResponse = Partial<ReturnType<typeof useKycAuthStatus>>;

const mock_kyc_auth_status_response: TKYCAuthStatusResponse = {
    kyc_auth_status: {
        address: { status: 'none' },
        identity: { status: 'none' },
    },
    isLoading: false,
    isSuccess: false,
    reFetchKycAuthStatus: jest.fn(),
};

jest.mock('../../../../hooks', () => ({
    useKycAuthStatus: jest.fn(() => mock_kyc_auth_status_response),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getPlatformRedirect: jest.fn(),
    WS: {
        wait: jest.fn().mockResolvedValue({}),
    },
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useFileUploader: jest.fn(() => ({
        upload: jest.fn(),
    })),
}));

jest.mock('Components/poa/common-mistakes/common-mistake-examples', () =>
    jest.fn(() => <div>MockCommonMistakeExampleComponent</div>)
);

describe('ProofOfAddressContainer', () => {
    const store = mockStore({});

    const mergeResponse = (override: TKYCAuthStatusResponse) => merge(mock_kyc_auth_status_response, override);

    const renderComponent = (store_config = store) =>
        render(
            <BrowserRouter>
                <StoreProvider store={store_config}>
                    <ProofOfAddressContainer />
                </StoreProvider>
            </BrowserRouter>
        );

    it('should render POA form when POA status is none', async () => {
        const mock_store = mockStore({
            client: {
                fetchResidenceList: jest.fn().mockResolvedValueOnce({}),
                fetchStatesList: jest.fn().mockResolvedValueOnce({}),
            },
        });

        renderComponent(mock_store);
        expect(await screen.findByRole('button', { name: /Save and submit/i })).toBeInTheDocument();
    });

    it('should render POA pending status screen with Continue trading button', () => {
        const mockResponse = mergeResponse({
            kyc_auth_status: {
                address: { status: AUTH_STATUS_CODES.PENDING },
                identity: { status: AUTH_STATUS_CODES.VERIFIED },
            },
        });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        renderComponent();

        expect(screen.getByText(/Your document is being reviewed, please check back in 1-3 days/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /continue trading/i })).toBeInTheDocument();
    });

    it('should render POA pending status screen with POI required button', () => {
        const mockResponse = mergeResponse({
            kyc_auth_status: {
                address: { status: AUTH_STATUS_CODES.PENDING },
                identity: { status: AUTH_STATUS_CODES.NONE },
            },
        });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        renderComponent();

        expect(screen.getByText(/Your document is being reviewed, please check back in 1-3 days/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Proof of identity/i })).toBeInTheDocument();
    });

    it('should render POA verified status screen with Continue trading button', () => {
        const mockResponse = mergeResponse({
            kyc_auth_status: {
                address: { status: AUTH_STATUS_CODES.VERIFIED },
                identity: { status: AUTH_STATUS_CODES.VERIFIED },
            },
        });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        renderComponent();

        expect(screen.getByText(/Your proof of address is verified/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /continue trading/i })).toBeInTheDocument();
    });

    it('should render POA verified status screen with POI required button', () => {
        const mockResponse = mergeResponse({
            kyc_auth_status: {
                address: { status: AUTH_STATUS_CODES.VERIFIED },
                identity: { status: AUTH_STATUS_CODES.REJECTED },
            },
        });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        renderComponent();

        expect(screen.getByText(/Your proof of address is verified/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Proof of identity/i })).toBeInTheDocument();
    });

    it('should render POA expired status screen with Resubmit button', () => {
        const mockResponse = mergeResponse({
            kyc_auth_status: {
                address: { status: AUTH_STATUS_CODES.EXPIRED },
                identity: { status: AUTH_STATUS_CODES.VERIFIED },
            },
        });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        renderComponent();

        expect(screen.getByText(/New proof of address is needed/i)).toBeInTheDocument();
        expect(screen.getByText(/Your document for proof of address is expired/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Resubmit/i })).toBeInTheDocument();
    });

    it('should render POA rejected status screen with Resubmit button', () => {
        const mockResponse = mergeResponse({
            kyc_auth_status: {
                address: { status: AUTH_STATUS_CODES.REJECTED },
                identity: { status: AUTH_STATUS_CODES.VERIFIED },
            },
        });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        renderComponent();

        expect(screen.getByText(/We could not verify your proof of address/i)).toBeInTheDocument();
        expect(screen.getByText(/Please check your email for details/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Resubmit/i })).toBeInTheDocument();
    });

    it('should render error banner and display form fields on POA when navigated from Status page to resubmit data', async () => {
        const mockResponse = mergeResponse({
            kyc_auth_status: {
                address: { status: AUTH_STATUS_CODES.EXPIRED },
                identity: { status: AUTH_STATUS_CODES.NONE },
            },
        });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        const mock_store = mockStore({
            client: {
                fetchResidenceList: jest.fn().mockResolvedValueOnce({}),
                fetchStatesList: jest.fn().mockResolvedValueOnce({}),
            },
        });

        renderComponent(mock_store);

        userEvent.click(screen.getByRole('button', { name: /Resubmit/i }));

        expect(
            await screen.findByText(
                /We were unable to verify your address with the details you provided. Please check and resubmit or choose a different document type/i
            )
        ).toBeInTheDocument();

        expect(screen.getAllByRole('textbox')).toHaveLength(5);
    });

    it('should render loading screen while waiting for API response', () => {
        const mockResponse = mergeResponse({ isLoading: true });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        renderComponent();

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });
});

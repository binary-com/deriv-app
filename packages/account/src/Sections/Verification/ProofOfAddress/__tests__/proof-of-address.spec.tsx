import React from 'react';
import { screen, render } from '@testing-library/react';
import ProofOfAddress from '../proof-of-address';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useKycAuthStatus } from '../../../../hooks';
import { BrowserRouter } from 'react-router-dom';

type TKYCAuthStatusResponse = Partial<ReturnType<typeof useKycAuthStatus>>;

const mock_kyc_auth_status_response: TKYCAuthStatusResponse = {
    kyc_auth_status: {
        address: { status: 'pending' },
        identity: { status: 'none' },
    },
    isLoading: false,
    isSuccess: false,
    reFetchKycAuthStatus: jest.fn(),
};

jest.mock('../../../../hooks', () => ({
    useKycAuthStatus: jest.fn(() => mock_kyc_auth_status_response),
}));

describe('ProofOfAddress', () => {
    const store = mockStore({});

    const renderComponent = (store_config = store) =>
        render(
            <BrowserRouter>
                <StoreProvider store={store_config}>
                    <ProofOfAddress />
                </StoreProvider>
            </BrowserRouter>
        );

    it('should render message on POA when client is on virtual account', () => {
        const store_config = mockStore({
            client: {
                is_virtual: true,
            },
        });

        renderComponent(store_config);
        expect(screen.getByText('This feature is not available for demo accounts.')).toBeInTheDocument();
    });

    it('should render ProofofAddressContainer when client is on real account', () => {
        renderComponent();

        expect(screen.getByText(/Your proof of address was submitted successfully/i)).toBeInTheDocument();
        expect(screen.getByText(/You must also submit a proof of identity/i)).toBeInTheDocument();
    });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { usePOIInfo } from '../../../hooks';
import { POIFlowContainer } from '../POIFlowContainer';

jest.mock('../../../hooks', () => ({
    usePOIInfo: jest.fn().mockReturnValue({ isLoading: false, kycAuthStatus: {} }),
}));

jest.mock('@deriv/api-v2', () => ({
    useIdentityDocumentVerificationAdd: jest.fn().mockReturnValue({ mutateAsync: jest.fn() }),
    useOnfido: jest.fn().mockReturnValue({
        data: {},
        hasSubmitted: false,
        isOnfidoInitialized: false,
        isServiceTokenLoading: false,
        onfidoContainerId: '',
        onfidoInitializationError: {},
        onfidoRef: { current: { safeTearDown: jest.fn() } },
        serviceTokenError: {},
    }),
    useSettings: jest.fn().mockReturnValue({ data: {}, mutation: { mutateAsync: jest.fn() } }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

describe('POIFlowContainer', () => {
    it('should render loader when loading', () => {
        (usePOIInfo as jest.Mock).mockReturnValue({ isLoading: true, kycAuthStatus: { identity: {} } });
        render(<POIFlowContainer countryCode='country' onCancel={jest.fn()} onComplete={jest.fn()} />);
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should render OnfidoContainer when available service is onfido', () => {
        (usePOIInfo as jest.Mock).mockReturnValue({
            isLoading: false,
            kycAuthStatus: { identity: { available_services: ['onfido'] } },
        });
        render(<POIFlowContainer countryCode='country' onCancel={jest.fn()} onComplete={jest.fn()} />);

        expect(screen.getByTestId('dt_onfido_element')).toBeInTheDocument();
    });

    it('should render IDVService when available service is idv', () => {
        (usePOIInfo as jest.Mock).mockReturnValue({
            isLoading: false,
            kycAuthStatus: {
                identity: {
                    available_services: ['idv'],
                    supported_documents: { idv: { national_identity_card: true } },
                },
            },
        });
        render(<POIFlowContainer countryCode='country' onCancel={jest.fn()} onComplete={jest.fn()} />);

        expect(screen.getByText(/Identity verification/i)).toBeInTheDocument();
    });

    it('should render ManualUpload when available service is manual', () => {
        (usePOIInfo as jest.Mock).mockReturnValue({
            isLoading: false,
            kycAuthStatus: { identity: { available_services: ['manual'] } },
        });
        render(<POIFlowContainer countryCode='country' onCancel={jest.fn()} onComplete={jest.fn()} />);

        expect(screen.getByText(/Please upload one of the following documents/i)).toBeInTheDocument();
    });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProofOfAddressForm from '../proof-of-address-form';
import { useDevice } from '@deriv-com/ui';
import { mockStore, StoreProvider } from '@deriv/stores';
import { BrowserRouter } from 'react-router-dom';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useFileUploader: jest.fn(() => ({
        upload: jest.fn(),
    })),
}));

jest.mock('../poa-desktop-layout.tsx', () => jest.fn(() => 'mockedPOADesktopForm'));

jest.mock('../poa-mobile-layout.tsx', () => jest.fn(() => 'mockedPOAMobileForm'));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        authorized: {
            storage: {
                getSettings: jest.fn().mockResolvedValue({
                    get_settings: {
                        address_line_1: 'test address_line_1',
                        address_line_2: 'test address_line_2',
                        address_city: 'test address_city',
                        address_state: 'test address_state',
                        address_postcode: 'test address_postcode',
                    },
                }),
                getAccountStatus: jest.fn().mockResolvedValue({
                    get_account_status: {
                        authentication: {
                            document: {
                                status: 'none',
                            },
                            identity: {
                                status: 'none',
                            },
                        },
                    },
                }),
            },
        },
        setSettings: jest.fn(() => Promise.resolve({ error: '' })),
        wait: jest.fn(() => Promise.resolve([])),
        getSocket: jest.fn().mockReturnValue({}),
    },
}));

describe('ProofOfAddressForm', () => {
    const mock_props: React.ComponentProps<typeof ProofOfAddressForm> = {};

    const mock_store = mockStore({
        client: {
            account_settings: {
                address_line_1: 'test address_line_1',
                address_line_2: 'test address_line_2',
                address_city: 'test address_city',
                address_state: 'test address_state',
                address_postcode: 'test address_postcode',
            },
            fetchResidenceList: jest.fn(() => Promise.resolve('')),
            fetchStatesList: jest.fn(() => Promise.resolve('')),
            getChangeableFields: jest.fn(() => []),
        },
    });

    const renderComponent = ({ props = mock_props, store = mock_store }) => {
        return render(
            <BrowserRouter>
                <StoreProvider store={store}>
                    <ProofOfAddressForm {...props} />
                </StoreProvider>
            </BrowserRouter>
        );
    };

    it('should render Desktop layout of the form', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false, isDesktop: true });

        renderComponent({});

        expect(await screen.findByText('mockedPOADesktopForm')).toBeInTheDocument();
    });

    it('should render Mobile layout of the form', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true, isDesktop: false });

        renderComponent({});

        expect(await screen.findByText('mockedPOAMobileForm')).toBeInTheDocument();
    });
});

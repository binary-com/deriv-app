import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { useGetStatus, useIsSelectedMT5AccountCreated } from '@deriv/hooks';
import VerificationDocsListModal from '../verification-docs-list-modal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetStatus: jest.fn(() => ({
        client_kyc_status: { poi_status: 'rejected', poa_status: 'verified', valid_tin: 1 },
    })),
    useIsSelectedMT5AccountCreated: jest.fn(() => ({ is_selected_MT5_account_created: false })),
}));

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    LabelPairedChevronRightCaptionBoldIcon: () => <div>LabelPairedChevronRightCaptionBoldIcon</div>,
    DerivLightUserVerificationIcon: () => <div>DerivLightUserVerificationIcon</div>,
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    StatusBadge: () => <div>StatusBadge</div>,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    CFD_PLATFORMS: { MT5: 'mt5' },
}));

describe('<VerificationDocsListModal />', () => {
    const defaultstore = mockStore({
        traders_hub: {
            is_verification_docs_list_modal_visible: true,
            setVerificationModalOpen: jest.fn(),
        },
        common: {
            platform: 'mt5',
        },
    });
    const renderComponent = ({ store = defaultstore }) => {
        render(
            <StoreProvider store={store}>
                <VerificationDocsListModal />
            </StoreProvider>
        );
    };
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render the modal with details when mt5 account is created', () => {
        (useIsSelectedMT5AccountCreated as jest.Mock).mockReturnValue({ is_selected_MT5_account_created: true });
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: false });
        (useGetStatus as jest.Mock).mockReturnValueOnce({
            client_kyc_status: {
                poi_status: 'none',
                poa_status: 'verified',
                valid_tin: 1,
            },
        });
        renderComponent({});
        expect(screen.getByText('Verification required')).toBeInTheDocument();
        expect(screen.getByText('Your account needs verification.')).toBeInTheDocument();
        expect(screen.getByText('Proof of identity')).toBeInTheDocument();
        expect(screen.getByText('Proof of address')).toBeInTheDocument();
        expect(screen.queryByText('Additional information')).not.toBeInTheDocument();
    });

    it('should render the modal with details when mt5 account is not created', () => {
        (useIsSelectedMT5AccountCreated as jest.Mock).mockReturnValue({ is_selected_MT5_account_created: false });
        (useGetStatus as jest.Mock).mockReturnValueOnce({
            client_kyc_status: {
                poi_status: 'pending',
                poa_status: 'none',
                valid_tin: 0,
            },
        });
        renderComponent({});
        expect(screen.getByText('DerivLightUserVerificationIcon')).toBeInTheDocument();
        expect(screen.getByText('Complete your profile')).toBeInTheDocument();
        expect(
            screen.getByText('Confirm your details to open the account. After verification, you can begin trading.')
        ).toBeInTheDocument();
        expect(screen.getByText('Proof of identity')).toBeInTheDocument();
        expect(screen.getByText('Proof of address')).toBeInTheDocument();
        expect(screen.queryByText('Additional information')).toBeInTheDocument();
    });
    it('should render the modal with details when platform is not mt5', () => {
        (useIsSelectedMT5AccountCreated as jest.Mock).mockReturnValue({ is_selected_MT5_account_created: false });
        (useGetStatus as jest.Mock).mockReturnValueOnce({
            client_kyc_status: {
                poi_status: 'pending',
                poa_status: 'none',
            },
        });
        const mock_store = mockStore({
            traders_hub: {
                is_verification_docs_list_modal_visible: true,
                setVerificationModalOpen: jest.fn(),
            },
            common: {
                platform: '',
            },
        });
        renderComponent({ store: mock_store });
        expect(screen.getByText('DerivLightUserVerificationIcon')).toBeInTheDocument();
        expect(screen.getByText('Verification required')).toBeInTheDocument();
        expect(screen.getByText('Your account needs verification.')).toBeInTheDocument();
        expect(screen.getByText('Proof of identity')).toBeInTheDocument();
        expect(screen.getByText('Proof of address')).toBeInTheDocument();
        expect(screen.queryByText('Additional information ')).not.toBeInTheDocument();
    });
});

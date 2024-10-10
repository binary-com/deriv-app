import React from 'react';
import { render, screen } from '@testing-library/react';
import ListItem from '../ListItem';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { useGetStatus, useIsSelectedMT5AccountCreated } from '@deriv/hooks';
import { AUTH_STATUS_CODES } from '@deriv/shared';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetStatus: jest.fn(),
    useIsSelectedMT5AccountCreated: jest.fn(),
}));

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    DerivLightUploadPoiIcon: () => <div>DerivLightUploadPoiIcon</div>,
    LabelPairedChevronRightMdRegularIcon: () => <div>LabelPairedChevronRightMdRegularIcon</div>,
    DerivLightWaitingPoaIcon: () => <div>DerivLightWaitingPoaIcon</div>,
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    StatusBadge: () => <div>StatusBadge</div>,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    AUTH_STATUS_CODES: {
        VERIFIED: 'verified',
        PENDING: 'pending',
        REJECTED: 'rejected',
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
        location: { search: 'test' },
    }),
}));

describe('<ListItem />', () => {
    const defaultStore = mockStore({
        traders_hub: {
            setVerificationModalOpen: jest.fn(),
        },
        common: {
            platform: 'mt5',
        },
    });

    const renderComponent = (props: { id: string; text: string; status: string; route: string }) => {
        render(
            <StoreProvider store={defaultStore}>
                <ListItem {...props} />
            </StoreProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (useGetStatus as jest.Mock).mockReturnValue({
            client_kyc_status: { poi_status: 'verified', poa_status: 'verified', valid_tin: 'verified' },
        });
        (useIsSelectedMT5AccountCreated as jest.Mock).mockReturnValue({ is_selected_MT5_account_created: true });
    });

    it('should render verified status', () => {
        const props = {
            id: 'identity',
            text: 'Verified',
            status: AUTH_STATUS_CODES.VERIFIED,
            route: '/proof_of_identity',
        };
        renderComponent(props);

        expect(screen.getByText('Verified')).toBeInTheDocument();
        expect(screen.getByText('StatusBadge')).toBeInTheDocument();
        expect(screen.getByText('LabelPairedChevronRightMdRegularIcon')).toBeInTheDocument();
    });

    it('should render pending status', () => {
        const props = {
            id: 'identity',
            text: 'In review',
            status: AUTH_STATUS_CODES.PENDING,
            route: '/proof_of_identity',
        };
        renderComponent(props);

        expect(screen.getByText('In review')).toBeInTheDocument();
        expect(screen.getByText('StatusBadge')).toBeInTheDocument();
        expect(screen.getByText('LabelPairedChevronRightMdRegularIcon')).toBeInTheDocument();
    });

    it('should render with Failed status', () => {
        const props = {
            id: 'identity',
            text: 'Failed',
            status: AUTH_STATUS_CODES.REJECTED,
            route: '/proof_of_identity',
        };
        renderComponent(props);

        expect(screen.getByText('Failed')).toBeInTheDocument();
        expect(screen.getByText('StatusBadge')).toBeInTheDocument();
        expect(screen.getByText('LabelPairedChevronRightMdRegularIcon')).toBeInTheDocument();
    });
});

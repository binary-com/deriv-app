import React from 'react';
import { usePOA, usePOI } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerificationFailed from '../VerificationFailed';

const mockHideModal = jest.fn();
const mockShowModal = jest.fn();

jest.mock('../../../flows/ClientVerification/ClientVerification', () => ({
    ...jest.requireActual('../../../flows/ClientVerification/ClientVerification'),
    ClientVerification: jest.fn(() => <div>ClientVerification</div>),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    usePOA: jest.fn(),
    usePOI: jest.fn(),
}));

jest.mock('../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../components/ModalProvider'),
    useModal: jest.fn(() => ({
        hide: mockHideModal,
        show: mockShowModal,
    })),
}));

describe('<VerificationFailed />', () => {
    it('renders failed verification modal for POI failure', () => {
        (usePOI as jest.Mock).mockReturnValue({
            data: { is_expired: true, is_rejected: true, is_suspected: true },
        });
        (usePOA as jest.Mock).mockReturnValue({
            data: { is_expired: false, is_rejected: false, is_suspected: false },
        });
        render(<VerificationFailed selectedJurisdiction='bvi' />);

        expect(screen.getByText('Why did my verification fail?')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Your proof of identity document did not pass our verification checks. This could be due to reasons such as:'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Maybe later')).toBeInTheDocument();
        expect(screen.getAllByText('Resubmit documents')[1]).toBeInTheDocument();
    });

    it('renders failed verification modal for POA failure', () => {
        (usePOI as jest.Mock).mockReturnValue({
            data: { is_expired: false, is_rejected: false, is_suspected: false },
        });
        (usePOA as jest.Mock).mockReturnValue({
            data: { is_expired: true, is_rejected: true, is_suspected: true },
        });
        render(<VerificationFailed selectedJurisdiction='bvi' />);

        expect(screen.getByText('Why did my verification fail?')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Your proof of address document did not pass our verification checks. This could be due to reasons such as:'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Maybe later')).toBeInTheDocument();
        expect(screen.getAllByText('Resubmit documents')[1]).toBeInTheDocument();
    });

    it('renders failed verification modal for both POI and POA failure', () => {
        (usePOI as jest.Mock).mockReturnValue({
            data: { is_expired: true, is_rejected: false, is_suspected: false },
        });
        (usePOA as jest.Mock).mockReturnValue({
            data: { is_expired: true, is_rejected: false, is_suspected: false },
        });
        render(<VerificationFailed selectedJurisdiction='bvi' />);

        expect(screen.getByText('Why did my verification fail?')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Your proof of identity and proof of address documents did not pass our verification checks. This could be due to reasons such as:'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Maybe later')).toBeInTheDocument();
        expect(screen.getAllByText('Resubmit documents')[1]).toBeInTheDocument();
    });

    it('closes the failed verification popup upon clicking `Maybe later`', async () => {
        (usePOI as jest.Mock).mockReturnValue({
            data: { is_expired: true, is_rejected: false, is_suspected: false },
        });
        (usePOA as jest.Mock).mockReturnValue({
            data: { is_expired: true, is_rejected: false, is_suspected: false },
        });
        render(<VerificationFailed selectedJurisdiction='bvi' />);

        expect(screen.getByText('Why did my verification fail?')).toBeInTheDocument();

        await userEvent.click(screen.getByText('Maybe later'));

        await waitFor(() => {
            expect(mockHideModal).toBeCalled();
        });
    });

    it('triggers show function which mounts ClientVerification component on clicking `Resubmit documents`', async () => {
        (usePOI as jest.Mock).mockReturnValue({
            data: { is_expired: true, is_rejected: false, is_suspected: false },
        });
        (usePOA as jest.Mock).mockReturnValue({
            data: { is_expired: true, is_rejected: false, is_suspected: false },
        });
        render(<VerificationFailed selectedJurisdiction='bvi' />);

        expect(screen.getByText('Why did my verification fail?')).toBeInTheDocument();

        await userEvent.click(screen.getAllByText('Resubmit documents')[1]);

        await waitFor(() => {
            expect(mockShowModal).toBeCalled();
        });
    });
});

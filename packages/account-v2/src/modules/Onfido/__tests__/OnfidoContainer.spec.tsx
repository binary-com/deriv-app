import React from 'react';
import { useOnfido } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnfidoContainer } from '../OnfidoContainer';

const mockPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({ push: mockPush })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useOnfido: jest.fn(() => ({
        data: {},
        isOnfidoInitialized: true,
        isServiceTokenLoading: false,
    })),
    useSettings: jest.fn(() => ({
        data: {},
        mutation: { mutateAsync: jest.fn() },
    })),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('OnfidoContainer', () => {
    it('renders without crashing', () => {
        render(<OnfidoContainer />);
    });

    it('renders loader while service token is loading', () => {
        (useOnfido as jest.Mock).mockReturnValue({
            data: {},
            isOnfidoInitialized: true,
            isServiceTokenLoading: true,
        });
        render(<OnfidoContainer />);
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('renders missing personal details message when service token error is MissingPersonalDetails', () => {
        const serviceTokenError = { error: { code: 'MissingPersonalDetails' } };
        (useOnfido as jest.Mock).mockReturnValue({
            data: {},
            isOnfidoInitialized: true,
            isServiceTokenLoading: false,
            serviceTokenError,
        });
        render(<OnfidoContainer />);
        expect(screen.getByText('Your personal details are missing')).toBeInTheDocument();
        expect(
            screen.getByText('Please complete your personal details before you verify your identity.')
        ).toBeInTheDocument();
        expect(screen.getByText('Go to personal details')).toBeInTheDocument();
        userEvent.click(screen.getByText('Go to personal details'));
        expect(mockPush).toHaveBeenCalledWith('/account/personal-details?from=proof_of_identity');
    });

    it('renders missing postal code message when service token error is InvalidPostalCode', () => {
        const serviceTokenError = { error: { code: 'InvalidPostalCode' } };
        (useOnfido as jest.Mock).mockReturnValue({
            data: {},
            isOnfidoInitialized: true,
            isServiceTokenLoading: false,
            serviceTokenError,
        });
        render(<OnfidoContainer />);

        expect(screen.getByText('Your postal code is invalid')).toBeInTheDocument();
        expect(
            screen.getByText('Please check and update your postal code before submitting proof of identity.')
        ).toBeInTheDocument();
        expect(screen.getByText('Update postal code')).toBeInTheDocument();
        userEvent.click(screen.getByText('Update postal code'));
        expect(mockPush).toHaveBeenCalledWith('/account/personal-details?from=proof_of_identity#address_postcode');
    });

    it('renders error message when onfido initialization error occurs', () => {
        const onfidoInitializationError = { message: 'Failed to initialize Onfido' };
        (useOnfido as jest.Mock).mockReturnValue({
            data: {},
            isOnfidoInitialized: false,
            isServiceTokenLoading: false,
            onfidoInitializationError,
        });
        render(<OnfidoContainer />);

        expect(screen.getByText('Failed to initialize Onfido')).toBeInTheDocument();
    });

    it('calls onOnfidoSubmit and safeTearDown when hasSubmitted is true', () => {
        const onOnfidoSubmitMock = jest.fn();
        const safeTearDownMock = jest.fn();
        (useOnfido as jest.Mock).mockReturnValue({
            data: { hasSubmitted: true, onfidoRef: { current: { safeTearDown: safeTearDownMock } } },
            isOnfidoInitialized: true,
            isServiceTokenLoading: false,
        });
        render(<OnfidoContainer onOnfidoSubmit={onOnfidoSubmitMock} />);

        expect(onOnfidoSubmitMock).toHaveBeenCalled();
        expect(safeTearDownMock).toHaveBeenCalled();
    });

    it('enables Onfido when clicked', async () => {
        (useOnfido as jest.Mock).mockReturnValue({
            data: { onfidoElement: 'onfido-element-id' },
            isOnfidoInitialized: true,
            isServiceTokenLoading: false,
        });
        render(<OnfidoContainer />);
        const onfidoView = screen.getByTestId('dt_onfido_element');
        expect(onfidoView).toHaveClass('opacity-48 pointer-events-none');

        userEvent.type(screen.getByLabelText(/First name/), 'John');
        userEvent.type(screen.getByLabelText(/Last name/), 'Doe');
        userEvent.type(screen.getByLabelText(/Date of birth/), '2020-11-11');

        await waitFor(() => {
            userEvent.click(screen.getByTestId('dt_poi_confirm_with_example'));
        });
        expect(onfidoView).not.toHaveClass('opacity-48 pointer-events-none');
    });
});

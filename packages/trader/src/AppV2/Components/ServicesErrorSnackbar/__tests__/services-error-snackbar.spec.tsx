import React from 'react';
import { render } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { useSnackbar } from '@deriv-com/quill-ui';
import { useLocation } from 'react-router';
import TraderProviders from '../../../../trader-providers';
import ServicesErrorSnackbar from '../services-error-snackbar';

jest.mock('@deriv-com/quill-ui', () => ({
    ...jest.requireActual('@deriv-com/quill-ui'),
    useSnackbar: jest.fn(),
}));
jest.mock('react-router', () => ({
    useLocation: jest.fn(),
}));

describe('ServicesErrorSnackbar', () => {
    let default_mock_store: ReturnType<typeof mockStore>;
    let mockAddSnackbar = jest.fn();

    beforeEach(() => {
        default_mock_store = mockStore({
            client: { is_logged_in: true },
            common: {
                services_error: {
                    code: 'SomeAwesomeError',
                    message: 'Mock error message',
                    type: 'buy',
                },
                resetServicesError: jest.fn(),
            },
            ui: {
                is_mf_verification_pending_modal_visible: false,
                setIsMFVericationPendingModal: jest.fn(),
            },
        });
        mockAddSnackbar = jest.fn();
        (useSnackbar as jest.Mock).mockReturnValue({ addSnackbar: mockAddSnackbar });
    });

    const mockServicesErrorSnackbar = () => {
        return (
            <TraderProviders store={default_mock_store}>
                <ServicesErrorSnackbar />
            </TraderProviders>
        );
    };

    it('should call useSnackbar if it is trading page, there is a services_error and it is not a modal error', () => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: '/dtrader',
        });
        render(mockServicesErrorSnackbar());

        expect(mockAddSnackbar).toHaveBeenCalled();
    });

    it('should call useSnackbar if it is positions page and there is a services_error', () => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: '/dtrader/positions',
        });
        render(mockServicesErrorSnackbar());

        expect(mockAddSnackbar).toHaveBeenCalled();
    });

    it('should not call useSnackbar if it is reports page and there is a services_error', () => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: '/reports',
        });
        render(mockServicesErrorSnackbar());

        expect(mockAddSnackbar).not.toHaveBeenCalled();
    });

    it('should not call useSnackbar if there is no services_error', () => {
        default_mock_store.common.services_error = {};
        render(mockServicesErrorSnackbar());

        expect(mockAddSnackbar).not.toHaveBeenCalled();
    });
});

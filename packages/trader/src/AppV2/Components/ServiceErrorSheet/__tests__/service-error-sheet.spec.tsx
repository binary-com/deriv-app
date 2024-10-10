import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../trader-providers';
import * as fileUtils from '@deriv/shared';
import ServiceErrorSheet from '../service-error-sheet';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    redirectToLogin: jest.fn(),
}));
jest.mock('AppV2/Hooks/useSignupTrigger', () => ({
    ...jest.requireActual('AppV2/Hooks/useSignupTrigger'),
    useSignupTrigger: jest.fn(() => ({ handleSignup: jest.fn() })),
}));

describe('ServiceErrorSheet', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    const history = createMemoryHistory();
    beforeEach(() => {
        default_mock_store = mockStore({
            client: { is_logged_in: true, has_wallet: false, is_virtual: false },
            common: {
                services_error: {
                    code: 'InsufficientBalance',
                    message: 'Your account balance (0.00 USD) is insufficient to buy this contract (10.00 USD).',
                    type: 'buy',
                },
                resetServicesError: jest.fn(),
            },
            ui: {
                is_mf_verification_pending_modal_visible: false,
                setIsMFVericationPendingModal: jest.fn(),
            },
        });
    });

    const mockTrade = () => {
        return (
            <Router history={history}>
                <TraderProviders store={default_mock_store}>
                    <ServiceErrorSheet />
                </TraderProviders>
            </Router>
        );
    };

    it('should render Action Sheet with correct text and button functionality for InsufficientBalance type of error', () => {
        render(mockTrade());

        expect(screen.getByText('Insufficient balance')).toBeInTheDocument();

        userEvent.click(screen.getByRole('button'));
        expect(default_mock_store.common.resetServicesError).toBeCalled();
    });

    it('should render Action Sheet with correct text for InvalidContractProposal type of error', () => {
        default_mock_store.common.services_error.code = 'InvalidContractProposal';
        render(mockTrade());

        expect(screen.getByText('Insufficient balance')).toBeInTheDocument();
    });

    it('should render Action Sheet with correct text and buttons functionality for AuthorizationRequired type of error', () => {
        const spyRedirectToLogin = jest.spyOn(fileUtils, 'redirectToLogin');
        default_mock_store.common.services_error.code = 'AuthorizationRequired';
        render(mockTrade());

        expect(screen.getByText('Start trading with us')).toBeInTheDocument();

        userEvent.click(screen.getByText('Create free account'));
        expect(default_mock_store.common.resetServicesError).toBeCalled();

        userEvent.click(screen.getByText('Login'));
        expect(spyRedirectToLogin).toBeCalled();
    });

    it('should render Action Sheet with correct text and button functionality for PleaseAuthenticate type of error', () => {
        default_mock_store.common.services_error.code = 'PleaseAuthenticate';
        render(mockTrade());

        expect(screen.getByText('Account verification required')).toBeInTheDocument();

        userEvent.click(screen.getByRole('button'));
        expect(default_mock_store.common.resetServicesError).toBeCalled();
    });

    it('should render Action Sheet with correct text and button functionality if is_mf_verification_pending_modal_visible === true', () => {
        default_mock_store.common.services_error.code = '';
        default_mock_store.ui.is_mf_verification_pending_modal_visible = true;
        render(mockTrade());

        expect(screen.getByText('Pending verification')).toBeInTheDocument();

        userEvent.click(screen.getByRole('button'));
        expect(default_mock_store.common.resetServicesError).toBeCalled();
        expect(default_mock_store.ui.setIsMFVericationPendingModal).toBeCalled();
    });

    it('should not render Action Sheet if there is no services_error', () => {
        default_mock_store.common.services_error = {};
        const { container } = render(mockTrade());

        expect(container).toBeEmptyDOMElement();
    });
});

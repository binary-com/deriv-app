import React from 'react';
import { Router } from 'react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBrowserHistory } from 'history';
import { useDepositFiatAddress, useHasMFAccountDeposited } from '@deriv/hooks';
import { StoreProvider, mockStore, useStore } from '@deriv/stores';
import OneTimeDepositModal from './one-time-deposit-modal';

let mock_store: ReturnType<typeof useStore>;

jest.mock('@deriv/hooks', () => ({
    useDepositFiatAddress: jest.fn(() => ({
        data: 'https://www.binary.com',
        isSuccess: true,
    })),
    useHasMFAccountDeposited: jest.fn(),
}));

describe('<OneTimeDepositModal />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        mock_store = mockStore({
            ui: {
                should_show_one_time_deposit_modal: true,
                setShouldShowOneTimeDepositModal: jest.fn(),
                toggleAccountSuccessModal: jest.fn(),
            },
            client: {
                loginid: 'MX12345',
                updateAccountStatus: jest.fn(),
            },
        });
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render one time deposit modal', () => {
        const history = createBrowserHistory();
        (useHasMFAccountDeposited as jest.Mock).mockReturnValueOnce({ has_mf_account_deposited: false });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );

        render(
            <Router history={history}>
                <OneTimeDepositModal />
            </Router>,
            {
                wrapper,
            }
        );
        expect(screen.getByText('Deposit')).toBeInTheDocument();
        expect(screen.getByText(/select a payment method to make a deposit into your account/i)).toBeInTheDocument();
        expect(screen.getByTestId('dt_deposit_fiat_iframe_iframe')).toBeInTheDocument();
    });

    it('should render loading component if iframe has not loaded', () => {
        const history = createBrowserHistory();
        (useHasMFAccountDeposited as jest.Mock).mockReturnValueOnce({ has_mf_account_deposited: false });
        (useDepositFiatAddress as jest.Mock).mockReturnValueOnce({
            data: '',
            isSuccess: false,
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );

        render(
            <Router history={history}>
                <OneTimeDepositModal />
            </Router>,
            {
                wrapper,
            }
        );
        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should close modal if user unable to deposit because they have deposited', () => {
        const history = createBrowserHistory();
        (useHasMFAccountDeposited as jest.Mock).mockReturnValueOnce({ has_mf_account_deposited: true });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );

        render(
            <Router history={history}>
                <OneTimeDepositModal />
            </Router>,
            {
                wrapper,
            }
        );
        expect(mock_store.ui.setShouldShowOneTimeDepositModal).toHaveBeenCalled();
        expect(mock_store.ui.toggleAccountSuccessModal).toHaveBeenCalled();
    });

    it('should close modal after cllicking ESC key', () => {
        const history = createBrowserHistory();
        (useHasMFAccountDeposited as jest.Mock).mockReturnValueOnce({ has_mf_account_deposited: false });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );
        render(
            <Router history={history}>
                <OneTimeDepositModal />
            </Router>,
            {
                wrapper,
            }
        );
        userEvent.keyboard('{esc}');
        expect(mock_store.ui.setShouldShowOneTimeDepositModal).toHaveBeenCalled();
        expect(mock_store.ui.toggleAccountSuccessModal).toHaveBeenCalled();
    });

    it('should open live chat widget on click', () => {
        const history = createBrowserHistory();
        (useHasMFAccountDeposited as jest.Mock).mockReturnValueOnce({ has_mf_account_deposited: false });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );
        render(
            <Router history={history}>
                <OneTimeDepositModal />
            </Router>,
            {
                wrapper,
            }
        );
        const live_chat = screen.getByTestId('dt_live_chat');
        expect(live_chat).toBeInTheDocument();
        userEvent.click(live_chat);
    });
});

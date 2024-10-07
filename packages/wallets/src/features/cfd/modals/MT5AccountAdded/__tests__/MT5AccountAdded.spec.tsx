import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import {
    APIProvider,
    useActiveWalletAccount,
    useJurisdictionStatus,
    useMT5AccountsList,
    usePOA,
    usePOI,
} from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../../../AuthProvider';
import { ModalProvider } from '../../../../../components/ModalProvider';
import { THooks } from '../../../../../types';
import MT5AccountAdded from '../MT5AccountAdded';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({
        isDesktop: true,
    })),
}));

const mockHide = jest.fn();
jest.mock('../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../components/ModalProvider'),
    useModal: () => ({
        getModalState: jest.fn(() => 'svg'),
        hide: mockHide,
        setModalOptions: jest.fn(),
        show: jest.fn(),
    }),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(() => ({
        data: {},
    })),
    useJurisdictionStatus: jest.fn(() => ({
        getVerificationStatus: jest.fn(() => ({
            is_failed: false,
            is_not_applicable: false,
            is_pending: false,
            is_verified: true,
        })),
        isSuccess: true,
    })),
    useMT5AccountsList: jest.fn(() => ({
        data: [{ display_balance: '10,000.00 USD', login: 'MD12345', market_type: 'financial' }],
    })),
    usePOA: jest.fn(() => ({ data: {} })),
    usePOI: jest.fn(() => ({
        data: {
            current: {
                service: 'onfido',
            },
            previous: {
                service: 'onfido',
            },
            status: 'verified',
        },
    })),
}));

describe('MT5AccountAdded', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    const history = createMemoryHistory();
    it('should render mt5 account added success modal for demo account', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                display_balance: '10000 USD',
                is_virtual: true,
                wallet_currentcy_type: 'Demo',
            },
        });
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <ModalProvider>
                        <MT5AccountAdded account={{ login: 'MD12345' }} marketType='financial' platform='mt5' />
                    </ModalProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('Your Financial demo account is ready')).toBeInTheDocument();
        expect(screen.getByText("Let's practise trading with 10,000.00 USD virtual funds.")).toBeInTheDocument();
        const okButton = screen.getAllByRole('button', { name: 'OK' })[0];
        expect(okButton).toBeInTheDocument();
        expect(okButton).toBeEnabled();
        okButton.click();
        expect(mockHide).toBeCalledTimes(1);
    });

    it('should render mt5 account added success modal for real account', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                display_balance: '10000 USD',
                is_virtual: false,
                wallet_currentcy_type: 'USD',
            },
        });
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <ModalProvider>
                        <MT5AccountAdded account={{ login: 'MD12345' }} marketType='financial' platform='mt5' />
                    </ModalProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('Your Financial (SVG) account is ready')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Transfer funds from your undefined Wallet to your Financial (SVG) account to start trading.'
            )
        ).toBeInTheDocument();
    });

    it('should redirect to transfer page when transfer funds button is clicked', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                display_balance: '10000 USD',
                is_virtual: false,
                wallet_currentcy_type: 'USD',
            },
        });
        const mockAddedAccount: THooks.CreateMT5Account = {
            account_type: 'financial',
            balance: 0,
            currency: 'USD',
            display_balance: '0.00 USD',
            login: 'MD12345',
        };
        render(
            <Router history={history}>
                <APIProvider>
                    <WalletsAuthProvider>
                        <ModalProvider>
                            <MT5AccountAdded account={mockAddedAccount} marketType='financial' platform='mt5' />
                        </ModalProvider>
                    </WalletsAuthProvider>
                </APIProvider>
            </Router>
        );
        const transferFundsButton = screen.getByRole('button', { name: 'Transfer funds' });
        expect(transferFundsButton).toBeInTheDocument();
        expect(transferFundsButton).toBeEnabled();
        transferFundsButton.click();
        expect(history.location.pathname).toEqual('/wallet/account-transfer');
    });

    it('should render the onfido verification pending message if document is not verified', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                display_balance: '10000 USD',
                is_virtual: false,
                wallet_currentcy_type: 'USD',
            },
        });
        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn(() => ({
                is_failed: false,
                is_not_applicable: false,
                is_pending: true,
                is_verified: false,
            })),
            isSuccess: true,
        });
        (usePOI as jest.Mock).mockReturnValue({
            data: {
                current: {
                    service: 'onfido',
                },
                previous: {
                    service: 'onfido',
                },
                status: 'pending',
            },
        });
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <ModalProvider>
                        <MT5AccountAdded account={{ login: 'MD12345' }} marketType='financial' platform='mt5' />
                    </ModalProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('Almost there')).toBeInTheDocument();
        expect(
            screen.getByText(
                "We need 1-3 days to review your documents before you can start trading with your Financial (SVG) account. You'll get an email as soon as this is done."
            )
        ).toBeInTheDocument();
    });

    it('should render idv verification pending message if document is not verified', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                display_balance: '10000 USD',
                is_virtual: false,
                wallet_currentcy_type: 'USD',
            },
        });
        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn(() => ({
                is_failed: false,
                is_not_applicable: false,
                is_pending: true,
                is_verified: false,
            })),
            isSuccess: true,
        });
        (usePOI as jest.Mock).mockReturnValue({
            data: {
                current: {
                    service: 'idv',
                },
                previous: {
                    service: 'idv',
                },
                status: 'pending',
            },
        });
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <ModalProvider>
                        <MT5AccountAdded account={{ login: 'MD12345' }} marketType='financial' platform='mt5' />
                    </ModalProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('Almost there')).toBeInTheDocument();
        expect(
            screen.getByText(
                "We need a few minutes to review your documents before you can start trading with your Financial (SVG) account. You'll get an in-app notification as soon as this is done."
            )
        ).toBeInTheDocument();
    });

    it('should render mt5 account added success screen for mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                display_balance: '10000 USD',
                is_virtual: false,
                wallet_currency_type: 'USD',
            },
            isLoading: false,
        });
        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn(() => ({
                is_failed: false,
                is_not_applicable: false,
                is_pending: false,
                is_verified: true,
            })),
            isSuccess: true,
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [{ display_balance: '10,000.00 USD', login: 'MD12345', market_type: 'financial' }],
            isLoading: false,
        });
        (usePOA as jest.Mock).mockReturnValue({ data: { status: 'verified' }, isLoading: false });
        (usePOI as jest.Mock).mockReturnValue({
            data: {
                current: { service: 'onfido' },
                previous: { service: 'onfido' },
                status: 'verified',
            },
            isLoading: false,
        });

        render(
            <Router history={history}>
                <APIProvider>
                    <WalletsAuthProvider>
                        <ModalProvider>
                            <MT5AccountAdded account={{ login: 'MD12345' }} marketType='financial' platform='mt5' />
                        </ModalProvider>
                    </WalletsAuthProvider>
                </APIProvider>
            </Router>
        );

        expect(screen.getByText('Your Financial (SVG) account is ready')).toBeInTheDocument();
        expect(
            screen.getByText('Transfer funds from your USD Wallet to your Financial (SVG) account to start trading.')
        ).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: 'OK' })[0]).toBeInTheDocument();
    });

    it('should render loading state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ isLoading: true });
        (useMT5AccountsList as jest.Mock).mockReturnValue({ isLoading: true });
        (usePOA as jest.Mock).mockReturnValue({ isLoading: true });
        (usePOI as jest.Mock).mockReturnValue({ isLoading: true });

        render(
            <Router history={history}>
                <APIProvider>
                    <WalletsAuthProvider>
                        <ModalProvider>
                            <MT5AccountAdded account={{ login: 'MD12345' }} marketType='financial' platform='mt5' />
                        </ModalProvider>
                    </WalletsAuthProvider>
                </APIProvider>
            </Router>
        );

        expect(screen.queryByText('Your Financial account is ready')).not.toBeInTheDocument();
    });

    it('should handle "Maybe later" button click', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                display_balance: '10000 USD',
                is_virtual: false,
                wallet_currency_type: 'USD',
            },
            isLoading: false,
        });
        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn(() => ({
                is_failed: false,
                is_not_applicable: false,
                is_pending: false,
                is_verified: true,
            })),
            isSuccess: true,
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [{ display_balance: '10,000.00 USD', login: 'MD12345', market_type: 'financial' }],
            isLoading: false,
        });
        (usePOA as jest.Mock).mockReturnValue({ data: { status: 'verified' }, isLoading: false });
        (usePOI as jest.Mock).mockReturnValue({
            data: {
                current: { service: 'onfido' },
                previous: { service: 'onfido' },
                status: 'verified',
            },
            isLoading: false,
        });

        render(
            <Router history={history}>
                <APIProvider>
                    <WalletsAuthProvider>
                        <ModalProvider>
                            <MT5AccountAdded account={{ login: 'MD12345' }} marketType='financial' platform='mt5' />
                        </ModalProvider>
                    </WalletsAuthProvider>
                </APIProvider>
            </Router>
        );

        const maybeLaterButton = screen.getAllByRole('button', { name: 'Maybe later' })[0];
        expect(maybeLaterButton).toBeInTheDocument();
        await userEvent.click(maybeLaterButton);
        expect(mockHide).toHaveBeenCalled();
    });
});

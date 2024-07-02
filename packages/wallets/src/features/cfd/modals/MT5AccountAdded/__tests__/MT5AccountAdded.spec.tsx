import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { APIProvider, useActiveWalletAccount, useJurisdictionStatus, usePOI } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../AuthProvider';
import { ModalProvider } from '../../../../../components/ModalProvider';
import { THooks } from '../../../../../types';
import MT5AccountAdded from '../MT5AccountAdded';

const mockHide = jest.fn();
jest.mock('../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../components/ModalProvider'),
    useModal: () => ({
        getModalState: jest.fn(() => 'svg'),
        hide: mockHide,
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
        const okButton = screen.getByRole('button', { name: 'OK' });
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
        expect(screen.getByText('Your Financial account is ready')).toBeInTheDocument();
        expect(
            screen.getByText('Transfer funds from your undefined Wallet to your Financial account to start trading.')
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
                'We need 1-3 days to review your documents before you can start trading with your Financial (SVG) account. You’ll get an email as soon as this is done.'
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
                'We need a few minutes to review your documents before you can start trading with your Financial (SVG) account. You’ll get an in-app notification as soon as this is done.'
            )
        ).toBeInTheDocument();
    });
});

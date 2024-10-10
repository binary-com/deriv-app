import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    useActiveWalletAccount,
    useAvailableCTraderAccounts,
    useCreateOtherCFDAccount,
    useCtraderAccountsList,
    useCtraderServiceToken,
    useDxtradeAccountsList,
} from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import { useModal } from '../../../../../components/ModalProvider';
import MT5TradeScreen from '../MT5TradeScreen';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
    useAvailableCTraderAccounts: jest.fn(),
    useCreateOtherCFDAccount: jest.fn(),
    useCtraderAccountsList: jest.fn(),
    useCtraderServiceToken: jest.fn(),
    useDxtradeAccountsList: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

jest.mock('../../../../../components/ModalProvider', () => ({
    useModal: jest.fn(),
}));

describe('MT5TradeScreen', () => {
    const mockHistoryPush = jest.fn();
    const mockHide = jest.fn();
    const mockShow = jest.fn();

    beforeEach(() => {
        (useHistory as jest.Mock).mockReturnValue({ push: mockHistoryPush });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn(state => {
                if (state === 'platform') return 'mt5';
                if (state === 'marketType') return 'synthetic';
                return null;
            }),
            hide: mockHide,
            show: mockShow,
        });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency_config: { display_code: 'USD', fractional_digits: 2 },
                is_virtual: false,
                loginid: 'CRW1234',
                wallet_currency_type: 'USD',
            },
        });
        (useDxtradeAccountsList as jest.Mock).mockReturnValue({
            data: [{ account_id: 'DX123', display_balance: '1000', login: 'DX123' }],
        });
        (useCtraderAccountsList as jest.Mock).mockReturnValue({
            data: [{ account_id: 'CT234', display_balance: '1000', login: 'CT234' }],
        });
        (useAvailableCTraderAccounts as jest.Mock).mockReturnValue({
            data: [{ account_id: 'CT234', display_balance: '1000', login: 'CT234' }],
        });
        (useCtraderServiceToken as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correct contents for mt5 platform', () => {
        render(
            <MT5TradeScreen
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                mt5Account={{ display_balance: '1000', landing_company_short: 'svg', loginid: 'CRW1234' }}
            />
        );

        expect(screen.getByText('Standard')).toBeInTheDocument();
        expect(screen.getByText('MetaTrader 5 web')).toBeInTheDocument();
        expect(screen.getByText('Open')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Server maintenance starts at 01:00 GMT every Sunday, and this process may take up to 2 hours to complete. Service may be disrupted during this time.'
            )
        ).toBeInTheDocument();
    });

    it('renders correct content for dxtrade platform', () => {
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn(state => {
                if (state === 'platform') return 'dxtrade';
                return null;
            }),
            hide: mockHide,
            show: mockShow,
        });

        render(<MT5TradeScreen />);

        expect(screen.getAllByText('DX123')[0]).toBeInTheDocument();
        expect(screen.getByText('Username')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Server maintenance starts at 06:00 GMT every Sunday and may last up to 2 hours. You may experience service disruption during this time.'
            )
        ).toBeInTheDocument();
    });

    it('renders correct content for ctrader platform', () => {
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn(state => {
                if (state === 'platform') return 'ctrader';
                return null;
            }),
            hide: mockHide,
            show: mockShow,
        });

        render(<MT5TradeScreen />);

        expect(
            screen.getByText('Use your Deriv account email and password to login into the cTrader platform.')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Server maintenance occurs every first Saturday of the month from 7 to 10 GMT time. You may experience service disruption during this time.'
            )
        ).toBeInTheDocument();
    });

    it('renders correctly for a demo account', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency_config: { display_code: 'USD', fractional_digits: 2 },
                is_virtual: true,
                loginid: 'VRW1234',
                wallet_currency_type: 'USD',
            },
        });

        render(
            <MT5TradeScreen
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                mt5Account={{
                    display_balance: '10000',
                    landing_company_short: 'svg',
                    loginid: 'VRW1234',
                    market_type: 'synthetic',
                }}
            />
        );

        expect(screen.getByText('Standard')).toBeInTheDocument();
        expect(screen.getByText('MetaTrader 5 web')).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
    });

    it('redirects to transfer page for current account on click of transfer button', () => {
        render(
            <MT5TradeScreen
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                mt5Account={{
                    display_balance: '1000',
                    landing_company_short: 'svg',
                    loginid: 'CRW1234',
                    market_type: 'synthetic',
                }}
            />
        );

        const transferButton = screen.getByText(/Transfer/);
        expect(transferButton).toBeInTheDocument();

        fireEvent.click(transferButton);
        expect(mockHide).toHaveBeenCalled();
        expect(mockHistoryPush).toHaveBeenCalledWith('/wallet/account-transfer', {
            toAccountLoginId: 'CRW1234',
        });
    });

    it('renders MT5MobileRedirectOption on mobile for MT5 platform', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });

        render(
            <MT5TradeScreen
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                mt5Account={{
                    display_balance: '1000',
                    landing_company_short: 'svg',
                    loginid: 'CRW1234',
                    market_type: 'synthetic',
                }}
            />
        );

        expect(screen.getByText('MetaTrader5 web terminal')).toBeInTheDocument();
        expect(screen.getAllByText('Trade with MT5 mobile app')[0]).toBeInTheDocument();
    });

    it('shows "Account closed" message for migrated account without position', () => {
        render(
            <MT5TradeScreen
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                mt5Account={{ display_balance: '1000', market_type: 'synthetic', status: 'migrated_without_position' }}
            />
        );

        expect(screen.queryByText(/1000/)).not.toBeInTheDocument();
        expect(screen.getByText('Account closed')).toBeInTheDocument();
    });

    it('shows "No new positions" message for migrated account with position', () => {
        render(
            <MT5TradeScreen
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                mt5Account={{ display_balance: '1000', market_type: 'synthetic', status: 'migrated_with_position' }}
            />
        );

        expect(screen.getByText('No new positions')).toBeInTheDocument();
    });

    it('handles other platforms', () => {
        (useModal as jest.Mock).mockReturnValue({
            getModalState: jest.fn(state => {
                if (state === 'platform') return 'mt5Investor';
                return null;
            }),
            hide: mockHide,
            show: mockShow,
        });

        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: undefined,
        });

        render(<MT5TradeScreen />);

        expect(screen.getByTestId('dt_mt5_trade_screen')).toBeInTheDocument();

        expect(screen.queryByText('MetaTrader 5 web')).not.toBeInTheDocument();
        expect(screen.queryByText('Deriv X')).not.toBeInTheDocument();
        expect(screen.queryByText('cTrader')).not.toBeInTheDocument();
    });
});

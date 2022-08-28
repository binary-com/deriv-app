import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import AccountTransferForm from '../account-transfer-form';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
}));

describe('<AccountTransferForm />', () => {
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.removeChild(modal_root_el);
    });
    const mockProps = () => ({
        accounts_list: [
            {
                currency: 'USD',
                is_mt: false,
                is_dxtrade: false,
                market_type: 'gaming',
                value: 'value',
            },
        ],
        account_limits: {
            daily_transfers: {
                dxtrade: {},
                internal: {},
                mt5: {},
            },
        },
        error: {
            code: 'testCode',
            message: 'testMessage',
        },
        minimum_fee: '0',
        mt5_login_list: [
            {
                login: 'value',
                market_type: 'gaming',
                server_info: {
                    geolocation: {
                        region: 'region',
                        sequence: 0,
                    },
                },
            },
        ],
        selected_from: { currency: 'USD', is_mt: false, is_crypto: false, is_dxtrade: false, balance: 0 },
        selected_to: { currency: 'USD', is_mt: false, is_crypto: false, is_dxtrade: false, balance: 0 },
        transfer_fee: 2,
        transfer_limit: {
            min: 0,
            max: 1000,
        },
        onMount: jest.fn(),
        resetConverter: jest.fn(),
        recentTransactionOnMount: jest.fn(),
        requestTransferBetweenAccounts: jest.fn(),
        setErrorMessage: jest.fn(),
        setAccountTransferAmount: jest.fn(),
    });

    it('component should be rendered', () => {
        const props = mockProps();

        render(<AccountTransferForm {...props} />);

        expect(screen.getByTestId('dt_account_transfer_form_wrapper')).toBeInTheDocument();
        expect(screen.getByText('Transfer between your accounts in Deriv')).toBeInTheDocument();
    });

    it('should show loader if account_list.length === 0', () => {
        const props = mockProps();
        props.accounts_list = [];

        render(<AccountTransferForm {...props} />);

        expect(screen.getByTestId('dt_cashier_loader_wrapper')).toBeInTheDocument();
    });

    it('should show <Form /> component if account_list.length > 0', () => {
        const props = mockProps();

        render(<AccountTransferForm {...props} />);

        expect(screen.getByText('From')).toBeInTheDocument();
        expect(screen.getByText('To')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_transfer_form_drop_down_wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_transfer_form_drop_down')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_transfer_form_to_dropdown')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_transfer_form_submit')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Transfer' })).toBeInTheDocument();
    });

    it('should show an error if amount is not provided', async () => {
        const props = mockProps();
        props.setErrorMessage = jest.fn();
        props.setAccountTransferAmount = jest.fn();

        render(<AccountTransferForm {...props} />);

        const submit_button = screen.getByRole('button', { name: 'Transfer' });
        fireEvent.change(screen.getByTestId('dt_account_transfer_form_input'), { target: { value: '1' } });
        fireEvent.change(screen.getByTestId('dt_account_transfer_form_input'), { target: { value: '' } });
        fireEvent.click(submit_button);

        expect(await screen.findByText('This field is required.')).toBeInTheDocument();
    });

    it('should show an error if transfer amount is greater than balance', async () => {
        const props = mockProps();
        props.setAccountTransferAmount = jest.fn();
        props.setErrorMessage = jest.fn();
        props.requestTransferBetweenAccounts = jest.fn();
        props.setAccountTransferAmount = jest.fn();
        props.selected_from.balance = 100;

        render(<AccountTransferForm {...props} />);

        const submit_button = screen.getByRole('button', { name: 'Transfer' });
        fireEvent.change(screen.getByTestId('dt_account_transfer_form_input'), { target: { value: '200' } });
        fireEvent.click(submit_button);

        expect(await screen.findByText('Insufficient balance')).toBeInTheDocument();
    });

    it('should not allow to do transfer if accounts from and to are same', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const props = mockProps();
        props.accounts_list[0].is_mt = true;
        props.selected_from.is_mt = true;
        props.selected_from.balance = 200;
        props.setAccountTransferAmount = jest.fn();
        props.setErrorMessage = jest.fn();

        render(<AccountTransferForm {...props} />);

        fireEvent.change(screen.getByTestId('dt_account_transfer_form_input'), { target: { value: '100' } });
        fireEvent.click(screen.getByRole('button', { name: 'Transfer' }));

        expect(props.requestTransferBetweenAccounts).not.toHaveBeenCalled();
    });

    it('should show input if same currency', () => {
        const props = mockProps();

        render(<AccountTransferForm {...props} />);

        expect(screen.getByTestId('dt_account_transfer_form_input')).toBeInTheDocument();
    });

    it("should show 'Please verify your identity' error if error.code is Fiat2CryptoTransferOverLimit", () => {
        const props = mockProps();
        props.error = {
            code: 'Fiat2CryptoTransferOverLimit',
            message: 'testMessage',
        };

        render(<AccountTransferForm {...props} />);

        expect(screen.getByText('Please verify your identity')).toBeInTheDocument();
    });

    it("should show 'Cashier error' error if error.code is unexpected", () => {
        const props = mockProps();
        props.error = {
            code: 'testCode',
            message: 'testMessage',
        };

        render(<AccountTransferForm {...props} />);

        expect(screen.getByText('Cashier Error')).toBeInTheDocument();
    });

    it('should show <AccountTransferNote /> component', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const props = mockProps();

        render(<AccountTransferForm {...props} />);

        expect(screen.getByText('Transfer limits may vary depending on the exchange rates.')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Transfers may be unavailable due to high volatility or technical issues and when the exchange markets are closed.'
            )
        ).toBeInTheDocument();
    });

    it('should show proper hint about mt5 remained transfers', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const props = mockProps();
        props.account_limits = {
            daily_transfers: {
                dxtrade: {},
                internal: {},
                mt5: {
                    available: 1,
                },
            },
        };
        props.selected_from.is_mt = true;
        props.selected_to.is_mt = true;

        render(<AccountTransferForm {...props} />);

        expect(screen.getByText('You have 1 transfer remaining for today.')).toBeInTheDocument();
    });

    it('should show proper hint about dxtrade remained transfers', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const props = mockProps();
        props.account_limits = {
            daily_transfers: {
                dxtrade: {
                    available: 1,
                },
                internal: {},
                mt5: {},
            },
        };
        props.selected_from.is_dxtrade = true;
        props.selected_from.currency = 'USD';
        props.selected_to.is_dxtrade = true;
        props.selected_to.currency = 'USD';

        render(<AccountTransferForm {...props} />);

        expect(screen.getByText('You have 1 transfer remaining for today.')).toBeInTheDocument();
    });

    it('should show proper hint about internal remained transfers', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const props = mockProps();
        props.account_limits = {
            daily_transfers: {
                dxtrade: {},
                internal: {
                    available: 1,
                },
                mt5: {},
            },
        };

        render(<AccountTransferForm {...props} />);

        expect(screen.getByText('You have 1 transfer remaining for today.')).toBeInTheDocument();
    });

    it('should show proper note if transfer fee is 2% and is_crypto_to_crypto_transfer', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const props = mockProps();
        props.selected_from.is_crypto = true;
        props.selected_from.currency = 'BTC';
        props.selected_to.is_crypto = true;
        props.selected_to.currency = 'BTC';
        props.transfer_fee = 2;

        render(<AccountTransferForm {...props} />);

        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 0 BTC, whichever is higher, for transfers between your Deriv cryptocurrency accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });

    it('should show proper note if transfer fee is 2%, is_mt_transfer, and is_dxtrade_allowed is false', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const props = mockProps();
        props.selected_from.is_mt = true;
        props.selected_to.is_mt = true;
        props.transfer_fee = 2;

        render(<AccountTransferForm {...props} is_dxtrade_allowed={false} />);

        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 0 USD, whichever is higher, for transfers between your Deriv cryptocurrency and DMT5 accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });

    it('should show proper note if transfer fee is 2% and is_mt_transfer is false', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const props = mockProps();
        props.transfer_fee = 2;

        render(<AccountTransferForm {...props} />);

        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 0 USD, whichever is higher, for transfers between your Deriv fiat and Deriv cryptocurrency accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });

    it('should show proper note if transfer fee is null', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const props = mockProps();
        props.transfer_fee = null;

        render(<AccountTransferForm {...props} />);

        expect(screen.getByText('Please bear in mind that some transfers may not be possible.')).toBeInTheDocument();
    });
});

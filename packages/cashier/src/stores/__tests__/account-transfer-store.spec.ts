import { configure } from 'mobx';

import { CFD_PLATFORMS, getCurrencies, validNumber } from '@deriv/shared';
import { mockStore } from '@deriv/stores';

import type { TRootStore, TTransferAccount, TWebSocket } from '../../types';
import AccountTransferStore from '../account-transfer-store';

configure({ safeDescriptors: false });

let accounts: TTransferAccount[],
    account_transfer_store: AccountTransferStore,
    root_store: TRootStore,
    WS: DeepPartial<TWebSocket>;

const CR_eUSDT_account: TTransferAccount = {
    account_type: 'trading',
    balance: '1.00000000',
    currency: 'eUSDT',
    demo_account: 0,
    loginid: 'CR90000113',
};

const CR_USD_account: TTransferAccount = {
    account_type: 'trading',
    balance: '10.00',
    currency: 'USD',
    demo_account: 0,
    loginid: 'CR90000103',
};
const MT_USD_account: TTransferAccount = {
    account_type: 'mt5',
    balance: '10.00',
    currency: 'USD',
    demo_account: 0,
    loginid: 'MT0000000',
};

const MX_USD_account: TTransferAccount = {
    account_type: 'trading',
    balance: '10.00',
    currency: 'USD',
    demo_account: 0,
    loginid: 'MX0000000',
};

const DXR_USD_account: TTransferAccount = {
    account_type: 'dxtrade',
    balance: '10.00',
    currency: 'USD',
    loginid: 'DXR1008',
    market_type: 'financial',
};

beforeEach(() => {
    accounts = [
        CR_USD_account,
        CR_eUSDT_account,
        { ...MT_USD_account, loginid: 'MTR111176' },
        { ...MT_USD_account, loginid: 'MTR111177' },
        { ...MT_USD_account, loginid: 'MTR40000265' },
        { ...DXR_USD_account, loginid: 'DXR1002' },
        { ...DXR_USD_account, loginid: 'DXR1003' },
    ];
    WS = {
        authorized: {
            transferBetweenAccounts: jest.fn().mockResolvedValue({ accounts }),
            getAccountStatus: jest.fn().mockResolvedValue({ get_account_status: 1 }),
        },
        storage: {
            mt5LoginList: jest.fn().mockResolvedValue({
                mt5_login_list: [
                    {
                        ...MT_USD_account,
                        loginid: 'MTR111176',
                        login: 'MTR111176',
                        market_type: 'financial',
                        sub_account_type: 'financial',
                    },
                    {
                        ...MT_USD_account,
                        loginid: 'MTR111177',
                        login: 'MTR111177',
                        market_type: 'financial',
                        sub_account_type: 'financial',
                    },
                    {
                        ...MT_USD_account,
                        loginid: 'MTR40000265',
                        login: 'MTR40000265',
                        market_type: 'synthetic',
                        sub_account_type: 'financial',
                    },
                ],
            }),
        },
        balanceAll: jest.fn().mockResolvedValue({ balance_response: { balance: '20' } }),
        mt5LoginList: jest.fn().mockResolvedValue({}),
        tradingPlatformAccountsList: jest.fn().mockResolvedValue({
            trading_platform_accounts: [
                {
                    account_id: 'DXR1002',
                    account_type: 'real',
                    balance: 0,
                    currency: 'USD',
                    login: '52',
                    market_type: 'synthetic',
                    platform: 'dxtrade',
                },
                {
                    account_id: 'DXR1003',
                    account_type: 'real',
                    balance: 0,
                    currency: 'USD',
                    login: '52',
                    market_type: 'financial',
                    platform: 'dxtrade',
                },
            ],
        }),
        wait: jest.fn(),
    };
    root_store = mockStore({
        client: {
            account_status: {
                status: ['status'],
            },
            active_accounts: [{ is_virtual: 0, balance: 10 }],
            has_maltainvest_account: true,
            is_financial_account: true,
            is_financial_information_incomplete: true,
            is_logged_in: true,
            is_trading_experience_incomplete: true,
            landing_company_shortcode: 'maltainvest',
            loginid: 'CR90000103',
            residence: 'pl',
            responseMt5LoginList: jest.fn(),
            responseTradingPlatformAccountsList: jest.fn(),
            setAccountStatus: jest.fn(),
            setBalanceOtherAccounts: jest.fn(),
        },
        common: {
            is_from_derivgo: false,
        },
        modules: {
            cashier: {
                general_store: {
                    percentageSelectorSelectionStatus: jest.fn(),
                    setLoading: jest.fn(),
                    setOnRemount: jest.fn(),
                    onMountCommon: jest.fn(),
                },
                crypto_fiat_converter: {
                    converter_from_amount: '10',
                    converter_to_amount: '10',
                    onChangeConverterFromAmount: jest.fn(),
                    resetConverter: jest.fn(),
                    setConverterFromAmount: jest.fn(),
                    setConverterFromError: jest.fn(),
                    setConverterToError: jest.fn(),
                    setIsTimerVisible: jest.fn(),
                },
            },
        },
        traders_hub: {
            selected_account: {
                account_id: '',
            },
            combined_cfd_mt5_accounts: [],
        },
    }) as TRootStore;
    account_transfer_store = new AccountTransferStore(WS as TWebSocket, root_store);
});

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getCurrencies: jest.fn(),
    getCFDAccountDisplay: jest.fn(),
    validNumber: jest.fn(() => ({ is_ok: true })),
}));

describe('AccountTransferStore', () => {
    it('should not lock the transfer if there is no any account statuses', () => {
        account_transfer_store.root_store.client.account_status.status = [];

        expect(account_transfer_store.is_transfer_locked).toBeFalsy();
    });

    it('should not lock the transfer if it is not a financial account', () => {
        account_transfer_store.root_store.client.is_financial_account = false;

        expect(account_transfer_store.is_transfer_locked).toBeFalsy();
    });

    it('should not lock the transfer if is_financial_information_incomplete and is_trading_experience_incomplete is equal to false', () => {
        account_transfer_store.error.is_ask_financial_risk_approval = false;
        account_transfer_store.root_store.client.is_financial_information_incomplete = false;
        account_transfer_store.root_store.client.is_trading_experience_incomplete = false;

        expect(account_transfer_store.is_transfer_locked).toBeFalsy();
    });

    it('should lock the transfer if the financial assessment is needed and error.is_ask_financial_risk_approval is equal to true', () => {
        account_transfer_store.error.is_ask_financial_risk_approval = true;

        expect(account_transfer_store.is_transfer_locked).toBeTruthy();
    });

    it('should set the balance by loginid', () => {
        account_transfer_store.setAccounts([{ ...CR_USD_account, value: 'CR90000103' }]);
        account_transfer_store.setBalanceByLoginId('CR90000103', 100);

        expect(account_transfer_store.accounts_list[0].balance).toBe(100);
    });

    it('should set "selected from" balance', () => {
        account_transfer_store.setBalanceSelectedFrom(101);

        expect(account_transfer_store.selected_from.balance).toBe(101);
    });

    it('should set "selected to" balance', () => {
        account_transfer_store.setBalanceSelectedTo(102);

        expect(account_transfer_store.selected_to.balance).toBe(102);
    });

    it('should show loader during fetching the data when calling onMountAccountTransfer method', async () => {
        await account_transfer_store.onMountAccountTransfer();

        expect(
            (account_transfer_store.root_store.modules.cashier.general_store.setLoading as jest.Mock).mock.calls
        ).toEqual([[true], [false]]);
    });

    it('should set has_no_accounts_balance to false, if some balance update has come in since the last mount when calling onMountAccountTransfer method', async () => {
        const spySetHasNoAccountsBalance = jest.spyOn(account_transfer_store, 'setHasNoAccountsBalance');
        account_transfer_store.setHasNoAccountsBalance(true);
        await account_transfer_store.onMountAccountTransfer();

        expect(spySetHasNoAccountsBalance).toHaveBeenCalledWith(false);
    });

    it('should set an error message if there is an error field in transfer_between_accounts response when calling onMountAccountTransfer method', async () => {
        const spySortAccountsTransfer = jest.spyOn(account_transfer_store, 'sortAccountsTransfer');
        const spySetErrorMessage = jest.spyOn(account_transfer_store.error, 'setErrorMessage');
        (account_transfer_store.WS.authorized.transferBetweenAccounts as jest.Mock).mockResolvedValueOnce({
            error: 'Transfer error',
        });
        await account_transfer_store.onMountAccountTransfer();

        expect(spySetErrorMessage).toHaveBeenCalledWith(
            'Transfer error',
            account_transfer_store.onMountAccountTransfer
        );
        expect(account_transfer_store.root_store.modules.cashier.general_store.setLoading).toHaveBeenCalledWith(false);
        expect(spySortAccountsTransfer).not.toHaveBeenCalled();
    });

    it('should not call sortAccountsTransfer method if the client can not do account transfer when calling onMountAccountTransfer method', async () => {
        const spySortAccountsTransfer = jest.spyOn(account_transfer_store, 'sortAccountsTransfer');
        (account_transfer_store.WS.authorized.transferBetweenAccounts as jest.Mock).mockResolvedValueOnce({
            accounts: [CR_USD_account],
        });
        await account_transfer_store.onMountAccountTransfer();

        expect(spySortAccountsTransfer).not.toHaveBeenCalled();
    });

    it('should set selected_to loginid as a default, if cfd_transfer_to_login_id property exists in session storage when calling onMountAccountTransfer method', async () => {
        window.sessionStorage.setItem('cfd_transfer_to_login_id', 'CR90000103');
        await account_transfer_store.onMountAccountTransfer();

        expect(account_transfer_store.selected_to.value).toBe('CR90000103');
        window.sessionStorage.clear();
    });

    it('should set an error if selected_to loginid in cfd_transfer_to_login_id property in session storage is not allowed for transfer when calling onMountAccountTransfer method', async () => {
        window.sessionStorage.setItem('cfd_transfer_to_login_id', 'MX0000000');
        (account_transfer_store.WS.authorized.transferBetweenAccounts as jest.Mock).mockResolvedValueOnce({
            accounts: [CR_USD_account, MX_USD_account],
        });
        await account_transfer_store.onMountAccountTransfer();

        expect(account_transfer_store.selected_to.error).not.toBe(undefined);
        window.sessionStorage.clear();
    });

    it('should call proper methods when calling onMountAccountTransfer method', async () => {
        const spySortAccountsTransfer = jest.spyOn(account_transfer_store, 'sortAccountsTransfer');
        const spySetTransferFee = jest.spyOn(account_transfer_store, 'setTransferFee');
        const spySetMinimumFee = jest.spyOn(account_transfer_store, 'setMinimumFee');
        const spySetTransferLimit = jest.spyOn(account_transfer_store, 'setTransferLimit');
        await account_transfer_store.onMountAccountTransfer();

        expect(account_transfer_store.root_store.modules.cashier.general_store.setOnRemount).toHaveBeenCalledWith(
            account_transfer_store.onMountAccountTransfer
        );
        expect(account_transfer_store.root_store.modules.cashier.general_store.onMountCommon).toHaveBeenCalledTimes(1);
        // eslint-disable-next-line testing-library/await-async-utils
        expect(account_transfer_store.WS.wait).toHaveBeenCalledWith('website_status');
        expect(spySortAccountsTransfer).toHaveBeenCalledTimes(1);
        expect(spySetTransferFee).toHaveBeenCalledTimes(1);
        expect(spySetMinimumFee).toHaveBeenCalledTimes(1);
        expect(spySetTransferLimit).toHaveBeenCalledTimes(1);
    });

    it('the client cannot make a transfer if he does not have any account with balance greater then 0 ', () => {
        const spySetHasNoAccountsBalance = jest.spyOn(account_transfer_store, 'setHasNoAccountsBalance');
        expect(account_transfer_store.canDoAccountTransfer([{ ...CR_USD_account, balance: '0' }])).toBeFalsy();
        expect(spySetHasNoAccountsBalance).toHaveBeenCalledWith(true);
    });

    it('the client cannot make a transfer if he does not have at least two real-money accounts', () => {
        expect(account_transfer_store.canDoAccountTransfer([{ ...CR_USD_account, balance: '10000.00' }])).toBeFalsy();
    });

    it('the client must be able to make a transfer', () => {
        expect(account_transfer_store.canDoAccountTransfer([CR_USD_account, CR_eUSDT_account])).toBeTruthy();
    });

    it('should change value of the variable has_no_accounts_balance', () => {
        account_transfer_store.setHasNoAccountsBalance(true);

        expect(account_transfer_store.has_no_accounts_balance).toBeTruthy();
    });

    it('should change value of the variable has_no_account', () => {
        account_transfer_store.setHasNoAccount(true);

        expect(account_transfer_store.has_no_account).toBeTruthy();
    });

    it('should set transfer fee equal to 2', () => {
        (getCurrencies as jest.Mock).mockReturnValueOnce({ USD: { transfer_between_accounts: { fees: { BTC: 2 } } } });
        account_transfer_store.setSelectedFrom({ currency: 'USD' });
        account_transfer_store.setSelectedTo({ currency: 'BTC' });
        account_transfer_store.setTransferFee();

        expect(account_transfer_store.transfer_fee).toBe(2);
    });

    it('should set transfer fee equal to 0 if transfer fee is undefined', () => {
        (getCurrencies as jest.Mock).mockReturnValueOnce({
            USD: { transfer_between_accounts: { fees: { BTC: undefined } } },
        });
        account_transfer_store.setSelectedFrom({ currency: 'USD' });
        account_transfer_store.setSelectedTo({ currency: 'BTC' });
        account_transfer_store.setTransferFee();

        expect(account_transfer_store.transfer_fee).toBe(0);
    });

    it('should set minimum fee as 0.01 for USD', () => {
        account_transfer_store.setSelectedFrom({ currency: 'USD' });
        account_transfer_store.setMinimumFee();

        expect(account_transfer_store.minimum_fee).toBe('0.01');
    });

    it('should set minimum fee as 0.00000001 for BTC', () => {
        account_transfer_store.setSelectedFrom({ currency: 'BTC' });
        account_transfer_store.setMinimumFee();

        expect(account_transfer_store.minimum_fee).toBe('0.00000001');
    });

    it('should set proper transfer limit for mt5 transfer', () => {
        (getCurrencies as jest.Mock).mockReturnValueOnce({
            USD: { transfer_between_accounts: { limits_mt5: { min: 1, max: 10 } } },
        });

        account_transfer_store.setSelectedFrom({ balance: 500, currency: 'USD', is_mt: true });
        account_transfer_store.setTransferLimit();

        expect(account_transfer_store.transfer_limit).toEqual({ min: '1.00', max: '10.00' });
    });

    it('should set proper transfer limit for dxtrade transfer', () => {
        (getCurrencies as jest.Mock).mockReturnValueOnce({
            USD: { transfer_between_accounts: { limits_dxtrade: { min: 10, max: 100 } } },
        });

        account_transfer_store.setSelectedFrom({ balance: 500, currency: 'USD', is_dxtrade: true });
        account_transfer_store.setTransferLimit();

        expect(account_transfer_store.transfer_limit).toEqual({ min: '10.00', max: '100.00' });
    });

    it('should set proper transfer limit for other types of transfers', () => {
        (getCurrencies as jest.Mock).mockReturnValueOnce({
            USD: { transfer_between_accounts: { balance: 500, limits: { min: 100, max: 1000 } } },
        });

        account_transfer_store.setSelectedFrom({ currency: 'USD', is_dxtrade: false, is_mt: false });
        account_transfer_store.setTransferLimit();

        expect(account_transfer_store.transfer_limit).toEqual({ min: '100.00', max: '1000.00' });
    });

    it('should set max transfer limit equal to the current "selected from" balance, if there is no max transfer fee in response', () => {
        (getCurrencies as jest.Mock).mockReturnValueOnce({
            USD: { transfer_between_accounts: { balance: 500, limits: { min: 100 } } },
        });

        account_transfer_store.setSelectedFrom({ balance: 500, currency: 'USD', is_dxtrade: false, is_mt: false });
        account_transfer_store.setTransferLimit();

        expect(account_transfer_store.transfer_limit).toEqual({ min: '100.00', max: 500 });
    });

    it('should set min transfer limit equal to null, if there is no min transfer fee in response', () => {
        (getCurrencies as jest.Mock).mockReturnValueOnce({
            USD: { transfer_between_accounts: { balance: 500, limits: { max: 1000 } } },
        });

        account_transfer_store.setSelectedFrom({ balance: 1500, currency: 'USD', is_dxtrade: false, is_mt: false });
        account_transfer_store.setTransferLimit();

        expect(account_transfer_store.transfer_limit).toEqual({ min: '', max: '1000.00' });
    });

    it('should not sort and set accounts if there is an error in transfer_between_accounts response when calling sortAccountsTransfer method', async () => {
        const spySetAccounts = jest.spyOn(account_transfer_store, 'setAccounts');
        (account_transfer_store.WS.authorized.transferBetweenAccounts as jest.Mock).mockResolvedValueOnce({
            error: 'Transfer error',
        });
        await account_transfer_store.sortAccountsTransfer();

        expect(spySetAccounts).not.toHaveBeenCalled();
    });

    it('should sort and set accounts when calling sortAccountsTransfer method', async () => {
        await account_transfer_store.sortAccountsTransfer({
            accounts: accounts?.concat([MT_USD_account, DXR_USD_account]),
        });

        expect(account_transfer_store.accounts_list[0].text).toMatch(/^Deriv X(.)*$/);
        expect(account_transfer_store.accounts_list[1].text).toMatch(/^Deriv X(.)*$/);
        expect(account_transfer_store.accounts_list[2].text).toMatch(/^Deriv X(.)*$/);
        expect(account_transfer_store.accounts_list[7].text).toBe('USD');
        expect(account_transfer_store.accounts_list[8].text).toBe('eUSDT');
        expect(account_transfer_store.accounts_list).toHaveLength(9);
    });

    it('should sort and set accounts when calling sortAccountsTransfer method when from derivgo', async () => {
        await account_transfer_store.sortAccountsTransfer(
            {
                accounts: [...accounts, MT_USD_account, DXR_USD_account],
            },
            true
        );

        expect(account_transfer_store.accounts_list[0].text).toMatch(/^Deriv X(.)*$/);
        expect(account_transfer_store.accounts_list[1].text).toMatch(/^Deriv X(.)*$/);
        expect(account_transfer_store.accounts_list[2].text).toMatch(/^Deriv X(.)*$/);
        expect(account_transfer_store.accounts_list[7].text).toBe('USD');
        expect(account_transfer_store.accounts_list[8].text).toBe('eUSDT');
        expect(account_transfer_store.accounts_list).toHaveLength(9);
    });

    it('should set current logged in client as the default transfer from account when calling sortAccountsTransfer method', async () => {
        await account_transfer_store.sortAccountsTransfer({ accounts });

        expect(account_transfer_store.selected_from.value).toBe(account_transfer_store.root_store.client.loginid);
    });

    it('should set an error if client account and selected_from account has not allowed loginid for transfer when calling sortAccountsTransfer method', async () => {
        account_transfer_store.root_store.client.loginid = 'MX0000000';
        await account_transfer_store.sortAccountsTransfer({
            accounts: [MX_USD_account],
        });

        expect(account_transfer_store.selected_from.error).not.toBe(undefined);
    });

    it('should set an error if selected_to account has not allowed loginid for transfer when calling sortAccountsTransfer method', async () => {
        await account_transfer_store.sortAccountsTransfer({
            accounts: [MX_USD_account],
        });

        expect(account_transfer_store.selected_to.error).not.toBe(undefined);
    });

    it('should set proper values for selected_from property', () => {
        account_transfer_store.setSelectedFrom({ balance: 0 });

        expect(account_transfer_store.selected_from).toEqual({ balance: 0 });
    });

    it('should set proper values for selected_to property', () => {
        account_transfer_store.setSelectedFrom({ balance: 10 });

        expect(account_transfer_store.selected_from).toEqual({ balance: 10 });
    });

    it('should set accounts', () => {
        account_transfer_store.setAccounts([
            { account_type: 'trading', balance: '10000.00', currency: 'USD', demo_account: 0, loginid: 'MX0000000' },
        ]);

        expect(account_transfer_store.accounts_list).toEqual([
            { account_type: 'trading', balance: '10000.00', currency: 'USD', demo_account: 0, loginid: 'MX0000000' },
        ]);
    });

    it('should change value of the variable is_transfer_confirm', () => {
        account_transfer_store.setIsTransferConfirm(true);

        expect(account_transfer_store.is_transfer_confirm).toBeTruthy();
    });

    it('should set account transfer amount', () => {
        account_transfer_store.setAccountTransferAmount('100');

        expect(account_transfer_store.account_transfer_amount).toBe('100');
    });

    it('should change value of the variable is_transfer_successful', () => {
        account_transfer_store.setIsTransferSuccessful(true);

        expect(account_transfer_store.is_transfer_successful).toBeTruthy();
    });

    it('should change value of the variable is_mt5_transfer_in_progress', () => {
        account_transfer_store.setIsMT5TransferInProgress(true);

        expect(account_transfer_store.is_mt5_transfer_in_progress).toBeTruthy();
    });

    it('should set transferred amount in receipt', () => {
        account_transfer_store.setReceiptTransfer({ amount: '1000' });

        expect(account_transfer_store.receipt.amount_transferred).toBe('1000');
    });

    it('should switch the value of selected_from and selected_to, if new value of selected_from is the same as the current selected_to', async () => {
        const spyOnChangeTransferTo = jest.spyOn(account_transfer_store, 'onChangeTransferTo');
        await account_transfer_store.sortAccountsTransfer({ accounts });
        account_transfer_store.setSelectedTo({ value: 'CR90000103' });
        account_transfer_store.onChangeTransferFrom({ target: { value: 'CR90000103' } });

        expect(spyOnChangeTransferTo).toHaveBeenCalledWith({ target: { value: 'CR90000103' } });
    });

    it('should not allowed transfer between mt5 accounts and select first non cfd account', async () => {
        const spyOnChangeTransferTo = jest.spyOn(account_transfer_store, 'onChangeTransferTo');
        await account_transfer_store.sortAccountsTransfer({ accounts });
        account_transfer_store.setSelectedTo({ value: 'MTR40000265', is_mt: true });
        account_transfer_store.onChangeTransferFrom({ target: { value: 'MTR111176' } });

        expect(spyOnChangeTransferTo).toHaveBeenCalledWith({ target: { value: 'CR90000103' } });
    });

    it('should not allowed transfer between Dxtrade accounts and select first non cfd account', async () => {
        const spyOnChangeTransferTo = jest.spyOn(account_transfer_store, 'onChangeTransferTo');
        await account_transfer_store.sortAccountsTransfer({ accounts });
        account_transfer_store.setSelectedTo({ value: 'DXR1003', is_dxtrade: true });
        account_transfer_store.onChangeTransferFrom({ target: { value: 'DXR1002' } });

        expect(spyOnChangeTransferTo).toHaveBeenCalledWith({ target: { value: 'CR90000103' } });
    });

    it('should not allowed transfer between MT and Dxtrade accounts and select first non cfd account', async () => {
        const spyOnChangeTransferTo = jest.spyOn(account_transfer_store, 'onChangeTransferTo');
        await account_transfer_store.sortAccountsTransfer({ accounts });
        account_transfer_store.setSelectedTo({ value: 'DXR1003', is_dxtrade: true });
        account_transfer_store.onChangeTransferFrom({ target: { value: 'MTR111176' } });

        expect(spyOnChangeTransferTo).toHaveBeenCalledWith({ target: { value: 'CR90000103' } });
    });

    it('should not allowed transfer between Dxtrade and MT accounts and select first non cfd account', async () => {
        const spyOnChangeTransferTo = jest.spyOn(account_transfer_store, 'onChangeTransferTo');
        await account_transfer_store.sortAccountsTransfer({ accounts });
        account_transfer_store.setSelectedTo({ value: 'MTR111176', is_mt: true });
        account_transfer_store.onChangeTransferFrom({ target: { value: 'DXR1002' } });

        expect(spyOnChangeTransferTo).toHaveBeenCalledWith({ target: { value: 'CR90000103' } });
    });

    it('should set an error if target.value loginid is not allowed to transfer when calling onChangeTransferFrom method', async () => {
        await account_transfer_store.sortAccountsTransfer({
            accounts: [CR_USD_account, MX_USD_account],
        });
        account_transfer_store.setSelectedTo({ value: 'CR90000103' });
        account_transfer_store.onChangeTransferFrom({ target: { value: 'MX0000000' } });

        expect(account_transfer_store.selected_from.error).not.toBe(undefined);
    });

    it('should set transfer fee, minimum fee and transfer limit when calling onChangeTransferFrom method', async () => {
        const spySetTransferFee = jest.spyOn(account_transfer_store, 'setTransferFee');
        const spySetMinimumFee = jest.spyOn(account_transfer_store, 'setMinimumFee');
        const spySetTransferLimit = jest.spyOn(account_transfer_store, 'setTransferLimit');

        await account_transfer_store.sortAccountsTransfer({ accounts });
        account_transfer_store.setSelectedTo({ value: 'CR90000113' });
        account_transfer_store.onChangeTransferFrom({ target: { value: 'CR90000103' } });

        expect(spySetTransferFee).toHaveBeenCalledTimes(1);
        expect(spySetMinimumFee).toHaveBeenCalledTimes(1);
        expect(spySetTransferLimit).toHaveBeenCalledTimes(1);
    });

    it('should set an error if target.value loginid is not allowed to transfer when calling onChangeTransferTo method', async () => {
        await account_transfer_store.sortAccountsTransfer({
            accounts: [CR_USD_account, MX_USD_account],
        });
        account_transfer_store.onChangeTransferTo({ target: { value: 'MX0000000' } });

        expect(account_transfer_store.selected_to.error).not.toBe(undefined);
    });

    it('should set transfer fee, minimum fee and transfer limit when calling onChangeTransferTo method', async () => {
        const spySetTransferFee = jest.spyOn(account_transfer_store, 'setTransferFee');
        const spySetMinimumFee = jest.spyOn(account_transfer_store, 'setMinimumFee');
        const spySetTransferLimit = jest.spyOn(account_transfer_store, 'setTransferLimit');

        await account_transfer_store.sortAccountsTransfer({ accounts });
        account_transfer_store.onChangeTransferTo({ target: { value: 'CR90000103' } });

        expect(spySetTransferFee).toHaveBeenCalledTimes(1);
        expect(spySetMinimumFee).toHaveBeenCalledTimes(1);
        expect(spySetTransferLimit).toHaveBeenCalledTimes(1);
    });

    it('should return null if the client is not logged in when calling requestTransferBetweenAccounts method', async () => {
        account_transfer_store.root_store.client.is_logged_in = false;
        await account_transfer_store.sortAccountsTransfer({ accounts });

        expect(await account_transfer_store.requestTransferBetweenAccounts({ amount: 1000 })).toBeNull();
    });

    it('should call setIsMT5TransferInProgress if there is mt5 transfer when calling requestTransferBetweenAccounts method', async () => {
        const spySetIsMT5TransferInProgress = jest.spyOn(account_transfer_store, 'setIsMT5TransferInProgress');
        (account_transfer_store.WS.authorized.transferBetweenAccounts as jest.Mock).mockResolvedValueOnce({
            accounts: [CR_USD_account, { ...MT_USD_account, loginid: 'MTR111176' }],
        });
        await account_transfer_store.sortAccountsTransfer({ accounts });
        account_transfer_store.setSelectedTo({ value: 'MTR111176', is_mt: true });
        await account_transfer_store.requestTransferBetweenAccounts({ amount: 1000 });

        expect(spySetIsMT5TransferInProgress.mock.calls).toEqual([[true], [false]]);
    });

    it('should set error message if there is an error in transferBetweenAccounts response when calling requestTransferBetweenAccounts method', async () => {
        (account_transfer_store.WS.authorized.transferBetweenAccounts as jest.Mock).mockResolvedValueOnce({
            error: { message: 'Transfer error' },
        });
        await account_transfer_store.sortAccountsTransfer({ accounts });
        await account_transfer_store.requestTransferBetweenAccounts({ amount: 1000 });

        expect(account_transfer_store.error.message).toBe('Transfer error');
    });

    it('should set account status if there is an error code "Fiat2CryptoTransferOverLimit" in transferBetweenAccounts response when calling requestTransferBetweenAccounts method', async () => {
        (account_transfer_store.WS.authorized.transferBetweenAccounts as jest.Mock).mockResolvedValueOnce({
            error: { code: 'Fiat2CryptoTransferOverLimit', message: 'Transfer error' },
        });
        await account_transfer_store.sortAccountsTransfer({ accounts });
        await account_transfer_store.requestTransferBetweenAccounts({ amount: 1000 });

        expect(account_transfer_store.root_store.client.setAccountStatus).toHaveBeenCalledWith(1);
    });

    it('should call proper setBalance methods when calling requestTransferBetweenAccounts method', async () => {
        const spySetBalanceSelectedFrom = jest.spyOn(account_transfer_store, 'setBalanceSelectedFrom');
        const spySetBalanceSelectedTo = jest.spyOn(account_transfer_store, 'setBalanceSelectedTo');

        (account_transfer_store.WS.authorized.transferBetweenAccounts as jest.Mock).mockResolvedValueOnce({
            accounts: [
                {
                    ...CR_USD_account,
                    balance: '123',
                },
                { ...MT_USD_account, balance: '999', loginid: 'MTR111176' },
            ],
        });
        await account_transfer_store.sortAccountsTransfer({ accounts });
        account_transfer_store.setSelectedTo({ value: 'MTR111176', is_mt: true });
        account_transfer_store.setSelectedFrom({ value: 'CR90000103' });
        await account_transfer_store.requestTransferBetweenAccounts({ amount: 10 });

        expect(spySetBalanceSelectedFrom).toHaveBeenCalledWith('123');
        expect(spySetBalanceSelectedTo).toHaveBeenCalledWith('999');
    });

    it('should show loader during fetching the data when calling requestTransferBetweenAccounts method', async () => {
        await account_transfer_store.sortAccountsTransfer({ accounts });
        await account_transfer_store.requestTransferBetweenAccounts({ amount: 10 });

        expect(
            (account_transfer_store.root_store.modules.cashier.general_store.setLoading as jest.Mock).mock.calls
        ).toEqual([[true], [false]]);
    });

    it('should call WS.mt5LoginList and WS.balanceAll methods to update the balance for mt account when calling requestTransferBetweenAccounts', async () => {
        await account_transfer_store.sortAccountsTransfer({ accounts });
        (account_transfer_store.WS.authorized.transferBetweenAccounts as jest.Mock).mockResolvedValueOnce({
            accounts: [CR_USD_account, { ...MT_USD_account, loginid: 'MTR111176' }],
        });
        account_transfer_store.setSelectedTo({ value: 'DXR1003', is_mt: true });
        await account_transfer_store.requestTransferBetweenAccounts({ amount: 1000 });

        expect(account_transfer_store.WS.mt5LoginList).toHaveBeenCalledTimes(1);
        expect(account_transfer_store.WS.balanceAll).toHaveBeenCalledTimes(1);
    });

    it('should call WS.tradingPlatformAccountsList and WS.balanceAll methods to update the balance for dxtrade account when calling requestTransferBetweenAccounts', async () => {
        await account_transfer_store.sortAccountsTransfer({ accounts });
        (account_transfer_store.WS.authorized.transferBetweenAccounts as jest.Mock).mockResolvedValue({
            accounts: [CR_USD_account, { ...DXR_USD_account, loginid: 'DXR1003' }],
        });
        account_transfer_store.setSelectedTo({ value: 'DXR1003', is_dxtrade: true });
        await account_transfer_store.requestTransferBetweenAccounts({ amount: 1000 });

        expect(account_transfer_store.WS.tradingPlatformAccountsList).toHaveBeenCalledWith(CFD_PLATFORMS.DXTRADE);
        expect(account_transfer_store.WS.balanceAll).toHaveBeenCalledTimes(1);
    });

    it('should reset account transfer', () => {
        const spySetIsTransferConfirm = jest.spyOn(account_transfer_store, 'setIsTransferConfirm');
        const spySetTransferLimit = jest.spyOn(account_transfer_store, 'setTransferLimit');
        account_transfer_store.resetAccountTransfer();

        expect(spySetIsTransferConfirm).toHaveBeenCalledWith(false);
        expect(spySetTransferLimit).toHaveBeenCalledTimes(1);
    });

    it('should set transfer percentage selector result if amount > 0', () => {
        const spyValidateTransferFromAmount = jest.spyOn(account_transfer_store, 'validateTransferFromAmount');
        account_transfer_store.setSelectedFrom({ currency: 'USD' });
        account_transfer_store.setSelectedTo({ currency: 'BTC' });
        account_transfer_store.setTransferPercentageSelectorResult('10', 11.01);
        const { onChangeConverterFromAmount, setConverterFromAmount } =
            account_transfer_store.root_store.modules.cashier.crypto_fiat_converter;

        expect(setConverterFromAmount).toHaveBeenCalledWith('10');
        expect(spyValidateTransferFromAmount).toHaveBeenCalledTimes(1);
        expect(onChangeConverterFromAmount).toHaveBeenCalledWith({ target: { value: '10' } }, 'USD', 'BTC', 11.01);
    });

    it('should set transfer percentage selector result if selected_from.balance = 0', () => {
        const spyValidateTransferFromAmount = jest.spyOn(account_transfer_store, 'validateTransferFromAmount');
        account_transfer_store.setSelectedFrom({ balance: 0, currency: 'USD' });
        account_transfer_store.setSelectedTo({ currency: 'BTC' });
        account_transfer_store.setTransferPercentageSelectorResult('0', 11.01);
        const { onChangeConverterFromAmount, setConverterFromAmount } =
            account_transfer_store.root_store.modules.cashier.crypto_fiat_converter;

        expect(setConverterFromAmount).toHaveBeenCalledWith('0');
        expect(spyValidateTransferFromAmount).toHaveBeenCalledTimes(1);
        expect(onChangeConverterFromAmount).toHaveBeenCalledWith({ target: { value: '0' } }, 'USD', 'BTC', 11.01);
    });

    it('should reset crypto fiat converter if amount = 0 and selected_from.balance > 0', () => {
        account_transfer_store.setSelectedFrom({ balance: 10, currency: 'USD' });
        account_transfer_store.setTransferPercentageSelectorResult('0', 11.01);

        expect(
            account_transfer_store.root_store.modules.cashier.crypto_fiat_converter.resetConverter
        ).toHaveBeenCalledTimes(1);
    });

    it('should set timer visibility and percentage selector selection status to false when calling  setTransferPercentageSelectorResult method', () => {
        account_transfer_store.setTransferPercentageSelectorResult('10', 11.01);
        const { crypto_fiat_converter, general_store } = account_transfer_store.root_store.modules.cashier;

        expect(crypto_fiat_converter.setIsTimerVisible).toHaveBeenCalledWith(false);
        expect(general_store.percentageSelectorSelectionStatus).toHaveBeenCalledWith(false);
    });

    it('should set "This field is required." error, if there is no converter_from_amount when calling validateTransferFromAmount method', () => {
        account_transfer_store.root_store.modules.cashier.crypto_fiat_converter.converter_from_amount = '';
        account_transfer_store.validateTransferFromAmount();

        expect(
            account_transfer_store.root_store.modules.cashier.crypto_fiat_converter.setConverterFromError
        ).toHaveBeenLastCalledWith('This field is required.');
    });

    it('should set "Insufficient funds" error, if selected_from.balance < converter_from_amount when calling validateTransferFromAmount method', () => {
        account_transfer_store.setSelectedFrom({ balance: 5 });
        account_transfer_store.validateTransferFromAmount();

        expect(
            account_transfer_store.root_store.modules.cashier.crypto_fiat_converter.setConverterFromError
        ).toHaveBeenLastCalledWith('Insufficient funds');
    });

    it('should set error message, if converter_from_amount is not valid number when calling validateTransferFromAmount method', () => {
        (validNumber as jest.Mock).mockReturnValueOnce({ is_ok: false, message: 'Validation error' });
        account_transfer_store.validateTransferFromAmount();

        expect(
            account_transfer_store.root_store.modules.cashier.crypto_fiat_converter.setConverterFromError
        ).toHaveBeenLastCalledWith('Validation error');
    });

    it('should remove an error if validation is successful when calling validateTransferFromAmount method', () => {
        account_transfer_store.setSelectedFrom({ balance: 20 });
        account_transfer_store.validateTransferFromAmount();

        expect(
            account_transfer_store.root_store.modules.cashier.crypto_fiat_converter.setConverterFromError
        ).toHaveBeenLastCalledWith('');
    });

    it('should set error message, if converter_to_amount is not valid number when calling validateTransferToAmount method', () => {
        (validNumber as jest.Mock).mockReturnValueOnce({ is_ok: false, message: 'Validation error' });
        account_transfer_store.validateTransferToAmount();

        expect(
            account_transfer_store.root_store.modules.cashier.crypto_fiat_converter.setConverterToError
        ).toHaveBeenLastCalledWith('Validation error');
    });

    it('should remove an error if validation is successful when calling validateTransferToAmount method', () => {
        account_transfer_store.validateTransferToAmount();

        expect(
            account_transfer_store.root_store.modules.cashier.crypto_fiat_converter.setConverterToError
        ).toHaveBeenLastCalledWith('');
    });
});

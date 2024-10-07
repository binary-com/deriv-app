import { action, computed, makeObservable, observable } from 'mobx';

import type { TransferBetweenAccountsResponse } from '@deriv/api-types';
import {
    CFD_PLATFORMS,
    formatMoney,
    getCFDAccount,
    getCFDAccountDisplay,
    getCurrencies,
    getCurrencyDisplayCode,
    getDecimalPlaces,
    getPropertyValue,
    isCryptocurrency,
    isEmptyObject,
    validNumber,
} from '@deriv/shared';
import { localize } from '@deriv/translations';

import AccountTransferGetSelectedError from '../pages/account-transfer/account-transfer-get-selected-error';
import type { TAccount, TPlatformIcon, TRootStore, TTransferAccount, TWebSocket } from '../types';

import ErrorStore from './error-store';

const hasTransferNotAllowedLoginid = (loginid?: string) => loginid?.startsWith('MX');

export default class AccountTransferStore {
    constructor(
        public WS: TWebSocket,
        public root_store: TRootStore
    ) {
        makeObservable(this, {
            accounts_list: observable,
            error: observable,
            has_no_account: observable,
            has_no_accounts_balance: observable,
            is_transfer_confirm: observable,
            is_transfer_successful: observable,
            is_mt5_transfer_in_progress: observable,
            minimum_fee: observable,
            receipt: observable,
            selected_from: observable,
            selected_to: observable,
            account_transfer_amount: observable,
            should_switch_account: observable,
            transfer_fee: observable,
            transfer_limit: observable,
            is_transfer_locked: computed,
            setBalanceByLoginId: action.bound,
            setBalanceSelectedFrom: action.bound,
            setBalanceSelectedTo: action.bound,
            onMountAccountTransfer: action.bound,
            setHasNoAccountsBalance: action.bound,
            setHasNoAccount: action.bound,
            setTransferFee: action.bound,
            setMinimumFee: action.bound,
            setTransferLimit: action.bound,
            sortAccountsTransfer: action.bound,
            setSelectedFrom: action.bound,
            setSelectedTo: action.bound,
            setAccounts: action.bound,
            setIsTransferConfirm: action.bound,
            setAccountTransferAmount: action.bound,
            setIsTransferSuccessful: action.bound,
            setIsMT5TransferInProgress: action.bound,
            setReceiptTransfer: action.bound,
            onChangeTransferFrom: action.bound,
            onChangeTransferTo: action.bound,
            resetAccountTransfer: action.bound,
            setTransferPercentageSelectorResult: action.bound,
            setShouldSwitchAccount: action.bound,
            validateTransferFromAmount: action.bound,
            validateTransferToAmount: action.bound,
        });
    }

    accounts_list: TAccount[] = [];
    error = new ErrorStore();
    has_no_account = false;
    has_no_accounts_balance = false;
    is_transfer_confirm = false;
    is_transfer_successful = false;
    is_mt5_transfer_in_progress = false;
    minimum_fee: string | null = null;
    receipt = {
        amount_transferred: '',
    };
    selected_from: TAccount = {};
    selected_to: TAccount = {};
    account_transfer_amount: string | null = '';
    should_switch_account = false;
    transfer_fee?: number | null = null;
    transfer_limit: { min?: string | number; max?: string | number } = {};

    get is_transfer_locked() {
        const {
            is_financial_account,
            is_financial_information_incomplete,
            is_trading_experience_incomplete,
            account_status,
        } = this.root_store.client;

        if (!account_status?.status) return false;

        const need_financial_assessment =
            is_financial_account && (is_financial_information_incomplete || is_trading_experience_incomplete);

        return need_financial_assessment && this.error.is_ask_financial_risk_approval;
    }

    setShouldSwitchAccount(value: boolean) {
        this.should_switch_account = value;
    }

    setBalanceByLoginId(loginid: string, balance: string | number) {
        const account = this.accounts_list.find(acc => loginid === acc.value);
        if (account) account.balance = balance;
    }

    setBalanceSelectedFrom(balance: string | number): void {
        this.selected_from.balance = balance;
    }

    setBalanceSelectedTo(balance: string | number): void {
        this.selected_to.balance = balance;
    }

    // possible transfers:
    // 1. fiat to crypto & vice versa
    // 2. fiat to mt & vice versa
    // 3. crypto to mt & vice versa
    async onMountAccountTransfer() {
        const { client, common, modules } = this.root_store;
        const { onMountCommon, setLoading, setOnRemount } = modules.cashier.general_store;
        const { active_accounts, is_logged_in } = client;
        const { is_from_derivgo, is_from_outside_cashier } = common;

        setLoading(true);
        setOnRemount(this.onMountAccountTransfer);
        await onMountCommon();
        await this.WS.wait('website_status');

        // check if some balance update has come in since the last mount
        const has_updated_account_balance =
            this.has_no_accounts_balance &&
            Object.keys(active_accounts).find(
                account => !active_accounts[Number(account)].is_virtual && active_accounts[Number(account)].balance
            );
        if (has_updated_account_balance) {
            this.setHasNoAccountsBalance(false);
        }

        // various issues happen when loading from cache
        // e.g. new account may have been created, transfer may have been done elsewhere, etc
        // so on load of this page just call it again
        if (is_logged_in) {
            const transfer_between_accounts = await this.WS.authorized.transferBetweenAccounts();

            if (transfer_between_accounts.error) {
                this.error.setErrorMessage(transfer_between_accounts.error, this.onMountAccountTransfer);
                setLoading(false);
                return;
            }

            if (!is_from_derivgo) {
                transfer_between_accounts.accounts = transfer_between_accounts.accounts || [];
            }

            if (!this.canDoAccountTransfer(transfer_between_accounts.accounts)) {
                return;
            }

            await this.sortAccountsTransfer(transfer_between_accounts, is_from_derivgo, is_from_outside_cashier);
            this.setTransferFee();
            this.setMinimumFee();
            this.setTransferLimit();

            if (this.accounts_list?.length > 0) {
                const cfd_transfer_to_login_id = sessionStorage.getItem('cfd_transfer_to_login_id');
                sessionStorage.removeItem('cfd_transfer_to_login_id');
                const obj_values = this.accounts_list.find(account => account.value === cfd_transfer_to_login_id);
                if (obj_values) {
                    if (hasTransferNotAllowedLoginid(obj_values.value)) {
                        // check if selected to is not allowed account
                        obj_values.error = AccountTransferGetSelectedError(obj_values.value);
                    }
                    this.setSelectedTo(obj_values);
                }
            }
        }
        setLoading(false);
    }

    canDoAccountTransfer(accounts: TransferBetweenAccountsResponse['accounts']) {
        let can_transfer = true;
        // should have at least one account with balance
        if (!accounts?.find(account => Number(account.balance) > 0)) {
            can_transfer = false;
            this.setHasNoAccountsBalance(true);
        } else {
            this.setHasNoAccountsBalance(false);
        }
        // should have at least two real-money accounts
        if (accounts && accounts.length <= 1) {
            can_transfer = false;
            this.setHasNoAccount(true);
        } else {
            this.setHasNoAccount(false);
        }
        if (!can_transfer) {
            this.root_store.modules.cashier.general_store.setLoading(false);
        }
        return can_transfer;
    }

    setHasNoAccountsBalance(has_no_accounts_balance: boolean): void {
        this.has_no_accounts_balance = has_no_accounts_balance;
    }

    setHasNoAccount(has_no_account: boolean): void {
        this.has_no_account = has_no_account;
    }

    setTransferFee() {
        const transfer_fee = getPropertyValue(getCurrencies(), [
            this.selected_from.currency || '',
            'transfer_between_accounts',
            'fees',
            this.selected_to.currency || '',
        ]);
        this.transfer_fee = Number(transfer_fee || 0);
    }

    setMinimumFee() {
        const decimals = getDecimalPlaces(this.selected_from.currency || '');
        // we need .toFixed() so that it doesn't display in scientific notation, e.g. 1e-8 for currencies with 8 decimal places
        this.minimum_fee = (1 / Math.pow(10, decimals)).toFixed(decimals);
    }

    setTransferLimit() {
        const transfer_limits = [
            { limits: 'limits_mt5', is_transfer: this.selected_from.is_mt || this.selected_to.is_mt },
            { limits: 'limits_dxtrade', is_transfer: this.selected_from.is_dxtrade || this.selected_to.is_dxtrade },
            { limits: 'limits_ctrader', is_transfer: this.selected_from.is_ctrader || this.selected_to.is_ctrader },
        ];

        const limits_key = transfer_limits.find(option => option.is_transfer)?.limits || 'limits';

        const transfer_limit = getPropertyValue(getCurrencies(), [
            this.selected_from.currency || '',
            'transfer_between_accounts',
            limits_key,
        ]);
        const balance = this.selected_from.balance;
        const decimal_places = getDecimalPlaces(this.selected_from.currency || '');
        // we need .toFixed() so that it doesn't display in scientific notation, e.g. 1e-8 for currencies with 8 decimal places
        this.transfer_limit = {
            max:
                !transfer_limit?.max ||
                (Number(balance) >= (transfer_limit?.min || 0) && Number(balance) <= transfer_limit?.max)
                    ? balance
                    : transfer_limit?.max.toFixed(decimal_places),
            min: transfer_limit?.min ? (+transfer_limit?.min).toFixed(decimal_places) : '',
        };
    }

    // Using Partial for type to bypass 'msg_type' and 'echo_req' from response type
    async sortAccountsTransfer(
        response_accounts?: Partial<TransferBetweenAccountsResponse> | null,
        is_from_derivgo?: boolean,
        is_from_outside_cashier?: boolean
    ) {
        const transfer_between_accounts = response_accounts || (await this.WS.authorized.transferBetweenAccounts());
        if (!this.accounts_list.length) {
            if (transfer_between_accounts.error) {
                return;
            }
        }

        if (!is_from_derivgo && transfer_between_accounts && Array.isArray(transfer_between_accounts.accounts)) {
            transfer_between_accounts.accounts = transfer_between_accounts.accounts || [];
        }

        const mt5_login_list = (await this.WS.storage.mt5LoginList())?.mt5_login_list;
        // TODO: move `tradingPlatformAccountsList` to deriv-api to use storage
        const dxtrade_accounts_list = (await this.WS.tradingPlatformAccountsList(CFD_PLATFORMS.DXTRADE))
            ?.trading_platform_accounts;

        const ctrader_accounts_list = (await this.WS.tradingPlatformAccountsList(CFD_PLATFORMS.CTRADER))
            ?.trading_platform_accounts;

        // TODO: remove this temporary mapping when API adds market_type and sub_account_type to transfer_between_accounts
        const accounts = transfer_between_accounts.accounts?.map(account => {
            if (account.account_type === CFD_PLATFORMS.MT5 && Array.isArray(mt5_login_list) && mt5_login_list.length) {
                // account_type in transfer_between_accounts (mt5|binary)
                // gets overridden by account_type in mt5_login_list (demo|real)
                // since in cashier all these are real accounts, the mt5 account type is what we want to keep
                const found_account = mt5_login_list.find(acc => acc.login === account.loginid);

                if (found_account === undefined) return account;

                return { ...account, ...found_account, account_type: CFD_PLATFORMS.MT5 };
            }
            if (
                account.account_type === CFD_PLATFORMS.CTRADER &&
                Array.isArray(ctrader_accounts_list) &&
                ctrader_accounts_list.length
            ) {
                const found_account = ctrader_accounts_list.find(acc => acc.account_id === account.loginid);

                if (found_account === undefined) return account;

                return { ...account, ...found_account, account_type: CFD_PLATFORMS.CTRADER };
            }
            if (
                account.account_type === CFD_PLATFORMS.DXTRADE &&
                Array.isArray(dxtrade_accounts_list) &&
                dxtrade_accounts_list.length
            ) {
                // account_type in transfer_between_accounts (mt5|binary)
                // gets overridden by account_type in dxtrade_accounts_list (demo|real)
                // since in cashier all these are real accounts, the mt5 account type is what we want to keep
                const found_account = dxtrade_accounts_list.find(acc => acc.account_id === account.loginid);

                if (found_account === undefined) return account;

                return { ...account, ...found_account, account_type: CFD_PLATFORMS.DXTRADE };
            }
            return account;
        });
        // sort accounts as follows:
        // for MT5, synthetic, financial, financial stp
        // for non-MT5, fiat, crypto (alphabetically by currency)
        // should have more than one account
        if (transfer_between_accounts.accounts && transfer_between_accounts.accounts.length > 1) {
            accounts?.sort((a, b) => {
                const a_is_mt = a.account_type === CFD_PLATFORMS.MT5;
                const b_is_mt = b.account_type === CFD_PLATFORMS.MT5;
                const a_is_crypto = !a_is_mt && isCryptocurrency(a.currency || '');
                const b_is_crypto = !b_is_mt && isCryptocurrency(b.currency || '');
                const a_is_fiat = !a_is_mt && !a_is_crypto;
                const b_is_fiat = !b_is_mt && !b_is_crypto;
                if (a_is_mt && b_is_mt) {
                    if (a.market_type === 'synthetic') {
                        return -1;
                    }
                    // Remove ('sub_account_type' in a) when api-types is updated
                    if ('sub_account_type' in a && a.sub_account_type === 'financial') {
                        return b.market_type === 'synthetic' ? 1 : -1;
                    }
                    return 1;
                } else if ((a_is_crypto && b_is_crypto) || (a_is_fiat && b_is_fiat)) {
                    return a.currency && b.currency && a.currency < b.currency ? -1 : 1;
                } else if ((a_is_crypto && b_is_mt) || (a_is_fiat && b_is_crypto) || (a_is_fiat && b_is_mt)) {
                    return -1;
                }
                return a_is_mt ? -1 : 1;
            });
        }
        const arr_accounts: TTransferAccount | TAccount[] = [];
        this.setSelectedTo({}); // set selected to empty each time so we can redetermine its value on reload

        accounts?.forEach((account: TTransferAccount) => {
            const cfd_platforms = {
                mt5: { name: 'Deriv MT5', icon: 'IcMt5' },
                ctrader: { name: 'Deriv cTrader', icon: 'IcBrand' },
                dxtrade: { name: 'Deriv X', icon: 'IcRebranding' },
            };
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const is_cfd = Object.keys(cfd_platforms).includes(account.account_type!);
            const cfd_text_display = cfd_platforms[account.account_type as keyof typeof cfd_platforms]?.name;

            const cfd_icon_display = `${cfd_platforms[account.account_type as keyof typeof cfd_platforms]?.icon}${
                ('-' &&
                    getCFDAccount({
                        market_type: account.market_type,
                        sub_account_type: account.sub_account_type,
                        platform: account.account_type,
                        is_eu: this.root_store.client.is_eu,
                        is_transfer_form: true,
                    })) ||
                ''
            }`;

            const non_eu_accounts =
                account.landing_company_short &&
                account.landing_company_short !== 'svg' &&
                account.landing_company_short !== 'bvi'
                    ? account.landing_company_short?.charAt(0).toUpperCase() + account.landing_company_short?.slice(1)
                    : account.landing_company_short?.toUpperCase();

            const cfd_account_text_display =
                account.account_type === 'mt5'
                    ? `${getCFDAccountDisplay({
                          market_type: account.market_type,
                          sub_account_type: account.sub_account_type,
                          platform: account.account_type,
                          is_eu: this.root_store.client.is_eu,
                          product: account.product,
                      })} ${this.root_store.client.is_eu ? '' : non_eu_accounts}`
                    : `${cfd_text_display} ${
                          getCFDAccountDisplay({
                              market_type: account.market_type,
                              sub_account_type: account.sub_account_type,
                              platform: account.account_type,
                              is_eu: this.root_store.client.is_eu,
                              is_transfer_form: true,
                          }) || ''
                      }`;
            const account_text_display = is_cfd
                ? cfd_account_text_display
                : getCurrencyDisplayCode(
                      account.currency !== 'eUSDT' ? account.currency?.toUpperCase() : account.currency
                  );

            const combined_cfd_mt5_account = this.root_store.traders_hub?.combined_cfd_mt5_accounts.find(
                x => x.login === account.login
            );

            const short_code_and_region = combined_cfd_mt5_account?.short_code_and_region
                ? ` ${combined_cfd_mt5_account?.short_code_and_region}`
                : '';

            const obj_values: TAccount = {
                text:
                    is_cfd && account.account_type === CFD_PLATFORMS.MT5 && combined_cfd_mt5_account
                        ? `${combined_cfd_mt5_account.sub_title}${short_code_and_region}`
                        : account_text_display,
                value: account.loginid,
                balance: account.balance,
                currency: account.currency,
                is_crypto: isCryptocurrency(account.currency),
                is_mt: account.account_type === CFD_PLATFORMS.MT5,
                is_ctrader: account.account_type === CFD_PLATFORMS.CTRADER,
                is_dxtrade: account.account_type === CFD_PLATFORMS.DXTRADE,
                ...(is_cfd && {
                    platform_icon:
                        account.account_type === CFD_PLATFORMS.MT5 && combined_cfd_mt5_account
                            ? combined_cfd_mt5_account.icon
                            : (cfd_icon_display as TPlatformIcon),
                    status: account?.status,
                    market_type: getCFDAccount({
                        market_type: account.market_type,
                        sub_account_type: account.sub_account_type,
                        platform: account.account_type,
                        is_eu: this.root_store.client.is_eu,
                    }),
                }),
            };

            // set current logged in client as the default transfer from account
            if (account.loginid === this.root_store.client.loginid) {
                // check if selected from is not allowed account
                if (hasTransferNotAllowedLoginid(obj_values.value)) {
                    obj_values.error = AccountTransferGetSelectedError(obj_values.value, true);
                }

                this.setSelectedFrom(obj_values);
            } else if (isEmptyObject(this.selected_to)) {
                if (hasTransferNotAllowedLoginid(obj_values.value)) {
                    // check if selected to is not allowed account
                    obj_values.error = AccountTransferGetSelectedError(obj_values.value);
                }

                const login = this.root_store.traders_hub?.selected_account.login;
                const account_id = this.root_store.traders_hub?.selected_account.account_id;

                //if from appstore -> set selected account as the default transfer to account
                //if not from appstore -> set the first available account as the default transfer to account
                if (!is_from_outside_cashier || [account_id, login].includes(account.loginid)) {
                    this.setSelectedTo(obj_values);
                }
            }
            arr_accounts.push(obj_values);
        });
        this.setAccounts(arr_accounts);
    }

    setSelectedFrom(obj_values: TAccount): void {
        this.selected_from = obj_values;
    }

    setSelectedTo(obj_values: TAccount): void {
        this.selected_to = obj_values;
    }

    setAccounts(arr_accounts: TTransferAccount[]) {
        this.accounts_list = arr_accounts;
    }

    setIsTransferConfirm(is_transfer_confirm: boolean): void {
        this.is_transfer_confirm = is_transfer_confirm;
    }

    setAccountTransferAmount(amount: string | null): void {
        this.account_transfer_amount = amount;
    }

    setIsTransferSuccessful(is_transfer_successful: boolean): void {
        this.is_transfer_successful = is_transfer_successful;
    }

    setIsMT5TransferInProgress(is_mt5_transfer_in_progress: boolean): void {
        this.is_mt5_transfer_in_progress = is_mt5_transfer_in_progress;
    }

    setReceiptTransfer({ amount }: { amount: string }): void {
        this.receipt = {
            amount_transferred: amount,
        };
    }

    onChangeTransferFrom({ target }: { target: { value: string } }) {
        this.error.setErrorMessage({ code: '', message: '' });
        this.selected_from.error = '';

        const accounts = this.accounts_list;
        const selected_from = accounts.find(account => account.value === target.value);

        const platforms = ['is_mt', 'is_ctrader', 'is_dxtrade'] as const;

        const isBetweenCFDsTransfer = platforms.some(from_platform => {
            return platforms.some(to_platform => selected_from?.[from_platform] && this.selected_to?.[to_platform]);
        });

        // if new value of selected_from is the same as the current selected_to
        // switch the value of selected_from and selected_to
        if (selected_from?.value === this.selected_to.value) {
            this.onChangeTransferTo({ target: { value: this.selected_from.value } });
        } else if (isBetweenCFDsTransfer) {
            // not allowed to transfer from MT5 to MT5
            // not allowed to transfer from DerivX to DerivX
            // not allowed to transfer from cTrader to cTrader
            // not allowed to transfer between MT5 and DerivX and visa versa
            // not allowed to transfer between DerivX and cTrader and visa versa
            // not allowed to transfer between MT5 and cTrader and visa versa
            // if new value of selected_from is different from selected_to
            // switch the value of selected_to to current client loginid
            this.onChangeTransferTo({ target: { value: this.root_store.client.loginid } });
        }

        if (selected_from && hasTransferNotAllowedLoginid(selected_from?.value)) {
            selected_from.error = AccountTransferGetSelectedError(selected_from?.value, true);
        }

        this.selected_from = selected_from || {};
        this.setTransferFee();
        this.setMinimumFee();
        this.setTransferLimit();
    }

    onChangeTransferTo({ target }: { target: { value: string | undefined } }) {
        this.error.setErrorMessage({ code: '', message: '' });
        this.selected_to.error = '';

        const accounts = this.accounts_list;
        this.selected_to = accounts.find(account => account.value === target.value) || {};
        if (hasTransferNotAllowedLoginid(this.selected_to.value)) {
            this.selected_to.error = AccountTransferGetSelectedError(this.selected_to.value);
        }
        this.setTransferFee();
        this.setMinimumFee();
        this.setTransferLimit();
    }

    requestTransferBetweenAccounts = async ({ amount }: { amount: number }) => {
        const { client, modules, common } = this.root_store;
        const { setLoading } = modules.cashier.general_store;
        const { is_from_derivgo } = common;
        const {
            is_logged_in,
            responseMt5LoginList,
            responseTradingPlatformAccountsList,
            setAccountStatus,
            setBalanceOtherAccounts,
        } = client;

        if (!is_logged_in) {
            return null;
        }

        setLoading(true);
        this.error.setErrorMessage({ code: '', message: '' });

        const is_mt_transfer = this.selected_from.is_mt || this.selected_to.is_mt;

        if (is_mt_transfer) this.setIsMT5TransferInProgress(true);

        const currency = this.selected_from.currency;
        const transfer_between_accounts = await this.WS.authorized.transferBetweenAccounts(
            this.selected_from.value,
            this.selected_to.value,
            currency,
            amount
        );

        if (!is_from_derivgo && transfer_between_accounts && Array.isArray(transfer_between_accounts.accounts)) {
            transfer_between_accounts.accounts = transfer_between_accounts.accounts || [];
        }

        if (is_mt_transfer) this.setIsMT5TransferInProgress(false);

        if (transfer_between_accounts.error) {
            // if there is fiat2crypto transfer limit error, we need to refresh the account_status for authentication
            if (transfer_between_accounts.error.code === 'Fiat2CryptoTransferOverLimit') {
                const account_status_response = await this.WS.authorized.getAccountStatus();
                if (!account_status_response.error) {
                    setAccountStatus(account_status_response.get_account_status);
                }
            }
            this.error.setErrorMessage(transfer_between_accounts.error);
        } else {
            this.setReceiptTransfer({ amount: formatMoney(currency || '', amount, true) });
            transfer_between_accounts.accounts?.forEach(account => {
                this.setBalanceByLoginId(account.loginid || '', account.balance || '');
                if (account.loginid === this.selected_from.value) {
                    this.setBalanceSelectedFrom(account.balance || '');
                } else if (account.loginid === this.selected_to.value) {
                    this.setBalanceSelectedTo(account.balance || '');
                }
                // if one of the accounts was mt5
                if (account.account_type === CFD_PLATFORMS.MT5) {
                    Promise.all([this.WS.mt5LoginList(), this.WS.balanceAll()]).then(
                        ([mt5_login_list_response, balance_response]) => {
                            // update the balance for account switcher by renewing the mt5_login_list response
                            responseMt5LoginList(mt5_login_list_response);
                            // update total balance since MT5 total only comes in non-stream balance call
                            setBalanceOtherAccounts(balance_response.balance);
                        }
                    );
                }
                // if one of the accounts was dxtrade
                if (account.account_type === CFD_PLATFORMS.DXTRADE) {
                    Promise.all([
                        this.WS.tradingPlatformAccountsList(CFD_PLATFORMS.DXTRADE),
                        this.WS.balanceAll(),
                    ]).then(([dxtrade_login_list_response, balance_response]) => {
                        // update the balance for account switcher by renewing the dxtrade_login_list_response
                        responseTradingPlatformAccountsList(dxtrade_login_list_response);
                        // update total balance since Dxtrade total only comes in non-stream balance call
                        setBalanceOtherAccounts(balance_response.balance);
                    });
                }
                // if one of the accounts was ctrader
                if (account.account_type === CFD_PLATFORMS.CTRADER) {
                    Promise.all([
                        this.WS.tradingPlatformAccountsList(CFD_PLATFORMS.CTRADER),
                        this.WS.balanceAll(),
                    ]).then(([ctrader_login_list_response, balance_response]) => {
                        // update the balance for account switcher by renewing the ctrader_login_list_response
                        responseTradingPlatformAccountsList(ctrader_login_list_response);
                        setBalanceOtherAccounts(balance_response.balance);
                    });
                }
            });
            this.setAccountTransferAmount(null);
            this.setIsTransferConfirm(true);
        }
        setLoading(false);
        return transfer_between_accounts;
    };

    resetAccountTransfer = async () => {
        this.setIsTransferConfirm(false);
        this.setTransferLimit();
    };

    setTransferPercentageSelectorResult(amount: string, exchanged_amount: number) {
        const { crypto_fiat_converter, general_store } = this.root_store.modules.cashier;

        const selected_from_currency = this.selected_from.currency;
        const selected_to_currency = this.selected_to.currency;

        if (Number(amount) > 0 || Number(this.selected_from.balance) === 0) {
            crypto_fiat_converter.setConverterFromAmount(amount);
            this.validateTransferFromAmount();
            crypto_fiat_converter.onChangeConverterFromAmount(
                { target: { value: amount } },
                selected_from_currency,
                selected_to_currency,
                exchanged_amount
            );
        } else {
            crypto_fiat_converter.resetConverter();
        }
        crypto_fiat_converter.setIsTimerVisible(false);
        general_store.percentageSelectorSelectionStatus(false);
    }

    validateTransferFromAmount() {
        const converter_from_amount = this.root_store.modules.cashier?.crypto_fiat_converter.converter_from_amount;
        const setConverterFromError = this.root_store.modules.cashier?.crypto_fiat_converter.setConverterFromError;

        if (!converter_from_amount) {
            setConverterFromError(localize('This field is required.'));
        } else {
            const { is_ok, message } = validNumber(converter_from_amount, {
                type: 'float',
                decimals: getDecimalPlaces(this.selected_from.currency || ''),
                min: Number(this.transfer_limit.min),
                max: Number(this.transfer_limit.max),
            });
            if (!is_ok) {
                setConverterFromError(message || '');
            } else if (Number(this.selected_from.balance) < Number(converter_from_amount)) {
                setConverterFromError(localize('Insufficient funds'));
            } else {
                setConverterFromError('');
            }
        }
    }

    validateTransferToAmount() {
        const converter_to_amount = this.root_store.modules.cashier?.crypto_fiat_converter.converter_to_amount;
        const setConverterToError = this.root_store.modules.cashier?.crypto_fiat_converter.setConverterToError;

        if (converter_to_amount) {
            const currency = this.selected_to.currency;
            const { is_ok, message } = validNumber(converter_to_amount, {
                type: 'float',
                decimals: getDecimalPlaces(currency || ''),
            });
            if (!is_ok) {
                setConverterToError(message || '');
            } else {
                setConverterToError('');
            }
        }
    }
}

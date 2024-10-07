import { action, computed, observable, makeObservable } from 'mobx';
import { formatMoney, getDecimalPlaces, getMinWithdrawal, validNumber } from '@deriv/shared';
import { CryptoConfig } from '@deriv/api-types';
import { localize } from '@deriv/translations';
import Constants from 'Constants/constants';
import ErrorStore from './error-store';
import { TWebSocket, TRootStore } from '../types';

export default class WithdrawStore {
    constructor(
        public WS: TWebSocket,
        public root_store: TRootStore
    ) {
        makeObservable(this, {
            blockchain_address: observable,
            crypto_estimations_fee_unique_id: observable,
            crypto_estimations_fee: observable,
            error: observable,
            is_10k_withdrawal_limit_reached: observable,
            is_withdraw_confirmed: observable,
            withdraw_amount: observable,
            max_withdraw_amount: observable,
            crypto_config: observable,
            setIsWithdrawConfirmed: action.bound,
            setWithdrawAmount: action.bound,
            requestWithdraw: action.bound,
            saveWithdraw: action.bound,
            resetWithdrawForm: action.bound,
            setBlockchainAddress: action.bound,
            onMountWithdraw: action.bound,
            onMountCryptoWithdraw: action.bound,
            is_withdrawal_locked: computed,
            setMaxWithdrawAmount: action.bound,
            check10kLimit: action.bound,
            set10kLimitation: action.bound,
            setCryptoConfig: action.bound,
            setCryptoEstimationsFeeUniqueId: action.bound,
            setCryptoEstimationsFee: action.bound,
            setWithdrawPercentageSelectorResult: action.bound,
            validateWithdrawFromAmount: action.bound,
            validateWithdrawToAmount: action.bound,
        });

        this.root_store = root_store;
        this.WS = WS;
    }

    blockchain_address = '';
    crypto_estimations_fee_unique_id = '';
    crypto_estimations_fee = 0;
    error = new ErrorStore();
    is_10k_withdrawal_limit_reached?: boolean = undefined;
    is_withdraw_confirmed = false;
    withdraw_amount = '';
    max_withdraw_amount = 0;
    crypto_config: CryptoConfig = {
        currencies_config: {},
    };

    setIsWithdrawConfirmed(is_withdraw_confirmed: boolean) {
        const converter_from_amount = this.root_store.modules.cashier?.crypto_fiat_converter.converter_from_amount;
        this.is_withdraw_confirmed = is_withdraw_confirmed;

        if (is_withdraw_confirmed) this.setWithdrawAmount(converter_from_amount);

        if (!is_withdraw_confirmed) {
            const { client, modules } = this.root_store;
            // TODO: remove this unused container
            const active_container = modules.cashier?.general_store.active_container;
            const container = Constants.map_action[active_container as keyof typeof Constants.map_action];

            client.setVerificationCode('', container);
        }
    }

    setWithdrawAmount(amount: string) {
        this.withdraw_amount = amount;
    }

    setCryptoEstimationsFeeUniqueId(crypto_estimations_fee_unique_id: string) {
        this.crypto_estimations_fee_unique_id = crypto_estimations_fee_unique_id;
    }

    setCryptoEstimationsFee(crypto_estimations_fee: number) {
        this.crypto_estimations_fee = crypto_estimations_fee;
    }

    async requestWithdraw(verification_code: string) {
        const { client, modules } = this.root_store;
        const { crypto_fiat_converter } = modules.cashier;

        if (!client.is_logged_in) {
            return;
        }

        if (!crypto_fiat_converter.converter_from_amount) {
            crypto_fiat_converter.setConverterFromError(localize('This field is required.'));
            return;
        }

        await this.WS.cryptoWithdraw({
            address: this.blockchain_address,
            amount: +crypto_fiat_converter.converter_from_amount,
            verification_code,
            estimated_fee_unique_id: this.crypto_estimations_fee_unique_id || undefined,
            dry_run: 1,
        }).then(response => {
            if (response.error) {
                this.error.setErrorMessage({ code: response.error.code, message: response.error.message });
                this.setCryptoConfig().then(() => this.validateWithdrawFromAmount());
            } else {
                this.saveWithdraw(verification_code);
            }
        });
    }

    async saveWithdraw(verification_code: string) {
        const converter_from_amount = this.root_store.modules.cashier?.crypto_fiat_converter.converter_from_amount;

        this.error.setErrorMessage({ code: '', message: '' });
        await this.WS.cryptoWithdraw({
            address: this.blockchain_address,
            amount: +converter_from_amount,
            estimated_fee_unique_id: this.crypto_estimations_fee_unique_id || undefined,
            verification_code,
        }).then(response => {
            if (response.error) {
                this.error.setErrorMessage(response.error);
                if (verification_code) {
                    const { client, modules } = this.root_store;
                    // TODO: remove this unused container
                    const active_container = modules.cashier?.general_store.active_container;
                    const container = Constants.map_action[active_container as keyof typeof Constants.map_action];

                    client.setVerificationCode('', container);
                }
                this.resetWithdrawForm();
            } else {
                this.setIsWithdrawConfirmed(true);
            }
        });
    }

    resetWithdrawForm() {
        const setConverterFromAmount = this.root_store.modules.cashier?.crypto_fiat_converter.setConverterFromAmount;
        const setConverterToAmount = this.root_store.modules.cashier?.crypto_fiat_converter.setConverterToAmount;
        const { client, modules } = this.root_store;
        // TODO: remove this unused container
        const { active_container } = modules.cashier.general_store;
        const container = Constants.map_action[active_container as keyof typeof Constants.map_action];

        this.setBlockchainAddress('');
        this.setCryptoEstimationsFee(0);
        setConverterFromAmount('');
        setConverterToAmount('');
        client.setVerificationCode('', container);
    }

    setBlockchainAddress(address: string) {
        this.blockchain_address = address;
    }

    willMountWithdraw(verification_code: string) {
        if (this && this.root_store && verification_code) {
            const { client, modules } = this.root_store;
            // TODO: remove this unused container
            const active_container = modules.cashier?.general_store.active_container;
            const container = Constants.map_action[active_container as keyof typeof Constants.map_action];

            client.setVerificationCode('', container);
        }
    }

    async onMountWithdraw(verification_code?: string) {
        const { client, modules } = this.root_store;
        const active_container = modules.cashier?.general_store.active_container;
        const is_crypto = modules.cashier?.general_store.is_crypto;
        const onMountCommon = modules.cashier?.general_store.onMountCommon;
        const setLoading = modules.cashier?.general_store.setLoading;
        const setOnRemount = modules.cashier?.general_store.setOnRemount;
        const {
            checkIframeLoaded,
            clearTimeoutCashierUrl,
            clearIframe,
            is_session_timeout,
            setContainerHeight,
            setIframeUrl,
            setSessionTimeout,
            setTimeoutCashierUrl,
        } = modules.cashier.iframe;
        const { is_virtual } = client;
        const current_container = active_container;

        setOnRemount(this.onMountWithdraw);
        await onMountCommon();

        this.error.setErrorMessage({ code: '', message: '' });
        setContainerHeight(0);
        clearIframe();
        setLoading(true);

        if (!is_session_timeout) {
            checkIframeLoaded();
            return;
        }

        // if session has timed out reset everything
        setIframeUrl('');
        if (!verification_code || is_virtual) {
            setLoading(false);
            // if virtual, clear everything and don't proceed further
            // if no verification code, we should request again
            return;
        }

        const response_cashier = await this.WS.authorized.cashier('withdraw', { verification_code });

        // if tab changed while waiting for response, ignore it
        if (current_container !== active_container) {
            setLoading(false);
            return;
        }
        if (response_cashier.error) {
            this.error.handleCashierError(response_cashier.error);
            setLoading(false);
            setSessionTimeout(true);
            clearTimeoutCashierUrl();
            if (verification_code) {
                // TODO: remove this unused container
                const container = Constants.map_action[active_container as keyof typeof Constants.map_action];

                client.setVerificationCode('', container);
            }
        } else if (is_crypto) {
            setLoading(false);
        } else {
            await checkIframeLoaded();
            setLoading(false);
            setIframeUrl(response_cashier.cashier as string);
            setSessionTimeout(false);
            setTimeoutCashierUrl(true);
        }
    }

    async onMountCryptoWithdraw(verification_code: string) {
        const { crypto_fiat_converter, general_store, iframe } = this.root_store.modules.cashier;

        general_store.setLoading(true);
        const str_reg_exp = /^\w{8,128}$/;
        let response_cashier;

        if (str_reg_exp.test(verification_code)) {
            response_cashier = await this.WS.cryptoWithdraw({
                address: this.blockchain_address,
                amount: +crypto_fiat_converter.converter_from_amount,
                verification_code,
                dry_run: 1,
            });
        } else {
            response_cashier = { error: { code: 'InvalidToken', message: 'Your token has expired or is invalid.' } };
        }

        if (response_cashier.error?.code === 'InvalidToken') {
            this.error.handleCashierError(response_cashier.error);
            general_store.setLoading(false);
            iframe.setSessionTimeout(true);
            iframe.clearTimeoutCashierUrl();
            if (verification_code) {
                const { client, modules } = this.root_store;
                // TODO: remove this unused container
                const active_container = modules.cashier?.general_store.active_container;
                const container = Constants.map_action[active_container as keyof typeof Constants.map_action];

                client.setVerificationCode('', container);
            }
        } else {
            await this.setCryptoConfig();
            general_store.setLoading(false);
        }
    }

    async setCryptoConfig() {
        this.crypto_config = (await this.WS.cryptoConfig())?.crypto_config;
    }

    get is_withdrawal_locked() {
        const { client } = this.root_store;
        const { authentication } = client?.account_status || {};

        if (!client.account_status?.status) return false;
        const need_poi = authentication?.needs_verification.includes('identity');
        const need_authentication = this.error.is_ask_authentication && need_poi;

        return client.is_withdrawal_lock || need_authentication || this.error.is_ask_financial_risk_approval;
    }

    setMaxWithdrawAmount(amount: number) {
        this.max_withdraw_amount = amount;
    }

    async check10kLimit() {
        const { client } = this.root_store;

        await this.WS.wait('get_limits');

        const remainder = client.account_limits?.remainder;
        this.setMaxWithdrawAmount(Number(remainder));

        const fractional_digit = Math.pow(10, -getDecimalPlaces(client.currency));
        const min_withdrawal = getMinWithdrawal(client.currency);
        const is_limit_reached = !!(
            typeof remainder !== 'undefined' &&
            remainder < (client.currency === 'XRP' ? fractional_digit : min_withdrawal)
        );
        this.set10kLimitation(is_limit_reached);
    }

    set10kLimitation(is_limit_reached: boolean) {
        this.is_10k_withdrawal_limit_reached = is_limit_reached;
    }

    setWithdrawPercentageSelectorResult(amount: string, exchanged_amount: number) {
        const { client, modules } = this.root_store;
        const { crypto_fiat_converter, general_store } = modules.cashier;
        const { currency, current_fiat_currency } = client;

        if (Number(amount) > 0) {
            crypto_fiat_converter.setConverterFromAmount(amount);
            this.validateWithdrawFromAmount();
            crypto_fiat_converter.onChangeConverterFromAmount(
                { target: { value: amount } },
                currency,
                current_fiat_currency || 'USD',
                exchanged_amount
            );
        } else {
            crypto_fiat_converter.resetConverter();
        }
        crypto_fiat_converter.setIsTimerVisible(false);
        general_store.percentageSelectorSelectionStatus(false);
    }

    validateWithdrawFromAmount() {
        let error_message: string | JSX.Element = '';

        const { client, modules } = this.root_store;
        const { balance, currency } = client;
        const { crypto_fiat_converter } = modules.cashier;
        const { converter_from_amount, setConverterFromError } = crypto_fiat_converter;

        const min_withdraw_amount =
            currency === 'XRP'
                ? Math.pow(10, -getDecimalPlaces(client.currency))
                : Number(this.crypto_config?.currencies_config?.[currency]?.minimum_withdrawal);
        const max_withdraw_amount =
            Number(this.max_withdraw_amount) > Number(balance) ? Number(balance) : Number(this.max_withdraw_amount);

        const format_balance = formatMoney(currency, balance || '', true);
        const format_min_withdraw_amount = formatMoney(currency, min_withdraw_amount, true);
        const format_max_withdraw_amount = formatMoney(currency, max_withdraw_amount, true);

        if (converter_from_amount) {
            const { is_ok, message } = validNumber(converter_from_amount, {
                type: 'float',
                decimals: getDecimalPlaces(currency),
            });
            if (!is_ok) error_message = message || '';
            else if (Number(balance) < Number(converter_from_amount)) error_message = localize('Insufficient funds');
            else if (min_withdraw_amount && Number(balance) < Number(min_withdraw_amount)) {
                error_message = localize(
                    'Your balance ({{format_balance}} {{currency}}) is less than the current minimum withdrawal allowed ({{format_min_withdraw_amount}} {{currency}}). Please top up your account to continue with your withdrawal.',
                    { format_balance, currency, format_min_withdraw_amount }
                );
            } else if (
                (min_withdraw_amount && Number(converter_from_amount) < Number(min_withdraw_amount)) ||
                Number(converter_from_amount) > Number(max_withdraw_amount)
            ) {
                error_message = localize(
                    'The current allowed withdraw amount is {{format_min_withdraw_amount}} to {{format_max_withdraw_amount}} {{currency}}',
                    { format_min_withdraw_amount, format_max_withdraw_amount, currency }
                );
            }
        }
        setConverterFromError(error_message);
    }

    validateWithdrawToAmount() {
        let error_message = '';
        const { client, modules } = this.root_store;
        const { current_fiat_currency } = client;
        const converter_to_amount = modules.cashier?.crypto_fiat_converter.converter_to_amount;
        const setConverterToError = modules.cashier?.crypto_fiat_converter.setConverterToError;

        if (converter_to_amount) {
            const { is_ok, message } = validNumber(converter_to_amount, {
                type: 'float',
                decimals: getDecimalPlaces(current_fiat_currency || ''),
            });
            if (!is_ok) error_message = message || '';
        }

        setConverterToError(error_message);
    }
}

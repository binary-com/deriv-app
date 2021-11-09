import { action, observable } from 'mobx';
import { getDecimalPlaces } from '@deriv/shared';

export default class CryptoFiatConverterStore {
    constructor({ WS, root_store }) {
        this.root_store = root_store;
        this.WS = WS;
    }

    @observable converter_from_amount = '';
    @observable converter_to_amount = '';
    @observable converter_from_error = '';
    @observable converter_to_error = '';
    @observable is_timer_visible = false;

    @action.bound
    setConverterFromAmount(amount) {
        this.converter_from_amount = amount;
    }

    @action.bound
    setConverterToAmount(amount) {
        this.converter_to_amount = amount;
    }

    @action.bound
    setConverterFromError(error) {
        this.converter_from_error = error;
    }

    @action.bound
    setConverterToError(error) {
        this.converter_to_error = error;
    }

    @action.bound
    setIsTimerVisible(is_timer_visible) {
        this.is_timer_visible = is_timer_visible;
    }

    @action.bound
    resetTimer() {
        this.setIsTimerVisible(false);
    }

    @action.bound
    async getExchangeRate(from_currency, to_currency) {
        const { exchange_rates } = await this.WS.send({
            exchange_rates: 1,
            base_currency: from_currency,
        });
        return exchange_rates.rates[to_currency];
    }

    @action.bound
    validateFromAmount() {
        const { account_transfer_store, general_store, withdraw_store } = this.root_store.modules.cashier;

        if (general_store.active_container === account_transfer_store.container) {
            account_transfer_store.validateTransferFromAmount();
        } else {
            withdraw_store.validateWithdrawFromAmount();
        }
    }

    @action.bound
    validateToAmount() {
        const { account_transfer_store, general_store, withdraw_store } = this.root_store.modules.cashier;

        if (general_store.active_container === account_transfer_store.container) {
            account_transfer_store.validateTransferToAmount();
        } else {
            withdraw_store.validateWithdrawToAmount();
        }
    }

    @action.bound
    async onChangeConverterFromAmount({ target }, from_currency, to_currency) {
        const { account_transfer_store, general_store } = this.root_store.modules.cashier;

        this.resetTimer();
        if (target.value) {
            this.setConverterFromAmount(target.value);
            this.validateFromAmount();
            general_store.percentageSelectorSelectionStatus(true);
            general_store.calculatePercentage();
            if (this.converter_from_error) {
                this.setConverterToAmount('');
                this.setConverterToError('');
                this.setIsTimerVisible(false);
                account_transfer_store.setAccountTransferAmount('');
            } else {
                const rate = await this.getExchangeRate(from_currency, to_currency);
                const decimals = getDecimalPlaces(to_currency);
                const amount = (rate * target.value).toFixed(decimals);
                if (+amount || this.converter_from_amount) {
                    this.setConverterToAmount(amount);
                } else {
                    this.setConverterToAmount('');
                }
                this.validateToAmount();
                this.setConverterToError('');
                this.setIsTimerVisible(true);
                account_transfer_store.setAccountTransferAmount(target.value);
            }
        } else {
            this.resetConverter();
        }
    }

    @action.bound
    async onChangeConverterToAmount({ target }, from_currency, to_currency) {
        const { account_transfer_store, general_store } = this.root_store.modules.cashier;

        this.resetTimer();
        if (target.value) {
            this.setConverterToAmount(target.value);
            this.validateToAmount();
            if (this.converter_to_error) {
                this.setConverterFromAmount('');
                this.setConverterFromError('');
                this.setIsTimerVisible(false);
                account_transfer_store.setAccountTransferAmount('');
            } else {
                const rate = await this.getExchangeRate(from_currency, to_currency);
                const decimals = getDecimalPlaces(to_currency);
                const amount = (rate * target.value).toFixed(decimals);
                if (+amount || this.converter_to_amount) {
                    this.setConverterFromAmount(amount);
                } else {
                    this.setConverterFromAmount('');
                }
                general_store.percentageSelectorSelectionStatus(true);
                general_store.calculatePercentage();
                this.validateFromAmount();
                if (this.converter_from_error) {
                    this.setIsTimerVisible(false);
                    account_transfer_store.setAccountTransferAmount('');
                } else {
                    this.setConverterFromError('');
                    this.setIsTimerVisible(true);
                    account_transfer_store.setAccountTransferAmount(amount);
                }
            }
        } else {
            this.resetConverter();
        }
    }

    @action.bound
    resetConverter() {
        this.setConverterFromAmount('');
        this.setConverterToAmount('');
        this.setConverterFromError('');
        this.setConverterToError('');
        this.setIsTimerVisible(false);
        this.root_store.modules.cashier.general_store.percentageSelectorSelectionStatus(true);
    }
}

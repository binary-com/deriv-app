import { observable, action } from 'mobx';
import { isCryptocurrency } from '@deriv/shared';

export default class AccountPromptDialogStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable should_show = false;
    @observable is_confirmed = false;
    @observable last_location = null;
    @observable current_location = null;

    @action.bound
    shouldNavigateAfterPrompt(next_location, current_location) {
        if (!this.is_confirmed) {
            this.last_location = next_location;
            this.should_show = true;
            this.current_location = current_location;
        }
    }

    @action.bound
    resetLastLocation() {
        this.last_location = null;
    }

    @action.bound
    resetIsConfirmed() {
        this.is_confirmed = false;
    }

    @action.bound
    async onConfirm() {
        const { accounts_list } = this.root_store.modules.cashier.account_transfer_store;
        this.should_show = false;
        this.is_confirmed = true;

        const has_fiat_account = accounts_list.some(x => !x.is_crypto);
        if (isCryptocurrency(this.root_store.client?.currency) && has_fiat_account) await this.doSwitch();
    }

    async doSwitch() {
        const { account_transfer_store, general_store } = this.root_store.modules.cashier;
        const non_crypto_accounts = account_transfer_store.accounts_list.filter(x => !x.is_crypto);
        const loginid = non_crypto_accounts.map(x => x.value)[0];
        await this.root_store.client.switchAccount(loginid);

        if (this.current_location === 'deposit') {
            general_store.setIsDeposit(true);
        }
    }

    @action.bound
    onCancel() {
        this.should_show = false;
    }

    @action.bound
    continueRoute() {
        if (this.is_confirmed && this.last_location) {
            this.root_store.common.routeTo(this.last_location);
        }
    }
}

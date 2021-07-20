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
        this.should_show = false;
        this.is_confirmed = true;

        const has_fiat_account = this.root_store.modules.cashier.config.account_transfer.accounts_list.some(
            x => !x.is_crypto
        );
        if (isCryptocurrency(this.root_store.client?.currency) && has_fiat_account) await this.doSwitch();
    }

    async doSwitch() {
        const non_crypto_accounts = this.root_store.modules.cashier.config.account_transfer.accounts_list.filter(
            x => !x.is_crypto
        );
        const loginid = non_crypto_accounts.map(x => x.value)[0];
        await this.root_store.client.switchAccount(loginid);

        if (this.current_location === 'deposit') {
            this.root_store.modules.cashier.setIsDeposit(true);
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

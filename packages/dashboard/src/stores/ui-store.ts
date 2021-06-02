import { action, observable } from 'mobx';
import { TUIProps } from 'Types';
import BaseStore from './base-store';

class UIStore extends BaseStore {
    public components = {};

    @observable
    public is_clear_funds_modal_open = false;

    @observable
    public is_dark_mode_on = false;

    @observable
    public is_get_wallet_modal_open = false;

    @observable
    public is_quick_guide_modal_open = false;

    @observable
    public is_real_acc_signup_on = false;

    @observable
    public is_trade_modal_open = false;

    @observable
    public real_account_signup: unknown = {};

    @observable
    public real_account_signup_target = '';

    public resetRealAccountSignupParams?: () => void;

    @action
    public init(ui_props: TUIProps): void {
        this.components = ui_props.components;
        this.is_dark_mode_on = ui_props.is_dark_mode_on;
        this.real_account_signup = ui_props.real_account_signup;
        this.resetRealAccountSignupParams = ui_props.resetRealAccountSignupParams;
    }

    @action.bound
    public enableGetPasswordModal(): void {
        this.is_get_wallet_modal_open = true;
    }

    @action.bound
    public disableGetPasswordModal(): void {
        this.is_get_wallet_modal_open = false;
    }

    @action.bound
    public toggleTradeModal(state_change = !this.is_trade_modal_open): void {
        this.is_trade_modal_open = !!state_change;
    }

    @action.bound
    public openRealAccountSignup(target = this.root_store.client_store.upgradeable_landing_companies?.[0]): void {
        this.is_real_acc_signup_on = true;
        this.real_account_signup_target = target;
    }
                                  
    @action.bound
    public toggleClearFundsModal(state_change = !this.is_clear_funds_modal_open): void {
        this.is_clear_funds_modal_open = !!state_change;
    }

    @action.bound
    public toggleQuickGuideModal(state_change = !this.is_quick_guide_modal_open): void {
        this.is_quick_guide_modal_open = !!state_change;
    }
}

export default UIStore;

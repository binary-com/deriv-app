import { action, observable } from 'mobx';
import { getPropertyValue } from '@deriv/shared';

export default class ErrorStore {
    @observable message = '';
    @observable code = '';
    @observable fields = '';
    @observable is_show_full_page = false;
    @observable onClickButton = null;
    @observable is_ask_uk_funds_protection = false;
    @observable is_self_exclusion_max_turnover_set = false;
    @observable is_ask_authentication = false;
    @observable is_ask_financial_risk_approval = false;

    @action.bound
    setErrorObject(error, onClickButton, is_show_full_page) {
        const error_object = {
            onClickButton,
            code: error.code,
            message: error.message,
            is_show_full_page: is_show_full_page || /InvalidToken|WrongResponse/.test(error.code),
            ...(getPropertyValue(error, ['details', 'fields']) && {
                fields: error.details.fields,
            }),
        };
        this.onClickButton = error_object.onClickButton;
        this.code = error_object.code;
        this.message = error_object.message;
        this.is_show_full_page = error_object.is_show_full_page;
        this.fields = error_object.fields;
        this.is_ask_uk_funds_protection = error_object?.is_ask_uk_funds_protection;
        this.is_self_exclusion_max_turnover_set = error_object?.is_self_exclusion_max_turnover_set;
        this.is_ask_authentication = error_object?.is_ask_authentication;
        this.is_ask_financial_risk_approval = error_object?.is_ask_financial_risk_approval;
    }

    @action.bound
    setErrorConfig(config_name, value) {
        this[config_name] = value;
    }

    @action.bound
    setIsAskUkFundsProtection(value) {
        this.is_ask_uk_funds_protection = value;
    }

    @action.bound
    setIsSelfExclusionMaxTurnoverSet(value) {
        this.is_self_exclusion_max_turnover_set = value;
    }

    @action.bound
    setIsAskAuthentication(value) {
        this.is_ask_authentication = value;
    }

    @action.bound
    setIsAskFinancialRiskApproval(value) {
        this.is_ask_financial_risk_approval = value;
    }
}

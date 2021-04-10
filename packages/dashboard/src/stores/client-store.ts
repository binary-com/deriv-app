import { GetFinancialAssessment, GetSettings, ResidenceList, StatesList } from '@deriv/api-types';
import { action, observable, computed } from 'mobx';
import { TClientProps, TCurrenciesList, TUpgradeInfo, TAccountList } from 'Types';
import BaseStore from './base-store';

class ClientStore extends BaseStore {
    @observable
    public loginid = '';

    @observable
    public is_logged_in = false;

    @observable
    public currencies_list: TCurrenciesList = {};

    @observable
    public accounts_list: TAccountList = [];

    @observable
    public currency = '';

    @observable
    public residence_list: ResidenceList = [];

    @observable
    public states_list: StatesList = [];

    @observable
    public residence = '';

    @observable
    public financial_assessment: GetFinancialAssessment = {};

    @observable
    public upgradeable_landing_companies: string[] = [];

    @observable
    public account_settings?: GetSettings;

    public email_address = '';

    public has_active_real_account?: () => boolean;
    public upgradeable_currencies?: () => string[];

    public fetchResidenceList?: () => void;
    public fetchStatesList?: () => void;
    public fetchFinancialAssessment?: () => void;
    public needs_financial_assessment?: () => boolean;

    public is_fully_authenticated?: () => boolean;
    public realAccountSignup?: () => Promise<void>;
    public has_real_account?: () => boolean;
    public upgrade_info: TUpgradeInfo;

    public has_currency?: () => boolean;
    public setAccountCurrency?: () => void;

    @computed
    public get has_wallet_account(): boolean {
        // TODO: return boolean based on existence of wallet accounts in `accounts_list`
        return !!this.accounts_list?.some(account => account.wallet);
    }

    @action
    public init(client_props: TClientProps): void {
        this.accounts_list = client_props.accounts_list;
        this.is_logged_in = client_props.is_logged_in;
        this.loginid = client_props.loginid;
        this.currency = client_props.currency;
        this.currencies_list = client_props.currencies_list;
        this.email_address = client_props.email_address;
        this.has_active_real_account = client_props.has_active_real_account;
        this.upgradeable_currencies = client_props.upgradeable_currencies;
        this.upgradeable_landing_companies = client_props.upgradeable_landing_companies;
        this.fetchResidenceList = client_props.fetchResidenceList;
        this.fetchStatesList = client_props.fetchStatesList;
        this.fetchFinancialAssessment = client_props.fetchFinancialAssessment;
        this.needs_financial_assessment = client_props.needs_financial_assessment;
        this.residence_list = client_props.residence_list;
        this.states_list = client_props.states_list;
        this.financial_assessment = client_props.financial_assessment;
        this.account_settings = client_props.account_settings;
        this.is_fully_authenticated = client_props.is_fully_authenticated;
        this.realAccountSignup = client_props.realAccountSignup;
        this.has_real_account = client_props.has_real_account;
        this.upgrade_info = client_props.upgrade_info;
        this.has_currency = client_props.has_currency;
        this.setAccountCurrency = client_props.setAccountCurrency;
        this.residence = client_props.residence;
    }
}

export default ClientStore;

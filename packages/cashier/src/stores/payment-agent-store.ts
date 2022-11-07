import { action, computed, observable, IObservableArray, makeObservable } from 'mobx';
import { PaymentAgentDetailsResponse, PaymentAgentWithdrawRequest } from '@deriv/api-types';
import { formatMoney, routes, shuffleArray } from '@deriv/shared';
import Constants from 'Constants/constants';
import ErrorStore from './error-store';
import VerificationStore from './verification-store';
import {
    TAgent,
    TExtendedPaymentAgentList,
    TExtendedPaymentAgentListResponse,
    TPartialPaymentAgentList,
    TPaymentAgentWithdrawConfirm,
    TPaymentAgentWithdrawReceipt,
    TRootStore,
    TServerError,
    TSupportedBank,
    TTarget,
    TWebSocket,
} from 'Types';

export default class PaymentAgentStore {
    constructor(public WS: TWebSocket, public root_store: TRootStore) {
        makeObservable(this, {
            list: observable,
            agents: observable,
            container: observable,
            error: observable,
            filtered_list: observable,
            is_name_selected: observable,
            is_search_loading: observable,
            is_withdraw: observable,
            is_try_withdraw_successful: observable,
            is_withdraw_successful: observable,
            confirm: observable,
            receipt: observable,
            selected_bank: observable,
            supported_banks: observable,
            verification: observable,
            active_tab_index: observable,
            all_payment_agent_list: observable,
            search_term: observable,
            has_payment_agent_search_warning: observable,
            setActiveTabIndex: action.bound,
            setActiveTab: action.bound,
            is_payment_agent_visible: computed,
            getPaymentAgentList: action.bound,
            getPaymentAgentDetails: action.bound,
            addSupportedBank: action.bound,
            clearSuppertedBanks: action.bound,
            sortSupportedBanks: action.bound,
            setList: action.bound,
            clearList: action.bound,
            setPaymentAgentList: action.bound,
            filterPaymentAgentList: action.bound,
            setSearchTerm: action.bound,
            setIsSearchLoading: action.bound,
            setPaymentAgentSearchWarning: action.bound,
            onChangePaymentMethod: action.bound,
            setIsWithdraw: action.bound,
            setIsTryWithdrawSuccessful: action.bound,
            setIsWithdrawSuccessful: action.bound,
            setConfirmation: action.bound,
            setReceipt: action.bound,
            addPaymentAgent: action.bound,
            onMountPaymentAgentWithdraw: action.bound,
            requestTryPaymentAgentWithdraw: action.bound,
            resetPaymentAgent: action.bound,
            onMountPaymentAgentList: action.bound,
            setAllPaymentAgentList: action.bound,
            is_payment_agent_visible_in_onboarding: computed,
            requestPaymentAgentWithdraw: action.bound,
        });

        this.verification = new VerificationStore(WS, root_store);
    }

    list = [];
    agents = [];
    container = Constants.containers.payment_agent;
    error = new ErrorStore();
    filtered_list = [];
    is_name_selected = true;
    is_search_loading = false;
    is_withdraw = false;
    is_try_withdraw_successful = false;
    is_withdraw_successful = false;
    confirm = {};
    receipt: TPaymentAgentWithdrawReceipt = {};
    selected_bank: number | string = 0;
    supported_banks: IObservableArray<TSupportedBank> | [] = [];
    verification = new VerificationStore(this.WS, this.root_store);
    active_tab_index = 0;
    all_payment_agent_list: TExtendedPaymentAgentListResponse | null = [];
    search_term = '';
    has_payment_agent_search_warning = false;
    onRemount: VoidFunction | null = null;

    setOnRemount(func: VoidFunction): void {
        this.onRemount = func;
    }

    setActiveTabIndex(index: number): void {
        this.active_tab_index = index;
    }

    setActiveTab(index: number): void {
        this.setActiveTabIndex(index);

        if (index === 1) {
            this.verification.sendVerificationEmail();
        }
    }

    get is_payment_agent_visible(): boolean {
        return !!(this.filtered_list.length || this.agents.length || this.has_payment_agent_search_warning);
    }

    async getPaymentAgentList(): Promise<TExtendedPaymentAgentListResponse> {
        // wait for get_settings so residence gets populated in client-store
        // TODO: set residence in client-store from authorize so it's faster
        await this.WS.wait('get_settings');
        const { residence, currency } = this.root_store.client;
        return this.WS.authorized.paymentAgentList(residence, currency);
    }

    async getPaymentAgentDetails(): Promise<PaymentAgentDetailsResponse['paymentagent_details']> {
        const { paymentagent_details } = await this.WS.authorized.paymentAgentDetails();
        return paymentagent_details;
    }

    addSupportedBank(bank: string): void {
        const supported_bank_exists = this.supported_banks.find(
            supported_bank => supported_bank.value === bank.toLowerCase()
        );
        if (!supported_bank_exists) {
            (this.supported_banks as IObservableArray<TSupportedBank>).push({ text: bank, value: bank.toLowerCase() });
        }
    }

    clearSupportedBanks(): void {
        this.supported_banks = [];
    }

    sortSupportedBanks(): void {
        // sort supported banks alphabetically by value, the option 'All payment agents' with value 0 should be on top
        (this.supported_banks as IObservableArray<TSupportedBank>).replace(
            this.supported_banks.slice().sort((a, b) => {
                if (a.value < b.value) {
                    return -1;
                }
                if (a.value > b.value) {
                    return 1;
                }
                return 0;
            })
        );
    }

    setList(pa_list: TPartialPaymentAgentList): void {
        (this.list as IObservableArray<TPartialPaymentAgentList>).push(pa_list);
    }

    clearList(): void {
        this.list = [];
    }

    async setPaymentAgentList(): Promise<void> {
        const { setLoading } = this.root_store.modules.cashier.general_store;
        const payment_agent_list = await this.getPaymentAgentList();
        this.clearList();
        this.clearSupportedBanks();
        try {
            payment_agent_list.paymentagent_list?.list.forEach(payment_agent => {
                this.setList({
                    currency: payment_agent.currencies,
                    deposit_commission: payment_agent.deposit_commission,
                    email: payment_agent.email,
                    further_information: payment_agent.further_information,
                    max_withdrawal: payment_agent.max_withdrawal,
                    min_withdrawal: payment_agent.min_withdrawal,
                    name: payment_agent.name,
                    paymentagent_loginid: payment_agent.paymentagent_loginid,
                    phone_numbers: payment_agent?.phone_numbers,
                    supported_banks: payment_agent?.supported_payment_methods,
                    urls: payment_agent?.urls,
                    withdrawal_commission: payment_agent.withdrawal_commission,
                });
                const supported_banks_array = payment_agent?.supported_payment_methods.map(bank => bank.payment_method);
                supported_banks_array.forEach(bank => bank && this.addSupportedBank(bank));
            });
            shuffleArray(this.list);
        } catch (e) {
            setLoading(false);
            // eslint-disable-next-line no-console
            console.error(e);
        }

        this.sortSupportedBanks();
    }

    filterPaymentAgentList(bank?: number | string): void {
        this.setPaymentAgentSearchWarning(false);
        const { common } = this.root_store;

        this.filtered_list = [];

        if (bank || this.selected_bank) {
            this.list.forEach(payment_agent => {
                const supported_banks = payment_agent?.supported_banks;
                if (supported_banks) {
                    const bank_index = supported_banks
                        .map(x => x.payment_method.toLowerCase())
                        .indexOf((bank || this.selected_bank) as string);
                    if (bank_index !== -1)
                        (this.filtered_list as IObservableArray<TPartialPaymentAgentList>).push(payment_agent);
                }
            });
        } else {
            this.filtered_list = this.list;
        }
        if (this.search_term) {
            this.filtered_list = this.filtered_list.filter(payment_agent => {
                return payment_agent.name?.toLocaleLowerCase().includes(this.search_term.toLocaleLowerCase());
            }) as IObservableArray<TPartialPaymentAgentList>;

            if (this.filtered_list.length === 0) {
                this.setPaymentAgentSearchWarning(true);
            }
        }

        this.setIsSearchLoading(false);

        if (!this.is_payment_agent_visible && window.location.pathname.endsWith(routes.cashier_pa)) {
            common.routeTo(routes.cashier_deposit);
        }
    }

    setSearchTerm(search_term: string): void {
        this.search_term = search_term;
    }

    setIsSearchLoading(value: boolean): void {
        this.is_search_loading = value;
    }

    setPaymentAgentSearchWarning(value: boolean): void {
        this.has_payment_agent_search_warning = value;
    }

    onChangePaymentMethod({ target }: TTarget): void {
        const value = target.value === '0' ? parseInt(target.value) : target.value;
        this.selected_bank = value;
        this.filterPaymentAgentList(value);
    }

    setIsWithdraw(is_withdraw = !this.is_withdraw): void {
        this.is_withdraw = is_withdraw;
    }

    setIsTryWithdrawSuccessful(is_try_withdraw_successful: boolean): void {
        this.error.setErrorMessage({ code: '', message: '' });
        this.is_try_withdraw_successful = is_try_withdraw_successful;
    }

    setIsWithdrawSuccessful(is_withdraw_successful: boolean): void {
        this.is_withdraw_successful = is_withdraw_successful;
    }

    setConfirmation({ amount, currency, loginid, payment_agent_name }: TPaymentAgentWithdrawConfirm): void {
        this.confirm = {
            amount,
            currency,
            loginid,
            payment_agent_name,
        };
    }

    setReceipt({
        amount_transferred,
        payment_agent_email,
        payment_agent_id,
        payment_agent_name,
        payment_agent_phone,
        payment_agent_url,
    }: TPaymentAgentWithdrawReceipt): void {
        this.receipt = {
            amount_transferred,
            payment_agent_email,
            payment_agent_id,
            payment_agent_name,
            payment_agent_phone,
            payment_agent_url,
        };
    }

    addPaymentAgent(payment_agent: TExtendedPaymentAgentList[0]): void {
        (this.agents as IObservableArray<TAgent>).push({
            text: payment_agent.name,
            value: payment_agent.paymentagent_loginid,
            max_withdrawal: payment_agent.max_withdrawal,
            min_withdrawal: payment_agent.min_withdrawal,
            email: payment_agent.email,
            phone_numbers: payment_agent.phone_numbers,
            url: payment_agent.urls,
        });
    }

    async onMountPaymentAgentWithdraw(): Promise<void> {
        const { common, modules } = this.root_store;
        const { setLoading, onMountCommon } = modules.cashier.general_store;

        setLoading(true);
        this.setOnRemount(this.onMountPaymentAgentWithdraw);
        onMountCommon();

        this.setIsWithdraw(true);
        this.setIsWithdrawSuccessful(false);
        this.setReceipt({});

        if (!this.agents.length) {
            const payment_agent_list = await this.getPaymentAgentList();
            payment_agent_list.paymentagent_list?.list.forEach(payment_agent => {
                this.addPaymentAgent(payment_agent);
            });
            if (
                !payment_agent_list.paymentagent_list?.list.length &&
                window.location.pathname.endsWith(routes.cashier_pa)
            ) {
                common.routeTo(routes.cashier_deposit);
            }
        }
        setLoading(false);
    }

    async requestTryPaymentAgentWithdraw({
        paymentagent_loginid,
        currency,
        amount,
        verification_code,
    }: PaymentAgentWithdrawRequest): Promise<void> {
        this.error.setErrorMessage({ code: '', message: '' });
        const payment_agent_withdraw = await this.WS.authorized.paymentAgentWithdraw({
            loginid: paymentagent_loginid,
            currency,
            amount,
            verification_code,
            dry_run: 1,
            paymentagent_withdraw: 1,
        });

        if (Number(payment_agent_withdraw?.paymentagent_withdraw) === 2) {
            const selected_agent = this.agents.find(agent => agent.value === paymentagent_loginid);
            this.setConfirmation({
                amount,
                currency,
                loginid: paymentagent_loginid,
                payment_agent_name: selected_agent?.text || payment_agent_withdraw.paymentagent_name,
            });
            this.setIsTryWithdrawSuccessful(true);
        } else {
            this.error.setErrorMessage(payment_agent_withdraw.error as TServerError, this.resetPaymentAgent);
        }
    }

    resetPaymentAgent = (): void => {
        this.error.setErrorMessage({ code: '', message: '' });
        this.setIsWithdraw(false);
        this.setIsWithdrawSuccessful(false);
        this.setIsTryWithdrawSuccessful(false);
        this.verification.clearVerification();
        this.setActiveTabIndex(0);
    };

    async onMountPaymentAgentList(): Promise<void> {
        const { setLoading, onMountCommon } = this.root_store.modules.cashier.general_store;

        setLoading(true);
        this.setOnRemount(this.onMountPaymentAgentList);
        await onMountCommon();
        await this.getPaymentAgentList();

        setLoading(false);
    }

    async getAllPaymentAgentList(): Promise<TExtendedPaymentAgentListResponse> {
        await this.WS.wait('get_settings');
        return this.WS.allPaymentAgentList(this.root_store.client.residence);
    }

    setAllPaymentAgentList(list: TExtendedPaymentAgentListResponse): void {
        this.all_payment_agent_list = list;
    }

    get is_payment_agent_visible_in_onboarding(): boolean {
        return !!this.all_payment_agent_list?.paymentagent_list?.list?.length;
    }

    async requestPaymentAgentWithdraw({
        paymentagent_loginid,
        currency,
        amount,
        verification_code,
    }: PaymentAgentWithdrawRequest): Promise<void> {
        this.error.setErrorMessage({ code: '', message: '' });
        const payment_agent_withdraw = await this.WS.authorized.paymentAgentWithdraw({
            loginid: paymentagent_loginid,
            currency,
            amount,
            verification_code,
            paymentagent_withdraw: 1,
        });
        if (Number(payment_agent_withdraw?.paymentagent_withdraw) === 1) {
            const selected_agent = this.agents.find(agent => agent.value === paymentagent_loginid);
            this.setReceipt({
                amount_transferred: formatMoney(currency, amount, true),
                ...(selected_agent && {
                    payment_agent_email: selected_agent.email,
                    payment_agent_id: selected_agent.value,
                    payment_agent_name: selected_agent.text,
                    payment_agent_phone: selected_agent.phone_numbers,
                    payment_agent_url: selected_agent.url,
                }),
            });
            this.setIsWithdrawSuccessful(true);
            this.setIsTryWithdrawSuccessful(false);
            this.setConfirmation({});
        } else {
            this.error.setErrorMessage(payment_agent_withdraw.error as TServerError, this.resetPaymentAgent);
        }
    }
}

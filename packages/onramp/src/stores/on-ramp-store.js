import { action, computed, observable, reaction } from 'mobx';
import { localize } from '@deriv/translations';
import { getKebabCase, isCryptocurrency, routes, websiteUrl } from '@deriv/shared';
import OnrampProviders from 'Config/on-ramp-providers';
import BaseStore from '../base-store';

export default class OnRampStore extends BaseStore {
    @observable api_error = null;
    @observable deposit_address = null;
    @observable is_deposit_address_loading = true;
    @observable is_deposit_address_popover_open = false;
    @observable is_onramp_modal_open = false;
    @observable is_requesting_widget_html = false;
    @observable.shallow onramp_providers = [];
    @observable.ref selected_provider = null;
    @observable should_show_widget = false;
    @observable widget_error = null;
    @observable widget_html = null;

    deposit_address_ref = null;

    constructor({ WS, root_store }) {
        super({ root_store });
        this.WS = WS;

        this.onClientInit(async () => {
            this.setOnrampProviders([
                OnrampProviders.createChangellyProvider(this),
                OnrampProviders.createWyreProvider(this),
                OnrampProviders.createXanPoolProvider(this),
                OnrampProviders.createBanxaProvider(this),
            ]);
        });
    }

    @computed
    get is_onramp_tab_visible() {
        const { client } = this.root_store;

        return (
            client.is_virtual === false &&
            isCryptocurrency(client.currency) &&
            this.filtered_onramp_providers.length > 0
        );
    }

    @computed
    get filtered_onramp_providers() {
        const { client } = this.root_store;

        return (
            this.onramp_providers
                // Ensure provider supports this user's account currency.
                .filter(provider => {
                    const to_currencies = provider.getToCurrencies();
                    return to_currencies.includes('*') || to_currencies.includes(client.currency.toLowerCase());
                })
                // Ensure provider supports this user's residency.
                .filter(provider => {
                    const allowed_residencies = provider.getAllowedResidencies();
                    return allowed_residencies.includes('*') || allowed_residencies.includes(client.residence);
                })
        );
    }

    @computed
    get onramp_popup_modal_title() {
        if (this.should_show_widget) {
            return localize('Payment channel');
        } else if (this.selected_provider) {
            if (this.should_show_dialog) {
                return this.api_error
                    ? localize('Our server cannot retrieve an address.')
                    : localize("You don't have a crypto address yet.");
            }
            return ' '; // Empty string to render header + close icon.
        }
        return undefined;
    }

    @computed
    get should_show_dialog() {
        return this.api_error || !this.deposit_address;
    }

    @action.bound
    onMountOnramp() {
        this.disposeThirdPartyJsReaction = reaction(
            () => this.selected_provider,
            async provider => {
                if (!provider) {
                    return;
                }

                const dependencies = provider.getScriptDependencies();
                if (dependencies.length === 0) {
                    return;
                }

                const { default: loadjs } = await import(/* webpackChunkName: "loadjs" */ 'loadjs');
                const script_name = `${getKebabCase(provider.name)}-onramp`;

                if (!loadjs.isDefined(script_name)) {
                    loadjs(dependencies, script_name, {
                        error: () => {
                            // eslint-disable-next-line no-console
                            console.warn(`Dependencies for onramp provider ${provider.name} could not be loaded.`);
                            this.setSelectedProvider(null);
                        },
                    });
                }
            }
        );

        // When "should_show_widget", attempt to fetch "selected_provider"'s "widget_html".
        this.disposeGetWidgetHtmlReaction = reaction(
            () => this.should_show_widget,
            should_show_widget => {
                if (should_show_widget) {
                    if (this.is_requesting_widget_html) {
                        return;
                    }

                    this.setIsRequestingWidgetHtml(true);
                    this.selected_provider
                        .getWidgetHtml()
                        .then(widget_html => {
                            if (widget_html) {
                                // Regular providers (iframe/JS embed)
                                this.setWidgetHtml(widget_html);
                            } else {
                                // An empty resolve (widget_html) identifies a redirect.
                                this.setShouldShowWidget(false);
                            }
                        })
                        .catch(error => {
                            this.setWidgetError(error);
                        })
                        .finally(() => this.setIsRequestingWidgetHtml(false));
                }
            }
        );
    }

    @action.bound
    onUnmountOnramp() {
        if (typeof this.disposeThirdPartyJsReaction === 'function') {
            this.disposeThirdPartyJsReaction();
        }
        if (typeof this.disposeGetWidgetHtmlReaction === 'function') {
            this.disposeGetWidgetHtmlReaction();
        }
    }

    @action.bound
    onClickCopyDepositAddress() {
        const range = document.createRange();
        range.selectNodeContents(this.deposit_address_ref);

        const selections = window.getSelection();
        selections.removeAllRanges();
        selections.addRange(range);

        navigator.clipboard.writeText(this.deposit_address).then(() => {
            this.setIsDepositAddressPopoverOpen(true);
            setTimeout(() => this.setIsDepositAddressPopoverOpen(false), 500);
        });
    }

    @action.bound
    onClickDisclaimerContinue() {
        this.setShouldShowWidget(true);
    }

    @action.bound
    onClickGoToDepositPage() {
        this.pollApiForDepositAddress(false);
        window.open(websiteUrl() + routes.cashier_deposit.substring(1));
    }

    @action.bound
    pollApiForDepositAddress(should_allow_empty_address) {
        // should_allow_empty_address: API returns empty deposit address for legacy accounts
        // that have never generated a deposit address. Setting this to "true" will allow
        // the user to be redirected to the Deposit page (where an address will be generated).
        // Setting this to "false" will start polling the API for this deposit address.

        this.setIsDepositAddressLoading(true);
        this.setApiError(null);

        const deposit_address_interval = setInterval(() => getDepositAddressFromApi, 3000);
        const getDepositAddressFromApi = () => {
            this.root_store.modules.cashier.WS.authorized
                .cashier('deposit', { provider: 'crypto', type: 'api' })
                .then(response => {
                    let should_clear_interval = false;

                    if (response.error) {
                        this.setApiError(response.error);
                        should_clear_interval = true;
                    } else {
                        const { address } = response.cashier.deposit;

                        if (address || should_allow_empty_address) {
                            this.setDepositAddress(address);
                            should_clear_interval = true;
                        }
                    }

                    if (should_clear_interval) {
                        clearInterval(deposit_address_interval);
                        this.setIsDepositAddressLoading(false);
                    }
                });
        };

        getDepositAddressFromApi();
        setTimeout(() => {
            clearInterval(deposit_address_interval);
            this.setIsDepositAddressLoading(false);
        }, 30000);
    }

    @action.bound
    resetPopup() {
        this.setApiError(null);
        this.setDepositAddress(null);
        this.setDepositAddressRef(null);
        this.setIsDepositAddressLoading(true);
        this.setSelectedProvider(null);
        this.setShouldShowWidget(false);
        this.setWidgetError(null);
        this.setWidgetHtml(null);
    }

    @action.bound
    setApiError(api_error) {
        this.api_error = api_error;
    }

    @action.bound
    setCopyIconRef(ref) {
        this.copy_icon_ref = ref;
    }

    @action.bound
    setDepositAddress(deposit_address) {
        this.deposit_address = deposit_address;
    }

    @action.bound
    setDepositAddressRef(ref) {
        this.deposit_address_ref = ref;
    }

    @action.bound
    setIsDepositAddressLoading(is_loading) {
        this.is_deposit_address_loading = is_loading;
    }

    @action.bound
    setIsDepositAddressPopoverOpen(is_open) {
        this.is_deposit_address_popover_open = is_open;
    }

    @action.bound
    setIsOnRampModalOpen(is_open) {
        this.is_onramp_modal_open = is_open;
    }

    @action.bound
    setIsRequestingWidgetHtml(is_requesting_widget_html) {
        this.is_requesting_widget_html = is_requesting_widget_html;
    }

    @action.bound
    setSelectedProvider(provider) {
        if (provider) {
            this.selected_provider = provider;
            this.setIsOnRampModalOpen(true);
            this.pollApiForDepositAddress(true);
        } else {
            this.setIsOnRampModalOpen(false);
            this.selected_provider = null;
        }
    }

    @action.bound
    setShouldShowWidget(should_show) {
        this.should_show_widget = should_show;
    }

    @action.bound
    setOnrampProviders(onramp_providers) {
        this.onramp_providers = onramp_providers.slice();
    }

    @action.bound
    setWidgetError(widget_error) {
        this.widget_error = widget_error;
    }

    @action.bound
    setWidgetHtml(widget_html) {
        this.widget_html = widget_html;
    }
}

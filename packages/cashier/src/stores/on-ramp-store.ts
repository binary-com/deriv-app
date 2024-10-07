import { action, computed, observable, reaction, makeObservable, IReactionDisposer } from 'mobx';
import { localize } from '@deriv/translations';
import { getKebabCase, isCryptocurrency, routes, websiteUrl } from '@deriv/shared';
import createBanxaProvider from '../pages/on-ramp/on-ramp-providers';
import BaseStore from './base-store';
import type { TWebSocket, TRootStore, TOnRampProvider, TServerError } from '../types';

export default class OnRampStore extends BaseStore {
    constructor(
        public WS: TWebSocket,
        public root_store: TRootStore
    ) {
        super({ root_store });

        makeObservable(this, {
            api_error: observable,
            deposit_address: observable,
            is_deposit_address_loading: observable,
            is_onramp_modal_open: observable,
            is_requesting_widget_html: observable,
            onramp_providers: observable.shallow,
            selected_provider: observable.ref,
            should_show_widget: observable,
            widget_error: observable,
            widget_html: observable,
            is_onramp_tab_visible: computed,
            filtered_onramp_providers: computed,
            onramp_popup_modal_title: computed,
            should_show_dialog: computed,
            onMountOnramp: action.bound,
            onUnmountOnramp: action.bound,
            onClickDisclaimerContinue: action.bound,
            onClickGoToDepositPage: action.bound,
            pollApiForDepositAddress: action.bound,
            resetPopup: action.bound,
            setApiError: action.bound,
            setDepositAddress: action.bound,
            setIsDepositAddressLoading: action.bound,
            setIsOnRampModalOpen: action.bound,
            setIsRequestingWidgetHtml: action.bound,
            setSelectedProvider: action.bound,
            setShouldShowWidget: action.bound,
            setOnrampProviders: action.bound,
            setWidgetError: action.bound,
            setWidgetHtml: action.bound,
        });

        this.WS = WS;

        this.onClientInit(async () => {
            this.setOnrampProviders([createBanxaProvider(this)]);
        });
    }

    /** @deprecated Use `useDepositCryptoAddress` from `@deriv/hooks` package instead. */
    api_error: TServerError | null = null;
    /** @deprecated Use `useDepositCryptoAddress` from `@deriv/hooks` package instead. */
    deposit_address: string | null = null;
    disposeGetWidgetHtmlReaction: IReactionDisposer | null = null;
    disposeThirdPartyJsReaction: IReactionDisposer | null = null;
    /** @deprecated Use `useDepositCryptoAddress` from `@deriv/hooks` package instead. */
    is_deposit_address_loading = true;
    is_onramp_modal_open = false;
    is_requesting_widget_html = false;
    onramp_providers: TOnRampProvider[] = [];
    selected_provider: TOnRampProvider | null = null;
    should_show_widget = false;
    widget_error: string | null = null;
    widget_html: string | null = null;

    /** @deprecated Use `useOnrampVisible` from `@deriv/hooks` package instead. */
    get is_onramp_tab_visible() {
        const { client } = this.root_store;

        return !client.is_virtual && isCryptocurrency(client.currency) && this.filtered_onramp_providers.length > 0;
    }

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

    get onramp_popup_modal_title() {
        if (this.should_show_widget) {
            return localize('Payment channel');
        } else if (this.selected_provider) {
            if (this.should_show_dialog) {
                return localize('Our server cannot retrieve an address.');
            }
            return ' '; // Empty string to render header + close icon.
        }
        return undefined;
    }

    get should_show_dialog() {
        return !!this.api_error;
    }

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
                        error: async () => {
                            // eslint-disable-next-line no-console
                            console.warn(`Dependencies for onramp provider ${provider.name} could not be loaded.`);
                            await this.setSelectedProvider(null);
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
                        ?.getWidgetHtml()
                        .then(widget_html => {
                            if (widget_html) {
                                // Regular providers (iframe/JS embed)
                                this.setWidgetHtml(widget_html as string);
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

    onUnmountOnramp() {
        if (typeof this.disposeThirdPartyJsReaction === 'function') {
            this.disposeThirdPartyJsReaction();
        }
        if (typeof this.disposeGetWidgetHtmlReaction === 'function') {
            this.disposeGetWidgetHtmlReaction();
        }
    }

    onClickDisclaimerContinue() {
        this.setShouldShowWidget(true);
    }

    async onClickGoToDepositPage() {
        await this.pollApiForDepositAddress(false);
        window.open(websiteUrl() + routes.cashier_deposit.substring(1));
    }

    /** @deprecated Use `useDepositCryptoAddress` from `@deriv/hooks` package instead. */
    async pollApiForDepositAddress(should_allow_empty_address: boolean) {
        // should_allow_empty_address: API returns empty deposit address for legacy accounts
        // that have never generated a deposit address. Setting this to "true" will allow
        // the user to be redirected to the Deposit page (where an address will be generated).
        // Setting this to "false" will start polling the API for this deposit address.

        this.setIsDepositAddressLoading(true);
        this.setApiError(null);

        const deposit_address_interval = setInterval(() => getDepositAddressFromApi, 3000);
        const getDepositAddressFromApi = async () => {
            await this.WS.authorized.cashier('deposit', { provider: 'crypto', type: 'api' }).then(response => {
                let should_clear_interval = false;

                if (response.error) {
                    this.setApiError(response.error);
                    should_clear_interval = true;
                } else if (typeof response.cashier !== 'string' && response.cashier?.deposit) {
                    const address = response.cashier?.deposit.address;

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

        await getDepositAddressFromApi();
        setTimeout(() => {
            clearInterval(deposit_address_interval);
            this.setIsDepositAddressLoading(false);
        }, 30000);
    }

    async resetPopup() {
        this.setApiError(null);
        this.setDepositAddress(null);
        this.setIsDepositAddressLoading(true);
        await this.setSelectedProvider(null);
        this.setShouldShowWidget(false);
        this.setWidgetError(null);
        this.setWidgetHtml(null);
    }

    /** @deprecated Use `useDepositCryptoAddress` from `@deriv/hooks` package instead. */
    setApiError(api_error: TServerError | null) {
        this.api_error = api_error;
    }

    /** @deprecated Use `useDepositCryptoAddress` from `@deriv/hooks` package instead. */
    setDepositAddress(deposit_address: string | null) {
        this.deposit_address = deposit_address;
    }

    /** @deprecated Use `useDepositCryptoAddress` from `@deriv/hooks` package instead. */
    setIsDepositAddressLoading(is_loading: boolean) {
        this.is_deposit_address_loading = is_loading;
    }

    setIsOnRampModalOpen(is_open: boolean) {
        this.is_onramp_modal_open = is_open;
    }

    setIsRequestingWidgetHtml(is_requesting_widget_html: boolean) {
        this.is_requesting_widget_html = is_requesting_widget_html;
    }

    async setSelectedProvider(provider?: TOnRampProvider | null) {
        if (provider) {
            this.selected_provider = provider;
            this.setIsOnRampModalOpen(true);
            await this.pollApiForDepositAddress(true);
        } else {
            this.setIsOnRampModalOpen(false);
            this.selected_provider = null;
        }
    }

    setShouldShowWidget(should_show: boolean) {
        this.should_show_widget = should_show;
    }

    setOnrampProviders(onramp_providers: TOnRampProvider[]): void {
        this.onramp_providers = onramp_providers.slice();
    }

    setWidgetError(widget_error: string | null) {
        this.widget_error = widget_error;
    }

    setWidgetHtml(widget_html: string | null) {
        this.widget_html = widget_html;
    }
}

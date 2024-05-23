import { action, makeObservable, reaction, when } from 'mobx';
import { TApiHelpersStore, TDbotStore } from 'src/types/stores.types';
import { ApiHelpers, DBot, runIrreversibleEvents } from '@deriv/bot-skeleton';
import { ContentFlag, isEuResidenceWithOnlyVRTC, routes, showDigitalOptionsUnavailableError } from '@deriv/shared';
import { TStores } from '@deriv/stores/types';
import { localize } from '@deriv/translations';
import RootStore from './root-store';

const Blockly = window.Blockly;
export default class AppStore {
    root_store: RootStore;
    core: TStores;
    dbot_store: TDbotStore | null;
    api_helpers_store: TApiHelpersStore | null;
    timer: ReturnType<typeof setInterval> | null;
    disposeReloadOnLanguageChangeReaction: unknown;
    disposeCurrencyReaction: unknown;
    disposeSwitchAccountListener: unknown;
    disposeLandingCompanyChangeReaction: unknown;
    disposeResidenceChangeReaction: unknown;

    constructor(root_store: RootStore, core: TStores) {
        makeObservable(this, {
            onMount: action,
            onUnmount: action,
            onBeforeUnload: action,
            registerReloadOnLanguageChange: action,
            registerCurrencyReaction: action,
            registerOnAccountSwitch: action,
            registerLandingCompanyChangeReaction: action,
            registerResidenceChangeReaction: action,
            setDBotEngineStores: action,
            onClickOutsideBlockly: action,
            showDigitalOptionsMaltainvestError: action,
        });

        this.root_store = root_store;
        this.core = core;
        this.dbot_store = null;
        this.api_helpers_store = null;
        this.timer = null;
    }

    getErrorForNonEuClients = () => ({
        text: localize(
            'Unfortunately, this trading platform is not available for EU Deriv account. Please switch to a non-EU account to continue trading.'
        ),
        title: localize('Deriv Bot is unavailable for this account'),
        link: localize('Switch to another account'),
    });

    getErrorForEuClients = (is_logged_in = false) => {
        return {
            text: ' ',
            title: is_logged_in
                ? localize('Deriv Bot is not available for EU clients')
                : localize('Deriv Bot is unavailable in the EU'),
            link: is_logged_in ? localize("Back to Trader's Hub") : '',
            route: routes.traders_hub,
        };
    };

    handleErrorForEu = (show_default_error = false) => {
        const { client, common, ui, traders_hub } = this.core;
        const toggleAccountsDialog = ui?.toggleAccountsDialog;

        if (!client?.is_logged_in && client?.is_eu_country) {
            return showDigitalOptionsUnavailableError(common.showError, this.getErrorForEuClients());
        }

        if (!client.is_landing_company_loaded) {
            return false;
        }

        if (window.location.pathname === routes.bot) {
            if (client.should_show_eu_error) {
                return showDigitalOptionsUnavailableError(
                    common.showError,
                    this.getErrorForEuClients(client.is_logged_in)
                );
            }

            if (traders_hub.content_flag === ContentFlag.HIGH_RISK_CR) {
                return false;
            }

            if (traders_hub.content_flag === ContentFlag.LOW_RISK_CR_EU && toggleAccountsDialog) {
                return showDigitalOptionsUnavailableError(
                    common.showError,
                    this.getErrorForNonEuClients(),
                    toggleAccountsDialog,
                    false,
                    false
                );
            }

            if (
                ((!client.is_bot_allowed && client.is_eu && client.should_show_eu_error) ||
                    isEuResidenceWithOnlyVRTC(client.active_accounts) ||
                    client.is_options_blocked) &&
                toggleAccountsDialog
            ) {
                return showDigitalOptionsUnavailableError(
                    common.showError,
                    this.getErrorForNonEuClients(),
                    toggleAccountsDialog,
                    false,
                    false
                );
            }
        }

        if (show_default_error && common.has_error) {
            if (common.setError) common.setError(false, { message: '' });
        }
        return false;
    };

    onMount = () => {
        const { blockly_store, run_panel } = this.root_store;
        const { client, ui, traders_hub } = this.core;
        this.showDigitalOptionsMaltainvestError();

        let timer_counter = 1;

        this.timer = setInterval(() => {
            if (window.sendRequestsStatistic) {
                window.sendRequestsStatistic(false);
                performance.clearMeasures();
                if (timer_counter === 6 || run_panel?.is_running) {
                    if (this.timer) clearInterval(this.timer);
                } else {
                    timer_counter++;
                }
            }
        }, 10000);

        blockly_store.setLoading(true);
        DBot.initWorkspace(__webpack_public_path__, this.dbot_store, this.api_helpers_store, ui.is_mobile).then(() => {
            blockly_store.setContainerSize();
            blockly_store.setLoading(false);
        });
        this.registerReloadOnLanguageChange();
        this.registerCurrencyReaction.call(this);
        this.registerOnAccountSwitch.call(this);
        this.registerLandingCompanyChangeReaction.call(this);
        this.registerResidenceChangeReaction.call(this);

        window.addEventListener('click', this.onClickOutsideBlockly);
        window.addEventListener('beforeunload', this.onBeforeUnload);

        blockly_store.getCachedActiveTab();

        when(
            () => client?.should_show_eu_error || client?.is_landing_company_loaded,
            () => this.showDigitalOptionsMaltainvestError()
        );

        reaction(
            () => traders_hub?.content_flag,
            () => this.showDigitalOptionsMaltainvestError()
        );
    };

    onUnmount = () => {
        DBot.terminateBot();
        DBot.terminateConnection();
        if (Blockly.derivWorkspace) {
            clearInterval(Blockly.derivWorkspace.save_workspace_interval);
            Blockly.derivWorkspace.dispose();
        }
        if (typeof this.disposeReloadOnLanguageChangeReaction === 'function') {
            this.disposeReloadOnLanguageChangeReaction();
        }
        if (typeof this.disposeCurrencyReaction === 'function') {
            this.disposeCurrencyReaction();
        }
        if (typeof this.disposeSwitchAccountListener === 'function') {
            this.disposeSwitchAccountListener();
        }
        if (typeof this.disposeLandingCompanyChangeReaction === 'function') {
            this.disposeLandingCompanyChangeReaction();
        }
        if (typeof this.disposeResidenceChangeReaction === 'function') {
            this.disposeResidenceChangeReaction();
        }

        window.removeEventListener('click', this.onClickOutsideBlockly);
        window.removeEventListener('beforeunload', this.onBeforeUnload);

        // Ensure account switch is re-enabled.
        const { ui } = this.core;

        ui.setAccountSwitcherDisabledMessage();
        ui.setPromptHandler(false);

        if (this.timer) clearInterval(this.timer);
        performance.clearMeasures();
    };

    onBeforeUnload = (event: Event) => {
        const { is_stop_button_visible } = this.root_store.run_panel;

        if (is_stop_button_visible) {
            event.returnValue = true;
        }
    };

    registerReloadOnLanguageChange = () => {
        this.disposeReloadOnLanguageChangeReaction = reaction(
            () => this.core.common.current_language,
            () => {
                // temporarily added this to refresh just dbot in case of changing language,
                // otherwise it should change language without refresh.
                const { pathname } = window.location;
                const is_bot =
                    /^\/bot/.test(pathname) || (/^\/(br_)/.test(pathname) && pathname.split('/')[2] === 'bot');
                if (is_bot) window.location.reload();
            }
        );
    };

    registerCurrencyReaction = () => {
        // Syncs all trade options blocks' currency with the client's active currency.
        this.disposeCurrencyReaction = reaction(
            () => this.core.client.currency,
            currency => {
                if (!Blockly.derivWorkspace) return;

                const trade_options_blocks = Blockly.derivWorkspace
                    .getAllBlocks()
                    .filter(
                        b =>
                            b.type === 'trade_definition_tradeoptions' ||
                            b.type === 'trade_definition_multiplier' ||
                            (b.isDescendantOf('trade_definition_multiplier') && b.category_ === 'trade_parameters')
                    );

                trade_options_blocks.forEach(trade_options_block => trade_options_block.setCurrency(currency));
            }
        );
    };

    registerOnAccountSwitch = () => {
        const { client } = this.core;

        this.disposeSwitchAccountListener = reaction(
            () => client.switch_broadcast,
            switch_broadcast => {
                if (!switch_broadcast) return;
                this.showDigitalOptionsMaltainvestError();

                if (ApiHelpers.instance) {
                    const { active_symbols, contracts_for } = ApiHelpers.instance;

                    if (Blockly.derivWorkspace) {
                        active_symbols.retrieveActiveSymbols(true).then(() => {
                            contracts_for.disposeCache();
                            Blockly.derivWorkspace
                                .getAllBlocks()
                                .filter(block => block.type === 'trade_definition_market')
                                .forEach(block => {
                                    runIrreversibleEvents(() => {
                                        const fake_create_event = new Blockly.Events.Create(block);
                                        Blockly.Events.fire(fake_create_event);
                                    });
                                });
                        });
                    }
                    DBot.initializeInterpreter();
                }
            }
        );
    };

    registerLandingCompanyChangeReaction = () => {
        const { client } = this.core;

        this.disposeLandingCompanyChangeReaction = reaction(
            () => client.landing_company_shortcode,
            () => this.handleErrorForEu()
        );
    };

    registerResidenceChangeReaction = () => {
        const { client } = this.core;

        this.disposeResidenceChangeReaction = reaction(
            () => client.account_settings.country_code,
            () => this.handleErrorForEu()
        );
    };

    setDBotEngineStores = () => {
        // DO NOT pass the rootstore in, if you need a prop define it in dbot-skeleton-store and pass it through.
        const { flyout, toolbar, save_modal, dashboard, load_modal, run_panel, blockly_store, summary_card } =
            this.root_store;
        const { client } = this.core;
        const { handleFileChange } = load_modal;
        const { setLoading } = blockly_store;
        const { setContractUpdateConfig } = summary_card;
        const {
            ui: { is_mobile },
        } = this.core;

        this.dbot_store = {
            client,
            flyout,
            toolbar,
            save_modal,
            dashboard,
            load_modal,
            run_panel,
            setLoading,
            setContractUpdateConfig,
            handleFileChange,
            is_mobile,
        };

        this.api_helpers_store = {
            server_time: this.core.common.server_time,
            ws: this.root_store.ws,
        };
    };

    onClickOutsideBlockly = (event: Event) => {
        if (document.querySelector('.injectionDiv')) {
            const path = event.path || (event.composedPath && event.composedPath());
            const is_click_outside_blockly = !path.some(
                (el: Element) => el.classList && el.classList.contains('injectionDiv')
            );

            if (is_click_outside_blockly) {
                Blockly?.hideChaff(/* allowToolbox */ false);
            }
        }
    };

    showDigitalOptionsMaltainvestError = () => {
        this.handleErrorForEu(true);
    };
}

import { flow } from 'mobx';
import { localize } from '@deriv/translations';
import { ClientBase } from '_common/base/client_base';
import { redirectToLogin } from '_common/base/login';
import { LocalStore } from '_common/storage';
import { WS } from 'Services/ws-methods';

export const showUnavailableLocationError = flow(function*(showError) {
    const website_status = yield WS.wait('website_status');
    const residence_list = yield WS.residenceList();

    const clients_country_code = website_status.website_status.clients_country;
    const clients_country_text = (
        residence_list.residence_list.find(obj_country => obj_country.value === clients_country_code) || {}
    ).text;

    showError(
        localize('If you have an account, log in to continue.'),
        clients_country_text
            ? localize('Sorry, this app is unavailable in {{clients_country}}.', {
                  clients_country: clients_country_text,
              })
            : localize('Sorry, this app is unavailable in your current location.'),
        localize('Log in'),
        () => redirectToLogin(ClientBase.isLoggedIn()),
        false
    );
});

export const showDigitalOptionsUnavailableError = showError => {
    showError(
        localize(
            'We’re working to have this available for you soon. If you have another account, switch to that account to continue trading. You may add a DMT5 Financial.'
        ),
        localize('DTrader is not available for this account'),
        localize('Go to DMT5 dashboard'),
        () => (window.location.href = `${location.protocol}//${location.hostname}/mt5`),
        false
    );
};

export const isMarketClosed = (active_symbols = [], symbol) => {
    if (!active_symbols.length) return false;
    return active_symbols.filter(x => x.symbol === symbol)[0]
        ? !active_symbols.filter(symbol_info => symbol_info.symbol === symbol)[0].exchange_is_open
        : false;
};

export const pickDefaultSymbol = (active_symbols = []) => {
    if (!active_symbols.length) return '';
    return getFavoriteOpenSymbol(active_symbols) || getDefaultOpenSymbol(active_symbols);
};

const getFavoriteOpenSymbol = active_symbols => {
    try {
        const chart_favorites = LocalStore.get('cq-favorites');
        if (!chart_favorites) return undefined;
        const client_favorite_markets = JSON.parse(chart_favorites)['chartTitle&Comparison'];

        const client_favorite_list = client_favorite_markets.map(client_fav_symbol =>
            active_symbols.find(symbol_info => symbol_info.symbol === client_fav_symbol)
        );
        if (client_favorite_list) {
            const client_first_open_symbol = client_favorite_list.filter(symbol => symbol).find(isSymbolOpen);
            if (client_first_open_symbol) return client_first_open_symbol.symbol;
        }
        return undefined;
    } catch (error) {
        return undefined;
    }
};

const getDefaultOpenSymbol = active_symbols => {
    const default_open_symbol =
        findSymbol(active_symbols, '1HZ100V') ||
        findFirstSymbol(active_symbols, /random_index/) ||
        findFirstSymbol(active_symbols, /major_pairs/);
    if (default_open_symbol) return default_open_symbol.symbol;
    return active_symbols.find(symbol_info => symbol_info.submarket === 'major_pairs').symbol;
};

const findSymbol = (active_symbols, symbol) =>
    active_symbols.find(symbol_info => symbol_info.symbol === symbol && isSymbolOpen(symbol_info));

const findFirstSymbol = (active_symbols, pattern) =>
    active_symbols.find(symbol_info => pattern.test(symbol_info.submarket) && isSymbolOpen(symbol_info));

const isSymbolOpen = symbol => symbol.exchange_is_open === 1;

export const getSymbolDisplayName = (active_symbols = [], symbol) =>
    (
        active_symbols.find(symbol_info => symbol_info.symbol.toUpperCase() === symbol.toUpperCase()) || {
            display_name: '',
        }
    ).display_name;

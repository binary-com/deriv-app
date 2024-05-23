import { isMobile } from '@deriv/shared';

/**
 * This function checks whether the current item should have a border at the bottom 'aka "divider" '.
 * @function getHasDivider
 * @param { number } current_item_index // the index of the current list item
 * @param { number } list_size // size of the whole list
 * @param { number } available_grid_columns // how many css grid columns the container element has or provides
 * @return { boolean }
 * */
export const getHasDivider = (current_item_index: number, list_size: number, available_grid_columns: number) => {
    if (list_size < available_grid_columns) {
        return false;
    } else if (isMobile()) {
        return current_item_index < list_size - 1;
    }
    return (
        current_item_index <
        list_size -
            (list_size % available_grid_columns === 0 ? available_grid_columns : list_size % available_grid_columns)
    );
};

// TODO: Moved to shared package! Delete it later, right now it uses for cashier wallet modals
// TODO: Refactor using data transformation layer pattern when we will have API for wallets (e.g. wallet.icon)
export const getWalletCurrencyIcon = (currency: string, is_dark_mode_on: boolean, is_modal = false) => {
    switch (currency) {
        case 'demo':
            if (is_modal) return 'IcWalletDerivDemoLight';
            return is_dark_mode_on ? 'IcWalletDerivDemoDark' : 'IcWalletDerivDemoLight';
        case 'USD':
            return 'IcWalletCurrencyUsd';
        case 'EUR':
            return 'IcWalletCurrencyEur';
        case 'AUD':
            return 'IcWalletCurrencyAud';
        case 'GBP':
            return 'IcWalletCurrencyGbp';
        case 'BTC':
            return is_dark_mode_on ? 'IcWalletBitcoinDark' : 'IcWalletBitcoinLight';
        case 'ETH':
            return is_dark_mode_on ? 'IcWalletEtheriumDark' : 'IcWalletEtheriumLight';
        case 'USDT':
        case 'eUSDT':
        case 'tUSDT':
        case 'UST':
            if (is_modal) {
                return is_dark_mode_on ? 'IcWalletModalTetherDark' : 'IcWalletModalTetherLight';
            }
            return is_dark_mode_on ? 'IcWalletTetherDark' : 'IcWalletTetherLight';
        case 'LTC':
            return is_dark_mode_on ? 'IcWalletLiteCoinDark' : 'IcWalletLiteCoinLight';
        case 'USDC':
            return is_dark_mode_on ? 'IcWalletUsdCoinDark' : 'IcWalletUsdCoinLight';
        default:
            return 'Unknown';
    }
};

import { localize } from '@deriv/translations';

const cash_contents = [
    {
        title: localize('Credit/debit cards'),
        icons: [
            { light: 'IcStockVisa', dark: 'IcStockVisaDark' },
            { light: 'IcStockMasterCard', dark: 'IcStockMasterCardDark' },
        ],
    },
    {
        title: localize('Bank wire'),
        icons: [
            { light: 'IcWalletZingpayLight', dark: 'IcWalletZingpayDark' },
            { light: 'IcCashierNganLoungLight', dark: 'IcCashierNganLoungDark' },
            { light: 'IcCashierPayRetailersLight', dark: 'IcCashierPayRetailersDark' },
            { light: 'IcWalletPaytrustLight', dark: 'IcWalletPaytrustDark' },
            { light: 'IcCashierHelpToPayLight', dark: 'IcCashierHelpToPayDark' },
            { light: 'ic-cashier-dragon-phoenix', dark: 'ic-cashier-dragon-phoenix' },
            { light: 'ic-cashier-online-naira-light', dark: 'ic-cashier-online-naira-dark' },
            // { light: 'ic-cashier-directa-light', dark: 'ic-cashier-directa-dark' },
        ],
    },
    {
        title: localize('E-wallets'),
        icons: [
            { light: 'IcWalletSkrillLight', dark: 'IcWalletSkrillDark' },
            { light: 'IcWalletNetellerLight', dark: 'IcWalletNetellerDark' },
            { light: 'IcWalletSticpayLight', dark: 'IcWalletSticpayDark' },
            { light: 'IcCashierAirTmLight', dark: 'IcCashierAirTmDark' },
            { light: 'IcCashierPayLivreLight', dark: 'IcCashierPayLivreDark' },
            { light: 'IcWalletFasapayLight', dark: 'IcWalletFasapayDark' },
            { light: 'IcWalletJetonLight', dark: 'IcWalletJetonDark' },
            { light: 'IcCashierPerfectMoneyLight', dark: 'IcCashierPerfectMoneyDark' },
        ],
    },
];
const crypto_contents = [
    {
        title: localize('Cryptos'),
        icons: [
            { light: 'IcCashierBitcoinLight', dark: 'IcCashierBitcoinDark' },
            { light: 'IcCashierEthereumLight', dark: 'IcCashierEthereumDark' },
            { light: 'IcCashierLiteCoinLight', dark: 'IcCashierLiteCoinDark' },
            { light: 'IcCashierUsdCoinLight', dark: 'IcCashierUsdCoinDark' },
            { light: 'IcCashierTetherLight', dark: 'IcCashierTetherDark' },
        ],
    },
    {
        title: localize('Buy Cryptos'),
        icons: [
            { light: 'IcCashierQrCodeLight', dark: 'IcCashierQrCodeDark', size: 40 },
            { light: 'IcCashierChangellyRowLight', dark: 'IcCashierChangellyRowDark' },
            { light: 'IcCashierXanpoolSmallLight', dark: 'IcCashierXanpoolSmallDark', size: 56 },
            { light: 'IcCashierBanxaSmallLight', dark: 'IcCashierBanxaSmallDark', size: 56 },
        ],
    },
];

const createCashProvider = onClick => {
    return {
        detail_click: onClick,
        detail_description: localize('Deposit via payment methods available in your country.'),
        detail_header: localize('Deposit via bank wire, credit card, and e-wallet'),
        detail_contents: cash_contents,
    };
};

const createCryptoProvider = onClick => {
    return {
        detail_click: onClick,
        detail_description: localize('Deposit in cryptocurrencies or buy from our listed exchanges.'),
        detail_header: localize('Deposit cryptocurrencies'),
        detail_contents: crypto_contents,
    };
};

const createPaymentAgentProvider = onClick => {
    return {
        detail_click: onClick,
        detail_description: localize(
            'Deposit in your local currency via an authorised, independent payment agent in your country.'
        ),
        detail_header: localize('Deposit via Payment Agent'),
    };
};

const createDp2pProvider = onClick => {
    return {
        detail_click: onClick,
        detail_description: localize(
            'Deposit in your local currency via peer-to-peer exchange with fellow traders in your country.'
        ),
        detail_header: localize('Deposit with Deriv P2P'),
    };
};

export default {
    createCashProvider,
    createCryptoProvider,
    createPaymentAgentProvider,
    createDp2pProvider,
};

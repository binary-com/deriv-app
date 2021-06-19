import { localize } from '@deriv/translations';

const createBanxaProvider = store => ({
    icon: { dark: 'IcCashierBanxaDark', light: 'IcCashierBanxaLight' },
    name: 'Banxa',
    getDescription: () =>
        localize(
            'A fast and secure fiat-to-crypto payment service. Deposit cryptocurrencies from anywhere in the world using your credit/debit cards and bank transfers.'
        ),
    getAllowedResidencies: () => ['*'],
    getPaymentIcons: () => [
        { dark: 'IcCashierVisaDark', light: 'IcCashierVisaLight' },
        { dark: 'IcCashierMastercardDark', light: 'IcCashierMastercardLight' },
        { dark: 'IcCashierBpayDark', light: 'IcCashierBpayLight' },
        { dark: 'IcCashierSepaDark', light: 'IcCashierSepaLight' },
        { dark: 'IcCashierBlueshyftDark', light: 'IcCashierBlueshyftLight' },
        { dark: 'IcCashierFlexepinDark', light: 'IcCashierFlexepinLight' },
        { dark: 'IcCashierPayIdDark', light: 'IcCashierPayIdLight' },
        { dark: 'IcCashierPoliDark', light: 'IcCashierPoliLight' },
        { dark: 'IcCashierApplePay', light: 'IcCashierApplePay' },
        { dark: 'IcCashierInteracEtransfer', light: 'IcCashierInteracEtransfer' },
        { dark: 'IcCashierIdeal', light: 'IcCashierIdeal' },
        { dark: 'IcCashierPostBillPayDark', light: 'IcCashierPostBillPayLight' },
        { dark: 'IcCashierSofort', light: 'IcCashierSofort' },
    ],
    getScriptDependencies: () => [], // None.
    getDefaultFromCurrency: () => '',
    getFromCurrencies: () => ['*'],
    getToCurrencies: () => ['*'],
    getWidgetHtml: () => {
        return new Promise((resolve, reject) => {
            store.WS.serviceToken({
                service_token: 1,
                service: 'banxa',
                referrer: window.location.href,
            }).then(response => {
                if (response.error) {
                    reject(response.error.message);
                } else {
                    const { url } = response.service_token.banxa;

                    if (url) {
                        window.open(url);
                    }

                    // Resolving empty will/should redirect user.
                    resolve();
                }
            });
        });
    },
    onMountWidgetContainer: () => {},
    should_show_deposit_address: false,
});

const createChangellyProvider = store => ({
    icon: { dark: 'IcCashierChangellyDark', light: 'IcCashierChangellyLight' },
    name: 'Changelly',
    getDescription: () =>
        localize(
            'Your simple access to crypto. Fast and secure way to exchange and purchase cryptocurrencies. 24/7 live chat support.'
        ),
    getAllowedResidencies: () => ['*'],
    getPaymentIcons: () => [
        { dark: 'IcCashierVisaDark', light: 'IcCashierVisaLight' },
        { dark: 'IcCashierMastercardDark', light: 'IcCashierMastercardLight' },
    ],
    getScriptDependencies: () => [],
    getDefaultFromCurrency: () => 'usd',
    getFromCurrencies: () => ['usd', 'eur', 'gbp'],
    getToCurrencies: () => ['bch', 'btc', 'etc', 'eth', 'ltc', 'ust'],
    getWidgetHtml() {
        return new Promise(resolve => {
            const url = new URL('https://widget.changelly.com/?v=3&theme=default');
            url.searchParams.append('fromDefault', this.getDefaultFromCurrency());
            const currency = store.root_store.client.currency.toLowerCase();
            if (this.getToCurrencies().includes(currency)) {
                const to_currency = currency === 'ust' ? 'usdt' : currency;
                url.searchParams.append('to', to_currency);
                url.searchParams.append('toDefault', to_currency);
            }

            url.searchParams.append('amount', 1);
            url.searchParams.append('merchant_id', 'iiq3jdt2p44yrfbx');
            window.open(url);
            resolve();
        });
    },
    onMountWidgetContainer: () => {},
    should_show_deposit_address: true,
});

const createWyreProvider = store => ({
    icon: { dark: 'IcCashierWyreDark', light: 'IcCashierWyreLight' },
    name: 'Wyre',
    getDescription: () =>
        localize(
            'A secure and compliant bridge between fiat currencies and cryptocurrencies. Supports BTC, ETH, WETH, and DAI. Exchange crypto safely and securely with Wyre.'
        ),
    getAllowedResidencies: () => [
        // https://docs.sendwyre.com/docs/getting-started-wyre-checkout#supported-states-and-countries
        'ar',
        'at',
        'au',
        'be',
        'bo',
        'br',
        'by',
        'ca',
        'ch',
        'cl',
        'co',
        'cr',
        'cy',
        'cz',
        'de',
        'dk',
        'do',
        'dz',
        'ee',
        'es',
        'fi',
        'fr',
        'fr',
        'gb',
        'gr',
        'hk',
        'id',
        'ie',
        'il',
        'in',
        'is',
        'it',
        'jp',
        'kr',
        'lt',
        'lu',
        'lv',
        'mx',
        'my',
        'nl',
        'no',
        'np',
        'nz',
        'pe',
        'ph',
        'pl',
        'pt',
        'py',
        'se',
        'sg',
        'si',
        'sk',
        'th',
        'tr',
        'tz',
        'vn',
        'za',
    ],
    getPaymentIcons: () => [
        { dark: 'IcCashierVisaDark', light: 'IcCashierVisaLight' },
        { dark: 'IcCashierMastercardDark', light: 'IcCashierMastercardLight' },
    ],
    getScriptDependencies: () => [],
    getDefaultFromCurrency: () => 'usd',
    getFromCurrencies: () => ['eur', 'aud', 'usd', 'brl', 'cad', 'gbp', 'mxn'],
    getToCurrencies: () => ['btc', 'eth', 'husd', 'weth', 'usdt', 'usdc', 'busd', 'dai', 'gusd', 'pax'],
    getWidgetHtml: () => {
        return new Promise((resolve, reject) => {
            store.WS.serviceToken({ service_token: 1, service: 'wyre' }).then(response => {
                if (response.error) {
                    reject(response.error.message);
                } else {
                    const { url } = response.service_token.wyre;

                    if (url) {
                        window.open(url);
                    }

                    // Resolving empty will/should redirect user.
                    resolve();
                }
            });
        });
    },
    onMountWidgetContainer: () => {},
    should_show_deposit_address: false,
});

const createXanPoolProvider = store => ({
    icon: { dark: 'IcCashierXanpoolDark', light: 'IcCashierXanpoolLight' },
    name: 'XanPool',
    getDescription: () =>
        localize(
            'Buy cryptocurrencies in an instant. Enjoy easy, quick, and secure exchanges using your local payment methods.'
        ),
    getAllowedResidencies: () => ['*'],
    getPaymentIcons: () => [
        { dark: 'IcCashierFpsDark', light: 'IcCashierFpsLight' },
        { dark: 'IcCashierAliPayDark', light: 'IcCashierAliPayLight' },
        { dark: 'IcCashierGoPayDark', light: 'IcCashierGoPayLight' },
        { dark: 'IcCashierMandiriPay', light: 'IcCashierMandiriPay' },
        { dark: 'IcCashierInstaPayLight', light: 'IcCashierInstaPayDark' },
        { dark: 'IcCashierCebuanaLhuillierDark', light: 'IcCashierCebuanaLhuillierLight' },
        { dark: 'IcCashierPayNowDark', light: 'IcCashierPayNowLight' },
        { dark: 'IcCashierUpiDark', light: 'IcCashierUpiLight' },
        { dark: 'IcCashierPromptPayDark', light: 'IcCashierPromptPayLight' },
        { dark: 'IcCashierViettlePay', light: 'IcCashierViettlePay' },
    ],
    getScriptDependencies: () => [],
    getToCurrencies: () => ['btc', 'eth', 'ust', 'zil', 'nem'],
    getWidgetHtml() {
        return new Promise(resolve => {
            const { currency } = store.root_store.client;

            let url = 'https://checkout.xanpool.com/';

            url += `?apiKey=db4ec638dff9a68abda1ef6b7638c220`;
            url += `&redirectUrl=${window.location.href}`;
            url += `&wallet=${store.deposit_address}`;
            url += `&cryptoCurrency=${currency === 'UST' ? 'USDT' : currency}`;
            url += `&transactionType=buy`;

            window.open(url);
            resolve();
        });
    },
    onMountWidgetContainer: () => {},
    should_show_deposit_address: false,
});

export default {
    createBanxaProvider,
    createChangellyProvider,
    createWyreProvider,
    createXanPoolProvider,
};

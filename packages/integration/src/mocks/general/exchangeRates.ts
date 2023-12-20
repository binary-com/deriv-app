import { Context } from '../../utils/mocks/mocks';

export default function mockExchangeRates(context: Context) {
    if ('exchange_rates' in context.request && context.request.exchange_rates === 1) {
        context.response = {
            echo_req: {
                req_id: context.req_id,
                exchange_rates: 1,
            },
            exchange_rates: {
                base_currency: 'USD',
                date: parseInt((Date.now() / 1000).toFixed(0)),
                rates: {
                    AED: 3.6735,
                    AFN: 89.0052,
                    ALL: 93.575,
                    AMD: 386.25,
                    AOA: 509.3611,
                    ARS: 113.9705,
                    AUD: 1.48029724368653,
                    AWG: 1.79,
                    BAM: 1.7659,
                    BBD: 2,
                    BDT: 108.4525,
                    BHD: 0.377,
                    BMD: 1,
                    BND: 1.3266,
                    BRL: 4.6221,
                    BSD: 1,
                    BTC: 3.41233456575483e-5,
                    BTN: 81.9938,
                    BUSD: 1.000100010001,
                    BWP: 13.587,
                    BZD: 2,
                    CAD: 1.32249,
                    CHF: 0.86227,
                    CLP: 814.6,
                    CNY: 7.142,
                    COP: 3759.31,
                    CRC: 541.275,
                    CUP: 24,
                    CVE: 100.0963,
                    DAI: 1,
                    DJF: 178.0389,
                    DKK: 6.7279,
                    DOP: 55.916,
                    DZD: 134.6946,
                    ECS: 25000,
                    EGP: 30.8974,
                    ERN: 15,
                    ETB: 54.8732,
                    ETH: 0.000537650306863913,
                    EUR: 0.902869318694812,
                    EURS: 0.85247858147564,
                    FJD: 2.2183,
                    FKP: 0.773275595422208,
                    GBP: 0.773305494335537,
                    GEL: 2.568,
                    GHC: 113284.5,
                    GIP: 0.773275595422208,
                    GMD: 62.4125,
                    GNF: 8593.675,
                    GTQ: 7.8508,
                    HKD: 7.8015,
                    HNL: 24.6193,
                    HTG: 138.119,
                    IDK: 15.0325,
                    IDR: 15032.5,
                    ILS: 3.6939,
                    INR: 81.991,
                    IQD: 1460,
                    ISK: 131.375,
                    JMD: 153.8087,
                    JOD: 0.7091,
                    JPY: 140.39,
                    KES: 135.43,
                    KMF: 444.1867,
                    KRW: 1274.35,
                    KWD: 0.3078,
                    KYD: 0.82,
                    KZT: 444.365,
                    LAK: 18882.385,
                    LKR: 328.89,
                    LRD: 154.7192,
                    LSL: 17.6615,
                    LTC: 0.0111569786901707,
                    LYD: 4.8042,
                    MAD: 9.6871,
                    MDL: 17.763,
                    MGA: 4328.755,
                    MKD: 55.5267,
                    MMK: 2010.105,
                    MNT: 3442.345,
                    MOP: 8.0356,
                    MUR: 45.9622,
                    MXN: 16.8675,
                    MZM: 63920.4551,
                    NAD: 17.6615,
                    NGN: 775.755,
                    NIO: 36.5748,
                    NOK: 10.11731,
                    NPR: 131.1751,
                    NZD: 1.61064312980173,
                    OMR: 0.3854,
                    PAB: 1,
                    PAX: 1.0005623160216,
                    PEN: 3.7128,
                    PHP: 54.621,
                    PKR: 285.3395,
                    PLN: 3.9981,
                    QAR: 3.6466,
                    RUB: 81.2679,
                    RWF: 1077.2937,
                    SAR: 3.7506,
                    SBD: 8.16,
                    SCR: 13.7114,
                    SDG: 574.1082,
                    SEK: 10.4358,
                    SGD: 1.3266,
                    SHP: 0.773275595422208,
                    SLL: 19385.959,
                    SOS: 569.1501,
                    SVC: 8.75,
                    SZL: 17.6615,
                    THB: 34.2605,
                    TND: 3.0573,
                    TOP: 2.3249,
                    TRY: 26.9502,
                    TTD: 6.7814,
                    TUSD: 1.00091683982528,
                    TWD: 31.191,
                    TZS: 2404.7,
                    UAH: 36.8309,
                    UGX: 3640.025,
                    USB: 1,
                    USDC: 0.985940488632106,
                    USDK: 1,
                    UST: 0.998552099455789,
                    UYU: 40.675,
                    VND: 23651.7,
                    WST: 2.6921,
                    XAF: 592.2489,
                    XCD: 2.7,
                    XOF: 592.2489,
                    XPF: 107.6633,
                    YER: 250.2405,
                    ZAR: 17.6615,
                    ZMK: 18825,
                    eUSDT: 0.998552099455789,
                    tUSDT: 0.998552099455789,
                },
            },
            msg_type: 'exchange_rates',
            req_id: context.req_id,
            subscription: {
                id: '69eddd7e-9cf2-48d2-e951-a7008e724c2f',
            },
        };
    }
}

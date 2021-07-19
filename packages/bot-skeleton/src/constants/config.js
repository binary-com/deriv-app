import { localize } from '@deriv/translations';

const CRYPTO_CURRENCIES = ['BTC', 'ETH', 'LTC', 'BCH', 'UST'];

export const config = {
    lists: {
        PAYOUTTYPE: [
            // [localize('Payout'), 'payout'],
            [localize('Stake'), 'stake'],
        ],
        CRYPTO_CURRENCIES,
        DETAILS: [
            [localize('deal reference id'), '1'],
            [localize('purchase price'), '2'],
            [localize('payout'), '3'],
            [localize('profit'), '4'],
            [localize('contract type'), '5'],
            [localize('entry spot time'), '6'],
            [localize('entry spot price'), '7'],
            [localize('exit spot time'), '8'],
            [localize('exit spot price'), '9'],
            [localize('barrier'), '10'],
            [localize('result'), '11'],
        ],
        CHECK_RESULT: [
            [localize('Win'), 'win'],
            [localize('Loss'), 'loss'],
        ],
        CHECK_DIRECTION: [
            [localize('Rise'), 'rise'],
            [localize('Fall'), 'fall'],
            [localize('No Change'), ''],
        ],
        BALANCE_TYPE: [
            [localize('string'), 'STR'],
            [localize('number'), 'NUM'],
        ],
        NOTIFICATION_TYPE: [
            [localize('green'), 'success'],
            [localize('blue'), 'info'],
            [localize('yellow'), 'warn'],
            [localize('red'), 'error'],
        ],
        NOTIFICATION_SOUND: [
            [localize('Silent'), 'silent'],
            [localize('Announcement'), 'announcement'],
            [localize('Earned money'), 'earned-money'],
            [localize('Job done'), 'job-done'],
            [localize('Error'), 'error'],
            [localize('Severe error'), 'severe-error'],
        ],
        CURRENCY: ['USD', 'EUR', 'GBP', 'AUD', ...CRYPTO_CURRENCIES],
    },
    opposites: {
        MULTIPLIER: [
            {
                MULTUP: localize('Up'),
            },
            {
                MULTDOWN: localize('Down'),
            },
        ],
        CALLPUT: [
            {
                CALL: localize('Rise'),
            },
            {
                PUT: localize('Fall'),
            },
        ],
        CALLPUTEQUAL: [
            {
                CALLE: localize('Rise Equals'),
            },
            {
                PUTE: localize('Fall Equals'),
            },
        ],
        HIGHERLOWER: [
            {
                CALL: localize('Higher'),
            },
            {
                PUT: localize('Lower'),
            },
        ],
        TOUCHNOTOUCH: [
            {
                ONETOUCH: localize('Touch'),
            },
            {
                NOTOUCH: localize('No Touch'),
            },
        ],
        ENDSINOUT: [
            {
                EXPIRYRANGE: localize('Ends Between'),
            },
            {
                EXPIRYMISS: localize('Ends Outside'),
            },
        ],
        STAYSINOUT: [
            {
                RANGE: localize('Stays Between'),
            },
            {
                UPORDOWN: localize('Goes Outside'),
            },
        ],
        ASIANS: [
            {
                ASIANU: localize('Asian Up'),
            },
            {
                ASIAND: localize('Asian Down'),
            },
        ],
        MATCHESDIFFERS: [
            {
                DIGITMATCH: localize('Matches'),
            },
            {
                DIGITDIFF: localize('Differs'),
            },
        ],
        EVENODD: [
            {
                DIGITEVEN: localize('Even'),
            },
            {
                DIGITODD: localize('Odd'),
            },
        ],
        OVERUNDER: [
            {
                DIGITOVER: localize('Over'),
            },
            {
                DIGITUNDER: localize('Under'),
            },
        ],
        HIGHLOWTICKS: [
            {
                TICKHIGH: localize('High Tick'),
            },
            {
                TICKLOW: localize('Low Tick'),
            },
        ],
        RESET: [
            {
                RESETCALL: localize('Reset Call'),
            },
            {
                RESETPUT: localize('Reset Put'),
            },
        ],
        RUNS: [
            {
                RUNHIGH: localize('Only Ups'),
            },
            {
                RUNLOW: localize('Only Downs'),
            },
        ],
        CALLPUTSPREAD: [
            {
                CALLSPREAD: localize('Call Spread'),
            },
            {
                PUTSPREAD: localize('Put Spread'),
            },
        ],
    },
    BARRIER_TYPES: [
        ['Offset +', '+'],
        ['Offset -', '-'],
    ],
    ohlcFields: [
        [localize('Open'), 'open'],
        [localize('High'), 'high'],
        [localize('Low'), 'low'],
        [localize('Close'), 'close'],
        [localize('Open Time'), 'epoch'],
    ],
    candleIntervals: [
        [localize('Default'), 'default'],
        [localize('1 minute'), '60'],
        [localize('2 minutes'), '120'],
        [localize('3 minutes'), '180'],
        [localize('5 minutes'), '300'],
        [localize('10 minutes'), '600'],
        [localize('15 minutes'), '900'],
        [localize('30 minutes'), '1800'],
        [localize('1 hour'), '3600'],
        [localize('2 hours'), '7200'],
        [localize('4 hours'), '14400'],
        [localize('8 hours'), '28800'],
        [localize('1 day'), '86400'],
    ],
    mainBlocks: ['trade_definition', 'before_purchase', 'during_purchase', 'after_purchase'],
    mandatoryMainBlocks: ['trade_definition', 'purchase', 'before_purchase'],
    procedureDefinitionBlocks: ['procedures_defnoreturn', 'procedures_defreturn'],
    single_instance_blocks: ['trade_definition', 'before_purchase', 'during_purchase', 'after_purchase'],
    TRADE_TYPE_TO_CONTRACT_CATEGORY_MAPPING: {
        callput: ['callput', 'higherlower'],
        asian: ['asians'],
        digits: ['matchesdiffers', 'evenodd', 'overunder'],
    },
    TRADE_TYPE_CATEGORIES: {
        multiplier: ['multiplier'],
        callput: ['callput', 'callputequal', 'higherlower'],
        touchnotouch: ['touchnotouch'],
        inout: ['endsinout', 'staysinout'],
        asian: ['asians'],
        digits: ['matchesdiffers', 'evenodd', 'overunder'],
        reset: ['reset'],
        callputspread: ['callputspread'],
        highlowticks: ['highlowticks'],
        runs: ['runs'],
    },
    TRADE_TYPE_CATEGORY_NAMES: {
        callput: localize('Up/Down'),
        touchnotouch: localize('Touch/No Touch'),
        inout: localize('In/Out'),
        asian: localize('Asians'),
        digits: localize('Digits'),
        reset: localize('Reset Call/Reset Put'),
        callputspread: localize('Call Spread/Put Spread'),
        highlowticks: localize('High/Low Ticks'),
        runs: localize('Only Ups/Only Downs'),
        multiplier: localize('Multipliers'),
    },
    BARRIER_CATEGORIES: {
        euro_atm: ['callput', 'callputequal'],
        euro_non_atm: ['endsinout', 'higherlower', 'callputspread'],
        american: ['staysinout', 'touchnotouch', 'highlowticks', 'runs', 'multiplier'],
        non_financial: ['digits', 'overunder', 'evenodd', 'matchesdiffers'],
        asian: ['asians'],
        reset: ['reset'],
        lookback: ['lookback'],
    },
    DEFAULT_DURATION_DROPDOWN_OPTIONS: [
        [localize('Ticks'), 't'],
        [localize('Seconds'), 's'],
        [localize('Minutes'), 'm'],
        [localize('Hours'), 'h'],
        [localize('Days'), 'd'],
    ],
    BARRIER_LABELS: [localize('High barrier'), localize('Low barrier')],
    ABSOLUTE_BARRIER_DROPDOWN_OPTION: [[localize('Absolute'), 'absolute']],
    NOT_AVAILABLE_DROPDOWN_OPTIONS: [[localize('Not available'), 'na']],
    NOT_AVAILABLE_DURATIONS: [{ display: localize('Not available'), unit: 'na', min: 0 }],
    BARRIER_TRADE_TYPES: ['higherlower', 'touchnotouch', 'endsinout', 'staysinout', 'callputspread'],
    PREDICTION_TRADE_TYPES: ['matchesdiffers', 'overunder', 'highlowticks'],
    DIGIT_CATEGORIES: ['digits', 'highlowticks'],
    INDEPEDENT_BLOCKS: ['block_holder', 'tick_analysis', 'loader', 'procedures_defreturn', 'procedures_defnoreturn'],
    bbResult: [
        [localize('upper'), '1'],
        [localize('middle'), '0'],
        [localize('lower'), '2'],
    ],
    macdFields: [
        [localize('Histogram'), '0'],
        [localize('MACD'), '1'],
        [localize('Signal'), '2'],
    ],
    gd: {
        cid: '828416594271-b4bhia944ecegn3j327oeb4l8o803bts.apps.googleusercontent.com',
        aid: 'derivbot-248506',
        api: 'AIzaSyA52MX2l8p75-w7nvab7fU6Lk6KwLqnyEI',
    },
    workspaces: {
        flyoutWorkspacesStartScale: 0.7,
        mainWorkspaceStartScale: 0.9,
        previewWorkspaceStartScale: 0.6,
    },
    strategies: {
        martingale: {
            index: 0,
            label: localize('Martingale'),
            description: localize(
                'The Martingale Strategy is a classic trading technique that has been used for more than a hundred years, popularised by the French mathematician Paul Pierre Levy in the 18th century.'
            ),
        },
        dalembert: {
            index: 1,
            label: localize("D'Alembert"),
            description: localize(
                'The concept of the D’Alembert Strategy is said to be similar to the Martingale Strategy where you will increase your contract size after a loss. With the D’Alembert Strategy, you will also decrease your contract size after a successful trade.'
            ),
        },
        oscars_grind: {
            index: 2,
            label: localize("Oscar's Grind"),
            description: localize(
                "The Oscar's Grind Strategy is a low-risk positive progression strategy that first appeared in 1965. By using this strategy, the size of your contract will increase after successful trades, but remains unchanged after unsuccessful trades."
            ),
        },
    },
    default_file_name: localize('Untitled Bot'),
};

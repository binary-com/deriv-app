import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';
import VideoFragment from 'AppV2/Components/Guide/Description/video-fragment';

type TDtraderVideoUrl = {
    [key: string]: TVideoVariants;
};

type TVideoVariants = {
    dark: string;
    light: string;
};

export const CONTRACT_LIST = {
    ACCUMULATORS: 'Accumulators',
    VANILLAS: 'Vanillas',
    TURBOS: 'Turbos',
    MULTIPLIERS: 'Multipliers',
    'RISE/FALL': 'Rise/Fall',
    'HIGHER/LOWER': 'Higher/Lower',
    'TOUCH/NO TOUCH': 'Touch/No Touch',
    'MATCHES/DIFFERS': 'Matches/Differs',
    'EVEN/ODD': 'Even/Odd',
    'OVER/UNDER': 'Over/Under',
};

export const AVAILABLE_CONTRACTS = [
    { tradeType: <Localize i18n_default_text='Accumulators' />, id: CONTRACT_LIST.ACCUMULATORS },
    { tradeType: <Localize i18n_default_text='Vanillas' />, id: CONTRACT_LIST.VANILLAS },
    { tradeType: <Localize i18n_default_text='Turbos' />, id: CONTRACT_LIST.TURBOS },
    { tradeType: <Localize i18n_default_text='Multipliers' />, id: CONTRACT_LIST.MULTIPLIERS },
    { tradeType: <Localize i18n_default_text='Rise/Fall' />, id: CONTRACT_LIST['RISE/FALL'] },
    { tradeType: <Localize i18n_default_text='Higher/Lower' />, id: CONTRACT_LIST['HIGHER/LOWER'] },
    { tradeType: <Localize i18n_default_text='Touch/No Touch' />, id: CONTRACT_LIST['TOUCH/NO TOUCH'] },
    { tradeType: <Localize i18n_default_text='Matches/Differs' />, id: CONTRACT_LIST['MATCHES/DIFFERS'] },
    { tradeType: <Localize i18n_default_text='Even/Odd' />, id: CONTRACT_LIST['EVEN/ODD'] },
    { tradeType: <Localize i18n_default_text='Over/Under' />, id: CONTRACT_LIST['OVER/UNDER'] },
];

export const TERM = {
    BARRIER: 'Barrier',
    CONTRACT_VALUE: 'Contract value',
    DEAL_CANCELLATION: 'Deal cancellation',
    ENTRY_SPOT: 'Entry spot',
    EXIT_SPOT: 'Exit spot',
    EXPIRY: 'Expiry',
    FINAL_PRICE: 'Final price',
    GROWTH_RATE: 'Growth rate',
    PAYOUT: 'Payout',
    PAYOUT_PER_POINT: 'Payout per point',
    PREVIOUS_SPOT_PRICE: 'Previous spot price',
    RANGE: 'Range',
    SLIPPAGE_RISK: 'Slippage risk',
    STOP_OUT_LEVEL: 'Stop out level',
    STOP_LOSS: 'Stop loss',
    STRIKE_PRICE: 'Strike price',
    TAKE_PROFIT: 'Take profit',
};

const DEFINITION = {
    [TERM.BARRIER]: (
        <Localize i18n_default_text='This is the corresponding price level based on the payout per point you’ve selected. If this barrier is ever breached, your contract would be terminated.' />
    ),
    [TERM.CONTRACT_VALUE]: (contract_type: string) =>
        contract_type === CONTRACT_LIST.VANILLAS ? (
            <Localize i18n_default_text='We’ll offer to buy your contract at this price should you choose to sell it before its expiry. This is based on several factors, such as the current spot price, duration, etc. However, we won’t offer a contract value if the remaining duration is below 60 seconds.' />
        ) : (
            <Localize i18n_default_text='This is the resale value of your contract, based on the prevailing market conditions (e.g, the current spot), including additional commissions if any.' />
        ),
    [TERM.DEAL_CANCELLATION]: (
        <Localize i18n_default_text='If you select this feature, you can cancel your trade within a chosen time frame if the asset price moves against your favour. You will get your stake back without profit/loss. We charge a small fee for this. Take profit and stop loss are disabled when deal cancellation is active.' />
    ),
    [TERM.ENTRY_SPOT]: (
        <Localize i18n_default_text='We use current-tick-execution mechanism, which is the latest asset price when the trade opening is processed by our servers for Volatility Index, Basket Indices, Jump Indices and Crash/Boom Indices.' />
    ),
    [TERM.EXIT_SPOT]: (
        <Localize i18n_default_text='The latest asset price when the trade closure is processed by our servers.' />
    ),
    [TERM.EXPIRY]: (
        <React.Fragment>
            <Text className='definition__paragraph'>
                <Localize i18n_default_text='This is when your contract will expire based on the duration or end time you’ve selected. If the duration is more than 24 hours, the cut-off time and expiry date will apply instead.' />
            </Text>
            <Text>
                <Localize i18n_default_text='Cut off time:' />
            </Text>
            <Text className='definition__paragraph'>
                <Localize i18n_default_text='Contracts will expire at exactly 23:59:59 GMT on your selected expiry date.' />
            </Text>
            <Text>
                <Localize i18n_default_text='Expiry date:' />
            </Text>
            <Text>
                <Localize i18n_default_text='Your contract will expire on this date (in GMT), based on the end time you’ve selected.' />
            </Text>
        </React.Fragment>
    ),
    [TERM.FINAL_PRICE]: <Localize i18n_default_text='This is the spot price of the last tick at expiry.' />,
    [TERM.GROWTH_RATE]: (
        <Localize i18n_default_text='You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%.' />
    ),
    [TERM.PAYOUT]: (contract_type: string) => {
        if (contract_type === CONTRACT_LIST.VANILLAS) {
            return (
                <Localize i18n_default_text='Your payout is equal to the payout per point multiplied by the difference between the final price and the strike price.' />
            );
        }
        if (contract_type === CONTRACT_LIST.TURBOS) {
            return (
                <Localize i18n_default_text='The payout at expiry is equal to the payout per point multiplied by the distance between the final price and the barrier.' />
            );
        }
        return <Localize i18n_default_text='Payout is the sum of your initial stake and profit.' />;
    },
    [TERM.PAYOUT_PER_POINT]: (contract_type: string) =>
        contract_type === CONTRACT_LIST.VANILLAS ? (
            <Localize i18n_default_text='We calculate this based on the strike price and duration you’ve selected.' />
        ) : (
            <Localize i18n_default_text='The amount you choose to receive at expiry for every point of change between the final price and the barrier. ' />
        ),
    [TERM.PREVIOUS_SPOT_PRICE]: <Localize i18n_default_text='Spot price on the previous tick.' />,
    [TERM.RANGE]: (
        <Localize i18n_default_text='It is a percentage of the previous spot price. The percentage rate is based on your choice of the index and the growth rate.' />
    ),
    [TERM.SLIPPAGE_RISK]: (contract_type: string) =>
        contract_type === CONTRACT_LIST.ACCUMULATORS ? (
            <Localize i18n_default_text='The spot price may change by the time your order reaches our servers. When this happens, your payout may be affected.' />
        ) : (
            <Localize i18n_default_text='Slippage happens when the asset price changes by the time it reaches our servers.' />
        ),
    [TERM.STOP_OUT_LEVEL]: (
        <Localize i18n_default_text='Your trade will be closed automatically at the nearest available asset price when your loss reaches a certain percentage of your stake, but your loss never exceeds your stake. This percentage depends on the chosen underlying asset and the Multiplier.' />
    ),
    [TERM.STOP_LOSS]: (
        <Localize i18n_default_text='If you select this feature, your trade will be closed automatically at the nearest available asset price when your loss reaches or exceeds the stop loss amount. Your loss may be more than the amount you entered depending on the market price at closing.' />
    ),
    [TERM.STRIKE_PRICE]: (
        <React.Fragment>
            <Text className='definition__paragraph'>
                <Localize i18n_default_text='You must select the strike price before entering the contract.' />
            </Text>
            <Text className='definition__paragraph'>
                <Localize i18n_default_text='If you select “Call”, you’ll earn a payout if the final price is above the strike price at expiry. Otherwise, you won’t receive a payout.' />
            </Text>
            <Text>
                <Localize i18n_default_text='If you select ‘Put”, you’ll earn a payout if the final price is below the strike price at expiry. Otherwise, you won’t receive a payout.' />
            </Text>
        </React.Fragment>
    ),
    [TERM.TAKE_PROFIT]: (
        <Localize i18n_default_text='If you select this feature, your trade will be closed automatically at the nearest available asset price when your profit reaches or exceeds the take profit amount. Your profit may be more than the amount you entered depending on the market price at closing.' />
    ),
};

export const getTermDefinition = ({ contract_type, term }: { contract_type: string; term: string }) => {
    const result = DEFINITION[term];
    if (typeof result === 'function') return result(contract_type);
    return result ?? '';
};

export const parseContractDescription = (
    content: {
        type: string;
        text: JSX.Element | string;
    }[]
) =>
    content.map(({ type, text }, index) => {
        if (type === 'heading' && typeof text !== 'string')
            return (
                <Text key={text.props.i18n_default_text} bold size='md' className='description__heading'>
                    {text}
                </Text>
            );
        if ((type === 'paragraph' || type === 'general') && typeof text !== 'string')
            return (
                <Text
                    as='p'
                    key={text.props.i18n_default_text}
                    size='sm'
                    className={`description__${type === 'paragraph' ? 'paragraph' : 'general'}`}
                    color='quill-typography__color--prominent'
                >
                    {text}
                </Text>
            );
        // TODO: do not forget to remove this key after getting real gifs
        if (type === 'video' && typeof text === 'string')
            return <VideoFragment contract_type={text} key={text + index} />;
    });

/* The video upload feature is not available yet. The following video ids are taken from CF Stream account.
        If considered necessary later, the current approach can be replaced with HTTP-request to fetch videos by their file names. */
export const DESCRIPTION_VIDEO_ID: TDtraderVideoUrl = {
    [CONTRACT_LIST.ACCUMULATORS]: {
        light: 'c1d64d5ffaf449e3326d387a70621a4c',
        dark: '9657e4adcfd9274d41a042b7b6c42d60',
    },
    [CONTRACT_LIST['EVEN/ODD']]: {
        light: 'a3930b0a535c4f23daea5cf98a718941',
        dark: 'e311e25dd68761d6ab73e8158ec83ea4',
    },
    [CONTRACT_LIST['HIGHER/LOWER']]: {
        light: 'f528c662c377601908a741ae2aedaec6',
        dark: '4c05445e1bd28f3f9f95b0ab566c4f9b',
    },
    [CONTRACT_LIST['MATCHES/DIFFERS']]: {
        light: '8693a02397d284ffcf0608e4fda702d9',

        dark: '2e56ad7ea67bf3f9a869de6336df1796',
    },
    [CONTRACT_LIST.MULTIPLIERS]: {
        light: 'bca032791da88023e81ebf7341226f83',
        dark: '3d10e25e2e0eaaf96d1874aae257029f',
    },
    [CONTRACT_LIST['OVER/UNDER']]: {
        light: '9e2be907cba9b38352890e52cfd8cbaf',

        dark: '4b31fc188c2f365faa310f7e34715af7',
    },
    [CONTRACT_LIST['RISE/FALL']]: {
        light: '7719c7e5436f58e59ab47510445108ba',
        dark: 'b72ef7ec914afe3dbb2a1601cad3a76f',
    },
    [CONTRACT_LIST['TOUCH/NO TOUCH']]: {
        light: 'c781a6844f37a3308fe8774b4450dfc9',
        dark: 'c91f2b9859dc95ce8eecf7df327aaf00',
    },
    [CONTRACT_LIST.VANILLAS]: {
        light: '9b8b6ae67d3a720e4aee2665889d17fb',
        dark: '8f04e9d768b8e08a1d87830c95c6b9c8',
    },
};

export const getDescriptionVideoId = (contract_type = '', is_dark_theme = false) =>
    DESCRIPTION_VIDEO_ID[contract_type]?.[is_dark_theme ? 'dark' : 'light'];

import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';
import VideoFragment from 'AppV2/Components/Guide/Description/video-fragment';
import { DESCRIPTION_VIDEO_ID } from 'Modules/Trading/Helpers/video-config';
import { CONTRACT_LIST } from './trade-types-utils';

type TDtraderVideoUrl = {
    [key: string]: TVideoVariants;
};

type TVideoVariants = {
    dark: string;
    light: string;
};

export const getTerm = () => ({
    BARRIER: localize('Barrier'),
    CONTRACT_VALUE: localize('Contract value'),
    DEAL_CANCELLATION: localize('Deal cancellation'),
    ENTRY_SPOT: localize('Entry spot'),
    EXIT_SPOT: localize('Exit spot'),
    EXPIRY: localize('Expiry'),
    FINAL_PRICE: localize('Final price'),
    GROWTH_RATE: localize('Growth rate'),
    PAYOUT: localize('Payout'),
    PAYOUT_PER_POINT: localize('Payout per point'),
    PREVIOUS_SPOT_PRICE: localize('Previous spot price'),
    RANGE: localize('Range'),
    SLIPPAGE_RISK: localize('Slippage risk'),
    STOP_OUT_LEVEL: localize('Stop out level'),
    STOP_LOSS: localize('Stop loss'),
    STRIKE_PRICE: localize('Strike price'),
    TAKE_PROFIT: localize('Take profit'),
});

const getDefinition = () => {
    const {
        BARRIER,
        CONTRACT_VALUE,
        DEAL_CANCELLATION,
        ENTRY_SPOT,
        EXIT_SPOT,
        EXPIRY,
        FINAL_PRICE,
        GROWTH_RATE,
        PAYOUT,
        PAYOUT_PER_POINT,
        PREVIOUS_SPOT_PRICE,
        RANGE,
        SLIPPAGE_RISK,
        STOP_OUT_LEVEL,
        STOP_LOSS,
        STRIKE_PRICE,
        TAKE_PROFIT,
    } = getTerm();
    return {
        [BARRIER]: (
            <Localize i18n_default_text='This is the corresponding price level based on the payout per point you’ve selected. If this barrier is ever breached, your contract would be terminated.' />
        ),
        [CONTRACT_VALUE]: (contract_type: string) =>
            contract_type === CONTRACT_LIST.VANILLAS ? (
                <Localize i18n_default_text='We’ll offer to buy your contract at this price should you choose to sell it before its expiry. This is based on several factors, such as the current spot price, duration, etc. However, we won’t offer a contract value if the remaining duration is below 60 seconds.' />
            ) : (
                <Localize i18n_default_text='This is the resale value of your contract, based on the prevailing market conditions (e.g, the current spot), including additional commissions if any.' />
            ),
        [DEAL_CANCELLATION]: (
            <Localize i18n_default_text='If you select this feature, you can cancel your trade within a chosen time frame if the asset price moves against your favour. You will get your stake back without profit/loss. We charge a small fee for this. Take profit and stop loss are disabled when deal cancellation is active.' />
        ),
        [ENTRY_SPOT]: (
            <Localize i18n_default_text='We use current-tick-execution mechanism, which is the latest asset price when the trade opening is processed by our servers for Volatility Index, Basket Indices, Jump Indices and Crash/Boom Indices.' />
        ),
        [EXIT_SPOT]: (
            <Localize i18n_default_text='The latest asset price when the trade closure is processed by our servers.' />
        ),
        [EXPIRY]: (
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
        [FINAL_PRICE]: <Localize i18n_default_text='This is the spot price of the last tick at expiry.' />,
        [GROWTH_RATE]: (
            <Localize i18n_default_text='You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%.' />
        ),
        [PAYOUT]: (contract_type: string) => {
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
        [PAYOUT_PER_POINT]: (contract_type: string) =>
            contract_type === CONTRACT_LIST.VANILLAS ? (
                <Localize i18n_default_text='We calculate this based on the strike price and duration you’ve selected.' />
            ) : (
                <Localize i18n_default_text='The amount you choose to receive at expiry for every point of change between the final price and the barrier. ' />
            ),
        [PREVIOUS_SPOT_PRICE]: <Localize i18n_default_text='Spot price on the previous tick.' />,
        [RANGE]: (
            <Localize i18n_default_text='It is a percentage of the previous spot price. The percentage rate is based on your choice of the index and the growth rate.' />
        ),
        [SLIPPAGE_RISK]: (contract_type: string) =>
            contract_type === CONTRACT_LIST.ACCUMULATORS ? (
                <Localize i18n_default_text='The spot price may change by the time your order reaches our servers. When this happens, your payout may be affected.' />
            ) : (
                <Localize i18n_default_text='Slippage happens when the asset price changes by the time it reaches our servers.' />
            ),
        [STOP_OUT_LEVEL]: (
            <Localize i18n_default_text='Your trade will be closed automatically at the nearest available asset price when your loss reaches a certain percentage of your stake, but your loss never exceeds your stake. This percentage depends on the chosen underlying asset and the Multiplier.' />
        ),
        [STOP_LOSS]: (
            <Localize i18n_default_text='If you select this feature, your trade will be closed automatically at the nearest available asset price when your loss reaches or exceeds the stop loss amount. Your loss may be more than the amount you entered depending on the market price at closing.' />
        ),
        [STRIKE_PRICE]: (
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
        [TAKE_PROFIT]: (
            <Localize i18n_default_text='If you select this feature, your trade will be closed automatically at the nearest available asset price when your profit reaches or exceeds the take profit amount. Your profit may be more than the amount you entered depending on the market price at closing.' />
        ),
    };
};

export const getTermDefinition = ({ contract_type, term }: { contract_type?: string; term?: string }) => {
    if (!contract_type || !term) return;
    const result = getDefinition()[term];
    if (typeof result === 'function') return result(contract_type);
    return result ?? '';
};

export const getContractDescription = (
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
                    className={`description__${type}`}
                    color='quill-typography__color--default'
                >
                    {text}
                </Text>
            );
        if (type === 'video' && typeof text === 'string')
            return <VideoFragment contract_type={text} key={text + index} />;
    });

export const DESCRIPTION_VIDEO_IDS: TDtraderVideoUrl = {
    [CONTRACT_LIST.ACCUMULATORS]: DESCRIPTION_VIDEO_ID.accumulator,
    [CONTRACT_LIST.EVEN_ODD]: DESCRIPTION_VIDEO_ID.even_odd,
    [CONTRACT_LIST.HIGHER_LOWER]: DESCRIPTION_VIDEO_ID.high_low,
    [CONTRACT_LIST.MATCHES_DIFFERS]: DESCRIPTION_VIDEO_ID.match_diff,
    [CONTRACT_LIST.MULTIPLIERS]: DESCRIPTION_VIDEO_ID.multiplier,
    [CONTRACT_LIST.OVER_UNDER]: DESCRIPTION_VIDEO_ID.over_under,
    [CONTRACT_LIST.RISE_FALL]: DESCRIPTION_VIDEO_ID.rise_fall,
    [CONTRACT_LIST.TOUCH_NO_TOUCH]: DESCRIPTION_VIDEO_ID.touch,
    [CONTRACT_LIST.VANILLAS]: DESCRIPTION_VIDEO_ID.vanilla,
    [CONTRACT_LIST.TURBOS]: DESCRIPTION_VIDEO_ID.turbos,
};

export const getDescriptionVideoIds = (contract_type = '', is_dark_theme = false) =>
    DESCRIPTION_VIDEO_IDS[contract_type]?.[is_dark_theme ? 'dark' : 'light'];

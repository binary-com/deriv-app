import {
    candleField,
    candleValues,
    checkDirection,
    dateTimeStringToTimestamp,
    isCandleBlack,
    getAskPrice,
    getBalance,
    readDetails,
    getLastDigitBinaryUtils as getLastDigit,
    getLastDigitList,
    getLastTick,
    getOhlc,
    getOhlcFromEnd,
    getTicks,
    getPayout,
    getPurchaseReference,
    getSellPrice,
    getTime,
    getTotalProfit,
    getTotalRuns,
    initTradeEngine as init,
    isResult,
    isSellAtMarketAvailable as isSellAvailable,
    isTradeAgainObserver as isTradeAgain,
    miscAlert as alert,
    miscConsole as console,
    miscPrompt as prompt,
    notify,
    notifyTelegram,
    purchase,
    sellAtMarket,
    sleep,
    startTradeEngine as start,
    stopTradeEngine as stop,
    tradeEngineObserver,
    watch,
    $scope,
    indicators,
    Services,
} from './tradeEngine';

const getInterface = (ws, ticksService, observer, config, localize, log_types, populateConfig, getUUID, shared) => {
    Services.api = ws;
    Services.ticksService = ticksService;
    Services.config = config;
    Services.localize = localize;
    Services.observer = observer;
    Services.log_types = log_types;
    Services.populateConfig = populateConfig;
    Services.getUUID = getUUID;
    Services.shared = shared;

    return {
        alert,
        candleField,
        candleValues,
        isCandleBlack,
        console,
        dateTimeStringToTimestamp,
        getAskPrice,
        getBalance,
        getLastDigitList,
        getPayout,
        getSellPrice,
        getPurchaseReference,
        getTime,
        getTotalProfit,
        init,
        isResult,
        isSellAvailable,
        isTradeAgain,
        notify,
        notifyTelegram,
        prompt,
        purchase,
        readDetails,
        sellAtMarket,
        sleep,
        start,
        stop,
        tradeEngineObserver,
        watch,
        getTotalRuns,
        checkDirection,
        getLastDigit,
        getLastTick,
        getOhlc,
        getOhlcFromEnd,
        getTicks,
        scope: $scope,
        ...indicators,
    };
};

export default getInterface;

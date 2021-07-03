const BinarySocket = require('./socket_base');

const TradingTimesBase = (() => {
    const onActiveSymbolsResponse = callback => {
        BinarySocket.activeSymbols().then(callback);
    };
    const onTradingTimesResponse = callback => {
        BinarySocket.send({ trading_times: 'today' }).then(callback);
    };

    return {
        onActiveSymbolsResponse,
        onTradingTimesResponse,
    };
})();

module.exports = TradingTimesBase;

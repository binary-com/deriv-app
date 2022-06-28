import { isSellAtMarketAvailable, sellAtMarket } from '../trade/Sell';
import { isTradeAgainObserver } from '../trade/Observers';
import { getSellPrice, getDetail } from '../trade/OpenContract';
import { purchase } from '../trade/Purchase';
import { getPurchaseReference, getProposal } from '../trade/Proposal';
import { initTradeEngine, startTradeEngine, stopTradeEngine, tradeEngineObserver } from '../trade';

const getBotInterface = () => {
    return {
        init: (...args) => initTradeEngine(...args),
        start: (...args) => startTradeEngine(...args),
        stop: () => stopTradeEngine(),
        tradeEngineObserver: () => tradeEngineObserver(),
        purchase: contract_type => purchase(contract_type),
        getAskPrice: contract_type => Number(getProposal(contract_type).ask_price),
        getPayout: contract_type => Number(getProposal(contract_type).payout),
        getPurchaseReference: () => getPurchaseReference(),
        isSellAvailable: () => isSellAtMarketAvailable(),
        sellAtMarket: () => sellAtMarket(),
        getSellPrice: () => getSellPrice(),
        isResult: result => getDetail(10) === result,
        isTradeAgain: result => isTradeAgainObserver(result),
        readDetails: i => getDetail(i - 1),
    };
};

export default getBotInterface;

import { action } from 'mobx';
import CommonResourceBase from '_common/base/common_resource_base'; // eslint-disable-line import/order

let client_store;

const CommonResources = (() => {
    const init = store => {
        CommonResourceBase.onActiveSymbolsResponse(updateActiveSymbolStore);
        CommonResourceBase.onTradingTimesResponse(updateTradingTimeStore);
        client_store = store.client;
    };

    const updateActiveSymbolStore = action(({ active_symbols }) => {
        if (client_store) {
            client_store.active_symbols = active_symbols;
        }
    });

    const updateTradingTimeStore = action(({ trading_times }) => {
        if (client_store) {
            client_store.trading_times = trading_times;
        }
    });

    return {
        init,
    };
})();

export default CommonResources;

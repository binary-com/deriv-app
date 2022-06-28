import { DURING_PURCHASE } from './state/constants';
import { contractStatus, log } from '../utils/broadcast';
import { recoverFromError, doUntilDone } from '../utils/helpers';
import { log_types } from '../../../constants/messages';
import { observer as globalObserver } from '../../../utils/observer';
import ws from '../../api/ws';
import $scope from '../utils/cliTools';
import Store from './trade-engine-store';
import { waitForAfter } from './OpenContract';

export const isSellAtMarketAvailable = () => {
    const { is_sold, is_sell_available, is_expired } = $scope.contract_flags;
    return $scope.contract_id && !is_sold && is_sell_available && !is_expired;
};

export const sellAtMarket = () => {
    globalObserver.emit('bot.sell');

    // Prevent calling sell twice
    if (Store.getState().scope !== DURING_PURCHASE) {
        return Promise.resolve();
    }

    if (!isSellAtMarketAvailable()) {
        log(log_types.NOT_OFFERED);
        return Promise.resolve();
    }

    let delay_index = 1;

    return new Promise(resolve => {
        const onContractSold = sell_response => {
            delay_index = 1;

            if (sell_response) {
                const { sold_for } = sell_response.sell;
                log(log_types.SELL, { sold_for });
            }

            contractStatus('purchase.sold');
            waitForAfter();
            resolve();
        };

        const contract_id = $scope.contract_id;

        const sellContractAndGetContractInfo = () => {
            return doUntilDone(() => ws.send({ sell: contract_id, price: 0 }))
                .then(sell_response => {
                    doUntilDone(() => ws.send({ proposal_open_contract: 1, contract_id })).then(() => sell_response);
                })
                .catch(e => {
                    const error = e.error;
                    if (error.code === 'InvalidOfferings') {
                        // "InvalidOfferings" may occur when user tries to sell the contract too close
                        // to the expiry time. We shouldn't interrupt the bot but instead let the contract
                        // finish.
                        return Promise.resolve();
                    }

                    const sell_error = {
                        name: error.code,
                        message: error.message,
                        msg_type: e.msg_type,
                        error: { ...error.error },
                    };

                    if (error.code === 'RateLimit') {
                        return Promise.reject(sell_error);
                    }

                    // For every other error, check whether the contract is not actually already sold.
                    return doUntilDone(() =>
                        ws.send({
                            proposal_open_contract: 1,
                            contract_id,
                        })
                    ).then(proposal_open_contract_response => {
                        const { proposal_open_contract } = proposal_open_contract_response;

                        if (proposal_open_contract.status !== 'sold') {
                            return Promise.reject(sell_error);
                        }

                        // If the contract is sold at this point it means there was a race condition.
                        // Pretend this sell request was successful and mislead the trade engine into
                        // moving onto the next scope.
                        return Promise.resolve({
                            sell: {
                                sold_for: proposal_open_contract.sell_price,
                            },
                        });
                    });
                });
        };

        const errors_to_ignore = ['NoOpenPosition', 'InvalidSellContractProposal', 'UnrecognisedRequest'];

        // Restart buy/sell on error is enabled, don't recover from sell error.
        if (!$scope.options.timeMachineEnabled) {
            return doUntilDone(sellContractAndGetContractInfo, errors_to_ignore).then(sell_response =>
                onContractSold(sell_response)
            );
        }

        // If above checkbox not checked, try to recover from sell error.
        const recoverFn = (error_code, makeDelay) => {
            return makeDelay().then(() => globalObserver.emit('REVERT', 'during'));
        };
        return recoverFromError(sellContractAndGetContractInfo, recoverFn, errors_to_ignore, delay_index++).then(
            sell_response => onContractSold(sell_response)
        );
    });
};

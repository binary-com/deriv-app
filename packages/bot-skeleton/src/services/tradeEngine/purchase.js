import { subscribeToOpenContract } from './open-contract';
import { clearProposals, renewProposalsOnPurchase, selectProposal } from './proposal';
import { updateAndReturnTotalRuns } from './total';
import Store, { constants, purchaseSuccessful, $scope, Services } from './state';
import { recoverFromError, doUntilDone, contractStatus, info, log } from './utils';

let delayIndex = 0;

export const purchase = contract_type => {
    // Prevent calling purchase twice
    if (Store.getState().single.scope !== constants.BEFORE_PURCHASE) {
        return Promise.resolve();
    }

    const { id, askPrice } = selectProposal(contract_type);

    const onSuccess = response => {
        // Don't unnecessarily send a forget request for a purchased contract.
        $scope.data.proposals = $scope.data.proposals.filter(p => p.id !== response.echo_req.buy);
        const { buy } = response;

        contractStatus({
            id: 'contract.purchase_received',
            data: buy.transaction_id,
            buy,
        });

        subscribeToOpenContract(buy.contract_id);
        Store.dispatch(purchaseSuccessful());
        renewProposalsOnPurchase();
        delayIndex = 0;
        log(Services.log_types.PURCHASE, { longcode: buy.longcode, transaction_id: buy.transaction_id });
        info({
            accountID: $scope.account_info.loginid,
            totalRuns: updateAndReturnTotalRuns(),
            transaction_ids: { buy: buy.transaction_id },
            contract_type,
            buy_price: buy.buy_price,
        });
    };
    const action = () => Services.api.send({ buy: id, price: askPrice });
    $scope.contract_flags.is_sold = false;
    contractStatus({
        id: 'contract.purchase_sent',
        data: askPrice,
    });

    if (!$scope.options.timeMachineEnabled) {
        return doUntilDone(action).then(onSuccess);
    }
    return recoverFromError(
        action,
        (errorCode, makeDelay) => {
            // if disconnected no need to resubscription (handled by live-api)
            if (errorCode !== 'DisconnectError') {
                renewProposalsOnPurchase();
            } else {
                clearProposals();
            }

            const unsubscribe = Store.subscribe(() => {
                const { scope, proposalsReady } = Store.getState().single;
                if (scope === constants.BEFORE_PURCHASE && proposalsReady) {
                    makeDelay().then(() => Services.observer.emit('REVERT', 'before'));
                    unsubscribe();
                }
            });
        },
        ['PriceMoved', 'InvalidContractProposal'],
        delayIndex++
    ).then(onSuccess);
};

import { isEmptyObject } from '@deriv/shared';
import Store, { proposalsReady, clearProposals as clearProposalsAction, $scope, Services } from './state';
import { doUntilDone } from './utils';

const tradeOptionToProposal = (trade_option, purchase_reference) =>
    trade_option.contractTypes.map(type => {
        const proposal = {
            amount: trade_option.amount,
            basis: trade_option.basis,
            contract_type: type,
            currency: trade_option.currency,
            duration: trade_option.duration,
            duration_unit: trade_option.duration_unit,
            multiplier: trade_option.multiplier,
            passthrough: {
                contract_type: type,
                purchase_reference,
            },
            proposal: 1,
            symbol: trade_option.symbol,
        };
        if (trade_option.prediction !== undefined) {
            proposal.selected_tick = trade_option.prediction;
        }
        if (!['TICKLOW', 'TICKHIGH'].includes(type) && trade_option.prediction !== undefined) {
            proposal.barrier = trade_option.prediction;
        } else if (trade_option.barrierOffset !== undefined) {
            proposal.barrier = trade_option.barrierOffset;
        }
        if (trade_option.secondBarrierOffset !== undefined) {
            proposal.barrier2 = trade_option.secondBarrierOffset;
        }
        if (['MULTUP', 'MULTDOWN'].includes(type)) {
            proposal.duration = undefined;
            proposal.duration_unit = undefined;
        }
        if (!isEmptyObject(trade_option.limit_order)) {
            proposal.limit_order = trade_option.limit_order;
        }
        return proposal;
    });

const requestProposals = () => {
    // Since there are two proposals (in most cases), an error may be logged twice, to avoid this
    // flip this boolean on error.
    let has_informed_error = false;

    Promise.all(
        $scope.proposal_templates.map(proposal => {
            doUntilDone(() => Services.api.send(proposal)).catch(error => {
                // We intercept ContractBuyValidationError as user may have specified
                // e.g. a DIGITUNDER 0 or DIGITOVER 9, while one proposal may be invalid
                // the other is valid. We will error on Purchase rather than here.

                if (error.error.code === 'ContractBuyValidationError') {
                    $scope.data.proposals.push({
                        ...error.error.echo_req,
                        ...error.echo_req.passthrough,
                        error,
                    });

                    return null;
                }
                if (!has_informed_error) {
                    has_informed_error = true;
                    Services.observer.emit('Error', error.error);
                }
                return null;
            });
        })
    );
};

const unsubscribeProposals = () => {
    const { proposals } = $scope.data;
    const removeForgetProposalById = forget_proposal_id =>
        ($scope.data.forget_proposal_ids = $scope.data.forget_proposal_ids.filter(id => id !== forget_proposal_id));

    clearProposals();

    return Promise.all(
        proposals.map(proposal => {
            if (!$scope.data.forget_proposal_ids.includes(proposal.id)) {
                $scope.data.forget_proposal_ids.push(proposal.id);
            }

            if (proposal.error) {
                removeForgetProposalById(proposal.id);
                return Promise.resolve();
            }

            return doUntilDone(() => Services.api.forget(proposal.id)).then(() => {
                removeForgetProposalById(proposal.id);
            });
        })
    );
};

export const checkProposalReady = () => {
    // Proposals are considered ready when the proposals in our memory match the ones
    // we've requested from the API, we determine this by checking the passthrough of the response.
    const { proposals } = $scope.data;

    if (proposals.length > 0) {
        const has_equal_proposals = $scope.proposal_templates.every(template => {
            return (
                proposals.findIndex(proposal => {
                    return (
                        proposal.purchase_reference === template.passthrough.purchase_reference &&
                        proposal.contract_type === template.contract_type
                    );
                }) !== -1
            );
        });

        if (has_equal_proposals) {
            $scope.startPromise.then(() => Store.dispatch(proposalsReady()));
        }
    }
};

export const clearProposals = () => {
    $scope.data.proposals = [];
    Store.dispatch(clearProposalsAction());
};

export const getAskPrice = contract_type => Number(getProposal(contract_type).ask_price);

export const getPayout = contract_type => Number(getProposal(contract_type).payout);

export const getProposal = contract_type => {
    return $scope.data.proposals.find(
        proposal => proposal.contract_type === contract_type && proposal.purchase_reference === getPurchaseReference()
    );
};

export const getPurchaseReference = () => $scope.purchase_reference;

export const isNewTradeOption = trade_option => {
    if (!$scope.trade_option) {
        $scope.trade_option = trade_option;
        return true;
    }

    // Compare incoming "trade_option" argument with "this.trade_option", if any
    // of the values is different, this is a new tradeOption and new proposals
    // should be generated.
    return [
        'amount',
        'barrierOffset',
        'basis',
        'duration',
        'duration_unit',
        'prediction',
        'secondBarrierOffset',
        'symbol',
    ].some(value => $scope.trade_option[value] !== trade_option[value]);
};

export const makeProposals = trade_option => {
    if (!isNewTradeOption(trade_option)) {
        return;
    }

    // Generate a purchase reference when trade options are different from previous trade options.
    // This will ensure the bot doesn't mistakenly purchase the wrong proposal.
    $scope.purchase_reference = Services.getUUID();
    $scope.trade_option = trade_option;
    $scope.proposal_templates = tradeOptionToProposal(trade_option, getPurchaseReference());
    renewProposalsOnPurchase();
};

export const observeProposals = () => {
    Services.api.onMessage().subscribe(response => {
        if (response.data.msg_type === 'proposal') {
            const { passthrough, proposal } = response.data;
            if (
                proposal &&
                $scope.data.proposals.findIndex(p => p.id === proposal.id) === -1 &&
                !$scope.data.forget_proposal_ids.includes(proposal.id)
            ) {
                // Add proposals based on the ID returned by the API.
                $scope.data.proposals.push({ ...proposal, ...passthrough });
                checkProposalReady();
            }
        }
    });
};

export const renewProposalsOnPurchase = () => {
    unsubscribeProposals().then(() => requestProposals());
};

export const selectProposal = contract_type => {
    const { proposals } = $scope.data;

    if (proposals.length === 0) {
        throw Error(Services.localize('Proposals are not ready'));
    }

    const to_buy = proposals.find(proposal => {
        if (proposal.contract_type === contract_type && proposal.purchase_reference === getPurchaseReference()) {
            // Below happens when a user has had one of the proposals return
            // with a ContractBuyValidationError. We allow the logic to continue
            // to here cause the opposite proposal may still be valid. Only once
            // they attempt to purchase the errored proposal we will intervene.
            if (proposal.error) {
                throw proposal.error;
            }

            return proposal;
        }

        return false;
    });

    if (!to_buy) {
        throw new Error(Services.localize('Selected proposal does not exist'));
    }

    return {
        id: to_buy.id,
        askPrice: to_buy.ask_price,
    };
};

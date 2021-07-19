import { formatTime, findValueByKeyRecursively, getRoundedNumber, isEmptyObject } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { error as logError } from './broadcast';
import { observer as globalObserver } from '../../../utils/observer';

export const tradeOptionToProposal = (trade_option, purchase_reference) =>
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

export const getDirection = ticks => {
    const { length } = ticks;
    const [tickOld, tickNew] = ticks.slice(-2);

    let direction = '';
    if (length >= 2) {
        direction = tickOld.quote < tickNew.quote ? 'rise' : direction;
        direction = tickOld.quote > tickNew.quote ? 'fall' : direction;
    }

    return direction;
};

export const getLastDigit = (tick, pipSize) => Number(tick.toFixed(pipSize).slice(-1)[0]);

const getBackoffDelayInMs = (error, delay_index) => {
    const base_delay = 2.5;
    const max_delay = 15;
    const next_delay_in_seconds = Math.min(base_delay * delay_index, max_delay);

    if (error.error.code === 'RateLimit') {
        logError(
            localize('You are rate limited for: {{ message_type }}, retrying in {{ delay }}s (ID: {{ request }})', {
                message_type: error.msg_type,
                delay: next_delay_in_seconds,
                request: error.echo_req.req_id,
            })
        );
    } else if (error.error.code === 'DisconnectError') {
        logError(
            localize('You are disconnected, retrying in {{ delay }}s', {
                delay: next_delay_in_seconds,
            })
        );
    } else if (error.error.code === 'MarketIsClosed') {
        logError(localize('This market is presently closed.'));
    } else {
        logError(
            localize('Request failed for: {{ message_type }}, retrying in {{ delay }}s', {
                message_type: error.msg_type || localize('unknown'),
                delay: next_delay_in_seconds,
            })
        );
    }

    return next_delay_in_seconds * 1000;
};

export const updateErrorMessage = error => {
    if (error.error?.code === 'InputValidationFailed') {
        if (error.error.details?.duration) {
            error.error.message = localize('Duration must be a positive integer');
        }
        if (error.error.details?.amount) {
            error.error.message = localize('Amount must be a positive number.');
        }
    }
};

export const shouldThrowError = (error, errors_to_ignore = []) => {
    if (!error.error) {
        return false;
    }

    const default_errors_to_ignore = [
        'CallError',
        'WrongResponse',
        'GetProposalFailure',
        'RateLimit',
        'DisconnectError',
        'MarketIsClosed',
    ];
    updateErrorMessage(error);
    const is_ignorable_error = errors_to_ignore.concat(default_errors_to_ignore).includes(error.error.code);

    return !is_ignorable_error;
};

export const recoverFromError = (promiseFn, recoverFn, errors_to_ignore, delay_index) => {
    return new Promise((resolve, reject) => {
        const promise = promiseFn();

        if (promise) {
            promise.then(resolve).catch(error => {
                if (shouldThrowError(error, errors_to_ignore)) {
                    reject(error);
                    return;
                }
                recoverFn(
                    error.error.code,
                    () =>
                        new Promise(recoverResolve => {
                            const getGlobalTimeouts = () => globalObserver.getState('global_timeouts') ?? [];

                            const timeout = setTimeout(() => {
                                const global_timeouts = getGlobalTimeouts();
                                delete global_timeouts[timeout];
                                globalObserver.setState(global_timeouts);
                                recoverResolve();
                            }, getBackoffDelayInMs(error, delay_index));

                            const global_timeouts = getGlobalTimeouts();
                            const cancellable_timeouts = ['buy'];
                            const msg_type = findValueByKeyRecursively(error, 'msg_type');

                            global_timeouts[timeout] = {
                                is_cancellable: cancellable_timeouts.includes(msg_type),
                                msg_type,
                            };

                            globalObserver.setState({ global_timeouts });
                        })
                );
            });
        } else {
            resolve();
        }
    });
};

export const doUntilDone = (promiseFn, errors_to_ignore) => {
    let delay_index = 1;

    return new Promise((resolve, reject) => {
        const recoverFn = (error_code, makeDelay) => {
            delay_index++;
            makeDelay().then(repeatFn);
        };

        const repeatFn = () => {
            recoverFromError(promiseFn, recoverFn, errors_to_ignore, delay_index).then(resolve).catch(reject);
        };

        repeatFn();
    });
};

export const createDetails = contract => {
    const { sell_price: sellPrice, buy_price: buyPrice, currency } = contract;
    const profit = getRoundedNumber(sellPrice - buyPrice, currency);
    const result = profit < 0 ? 'loss' : 'win';

    return [
        contract.transaction_ids.buy,
        +contract.buy_price,
        +contract.sell_price,
        profit,
        contract.contract_type,
        formatTime(parseInt(`${contract.entry_tick_time}000`), 'HH:mm:ss'),
        +contract.entry_tick,
        formatTime(parseInt(`${contract.exit_tick_time}000`), 'HH:mm:ss'),
        +contract.exit_tick,
        +(contract.barrier ? contract.barrier : 0),
        result,
    ];
};

export const getUUID = () => `${new Date().getTime() * Math.random()}`;

import { datadogLogs } from '@datadog/browser-logs';

export const REQUESTS = [
    'active_symbols',
    'authorize',
    'balance',
    'buy',
    'proposal',
    'proposal_open_contract',
    'run_proposal_or_direct_buy',
    'transaction',
    'ticks_history',
    'history',
];

class APIMiddleware {
    constructor(config) {
        this.config = config;
        this.debounced_calls = {};
        this.addGlobalMethod();
    }

    getRequestType = request => {
        let req_type;
        REQUESTS.forEach(type => {
            if (type in request && !req_type) req_type = type;
        });

        return req_type;
    };

    log = (measures = [], is_bot_running) => {
        if (window.is_datadog_logging_enabled && measures && measures.length) {
            measures.forEach(measure => {
                datadogLogs.logger.info(measure.name, {
                    name: measure.name,
                    startTime: measure.startTimeDate,
                    duration: measure.duration,
                    detail: measure.detail,
                    isBotRunning: is_bot_running,
                });
            });
        }
    };

    defineMeasure = res_type => {
        if (res_type) {
            let measure;
            if (res_type === 'history') {
                performance.mark('ticks_history_end');
                measure = performance.measure('ticks_history', 'ticks_history_start', 'ticks_history_end');
                console.table('ticks_history', measure.duration);
            } else {
                performance.mark(`${res_type}_end`);
                measure = performance.measure(`${res_type}`, `${res_type}_start`, `${res_type}_end`);
                if (res_type === 'proposal') {
                    // eslint-disable-next-line no-console
                    console.table('proposal', measure.duration);
                }
            }
            return (measure.startTimeDate = new Date(Date.now() - measure.startTime));
        }
        return false;
    };

    sendWillBeCalled({ args: [request] }) {
        const req_type = this.getRequestType(request);
        let measure;
        if (req_type === 'buy') {
            performance.mark('first_proposal_or_run_end');
            if (performance.getEntriesByName('bot-start', 'mark').length) {
                measure = performance.measure('run_proposal_or_direct_buy', 'bot-start', 'first_proposal_or_run_end');
                console.table('measure', measure.duration);
                performance.clearMarks('bot-start');
            }
        }
    }

    sendIsCalled = ({ response_promise, args: [request] }) => {
        const req_type = this.getRequestType(request);
        if (req_type) performance.mark(`${req_type}_start`);
        response_promise
            .then(res => {
                const res_type = this.getRequestType(res);
                if (res_type) {
                    this.defineMeasure(res_type);
                }
            })
            .catch(() => {});
        return response_promise;
    };

    sendRequestsStatistic = is_bot_running => {
        REQUESTS.forEach(req_type => {
            const measure = performance.getEntriesByName(req_type);
            if (measure && measure.length) {
                if (process.env.DATADOG_CLIENT_TOKEN_LOGS) {
                    this.log(measure, is_bot_running, req_type);
                }
            }
        });
        performance.clearMeasures();
    };

    addGlobalMethod() {
        if (window) window.sendRequestsStatistic = this.sendRequestsStatistic;
    }
}

export default APIMiddleware;

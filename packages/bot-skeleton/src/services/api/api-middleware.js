import { datadogLogs } from '@datadog/browser-logs';

datadogLogs.init({
    clientToken: 'pub1beb6b75d0f9cdc56ad3aaa7a1427322',
    site: 'us5.datadoghq.com',
    forwardErrorsToLogs: true,
    sessionSampleRate: 100,
    service: 'Dbot',
});

const REQUESTS = [
    'authorize',
    'balance',
    'active_symbols',
    'transaction',
    'ticks_history',
    'forget',
    'proposal_open_contract',
    'proposal',
    'buy',
    'history', // only response, there is no `history` type but instead it is response type
];

// eslint-disable-next-line consistent-return
const log = (measures = [], req_type = '') => {
    if (!measures || !measures.length) return null;
    //eslint-disable-next-line no-console
    measures.forEach(measure => {
        datadogLogs.logger.info(measure.name, {
            name: measure.name,
            startTime: measure.startTimeDate,
            duration: measure.duration,
            detail: measure.detail,
        });
    });
    if (measures.length > 1) {
        const max = Math.max(...measures.map(i => i.duration));
        const min = Math.min(...measures.map(i => i.duration));

        //eslint-disable-next-line no-console
        console.log(`%c ${req_type} --- min: ${min}`, 'color: #00AB41');
        //eslint-disable-next-line no-console
        console.log(`%c ${req_type} --- max: ${max}`, 'color: #FF0000');
    }
};

const getRequestType = request => {
    let req_type;
    REQUESTS.forEach(type => {
        if (type in request && !req_type) req_type = type;
    });

    return req_type;
};

class APIMiddleware {
    constructor(config) {
        this.config = config;
        this.debounced_calls = {};
        this.addGlobalMethod();
    }

    sendIsCalled = ({ response_promise, args: [request] }) => {
        const req_type = getRequestType(request);
        if (req_type) performance.mark(`${req_type}_start`);
        response_promise.then(res => {
            const res_type = getRequestType(res);
            if (res_type) {
                let measure;
                if (res_type === 'history') {
                    performance.mark('ticks_history_end');
                    measure = performance.measure('ticks_history', 'ticks_history_start', 'ticks_history_end');
                } else {
                    performance.mark(`${res_type}_end`);
                    measure = performance.measure(`${res_type}`, `${res_type}_start`, `${res_type}_end`);
                }
                measure.startTimeDate = new Date(Date.now() - measure.startTime);
            }
        });
        return response_promise;
    };

    sendRequestsStatistic = () => {
        REQUESTS.forEach(req_type => {
            const measure = performance.getEntriesByName(req_type);
            if (measure && measure.length) {
                log(measure, req_type);
            }
        });
        performance.clearMeasures();
    };

    addGlobalMethod() {
        if (window) window.sendRequestsStatistic = this.sendRequestsStatistic;
    }
}

export default APIMiddleware;

const moment = require('moment');
const BinarySocket = require('./socket_base');
const PromiseUtils = require('@deriv-com/utils').PromiseUtils;

const ServerTime = (() => {
    let clock_started = false;
    const pending = PromiseUtils.createPromise();
    let server_time, performance_request_time, get_time_interval, update_time_interval, onTimeUpdated;

    const init = fncTimeUpdated => {
        if (!clock_started) {
            onTimeUpdated = fncTimeUpdated;
            requestTime();
            clearInterval(get_time_interval);
            get_time_interval = setInterval(requestTime, 30000);
            clock_started = true;
        }
    };

    const requestTime = () => {
        performance_request_time = performance.now();
        BinarySocket.send({ time: 1 }).then(timeCounter);
    };

    const timeCounter = response => {
        if (response.error) return;

        if (!clock_started) {
            init();
            return;
        }

        clearInterval(update_time_interval);

        const start_timestamp = response.time;
        const performance_response_time = performance.now();
        const time_taken = performance_response_time - performance_request_time;
        const server_time_at_response = start_timestamp * 1000 + time_taken;

        const updateTime = () => {
            const time_since_response = performance.now() - performance_response_time;
            server_time = moment(server_time_at_response + time_since_response).utc();

            if (typeof onTimeUpdated === 'function') {
                onTimeUpdated();
            }
        };
        updateTime();
        pending.resolve();
        update_time_interval = setInterval(updateTime, 1000);
    };

    // eslint-disable-next-line no-confusing-arrow
    const get = () => (server_time ? server_time.clone() : undefined);

    return {
        init,
        get,
        timePromise: pending.promise,
    };
})();

module.exports = ServerTime;

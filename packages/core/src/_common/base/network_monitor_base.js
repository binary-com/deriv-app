const { localize } = require('@deriv/translations');
const BinarySocket = require('./socket_base');

/*
 * Monitors the network status and initialises the WebSocket connection
 * 1. online : check the WS status (init/send: blink after timeout, open/message: online)
 * 2. offline: it is offline
 */
const NetworkMonitorBase = (() => {
    const status_config = {
        online: { class: 'online', tooltip: localize('Online') },
        offline: { class: 'offline', tooltip: localize('Offline') },
        blinking: { class: 'blinker', tooltip: localize('Connecting to server') },
    };

    let setNetworkStatus;

    const init = (socket_general_functions, fncUpdateUI, client_store) => {
        let last_status, last_is_online;
        setNetworkStatus = status => {
            const is_online = isOnline();
            if (status !== last_status || is_online !== last_is_online) {
                last_status = status;
                last_is_online = is_online;
                fncUpdateUI(status_config[status], is_online);
            }
        };

        if ('onLine' in navigator) {
            window.addEventListener('online', () => {
                setNetworkStatus('blinking');
                reconnectAfter({ timeout: 500 });
            });
            window.addEventListener('offline', () => {
                BinarySocket.close();
                setNetworkStatus('offline');
            });
        }

        if (isOnline()) {
            const ws_config = { wsEvent, isOnline, ...socket_general_functions };
            BinarySocket.init({ options: ws_config, client: client_store });
            BinarySocket.openNewConnection();
        }

        setNetworkStatus(isOnline() ? 'blinking' : 'offline');
    };

    const isOnline = () => navigator.onLine;

    // reconnect after timout,
    // if the network status is online
    // and the connection is closed or closing.
    let reconnect_timeout = null;
    function reconnectAfter({ timeout }) {
        clearTimeout(reconnect_timeout);
        reconnect_timeout = setTimeout(() => {
            reconnect_timeout = null;
            if (isOnline() && BinarySocket.hasReadyState(2, 3)) {
                BinarySocket.openNewConnection();
            } else {
                BinarySocket.send({ ping: 1 }); // get stable status sooner
            }
        }, timeout);
    }
    const events = {
        init: () => setNetworkStatus(isOnline() ? 'blinking' : 'offline'),
        open: () => setNetworkStatus(isOnline() ? 'online' : 'offline'),
        send: () => {},
        message: () => setNetworkStatus('online'),
        close: () => {
            setNetworkStatus(isOnline() ? 'blinking' : 'offline');
            reconnectAfter({ timeout: 5000 });
        },
    };

    const wsEvent = event => {
        events[event] && events[event](); // eslint-disable-line
    };

    return {
        init,
        wsEvent,
    };
})();

module.exports = NetworkMonitorBase;

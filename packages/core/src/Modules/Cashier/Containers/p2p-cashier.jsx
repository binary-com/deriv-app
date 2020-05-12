import React from 'react';
import PropTypes from 'prop-types';
import P2P from '@deriv/p2p';
import { getLanguage } from '@deriv/translations';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import ServerTime from '_common/base/server_time';

/* P2P will use the same websocket connection as Deriv/Binary, we need to pass it as a prop */
const P2PCashier = ({ currency, local_currency_config, is_virtual, residence, setNotificationCount }) => (
    <P2P
        websocket_api={WS}
        lang={getLanguage()}
        client={{ currency, local_currency_config, is_virtual, residence }}
        server_time={ServerTime}
        setNotificationCount={setNotificationCount}
    />
);

P2PCashier.propTypes = {
    currency: PropTypes.string,
    local_currency_config: PropTypes.object,
    is_virtual: PropTypes.bool,
    residence: PropTypes.string,
    setNotificationCount: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    currency: client.currency,
    local_currency_config: client.local_currency_config,
    is_virtual: client.is_virtual,
    residence: client.residence,
    setNotificationCount: modules.cashier.setNotificationCount,
}))(P2PCashier);

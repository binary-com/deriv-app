import React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';

const App = () => {
    return <div>Hello World</div>;
};

App.displayName = 'App';
App.propTypes = {
    client: PropTypes.shape({
        currency: PropTypes.string.isRequired,
        is_virtual: PropTypes.bool.isRequired,
        residence: PropTypes.string.isRequired,
    }),
    modal_root_id: PropTypes.string.isRequired,
    websocket_api: PropTypes.object.isRequired,
};

export default observer(App);

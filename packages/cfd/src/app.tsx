import PropTypes from 'prop-types';
import React from 'react';
import Routes from './Containers/routes';
import CFDDashboard from './Containers/cfd-dashboard';
import { MobxContentProvider } from './Stores/connect';
import initStore from './init-store'; // eslint-disable-line import/extensions

const App = ({ passthrough }: any) => {
    const [root_store] = React.useState(initStore(passthrough.root_store, passthrough.WS));
    React.useEffect(() => {
        return () => root_store.ui.setPromptHandler(false);
    }, []);

    return (
        <MobxContentProvider store={root_store}>
            <React.Fragment>
                <Routes />
                <CFDDashboard />
            </React.Fragment>
        </MobxContentProvider>
    );
};

App.propTypes = {
    passthrough: PropTypes.shape({
        root_store: PropTypes.object,
        WS: PropTypes.object,
    }),
};

export default App;

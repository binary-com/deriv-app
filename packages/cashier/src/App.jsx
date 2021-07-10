import React from 'react';
import { setWebsocket } from '@deriv/shared';
import { init } from '_common/server_time';
import Routes from 'Containers/routes.jsx';
import { MobxContentProvider } from 'Stores/connect';

class App extends React.Component {
    constructor(props) {
        super(props);
        const {
            passthrough: { WS, root_store },
        } = props;
        setWebsocket(WS);
        this.root_store = root_store;
        init();
    }

    render() {
        return (
            <MobxContentProvider store={this.root_store}>
                <Routes />
            </MobxContentProvider>
        );
    }
}

export default App;

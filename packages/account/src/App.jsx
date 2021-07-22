import React from 'react';
import { setWebsocket } from '@deriv/shared';
import Routes from 'Containers/routes.jsx';
import ResetTradingPassword from 'Containers/reset-trading-password.jsx';
import { MobxContentProvider } from 'Stores/connect';
import initStore from 'Stores/init-store';

class App extends React.Component {
    constructor(props) {
        super(props);
        const {
            passthrough: { WS, root_store },
        } = props;
        this.root_store = initStore(root_store, WS);
        setWebsocket(WS);
    }

    render() {
        return (
            <MobxContentProvider store={this.props.passthrough.root_store}>
                <Routes />
                <ResetTradingPassword />
            </MobxContentProvider>
        );
    }
}

export default App;

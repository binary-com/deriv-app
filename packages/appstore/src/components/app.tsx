import classNames from 'classnames';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { setWebsocket } from '@deriv/shared';
import Routes from 'Components/routes/routes';
import { useStores, initContext } from 'Stores';
import './app.scss';
import { CoreStoreTypes } from 'Stores/root-store';
import { CFDStore } from '@deriv/cfd';

type TAppProps = {
    passthrough: {
        root_store: CoreStoreTypes;
        WS: Record<string, any>;
    };
};

const App: React.FC<TAppProps> = ({ passthrough }: TAppProps) => {
    const { root_store, WS } = passthrough;
    initContext(root_store, WS);

    const initCFDStore = () => {
        root_store.modules.attachModule('cfd', new CFDStore({ root_store, WS }));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(initCFDStore, []);

    setWebsocket(WS);
    const { ui } = useStores();

    return (
        <main
            className={classNames('dashboard', {
                'theme--light': !ui.is_dark_mode_on,
                'theme--dark': ui.is_dark_mode_on,
            })}
        >
            <div className='dw-dashboard'>
                <Routes />
            </div>
        </main>
    );
};

export default observer(App);

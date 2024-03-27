import React from 'react';
import { when } from 'mobx';
import { routes, WS } from '@deriv/shared';
import PopulateHeader from './populate-header';
import { observer, useStore } from '@deriv/stores';
import TraderProviders from '../../trader-providers';
import { TCoreStores } from '@deriv/stores/types';
import { useDevice } from '@deriv/hooks';

type TradeHeaderExtensionsProps = {
    store: TCoreStores;
};

const TradeHeaderExtensions = observer(({ store }: TradeHeaderExtensionsProps) => {
    const { client, modules, ui, portfolio } = useStore();
    const { populateHeaderExtensions } = ui;
    const { onMount: onMountPositions } = portfolio;
    const { is_logged_in, is_populating_account_list } = client;
    const { onMountCommon: onMountCashier, setAccountSwitchListener } = modules.cashier.general_store;
    const { isDesktop } = useDevice();

    const show_positions_toggle = location.pathname !== routes.mt5;
    const show_component = is_logged_in && show_positions_toggle && !isDesktop;

    const populateHeaderfunction = React.useCallback(() => {
        const header_items = show_component ? (
            <TraderProviders store={store}>
                <PopulateHeader />
            </TraderProviders>
        ) : null;

        populateHeaderExtensions(header_items);
    }, [show_component, store, populateHeaderExtensions]);

    React.useEffect(() => {
        const waitForLogin = async () => {
            if (!isDesktop && show_positions_toggle) {
                await when(() => !is_populating_account_list); // Waits for login to complete
                if (is_logged_in) {
                    await WS.wait('authorize');
                    onMountPositions();
                    onMountCashier(true);
                    setAccountSwitchListener();
                }
            }

            populateHeaderfunction();
        };

        waitForLogin().catch(() => {
            // Do nothing: This is to remove the bug reported by SonarCloud about not having a catch statement here.
        });

        return () => populateHeaderExtensions(null);
    }, [
        onMountCashier,
        onMountPositions,
        populateHeaderfunction,
        populateHeaderExtensions,
        setAccountSwitchListener,
        store,
        show_positions_toggle,
        isDesktop,
        is_logged_in,
        is_populating_account_list,
    ]);

    React.useEffect(() => {
        populateHeaderfunction();
    }, [populateHeaderfunction]);

    return null;
});

export default TradeHeaderExtensions;

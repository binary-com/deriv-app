import PropTypes from 'prop-types';
import React from 'react';
import { when } from 'mobx';
import { MobileWrapper } from '@deriv/components';
import { isMobile, routes, WS } from '@deriv/shared';
import TogglePositionsMobile from 'App/Components/Elements/TogglePositions/toggle-positions-mobile.jsx';
import { connect, MobxContentProvider } from 'Stores/connect';

const TradeHeaderExtensions = props => {
    const {
        disableApp,
        enableApp,
        onMountCashier,
        onMountPositions,
        onPositionsCancel,
        onPositionsRemove,
        onPositionsSell,
        onUnmountPositions,
        populateHeaderExtensions,
        setAccountSwitchListener,
        store,
    } = props;

    const props_ref = React.useRef();
    props_ref.current = props;

    const show_positions_toggle = location.pathname !== routes.mt5;

    const populateHeader = React.useCallback(() => {
        const {
            is_logged_in,
            is_positions_empty,
            active_positions_count,
            positions,
            positions_currency,
            positions_error,
        } = props_ref.current;

        const header_items = is_logged_in && show_positions_toggle && (
            <MobileWrapper>
                <MobxContentProvider store={store}>
                    <TogglePositionsMobile
                        active_positions_count={active_positions_count}
                        all_positions={positions}
                        currency={positions_currency}
                        disableApp={disableApp}
                        is_empty={is_positions_empty}
                        enableApp={enableApp}
                        error={positions_error}
                        onClickSell={onPositionsSell}
                        onClickRemove={onPositionsRemove}
                        onClickCancel={onPositionsCancel}
                    />
                </MobxContentProvider>
            </MobileWrapper>
        );

        populateHeaderExtensions(header_items);
    }, [
        disableApp,
        enableApp,
        onPositionsCancel,
        onPositionsRemove,
        onPositionsSell,
        populateHeaderExtensions,
        store,
        show_positions_toggle,
    ]);

    React.useEffect(() => {
        const waitForLogin = async () => {
            if (isMobile() && show_positions_toggle) {
                const { client } = store;
                // Waits for login to complete
                await when(() => !client.is_populating_account_list);
                if (props_ref.current.is_logged_in) {
                    await WS.wait('authorize');
                    onMountPositions();
                    onMountCashier(true);
                    setAccountSwitchListener();
                }
            }

            populateHeader();
        };

        waitForLogin();

        return () => {
            if (isMobile()) onUnmountPositions();
            populateHeaderExtensions(null);
        };
    }, [
        onMountCashier,
        onMountPositions,
        onUnmountPositions,
        populateHeader,
        populateHeaderExtensions,
        setAccountSwitchListener,
        store,
        show_positions_toggle,
    ]);

    React.useEffect(() => {
        populateHeader();
    });

    return null;
};

TradeHeaderExtensions.propTypes = {
    is_logged_in: PropTypes.bool,
    populateHeaderExtensions: PropTypes.func,
};

export default connect(({ client, modules, ui }) => ({
    positions_currency: client.currency,
    is_logged_in: client.is_logged_in,
    positions: modules.portfolio.all_positions,
    positions_error: modules.portfolio.error,
    is_positions_empty: modules.portfolio.is_empty,
    onPositionsSell: modules.portfolio.onClickSell,
    onPositionsRemove: modules.portfolio.removePositionById,
    onPositionsCancel: modules.portfolio.onClickCancel,
    onMountCashier: modules.cashier.general.onMountCommon,
    onMountPositions: modules.portfolio.onMount,
    onUnmountPositions: modules.portfolio.onUnmount,
    active_positions_count: modules.portfolio.active_positions_count,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    populateHeaderExtensions: ui.populateHeaderExtensions,
    toggleUnsupportedContractModal: ui.toggleUnsupportedContractModal,
    setAccountSwitchListener: modules.cashier.general.setAccountSwitchListener,
}))(TradeHeaderExtensions);

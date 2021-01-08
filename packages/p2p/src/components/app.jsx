import classNames from 'classnames';
import React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { isMobile } from '@deriv/shared';
import { Tabs, Modal } from '@deriv/components';
import ServerTime from 'Utils/server-time';
import { waitWS } from 'Utils/websocket';
import { useStores } from 'Stores';
import { localize, setLanguage } from './i18next';
import BuySell from './buy-sell/buy-sell.jsx';
import MyAds from './my-ads/my-ads.jsx';
import Orders from './orders/orders.jsx';
import NicknameForm from './nickname/nickname-form.jsx';
import Download from './verification/download.jsx';
import Verification from './verification/verification.jsx';
import MyProfile from './my-profile';
import './app.scss';

const allowed_currency = 'USD';

const P2pWrapper = ({ className, children }) => (
    <main className={classNames('p2p-cashier', className)}>{children}</main>
);

const App = observer(props => {
    const { general_store, order_store } = useStores();
    const { className, is_mobile, lang, order_id, server_time, should_show_verification, websocket_api } = props;
    general_store.setAppProps(props);
    general_store.setWebsocketInit(websocket_api, general_store.client.local_currency_config.decimal_places);
    order_store.setOrderId(order_id);

    React.useEffect(() => {
        setLanguage(lang);
        ServerTime.init(server_time);

        // force safari refresh on back/forward
        window.onpageshow = function (event) {
            if (event.persisted) {
                window.location.reload();
            }
        };

        waitWS('authorize').then(() => {
            general_store.onMount();
        });

        return () => general_store.onUnmount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (order_id) {
            general_store.redirectTo('orders');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);

    // TODO: remove allowed_currency check once we publish this to everyone
    if (general_store.client.is_virtual || general_store.client.currency !== allowed_currency) {
        return (
            <h1 className='p2p-not-allowed'>
                {localize('This feature is only available for real-money USD accounts right now.')}
            </h1>
        );
    }

    const wrapper_props = { className };

    if (general_store.show_popup) {
        return (
            <P2pWrapper {...wrapper_props}>
                {isMobile() ? (
                    <div className='p2p-nickname__dialog'>
                        <NicknameForm
                            handleClose={general_store.onNicknamePopupClose}
                            handleConfirm={general_store.toggleNicknamePopup}
                            is_mobile
                        />
                    </div>
                ) : (
                    <Modal is_open={general_store.show_popup} className='p2p-nickname__dialog'>
                        <NicknameForm
                            handleClose={general_store.onNicknamePopupClose}
                            handleConfirm={general_store.toggleNicknamePopup}
                        />
                    </Modal>
                )}
            </P2pWrapper>
        );
    }

    if (should_show_verification) {
        if (general_store.is_advertiser) {
            return (
                <P2pWrapper {...wrapper_props}>
                    <Download />
                </P2pWrapper>
            );
        }

        return (
            <P2pWrapper {...wrapper_props}>
                <div
                    className={classNames('p2p-cashier__verification', {
                        'p2p-cashier__verification--mobile': is_mobile,
                    })}
                >
                    <Verification />
                </div>
            </P2pWrapper>
        );
    }

    return (
        <P2pWrapper {...wrapper_props}>
            <Tabs
                onTabItemClick={general_store.handleTabClick}
                active_index={general_store.active_index}
                className='p2p-cashier__tabs'
                top
                header_fit_content={!isMobile()}
                is_100vw={isMobile()}
            >
                <div label={localize('Buy / Sell')}>
                    <BuySell />
                </div>
                <div count={general_store.notification_count} label={localize('Orders')}>
                    <Orders
                        navigate={general_store.redirectTo}
                        params={general_store.parameters}
                        chat_info={general_store.chat_info}
                    />
                </div>
                <div label={localize('My ads')}>
                    <MyAds />
                </div>
                {general_store.is_advertiser && (
                    <div label={localize('My profile')}>
                        <MyProfile />
                    </div>
                )}
            </Tabs>
        </P2pWrapper>
    );
});

App.displayName = 'App';
App.propTypes = {
    client: PropTypes.shape({
        currency: PropTypes.string.isRequired,
        custom_strings: PropTypes.shape({
            email_domain: PropTypes.string,
        }),
        is_virtual: PropTypes.bool.isRequired,
        local_currency_config: PropTypes.shape({
            currency: PropTypes.string.isRequired,
            decimal_places: PropTypes.number,
        }).isRequired,
        loginid: PropTypes.string.isRequired,
        residence: PropTypes.string.isRequired,
    }),
    lang: PropTypes.string,
    modal_root_id: PropTypes.string.isRequired,
    order_id: PropTypes.string,
    setNotificationCount: PropTypes.func,
    websocket_api: PropTypes.object.isRequired,
};

export default App;

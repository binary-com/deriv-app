import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { ThemedScrollbars } from '@deriv/components';
import { getFormattedText } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import Chat from 'Components/orders/chat/chat.jsx';
import OrderDetailsFooter from 'Components/orders/order-details/order-details-footer.jsx';
import OrderDetailsTimer from 'Components/orders/order-details/order-details-timer.jsx';
import OrderInfoBlock from 'Components/orders/order-details/order-info-block.jsx';
import OrderDetailsWrapper from 'Components/orders/order-details/order-details-wrapper.jsx';
import { useStores } from 'Stores';
import { requestWS } from 'Utils/websocket';
import 'Components/orders/order-details/order-details.scss';

const OrderDetails = observer(({ onPageReturn }) => {
    const { general_store, sendbird_store } = useStores();
    const {
        account_currency,
        advert_details,
        amount_display,
        chat_channel_url: order_channel_url,
        contact_info,
        has_timer_expired,
        id,
        is_buy_order,
        is_buyer_confirmed_order,
        is_my_ad,
        is_pending_order,
        is_sell_order,
        labels,
        local_currency,
        other_user_details,
        payment_info,
        price,
        purchase_time,
        rate,
        should_highlight_alert,
        should_highlight_danger,
        should_highlight_success,
        should_show_order_footer,
        status_string,
    } = general_store.order_information;

    const { chat_channel_url, setChatChannelUrl } = sendbird_store;

    React.useEffect(() => {
        const disposeListeners = sendbird_store.registerEventListeners();
        const disposeReactions = sendbird_store.registerMobXReactions();

        return () => {
            disposeListeners();
            disposeReactions();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
        if (order_channel_url) {
            setChatChannelUrl(order_channel_url);
        } else {
            // If order_information doesn't have "order_channel_url" this is a new order
            // and we need to instruct BE to create a chat on Sendbird's side.
            requestWS({ p2p_chat_create: 1, order_id: id }).then(response => {
                if (response.error) {
                    // TODO: Handle error.
                    return;
                }

                setChatChannelUrl(response.p2p_chat_create);
            });
        }
    }, [id, order_channel_url, setChatChannelUrl]);

    const page_title =
        (is_buy_order && !is_my_ad) || (is_sell_order && is_my_ad)
            ? localize('Buy {{offered_currency}} order', { offered_currency: account_currency })
            : localize('Sell {{offered_currency}} order', { offered_currency: account_currency });

    return (
        <OrderDetailsWrapper page_title={page_title} onPageReturn={onPageReturn}>
            <div className='order-details'>
                <div className='order-details-card'>
                    <div className='order-details-card__header'>
                        <div className='order-details-card__header--left'>
                            <div
                                className={classNames(
                                    'order-details-card__header-status',
                                    'order-details-card__header-status--info',
                                    {
                                        'order-details-card__header-status--alert': should_highlight_alert,
                                        'order-details-card__header-status--danger': should_highlight_danger,
                                        'order-details-card__header-status--success': should_highlight_success,
                                    }
                                )}
                            >
                                {status_string}
                            </div>
                            {should_highlight_success && (
                                <div className='order-details-card__message'>{labels.result_string}</div>
                            )}
                            {!has_timer_expired && (is_pending_order || is_buyer_confirmed_order) && (
                                <div className='order-details-card__header-amount'>
                                    {getFormattedText(price, local_currency)}
                                </div>
                            )}
                            <div className='order-details-card__header-id'>
                                <Localize i18n_default_text='Order ID {{ id }}' values={{ id }} />
                            </div>
                        </div>
                        <div className='order-details-card__header--right'>
                            <OrderDetailsTimer order_information={general_store.order_information} />
                        </div>
                    </div>
                    <ThemedScrollbars height='unset' className='order-details-card__info'>
                        <div className='order-details-card__info-columns'>
                            <div className='order-details-card__info--left'>
                                <OrderInfoBlock label={labels.other_party_role} value={other_user_details.name} />
                            </div>
                            <div className='order-details-card__info--right'>
                                <OrderInfoBlock
                                    label={localize('Rate (1 {{ account_currency }})', { account_currency })}
                                    value={getFormattedText(rate, local_currency)}
                                />
                            </div>
                        </div>
                        <div className='order-details-card__info-columns'>
                            <div className='order-details-card__info--left'>
                                <OrderInfoBlock
                                    label={labels.left_send_or_receive}
                                    value={getFormattedText(price, local_currency)}
                                />
                                <OrderInfoBlock label={localize('Time')} value={purchase_time} />
                            </div>
                            <div className='order-details-card__info--right'>
                                <OrderInfoBlock
                                    label={labels.right_send_or_receive}
                                    value={`${amount_display} ${account_currency}`}
                                />
                            </div>
                        </div>
                        <OrderInfoBlock label={labels.payment_details} value={payment_info || '-'} />
                        <OrderInfoBlock label={labels.contact_details} value={contact_info || '-'} />
                        <OrderInfoBlock label={labels.instructions} value={advert_details.description || '-'} />
                    </ThemedScrollbars>
                    {should_show_order_footer && (
                        <OrderDetailsFooter order_information={general_store.order_information} />
                    )}
                </div>
                {chat_channel_url && <Chat />}
            </div>
        </OrderDetailsWrapper>
    );
});

OrderDetails.propTypes = {
    chat_channel_url: PropTypes.string,
    order_information: PropTypes.object,
    onPageReturn: PropTypes.func,
    setChatChannelUrl: PropTypes.func,
};

export default OrderDetails;

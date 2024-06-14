import React from 'react';
import { useStore, observer } from '@deriv/stores';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { millisecondsToTimer } from 'Utils/date-time';
import { createExtendedOrderDetails } from 'Utils/orders';
import { getDistanceToServerTime } from 'Utils/server_time';
import { useStores } from 'Stores';
import { DesktopWrapper, Icon, MobileOrTabletWrapper, Table, Text } from '@deriv/components';
import { formatMoney, routes } from '@deriv/shared';
import { localize } from 'Components/i18next';
import RatingCellRenderer from 'Components/rating-cell-renderer';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import './order-table-row.scss';

const Title = ({ send_amount, currency, order_type, purchase_time }) => {
    return (
        <React.Fragment>
            <Text size='sm' color='prominent' line_height='xxs' weight='bold' as='p'>
                {order_type} {formatMoney(currency, send_amount, true)} {currency}
            </Text>
            <Text color='less-prominent' as='p' line_height='xxs' size='xxs' align='left'>
                {purchase_time}
            </Text>
        </React.Fragment>
    );
};

const OrderRow = ({ row: order }) => {
    const getTimeLeft = time => {
        const distance = getDistanceToServerTime(time);
        return {
            distance,
            label: distance < 0 ? localize('expired') : millisecondsToTimer(distance),
        };
    };
    const { general_store, order_store, sendbird_store } = useStores();
    const {
        notifications: { removeNotificationByKey, removeNotificationMessage },
        client: { loginid },
    } = useStore();

    const [order_state, setOrderState] = React.useState(order); // Use separate state to force refresh when (FE-)expired.
    const [is_timer_visible, setIsTimerVisible] = React.useState();
    const should_show_order_details = React.useRef(true);
    const { showModal, hideModal } = useModalManagerContext() || {};

    const {
        account_currency,
        amount_display,
        has_review_details,
        id,
        is_buy_order_for_user,
        is_completed_order,
        is_order_reviewable,
        is_user_recommended_previously,
        local_currency,
        order_expiry_milliseconds,
        other_user_details,
        price_display,
        purchase_time,
        rating,
        should_highlight_alert,
        should_highlight_danger,
        should_highlight_disabled,
        should_highlight_success,
        status_string,
    } = order_state;

    const offer_amount = `${amount_display} ${account_currency}`;
    const transaction_amount = `${Number(price_display).toFixed(2)} ${local_currency}`;
    const order_type = is_buy_order_for_user ? localize('Buy') : localize('Sell');

    const [remaining_time, setRemainingTime] = React.useState(getTimeLeft(order_expiry_milliseconds).label);
    const interval = React.useRef(null);

    const history = useHistory();
    const location = useLocation();

    const isOrderSeen = order_id => {
        const { notifications } = general_store.getLocalStorageSettingsForLoginId();
        return notifications.some(notification => notification.order_id === order_id && notification.is_seen === true);
    };

    const onRowClick = () => {
        if (should_show_order_details.current) {
            const current_query_params = new URLSearchParams(location.search);

            current_query_params.append('order', order.id);

            history.replace({
                pathname: routes.p2p_orders,
                search: current_query_params.toString(),
                hash: location.hash,
            });

            return order_store.setOrderId(order.id);
        }

        return () => {};
    };

    const showRatingModal = () => {
        showModal({
            key: 'RatingModal',
            props: {
                is_buy_order_for_user,
                is_user_recommended_previously,
                onClickDone: () => {
                    order_store.setOrderRating(id);
                    hideModal();
                    should_show_order_details.current = true;
                    order_store.setRatingValue(0);
                    removeNotificationMessage({ key: `p2p_order_${id}` });
                    removeNotificationByKey({ key: `p2p_order_${id}` });
                    order_store.setIsLoading(true);
                    order_store.setOrders([]);
                    order_store.loadMoreOrders({ startIndex: 0 });
                },
                onClickSkip: () => {
                    order_store.setRatingValue(0);
                    hideModal();
                    should_show_order_details.current = true;
                },
            },
        });
    };

    React.useEffect(() => {
        const countDownTimer = () => {
            const { distance, label } = getTimeLeft(order_expiry_milliseconds);

            if (distance < 0) {
                setRemainingTime(label);
                setOrderState(createExtendedOrderDetails(order.order_details, loginid, general_store.server_time));
                clearInterval(interval.current);
                setIsTimerVisible(false);
            } else {
                setRemainingTime(label);
                setIsTimerVisible(general_store.is_active_tab);
            }
        };

        interval.current = setInterval(countDownTimer, 1000);
        return () => clearInterval(interval.current);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <React.Fragment>
            <div onClick={onRowClick}>
                <DesktopWrapper>
                    <Table.Row
                        className={classNames('order-table-row order-table-grid', {
                            'order-table-grid--active': general_store.is_active_tab,
                            'order-table-row--attention': !isOrderSeen(id),
                        })}
                    >
                        {!general_store.is_active_tab && <Table.Cell>{purchase_time}</Table.Cell>}
                        <Table.Cell>{order_type}</Table.Cell>
                        <Table.Cell>{id}</Table.Cell>
                        <Table.Cell>{other_user_details.name}</Table.Cell>
                        <Table.Cell>
                            <Text
                                as='div'
                                size='xxs' // TODO: Change the font-size once design is ready
                                weight='bold'
                                className={classNames('order-table-status', {
                                    'order-table-status--danger': should_highlight_danger,
                                    'order-table-status--alert': should_highlight_alert,
                                    'order-table-status--success': should_highlight_success,
                                    'order-table-status--disabled': should_highlight_disabled,
                                })}
                            >
                                {status_string}
                            </Text>
                        </Table.Cell>
                        <Table.Cell>{is_buy_order_for_user ? transaction_amount : offer_amount}</Table.Cell>
                        <Table.Cell>{is_buy_order_for_user ? offer_amount : transaction_amount}</Table.Cell>
                        <Table.Cell>
                            {general_store.is_active_tab ? (
                                <div className='order-table-row-time'>
                                    <Text align='center' size='xxs'>
                                        {remaining_time}
                                    </Text>
                                </div>
                            ) : (
                                is_completed_order && (
                                    <RatingCellRenderer
                                        has_review_details={has_review_details}
                                        is_reviewable={!!is_order_reviewable}
                                        rating={rating}
                                        onClickUserRatingButton={() => {
                                            should_show_order_details.current = false;
                                            showRatingModal();
                                        }}
                                    />
                                )
                            )}
                        </Table.Cell>
                    </Table.Row>
                </DesktopWrapper>
                <MobileOrTabletWrapper>
                    <Table.Row
                        className={classNames('orders__mobile', {
                            'orders__mobile--attention': !isOrderSeen(id),
                        })}
                    >
                        <Table.Cell
                            className={classNames('orders__mobile-header', {
                                'order-table-grid--active': general_store.is_active_tab,
                            })}
                        >
                            <Text
                                as='div'
                                align='center'
                                size='xxs' // TODO: Change the font-size once design is ready
                                weight='bold'
                                className={classNames('orders__mobile-status', {
                                    'order-table-status--danger': should_highlight_danger,
                                    'order-table-status--alert': should_highlight_alert,
                                    'order-table-status--success': should_highlight_success,
                                    'order-table-status--disabled': should_highlight_disabled,
                                })}
                            >
                                {status_string}
                            </Text>
                        </Table.Cell>
                        <Table.Cell className='orders__mobile-header-right'>
                            {is_timer_visible && (
                                <Text
                                    size='xxs'
                                    color='prominent'
                                    align='center'
                                    line_height='l'
                                    className='orders__mobile-time'
                                >
                                    {remaining_time}
                                </Text>
                            )}
                            {general_store.is_active_tab ? (
                                <div className='orders__mobile-chat'>
                                    <Icon
                                        icon='IcChat'
                                        height={15}
                                        width={16}
                                        onClick={() => {
                                            order_store.setShouldNavigateToOrderDetails(true);
                                            sendbird_store.setShouldShowChatModal(true);
                                            sendbird_store.setShouldShowChatOnOrders(true);
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className='orders__mobile-chat'>
                                    {is_completed_order && (
                                        <RatingCellRenderer
                                            has_review_details={has_review_details}
                                            is_reviewable={!!is_order_reviewable}
                                            rating={rating}
                                            onClickUserRatingButton={() => {
                                                should_show_order_details.current = false;
                                                showRatingModal();
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        </Table.Cell>
                        <Table.Cell className='orders__mobile-title'>
                            <Title
                                send_amount={amount_display}
                                currency={account_currency}
                                order_type={order_type}
                                purchase_time={purchase_time}
                            />
                        </Table.Cell>
                    </Table.Row>
                </MobileOrTabletWrapper>
            </div>
        </React.Fragment>
    );
};

OrderRow.propTypes = {
    order: PropTypes.object,
    row: PropTypes.object,
    server_time: PropTypes.object,
};

export default observer(OrderRow);

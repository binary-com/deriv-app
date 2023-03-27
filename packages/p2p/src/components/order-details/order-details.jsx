import classNames from 'classnames';
import React from 'react';
import { Button, HintBox, Icon, Text, ThemedScrollbars } from '@deriv/components';
import { formatMoney, isDesktop, isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import Chat from 'Components/orders/chat/chat.jsx';
import StarRating from 'Components/star-rating';
import UserRatingButton from 'Components/user-rating-button';
import OrderDetailsFooter from 'Components/order-details/order-details-footer.jsx';
import OrderDetailsTimer from 'Components/order-details/order-details-timer.jsx';
import OrderInfoBlock from 'Components/order-details/order-info-block.jsx';
import OrderDetailsWrapper from 'Components/order-details/order-details-wrapper.jsx';
import P2PAccordion from 'Components/p2p-accordion/p2p-accordion.jsx';
import { useStores } from 'Stores';
import PaymentMethodAccordionHeader from './payment-method-accordion-header.jsx';
import PaymentMethodAccordionContent from './payment-method-accordion-content.jsx';
import MyProfileSeparatorContainer from '../my-profile/my-profile-separator-container';
import { setDecimalPlaces, removeTrailingZeros, roundOffDecimal } from 'Utils/format-value';
import EmailLinkBlockedModal from '../email-link-blocked-modal';
import { getDateAfterHours } from 'Utils/date-time';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import 'Components/order-details/order-details.scss';

const OrderDetails = observer(() => {
    const { general_store, my_profile_store, order_store, sendbird_store, buy_sell_store } = useStores();
    const { hideModal, showModal, useRegisterModalProps } = useModalManagerContext();

    const {
        account_currency,
        advert_details,
        amount_display,
        chat_channel_url: order_channel_url,
        completion_time,
        contact_info,
        has_timer_expired,
        id,
        is_active_order,
        is_buy_order_for_user,
        is_buyer_confirmed_order,
        is_completed_order,
        is_pending_order,
        is_reviewable,
        is_user_recommended_previously,
        labels,
        local_currency,
        other_user_details,
        payment_info,
        previous_recommendation,
        purchase_time,
        rate,
        review_details,
        should_highlight_alert,
        should_highlight_danger,
        should_highlight_success,
        should_show_lost_funds_banner,
        should_show_order_footer,
        status_string,
    } = order_store?.order_information;

    const { chat_channel_url } = sendbird_store;

    const [should_expand_all, setShouldExpandAll] = React.useState(false);
    const [remaining_review_time, setRemainingReviewTime] = React.useState(null);

    const page_title = is_buy_order_for_user
        ? localize('Buy {{offered_currency}} order', { offered_currency: account_currency })
        : localize('Sell {{offered_currency}} order', { offered_currency: account_currency });

    const rating_average_decimal = review_details ? Number(review_details.rating).toFixed(1) : undefined;

    const showRatingModal = () => {
        showModal({
            key: 'RatingModal',
        });
    };

    React.useEffect(() => {
        const disposeListeners = sendbird_store.registerEventListeners();
        const disposeReactions = sendbird_store.registerMobXReactions();

        order_store.getSettings();
        order_store.getWebsiteStatus();
        order_store.setRatingValue(0);
        order_store.setIsRecommended(undefined);
        my_profile_store.getPaymentMethodsList();

        const handleChatChannelCreation = () => {
            if (order_channel_url) {
                sendbird_store.setChatChannelUrl(order_channel_url);
            } else {
                sendbird_store.createChatForNewOrder(order_store.order_id);
            }
        };

        // TODO: remove condition check and settimeout once access chat_channel_url from p2p_order_create is activated in BO, since chat channel url response is always delayed
        // Added delay only for first time order creation, since response is delayed. To be removed after feature release.
        if (buy_sell_store.is_create_order_subscribed) {
            setTimeout(() => {
                handleChatChannelCreation();
            }, 1250);
        } else {
            handleChatChannelCreation();
        }

        return () => {
            disposeListeners();
            disposeReactions();
            order_store.setOrderPaymentMethodDetails(undefined);
            order_store.setOrderId(null);
            order_store.setActiveOrder(null);
            general_store.props.setP2POrderProps({
                order_id: order_store.order_id,
                redirectToOrderDetails: general_store.redirectToOrderDetails,
                setIsRatingModalOpen: is_open => (is_open ? showRatingModal : hideModal),
            });
            buy_sell_store.setIsCreateOrderSubscribed(false);
            buy_sell_store.unsubscribeCreateOrder();
            sendbird_store.setHasChatError(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
        if (completion_time) {
            setRemainingReviewTime(getDateAfterHours(completion_time, general_store.review_period));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completion_time]);

    useRegisterModalProps({
        key: 'RatingModal',
        props: {
            is_buy_order_for_user,
            is_user_recommended_previously,
            onClickDone: () => {
                order_store.setOrderRating(id);
                general_store.props.removeNotificationMessage({
                    key: `order-${id}`,
                });
                general_store.props.removeNotificationByKey({
                    key: `order-${id}`,
                });
            },
            onClickSkip: () => {
                order_store.setRatingValue(0);
                hideModal();
            },
            previous_recommendation,
        },
    });

    if (sendbird_store.should_show_chat_on_orders) {
        return <Chat />;
    }

    const display_payment_amount = removeTrailingZeros(
        formatMoney(local_currency, amount_display * roundOffDecimal(rate, setDecimalPlaces(rate, 6)), true)
    );
    const rate_amount = removeTrailingZeros(formatMoney(local_currency, rate, true, 6));

    return (
        <OrderDetailsWrapper page_title={page_title}>
            {should_show_lost_funds_banner && (
                <div className='order-details--warning'>
                    <HintBox
                        icon='IcAlertWarning'
                        message={
                            <Text size='xxxs' color='prominent' line_height='xs'>
                                <Localize i18n_default_text="Don't risk your funds with cash transactions. Use bank transfers or e-wallets instead." />
                            </Text>
                        }
                        is_warn
                    />
                </div>
            )}
            {!is_buy_order_for_user && (
                <React.Fragment>
                    <EmailLinkBlockedModal
                        email_link_blocked_modal_error_message={order_store.verification_link_error_message}
                        is_email_link_blocked_modal_open={order_store.is_email_link_blocked_modal_open}
                        setIsEmailLinkBlockedModalOpen={order_store.setIsEmailLinkBlockedModalOpen}
                    />
                </React.Fragment>
            )}
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
                                    {display_payment_amount} {local_currency}
                                </div>
                            )}
                            <div className='order-details-card__header-id'>
                                <Localize i18n_default_text='Order ID {{ id }}' values={{ id }} />
                            </div>
                        </div>
                        <div className='order-details-card__header--right'>
                            <OrderDetailsTimer />
                        </div>
                    </div>
                    <ThemedScrollbars height='unset' className='order-details-card__info'>
                        <div className='order-details-card__info-columns'>
                            <div className='order-details-card__info--left'>
                                <OrderInfoBlock
                                    label={labels.counterparty_nickname_label}
                                    value={<Text size='xs'>{other_user_details.name}</Text>}
                                />
                            </div>
                            <div className='order-details-card__info--right'>
                                <OrderInfoBlock
                                    label={labels.counterparty_real_name_label}
                                    value={`${other_user_details.first_name} ${other_user_details.last_name}`}
                                />
                            </div>
                        </div>
                        <div className='order-details-card__info-columns'>
                            <div className='order-details-card__info--left'>
                                <OrderInfoBlock
                                    label={labels.left_send_or_receive}
                                    value={`${display_payment_amount} ${local_currency}`}
                                />
                                <OrderInfoBlock
                                    label={localize('Rate (1 {{ account_currency }})', { account_currency })}
                                    value={`${rate_amount} ${local_currency}`}
                                />
                            </div>
                            <div className='order-details-card__info--right'>
                                <OrderInfoBlock
                                    label={labels.right_send_or_receive}
                                    value={`${amount_display} ${account_currency}`}
                                />
                                <OrderInfoBlock label={localize('Time')} value={purchase_time} />
                            </div>
                        </div>
                        {is_active_order && (
                            <React.Fragment>
                                <MyProfileSeparatorContainer.Line className='order-details-card--line' />
                                {order_store?.has_order_payment_method_details ? (
                                    <div className='order-details-card--padding'>
                                        <section className='order-details-card__title'>
                                            <Text size='xs' weight='bold'>
                                                {labels.payment_details}
                                            </Text>
                                            <Button
                                                className='p2p-my-ads__expand-button'
                                                onClick={() => setShouldExpandAll(prev_state => !prev_state)}
                                                transparent
                                            >
                                                <Text size='xss' weight='bold' color='red'>
                                                    {should_expand_all
                                                        ? localize('Collapse all')
                                                        : localize('Expand all')}
                                                </Text>
                                            </Button>
                                        </section>
                                        <P2PAccordion
                                            className='order-details-card__accordion'
                                            icon_close='IcChevronRight'
                                            icon_open='IcChevronDown'
                                            list={order_store?.order_payment_method_details?.map(payment_method => ({
                                                header: (
                                                    <PaymentMethodAccordionHeader payment_method={payment_method} />
                                                ),
                                                content: (
                                                    <PaymentMethodAccordionContent payment_method={payment_method} />
                                                ),
                                                payment_method,
                                            }))}
                                            is_expand_all={should_expand_all}
                                            onChange={setShouldExpandAll}
                                        />
                                    </div>
                                ) : (
                                    <OrderInfoBlock
                                        className='order-details-card--padding'
                                        label={labels.payment_details}
                                        size='xs'
                                        weight='bold'
                                        value={payment_info || '-'}
                                    />
                                )}
                                <MyProfileSeparatorContainer.Line className='order-details-card--line' />
                                <OrderInfoBlock
                                    className='order-details-card--padding order-details-card__textbox'
                                    label={labels.contact_details}
                                    size='xs'
                                    weight='bold'
                                    value={contact_info || '-'}
                                />
                                <MyProfileSeparatorContainer.Line className='order-details-card--line' />
                                <OrderInfoBlock
                                    className='order-details-card--padding order-details-card__textbox'
                                    label={labels.instructions}
                                    size='xs'
                                    weight='bold'
                                    value={advert_details.description.trim() || '-'}
                                />
                            </React.Fragment>
                        )}
                        {is_completed_order && !review_details && (
                            <React.Fragment>
                                <MyProfileSeparatorContainer.Line className='order-details-card--rating__line' />
                                <div className='order-details-card--rating'>
                                    <UserRatingButton
                                        button_text={
                                            is_reviewable ? localize('Rate this transaction') : localize('Not rated')
                                        }
                                        is_disabled={!is_reviewable}
                                        large
                                        onClick={showRatingModal}
                                    />
                                </div>
                                <Text className='order-details-card--rating__text' color='less-prominent' size='xxxs'>
                                    {is_reviewable ? (
                                        remaining_review_time && (
                                            <Localize
                                                i18n_default_text='You have until {{remaining_review_time}} GMT to rate this transaction.'
                                                values={{ remaining_review_time }}
                                            />
                                        )
                                    ) : (
                                        <Localize i18n_default_text='You can no longer rate this transaction.' />
                                    )}
                                </Text>
                            </React.Fragment>
                        )}
                        {review_details && (
                            <React.Fragment>
                                <MyProfileSeparatorContainer.Line className='order-details-card--rating__line' />
                                <div className='order-details-card__ratings'>
                                    <Text color='prominent' size='s' weight='bold'>
                                        <Localize i18n_default_text='Your transaction experience' />
                                    </Text>
                                    <div className='order-details-card__ratings--row'>
                                        <StarRating
                                            empty_star_className='order-details-card__star'
                                            empty_star_icon='IcEmptyStar'
                                            full_star_className='order-details-card__star'
                                            full_star_icon='IcFullStar'
                                            initial_value={rating_average_decimal}
                                            is_readonly
                                            number_of_stars={5}
                                            should_allow_hover_effect={false}
                                            star_size={isMobile() ? 17 : 20}
                                        />
                                        <div className='order-details-card__ratings--row'>
                                            {review_details.recommended !== null &&
                                                (review_details.recommended ? (
                                                    <React.Fragment>
                                                        <Icon
                                                            className='order-details-card__ratings--icon'
                                                            custom_color='var(--status-success)'
                                                            icon='IcThumbsUp'
                                                            size={14}
                                                        />
                                                        <Text color='prominent' size='xxs'>
                                                            <Localize i18n_default_text='Recommended' />
                                                        </Text>
                                                    </React.Fragment>
                                                ) : (
                                                    <React.Fragment>
                                                        <Icon
                                                            className='order-details-card__ratings--icon'
                                                            custom_color='var(--status-danger)'
                                                            icon='IcThumbsDown'
                                                            size={14}
                                                        />
                                                        <Text color='prominent' size='xxs'>
                                                            <Localize i18n_default_text='Not Recommended' />
                                                        </Text>
                                                    </React.Fragment>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                        {should_show_order_footer && isDesktop() && (
                            <MyProfileSeparatorContainer.Line className='order-details-card--line' />
                        )}
                    </ThemedScrollbars>
                    {should_show_order_footer && isDesktop() && (
                        <OrderDetailsFooter order_information={order_store.order_information} />
                    )}
                </div>
                {chat_channel_url && <Chat />}
            </div>
        </OrderDetailsWrapper>
    );
});

export default OrderDetails;

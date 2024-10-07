import { P2POrderInfo } from '@deriv/api-types';
import { toMoment } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { order_status } from 'Constants/order-list';
import { convertToMillis, getFormattedDateString } from 'Utils/date-time';
import ServerTime from './server-time';

type TServerTime = typeof ServerTime;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ExtendedOrderDetails extends P2POrderInfo {}

class ExtendedOrderDetails {
    constructor(
        public order_details: P2POrderInfo,
        public loginid: string,
        public server_time: TServerTime
    ) {
        Object.assign(this, order_details);
    }

    // Order statuses

    /**
     * Function to check if order is a buy order based on the type
     *
     * @returns {boolean}
     */
    get is_buy_order() {
        return this.order_details.type === buy_sell.BUY;
    }

    /**
     * Function to check if order is a sell order based on the type
     *
     * @returns {boolean}
     */
    get is_sell_order() {
        return this.order_details.type === buy_sell.SELL;
    }

    /**
     * Function to check if the user has cancelled the order based on the status
     *
     * @returns {boolean}
     */
    get is_buyer_cancelled_order() {
        return this.order_details.status === order_status.CANCELLED;
    }

    /**
     * Function to check if the user has confirmed the order based on the status
     *
     * @returns {boolean}
     */
    get is_buyer_confirmed_order() {
        return this.order_details.status === order_status.BUYER_CONFIRMED;
    }

    /**
     * Function to check if the order is completed based on the status
     *
     * @returns {boolean}
     */
    get is_completed_order() {
        return this.order_details.status === order_status.COMPLETED;
    }

    /**
     * Function to check if the order is in a disputed state based on the status
     *
     * @returns {boolean}
     */
    get is_disputed_order() {
        return this.order_details.status === order_status.DISPUTED;
    }

    /**
     * Function to check if the order is in a dispute refunded state based on the status
     *
     * @returns {boolean}
     */
    get is_dispute_refunded_order() {
        return this.order_details.status === order_status.DISPUTE_REFUNDED;
    }

    /**
     * Function to check if the order is in a dispute completed state based on the status
     *
     * @returns {boolean}
     */
    get is_dispute_completed_order() {
        return this.order_details.status === order_status.DISPUTE_COMPLETED;
    }

    /**
     * Function to check if the order is expired based on the status
     *
     * @returns {boolean}
     */
    get is_expired_order() {
        return this.order_details.status === order_status.TIMED_OUT;
    }

    /**
     * Function to check if the order is incoming
     *
     * @returns {boolean}
     */
    get is_incoming_order() {
        return !!this.order_details.is_incoming;
    }

    /**
     * Function to check if the order is pending based on the status
     *
     * @returns {boolean}
     */
    get is_pending_order() {
        return this.order_details.status === order_status.PENDING;
    }

    /**
     * Function to check if the order is refunded based on the status
     *
     * @returns {boolean}
     */
    get is_refunded_order() {
        return this.order_details.status === order_status.REFUNDED;
    }

    /**
     * Function to check if the ad is the logged in user's ad based on login id from the advertiser's details
     *
     * @returns {boolean}
     */
    get is_my_ad() {
        return this.order_details?.advertiser_details?.loginid === this.loginid;
    }

    /**
     * Function to check if the order is not active
     *
     * @returns {boolean} true if order is cancelled, refunded, completed, dispute completed or dispute refunded
     */
    get is_inactive_order() {
        return this.is_finalised_order || this.is_dispute_completed_order || this.is_dispute_refunded_order;
    }

    /**
     * Function to check if the order is active
     *
     * @returns {boolean}
     */
    get is_active_order() {
        return !this.is_inactive_order;
    }

    /**
     * Function to check if the order is finalised
     *
     * @returns {boolean} true if order is completed, cancelled or refunded
     */
    get is_finalised_order() {
        return this.is_completed_order || this.is_buyer_cancelled_order || this.is_refunded_order;
    }

    /**
     * Function to check if the order has review details
     *
     * @returns {boolean}
     */
    get has_review_details() {
        return !!this.order_details?.review_details;
    }

    /**
     * Function to check if the order is reviewable
     *
     * @returns {boolean}
     */
    get is_order_reviewable() {
        return this.order_details.is_reviewable;
    }

    get is_pending_active() {
        return this.is_pending_order && this.is_active_order;
    }

    /**
     * Function to check if the user has any recommendations
     *
     * @returns {boolean}
     */
    get is_user_recommended_previously() {
        return this.is_my_ad
            ? this.order_details.client_details.is_recommended
            : this.order_details.advertiser_details.is_recommended;
    }

    /**
     * Function that returns the rating of the order
     *
     * @returns {number} rating
     */
    get rating() {
        return this.order_details?.review_details?.rating;
    }

    /**
     * Function that checks if the order is an ongoing order
     *
     * A happening order describes an order where an action has been taken by either side, i.e.
     * one side confirmed they've paid or received funds.
     *
     * @returns {boolean}
     */
    get is_ongoing_order() {
        return this.is_buyer_confirmed_order || this.is_buyer_cancelled_order;
    }

    /**
     * Function that checks if the order is a buy order for the user
     *
     * @returns {boolean}
     */
    get is_buy_order_for_user() {
        return (this.is_buy_order && !this.is_my_ad) || (this.is_sell_order && this.is_my_ad);
    }

    /**
     * Function that checks if the order is already expired
     *
     * This boolean is used to fix a backend feature where they will only
     * expire orders once a minute, as a result FE will incorrectly show
     * orders as active when they're actually expired. This boolean is used
     * as an extra check to ensure orders look expired on FE.
     *
     * @returns {boolean}
     */
    get has_timer_expired() {
        const server_time_moment = toMoment(this.server_time.get());
        const expiry_time_moment = toMoment(this.order_details.expiry_time);
        return server_time_moment.isAfter(expiry_time_moment);
    }

    /**
     * Function to get the remaining seconds of the order
     *
     * @returns {number} remaining seconds
     */
    get remaining_seconds() {
        const server_time_moment = this.server_time.get();
        const expiry_time_moment = toMoment(this.order_details.expiry_time);
        return expiry_time_moment.diff(server_time_moment, 'seconds');
    }

    /**
     * Function to check if the highlighted status should be disabled
     *
     * @returns {boolean}
     */
    get should_highlight_disabled() {
        return (
            this.is_buyer_cancelled_order ||
            this.is_expired_order ||
            this.is_refunded_order ||
            this.is_disputed_order ||
            this.is_dispute_refunded_order ||
            (this.has_timer_expired && !this.is_completed_order && !this.is_dispute_completed_order)
        );
    }

    /**
     * Function to check if the order should be displayed in highlighted alert status based on order status
     *
     * @returns {boolean}
     */
    get should_highlight_alert() {
        if (this.has_timer_expired) return false;

        if (this.is_my_ad) {
            return this.is_buy_order ? this.is_pending_order : this.is_buyer_confirmed_order;
        }

        return this.is_buy_order ? this.is_buyer_confirmed_order : this.is_pending_order;
    }

    /**
     * Function to check if the order should be displayed in highlighted danger status based on order status
     *
     * @returns {boolean}
     */
    get should_highlight_danger() {
        if (this.has_timer_expired) return false;

        if (this.is_my_ad) {
            return this.is_buy_order ? this.is_buyer_confirmed_order : this.is_pending_order;
        }

        return this.is_buy_order ? this.is_pending_order : this.is_buyer_confirmed_order;
    }

    /**
     * Function to check if the order should be displayed in highlighted success status based on order status
     *
     * @returns {boolean}
     */
    get should_highlight_success() {
        return this.is_completed_order || this.is_dispute_completed_order;
    }

    /**
     * Function to check if the order details should display cancel and paid buttons
     *
     * @returns {boolean}
     */
    get should_show_cancel_and_paid_button() {
        if (this.has_timer_expired) return false;

        return this.is_pending_active && (this.is_buy_order ? !this.is_my_ad : this.is_my_ad);
    }

    get is_expired_or_ongoing_timer_expired() {
        return this.is_expired_order || (this.is_ongoing_order && this.has_timer_expired);
    }

    /**
     * Function to check if the order details should display complain and received buttons
     *
     * @returns {boolean}
     */
    get should_show_complain_and_received_button() {
        if (this.is_finalised_order) return false;

        return this.is_expired_or_ongoing_timer_expired && (this.is_sell_order ? !this.is_my_ad : this.is_my_ad);
    }

    /**
     * Function to check if the order details should display only complain button
     *
     * Only show the complain button for expired orders (determined by backend), or for orders
     * that are expired (determined by FE). This logic exists because BE only expires orders
     * once a minute rather than on expiry time. FE should expire orders so users cannot
     * execute actions such as "I've paid" or "I've received payment" on technically expired orders.
     *
     * @returns {boolean}
     */
    get should_show_only_complain_button() {
        if (this.is_finalised_order) return false;

        if (this.is_sell_order) {
            return this.is_expired_or_ongoing_timer_expired;
        }

        return this.is_expired_or_ongoing_timer_expired && !this.is_my_ad;
    }

    /**
     * Function to check if the order details should display only received button
     *
     * @returns {boolean}
     */
    get should_show_only_received_button() {
        if (this.is_disputed_order) {
            return (!this.is_incoming_order && this.is_sell_order) || (this.is_incoming_order && this.is_buy_order);
        }

        return this.is_buyer_confirmed_order && (this.is_buy_order ? this.is_my_ad : !this.is_my_ad);
    }

    /**
     * Function to check if the order details should display footer section
     *
     * @returns {boolean}
     */
    get should_show_order_footer() {
        return (
            this.should_show_cancel_and_paid_button ||
            this.should_show_complain_and_received_button ||
            this.should_show_only_complain_button ||
            this.should_show_only_received_button
        );
    }

    /**
     * Function to check if the order details should display timer
     *
     * @returns {boolean}
     */
    get should_show_order_timer() {
        if (this.is_finalised_order) return false;
        return this.is_pending_order || this.is_ongoing_order;
    }

    /**
     * Function to check if the order details should display lost funds banner
     *
     * @returns {boolean}
     */
    get should_show_lost_funds_banner() {
        return this.is_pending_order || this.is_buyer_confirmed_order;
    }

    /**
     * Function that returns the status string of the order
     *
     * @returns {string} localized status string
     */
    get status_string() {
        // Finalised orders, should take precedence over is_expired_order/has_timer_expired.
        if (this.is_completed_order || this.is_dispute_completed_order) {
            return localize('Completed');
        }
        if (this.is_buyer_cancelled_order) {
            return localize('Cancelled');
        }
        if (this.is_refunded_order || this.is_dispute_refunded_order) {
            return localize('Expired');
        }

        if (this.is_disputed_order) {
            return localize('Under dispute');
        }

        // Keep this here, has_timer_expired should take priority over statuses below.
        if (this.is_expired_order || this.has_timer_expired) {
            return localize('Expired');
        }

        if (this.is_pending_order) {
            return this.getStatusForPendingOrder();
        }

        if (this.is_buyer_confirmed_order) {
            return this.getStatusForBuyerConfirmedOrder();
        }

        return localize('Unknown');
    }

    /**
     * Function that returns the status string of the pending order
     *
     * @returns {string} localized status string
     */
    getStatusForPendingOrder() {
        const wait_message = localize('Wait for payment');
        const pay_message = localize('Pay now');

        if (this.is_my_ad) {
            return this.is_buy_order ? wait_message : pay_message;
        }
        return this.is_buy_order ? pay_message : wait_message;
    }

    /**
     * Function that returns the status string of the buyer confirmed order
     *
     * @returns {string} localized status string
     */
    getStatusForBuyerConfirmedOrder() {
        const confirm_message = localize('Confirm payment');
        const wait_message = localize('Waiting for the seller to confirm');
        if (this.is_my_ad) {
            return this.is_buy_order ? confirm_message : wait_message;
        }
        return this.is_buy_order ? wait_message : confirm_message;
    }

    get my_ad_status_string() {
        return {
            counterparty_nickname_label: this.is_buy_order
                ? localize("Buyer's nickname")
                : localize("Seller's nickname"),
            counterparty_real_name_label: this.is_buy_order
                ? localize("Buyer's real name")
                : localize("Seller's real name"),
            left_send_or_receive: this.is_buy_order ? localize('Receive') : localize('Send'),
            right_send_or_receive: this.is_buy_order ? localize('Send') : localize('Receive'),
            payment_details: this.is_buy_order
                ? localize('Your payment details')
                : localize("Seller's payment details"),
            contact_details: this.is_buy_order
                ? localize('Your contact details')
                : localize("Seller's contact details"),
            instructions: localize('Your instructions'),
            result_string: this.is_buy_order
                ? localize('You sold {{offered_amount}} {{offered_currency}}', {
                      ...this.result_string_values,
                  })
                : localize("You've received {{offered_amount}} {{offered_currency}}", {
                      ...this.result_string_values,
                  }),
        };
    }

    get counterparty_ad_status_string() {
        return {
            counterparty_nickname_label: this.is_buy_order
                ? localize("Seller's nickname")
                : localize("Buyer's nickname"),
            counterparty_real_name_label: this.is_buy_order
                ? localize("Seller's real name")
                : localize("Buyer's real name"),
            left_send_or_receive: this.is_buy_order ? localize('Send') : localize('Receive'),
            right_send_or_receive: this.is_buy_order ? localize('Receive') : localize('Send'),
            payment_details: this.is_buy_order
                ? localize("Seller's payment details")
                : localize('Your payment details'),
            contact_details: this.is_buy_order
                ? localize("Seller's contact details")
                : localize('Your contact details'),
            instructions: this.is_buy_order ? localize("Seller's instructions") : localize("Buyer's instructions"),
            result_string: this.is_buy_order
                ? localize("You've received {{offered_amount}} {{offered_currency}}", {
                      ...this.result_string_values,
                  })
                : localize('You sold {{offered_amount}} {{offered_currency}}', {
                      ...this.result_string_values,
                  }),
        };
    }

    get result_string_values() {
        return {
            offered_amount: this.order_details.amount_display,
            offered_currency: this.order_details.account_currency,
        };
    }

    /**
     * Function that returns the status labels
     *
     * @returns {string} object containing the status labels
     */
    get labels() {
        if (this.is_my_ad) {
            return this.my_ad_status_string;
        }

        return this.counterparty_ad_status_string;
    }

    /**
     * Function that returns the user details of the order
     *
     * @returns {object} user details
     */
    get other_user_details() {
        return this.is_my_ad ? this.order_details.client_details : this.order_details.advertiser_details;
    }

    /**
     * Function that returns the order expiry time in milliseconds
     *
     * @returns {number} expiry time in milliseconds
     */
    get order_expiry_milliseconds() {
        return convertToMillis(this.order_details.expiry_time);
    }

    /**
     * Function to get the purchase time of the order
     *
     * @returns {string} purchase time
     */
    get purchase_time() {
        return getFormattedDateString(
            new Date(convertToMillis(this.order_details.created_time)),
            true,
            false,
            this.is_inactive_order
        );
    }
}

export default ExtendedOrderDetails;

export const createExtendedOrderDetails = (order_details: P2POrderInfo, loginid: string, server_time: TServerTime) =>
    new ExtendedOrderDetails(order_details, loginid, server_time);

/**
 * The below function is used to format the display the time given in minutes to hours and minutes
 * e.g. 90 minutes will be displayed as 1 hour 30 minutes
 * @param {number} minutes
 * @returns {string} formatted time string e.g. 1 hour 30 minutes
 */
export const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remaining_minutes = minutes % 60;
    const hours_text = hours === 1 ? localize('hour') : localize('hours');
    const minutes_text = remaining_minutes === 1 ? localize('minute') : localize('minutes');

    if (hours === 0) {
        return `${remaining_minutes} ${minutes_text}`;
    }

    if (remaining_minutes === 0) {
        return `${hours} ${hours_text}`;
    }

    return `${hours} ${hours_text} ${remaining_minutes} ${minutes_text}`;
};

export type TAdvert = {
    advert: TAdvertProps;
};

export type TAdvertProps = {
    account_currency: string;
    active_orders: number;
    advertiser_details: {
        completed_orders_count: number;
        first_name: string;
        id: string;
        is_online: number;
        last_name: string;
        last_online_time: number;
        name: string;
        rating_average: number;
        rating_count: number;
        recommended_average: number;
        recommended_count: number;
        total_completion_rate: number;
    };
    amount: number;
    amount_display: string;
    block_trade: number;
    contact_info: string;
    counterparty_type: string;
    country: string;
    created_time: number;
    description: string;
    effective_rate: number;
    effective_rate_display: string;
    eligibility_status: string[];
    id: string;
    is_active: number;
    is_eligible: number;
    is_visible: number;
    local_currency: string;
    max_order_amount: number;
    max_order_amount_display: string;
    max_order_amount_limit: number;
    max_order_amount_limit_display: string;
    min_order_amount: number;
    min_order_amount_display: string;
    min_order_amount_limit: number;
    min_order_amount_limit_display: string;
    order_expiry_period: number;
    payment_info: string;
    payment_method: null | string;
    payment_method_details: object;
    payment_method_names: string[];
    price: number;
    price_display: string;
    rate: number;
    rate_display: string;
    rate_type: string;
    remaining_amount: number;
    remaining_amount_display: string;
    type: string;
    visibility_status: string[];
};

export type TCountryListProps = {
    [key: string]: { country_name: string };
};

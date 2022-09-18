import { ContractUpdate } from '@deriv/api-types';

export type TStatus = 'open' | 'sold' | 'won';

export type TGetFinalPrice = {
    sell_price: number;
    bid_price: number;
};

export type TIsValidToSell = TIsEnded & {
    is_valid_to_sell: 0 | 1;
};

export type TGetTotalProfit = {
    bid_price: number;
    buy_price: number;
};

export type TGetDisplayStatus = TGetTotalProfit & {
    status: TStatus;
};

export type TTickItem = {
    epoch?: number;
    tick?: null | number;
    tick_display_value?: null | string;
};

export type TIsEnded = {
    sell_price?: number;
    bid_price?: number;
    is_valid_to_sell?: 0 | 1;
    status?: TStatus;
    is_expired?: 0 | 1;
    is_settleable?: 0 | 1;
};

export type TContractInfo = {
    tick_stream?: TTickItem[];
    cancellation?: { ask_price: number };
    status?: TStatus;
    is_expired?: 0 | 1;
    is_settleable?: 0 | 1;
    is_valid_to_cancel?: 0 | 1;
    entry_spot?: number;
    profit?: number;
    entry_tick_time?: number;
    entry_tick?: number;
    current_spot_time?: number;
    current_spot?: number;
    exit_tick_time?: number;
    barrier?: string;
    contract_type?: string;
};

export type TLimitOrder = {
    stop_loss?: {
        display_name?: string;
        order_amount?: null | number;
        order_date?: number;
        value?: null | string;
    };
    stop_out?: {
        display_name?: string;
        order_amount?: number;
        order_date?: number;
        value?: string;
    };
    take_profit?: {
        display_name?: string;
        order_amount?: null | number;
        order_date?: number;
        value?: null | string;
    };
};

export type TGetContractUpdateConfig = {
    contract_update: ContractUpdate;
    limit_order: TLimitOrder;
};

export type TDigitsInfo = { [key: number]: { digit: number; spot: string } };

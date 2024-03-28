import { ContractUpdate, ContractUpdateHistory, Portfolio1, ProposalOpenContract } from '@deriv/api-types';

export type TContractStore = {
    clearContractUpdateConfigValues: () => void;
    contract_info: TContractInfo;
    contract_update_history: ContractUpdateHistory;
    contract_update_take_profit: number | string;
    contract_update_stop_loss: number | string;
    digits_info: TDigitsInfo;
    display_status: string;
    has_contract_update_take_profit: boolean;
    has_contract_update_stop_loss: boolean;
    is_digit_contract: boolean;
    is_ended: boolean;
    onChange: (param: { name: string; value: string | number | boolean }) => void;
    updateLimitOrder: () => void;
    validation_errors: { contract_update_stop_loss: string[]; contract_update_take_profit: string[] };
};

export type TContractInfo = ProposalOpenContract &
    Portfolio1 & {
        contract_update?: ContractUpdate;
    };

export type TTickItem = {
    epoch?: number;
    tick?: null | number;
    tick_display_value?: null | string;
};

export type TDigitsInfo = { [key: number]: { digit: number; spot: string } };

type TLimitProperty = {
    display_name?: string;
    order_amount?: null | number;
    order_date?: number;
    value?: null | string;
};

export type TLimitOrder = Partial<Record<'stop_loss' | 'stop_out' | 'take_profit', TLimitProperty>>;

export type TContractOptions = {
    isHighLow?: boolean;
    showButtonName?: boolean;
    showMainTitle?: boolean;
};

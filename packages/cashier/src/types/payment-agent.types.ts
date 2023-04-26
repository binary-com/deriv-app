import { PaymentagentList } from '@deriv/api-types';

export type TAgent = {
    email?: string;
    max_withdrawal?: string | null;
    min_withdrawal?: string | null;
    phone_numbers?: { phone_number: string }[];
    text?: string;
    url?: { url: string }[];
    value?: string;
};

export type TPaymentAgent = PaymentagentList['list'][0] & {
    supported_banks?: { payment_method: string }[];
    currency?: string;
    value?: string;
};

export type TSupportedBank = {
    text: string;
    value: string;
};

export type TPaymentAgentWithdrawConfirm = {
    amount?: number;
    currency?: string;
    loginid?: string;
    payment_agent_name?: string;
};

export type TPaymentAgentWithdrawReceipt = {
    amount_transferred?: string;
    payment_agent_email?: string;
    payment_agent_id?: string;
    payment_agent_name?: string;
    payment_agent_phone?: { phone_number: string }[];
    payment_agent_url?: { url: string }[];
};

export type TPartialPaymentAgentList = {
    currency?: string;
    deposit_commission?: string;
    email?: string;
    further_information?: string;
    max_withdrawal?: string | null;
    min_withdrawal?: string | null;
    name?: string;
    paymentagent_loginid?: string;
    phone_numbers?: { phone_number?: string }[];
    supported_banks?: { payment_method?: string }[];
    urls?: { url?: string }[];
    withdrawal_commission?: string;
};

type TExtendedPaymentAgentFields = {
    phone_numbers: { phone_number: string }[];
    supported_payment_methods: { payment_method: string }[];
    urls: { url: string }[];
};

export type TExtendedPaymentAgentList = (PaymentagentList['list'][0] & TExtendedPaymentAgentFields)[];

export type TPaymentAgentTransferConfirm = {
    amount?: number;
    client_id?: string;
    client_name?: string;
    description?: string;
};

export type TPaymentAgentTransferReceipt = {
    amount_transferred?: number;
    client_id?: string;
    client_name?: string;
};

export type TTransferLimit = {
    min_withdrawal?: null | string | number;
    max_withdrawal?: null | string | number;
};

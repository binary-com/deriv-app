import { PaymentAgentListResponse, PaymentagentList } from '@deriv/api-types';

type TPhoneNumber = {
    phone_number: string;
};

type TPaymentMethod = {
    payment_method: string;
};

type TUrl = {
    url: string;
};

export type TAgent = {
    email?: string;
    max_withdrawal?: string | null;
    min_withdrawal?: string | null;
    phone?: TPhoneNumber[];
    text?: string;
    url?: TUrl[];
    value?: string;
};

export type TConfirm = {
    amount?: string;
    currency?: string;
    loginid?: string;
    payment_agent_name?: string;
};

export type TReceipt = {
    amount_transferred?: string;
    payment_agent_email?: string;
    payment_agent_id?: string;
    payment_agent_name?: string;
    payment_agent_phone?: TPhoneNumber[];
    payment_agent_url?: TUrl[];
};

export type TPartialPaymentAgentList = {
    email?: string;
    name?: string;
    phones?: TPhoneNumber[];
    supported_banks?: TPaymentMethod[];
    urls?: TUrl[];
};

export type TSupportedBank = {
    text: string;
    value: string;
};

type TExtendedPaymentAgentFields = {
    phone_numbers: TPhoneNumber[];
    supported_payment_methods: TPaymentMethod[];
    urls: TUrl[];
};

export type TExtendedPaymentAgentList = (PaymentagentList['list'][0] & TExtendedPaymentAgentFields)[];

interface TExtendedPaymentagentList extends PaymentagentList {
    list: TExtendedPaymentAgentList;
}

export interface TExtendedPaymentAgentListResponse extends PaymentAgentListResponse {
    paymentagent_list?: TExtendedPaymentagentList;
}

import { useActiveAccount } from '@deriv/api-v2';
import type { TCurrency } from '../../../types';
import { usePaymentAgentDetails, usePaymentAgentTransfer } from '../hooks';

export type TPaymentAgentTransfer = ReturnType<typeof usePaymentAgentTransfer>;
export type TPaymentAgentDetails = NonNullable<ReturnType<typeof usePaymentAgentDetails>['data']>;
export type TActiveAccount = NonNullable<ReturnType<typeof useActiveAccount>['data']>;

export type TReceipt = {
    amount: string;
    clientID: string;
    clientName: string;
    currency: TCurrency;
};

export type TConfirm = TReceipt & {
    description: string;
};

import { useExtendedTransferAccounts } from '../hooks';

export type TTransferableAccounts = ReturnType<typeof useExtendedTransferAccounts>['accounts'];

export type TTransferReceipt = {
    amount: string;
    fromAccount: TTransferableAccounts[number];
    toAccount: TTransferableAccounts[number];
};

export type TTransferFormikContext = {
    fromAccount: TTransferableAccounts[number] | undefined;
    fromAmount: string;
    toAccount: TTransferableAccounts[number] | undefined;
    toAmount: string;
};

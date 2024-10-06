export type TWithdrawalForm = {
    cryptoAddress: string;
    cryptoAmount: string;
    fiatAmount: string;
};

export type TWithdrawalReceipt = {
    address?: string;
    amount?: number;
    amountReceived?: string;
    currency?: string;
    landingCompany?: string;
    transactionFee?: string;
};

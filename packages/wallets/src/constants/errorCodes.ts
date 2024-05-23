export enum CryptoDepositErrorCodes {
    CryptoConnectionError = 'CryptoConnectionError',
    SuspendedCurrency = 'CryptoSuspendedCurrency',
    SuspendedDeposit = 'CryptoDisabledCurrencyDeposit',
}

export enum CryptoWithdrawalErrorCodes {
    CryptoConnectionError = 'CryptoConnectionError',
    CryptoInvalidAddress = 'CryptoInvalidAddress',
    InvalidToken = 'InvalidToken',
    SuspendedCurrency = 'CryptoSuspendedCurrency',
    SuspendedWithdrawal = 'CryptoDisabledCurrencyWithdrawal',
}

export enum TransferErrorCodes {
    TransferBetweenAccountsError = 'TransferBetweenAccountsError',
}

import { TWithdrawalCryptoContext } from '../provider';

const helperMessageMapper = {
    balanceLessThanMinWithdrawalLimit: (balance: string, min: string) =>
        `Your balance (${balance}) is less than the current minimum withdrawal allowed (${min}). Please top up your wallet to continue with your withdrawal.`,
    decimalPlacesExceeded: (limit: number) => `Up to ${limit} decimal places are allowed.`,
    fieldRequired: 'This field is required.',
    insufficientFunds: 'Insufficient funds',
    invalidInput: 'Should be a valid number.',
    withdrawalLimitError: (min: string, max: string) => {
        return `The current allowed withdraw amount is ${min} to ${max}.`;
    },
};

const validateCryptoAddress = (address: string) => {
    const MIN_ADDRESS_LENGTH = 25;
    const MAX_ADDRESS_LENGTH = 64;

    if (!address) return helperMessageMapper.fieldRequired;

    if (address.length < MIN_ADDRESS_LENGTH || address.length > MAX_ADDRESS_LENGTH) {
        return 'Your wallet address should have 25 to 64 characters.';
    }

    return undefined;
};

const checkIfInvalidInput = (
    fractionalDigits: TWithdrawalCryptoContext['fractionalDigits']['crypto' | 'fiat'],
    value: string
) => {
    if (!fractionalDigits) return;

    const splitValues = value.split('.');
    const numberOfDecimalsPoints = splitValues.length - 1;
    const integerPart = splitValues[0];
    const fractionalPart = splitValues[1];

    const isIntegerPartNumberRegex = new RegExp(/^\d+$/);
    const isFractionalPartNumberRegex = new RegExp(/^\d+$/);
    const fractionalPartPrecisionRegex = new RegExp(`^\\d{1,${fractionalDigits}}$`);

    if (
        (integerPart && !isIntegerPartNumberRegex.exec(integerPart)) ||
        numberOfDecimalsPoints > 1 ||
        (numberOfDecimalsPoints === 1 && !fractionalPart) ||
        (fractionalPart && !isFractionalPartNumberRegex.exec(fractionalPart))
    ) {
        return helperMessageMapper.invalidInput;
    }

    if (fractionalPart && !fractionalPartPrecisionRegex.exec(fractionalPart))
        return helperMessageMapper.decimalPlacesExceeded(fractionalDigits);
};

const validateCryptoInput = (
    activeWallet: TWithdrawalCryptoContext['activeWallet'],
    fractionalDigits: TWithdrawalCryptoContext['fractionalDigits'],
    isClientVerified: TWithdrawalCryptoContext['isClientVerified'],
    remainder: number,
    value: string,
    minimumWithdrawal?: number
) => {
    if (!activeWallet?.balance || !activeWallet?.currency || !fractionalDigits.crypto) return;

    const isInvalidInput = checkIfInvalidInput(fractionalDigits.crypto, value);

    if (isInvalidInput) return isInvalidInput;

    const amount = parseFloat(value);

    if (amount > activeWallet.balance) return helperMessageMapper.insufficientFunds;

    const MIN_WITHDRAWAL_AMOUNT = minimumWithdrawal;

    if (MIN_WITHDRAWAL_AMOUNT && activeWallet.balance < MIN_WITHDRAWAL_AMOUNT) {
        return helperMessageMapper.balanceLessThanMinWithdrawalLimit(
            activeWallet.display_balance,
            `${MIN_WITHDRAWAL_AMOUNT.toFixed(fractionalDigits.crypto)} ${activeWallet.currency}`
        );
    }

    const MAX_WITHDRAWAL_AMOUNT =
        !isClientVerified && remainder < activeWallet.balance ? remainder : activeWallet.balance;

    if (MIN_WITHDRAWAL_AMOUNT && (amount < MIN_WITHDRAWAL_AMOUNT || amount > MAX_WITHDRAWAL_AMOUNT)) {
        return helperMessageMapper.withdrawalLimitError(
            MIN_WITHDRAWAL_AMOUNT.toFixed(fractionalDigits.crypto),
            `${MAX_WITHDRAWAL_AMOUNT.toFixed(fractionalDigits.crypto)} ${activeWallet.currency}`
        );
    }
};

const validateFiatInput = (fractionalDigits: TWithdrawalCryptoContext['fractionalDigits'], value: string) => {
    if (!value.length || !fractionalDigits.fiat) return;

    const isInvalidInput = checkIfInvalidInput(fractionalDigits.fiat, value);
    if (isInvalidInput) return isInvalidInput;
};

export { validateCryptoAddress, validateCryptoInput, validateFiatInput };

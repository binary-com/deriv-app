import { useTranslations } from '@deriv-com/translations';
import { TWithdrawalCryptoContext } from '../provider';

const helperMessageMapper = (localize: ReturnType<typeof useTranslations>['localize']) => ({
    balanceLessThanMinWithdrawalLimit: (balance: string, min: string) =>
        localize(
            'Your balance ({{balance}}) is less than the current minimum withdrawal allowed ({{min}}). Please top up your wallet to continue with your withdrawal.',
            { balance, min }
        ),
    decimalPlacesExceeded: (limit: number) => localize('Up to {{limit}} decimal places are allowed.', { limit }),
    fieldRequired: localize('This field is required.'),
    insufficientFunds: localize('Insufficient funds'),
    invalidInput: localize('Should be a valid number.'),
    withdrawalLimitError: (min: string, max: string) => {
        return localize('The current allowed withdraw amount is {{min}} to {{max}}.', { max, min });
    },
});

const validateCryptoAddress = (localize: ReturnType<typeof useTranslations>['localize'], address?: string) => {
    const MIN_ADDRESS_LENGTH = 25;
    const MAX_ADDRESS_LENGTH = 64;

    if (!address) return helperMessageMapper(localize).fieldRequired;

    if (address.length < MIN_ADDRESS_LENGTH || address.length > MAX_ADDRESS_LENGTH) {
        return localize('Your wallet address should have 25 to 64 characters.');
    }

    return undefined;
};

const checkIfInvalidInput = (
    fractionalDigits: TWithdrawalCryptoContext['fractionalDigits']['crypto' | 'fiat'],
    localize: ReturnType<typeof useTranslations>['localize'],
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
        return helperMessageMapper(localize).invalidInput;
    }

    if (fractionalPart && !fractionalPartPrecisionRegex.exec(fractionalPart))
        return helperMessageMapper(localize).decimalPlacesExceeded(fractionalDigits);
};

const validateCryptoInput = (
    activeWallet: {
        balance: number;
        currency: string;
        displayBalance: string;
    },
    fractionalDigits: TWithdrawalCryptoContext['fractionalDigits'],
    isClientVerified: TWithdrawalCryptoContext['isClientVerified'],
    localize: ReturnType<typeof useTranslations>['localize'],
    remainder: number,
    value: string,
    minimumWithdrawal?: number
) => {
    if (!activeWallet?.balance || !activeWallet?.currency || !fractionalDigits.crypto) return;

    const isInvalidInput = checkIfInvalidInput(fractionalDigits.crypto, localize, value);

    if (isInvalidInput) return isInvalidInput;

    const amount = parseFloat(value);

    if (amount > activeWallet.balance) return helperMessageMapper(localize).insufficientFunds;

    const MIN_WITHDRAWAL_AMOUNT = activeWallet.currency === 'XRP' ? Math.pow(10, -fractionalDigits) : minimumWithdrawal;

    if (MIN_WITHDRAWAL_AMOUNT && activeWallet.balance < MIN_WITHDRAWAL_AMOUNT) {
        return helperMessageMapper(localize).balanceLessThanMinWithdrawalLimit(
            activeWallet.displayBalance,
            `${MIN_WITHDRAWAL_AMOUNT.toFixed(fractionalDigits.crypto)} ${activeWallet.currency}`
        );
    }

    const MAX_WITHDRAWAL_AMOUNT =
        !isClientVerified && remainder < activeWallet.balance ? remainder : activeWallet.balance;

    if (MIN_WITHDRAWAL_AMOUNT && (amount < MIN_WITHDRAWAL_AMOUNT || amount > MAX_WITHDRAWAL_AMOUNT)) {
        return helperMessageMapper(localize).withdrawalLimitError(
            MIN_WITHDRAWAL_AMOUNT.toFixed(fractionalDigits.crypto),
            `${MAX_WITHDRAWAL_AMOUNT.toFixed(fractionalDigits.crypto)} ${activeWallet.currency}`
        );
    }
};

const validateFiatInput = (
    fractionalDigits: TWithdrawalCryptoContext['fractionalDigits'],
    localize: ReturnType<typeof useTranslations>['localize'],
    value: string
) => {
    if (!value.length || !fractionalDigits.fiat) return;

    const isInvalidInput = checkIfInvalidInput(fractionalDigits.fiat, localize, value);
    if (isInvalidInput) return isInvalidInput;
};

export { validateCryptoAddress, validateCryptoInput, validateFiatInput };

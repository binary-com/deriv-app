import { localize } from '@deriv-com/translations';
import { validateCryptoAddress, validateCryptoInput, validateFiatInput } from '../withdrawalCryptoValidators';

describe('withdrawalCryptoValidator', () => {
    let mockValue: string,
        mockIsClientVerified: boolean,
        mockCryptoAddress: string,
        mockActiveWallet: Parameters<typeof validateCryptoInput>[0],
        mockFractionalDigits: { crypto: number; fiat: number },
        mockRemainder: number,
        mockMinimumWithdrawal: number;

    beforeEach(() => {
        mockValue = '2.5';
        mockIsClientVerified = true;
        mockCryptoAddress = 'jds93e9f8wefun9w8efrn98wefn09inf0';
        //@ts-expect-error since this is a mock, we only need partial properties of data
        mockActiveWallet = {
            balance: 10,
            currency: 'BTC',
        };
        mockFractionalDigits = {
            crypto: 7,
            fiat: 2,
        };
        mockRemainder = 9;
        mockMinimumWithdrawal = 1;
    });

    it('should check if no errors are returned when valid inputs are provided for crypto address', () => {
        const cryptoAddressMessages = validateCryptoAddress(localize, mockCryptoAddress);

        expect(cryptoAddressMessages).toEqual(undefined);
    });

    it('should check if no errors are returned when valid inputs are provided for crypto amount', () => {
        const cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            localize,
            mockRemainder,
            mockValue,
            mockMinimumWithdrawal
        );

        expect(cryptoAmountMessages).toEqual(undefined);
    });

    it('should check if no errors are returned when valid inputs are provided for fiat amount', () => {
        const fiatAmountMessages = validateFiatInput(mockFractionalDigits, localize, mockValue);

        expect(fiatAmountMessages).toEqual(undefined);
    });

    it('should return error for invalid crypto address when length is lesser than 25 characters', () => {
        mockCryptoAddress = 'wrfie0493n0';
        const cryptoAddressMessages = validateCryptoAddress(localize, mockCryptoAddress);

        expect(cryptoAddressMessages).toEqual('Your wallet address should have 25 to 64 characters.');
    });

    it('should return error for invalid crypto address when length is greater than 64 characters', () => {
        mockCryptoAddress = 'moie0420349irn039fn09krf0n9r0f9n0r9fkn093nkf09k3n0f9n309fn09rkf09r0f9n93n0';
        const cryptoAddressMessages = validateCryptoAddress(localize, mockCryptoAddress);

        expect(cryptoAddressMessages).toEqual('Your wallet address should have 25 to 64 characters.');
    });

    it('should return "Should be a valid number." error for invalid crypto amount', () => {
        mockValue = 'aad';
        let cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            localize,
            mockRemainder,
            mockValue,
            mockMinimumWithdrawal
        );

        expect(cryptoAmountMessages).toEqual('Should be a valid number.');

        mockValue = '5.';
        cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            localize,
            mockRemainder,
            mockValue,
            mockMinimumWithdrawal
        );

        expect(cryptoAmountMessages).toEqual('Should be a valid number.');

        mockValue = '.';
        cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            localize,
            mockRemainder,
            mockValue,
            mockMinimumWithdrawal
        );

        expect(cryptoAmountMessages).toEqual('Should be a valid number.');

        mockValue = '5.03abcd';
        cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            localize,
            mockRemainder,
            mockValue,
            mockMinimumWithdrawal
        );

        expect(cryptoAmountMessages).toEqual('Should be a valid number.');
    });

    it('should return "Should be a valid number." error for invalid fiat amount', () => {
        mockValue = 'aad';
        let fiatAmountMessages = validateFiatInput(mockFractionalDigits, localize, mockValue);

        expect(fiatAmountMessages).toEqual('Should be a valid number.');

        mockValue = '5.';
        fiatAmountMessages = validateFiatInput(mockFractionalDigits, localize, mockValue);

        expect(fiatAmountMessages).toEqual('Should be a valid number.');

        mockValue = '.';
        fiatAmountMessages = validateFiatInput(mockFractionalDigits, localize, mockValue);

        expect(fiatAmountMessages).toEqual('Should be a valid number.');

        mockValue = '5.03abcd';
        fiatAmountMessages = validateFiatInput(mockFractionalDigits, localize, mockValue);

        expect(fiatAmountMessages).toEqual('Should be a valid number.');
    });

    it('should return "Insufficient funds" if amount > balance regardless of the verification status of the user', () => {
        mockValue = '11.0000000';

        let cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            localize,
            mockRemainder,
            mockValue,
            mockMinimumWithdrawal
        );

        expect(cryptoAmountMessages).toEqual('Insufficient funds');

        mockIsClientVerified = false;

        cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            localize,
            mockRemainder,
            mockValue,
            mockMinimumWithdrawal
        );

        expect(cryptoAmountMessages).toEqual('Insufficient funds');
    });

    it('should return `balanceLessThanMinWithdrawalLimit` error', () => {
        mockActiveWallet = {
            balance: 0.3,
            currency: 'BTC',
            displayBalance: '0.3000000 BTC',
        };
        mockValue = '0.2000000';
        mockMinimumWithdrawal = 0.5;

        const cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            localize,
            mockRemainder,
            mockValue,
            mockMinimumWithdrawal
        );

        expect(cryptoAmountMessages).toEqual(
            'Your balance (0.3000000 BTC) is less than the current minimum withdrawal allowed (0.5000000 BTC). Please top up your wallet to continue with your withdrawal.'
        );
    });

    it('should return limit error if amount < min withdrawal limit but is still less than the balance for verified user', () => {
        mockValue = '0.5000000';
        mockIsClientVerified = true;

        const cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            localize,
            mockRemainder,
            mockValue,
            mockMinimumWithdrawal
        );

        expect(cryptoAmountMessages).toEqual('The current allowed withdraw amount is 1.0000000 to 10.0000000 BTC.');
    });

    it('should not return limit error if amount is within limits but is still less than the balance for verified user', () => {
        mockValue = '9.5000000';
        mockIsClientVerified = true;

        const cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            localize,
            mockRemainder,
            mockValue,
            mockMinimumWithdrawal
        );

        expect(cryptoAmountMessages).toEqual(undefined);
    });

    it('should not return limit error if amount is within limits but is still less than the balance for unverified user', () => {
        mockValue = '8.5000000';
        mockIsClientVerified = false;

        const cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            localize,
            mockRemainder,
            mockValue,
            mockMinimumWithdrawal
        );

        expect(cryptoAmountMessages).toEqual(undefined);
    });

    it('should return limit error if amount > max withdrawal limit but is still less than the balance for unverified user', () => {
        mockValue = '9.5000000';
        mockIsClientVerified = false;

        const cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            localize,
            mockRemainder,
            mockValue,
            mockMinimumWithdrawal
        );

        expect(cryptoAmountMessages).toEqual('The current allowed withdraw amount is 1.0000000 to 9.0000000 BTC.');
    });

    it('should return "This field is required." if no value is passed to crypto address field', () => {
        const cryptoAddressMessages = validateCryptoAddress(localize, '');

        expect(cryptoAddressMessages).toEqual('This field is required.');
    });
});

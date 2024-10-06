import { useTranslations } from '@deriv-com/translations';
import { ValidationConstants } from '@deriv-com/utils';
import { passwordKeys } from '../utils/password-validation';

const {
    between8and16Characters,
    between8and25Characters,
    lowercase,
    number,
    password,
    specialCharacter,
    tradingPlatformInvestorPassword,
    uppercase,
} = ValidationConstants.patterns;

export const passwordRegex = {
    hasLowerCase: lowercase,
    hasNumber: number,
    hasSymbol: specialCharacter,
    hasUpperCase: uppercase,
    isLengthValid: between8and25Characters,
    isMT5LengthValid: between8and16Characters,
    isMT5PasswordValid: tradingPlatformInvestorPassword,
    isPasswordValid: password,
};

export const passwordValues = {
    longPassword: 12,
    maxLength: 25,
    maxLengthMT5: 16,
    minLength: 8,
};

export const getPasswordErrorMessage = (localize: ReturnType<typeof useTranslations>['localize']) => ({
    invalidLength: localize('You should enter {{minLength}}-{{maxLength}} characters.', {
        maxLength: passwordValues.maxLength,
        minLength: passwordValues.minLength,
    }),
    invalidLengthMT5: localize('You should enter {{minLength}}-{{maxLength}} characters.', {
        maxLength: passwordValues.maxLengthMT5,
        minLength: passwordValues.minLength,
    }),
    missingCharacter: localize('Password should have lower and uppercase English letters with numbers.'),
    missingCharacterMT5: localize(
        'Please include at least 1 special character such as ( _ @ ? ! / # ) in your password.'
    ),
    PasswordError: localize('That password is incorrect. Please try again.'),
});

export const getWarningMessages = (
    localize: ReturnType<typeof useTranslations>['localize']
): Record<passwordKeys, string> => ({
    common: localize('This is a very common password.'),
    commonNames: localize('Common names and surnames are easy to guess.'),
    dates: localize('Dates are easy to guess.'),
    extendedRepeat: localize('Repeated character patterns like "abcabcabc" are easy to guess.'),
    keyPattern: localize('Short keyboard patterns are easy to guess.'),
    namesByThemselves: localize('Single names or surnames are easy to guess.'),
    pwned: localize('Your password was exposed by a data breach on the Internet.'),
    recentYears: localize('Recent years are easy to guess.'),
    sequences: localize('Common character sequences like "abc" are easy to guess.'),
    similarToCommon: localize('This is similar to a commonly used password.'),
    simpleRepeat: localize('Repeated characters like "aaa" are easy to guess.'),
    straightRow: localize('Straight rows of keys on your keyboard are easy to guess.'),
    topHundred: localize('This is a frequently used password.'),
    topTen: localize('This is a heavily used password.'),
    userInputs: localize('There should not be any personal or page related data.'),
    wordByItself: localize('Single words are easy to guess.'),
});

// Display on MT5 Password Reset Modal for new password requirements
export const getPasswordRequirements = (localize: ReturnType<typeof useTranslations>['localize']) => [
    localize('8 to 16 characters'),
    localize('A special character such as ( _ @ ? ! / # )'),
    localize('An uppercase letter'),
    localize('A lowercase letter'),
    localize('A number'),
];

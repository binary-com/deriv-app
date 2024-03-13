import { passwordKeys } from '../utils/password-validation';

export const passwordRegex = {
    hasLowerCase: /[a-z]/,
    hasNumber: /\d/,
    hasSymbol: /\W/,
    hasUpperCase: /[A-Z]/,
    isLengthValid: /^.{8,25}$/,
    isMT5LengthValid: /^.{8,16}$/,
    isMT5PasswordValid: /^(?=.*[!@#$%^&*()+\-=[\]{};':"|,.<>/?_~])[ -~]{8,16}$/,
    isPasswordValid: /^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])[!-~]{8,25}$/,
};

export const passwordValues = {
    longPassword: 12,
    maxLength: 25,
    maxLengthMT5: 16,
    minLength: 8,
};

export const passwordErrorMessage = {
    invalidLength: `You should enter ${passwordValues.minLength}-${passwordValues.maxLength} characters.`,
    invalidLengthMT5: `You should enter ${passwordValues.minLength}-${passwordValues.maxLengthMT5} characters.`,
    missingCharacter: 'Password should have lower and uppercase English letters with numbers.',
    missingCharacterMT5: 'Password must contain lowercase, uppercase letters, numbers, and special characters.',
    PasswordError: 'That password is incorrect. Please try again.',
};

export const warningMessages: Record<passwordKeys, string> = {
    common: 'This is a very common password.',
    commonNames: 'Common names and surnames are easy to guess.',
    dates: 'Dates are easy to guess.',
    extendedRepeat: 'Repeated character patterns like "abcabcabc" are easy to guess.',
    keyPattern: 'Short keyboard patterns are easy to guess.',
    namesByThemselves: 'Single names or surnames are easy to guess.',
    pwned: 'Your password was exposed by a data breach on the Internet.',
    recentYears: 'Recent years are easy to guess.',
    sequences: 'Common character sequences like "abc" are easy to guess.',
    similarToCommon: 'This is similar to a commonly used password.',
    simpleRepeat: 'Repeated characters like "aaa" are easy to guess.',
    straightRow: 'Straight rows of keys on your keyboard are easy to guess.',
    topHundred: 'This is a frequently used password.',
    topTen: 'This is a heavily used password.',
    userInputs: 'There should not be any personal or page related data.',
    wordByItself: 'Single words are easy to guess.',
};

// Display on MT5 Password Reset Modal for new password requirements
export const passwordRequirements = [
    '8 to 16 characters',
    'A special character such as ( _ @ ? ! / # )',
    'An uppercase letter',
    'A lowercase letter',
    'A number',
];

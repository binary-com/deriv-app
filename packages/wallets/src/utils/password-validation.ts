import * as Yup from 'yup';
import { useTranslations } from '@deriv-com/translations';
import { getPasswordErrorMessage, passwordRegex, passwordValues } from '../constants/password';

export type Score = 0 | 1 | 2 | 3 | 4;
export type passwordKeys =
    | 'common'
    | 'commonNames'
    | 'dates'
    | 'extendedRepeat'
    | 'keyPattern'
    | 'namesByThemselves'
    | 'pwned'
    | 'recentYears'
    | 'sequences'
    | 'similarToCommon'
    | 'simpleRepeat'
    | 'straightRow'
    | 'topHundred'
    | 'topTen'
    | 'userInputs'
    | 'wordByItself';

// Calculate Scores based on password strength
// CFD Password Validation
export const validPassword = (value: string) => {
    return passwordRegex.isPasswordValid.test(value);
};

const isPasswordValid = (password: string) => {
    return passwordRegex.isPasswordValid.test(password) && passwordRegex.isLengthValid.test(password);
};

export const calculateScoreCFD = (password: string) => {
    let score = 0;
    const hasMoreThanOneSymbol = (password.match(/\W/g) ?? []).length > 1;
    if (password.length === 0) return score;
    if (!isPasswordValid(password)) score += 1;
    if (isPasswordValid(password)) score += 1;
    if (isPasswordValid(password) && password.length > passwordValues.minLength) score += 1;
    if (isPasswordValid(password) && password.length > passwordValues.longPassword) score += 1;
    if ((isPasswordValid(password) && password.length > passwordValues.maxLengthMT5) || hasMoreThanOneSymbol)
        score += 1;
    return score;
};

// MT5 Password Validation
export const validPasswordMT5 = (value: string) => {
    return passwordRegex.isMT5PasswordValid.test(value);
};

const isPasswordValidMT5 = (password: string) => {
    return passwordRegex.isMT5PasswordValid.test(password) && passwordRegex.isMT5LengthValid.test(password);
};

const isPasswordModerateMT5 = (password: string) => {
    return (
        isPasswordValidMT5(password) &&
        password.length >= passwordValues.minLength &&
        password.length < 13 &&
        passwordRegex.isMT5LengthValid
    );
};

const isPasswordStrongMT5 = (password: string) => {
    return isPasswordValidMT5(password) && password.length >= 13 && passwordRegex.isMT5LengthValid;
};

export const calculateScoreMT5 = (password: string) => {
    if (password.length === 0) return 0;
    if (!isPasswordValidMT5(password)) return 1;
    if (!isPasswordStrongMT5(password) && isPasswordValidMT5(password) && !isPasswordModerateMT5(password)) return 2;
    if (!isPasswordStrongMT5(password) && isPasswordValidMT5(password) && isPasswordModerateMT5(password)) return 3;
    if (isPasswordStrongMT5(password)) return 4;
};

// Password Schemas
export const mt5Schema = (localize: ReturnType<typeof useTranslations>['localize']) =>
    Yup.string()
        .required(getPasswordErrorMessage(localize).invalidLengthMT5)
        .matches(passwordRegex.isMT5LengthValid, getPasswordErrorMessage(localize).invalidLengthMT5)
        .matches(passwordRegex.isPasswordValid, getPasswordErrorMessage(localize).missingCharacter)
        .matches(passwordRegex.isMT5PasswordValid, getPasswordErrorMessage(localize).missingCharacterMT5);

export const cfdSchema = (localize: ReturnType<typeof useTranslations>['localize']) =>
    Yup.string()
        .required(getPasswordErrorMessage(localize).invalidLength)
        .matches(passwordRegex.isLengthValid, getPasswordErrorMessage(localize).invalidLength)
        .matches(passwordRegex.isPasswordValid, getPasswordErrorMessage(localize).missingCharacter);

import * as Yup from 'yup';
import { AnyObject } from 'yup/lib/object';
import { FormatUtils, ValidationConstants } from '@deriv-com/utils';
import type { TCurrency } from '../../types';

export const numberValidator = (value: string, context: Yup.TestContext<AnyObject>) => {
    if (!ValidationConstants.patterns.decimal.test(value)) {
        return context.createError({ message: 'Should be a valid number.' });
    }
    return true;
};

export const decimalsValidator = (value: string, context: Yup.TestContext<AnyObject>, fractionalDigits: number) => {
    const splitValues = value.toString().split('.');
    const fractionalPart = splitValues[1];

    const fractionalPartPrecisionRegex = new RegExp(`^\\d{1,${fractionalDigits}}$`);

    if (fractionalPart && !fractionalPartPrecisionRegex.exec(fractionalPart)) {
        return context.createError({ message: `Up to ${fractionalDigits} decimal places are allowed.` });
    }
    return true;
};

export const insufficientBalanceValidator = (value: string, context: Yup.TestContext<AnyObject>, balance: number) => {
    if (balance < Number(value)) {
        return context.createError({ message: 'Insufficient balance.' });
    }
    return true;
};

export const descriptionValidator = (value: string, context: Yup.TestContext<AnyObject>) => {
    if (value && !/^[0-9A-Za-z .,'-]{0,250}$/.test(value.replace(/\n/g, ' '))) {
        return context.createError({ message: 'Please enter a valid description.' });
    }
    return true;
};

export const betweenMinAndMaxValidator = (
    value: string,
    context: Yup.TestContext<AnyObject>,
    options: {
        currency: TCurrency;
        limits: { max?: number; min?: number };
    }
) => {
    const { currency, limits } = options;
    const { max, min } = limits;
    if (min && (Number(value) < min || Number(value) > Number(max))) {
        return context.createError({
            message: `Should be between ${FormatUtils.formatMoney(min, {
                currency,
            })} and ${FormatUtils.formatMoney(Number(max), {
                currency,
            })}`,
        });
    }
    return true;
};

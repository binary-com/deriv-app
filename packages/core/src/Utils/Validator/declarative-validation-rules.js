import { addComma, getDecimalPlaces, cloneObject, compareBigUnsignedInt } from '@deriv/shared';

import Client from '_common/base/client_base';
import { getElementById } from '_common/common_functions';

import { localize } from '@deriv/translations';

// ------------------------------
// ----- Validation Methods -----
// ------------------------------
export const validRequired = (value /* , options, field */) => {
    if (value === undefined || value === null) {
        return false;
    }

    const str = String(value).replace(/\s/g, '');
    return str.length > 0;
};
const confirmRequired = value => value === true;
const validEmail = value => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(value);
export const validPassword = value => /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[ -~]*$/.test(value);
export const validLetterSymbol = value => !/[`~!@#$%^&*)(_=+[}{\]\\/";:?><,|\d]+/.test(value);
const validGeneral = value => !/[`~!@#$%^&*)(_=+[}{\]\\/";:?><|]+/.test(value);
export const validAddress = value => !/[`~!$%^&*_=+[}{\]\\"?><|]+/.test(value);
export const validPostCode = value => value === '' || /^[A-Za-z0-9][A-Za-z0-9\s-]*$/.test(value);
export const validPhone = value => /^\+((-|\s)*[0-9]){8,35}$/.test(value);
export const validCountryCode = (list, value) =>
    list.some(item => value.replace(/[ ]/g, '').startsWith(`+${item.phone_idd}`));
const validRegular = (value, options) => options.regex.test(value);
const validEmailToken = value => value.trim().length === 8;
export const validTaxID = value => /^[a-zA-Z0-9]*[\w-]*$/.test(value);
const validBarrier = value => /^[+-]?\d+\.?\d*$/.test(value);

const validCompare = (value, options) => value === getElementById(options.to.substr(1)).value;
const validNotEqual = (value, options) => value !== getElementById(options.to.substr(1)).value;
const validMin = (value, options) => (options.min ? value.length >= options.min : true);
export const validLength = (value, options) => {
    const getMessage = () => {
        const { min, max } = options;
        if (min && max) {
            return localize('You should enter a value between {{min}} and {{max}} characters.', { min, max });
        } else if (min) {
            return localize('You should enter a value at least {{min}} characters.', { min });
        }

        return localize('Maximum allowed characters are {{max}}.', { max });
    };

    const result =
        (options.min ? value.length >= options.min : true) && (options.max ? value.length <= options.max : true);
    if (!result) {
        getPreBuildDVRs().length.message = getMessage();
    }

    return result;
};

export const validNumber = (value, opts) => {
    const options = cloneObject(opts);
    let message = null;
    if (options.allow_empty && value.length === 0) {
        return true;
    }

    let is_ok = true;
    if ('min' in options && typeof options.min === 'function') {
        options.min = options.min();
    }
    if ('max' in options && typeof options.max === 'function') {
        options.max = options.max();
    }

    if (!(options.type === 'float' ? /^\d*(\.\d+)?$/ : /^\d+$/).test(value) || isNaN(value)) {
        is_ok = false;
        message = localize('Should be a valid number.');
    } else if (
        options.type === 'float' &&
        options.decimals &&
        !new RegExp(`^\\d+(\\.\\d{0,${options.decimals}})?$`).test(value)
    ) {
        is_ok = false;
        message = localize('Up to {{decimal_count}} decimal places are allowed.', { decimal_count: options.decimals });
    } else if ('min' in options && 'max' in options && +options.min === +options.max && +value !== +options.min) {
        is_ok = false;
        message = localize('Should be {{value}}', {
            value: addComma(options.min, options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined),
        });
    } else if ('min' in options && 'max' in options && (+value < +options.min || isMoreThanMax(value, options))) {
        is_ok = false;
        message = localize('Should be between {{min_value}} and {{max_value}}', {
            min_value: addComma(
                options.min,
                options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined
            ),
            max_value: addComma(
                options.max,
                options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined
            ),
        });
    } else if ('min' in options && +value < +options.min) {
        is_ok = false;
        message = localize('Should be more than {{min_value}}', {
            min_value: addComma(
                options.min,
                options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined
            ),
        });
    } else if ('max' in options && isMoreThanMax(value, options)) {
        is_ok = false;
        message = localize('Should be less than {{max_value}}', {
            max_value: addComma(
                options.max,
                options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined
            ),
        });
    }

    getPreBuildDVRs().number.message = message;
    return is_ok;
};

const isMoreThanMax = (value, options) =>
    options.type === 'float' ? +value > +options.max : compareBigUnsignedInt(value, options.max) === 1;

const initPreBuildDVRs = () => ({
    address: {
        func: validAddress,
        message: localize(
            'Only letters, numbers, space, and these special characters are allowed: {{permitted_characters}}',
            { permitted_characters: "- . ' # ; : ( ) , @ /" }
        ),
    },
    barrier: {
        func: validBarrier,
        message: localize('Only numbers and these special characters are allowed: {{permitted_characters}}', {
            permitted_characters: '+ - .',
        }),
    },
    compare: { func: validCompare, message: localize('The two passwords that you entered do not match.') },
    email: { func: validEmail, message: localize('Invalid email address.') },
    general: {
        func: validGeneral,
        message: localize('Only letters, numbers, space, hyphen, period, and apostrophe are allowed.'),
    },
    length: { func: validLength, message: '' }, // Message will be set in validLength function on initiation
    letter_symbol: {
        func: validLetterSymbol,
        message: localize('Only letters, space, hyphen, period, and apostrophe are allowed.'),
    },
    min: { func: validMin, message: localize('Minimum of {{value}} characters required.', { value: '{{value}}' }) },
    not_equal: {
        func: validNotEqual,
        message: localize('{{value_one}} and {{value_two}} cannot be the same.', {
            value_one: '{{value_one}}',
            value_two: '{{value_two}}',
        }),
    },
    number: { func: validNumber, message: '' },
    password: {
        func: validPassword,
        message: localize('Password should have lower and uppercase English letters with numbers.'),
    },
    phone: { func: validPhone, message: localize('Only numbers and spaces are allowed.') },
    postcode: { func: validPostCode, message: localize('Only letters, numbers, space, and hyphen are allowed.') },
    regular: { func: validRegular, message: '' },
    req: { func: validRequired, message: field => localize('{{field}} is required', { field }) },
    confirm: { func: confirmRequired, message: '' },
    signup_token: { func: validEmailToken, message: localize('The length of token should be 8.') },
    tax_id: {
        func: validTaxID,
        message: localize('Should start with letter or number, and may contain hyphen and underscore.'),
    },
});

let pre_build_dvrs;
export const getPreBuildDVRs = () => {
    if (!pre_build_dvrs) {
        pre_build_dvrs = initPreBuildDVRs();
    }
    return pre_build_dvrs;
};

export const getPasswordLengthConfig = type => ({ min: /^mt$/.test(type) ? 8 : 6, max: 25 });

export const validateMainPassword = password => {
    const errors = {};

    if (
        !validLength(password, {
            min: 8,
            max: 25,
        })
    ) {
        errors.password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
            min_number: 8,
            max_number: 25,
        });
    } else if (!validPassword(password)) {
        errors.password = getPreBuildDVRs().password.message;
    }

    return errors;
};

import { addComma } from '../currency';
import { cloneObject } from '../object';
import { compareBigUnsignedInt } from '../string';
import { TFormErrorMessagesTypes } from './form-error-messages-types';

export type TOptions = {
    [key: string]: unknown;
    decimals?: string | number;
    is_required?: boolean;
    max?: number | string | null;
    min?: number | string | null;
    name1?: string;
    name2?: string;
    regex?: RegExp;
    type?: string;
};

export type TRuleOptions<S extends object = object> = {
    func?: <T extends string>(
        value: T,
        options?: TOptions,
        store?: S,
        inputs?: Pick<S, keyof S>
    ) => boolean | { is_ok: boolean; message: string };
    condition?: (store: S) => boolean;
    message?: string;
} & TOptions;

const validRequired = (value?: string | number /* , options, field */) => {
    if (value === undefined || value === null) {
        return false;
    }

    const str = value.toString().replace(/\s/g, '');
    return str.length > 0;
};
export const address_permitted_special_characters_message = ". , ' : ; ( ) ° @ # / -";
export const validAddress = (value: string, options?: TOptions) => {
    if (options?.is_required && (!value || value.match(/^\s*$/))) {
        return {
            is_ok: false,
            message: form_error_messages?.empty_address(),
        };
    } else if (!validLength(value, { min: 0, max: 70 })) {
        return {
            is_ok: false,
            message: form_error_messages?.maxNumber(70),
        };
    } else if (!/^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u.test(value)) {
        return {
            is_ok: false,
            message: form_error_messages?.address(),
        };
    }
    return { is_ok: true };
};
export const validPostCode = (value: string) => value === '' || /^[A-Za-z0-9][A-Za-z0-9\s-]*$/.test(value);
export const validTaxID = (value: string) => /(?!^$|\s+)[A-Za-z0-9./\s-]$/.test(value);
export const validPhone = (value: string) => /^\+?([0-9-]+\s)*[0-9-]+$/.test(value);
export const validLetterSymbol = (value: string) => /^[A-Za-z]+([a-zA-Z.' -])*[a-zA-Z.' -]+$/.test(value);
export const validName = (value: string) => /^(?!.*\s{2,})(?!\s)[\p{L}\s'.-]{1,50}$/u.test(value);
export const validLength = (value = '', options: TOptions) =>
    (options.min ? value.length >= Number(options.min) : true) &&
    (options.max ? value.length <= Number(options.max) : true);
export const validPassword = (value: string) => /^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])[!-~]{8,25}$/.test(value);
export const validEmail = (value: string) => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(value);
const validBarrier = (value: string) => {
    if (value === '+' || value === '-') {
        return {
            is_ok: false,
            message: form_error_messages?.empty_barrier(),
        };
    }
    return { is_ok: /^[+-]?\d+(\.\d+)?$/.test(value) };
};
const validGeneral = (value: string) => !/[`~!@#$%^&*)(_=+[}{\]\\/";:?><|]+/.test(value);
const validRegular = (value: string, options: TOptions) => options.regex?.test(value);
const confirmRequired = (value: string) => !!value;
const checkPOBox = (value: string) => !/p[.\s]+o[.\s]+box/i.test(value);
const validEmailToken = (value: string) => value.trim().length === 8;
export const hasInvalidCharacters = (target_string: string) => /[^\dX\s]/.test(target_string);
export const isFormattedCardNumber = (target_string: string) =>
    /(^\d{4})\s(\d{2}X{2})\s(X{4})\s(\d{4}$)/.test(target_string);
export const validFile = (file: File) => file?.type && /(image|application)\/(jpe?g|pdf|png)$/.test(file?.type);
export const validMT5Password = (value: string) => /^(?=.*[!@#$%^&*()+\-=[\]{};':"|,.<>/?_~])[ -~]{8,16}$/.test(value);

let pre_build_dvrs: TInitPreBuildDVRs, form_error_messages: TFormErrorMessagesTypes;

const isMoreThanMax = (value: number, options: TOptions) =>
    options.type === 'float' ? +value > Number(options.max) : compareBigUnsignedInt(value, options.max) === 1;

export const validNumber = (value: string, opts: TOptions) => {
    const options = cloneObject(opts);
    let message = null;
    if (options.allow_empty && value.length === 0) {
        return {
            is_ok: true,
        };
    }

    let is_ok = true;
    if ('min' in options && typeof options.min === 'function') {
        options.min = options.min();
    }
    if ('max' in options && typeof options.max === 'function') {
        options.max = options.max();
    }

    if (!(options.type === 'float' ? /^\d*(\.\d+)?$/ : /^\d+$/).test(value) || isNaN(+value)) {
        is_ok = false;
        message = form_error_messages.number();
    } else if ('min' in options && 'max' in options && +options.min === +options.max && +value !== +options.min) {
        is_ok = false;
        message = form_error_messages.value(addComma(options.min, options.decimals));
    } else if (
        'min' in options &&
        'max' in options &&
        options.min > 0 &&
        (+value < +options.min || isMoreThanMax(+value, options))
    ) {
        is_ok = false;
        const min_value = addComma(options.min, options.decimals);
        const max_value = addComma(options.max, options.decimals);
        message = form_error_messages.betweenMinMax(min_value, max_value);
    } else if (
        options.type === 'float' &&
        options.decimals &&
        !new RegExp(`^\\d+(\\.\\d{0,${options.decimals}})?$`).test(value)
    ) {
        is_ok = false;
        message = form_error_messages.decimalPlaces(options.decimals);
    } else if ('min' in options && +value < +options.min) {
        is_ok = false;
        const min_value = addComma(options.min, options.decimals);
        message = form_error_messages.minNumber(min_value);
    } else if ('max' in options && isMoreThanMax(+value, options)) {
        is_ok = false;
        const max_value = addComma(options.max, options.decimals);
        message = form_error_messages.maxNumber(max_value);
    }
    return { is_ok, message };
};

export type TInitPreBuildDVRs = ReturnType<typeof initPreBuildDVRs>;
const initPreBuildDVRs = () => ({
    address: {
        func: validAddress,
        message: form_error_messages.address,
    },
    barrier: {
        func: validBarrier,
        message: form_error_messages.barrier,
    },
    email: { func: validEmail, message: form_error_messages.email },
    general: {
        func: validGeneral,
        message: form_error_messages.general,
    },
    length: { func: validLength, message: '' }, // Message will be set in validLength function on initiation
    name: {
        func: validName,
        message: form_error_messages.name,
    },
    number: {
        func: (...args: [string, TOptions, Record<string, string | boolean>]) => {
            const [value, opts] = args;
            return validNumber(value, opts);
        },
        message: form_error_messages.number,
    },
    password: {
        func: validPassword,
        message: form_error_messages.password,
    },
    phone: { func: validPhone, message: form_error_messages.phone },
    po_box: { func: checkPOBox, message: form_error_messages.po_box },
    postcode: { func: validPostCode, message: form_error_messages.postcode },
    regular: { func: validRegular, message: '' },
    req: { func: validRequired, message: '' },
    confirm: { func: confirmRequired, message: '' },
    signup_token: { func: validEmailToken, message: form_error_messages.signup_token },
    tax_id: {
        func: validTaxID,
        message: form_error_messages.validTaxID,
    },
});

export const initFormErrorMessages = (all_form_error_messages: TFormErrorMessagesTypes) => {
    if (!pre_build_dvrs) {
        form_error_messages = all_form_error_messages;
        pre_build_dvrs = initPreBuildDVRs();
    }
};

export const getPreBuildDVRs = () => {
    return pre_build_dvrs;
};

export const getErrorMessages = () => {
    return form_error_messages;
};

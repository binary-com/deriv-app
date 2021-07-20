import { localize } from '@deriv/translations';

export const setInitialValues = fields => {
    const values = {};
    fields.forEach(field => {
        values[field.name] = '';
    });
    return values;
};

export const checkIsEmpty = value => {
    return typeof value === 'string' ? !value.trim() : !value;
};

export const validateFields = (values, fields = [], documents = []) => {
    const errors = {};

    fields.forEach(field => {
        const { name, label, type } = field;
        const value = values[name];

        if (field.required && checkIsEmpty(value)) {
            errors[name] = localize('{{label}} is required.', {
                label,
            });
        } else if (type === 'text' && !/^[\w\s-]{0,30}$/g.test(value)) {
            errors[name] = localize('Only letters, numbers, space, underscore, and hyphen are allowed for {{label}}.', {
                label,
            });
        }
    });

    documents.forEach(document => {
        const { name, label } = document;
        const value = values[name];

        if (checkIsEmpty(value)) {
            errors[name] = localize('{{label}} is required.', {
                label,
            });
        } else if (value.errors?.length) {
            errors[name] = value.errors[0];
        }
    });

    return errors;
};

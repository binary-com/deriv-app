import * as Yup from 'yup';
import { TTranslations } from '../../../../../../types';

export const documentRequiredValidator = (documentName: string, localize: TTranslations['localize']) =>
    Yup.string().required(localize('{{name}} is required', { name: documentName }));

export const getExpiryDateValidator = (localize: TTranslations['localize']) => {
    return Yup.string()
        .nullable()
        .required(localize('Expiry date is required.'))
        .test({
            name: 'test-expiry-date-is-null',
            test: (value, context) => {
                if (value === null) {
                    return context.createError({ message: localize('Expiry date is required.') });
                }
                return true;
            },
        })
        .test({
            name: 'test-min-expiry-date',
            test: (value, context) => {
                const currentDate = new Date();
                const expiryDate = new Date(value || '');

                if (expiryDate < currentDate || isNaN(expiryDate.getTime())) {
                    return context.createError({
                        message: localize('Expiry date cannot be today date or in the past'),
                    });
                }
                return true;
            },
        });
};

export const getDocumentNumberValidator = (documentName: string, localize: TTranslations['localize']) => {
    return Yup.string()
        .required(
            localize('{{name}} number is required.', {
                name: documentName,
            })
        )
        .max(
            30,
            localize('{{name}} number must be less than 30 characters.', {
                name: documentName,
            })
        )
        .matches(
            new RegExp(/^[\w\s-]{0,30}$/g),
            localize('Only letters, numbers, space, underscore, and hyphen are allowed for {{name}} number.', {
                name: documentName,
            })
        );
};

export const fileValidator = Yup.mixed().required();

import * as Yup from 'yup';
import { TTranslations } from '../../../../../../../types';
import type { TDocumentTypeItem } from '../types';

export const getDocumentTypeValidator = (localize: TTranslations['localize']) =>
    Yup.string().required(localize('Please select a document type.'));

export const getDocumentNumberValidator = (
    document: TDocumentTypeItem,
    example: string,
    localize: TTranslations['localize']
) => {
    return Yup.string()
        .required(localize('Please enter your {{documentName}} number.', { documentName: document.text }))
        .test({
            name: 'test-document-number',
            test: (value, context) => {
                let pattern;

                if (document.pattern) {
                    try {
                        pattern = new RegExp(document.pattern);
                    } catch (_err) {
                        // Passport pattern has (?i) which is not supported in RegExp
                        // Replace the (?i) flag with the 'i' flag
                        const match = document.pattern?.match(/(\(\?i\))/);
                        if (match) {
                            const patternWithoutFlag = document.pattern.replace(/(\(\?i\))/, '');
                            pattern = new RegExp(patternWithoutFlag, 'i');
                        }
                    }

                    if (pattern && value && !value.match(pattern)) {
                        return context.createError({
                            message: localize('Please enter the correct format. Example: {{example}}', {
                                example,
                            }),
                        });
                    }
                }
                return true;
            },
        });
};

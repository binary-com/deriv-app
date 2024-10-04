import { localize } from '@deriv-com/translations';
import * as Yup from 'yup';
import { AnyObject } from 'yup/lib/types';
import { isAdditionalDocumentValid, isDocumentNumberValid } from '../Helpers/utils';
import { TDocument } from 'Types';
import { getIDVNotApplicableOption } from '@deriv/shared';

const validateDocumentNumber = (documentNumber: string, context: Yup.TestContext<AnyObject>) => {
    const result = isDocumentNumberValid(documentNumber, context.parent.document_type);

    if (result) {
        return context.createError({ message: result });
    }
    return true;
};

const validateAdditionalDocumentNumber = (additional_document_number: string, context: Yup.TestContext<AnyObject>) => {
    const result = isAdditionalDocumentValid(context.parent.document_type, additional_document_number);
    if (result) {
        return context.createError({ message: result });
    }
    return true;
};

export const getIDVFormValidationSchema = () => {
    const IDV_NOT_APPLICABLE_OPTION = getIDVNotApplicableOption();
    return Yup.object({
        document_additional: Yup.string()
            .test({
                name: 'testAdditionalDocumentNumber',
                test: (value, context) => {
                    if (context.parent.document_type.id === IDV_NOT_APPLICABLE_OPTION.id) {
                        return true;
                    }
                    return validateAdditionalDocumentNumber(value as string, context);
                },
            })
            .default(''),
        document_number: Yup.string()
            .test({
                name: 'testDocumentNumber',
                test: (value, context) => {
                    if (context.parent.document_type.id === IDV_NOT_APPLICABLE_OPTION.id) {
                        return true;
                    }
                    return validateDocumentNumber(value as string, context);
                },
            })
            .default(''),
        document_type: Yup.mixed<TDocument>().test({
            name: 'validate-document-type',
            test: (input, context) => {
                if (input?.value) {
                    return true;
                }
                return context.createError({
                    message: localize('Please select a document type.'),
                });
            },
        }),
    });
};

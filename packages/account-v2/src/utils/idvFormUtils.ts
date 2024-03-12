import * as Yup from 'yup';
import { AnyObject } from 'yup/lib/object';
import { useKycAuthStatus } from '@deriv/api-v2';
import { getIDVDocumentExampleFormat, TIDVDocumentConfig } from '../constants/idvDocumentConfig';

export const getExampleFormat = (exampleFormat?: string) => (exampleFormat ? `Example: ${exampleFormat}` : '');

export type TDocument = {
    additional?: {
        displayName?: string;
        exampleFormat?: string;
        format?: string;
    };
    exampleFormat?: string;
    id: string;
    text: string;
    value: string;
};

const validateDocumentNumber = (
    documentConfig: TDocument | undefined,
    documentNumber: string,
    context: Yup.TestContext<AnyObject>
) => {
    const isSameAsExample = documentNumber === documentConfig?.exampleFormat;
    const exampleFormat = getExampleFormat(documentConfig?.exampleFormat);

    if (!documentNumber && documentConfig?.text) {
        let documentName = '';
        switch (documentConfig.id) {
            case 'drivers_license':
                documentName = 'Driver License Reference number';
                break;
            case 'ssnit':
                documentName = 'SSNIT number';
                break;
            case 'national_id_no_photo':
                documentName = 'NIN';
                break;
            default:
                documentName = 'document number';
                break;
        }
        return context.createError({ message: `Please enter your ${documentName}. ${exampleFormat}` });
    } else if (isSameAsExample) {
        return context.createError({ message: 'Please enter a valid ID number' });
    } else if (documentConfig && !new RegExp(documentConfig.value).test(documentNumber)) {
        return context.createError({ message: `Please enter the correct format. ${exampleFormat}` });
    }
    return true;
};

const validateAdditionalDocumentNumber = (
    documentConfig: TDocument | undefined,
    additionalDocNumber: string | undefined,
    context: Yup.TestContext<AnyObject>
) => {
    if (!additionalDocNumber) {
        return context.createError({
            message: `Please enter your ${
                documentConfig?.additional?.displayName?.toLowerCase() ?? 'document number'
            }.`,
        });
    } else if (
        documentConfig?.additional?.format &&
        !new RegExp(documentConfig?.additional?.format).test(additionalDocNumber)
    ) {
        return context.createError({
            message: 'Please enter the correct format',
        });
    }
    return true;
};

export const getIDVFormValidationSchema = (
    countryCode: string,
    list: Exclude<
        Exclude<ReturnType<typeof useKycAuthStatus>['kyc_auth_status'], undefined>['identity']['supported_documents'],
        undefined
    >['idv']
) => {
    return Yup.object({
        additionalDocument: Yup.string().test({
            name: 'testAdditionalDocumentNumber',
            test: (value, context) => {
                const documentConfig = getSelectedDocumentConfigData(countryCode, context.parent.documentType, list);
                return validateAdditionalDocumentNumber(documentConfig, value, context);
            },
        }),
        documentNumber: Yup.string().test({
            name: 'testDocumentNumber',
            test: (value, context) => {
                const documentConfig = getSelectedDocumentConfigData(countryCode, context.parent.documentType, list);
                return validateDocumentNumber(documentConfig, value as string, context);
            },
        }),
        documentType: Yup.string().required('Please select a document type.'),
    });
};

export const getSelectedDocumentConfigData = (
    countryCode: string,
    documentType: string,
    documentList: Exclude<
        Exclude<ReturnType<typeof useKycAuthStatus>['kyc_auth_status'], undefined>['identity']['supported_documents'],
        undefined
    >['idv']
): TDocument | undefined => {
    const exampleFormatConfigs = getIDVDocumentExampleFormat();

    const selectedDocumentConfig = (exampleFormatConfigs?.[countryCode] as TIDVDocumentConfig)?.[documentType];
    const selectedDocument = documentList?.[documentType];

    if (!selectedDocument) {
        return undefined;
    }

    const documentConfig: TDocument = {
        exampleFormat: selectedDocumentConfig.exampleFormat as string,
        id: documentType,
        text: selectedDocument.display_name as string,
        value: selectedDocument.format as string,
    };

    if (selectedDocument.additional) {
        documentConfig.additional = {
            displayName: selectedDocument.additional.display_name,
            exampleFormat: selectedDocumentConfig.additionalDocumentExampleFormat as string,
            format: selectedDocument.additional.format,
        };
    }
    return documentConfig;
};

export const generatePlaceholderText = (selected_doc: string): string => {
    switch (selected_doc) {
        case 'drivers_license':
            return 'Enter Driver License Reference number';
        case 'ssnit':
            return 'Enter your SSNIT number';
        case 'national_id_no_photo':
            return 'Enter your National Identification Number (NIN)';
        default:
            return 'Enter your document number';
    }
};

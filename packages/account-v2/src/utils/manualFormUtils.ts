import * as Yup from 'yup';
import { MANUAL_DOCUMENT_TYPES_DATA, MANUAL_FORM_PAGE_TYPES, TManualDocumentTypes } from '../constants';

export const getTitleForFormInputs = (selectedDocument: TManualDocumentTypes) =>
    MANUAL_DOCUMENT_TYPES_DATA[selectedDocument]?.inputSectionHeader;

export const getTitleForDocumentUpload = (selectedDocument: TManualDocumentTypes) =>
    MANUAL_DOCUMENT_TYPES_DATA[selectedDocument]?.uploadSectionHeader;

export const getFieldsConfig = (selectedDocument: TManualDocumentTypes) =>
    MANUAL_DOCUMENT_TYPES_DATA[selectedDocument]?.fields;

export const getUploadConfig = (selectedDocument: TManualDocumentTypes) =>
    MANUAL_DOCUMENT_TYPES_DATA[selectedDocument].uploads;

export const getManualFormValidationSchema = (
    selectedDocument: TManualDocumentTypes,
    isExpiryDateRequired: boolean
) => {
    const fieldsConfig = getFieldsConfig(selectedDocument);
    const uploadConfig = getUploadConfig(selectedDocument);

    const documentExpiryValidation = Yup.object({
        documentExpiry: Yup.string().required(fieldsConfig?.documentExpiry?.errorMessage).default(''),
    });

    const documentUploadValidation = Object.fromEntries(
        uploadConfig.map(item => [item.pageType, Yup.mixed<File | null>().required(item?.error).default(null)])
    );

    const baseSchema = Yup.object({
        documentNumber: Yup.string().required(fieldsConfig?.documentNumber?.errorMessage).default(''),
        ...documentUploadValidation,
    });

    const combinedSchema = baseSchema.concat(documentExpiryValidation);

    return isExpiryDateRequired ? combinedSchema : baseSchema;
};

export const getSelfieValidationSchema = () => {
    return Yup.object({
        selfieWithID: Yup.mixed<File | null>()
            .test({
                message: 'File is required',
                name: 'file',
                test: value => {
                    return !!value && value instanceof File;
                },
            })
            .required()
            .default(null),
    });
};

export type TManualPageTypes = typeof MANUAL_FORM_PAGE_TYPES[keyof typeof MANUAL_FORM_PAGE_TYPES];

export type TManualDocumentUploadFormData = {
    [key in TManualPageTypes]?: File | null;
} & {
    documentExpiry?: string;
    documentNumber: string;
    selfieWithID?: File | null;
};

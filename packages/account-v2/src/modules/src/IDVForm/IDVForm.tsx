import React, { useEffect, useMemo, useState } from 'react';
import { useFormikContext } from 'formik';
import { InferType } from 'yup';
import { FormDropDownField, FormInputField } from '../../../components/FormFields';
import { TSupportedDocuments } from '../../../types';
import { getIDVNotApplicableOption } from '../../../utils/defaultOptions';
import {
    generatePlaceholderText,
    getExampleFormat,
    getIDVFormValidationSchema,
    getSelectedDocumentConfigData,
    TDocument,
} from '../../../utils/idvFormUtils';

type TIDVFormProps = {
    allowDefaultValue?: boolean;
    allowIDVSkip?: boolean;
    countryCode: string;
    supportedDocuments: TSupportedDocuments;
};

type TIDVFormValues = InferType<ReturnType<typeof getIDVFormValidationSchema>>;

type TDropDownList = {
    text: string;
    value: string;
};

export const IDVForm = ({ allowDefaultValue, allowIDVSkip, countryCode, supportedDocuments }: TIDVFormProps) => {
    const formik = useFormikContext<TIDVFormValues>();

    const [documentList, setDocumentList] = useState<TDropDownList[]>([]);

    const [selectedDocument, setSelectedDocument] = useState<TDocument | undefined>();

    const idvNotApplicableOption = useMemo(() => getIDVNotApplicableOption(allowIDVSkip), [allowIDVSkip]);

    const defaultDocument = {
        exampleFormat: '',
        id: '',
        text: '',
        value: '',
    };

    useEffect(() => {
        if (supportedDocuments && Object.keys(supportedDocuments)?.length) {
            const docList = Object.keys(supportedDocuments).map((key: string) => {
                return {
                    text: supportedDocuments[key].display_name,
                    value: key,
                };
            });

            if (allowDefaultValue) {
                setDocumentList([...docList, idvNotApplicableOption] as TDropDownList[]);
            } else {
                setDocumentList([...docList] as TDropDownList[]);
            }
        }
    }, [supportedDocuments, idvNotApplicableOption, allowDefaultValue]);

    if (!formik) {
        throw new Error('IDVForm must be used within a Formik component');
    }

    const { setFieldValue, values } = formik;

    const validationSchema = getIDVFormValidationSchema(countryCode, supportedDocuments, values);

    const bindDocumentData = (item: string) => {
        setFieldValue('documentType', item, true);
        const documentConfig = getSelectedDocumentConfigData(countryCode, item, supportedDocuments);
        setSelectedDocument(documentConfig);
        if (item === idvNotApplicableOption.value) {
            setFieldValue('documentNumber', '', true);
            setFieldValue('additionalDocument', '', true);
        }
    };

    const handleSelect = (item: string) => {
        if (item === 'No results found') {
            setFieldValue('documentType', defaultDocument, true);
        } else {
            bindDocumentData(item);
        }
    };

    return (
        <section className='flex flex-col gap-16'>
            <FormDropDownField
                handleSelect={handleSelect}
                label='Choose the document type'
                list={documentList}
                name='documentType'
                validationSchema={validationSchema.fields.documentType}
            />
            {values?.documentType !== idvNotApplicableOption.value && (
                <FormInputField
                    disabled={!values?.documentType}
                    isFullWidth
                    label={generatePlaceholderText(values?.documentType)}
                    message={getExampleFormat(selectedDocument?.exampleFormat)}
                    name='documentNumber'
                    validationSchema={validationSchema.fields.documentNumber}
                />
            )}
            {selectedDocument?.additional?.displayName && (
                <FormInputField
                    disabled={!values?.documentNumber}
                    isFullWidth
                    label='Enter additional document number'
                    message={getExampleFormat(selectedDocument?.additional?.exampleFormat)}
                    name='additionalDocument'
                    validationSchema={validationSchema.fields.additionalDocument}
                />
            )}
        </section>
    );
};

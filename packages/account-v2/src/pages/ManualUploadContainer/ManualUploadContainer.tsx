import React, { useState } from 'react';
import { useDocumentUpload } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { MANUAL_DOCUMENT_SELFIE, TManualDocumentTypes } from '../../constants/manualFormConstants';
import { ManualForm } from '../../containers/ManualForm';
import { SelfieDocumentUpload } from '../../containers/SelfieDocumentUpload';
import { useManualForm } from '../../hooks';
import { OnfidoContainer } from '../../modules/Onfido';
import { getUploadConfig, TManualDocumentUploadFormData } from '../../utils';

type TManualUploadContainerProps = {
    countryCode: string;
    onDocumentSubmit: () => void;
    selectedDocument: string | null;
    setSelectedDocument: (value: string | null) => void;
};

export const ManualUploadContainer = ({
    countryCode,
    onDocumentSubmit,
    selectedDocument,
    setSelectedDocument,
}: TManualUploadContainerProps) => {
    const { isExpiryDateRequired, isLoading, poiService } = useManualForm(
        countryCode,
        selectedDocument as TManualDocumentTypes
    );

    const [formData, setFormData] = useState<Partial<TManualDocumentUploadFormData>>({});
    const [shouldUploadSelfie, setShouldUploadSelfie] = useState(false);
    const { upload } = useDocumentUpload();

    if (isLoading || poiService === null) {
        return <Loader />;
    }

    const processDocuments = (
        values: TManualDocumentUploadFormData,
        item: ReturnType<typeof getUploadConfig>[number]
    ): Parameters<typeof upload>[0] => {
        const { documentType, pageType } = item;
        return {
            document_id: values.documentNumber,
            document_issuing_country: countryCode,
            document_type: documentType,
            expiration_date: values?.documentExpiry?.toString() ?? undefined,
            file: documentType === MANUAL_DOCUMENT_SELFIE ? (values.selfieWithID as File) : (values[pageType] as File),
            lifetime_valid: isExpiryDateRequired ? 0 : 1,
            page_type: documentType === MANUAL_DOCUMENT_SELFIE ? 'photo' : pageType,
        };
    };

    const handleSubmit = async (values: TManualDocumentUploadFormData) => {
        const uploadDocumentConfig = getUploadConfig(selectedDocument as TManualDocumentTypes);

        try {
            await uploadDocumentConfig.reduce(async (promise, item) => {
                await promise;
                const payload = await processDocuments(values, item);
                await upload(payload);
            }, Promise.resolve());
            onDocumentSubmit();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    if (shouldUploadSelfie) {
        return (
            <SelfieDocumentUpload
                formData={formData}
                handleCancel={() => setShouldUploadSelfie(false)}
                handleSubmit={values => {
                    handleSubmit({ ...formData, ...values } as TManualDocumentUploadFormData);
                }}
            />
        );
    }

    if (poiService === 'manual') {
        return (
            <ManualForm
                formData={formData}
                isExpiryDateRequired={isExpiryDateRequired}
                onCancel={() => {
                    setSelectedDocument(null);
                }}
                onSubmit={values => {
                    setFormData(prev => ({ ...prev, ...values }));
                    setShouldUploadSelfie(true);
                }}
                selectedDocument={selectedDocument as TManualDocumentTypes}
            />
        );
    }
    return (
        <OnfidoContainer
            countryCode={countryCode}
            isEnabledByDefault
            onOnfidoSubmit={onDocumentSubmit}
            selectedDocument={selectedDocument as TManualDocumentTypes}
        />
    );
};

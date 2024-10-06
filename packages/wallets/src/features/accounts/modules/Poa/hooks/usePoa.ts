import { useCallback, useState } from 'react';
import { FormikValues } from 'formik';
import { DocumentUploadStatus, useDocumentUpload, useSettings, useStatesList } from '@deriv/api-v2';
import { TPoaValues } from '../types';

const usePoa = () => {
    const {
        data: settings,
        error: errorSettings,
        isLoading: isSettingsLoading,
        isSuccess: isSettingsUpdateSuccess,
        update: updateSettings,
    } = useSettings();
    const country = settings?.country_code ?? '';
    const { data: statesList, isLoading: isStatesListLoading } = useStatesList(country);
    const {
        resetStatus: resetDocumentUploadStatus,
        status: documentUploadStatus,
        upload: uploadDocument,
    } = useDocumentUpload();
    const [isSubmissionInitiated, setIsSubmissionInitiated] = useState(false);

    const isDocumentUploading = documentUploadStatus === DocumentUploadStatus.LOADING;
    const isDocumentUploadSuccess = documentUploadStatus === DocumentUploadStatus.SUCCESS;
    const isLoading = isDocumentUploading || isSettingsLoading || isStatesListLoading;

    const initialValues = {
        firstLine: settings.address_line_1,
        secondLine: settings.address_line_2,
        stateProvinceLine: settings.address_state,
        townCityLine: settings.address_city,
        zipCodeLine: settings.address_postcode,
    } as TPoaValues;

    const initialStatus = {
        statesList,
    };

    const resetError = () => {
        resetDocumentUploadStatus(DocumentUploadStatus.IDLE);
    };

    // since we call get_settings initially, isSubmissionSuccess helps us to distinguish
    // between the initial call and the upload call using the isSubmissionInitiated flag state
    // which is set only when user initiates submission
    const isSubmissionSuccess = isSubmissionInitiated && isDocumentUploadSuccess && isSettingsUpdateSuccess;

    const upload = useCallback(
        async (values: FormikValues | TPoaValues) => {
            const isAddressDetailsFormDirty =
                values.firstLine !== settings.address_line_1 ||
                values.secondLine !== settings.address_line_2 ||
                values.stateProvinceLine !== settings.address_state ||
                values.townCityLine !== settings.address_city ||
                values.zipCodeLine !== settings.address_postcode;

            if (isAddressDetailsFormDirty) {
                // update address details using set_settings call, only if the form is dirty
                updateSettings({
                    address_city: values.townCityLine,
                    address_line_1: values.firstLine,
                    address_line_2: values.secondLine,
                    address_postcode: values.zipCodeLine,
                    address_state: values.stateProvinceLine,
                });
            }

            try {
                // upload POA document using document_upload
                await uploadDocument({
                    document_issuing_country: settings?.country_code ?? undefined,
                    document_type: values.documentType,
                    file: values.poaFile,
                });

                setIsSubmissionInitiated(true);
                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        },
        [
            settings.address_city,
            settings.address_line_1,
            settings.address_line_2,
            settings.address_postcode,
            settings.address_state,
            settings?.country_code,
            updateSettings,
            uploadDocument,
        ]
    );

    return {
        /** Country code of Client's residence */
        countryCode: settings?.country_code,

        /** Error returned from API calls for address details update and POA document upload */
        errorSettings,

        /** Contains the shared countryList data which is shared between the AddressSection and DocumentSubmission components through the status object from Formik context*/
        initialStatus,

        /** Initial values for the POA form */
        initialValues,

        /** `true` if data required for initial render is loading */
        isLoading,

        /** `true` if the address details and document upload is successful */
        isSuccess: isSubmissionSuccess,

        /** reset error for API response */
        resetError,

        /** Function to initiate upload of address details and document */
        upload,
    };
};
//
export default usePoa;

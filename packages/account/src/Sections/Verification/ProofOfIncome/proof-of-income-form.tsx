import React from 'react';
import { Field, Formik, Form, FormikErrors, FormikHelpers, FormikValues } from 'formik';
import { AccountStatusResponse, DocumentUploadRequest } from '@deriv/api-types';
import { Autocomplete, Button, FormSubmitErrorMessage, SelectNative } from '@deriv/components';
import { useFileUploader } from '@deriv/hooks';
import { useTranslations, Localize } from '@deriv-com/translations';
import { isEqualArray, WS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import FilesDescription from 'Components/file-uploader-container/files-descriptions';
import FormBody from 'Components/form-body';
import FormFooter from 'Components/form-footer';
import FormSubHeader from 'Components/form-sub-header';
import FileUploaderContainer from '../../../Components/file-uploader-container';
import { getFileUploaderDescriptions } from '../../../Constants/file-uploader';
import { isServerError } from 'Helpers/utils';
import { income_status_codes, getPoincDocumentsList } from 'Sections/Verification/ProofOfIncome/proof-of-income-utils';
import { useDevice } from '@deriv-com/ui';

type TProofOfIncomeForm = {
    onSubmit: (status: typeof income_status_codes[keyof typeof income_status_codes]) => void;
};

type TInitialValues = {
    document_type: DocumentUploadRequest['document_type'] | '';
};

const ProofOfIncomeForm = observer(({ onSubmit }: TProofOfIncomeForm) => {
    const [document_file, setDocumentFile] = React.useState<File[]>([]);
    const [file_selection_error, setFileSelectionError] = React.useState<string | null>(null);
    const { localize } = useTranslations();
    const { notifications } = useStore();
    const { addNotificationMessageByKey, removeNotificationMessage, removeNotificationByKey } = notifications;
    const { isMobile, isDesktop } = useDevice();

    const { upload } = useFileUploader();

    const poinc_documents_list = React.useMemo(() => getPoincDocumentsList(), []);
    const poinc_uploader_files_descriptions = React.useMemo(() => getFileUploaderDescriptions('poinc'), []);

    const initial_form_values: TInitialValues = {
        document_type: '',
    };

    const validateFields = (values: TInitialValues) => {
        const errors: FormikErrors<TInitialValues> = {};
        const { document_type } = values;
        const is_document_type_supported = Boolean(poinc_documents_list.find(c => c.text === document_type));

        if (!document_type || !is_document_type_supported) {
            errors.document_type = localize('This field is required.');
        }

        return errors;
    };

    const onSubmitValues = async (
        values: TInitialValues,
        { setStatus, setSubmitting }: FormikHelpers<TInitialValues>
    ) => {
        const uploading_value = poinc_documents_list.find(doc => doc.text === values.document_type)?.value ?? '';

        if (uploading_value) {
            setSubmitting(true);
            try {
                const api_response = await upload(document_file, { document_type: uploading_value });
                if (api_response.warning) {
                    setStatus({ msg: api_response.message });
                } else {
                    const get_account_status_response: DeepRequired<AccountStatusResponse> =
                        await WS.authorized.getAccountStatus();

                    const { income, needs_verification } =
                        get_account_status_response?.get_account_status?.authentication || {};
                    const needs_poinc =
                        needs_verification.includes('income') &&
                        [income_status_codes.REJECTED, income_status_codes.NONE].some(
                            status => status === income?.status
                        );
                    removeNotificationMessage({ key: 'needs_poinc' });
                    removeNotificationByKey({ key: 'needs_poinc' });
                    removeNotificationMessage({ key: 'poinc_upload_limited' });
                    removeNotificationByKey({ key: 'poinc_upload_limited' });
                    onSubmit(income?.status);
                    if (needs_poinc) {
                        addNotificationMessageByKey('needs_poinc');
                    }
                }
            } catch (error) {
                if (isServerError(error)) {
                    setStatus({ msg: error.message });
                }
            } finally {
                setSubmitting(false);
            }
        }
    };

    return (
        <Formik initialValues={initial_form_values} onSubmit={onSubmitValues} validate={validateFields}>
            {({
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                isValid,
                setFieldValue,
                setStatus,
                status,
                touched,
                values,
            }) => (
                <Form noValidate className='proof-of-income__form' onSubmit={handleSubmit}>
                    <FormBody scroll_offset={isDesktop ? '0' : '20rem'}>
                        <fieldset className='proof-of-income__form-field'>
                            <FormSubHeader
                                title={localize('Select document')}
                                title_text_size={isMobile ? 'xs' : 's'}
                            />
                            <Field name='document_type'>
                                {({ field }: FormikValues) => (
                                    <React.Fragment>
                                        {isDesktop ? (
                                            <Autocomplete
                                                {...field}
                                                name='document_type'
                                                data-lpignore='true'
                                                autoComplete='off'
                                                type='text'
                                                list_height='36rem'
                                                placeholder={localize('Select your document*')}
                                                error={touched.document_type && errors.document_type}
                                                list_items={poinc_documents_list}
                                                value={values.document_type}
                                                onChange={handleChange}
                                                onItemSelection={({
                                                    value,
                                                    text,
                                                }: typeof poinc_documents_list[number]) => {
                                                    setFieldValue('document_type', value ? text : '', true);
                                                    setStatus({ msg: '' });
                                                }}
                                                required
                                            />
                                        ) : (
                                            <SelectNative
                                                name='document_type'
                                                placeholder={localize('Select your document*')}
                                                label={localize('Select your document*')}
                                                value={values.document_type}
                                                // @ts-expect-error [TODO]:Fix types for SelectNative
                                                list_items={poinc_documents_list}
                                                error={touched.document_type ? errors.document_type : undefined}
                                                use_text
                                                onChange={e => {
                                                    setFieldValue('document_type', e.target.value, true);
                                                    setStatus({ msg: '' });
                                                }}
                                                required
                                                hide_top_placeholder
                                            />
                                        )}
                                    </React.Fragment>
                                )}
                            </Field>
                        </fieldset>
                        <div className='proof-of-income__form-field'>
                            <FormSubHeader
                                title={localize('Document submission')}
                                title_text_size={isMobile ? 'xs' : 's'}
                            />
                            <FileUploaderContainer
                                onFileDrop={files => {
                                    setDocumentFile(prevFiles => {
                                        if (!isEqualArray(prevFiles, files)) setStatus({ msg: '' });
                                        return files;
                                    });
                                }}
                                onError={setFileSelectionError}
                                files_description={
                                    <FilesDescription
                                        descriptions={poinc_uploader_files_descriptions.descriptions}
                                        title={poinc_uploader_files_descriptions.title}
                                    />
                                }
                            />
                        </div>
                    </FormBody>
                    <FormFooter>
                        {status?.msg && <FormSubmitErrorMessage message={status.msg} />}
                        <Button
                            className='account-form__footer-btn'
                            type='submit'
                            is_disabled={
                                !values.document_type ||
                                isSubmitting ||
                                !isValid ||
                                !document_file.length ||
                                !!file_selection_error ||
                                !!status.msg
                            }
                            is_loading={isSubmitting}
                            has_effect
                            primary
                        >
                            <Localize i18n_default_text='Save and submit' />
                        </Button>
                    </FormFooter>
                </Form>
            )}
        </Formik>
    );
});

export default ProofOfIncomeForm;

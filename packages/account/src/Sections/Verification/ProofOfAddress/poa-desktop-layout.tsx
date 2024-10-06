// Need to import React since it is used in CFD
import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { ThemedScrollbars, FormSubmitButton, Button, InlineMessage, Modal, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import FileUploaderContainer from '../../../Components/file-uploader-container';
import FilesDescription from '../../../Components/file-uploader-container/files-descriptions';
import FormBody from '../../../Components/form-body';
import FormBodySection from '../../../Components/form-body-section';
import FormFooter from '../../../Components/form-footer';
import FormSubHeader from '../../../Components/form-sub-header';
import CommonMistakeExamples from '../../../Components/poa/common-mistakes/common-mistake-examples';
import { Form, useFormikContext } from 'formik';
import PersonalDetailsForm from '../../../Components/forms/personal-details-form.jsx';
import { getFileUploaderDescriptions } from '../../../Constants/file-uploader';
import { TPOAFormState } from '../../../Types';
import { useTranslations, Localize } from '@deriv-com/translations';

type TPOADesktopLayout = {
    className?: string;
    setOffset: (status: { msg: string }) => string;
    is_for_cfd_modal?: boolean;
    is_resubmit?: boolean;
    setDocumentFiles: (files: File[]) => void;
    document_files: File[];
    form_state: TPOAFormState;
};

const POADesktopLayout = observer(
    ({
        className,
        setOffset,
        is_for_cfd_modal,
        is_resubmit,
        setDocumentFiles,
        document_files,
        form_state,
    }: TPOADesktopLayout) => {
        const { status, handleSubmit, isSubmitting, isValid } = useFormikContext();
        const { isDesktop } = useDevice();
        const { client } = useStore();
        const [file_selection_error, setFileSelectionError] = React.useState<string | null>(null);
        const { localize } = useTranslations();
        const { states_list, account_settings, is_eu, getChangeableFields } = client;
        const changeable_fields = getChangeableFields();
        const poa_uploader_files_descriptions = React.useMemo(() => getFileUploaderDescriptions('poa', is_eu), []);

        return (
            <Form noValidate className='account-form account-form_poa' onSubmit={handleSubmit}>
                <ThemedScrollbars height='572px' is_bypassed={!is_for_cfd_modal || !isDesktop} className={className}>
                    <FormBody scroll_offset={setOffset(status)} isFullHeight={!isDesktop}>
                        {(status?.msg || is_resubmit) && (
                            <InlineMessage
                                type='error'
                                message={
                                    <Text as='p' size='xs'>
                                        {!status?.msg && is_resubmit && (
                                            <Localize i18n_default_text='We were unable to verify your address with the details you provided. Please check and resubmit or choose a different document type.' />
                                        )}
                                        {status?.msg}
                                    </Text>
                                }
                                id='dt_poa_submit-error'
                            />
                        )}
                        <FormSubHeader title={localize('Enter your address')} title_text_size='s' />
                        <PersonalDetailsForm
                            /* eslint-disable @typescript-eslint/ban-ts-comment */
                            // @ts-nocheck This needs to fixed in PersonalDetailsForm
                            is_qualified_for_poa
                            editable_fields={changeable_fields}
                            states_list={states_list}
                        />
                        <FormSubHeader title={localize('Submit your document')} title_text_size='s' />
                        <FormBodySection>
                            <FileUploaderContainer
                                onFileDrop={files => {
                                    setDocumentFiles(files);
                                }}
                                onError={setFileSelectionError}
                                files_description={
                                    <FilesDescription
                                        title={poa_uploader_files_descriptions.title}
                                        descriptions={poa_uploader_files_descriptions.descriptions}
                                    />
                                }
                                examples={<CommonMistakeExamples />}
                                country_of_residence={account_settings?.country_code as string}
                                placeholder={localize('Type of document')}
                            />
                        </FormBodySection>
                    </FormBody>
                </ThemedScrollbars>
                {is_for_cfd_modal ? (
                    <Modal.Footer has_separator>
                        <FormSubmitButton
                            is_disabled={
                                isSubmitting ||
                                !isValid ||
                                (document_files && document_files.length < 1) ||
                                !!file_selection_error
                            }
                            label={localize('Continue')}
                            is_loading={isSubmitting}
                        />
                    </Modal.Footer>
                ) : (
                    <FormFooter className='account-form__footer-poa'>
                        <Button
                            className='account-form__footer-btn'
                            type='submit'
                            is_disabled={
                                isSubmitting ||
                                !isValid ||
                                (document_files && document_files.length < 1) ||
                                !!file_selection_error
                            }
                            has_effect
                            is_loading={form_state.is_btn_loading}
                            is_submit_success={form_state.is_submit_success}
                            text={localize('Save and submit')}
                            primary
                        />
                    </FormFooter>
                )}
            </Form>
        );
    }
);

export default POADesktopLayout;

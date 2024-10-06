import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { Text, InlineMessage, Button } from '@deriv/components';
import { Localize, useTranslations } from '@deriv-com/translations';
import clsx from 'clsx';
import { useFormikContext, Form } from 'formik';
import FormBody from '../../../Components/form-body';
import PersonalDetailsForm from '../../../Components/forms/personal-details-form.jsx';
import { TPOAFormState } from '../../../Types';
import FormFooter from '../../../Components/form-footer';
import FileUploaderContainer from '../../../Components/file-uploader-container';
import FilesDescription from '../../../Components/file-uploader-container/files-descriptions';
import CommonMistakeExamples from '../../../Components/poa/common-mistakes/common-mistake-examples';
import { getFileUploaderDescriptions } from '../../../Constants/file-uploader';
import { LabelPairedArrowLeftMdBoldIcon } from '@deriv/quill-icons';
import './poa-mobile-layout.scss';

type TPOAMobileLayout = {
    className?: string;
    setOffset: (status: { msg: string }) => string;
    is_for_cfd_modal?: boolean;
    is_resubmit?: boolean;
    setDocumentFiles: (files: File[]) => void;
    document_files: File[];
    form_state: TPOAFormState;
};

type TFormInitialValues = Record<
    'address_line_1' | 'address_line_2' | 'address_city' | 'address_state' | 'address_postcode',
    string
> & {
    document_type?: Record<'text' | 'value', string>;
};

const ProgressBar = ({ is_active }: { is_active: boolean }) => (
    <div className='progress-container'>
        <div className={clsx('progress-bar', { 'progress-bar--animate': is_active })} />
    </div>
);

const POAMobileLayout = observer(
    ({ setOffset, is_resubmit, form_state, document_files, setDocumentFiles, is_for_cfd_modal }: TPOAMobileLayout) => {
        const { localize } = useTranslations();
        const { status, handleSubmit, isSubmitting, isValid, values, errors } = useFormikContext<TFormInitialValues>();
        const { client } = useStore();
        const [file_selection_error, setFileSelectionError] = React.useState<string | null>(null);
        const [step, setStep] = React.useState({ id: 1, text: localize('Enter your address') });

        const { states_list, account_settings, is_eu, getChangeableFields } = client;

        const changeable_fields = getChangeableFields();
        const poa_uploader_files_descriptions = React.useMemo(() => getFileUploaderDescriptions('poa', is_eu), [is_eu]);

        const isNextBtnDisabled = React.useMemo(() => {
            if (step.id === 2) {
                return false;
            }
            return (
                !values.address_line_1 ||
                !!errors.address_line_1 ||
                !!errors.address_line_2 ||
                !values.address_city ||
                !!errors.address_city ||
                !!errors.address_state ||
                !!errors.address_postcode
            );
        }, [values, errors, step.id]);

        return (
            <div className='poa-mobile-layout'>
                <div className={clsx('poa-header', { 'poa-header--non-modal': !is_for_cfd_modal })}>
                    <div className='timeline'>
                        {step.id === 2 && (
                            <LabelPairedArrowLeftMdBoldIcon
                                onClick={() => setStep({ id: 1, text: localize('Enter your address') })}
                            />
                        )}
                        <Text as='p' size='xxs'>
                            <Localize
                                i18n_default_text='<0>Step {{step}}/2:&nbsp;</0> {{title}}'
                                values={{ step: step.id, title: step.text }}
                                components={[<strong key={0} />]}
                            />
                        </Text>
                    </div>
                    <div className='timeline-item'>
                        <ProgressBar is_active={step.id <= 2} />
                        <ProgressBar is_active={step.id === 2} />
                    </div>
                </div>
                <Form noValidate className='account-form account-form_poa' onSubmit={handleSubmit}>
                    <FormBody scroll_offset={setOffset(status)}>
                        {(status?.msg || is_resubmit) && (
                            <InlineMessage
                                type='error'
                                message={
                                    <Text as='p' size='xxxs'>
                                        {!status?.msg && is_resubmit && (
                                            <Localize i18n_default_text='We were unable to verify your address with the details you provided. Please check and resubmit or choose a different document type.' />
                                        )}
                                        {status?.msg}
                                    </Text>
                                }
                                className='poa-error-banner'
                                id='dt_poa_submit-error'
                            />
                        )}
                        {step.id === 1 && (
                            <React.Fragment>
                                <PersonalDetailsForm
                                    /* eslint-disable @typescript-eslint/ban-ts-comment */
                                    // @ts-nocheck This needs to fixed in PersonalDetailsForm
                                    is_qualified_for_poa
                                    editable_fields={changeable_fields}
                                    states_list={states_list}
                                />
                                <FormFooter className='account-form__footer-poa'>
                                    <Button
                                        className='account-form__footer-btn'
                                        type='button'
                                        has_effect
                                        text={localize('Next')}
                                        primary
                                        is_disabled={isNextBtnDisabled}
                                        onClick={() =>
                                            setStep(prev_step => ({
                                                ...prev_step,
                                                id: 2,
                                                text: localize(' Document submission'),
                                            }))
                                        }
                                    />
                                </FormFooter>
                            </React.Fragment>
                        )}
                        {step.id === 2 && (
                            <React.Fragment>
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
                                <FormFooter className='account-form__footer-poa'>
                                    <Button
                                        className='account-form__footer-btn'
                                        type='submit'
                                        has_effect
                                        text={localize('Submit')}
                                        primary
                                        is_disabled={
                                            isSubmitting ||
                                            !isValid ||
                                            (document_files && document_files.length < 1) ||
                                            !!file_selection_error
                                        }
                                        is_loading={form_state.is_btn_loading}
                                        is_submit_success={form_state.is_submit_success}
                                    />
                                </FormFooter>
                            </React.Fragment>
                        )}
                    </FormBody>
                </Form>
            </div>
        );
    }
);

export default POAMobileLayout;

import React from 'react';
import { Formik, FormikErrors, FormikHelpers, FormikValues } from 'formik';
import { useDevice } from '@deriv-com/ui';
import { Loading, Button, Text, ThemedScrollbars, FormSubmitButton, Modal, HintBox } from '@deriv/components';
import { useFileUploader } from '@deriv/hooks';
import { validAddress, validPostCode, validLetterSymbol, validLength, getLocation, WS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import FilesDescription from '../../../Components/file-uploader-container/files-descriptions';
import FormFooter from '../../../Components/form-footer';
import FormBody from '../../../Components/form-body';
import FormBodySection from '../../../Components/form-body-section';
import FormSubHeader from '../../../Components/form-sub-header';
import LoadErrorMessage from '../../../Components/load-error-message';
import LeaveConfirm from '../../../Components/leave-confirm';
import FileUploaderContainer from '../../../Components/file-uploader-container';
import CommonMistakeExamples from '../../../Components/poa/common-mistakes/common-mistake-examples';
import PersonalDetailsForm from '../../../Components/forms/personal-details-form.jsx';
import { isServerError, validate } from '../../../Helpers/utils';
import { getFileUploaderDescriptions } from '../../../Constants/file-uploader';
import { API_ERROR_CODES } from '../../../Constants/api-error-codes';

type TProofOfAddressForm = {
    className: string;
    is_resubmit: boolean;
    is_for_cfd_modal: boolean;
    onCancel: () => void;
    onSubmit: (needs_poi: boolean, has_submitted_duplicate_poa?: boolean) => void;
    onSubmitForCFDModal: (values: FormikValues, has_submitted_duplicate_poa?: boolean) => void;
};

type TFormInitialValues = Record<
    'address_line_1' | 'address_line_2' | 'address_city' | 'address_state' | 'address_postcode',
    string
>;

type TFormState = Record<'is_btn_loading' | 'is_submit_success' | 'should_allow_submit' | 'should_show_form', boolean>;

const ProofOfAddressForm = observer(
    ({ is_resubmit, is_for_cfd_modal, onSubmit, onSubmitForCFDModal, className }: Partial<TProofOfAddressForm>) => {
        const { isDesktop } = useDevice();
        const { client, notifications } = useStore();
        const { account_settings, fetchResidenceList, fetchStatesList, getChangeableFields, states_list, is_eu } =
            client;
        const {
            addNotificationMessageByKey: addNotificationByKey,
            removeNotificationMessage,
            removeNotificationByKey,
        } = notifications;
        const [document_files, setDocumentFiles] = React.useState<File[]>([]);
        const [file_selection_error, setFileSelectionError] = React.useState<string | null>(null);
        const [is_loading, setIsLoading] = React.useState(true);
        const [form_values, setFormValues] = React.useState<TFormInitialValues>({
            address_line_1: '',
            address_line_2: '',
            address_city: '',
            address_state: '',
            address_postcode: '',
        });
        const [api_initial_load_error, setAPIInitialLoadError] = React.useState(null);
        const [form_state, setFormState] = React.useState<TFormState>({
            is_btn_loading: false,
            is_submit_success: false,
            should_allow_submit: true,
            should_show_form: true,
        });

        const [should_scroll_to_top, setShouldScrollToTop] = React.useState(false);

        const poa_uploader_files_descriptions = React.useMemo(() => getFileUploaderDescriptions('poa', is_eu), []);

        const { upload } = useFileUploader();

        React.useEffect(() => {
            fetchResidenceList?.().then(() => {
                Promise.all([fetchStatesList(), WS.wait('get_settings')]).then(() => {
                    setFormValues({
                        address_line_1: account_settings.address_line_1 ?? '',
                        address_line_2: account_settings.address_line_2 ?? '',
                        address_city: account_settings.address_city ?? '',
                        address_state: account_settings.address_state ?? '',
                        address_postcode: account_settings.address_postcode ?? '',
                    });
                    setIsLoading(false);
                });
            });
        }, [account_settings, fetchResidenceList, fetchStatesList]);

        React.useEffect(() => {
            if (should_scroll_to_top) {
                // Scroll to the top of the page
                const el = document.querySelector('#dt_poa_submit-error') as HTMLInputElement;
                const target_element = el?.parentElement ?? el;
                if (typeof target_element?.scrollIntoView === 'function') {
                    target_element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                // Reset the condition
                setShouldScrollToTop(false);
            }
        }, [should_scroll_to_top]);

        const changeable_fields = getChangeableFields();

        const validateFields = (values: TFormInitialValues) => {
            setFormState({ ...form_state, ...{ should_allow_submit: false } });
            const errors: FormikErrors<TFormInitialValues> = {};
            const validateValues = validate(errors, values);

            const required_fields = ['address_line_1', 'address_city'];
            validateValues(val => val, required_fields, localize('This field is required'));

            const address_line_1_validation_result = validAddress(values.address_line_1, { is_required: true });
            if (!address_line_1_validation_result.is_ok) {
                errors.address_line_1 = address_line_1_validation_result.message;
            }
            const address_line_2_validation_result = validAddress(values.address_line_2);
            if (!address_line_2_validation_result.is_ok) {
                errors.address_line_2 = address_line_2_validation_result.message;
            }

            const validation_letter_symbol_message = localize(
                'Only letters, space, hyphen, period, and apostrophe are allowed.'
            );

            if (values.address_city && !validLetterSymbol(values.address_city)) {
                errors.address_city = validation_letter_symbol_message;
            }

            if (values.address_state && !validLetterSymbol(values.address_state) && states_list?.length < 1) {
                errors.address_state = validation_letter_symbol_message;
            }

            if (values.address_postcode) {
                if (!validLength(values.address_postcode, { min: 0, max: 20 })) {
                    errors.address_postcode = localize(
                        'Please enter a {{field_name}} under {{max_number}} characters.',
                        {
                            field_name: localize('Postal/ZIP code'),
                            max_number: 20,
                            interpolation: { escapeValue: false },
                        }
                    );
                } else if (!validPostCode(values.address_postcode)) {
                    errors.address_postcode = localize('Only letters, numbers, space, and hyphen are allowed.');
                }
            }

            return errors;
        };

        const showForm = (should_show_form: boolean) => {
            setFormState({ ...form_state, ...{ should_show_form } });
        };

        const onSubmitValues = async (
            values: TFormInitialValues,
            { setStatus, setSubmitting }: FormikHelpers<TFormInitialValues>
        ) => {
            setStatus({ msg: '' });
            setFormState({ ...form_state, ...{ is_btn_loading: true } });
            const settings_values = { ...values };
            if (values.address_state && states_list.length) {
                settings_values.address_state = getLocation(states_list, values.address_state, 'value') || '';
            }

            const data = await WS.setSettings(settings_values);

            if (data.error) {
                setStatus({ msg: data.error.message });
                setFormState({ ...form_state, ...{ is_btn_loading: false } });
                setSubmitting(false);
                setShouldScrollToTop(true);
                return;
            }

            const get_settings_response = await WS.authorized.storage.getSettings();

            if (get_settings_response.error) {
                setAPIInitialLoadError(get_settings_response.error.message);
                setSubmitting(false);
                return;
            }
            const get_settings = get_settings_response.get_settings;
            const { address_line_1, address_line_2, address_city, address_state, address_postcode } = get_settings;

            setFormValues({
                address_line_1,
                address_line_2,
                address_city,
                address_state,
                address_postcode,
            });

            // upload files
            try {
                const api_response = await upload(document_files);

                if (api_response?.warning) {
                    setFormState({ ...form_state, ...{ is_btn_loading: false } });

                    if (api_response.warning === API_ERROR_CODES.DUPLICATE_DOCUMENT) {
                        if (is_for_cfd_modal) {
                            onSubmitForCFDModal?.(values, true);
                        } else {
                            onSubmit?.(false, true);
                        }
                    } else {
                        setStatus({ msg: api_response?.message });
                        setShouldScrollToTop(true);
                    }
                    return;
                }

                const get_account_status_response = await WS.authorized.getAccountStatus();

                if (!get_account_status_response || get_account_status_response.error) {
                    setAPIInitialLoadError(get_account_status_response.error.message);
                    setSubmitting(false);
                    return;
                }
                const get_account_status = get_account_status_response.get_account_status;

                setFormState({
                    ...form_state,
                    ...{ is_submit_success: true, is_btn_loading: false },
                });

                const { needs_verification } = get_account_status.authentication;
                const needs_poi = Boolean(needs_verification.length) && needs_verification.includes('identity');
                onSubmit?.(needs_poi);

                ['authenticate', 'needs_poa', 'poa_expired'].forEach(key => {
                    removeNotificationMessage({ key });
                    removeNotificationByKey({ key });
                });

                if (needs_poi) {
                    addNotificationByKey('needs_poi');
                }
            } catch (error) {
                if (isServerError(error)) {
                    setStatus({ msg: error.message });
                    setSubmitting(false);
                    setFormState({ ...form_state, ...{ is_btn_loading: false } });
                    setShouldScrollToTop(true);
                }
            }
            if (is_for_cfd_modal) {
                onSubmitForCFDModal?.(values);
            }
        };

        const { address_line_1, address_line_2, address_city, address_state, address_postcode } = form_values;

        const form_initial_values = {
            address_line_1,
            address_line_2,
            address_city,
            address_state,
            address_postcode,
        };

        if (api_initial_load_error) return <LoadErrorMessage error_message={api_initial_load_error} />;
        if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;

        if (form_initial_values.address_state) {
            const current_value = getLocation(states_list, form_initial_values.address_state, 'text');
            form_initial_values.address_state =
                states_list.length && current_value ? current_value : form_initial_values.address_state;
        } else {
            form_initial_values.address_state = '';
        }
        const setOffset = (status: { msg: string }) => {
            const mobile_scroll_offset = status?.msg ? '200px' : '154px';
            return !isDesktop && !is_for_cfd_modal ? mobile_scroll_offset : '80px';
        };

        return (
            <Formik
                initialValues={form_initial_values}
                onSubmit={onSubmitValues}
                validate={validateFields}
                enableReinitialize
            >
                {({ status, handleSubmit, isSubmitting, isValid }) => (
                    <>
                        <LeaveConfirm onDirty={!isDesktop ? showForm : undefined} />
                        {form_state.should_show_form && (
                            <form noValidate className='account-form account-form_poa' onSubmit={handleSubmit}>
                                <ThemedScrollbars
                                    height='572px'
                                    is_bypassed={!is_for_cfd_modal || !isDesktop}
                                    className={className}
                                >
                                    <FormBody scroll_offset={setOffset(status)} isFullHeight={!isDesktop}>
                                        {(status?.msg || is_resubmit) && (
                                            <HintBox
                                                className='account-form_poa-submit-error'
                                                icon='IcAlertDanger'
                                                message={
                                                    <Text as='p' size={!isDesktop ? 'xxxs' : 'xs'}>
                                                        {!status?.msg && is_resubmit && (
                                                            <Localize i18n_default_text='We were unable to verify your address with the details you provided. Please check and resubmit or choose a different document type.' />
                                                        )}
                                                        {status?.msg}
                                                    </Text>
                                                }
                                                is_danger
                                                id='dt_poa_submit-error'
                                            />
                                        )}
                                        <FormSubHeader title={localize('Address')} title_text_size='s' />
                                        <PersonalDetailsForm
                                            is_qualified_for_poa
                                            editable_fields={changeable_fields}
                                            states_list={states_list}
                                        />
                                        <FormSubHeader title={localize('Document submission')} title_text_size='s' />
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
                                            is_absolute={!isDesktop}
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
                            </form>
                        )}
                    </>
                )}
            </Formik>
        );
    }
);

export default ProofOfAddressForm;

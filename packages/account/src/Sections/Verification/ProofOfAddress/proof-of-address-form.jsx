import React from 'react';
import { Loading, Button, FormSubmitErrorMessage, Text, useStateCallback } from '@deriv/components';
import { Formik } from 'formik';
import { localize } from '@deriv/translations';
import {
    isMobile,
    removeEmptyPropertiesFromObject,
    validAddress,
    validPostCode,
    validLetterSymbol,
    validLength,
    getLocation,
    WS,
} from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import FormFooter from '../../../Components/form-footer';
import FormBody from '../../../Components/form-body';
import FormBodySection from '../../../Components/form-body-section';
import FormSubHeader from '../../../Components/form-sub-header';
import LoadErrorMessage from '../../../Components/load-error-message';
import LeaveConfirm from '../../../Components/leave-confirm';
import FileUploaderContainer from '../../../Components/file-uploader-container';
import CommonMistakeExamples from '../../../Components/poa/common-mistakes/common-mistake-examples';
import PersonalDetailsForm from '../../../Components/forms/personal-details-form.jsx';

const validate = (errors, values) => (fn, arr, err_msg) => {
    arr.forEach(field => {
        const value = values[field];
        if (!fn(value) && !errors[field] && err_msg !== true) errors[field] = err_msg;
    });
};

const FilesDescription = () => (
    <div className='files-description'>
        <Text size={isMobile() ? 'xxs' : 'xs'} as='div' className='files-description__title' weight='bold'>
            {localize(
                'We accept only these types of documents as proof of your address. The document must be recent (issued within last 6 months) and include your name and address:'
            )}
        </Text>
        <ul>
            <li>
                <Text size={isMobile() ? 'xxs' : 'xs'}>
                    {localize('Utility bill: electricity, water, gas, or landline phone bill.')}
                </Text>
            </li>
            <li>
                <Text size={isMobile() ? 'xxs' : 'xs'}>
                    {localize(
                        'Financial, legal, or government document: recent bank statement, affidavit, or government-issued letter.'
                    )}
                </Text>
            </li>
            <li>
                <Text size={isMobile() ? 'xxs' : 'xs'}>
                    {localize('Home rental agreement: valid and current agreement.')}
                </Text>
            </li>
        </ul>
    </div>
);

let file_uploader_ref = null;

const ProofOfAddressForm = observer(({ is_resubmit, onSubmit }) => {
    const { client, notifications } = useStore();
    const { account_settings, fetchResidenceList, fetchStatesList, getChangeableFields, is_eu, states_list } = client;
    const {
        addNotificationMessageByKey: addNotificationByKey,
        removeNotificationMessage,
        removeNotificationByKey,
    } = notifications;
    const [document_file, setDocumentFile] = React.useState({ files: [], error_message: null });
    const [is_loading, setIsLoading] = React.useState(true);
    const [form_values, setFormValues] = useStateCallback({});
    const [api_initial_load_error, setAPIInitialLoadError] = React.useState(null);
    const [form_state, setFormState] = useStateCallback({ should_show_form: true });

    React.useEffect(() => {
        fetchResidenceList().then(() => {
            Promise.all([fetchStatesList(), WS.wait('get_settings')]).then(() => {
                const { citizen, tax_identification_number, tax_residence } = account_settings;
                setFormValues(
                    {
                        ...account_settings,
                        ...(is_eu ? { citizen, tax_identification_number, tax_residence } : {}),
                    },
                    () => setIsLoading(false)
                );
            });
        });
    }, [account_settings, fetchResidenceList, fetchStatesList, is_eu, setFormValues]);

    const changeable_fields = [...getChangeableFields()];

    const validateFields = values => {
        Object.entries(values).forEach(([key, value]) => (values[key] = value.trim()));

        setFormState({ ...form_state, ...{ should_allow_submit: false } });
        const errors = {};
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
                errors.address_postcode = localize('Please enter a {{field_name}} under {{max_number}} characters.', {
                    field_name: localize('Postal/ZIP code'),
                    max_number: 20,
                    interpolation: { escapeValue: false },
                });
            } else if (!validPostCode(values.address_postcode)) {
                errors.address_postcode = localize('Only letters, numbers, space, and hyphen are allowed.');
            }
        }

        return errors;
    };

    const showForm = bool => {
        setFormState({ ...form_state, ...{ should_show_form: bool } });
    };

    const onSubmitValues = (values, { setStatus, setSubmitting }) => {
        setStatus({ msg: '' });
        setFormState({ ...form_state, ...{ is_btn_loading: true } });
        let settings_values = { ...values };

        if (values.address_state && states_list.length) {
            settings_values.address_state = getLocation(states_list, values.address_state, 'value') || '';
        }

        if (is_eu) {
            const { citizen, tax_residence, tax_identification_number } = form_values;
            settings_values = removeEmptyPropertiesFromObject({
                ...settings_values,
                citizen,
                tax_identification_number,
                tax_residence,
            });
        }

        WS.setSettings(settings_values).then(data => {
            if (data.error) {
                setStatus({ msg: data.error.message });
                setFormState({ ...form_state, ...{ is_btn_loading: false } });
                setSubmitting(false);
            } else {
                // force request to update settings cache since settings have been updated
                WS.authorized.storage
                    .getSettings()
                    .then(({ error, get_settings }) => {
                        if (error) {
                            setAPIInitialLoadError(error.message);
                            setSubmitting(false);
                            return;
                        }
                        const { address_line_1, address_line_2, address_city, address_state, address_postcode } =
                            get_settings;

                        setFormValues(
                            {
                                address_line_1,
                                address_line_2,
                                address_city,
                                address_state,
                                address_postcode,
                            },
                            () => setIsLoading(false)
                        );
                    })
                    .then(() => {
                        // upload files
                        file_uploader_ref?.current
                            .upload()
                            .then(api_response => {
                                if (api_response.warning) {
                                    setStatus({ msg: api_response.message });
                                    setFormState({ ...form_state, ...{ is_btn_loading: false } });
                                } else {
                                    WS.authorized.storage.getAccountStatus().then(({ error, get_account_status }) => {
                                        if (error) {
                                            setAPIInitialLoadError(error.message);
                                            setSubmitting(false);
                                            return;
                                        }
                                        setFormState(
                                            { ...form_state, ...{ is_submit_success: true, is_btn_loading: false } },
                                            () => {
                                                const { identity, needs_verification } =
                                                    get_account_status.authentication;
                                                const has_poi = !(identity && identity.status === 'none');
                                                const needs_poi =
                                                    needs_verification.length &&
                                                    needs_verification.includes('identity');
                                                onSubmit({ has_poi });
                                                removeNotificationMessage({ key: 'authenticate' });
                                                removeNotificationByKey({ key: 'authenticate' });
                                                removeNotificationMessage({ key: 'needs_poa' });
                                                removeNotificationByKey({ key: 'needs_poa' });
                                                removeNotificationMessage({ key: 'poa_expired' });
                                                removeNotificationByKey({ key: 'poa_expired' });
                                                if (needs_poi) {
                                                    addNotificationByKey('needs_poi');
                                                }
                                            }
                                        );
                                    });
                                }
                            })
                            .catch(error => {
                                setStatus({ msg: error.message });
                                setFormState({ ...form_state, ...{ is_btn_loading: false } });
                            })
                            .then(() => {
                                setSubmitting(false);
                                setFormState({ ...form_state, ...{ is_btn_loading: false } });
                            });
                    });
            }
        });
    };

    const { address_line_1, address_line_2, address_city, address_state, address_postcode } = form_values;

    const form_initial_values = {
        address_line_1,
        address_line_2,
        address_city,
        address_state,
        address_postcode,
    };

    if (api_initial_load_error) {
        return <LoadErrorMessage error_message={api_initial_load_error} />;
    }
    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    const mobile_scroll_offset = status && status.msg ? '200px' : '154px';

    if (form_initial_values.address_state) {
        form_initial_values.address_state = states_list.length
            ? getLocation(states_list, form_initial_values.address_state, 'text')
            : form_initial_values.address_state;
    } else {
        form_initial_values.address_state = '';
    }

    return (
        <Formik initialValues={form_initial_values} onSubmit={onSubmitValues} validate={validateFields}>
            {({
                values,
                errors,
                status,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                setFieldTouched,
            }) => (
                <>
                    <LeaveConfirm onDirty={isMobile() ? showForm : null} />
                    {form_state.should_show_form && (
                        <form noValidate className='account-form account-form_poa' onSubmit={handleSubmit}>
                            <FormBody scroll_offset={isMobile() ? mobile_scroll_offset : '80px'}>
                                {is_resubmit && (
                                    <Text size='xs' align='left' color='loss-danger'>
                                        {localize(
                                            'We were unable to verify your address with the details you provided. Please check and resubmit or choose a different document type.'
                                        )}
                                    </Text>
                                )}
                                <FormSubHeader title={localize('Address')} title_text_size='s' />
                                <PersonalDetailsForm
                                    is_qualified_for_poa
                                    errors={errors}
                                    touched={touched}
                                    values={values}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    setFieldValue={setFieldValue}
                                    setFieldTouched={setFieldTouched}
                                    editable_fields={changeable_fields}
                                    states_list={states_list}
                                />
                                <FormSubHeader title={localize('Document submission')} title_text_size='s' />
                                <FormBodySection>
                                    <FileUploaderContainer
                                        onRef={ref => (file_uploader_ref = ref)}
                                        onFileDrop={df => {
                                            setDocumentFile({ files: df.files, error_message: df.error_message });
                                        }}
                                        getSocket={WS.getSocket}
                                        files_description={<FilesDescription />}
                                        examples={<CommonMistakeExamples />}
                                    />
                                </FormBodySection>
                            </FormBody>
                            <FormFooter className='account-form__footer-poa'>
                                {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                                <Button
                                    className='account-form__footer-btn'
                                    type='submit'
                                    is_disabled={
                                        isSubmitting ||
                                        !!(
                                            errors.address_line_1 ||
                                            !values.address_line_1 ||
                                            errors.address_line_2 ||
                                            errors.address_city ||
                                            !values.address_city ||
                                            errors.address_postcode
                                        ) ||
                                        (document_file.files && document_file.files.length < 1) ||
                                        !!document_file.error_message
                                    }
                                    has_effect
                                    is_loading={form_state.is_btn_loading}
                                    is_submit_success={form_state.is_submit_success}
                                    text={localize('Save and submit')}
                                    primary
                                />
                            </FormFooter>
                        </form>
                    )}
                </>
            )}
        </Formik>
    );
});

export default ProofOfAddressForm;

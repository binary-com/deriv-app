import React from 'react';
import PropTypes from 'prop-types';
import {
    Autocomplete,
    Button,
    DesktopWrapper,
    MobileWrapper,
    SelectNative,
    FormSubmitErrorMessage,
    Text,
    Timeline,
} from '@deriv/components';
import { Formik, Field } from 'formik';
import FormSubHeader from 'Components/form-sub-header';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, WS } from '@deriv/shared';
import { connect } from 'Stores/connect';
import FormFooter from 'Components/form-footer';
import FormBody from 'Components/form-body';
import LoadErrorMessage from 'Components/load-error-message';
import PoincFileUploaderContainer from 'Components/poinc/file-uploader-container';

let file_uploader_ref = null;

const ProofOfIncomeForm = ({
    addNotificationByKey,
    removeNotificationByKey,
    removeNotificationMessage,
    poinc_documents_list,
    onSubmit,
}) => {
    const [document_file, setDocumentFile] = React.useState({ files: [], error_message: null });
    const [disabled_items, setDisabledItems] = React.useState([2]);
    const [api_initial_load_error, setAPIInitialLoadError] = React.useState(null);
    const [uploading_document_type, setUploadingDocumentType] = React.useState('');

    const initial_form_values = {
        document_type: '',
    };

    const validateFields = values => {
        const errors = {};
        const { document_type } = values;

        if (!document_type || !poinc_documents_list.find(c => c.text === document_type)) {
            errors.document_type = localize('This field is required.');
        }

        if (!errors.document_type) {
            setDisabledItems([]);
        } else if (!disabled_items.includes(2)) {
            setDisabledItems([2]);
        }

        return errors;
    };

    const onSubmitValues = (values, { setStatus, setSubmitting }) => {
        const uploading_value = poinc_documents_list.find(doc => doc.text === values.document_type)?.value;
        setUploadingDocumentType(uploading_value);

        file_uploader_ref?.current
            .upload()
            .then(api_response => {
                if (api_response.warning) {
                    setStatus({ msg: api_response.message });
                } else {
                    WS.authorized.storage.getAccountStatus().then(({ error, get_account_status }) => {
                        if (error) {
                            setAPIInitialLoadError(error.message);
                            return;
                        }
                        const { income, needs_verification } = get_account_status.authentication;
                        const needs_poinc =
                            needs_verification.includes('income') && ['rejected', 'none'].includes(income?.status);
                        removeNotificationMessage({ key: 'authenticate' });
                        removeNotificationByKey({ key: 'authenticate' });
                        removeNotificationMessage({ key: 'needs_poinc' });
                        removeNotificationByKey({ key: 'needs_poinc' });
                        removeNotificationMessage({ key: 'poinc_upload_limited' });
                        removeNotificationByKey({ key: 'poinc_upload_limited' });
                        onSubmit(income?.status);
                        if (needs_poinc) {
                            addNotificationByKey('needs_poinc');
                        }
                    });
                }
            })
            .catch(error => {
                setStatus({ msg: error.message });
            })
            .then(() => {
                setSubmitting(false);
            });
    };

    if (api_initial_load_error) {
        return <LoadErrorMessage error_message={api_initial_load_error} />;
    }

    return (
        <Formik initialValues={initial_form_values} onSubmit={onSubmitValues} validate={validateFields}>
            {({
                values,
                errors,
                status,
                touched,
                handleChange,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                setStatus,
            }) => (
                <form noValidate className='account-poinc-form' onSubmit={handleSubmit}>
                    <FormBody scroll_offset={isDesktop() ? '0' : '200px'}>
                        <Timeline disabled_items={disabled_items} className='account-poinc-form__timeline-container'>
                            <Timeline.Item>
                                <fieldset className='account-poinc-form__fieldset'>
                                    <Field name='document_type'>
                                        {({ field }) => (
                                            <React.Fragment>
                                                <DesktopWrapper>
                                                    <Autocomplete
                                                        {...field}
                                                        name='document_type'
                                                        data-lpignore='true'
                                                        autoComplete='off'
                                                        type='text'
                                                        list_height='36rem'
                                                        placeholder={localize('Please select a document to upload*')}
                                                        error={touched.document_type && errors.document_type}
                                                        list_items={poinc_documents_list}
                                                        value={values.document_type}
                                                        onChange={handleChange}
                                                        onItemSelection={({ value, text }) => {
                                                            setFieldValue('document_type', value ? text : '', true);
                                                            setStatus({ msg: '' });
                                                        }}
                                                        required
                                                    />
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        name='document_type'
                                                        placeholder={localize('Please select a document to upload*')}
                                                        label={localize('Please select a document to upload*')}
                                                        value={values.document_type}
                                                        list_items={poinc_documents_list}
                                                        error={touched.document_type && errors.document_type}
                                                        use_text={true}
                                                        onChange={e => {
                                                            setFieldValue('document_type', e.target.value, true);
                                                            setStatus({ msg: '' });
                                                        }}
                                                        required
                                                    />
                                                </MobileWrapper>
                                            </React.Fragment>
                                        )}
                                    </Field>
                                </fieldset>
                            </Timeline.Item>
                            <Timeline.Item>
                                <div className='account-poinc-form__upload-field'>
                                    <div className='account-poinc-form__notes-container'>
                                        <FormSubHeader title={localize('Please note:')} />
                                        <div className='account__file-uploader-box account__file-uploader-box-dashboard'>
                                            <Text size='xs' line_height='s'>
                                                <Localize i18n_default_text='The document must be up-to-date and signed by the issuance authority' />
                                            </Text>
                                            <Text size='xs' line_height='s'>
                                                <Localize i18n_default_text='The document must contain a letterhead' />
                                            </Text>
                                            <Text size='xs' line_height='s'>
                                                <Localize i18n_default_text='Invalid or incomplete documents shall be rejected' />
                                            </Text>
                                        </div>
                                    </div>
                                    <PoincFileUploaderContainer
                                        onRef={ref => (file_uploader_ref = ref)}
                                        onFileDrop={df => {
                                            setDocumentFile({
                                                files: df.files,
                                                error_message: df.error_message,
                                            });
                                            setStatus({ msg: '' });
                                        }}
                                        getSocket={WS.getSocket}
                                        document_type={uploading_document_type}
                                    />
                                </div>
                            </Timeline.Item>
                        </Timeline>
                    </FormBody>
                    <FormFooter className='account-form__footer-poinc'>
                        {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                        <Button
                            className='account-form__footer-btn'
                            type='submit'
                            is_disabled={
                                isSubmitting ||
                                !!(!values.document_type || errors.document_type) ||
                                document_file.files?.length < 1 ||
                                !!document_file.error_message ||
                                !!status.msg
                            }
                            is_loading={isSubmitting}
                            has_effect
                            text={localize('Save and submit')}
                            primary
                        />
                    </FormFooter>
                </form>
            )}
        </Formik>
    );
};

ProofOfIncomeForm.propTypes = {
    addNotificationByKey: PropTypes.func,
    onSubmit: PropTypes.func,
    removeNotificationByKey: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    poinc_documents_list: PropTypes.array,
};

export default connect(({ notifications }) => ({
    addNotificationByKey: notifications.addNotificationMessageByKey,
    removeNotificationMessage: notifications.removeNotificationMessage,
    removeNotificationByKey: notifications.removeNotificationByKey,
}))(ProofOfIncomeForm);

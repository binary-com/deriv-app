import classNames from 'classnames';
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, FormSubmitErrorMessage, useStateCallback } from '@deriv/components';
import { Formik } from 'formik';
import { localize } from '@deriv/translations';
import FormFooter from '../../../Components/form-footer';
import FormBody from '../../../Components/form-body';
import FormSubHeader from '../../../Components/form-sub-header';
import FormBodySection from '../../../Components/form-body-section';
import { isMobile, compressImageFiles, readFiles, WS } from '@deriv/shared';
import Card from './Card.jsx';
import DocumentUploader from '@binary-com/binary-document-uploader';

const getScrollOffset = (items_count = 0) => {
    if (isMobile()) return '200px';
    if (items_count <= 2) return '0px';
    return '80px';
};
const ProofOfOwnershipForm = ({ cards, updateAccountStatus, refreshNotifications, is_dark_mode }) => {
    const initial_values = {};
    const [is_disabled, setIsDisabled] = React.useState(true);
    initial_values.data = cards?.map(item => {
        return { id: item.id, files: [], payment_method_identifier: '', files_required: 1, is_generic_pm: false };
    });
    const [form_state, setFormState] = useStateCallback({ should_show_form: true });
    const form_ref = useRef();
    const [document_upload_errors, setDocumentUploadErrors] = useState();
    useEffect(() => {
        setDocumentUploadErrors([]);
    }, []);
    const fileReadErrorMessage = filename => {
        return localize('Unable to read file {{name}}', { name: filename });
    };
    const validateFields = values => {
        const checked_indices = [];
        const errors = {};
        errors.data = [...document_upload_errors];
        let is_file_uploaded;
        values.data.map((element, index) => {
            const is_pm_identifier_provided = element?.is_generic_pm || element?.payment_method_identifier?.length > 0;
            is_file_uploaded = false;
            element.files.forEach((file, i) => {
                if (file?.type && !/(image|application)\/(jpe?g|pdf|png)$/.test(file?.type)) {
                    errors.data[index] = {};
                    errors.data[index].files = [];
                    errors.data[index].files[i] = localize(
                        "That file format isn't supported. Please upload .pdf, .png, .jpg, or .jpeg files only."
                    );
                }
                if (file?.size / 1024 > 8000) {
                    errors.data[index] = {};
                    errors.data[index].files = [];
                    errors.data[index].files[i] = localize(
                        'That file is too big (only up to 8MB allowed). Please upload another file.'
                    );
                }
            });
            if (element.files_required === element.files.filter(Boolean).length) {
                if (!is_pm_identifier_provided) {
                    errors.data[index] = typeof errors.data[index] === 'object' ? errors.data[index] : {};
                    errors.data[index].payment_method_identifier = localize('Please complete this field.');
                }
                checked_indices.push(index);
            }
        });
        is_file_uploaded = checked_indices.length === values?.data?.length;
        if (errors?.data?.every(element => element === undefined)) {
            errors.data = [];
            setDocumentUploadErrors(errors?.data);
        }
        setIsDisabled(!is_file_uploaded || errors?.data?.length > 0);
        return errors;
    };
    const updateErrors = (index, sub_index) => {
        const errors = {};
        errors.data = [...document_upload_errors];
        if (typeof errors.data[index] === 'object') {
            errors.data[index].files[sub_index] = undefined;
            const other_files = errors?.data[index]?.files?.some(file => file !== undefined);
            if (!other_files) {
                errors.data[index] = undefined;
            }
        }
        setDocumentUploadErrors(errors?.data);
        setIsDisabled(true);
    };
    const handleSubmit = async () => {
        try {
            setFormState({ ...form_state, ...{ is_btn_loading: true } });
            const { data: formValues } = form_ref.current.values;
            const uploader = new DocumentUploader({ connection: WS.getSocket() });
            const { get_settings, error } = await WS.authorized.storage.getSettings();
            if (error) {
                throw new Error(error);
            }
            if (form_ref.current.errors.length > 0) {
                // Only upload if no errors and a file has been attached
                return;
            }
            formValues.forEach(async (values, index) => {
                if (values.files.length > 0) {
                    const files_to_process = await compressImageFiles(values.files);
                    const processed_files = await readFiles(files_to_process, fileReadErrorMessage);
                    if (typeof processed_files === 'string') {
                        // eslint-disable-next-line no-console
                        console.warn(processed_files);
                    }
                    processed_files.forEach(async (processed_file, sub_index) => {
                        const files_to_send = processed_file;
                        files_to_send.proof_of_ownership = {
                            details: {
                                email: get_settings.email,
                                payment_method_identifier: values.payment_method_identifier,
                            },
                            id: values.id,
                        };
                        files_to_send.documentType = 'proof_of_ownership';
                        const response = await uploader.upload(files_to_send);
                        if (response.warning) {
                            if (response.warning.trim() === 'DuplicateUpload') {
                                form_ref.current.errors.data = document_upload_errors;
                                const { data: form_errors } = form_ref?.current?.errors;
                                if (typeof form_errors[index] !== 'object') {
                                    form_errors[index] = {};
                                }
                                form_errors[index].files = Array.isArray(form_errors[index].files)
                                    ? form_errors[index].files
                                    : [];
                                form_errors[index].files[sub_index] = localize(response.message); // Document already uploaded
                                setDocumentUploadErrors(form_errors);
                                form_ref.current.setErrors(form_errors);
                                form_ref.current.validateForm();
                                setFormState({ ...form_state, ...{ is_btn_loading: false } });
                            } else {
                                setFormState({ ...form_state, ...{ is_btn_loading: false } });
                                // eslint-disable-next-line no-console
                                console.warn(response);
                            }
                        } else {
                            updateAccountStatus();
                            refreshNotifications();
                        }
                    });
                }
            });
        } catch (err) {
            setFormState({ ...form_state, ...{ is_btn_loading: false } });
            // eslint-disable-next-line no-console
            console.warn(err);
        }
    };
    return (
        <Formik initialValues={initial_values} validate={validateFields} innerRef={form_ref}>
            {({ values, errors, handleChange, handleBlur, setFieldValue, validateField }) => (
                <form
                    className='proof-of-ownership'
                    onSubmit={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    }}
                >
                    <FormBody scroll_offset={getScrollOffset(cards.length)}>
                        <FormSubHeader title={localize('Please upload the following document(s).')} />
                        <FormBodySection>
                            <fieldset>
                                {cards.map((card, index) => {
                                    return (
                                        <div className='proof-of-ownership__form-content' key={card.id}>
                                            <div className='proof-of-ownership__progress'>
                                                <div className='proof-of-ownership__progress-number'>{index + 1}</div>
                                                {index !== cards.length - 1 && (
                                                    <div className='proof-of-ownership__progress-bar' />
                                                )}
                                            </div>
                                            <Card
                                                error={errors?.data?.[index]}
                                                index={index}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                values={values}
                                                card={card}
                                                setFieldValue={setFieldValue}
                                                validateField={validateField}
                                                updateErrors={updateErrors}
                                                is_dark_mode={is_dark_mode}
                                            />
                                        </div>
                                    );
                                })}
                            </fieldset>
                        </FormBodySection>
                    </FormBody>
                    <FormFooter>
                        {status?.msg && <FormSubmitErrorMessage message={status?.msg} />}
                        <Button
                            type='submit'
                            className={classNames('account-form__footer-btn')}
                            is_disabled={is_disabled}
                            data-testid={'submit-button'}
                            has_effect
                            text={localize('Submit')}
                            large
                            primary
                            is_loading={form_state.is_btn_loading}
                            onClick={handleSubmit}
                        />
                    </FormFooter>
                </form>
            )}
        </Formik>
    );
};

ProofOfOwnershipForm.propTypes = {
    cards: PropTypes.array,
    updateAccountStatus: PropTypes.func,
    refreshNotifications: PropTypes.func,
    is_dark_mode: PropTypes.bool,
};

export default ProofOfOwnershipForm;

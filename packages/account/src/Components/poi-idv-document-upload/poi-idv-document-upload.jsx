import React from 'react';
import classNames from 'classnames';
import { Autocomplete, Button, DesktopWrapper, Input, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { Formik, Field } from 'formik';
import { localize } from '@deriv/translations';
import FormFooter from 'Components/form-footer';
import { getDocumentData, formatInput } from './document-data';
import BackButtonIcon from '../../Assets/ic-poi-back-btn.svg';
import DocumentUploadLogo from '../../Assets/ic-document-upload-icon.svg';

const IdvDocumentUpload = ({ selected_country, handleViewComplete, handleBack }) => {
    const [document_list, setDocumentList] = React.useState([]);
    const [document_image, setDocumentImage] = React.useState(null);
    const [is_input_disable, setInputDisable] = React.useState(true);

    const document_data = selected_country.identity.services.idv.documents_supported;
    const country_code = selected_country.value;

    React.useEffect(() => {
        setDocumentList(
            Object.keys(document_data).map(i => {
                const { display_name, format } = document_data[i];
                return { id: i, text: display_name, value: format };
            })
        );
    }, [document_data]);

    const initial_form = {
        document_type: '',
        document_number: '',
    };

    const validateFields = values => {
        const errors = {};
        const { document_type, document_number } = values;

        if (!document_type) {
            errors.document_type = localize('Please select a document type.');
        } else {
            setInputDisable(false);
        }

        if (!document_number) {
            errors.document_number = localize('Please enter your document number.');
        } else {
            const selected_document = document_list.find(d => d.text === document_type);
            const format_regex = new RegExp(selected_document.value);
            if (!format_regex.test(document_number)) {
                errors.document_number = localize(
                    `Please enter the correct format. Example: ${
                        getDocumentData(country_code, selected_document.id).example_format
                    }`
                );
            }
        }

        return errors;
    };

    const submitHandler = async values => {
        // TODO: Implement submission
        // eslint-disable-next-line
        console.log(values);
        handleViewComplete();
    };

    return (
        <Formik initialValues={initial_form} validate={validateFields} submit={submitHandler}>
            {({ errors, setFieldValue, touched, values, handleChange, handleBlur, isSubmitting, isValid, dirty }) => (
                <div className='proof-of-identity__container'>
                    <DocumentUploadLogo className='btm-spacer' />
                    <Text className='proof-of-identity__header' align='center' weight='bold'>
                        {localize('Verify your identity')}
                    </Text>
                    <Text className='btm-spacer'>
                        {localize('Please select the document type and enter the document number.')}
                    </Text>
                    <div className='proof-of-identity__inner-container'>
                        <div
                            className={classNames('proof-of-identity__container', {
                                'proof-of-identity__container-no-margin': document_image,
                            })}
                        >
                            <fieldset className='proof-of-identity__fieldset'>
                                <Field name='document'>
                                    {({ field }) => (
                                        <React.Fragment>
                                            <DesktopWrapper>
                                                <div className='document-dropdown'>
                                                    <Autocomplete
                                                        {...field}
                                                        name='document_type'
                                                        data-lpignore='true'
                                                        error={touched.document_type && errors.document_type}
                                                        autoComplete='off'
                                                        type='text'
                                                        label={localize('Choose the document type')}
                                                        list_items={document_list}
                                                        value={values.document_type}
                                                        onChange={handleChange}
                                                        onItemSelection={({ text }) => {
                                                            setFieldValue('document_type', text || '', true);
                                                            const selected_document = document_list.find(
                                                                d => d.text === text
                                                            );
                                                            const { sample_image } = getDocumentData(
                                                                country_code,
                                                                selected_document.id
                                                            );
                                                            setDocumentImage(sample_image || null);
                                                        }}
                                                        required
                                                    />
                                                </div>
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <SelectNative
                                                    {...field}
                                                    name='document_type'
                                                    error={touched.document_type && errors.document_type}
                                                    label={localize('Choose the document type')}
                                                    list_items={document_list}
                                                    value={values.document_type}
                                                    onChange={e => {
                                                        handleChange(e);
                                                        setFieldValue('document_type', e.target.value, true);
                                                    }}
                                                    onItemSelection={({ text }) =>
                                                        setFieldValue('document_type', text || '', true)
                                                    }
                                                    use_text={true}
                                                    required
                                                />
                                            </MobileWrapper>
                                        </React.Fragment>
                                    )}
                                </Field>
                            </fieldset>
                            <fieldset className='proof-of-identity__fieldset'>
                                <Field name='document_number'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            name='document_number'
                                            disabled={is_input_disable}
                                            error={touched.document_number && errors.document_number}
                                            autoComplete='off'
                                            placeholder='Enter your document number'
                                            value={values.document_number}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            onKeyup={e => {
                                                setFieldValue(
                                                    'document_number',
                                                    formatInput(
                                                        getDocumentData(country_code, values.document_type)
                                                            .sample_format,
                                                        e.target.value,
                                                        '-'
                                                    ),
                                                    true
                                                );
                                            }}
                                            required
                                        />
                                    )}
                                </Field>
                            </fieldset>
                        </div>
                        {document_image && (
                            <div className='proof-of-identity__sample-container'>
                                <Text weight='bold'>{localize('Sample:')}</Text>
                                <div className='proof-of-identity__image-container'>
                                    <img
                                        className='proof-of-identity__image'
                                        src={document_image}
                                        alt='document sample image'
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <FormFooter>
                        <Button className='back-btn' type='button' has_effect large secondary>
                            <BackButtonIcon className='back-btn' onClick={handleBack} /> {localize('Go Back')}
                        </Button>
                        <Button
                            type='button'
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid}
                            text={localize('Next')}
                            large
                            primary
                        />
                    </FormFooter>
                </div>
            )}
        </Formik>
    );
};

export default IdvDocumentUpload;

/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck [TODO] - Need to fix typescript errors

import React from 'react';
import clsx from 'clsx';
import { Field, FormikProps, FieldProps, useFormikContext } from 'formik';
import { ResidenceList } from '@deriv/api-types';
import { Autocomplete, Input, SelectNative } from '@deriv/components';
import { formatInput, getIDVNotApplicableOption } from '@deriv/shared';
import { localize } from '@deriv/translations';
import {
    getDocumentData,
    preventEmptyClipboardPaste,
    generatePlaceholderText,
    getExampleFormat,
} from '../../Helpers/utils';
import { TDocument, TIDVFormValues } from '../../Types';
import { useDevice } from '@deriv-com/ui';

type TIDVFormProps = {
    selected_country: ResidenceList[0];
    hide_hint?: boolean;
    class_name?: string;
    is_for_real_account_signup_modal?: boolean;
    is_for_mt5?: boolean;
};

const IDVForm = ({
    class_name,
    selected_country,
    hide_hint,
    is_for_real_account_signup_modal = false,
    is_for_mt5 = false,
}: TIDVFormProps) => {
    const [document_list, setDocumentList] = React.useState<Array<TDocument>>([]);
    const [selected_doc, setSelectedDoc] = React.useState('');
    const { isDesktop } = useDevice();

    const { documents_supported: document_data } = selected_country?.identity?.services?.idv ?? {};

    const { errors, touched, values, handleBlur, handleChange, setFieldValue }: FormikProps<TIDVFormValues> =
        useFormikContext();
    const default_document = {
        id: '',
        text: '',
        value: '',
        example_format: '',
    };

    const IDV_NOT_APPLICABLE_OPTION = React.useMemo(
        () => getIDVNotApplicableOption(is_for_real_account_signup_modal),
        [is_for_real_account_signup_modal]
    );

    React.useEffect(() => {
        if (document_data && selected_country && selected_country.value) {
            const document_types = Object.keys(document_data);
            if (document_types.length === 0) return;

            const new_document_list = document_types.map(key => {
                const { display_name, format } = document_data[key];
                const { new_display_name, example_format, additional_document_example_format } = getDocumentData(
                    selected_country.value ?? '',
                    key
                );
                const needs_additional_document = !!document_data[key].additional;

                if (needs_additional_document) {
                    return {
                        id: key,
                        text: display_name ?? new_display_name, // Display document name from API if available, else use the one from the helper function
                        additional: {
                            display_name: document_data[key].additional?.display_name,
                            format: document_data[key].additional?.format,
                            example_format: additional_document_example_format,
                        },
                        value: format,
                        example_format,
                    };
                }
                return {
                    id: key,
                    text: display_name ?? new_display_name, // Display document name from API if available, else use the one from the helper function
                    value: format,
                    example_format,
                };
            });

            setDocumentList([...new_document_list, IDV_NOT_APPLICABLE_OPTION]);
        }
    }, [document_data, selected_country, IDV_NOT_APPLICABLE_OPTION, is_for_mt5]);

    const resetDocumentItemSelected = () => {
        setFieldValue('document_type', default_document, true);
    };

    const getDocument = (text: string) => {
        return document_list.find(d => d.text === text) ?? default_document;
    };

    const onKeyUp = (e: { target: HTMLInputElement }, document_name: string) => {
        const example_format =
            document_name === 'document_number'
                ? values?.document_type?.example_format
                : values?.document_type?.additional?.example_format;
        let current_input: string | null = null;
        current_input = example_format?.includes('-')
            ? formatInput(example_format, current_input ?? e.target.value, '-')
            : e.target.value;
        setFieldValue(document_name, current_input, true);
    };

    const bindDocumentData = (item: TDocument) => {
        setFieldValue('document_type', item, true);
        setSelectedDoc(item?.id);
        if (item?.id === IDV_NOT_APPLICABLE_OPTION.id) {
            setFieldValue('document_number', '', false);
            setFieldValue('document_additional', '', false);
        }
    };
    return (
        <section className={clsx('idv-form', class_name)}>
            <div className='details-form'>
                <div className='poi-form-on-signup__fields'>
                    <div
                        className={clsx('proof-of-identity__container', {
                            'proof-of-identity__container--idv': hide_hint,
                        })}
                    >
                        <div className={clsx('proof-of-identity__inner-container')}>
                            <div className='proof-of-identity__fieldset-container'>
                                <fieldset className={clsx({ 'proof-of-identity__fieldset': !hide_hint })}>
                                    <Field name='document_type'>
                                        {({ field }: FieldProps) => (
                                            <React.Fragment>
                                                {isDesktop ? (
                                                    <Autocomplete
                                                        {...field}
                                                        data-lpignore='true'
                                                        error={touched.document_type && errors.document_type}
                                                        autoComplete='off'
                                                        type='text'
                                                        label={localize('Choose the document type')}
                                                        list_items={document_list}
                                                        value={values.document_type.text}
                                                        onBlur={(e: { target: HTMLInputElement }) => {
                                                            handleBlur(e);
                                                            if (!getDocument(e.target.value)) {
                                                                resetDocumentItemSelected();
                                                            }
                                                        }}
                                                        onChange={handleChange}
                                                        onItemSelection={(item: TDocument) => {
                                                            if (item.text === 'No results found' || !item.text) {
                                                                setSelectedDoc('');
                                                                resetDocumentItemSelected();
                                                            } else {
                                                                bindDocumentData(item);
                                                            }
                                                        }}
                                                        required
                                                    />
                                                ) : (
                                                    <SelectNative
                                                        {...field}
                                                        name='document_type'
                                                        error={
                                                            touched.document_type &&
                                                            (errors.document_type as string | undefined)
                                                        }
                                                        label={localize('Choose the document type')}
                                                        placeholder={localize('Please select')}
                                                        list_items={document_list}
                                                        value={values.document_type.text}
                                                        onChange={e => {
                                                            handleChange(e);
                                                            const selected_document = getDocument(e.target.value);
                                                            bindDocumentData(selected_document);
                                                        }}
                                                        use_text={true}
                                                        required
                                                    />
                                                )}
                                            </React.Fragment>
                                        )}
                                    </Field>
                                </fieldset>
                                {values?.document_type?.id !== IDV_NOT_APPLICABLE_OPTION.id && (
                                    <React.Fragment>
                                        <fieldset
                                            className={clsx('additional-field', {
                                                'proof-of-identity__fieldset-input': !hide_hint,
                                            })}
                                        >
                                            <Field name='document_number'>
                                                {({ field }: FieldProps) => (
                                                    <Input
                                                        {...field}
                                                        name='document_number'
                                                        bottom_label={
                                                            values.document_type &&
                                                            getExampleFormat(values.document_type.example_format ?? '')
                                                        }
                                                        disabled={!values.document_type.id}
                                                        error={
                                                            (values.document_type.id &&
                                                                touched.document_number &&
                                                                errors.document_number) ||
                                                            errors.error_message
                                                        }
                                                        autoComplete='off'
                                                        placeholder={generatePlaceholderText(selected_doc)}
                                                        value={values.document_number}
                                                        onPaste={preventEmptyClipboardPaste}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        onKeyUp={(e: { target: HTMLInputElement }) =>
                                                            onKeyUp(e, 'document_number')
                                                        }
                                                        required
                                                        label={
                                                            values.document_type.id &&
                                                            generatePlaceholderText(selected_doc)
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </fieldset>
                                        {values.document_type.additional?.display_name && (
                                            <fieldset className='additional-field'>
                                                <Field name='document_additional'>
                                                    {({ field }: FieldProps) => {
                                                        const additional_document_placeholder = localize(
                                                            'Enter your {{document_name}}',
                                                            {
                                                                document_name:
                                                                    values.document_type?.additional?.display_name?.toLowerCase() ??
                                                                    localize('additional document number'),
                                                            }
                                                        );
                                                        return (
                                                            <Input
                                                                {...field}
                                                                name='document_additional'
                                                                bottom_label={
                                                                    values.document_type.additional &&
                                                                    getExampleFormat(
                                                                        values.document_type.additional?.example_format
                                                                    )
                                                                }
                                                                disabled={!values.document_type.id}
                                                                error={
                                                                    (touched.document_additional &&
                                                                        errors.document_additional) ||
                                                                    errors.error_message
                                                                }
                                                                autoComplete='off'
                                                                placeholder={additional_document_placeholder}
                                                                value={values.document_additional}
                                                                onPaste={preventEmptyClipboardPaste}
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                onKeyUp={(e: { target: HTMLInputElement }) =>
                                                                    onKeyUp(e, 'document_additional')
                                                                }
                                                                required
                                                            />
                                                        );
                                                    }}
                                                </Field>
                                            </fieldset>
                                        )}
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IDVForm;

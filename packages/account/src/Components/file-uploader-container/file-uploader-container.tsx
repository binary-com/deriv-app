/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck [TODO] - Need to fix typescript errors in this file
import React from 'react';
import { Autocomplete, Loading, Text } from '@deriv/components';
import { Localize, useTranslations } from '@deriv-com/translations';
import FileUploader from './file-uploader';
import { useDevice } from '@deriv-com/ui';
import { useKycAuthStatus } from '../../hooks';
import { getSupportedProofOfAddressDocuments } from '../../Constants/file-uploader';
import { TListItem } from 'Types';
import { Field, FieldProps } from 'formik';

type TFileUploaderContainer = {
    onFileDrop: (files: File[]) => void;
    country_of_residence?: string;
    files_description?: React.ReactNode;
    examples?: React.ReactNode;
    onError?: (error_message: string) => void;
    placeholder?: string;
};

const FileUploaderContainer = ({
    examples,
    files_description,
    country_of_residence,
    onFileDrop,
    onError,
    placeholder,
}: TFileUploaderContainer) => {
    const { isMobile } = useDevice();
    const { localize } = useTranslations();
    const { kyc_auth_status, isLoading } = useKycAuthStatus({ country: country_of_residence });
    const [document_list, setDocumentList] = React.useState<Required<TListItem>[]>([]);

    React.useEffect(() => {
        if (kyc_auth_status) {
            const { address } = kyc_auth_status;
            const { supported_documents } = address;
            const doc_list = getSupportedProofOfAddressDocuments().filter(doc =>
                supported_documents?.includes(doc.value)
            );
            setDocumentList(doc_list);
        }
    }, [kyc_auth_status]);

    if (isLoading) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <div className='file-uploader__container' data-testid='dt_file_uploader_container'>
            {files_description}
            {examples}
            {country_of_residence && (
                <React.Fragment>
                    <Text size={isMobile ? 'xxs' : 'xs'} as='div' className='file-uploader__file-title' weight='bold'>
                        <Localize i18n_default_text='Select the type of document:' />
                    </Text>
                    <Field name='document_type'>
                        {({ field, form: { setFieldValue } }: FieldProps<string>) => (
                            <Autocomplete
                                {...field}
                                data-lpignore='true'
                                autoComplete='off'
                                list_items={document_list}
                                type='text'
                                value={field.value}
                                label={placeholder}
                                placeholder={placeholder ?? localize('Select a document')}
                                onItemSelection={(item: TListItem) => {
                                    setFieldValue('document_type', item.text, true);
                                }}
                                required
                            />
                        )}
                    </Field>
                </React.Fragment>
            )}
            <Text size={isMobile ? 'xxs' : 'xs'} as='div' className='file-uploader__file-title' weight='bold'>
                <Localize i18n_default_text='Upload file' />
            </Text>
            <div className='file-uploader__file-dropzone-wrapper'>
                <FileUploader onError={onError} onFileDrop={onFileDrop} />
            </div>
            <div className='file-uploader__file-supported-formats'>
                <Text size={isMobile ? 'xxxs' : 'xxs'}>
                    <Localize i18n_default_text='Supported formats: JPEG, JPG, PNG, PDF, and GIF only' />
                </Text>
                <Text size={isMobile ? 'xxxs' : 'xxs'}>
                    <Localize i18n_default_text='Maximum size: 8MB' />
                </Text>
            </div>
        </div>
    );
};

export default FileUploaderContainer;

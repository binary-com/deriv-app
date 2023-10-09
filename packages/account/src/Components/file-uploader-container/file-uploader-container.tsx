import React from 'react';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import FileUploader from './file-uploader';

type TFileUploaderContainer = {
    onFileDrop: (files: File[]) => void;
    files_description: React.ReactNode;
    examples: React.ReactNode;
    onError?: (error_message: string) => void;
};

const FileUploaderContainer = ({ examples, files_description, onFileDrop, onError }: TFileUploaderContainer) => (
    <div className='file-uploader__container' data-testid='dt_file_uploader_container'>
        {files_description}
        <Text size={isMobile() ? 'xxs' : 'xs'} as='div' className='file-uploader__file-title' weight='bold'>
            <Localize i18n_default_text='Upload file' />
        </Text>
        <div className='file-uploader__file-dropzone-wrapper'>
            <FileUploader onError={onError} onFileDrop={onFileDrop} />
        </div>
        <div className='file-uploader__file-supported-formats'>
            <Text size={isMobile() ? 'xxxs' : 'xxs'}>
                <Localize i18n_default_text='Supported formats: JPEG, JPG, PNG, PDF and GIF only' />
            </Text>
            <Text size={isMobile() ? 'xxxs' : 'xxs'}>
                <Localize i18n_default_text='Maximum size: 8MB' />
            </Text>
        </div>
        {examples}
    </div>
);

export default FileUploaderContainer;

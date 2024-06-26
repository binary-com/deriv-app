import React from 'react';
import clsx from 'clsx';
import { FileDropzone, Icon, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { getSupportedFiles, max_document_size, supported_filetypes } from '@deriv/shared';
import { DropzoneOptions } from 'react-dropzone';
import { useDevice } from '@deriv-com/ui';
import { TFile } from '../../Types';

type THandleRejectedFiles = DropzoneOptions['onDropRejected'];

type TFileUploaderProps = {
    onFileDrop: (files: File[]) => void;
    onError?: (error_message: string) => void;
};

const UploadMessage = () => {
    const { isDesktop, isMobile } = useDevice();

    return (
        <React.Fragment>
            <Icon icon='IcUpload' className='dc-file-dropzone__message-icon' size={30} />
            <div className='dc-file-dropzone__message-subtitle'>
                <Text size='xxs' align='center' weight='bold' color='less-prominent'>
                    {isDesktop ? (
                        <Localize i18n_default_text='Drag and drop a file or click to browse your files.' />
                    ) : (
                        <Localize i18n_default_text='Click here to browse your files.' />
                    )}
                </Text>
                <Text size={isMobile ? 'xxxxs' : 'xxxs'} align='center' color='less-prominent'>
                    <Localize i18n_default_text='Remember, selfies, pictures of houses, or non-related images will be rejected.' />
                </Text>
            </div>
        </React.Fragment>
    );
};

const FileUploader = ({ onFileDrop, onError }: TFileUploaderProps) => {
    const [document_files, setDocumentFiles] = React.useState<File[]>([]);
    const [file_error, setFileError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (document_files) {
            onFileDrop(document_files);
            onError?.('');
        }
    }, [document_files, onFileDrop, onError]);

    const handleAcceptedFiles = (files: File[]) => {
        if (files.length > 0) {
            setDocumentFiles(files);
            setFileError(null);
            onError?.('');
        }
    };

    const handleRejectedFiles: THandleRejectedFiles = files => {
        const is_file_too_large = files.length > 0 && files[0].file.size > max_document_size;
        const supported_files = files.filter(each_file => getSupportedFiles(each_file.file.name));
        const error_message =
            is_file_too_large && supported_files.length > 0
                ? localize('File size should be 8MB or less')
                : localize('File uploaded is not supported');

        setDocumentFiles([]);
        onError?.(error_message);
        setFileError(error_message);
    };

    const removeFile = () => {
        setDocumentFiles([]);
        setFileError(null);
        onError?.('');
    };

    return (
        <React.Fragment>
            <FileDropzone
                accept={supported_filetypes}
                error_message={localize('Please upload supported file type.')}
                filename_limit={26}
                hover_message={localize('Drop files here..')}
                max_size={max_document_size}
                message={<UploadMessage />}
                multiple={false}
                onDropAccepted={handleAcceptedFiles}
                onDropRejected={handleRejectedFiles}
                validation_error_message={file_error}
                value={document_files as TFile[]}
            />
            {((document_files && document_files?.length > 0) || file_error) && (
                <div className='file-uploader__remove-btn-container'>
                    <Icon
                        icon='IcCloseCircle'
                        className={clsx('file-uploader__remove-btn', {
                            'file-uploader__remove-btn--error': file_error,
                        })}
                        onClick={removeFile}
                        color='secondary'
                        data_testid='dt_remove_file_icon'
                    />
                </div>
            )}
        </React.Fragment>
    );
};

export default FileUploader;

import React from 'react';
import { Icon, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { localize } from 'Components/i18next';
import FileDropzone from 'Components/file-dropzone';

type TFileUploaderComponentProps = {
    accept: string;
    hover_message: string;
    max_size: number;
    multiple?: boolean;
    onClickClose: () => void;
    onDropAccepted: (files: File[]) => void;
    onDropRejected: (files: File[]) => void;
    upload_message: string;
    validation_error_message: string | null;
    value: (File & { file: Blob })[];
};

const FileUploaderComponent = ({
    accept,
    hover_message,
    max_size,
    multiple = false,
    onClickClose,
    onDropAccepted,
    onDropRejected,
    upload_message,
    validation_error_message,
    value,
}: TFileUploaderComponentProps) => {
    const {
        ui: { is_mobile_or_tablet },
    } = useStore();

    const getUploadMessage = React.useCallback(() => {
        return (
            <>
                <Icon icon='IcCloudUpload' size={50} />
                <Text
                    as='div'
                    line-height={is_mobile_or_tablet ? 'xl' : 'l'}
                    size={is_mobile_or_tablet ? 'xxs' : 'xs'}
                    weight='bold'
                >
                    {upload_message}
                </Text>
            </>
        );
    }, [is_mobile_or_tablet, upload_message]);

    return (
        <div className='file-uploader-component'>
            <FileDropzone
                accept={accept}
                error_message={localize('Please upload supported file type.')}
                filename_limit={26}
                hover_message={hover_message}
                max_size={max_size}
                message={getUploadMessage()}
                multiple={multiple}
                onDropAccepted={onDropAccepted}
                onDropRejected={onDropRejected}
                validation_error_message={validation_error_message}
                value={value}
            />
            {(value.length > 0 || !!validation_error_message) && (
                <Icon
                    className='file-uploader-component__close-icon'
                    color='secondary'
                    data_testid='dt_remove_file_icon'
                    icon='IcCloseCircle'
                    onClick={onClickClose}
                />
            )}
        </div>
    );
};

export default React.memo(FileUploaderComponent);

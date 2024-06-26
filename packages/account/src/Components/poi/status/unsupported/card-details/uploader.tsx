import React from 'react';
import clsx from 'clsx';
import { Field, FieldProps, FormikProps, FormikValues } from 'formik';
import { localize } from '@deriv/translations';
import { supported_filetypes, max_document_size } from '@deriv/shared';
import { Button, Icon, Text, FileDropzone } from '@deriv/components';
import { ROOT_CLASS } from '../constants';
import { useDevice } from '@deriv-com/ui';

const DROPZONE_ERRORS = {
    'file-too-large': localize('File size should be 8MB or less'),
    'file-invalid-type': localize('File uploaded is not supported'),
    'too-many-files': localize('Please select one file only'),
    GENERAL: localize('Sorry, an error occured. Please select another file.'),
};
type TDROPZONE_ERRORS = Readonly<typeof DROPZONE_ERRORS>;

type TUploader = {
    data: FormikValues;
    value: FormikValues;
    is_full?: boolean;
    has_frame?: boolean;
    onChange?: (e: unknown) => void;
    setFieldValue: FormikProps<FormikValues>['setFieldValue'];
    handleChange: (file: object | null, setFieldValue: FormikProps<FormikValues>['setFieldValue']) => void;
};

type TMessage = {
    data?: FormikValues;
    open?: () => void;
};

type THandleRejectFiles = Array<{
    file: File;
    errors: [
        {
            message: string;
            code: string;
        }
    ];
}>;

const Message = ({ data, open }: TMessage) => {
    const { isDesktop } = useDevice();
    return (
        <div className={`${ROOT_CLASS}__uploader-details`}>
            <Icon className={`${ROOT_CLASS}__uploader-icon`} icon={data?.icon} size={236} />
            <Text as='p' size='xs' color='general' align='center'>
                {data?.info}
            </Text>
            <Button
                medium
                secondary
                text={isDesktop ? localize('Drop file or click here to upload') : localize('Tap here to upload')}
                onClick={open}
            />
        </div>
    );
};

const Preview = ({ data, setFieldValue, value, has_frame, handleChange }: Omit<TUploader, 'is_full' | 'onChange'>) => {
    const [background_url, setBackgroundUrl] = React.useState('');

    React.useEffect(() => {
        setBackgroundUrl(value?.file ? URL.createObjectURL(value?.file) : '');
    }, [value]);

    return (
        <div className={`${ROOT_CLASS}__uploader-details ${ROOT_CLASS}__uploader-details--preview`}>
            <div
                className={clsx(`${ROOT_CLASS}__uploader-image`, {
                    [`${ROOT_CLASS}__uploader-image--has-frame`]: has_frame,
                })}
                style={{ backgroundImage: `url(${background_url})` }}
            >
                {has_frame && <Icon icon='IcPoiFrame' className={`${ROOT_CLASS}__uploader-frame`} />}
                {(!background_url || value?.file.type.indexOf('pdf') !== -1) && (
                    <React.Fragment>
                        <Icon icon='IcCloudUpload' size={50} />
                        <Text as='p' size='xs' color='general' align='center'>
                            {value?.file.name}
                        </Text>
                    </React.Fragment>
                )}
                <Icon
                    icon='IcCloseCircle'
                    className={`${ROOT_CLASS}__uploader-remove`}
                    onClick={() => {
                        handleChange?.(null, setFieldValue);
                    }}
                    size={16}
                />
            </div>
            <Text as='p' size='xs' color='general' align='center'>
                {data?.info}
            </Text>
        </div>
    );
};

const Uploader = ({ data, value, is_full, onChange, has_frame }: Omit<TUploader, 'setFieldValue' | 'handleChange'>) => {
    const { isDesktop } = useDevice();
    const [image, setImage] = React.useState<FormikValues>();

    React.useEffect(() => {
        setImage(value);
    }, [value]);

    const handleChange = (file: object | null, setFieldValue: FormikProps<FormikValues>['setFieldValue']) => {
        onChange?.(file);
        setFieldValue?.(data?.name, file);
    };

    const handleAccept = (files: object[], setFieldValue: FormikProps<FormikValues>['setFieldValue']) => {
        const file = { file: files[0], errors: [], ...data };
        handleChange(file, setFieldValue);
    };

    const handleReject = (files: THandleRejectFiles, setFieldValue: FormikProps<FormikValues>['setFieldValue']) => {
        const errors = files[0].errors?.map((error: { code: string }) =>
            DROPZONE_ERRORS[error.code as keyof TDROPZONE_ERRORS]
                ? DROPZONE_ERRORS[error.code as keyof TDROPZONE_ERRORS]
                : DROPZONE_ERRORS.GENERAL
        );
        const file = { ...files[0], errors, ...data };
        handleChange(file, setFieldValue);
    };

    const ValidationErrorMessage: React.ComponentProps<typeof FileDropzone>['validation_error_message'] = open => (
        <div className={`${ROOT_CLASS}__uploader-details`}>
            {image?.errors?.map((error: string, index: number) => (
                <Text key={index} as='p' size='xs' color='secondary' align='center'>
                    {error}
                </Text>
            ))}
            <Button
                medium
                secondary
                text={isDesktop ? localize('Drop file or click here to upload') : localize('Tap here to upload')}
                onClick={open}
            />
        </div>
    );

    return (
        <Field name={data?.name}>
            {({ form: { setFieldValue } }: FieldProps) => (
                <div
                    className={clsx(`${ROOT_CLASS}__uploader`, {
                        [`${ROOT_CLASS}__uploader--full`]: is_full,
                    })}
                >
                    <FileDropzone
                        accept={supported_filetypes}
                        error_message={localize('Please upload supported file type.')}
                        filename_limit={32}
                        hover_message={localize('Drop files here..')}
                        max_size={max_document_size}
                        message={(open?: () => void) => <Message open={open} data={data} />}
                        preview_single={
                            image && (
                                <Preview
                                    data={data}
                                    value={image}
                                    has_frame={has_frame}
                                    setFieldValue={setFieldValue}
                                    handleChange={handleChange}
                                />
                            )
                        }
                        multiple={false}
                        onDropAccepted={(files: object[]) => handleAccept(files, setFieldValue)}
                        onDropRejected={(files: THandleRejectFiles) => handleReject(files, setFieldValue)}
                        validation_error_message={value?.errors?.length ? ValidationErrorMessage : undefined}
                        noClick
                        value={(image ? [image] : []) as unknown as React.ComponentProps<typeof FileDropzone>['value']}
                    />
                </div>
            )}
        </Field>
    );
};

export default Uploader;

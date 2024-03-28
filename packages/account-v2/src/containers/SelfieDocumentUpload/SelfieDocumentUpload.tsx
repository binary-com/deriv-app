import React from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { InferType } from 'yup';
import { Button, Text, useDevice } from '@deriv-com/ui';
import SelfieIcon from '../../assets/manual-upload/selfie-icon.svg';
import { Dropzone } from '../../components/Dropzone';
import { getSelfieValidationSchema } from '../../utils/manualFormUtils';

type TSelfieFormValue = InferType<ReturnType<typeof getSelfieValidationSchema>>;

type TSelfieDocumentUpload = {
    formData: FormikValues;
    handleCancel: () => void;
    handleSubmit: (value: TSelfieFormValue) => void;
};

export const SelfieDocumentUpload = ({ formData, handleCancel, handleSubmit }: TSelfieDocumentUpload) => {
    const { isMobile } = useDevice();

    const validationSchema = getSelfieValidationSchema();

    const initialVal = validationSchema.cast({
        selfieWithID: formData.selfieWithID ?? validationSchema.getDefault().selfieWithID,
    });

    return (
        <Formik
            initialValues={initialVal as TSelfieFormValue}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
        >
            {({ isValid, setFieldValue, values }) => (
                <Form className='flex flex-col gap-16'>
                    <Text>Upload your selfie</Text>
                    <Dropzone
                        buttonText={isMobile ? 'Tap here to upload' : 'Drop file or click here to upload'}
                        description='Upload your selfie'
                        fileFormats='image/*'
                        hasFrame
                        icon={<SelfieIcon />}
                        onFileChange={(file: File) => setFieldValue('selfieWithID', file)}
                    />
                    <Text size={isMobile ? 'sm' : 'xs'}>
                        Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and
                        your face is within the frame.
                    </Text>
                    <div className='flex justify-end gap-16 bg-vp px-8 py-16 border-t-solid-grey-2 border-solid border-t-2'>
                        <Button onClick={handleCancel} type='button' variant='outlined'>
                            Back
                        </Button>
                        <Button disabled={!isValid || !values.selfieWithID} type='submit'>
                            Confirm and upload
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

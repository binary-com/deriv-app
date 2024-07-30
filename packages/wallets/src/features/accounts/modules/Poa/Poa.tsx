import React, { useState } from 'react';
import { Formik, FormikValues } from 'formik';
import { InlineMessage, Loader, Text } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../components';
import { THooks } from '../../../../types';
import { Footer } from '../components';
import { AddressSection, DocumentSubmission, PoaUploadErrorMessage } from './components';
import { usePoa } from './hooks';
import { poaValidationSchema } from './utils';
import './Poa.scss';

type TPoaProps = {
    onCompletion?: VoidFunction;
};

const Poa: React.FC<TPoaProps> = ({ onCompletion }) => {
    const {
        errorSettings,
        initialStatus,
        initialValues,
        isLoading,
        isSuccess: isSubmissionSuccess,
        resetError,
        upload: upload_,
    } = usePoa();
    const [errorDocumentUpload, setErrorDocumentUpload] = useState<THooks.DocumentUpload['error']>();

    if (isLoading) return <Loader />;

    if (isSubmissionSuccess && onCompletion) {
        onCompletion();
    }

    const upload = async (values: FormikValues) => {
        try {
            await upload_(values);
        } catch (error) {
            setErrorDocumentUpload((error as THooks.DocumentUpload).error);
        }
    };

    return (
        <Formik
            initialStatus={initialStatus}
            initialValues={initialValues}
            onSubmit={upload}
            validationSchema={poaValidationSchema}
        >
            {({ handleSubmit, isValid, resetForm }) => {
                const onErrorRetry = () => {
                    resetForm();
                    resetError();
                };

                if (errorDocumentUpload) {
                    return <PoaUploadErrorMessage errorCode={errorDocumentUpload.code} onRetry={onErrorRetry} />;
                }

                return (
                    <ModalStepWrapper
                        renderFooter={() => <Footer disableNext={!isValid} onClickNext={handleSubmit} />}
                        title='Add a real MT5 account'
                    >
                        <div className='wallets-poa'>
                            {errorSettings && errorSettings && (
                                <InlineMessage variant='error'>
                                    <Text>{errorSettings.message}</Text>
                                </InlineMessage>
                            )}
                            <AddressSection />
                            <DocumentSubmission />
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default Poa;

import React, { useEffect, useState } from 'react';
import { Formik, FormikValues } from 'formik';
import { useTranslations } from '@deriv-com/translations';
import { InlineMessage, Loader, Text, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../components';
import { THooks } from '../../../../types';
import { Footer } from '../components';
import POAMobile from './components/POAMobile/POAMobile';
import { AddressSection, DocumentSubmission, PoaUploadErrorMessage } from './components';
import { usePoa } from './hooks';
import { getPoaValidationSchema } from './utils';
import './Poa.scss';

type TPoaProps = {
    onCompletion?: VoidFunction;
};

const Poa: React.FC<TPoaProps> = ({ onCompletion }) => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const {
        countryCode,
        errorSettings,
        initialStatus,
        initialValues,
        isLoading,
        isSuccess: isSubmissionSuccess,
        resetError,
        upload: upload_,
    } = usePoa();
    const [errorDocumentUpload, setErrorDocumentUpload] = useState<THooks.DocumentUpload['error']>();
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        if (isSubmissionSuccess && onCompletion) {
            onCompletion();
        }

        setShowLoader(isLoading);
    }, [isSubmissionSuccess, onCompletion, isLoading]);

    const upload = async (values: FormikValues) => {
        try {
            await upload_(values);
        } catch (error) {
            setErrorDocumentUpload((error as THooks.DocumentUpload).error);
        }
    };

    if (showLoader) return <Loader />;

    return (
        <Formik
            initialStatus={initialStatus}
            initialValues={initialValues}
            onSubmit={upload}
            validationSchema={getPoaValidationSchema(localize)}
        >
            {({ handleSubmit, isValid, resetForm }) => {
                const onErrorRetry = () => {
                    resetForm();
                    resetError();
                };

                if (errorDocumentUpload) {
                    return <PoaUploadErrorMessage errorCode={errorDocumentUpload.code} onRetry={onErrorRetry} />;
                }

                if (isDesktop) {
                    return (
                        <ModalStepWrapper
                            renderFooter={() => <Footer disableNext={!isValid} onClickNext={handleSubmit} />}
                            title={localize('Add a real MT5 account')}
                        >
                            <div className='wallets-poa'>
                                {errorSettings?.message && (
                                    <InlineMessage variant='error'>
                                        <Text>{localize(errorSettings.message)}</Text>
                                    </InlineMessage>
                                )}
                                <AddressSection hasError={Boolean(errorSettings?.message)} />
                                <DocumentSubmission countryCode={countryCode as string} />
                            </div>
                        </ModalStepWrapper>
                    );
                }
                return <POAMobile countryCode={countryCode as string} onCompletion={handleSubmit} />;
            }}
        </Formik>
    );
};

export default Poa;

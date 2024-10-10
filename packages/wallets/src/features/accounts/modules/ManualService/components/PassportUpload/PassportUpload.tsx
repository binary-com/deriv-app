import React, { useState } from 'react';
import { Formik, FormikValues } from 'formik';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Divider, Loader, Text } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import { DatePicker, Dropzone, FormField, ModalStepWrapper } from '../../../../../../components';
import PassportPlaceholder from '../../../../../../public/images/accounts/passport-placeholder.svg';
import { THooks } from '../../../../../../types';
import { Footer } from '../../../components';
import { getGeneralDocumentRules, TManualDocumentComponent } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { ManualUploadErrorMessage } from '../ManualUploadErrorMessage';
import { SelfieUpload } from '../SelfieUpload';
import { usePassportUpload } from './hooks';
import { getPassportUploadValidator } from './utils';
import './PassportUpload.scss';

const PassportUpload: TManualDocumentComponent = ({ documentIssuingCountryCode, onClickBack, onCompletion }) => {
    const { localize } = useTranslations();
    const {
        initialValues,
        isLoading,
        resetUploadStatus,
        upload: upload_,
    } = usePassportUpload(documentIssuingCountryCode);
    const [showSelfieUpload, setShowSelfieUpload] = useState(false);
    const [error, setError] = useState<THooks.DocumentUpload['error']>();

    const upload = async (values: FormikValues) => {
        try {
            await upload_(values);
            onCompletion?.();
        } catch (error) {
            setError((error as THooks.DocumentUpload).error);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Formik initialValues={initialValues} onSubmit={upload} validationSchema={getPassportUploadValidator(localize)}>
            {({ dirty, errors, handleSubmit, resetForm, setFieldValue, values }) => {
                const handleFileChange = (file?: File) => {
                    setFieldValue('passportFile', file);
                };
                const isPassportFormValid =
                    dirty && !errors.passportExpiryDate && !errors.passportFile && !errors.passportNumber;

                const handleOnClickNext = () => {
                    if (isPassportFormValid) {
                        setShowSelfieUpload(true);
                    }
                };

                const onErrorRetry = () => {
                    resetUploadStatus();
                    resetForm();
                    setShowSelfieUpload(false);
                    onClickBack?.();
                };

                if (error) {
                    return <ManualUploadErrorMessage errorCode={error.code} onRetry={onErrorRetry} />;
                }

                if (showSelfieUpload) {
                    return (
                        <SelfieUpload
                            onClickBack={() => {
                                setShowSelfieUpload(false);
                            }}
                            onCompletion={handleSubmit}
                        />
                    );
                }

                return (
                    <ModalStepWrapper
                        disableAnimation
                        renderFooter={() => (
                            <Footer
                                disableBack={isLoading}
                                disableNext={!isPassportFormValid || isLoading}
                                onClickBack={onClickBack}
                                onClickNext={handleOnClickNext}
                            />
                        )}
                        title={localize('Add a real MT5 account')}
                    >
                        <div className='wallets-passport-upload' data-testid='dt_passport-document-upload'>
                            <div className='wallets-passport-upload__wrapper'>
                                <Text align='start'>
                                    <Localize i18n_default_text='First, enter your Passport number and the expiry date.' />
                                </Text>
                                <div className='wallets-passport-upload__input-group'>
                                    <FormField label={localize('Passport number*')} name='passportNumber' />
                                    <DatePicker
                                        label={localize('Expiry date*')}
                                        minDate={FormatUtils.getAdjustedDate(2, 'days')}
                                        name='passportExpiryDate'
                                    />
                                </div>
                                <Divider
                                    className='wallets-passport-upload__divider'
                                    color='var(--border-divider)'
                                    height={2}
                                />
                                <div className='wallets-passport-upload__document-upload'>
                                    <Text align='start'>
                                        <Localize i18n_default_text='Next, upload the page of your passport that contains your photo.' />
                                    </Text>
                                    <Dropzone
                                        buttonText={localize('Drop file or click here to upload')}
                                        defaultFile={values.passportFile}
                                        description={localize(
                                            'Upload the page of your passport that contains your photo.'
                                        )}
                                        fileFormats={[
                                            'image/jpeg',
                                            'image/jpg',
                                            'image/png',
                                            'image/gif',
                                            'application/pdf',
                                        ]}
                                        icon={<PassportPlaceholder />}
                                        maxSize={8388608}
                                        noClick
                                        onFileChange={handleFileChange}
                                    />
                                    <DocumentRules hints={getGeneralDocumentRules(localize)} />
                                </div>
                            </div>
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default PassportUpload;

import React, { useState } from 'react';
import { Formik, FormikValues } from 'formik';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Divider, Loader, Text } from '@deriv-com/ui';
import { DatePicker, Dropzone, FormField, ModalStepWrapper } from '../../../../../../components';
import IdentityCardBack from '../../../../../../public/images/accounts/document-back.svg';
import IdentityCardFront from '../../../../../../public/images/accounts/identity-card-front.svg';
import { THooks } from '../../../../../../types';
import { getAdjustedDate } from '../../../../../../utils/utils';
import { Footer } from '../../../components';
import { getGeneralDocumentRules, TManualDocumentComponent } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { ManualUploadErrorMessage } from '../ManualUploadErrorMessage';
import { SelfieUpload } from '../SelfieUpload';
import { useIdentityCardUpload } from './hooks';
import { getIdentityCardUploadValidator } from './utils';
import './IdentityCardUpload.scss';

const IdentityCardUpload: TManualDocumentComponent = ({ documentIssuingCountryCode, onClickBack, onCompletion }) => {
    const { localize } = useTranslations();
    const {
        initialValues,
        isLoading,
        resetUploadStatus,
        upload: upload_,
    } = useIdentityCardUpload(documentIssuingCountryCode);
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
        <Formik
            initialValues={initialValues}
            onSubmit={upload}
            validationSchema={getIdentityCardUploadValidator(localize)}
        >
            {({ dirty, errors, handleSubmit, resetForm, setFieldValue, values }) => {
                const isIdentityCardFormValid =
                    dirty &&
                    !errors.identityCardNumber &&
                    !errors.identityCardExpiryDate &&
                    !errors.identityCardBack &&
                    !errors.identityCardFront;

                const handleOnClickNext = () => {
                    if (isIdentityCardFormValid) {
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
                    return <ManualUploadErrorMessage errorCode={error?.code} onRetry={onErrorRetry} />;
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
                                disableNext={!isIdentityCardFormValid || isLoading}
                                onClickBack={onClickBack}
                                onClickNext={handleOnClickNext}
                            />
                        )}
                        title={localize('Add a real MT5 account')}
                    >
                        <div className='wallets-identity-card-upload' data-testid='dt_identity-card-upload'>
                            <div className='wallets-identity-card-upload__wrapper'>
                                <Text align='start'>
                                    <Localize i18n_default_text='First, enter your Identity card number and the expiry date.' />
                                </Text>
                                <div className='wallets-identity-card-upload__input-group'>
                                    <FormField
                                        defaultValue={values.identityCardNumber ?? ''}
                                        label={localize('Identity card number*')}
                                        name='identityCardNumber'
                                    />
                                    <DatePicker
                                        label={localize('Expiry date*')}
                                        minDate={getAdjustedDate(2, 'days')}
                                        name='identityCardExpiryDate'
                                    />
                                </div>
                                <Divider
                                    className='wallets-identity-card-upload__divider'
                                    color='var(--border-divider)'
                                    height={2}
                                />
                                <div className='wallets-identity-card-upload__document-upload'>
                                    <Text align='start'>
                                        <Localize i18n_default_text='Next, upload the front and back of your identity card.' />
                                    </Text>
                                    <div className='wallets-identity-card-upload__dropzone'>
                                        <Dropzone
                                            buttonText={localize('Drop file or click here to upload')}
                                            defaultFile={values.identityCardFront}
                                            description={localize('Upload the front of your identity card.')}
                                            fileFormats={[
                                                'image/jpeg',
                                                'image/jpg',
                                                'image/png',
                                                'image/gif',
                                                'application/pdf',
                                            ]}
                                            icon={<IdentityCardFront />}
                                            maxSize={8388608}
                                            noClick
                                            onFileChange={(file?: File) => setFieldValue('identityCardFront', file)}
                                        />
                                        <Dropzone
                                            buttonText={localize('Drop file or click here to upload')}
                                            defaultFile={values.identityCardBack}
                                            description={localize('Upload the back of your identity card.')}
                                            fileFormats={[
                                                'image/jpeg',
                                                'image/jpg',
                                                'image/png',
                                                'image/gif',
                                                'application/pdf',
                                            ]}
                                            icon={<IdentityCardBack />}
                                            maxSize={8388608}
                                            noClick
                                            onFileChange={(file?: File) => setFieldValue('identityCardBack', file)}
                                        />
                                    </div>
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

export default IdentityCardUpload;

import React, { useState } from 'react';
import { Formik, FormikValues } from 'formik';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Divider, Loader, Text } from '@deriv-com/ui';
import { DatePicker, Dropzone, FormField, ModalStepWrapper } from '../../../../../../components';
import DrivingLicenseCardBack from '../../../../../../public/images/accounts/document-back.svg';
import DrivingLicenseCardFront from '../../../../../../public/images/accounts/driving-license-front.svg';
import { THooks } from '../../../../../../types';
import { getAdjustedDate } from '../../../../../../utils/utils';
import { Footer } from '../../../components';
import { getGeneralDocumentRules, TManualDocumentComponent } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { ManualUploadErrorMessage } from '../ManualUploadErrorMessage';
import { SelfieUpload } from '../SelfieUpload';
import { useDrivingLicenseUpload } from './hooks';
import { getDrivingLicenseUploadValidator } from './utils';
import './DrivingLicenseUpload.scss';

const DrivingLicenseUpload: TManualDocumentComponent = ({ documentIssuingCountryCode, onClickBack, onCompletion }) => {
    const { localize } = useTranslations();
    const {
        initialValues,
        isLoading,
        resetUploadStatus,
        upload: upload_,
    } = useDrivingLicenseUpload(documentIssuingCountryCode);
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
            validationSchema={getDrivingLicenseUploadValidator(localize)}
        >
            {({ dirty, errors, handleSubmit, resetForm, setFieldValue, values }) => {
                const isDrivingLicenseFormValid =
                    dirty &&
                    !errors.drivingLicenseNumber &&
                    !errors.drivingLicenseExpiryDate &&
                    !errors.drivingLicenseCardBack &&
                    !errors.drivingLicenseCardFront;

                const onErrorRetry = () => {
                    resetUploadStatus();
                    resetForm();
                    setShowSelfieUpload(false);
                    onClickBack?.();
                };

                const handleOnClickNext = () => {
                    setShowSelfieUpload(true);
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
                                disableNext={!isDrivingLicenseFormValid || isLoading}
                                onClickBack={onClickBack}
                                onClickNext={handleOnClickNext}
                            />
                        )}
                        title={localize('Add a real MT5 account')}
                    >
                        <div className='wallets-driving-license-upload' data-testid='dt_driving-license-upload'>
                            <div className='wallets-driving-license-upload__wrapper'>
                                <Text align='start'>
                                    <Localize i18n_default_text='First, enter your Driving licence number and the expiry date.' />
                                </Text>
                                <div className='wallets-driving-license-upload__input-group'>
                                    <FormField
                                        defaultValue={values.drivingLicenseNumber ?? ''}
                                        label={localize('Driving licence number*')}
                                        name='drivingLicenseNumber'
                                    />
                                    <DatePicker
                                        label={localize('Expiry date*')}
                                        minDate={getAdjustedDate(2, 'days')}
                                        name='drivingLicenseExpiryDate'
                                    />
                                </div>
                                <Divider
                                    className='wallets-driving-license-upload__divider'
                                    color='var(--border-divider)'
                                    height={2}
                                />
                                <div className='wallets-driving-license-upload__document-upload'>
                                    <Text align='start'>
                                        <Localize i18n_default_text='Next, upload the front and back of your driving licence.' />
                                    </Text>
                                    <div className='wallets-driving-license-upload__dropzone'>
                                        <Dropzone
                                            buttonText={localize('Drop file or click here to upload')}
                                            defaultFile={values.drivingLicenseCardFront}
                                            description={localize('Upload the front of your driving licence.')}
                                            fileFormats={[
                                                'image/jpeg',
                                                'image/jpg',
                                                'image/png',
                                                'image/gif',
                                                'application/pdf',
                                            ]}
                                            icon={<DrivingLicenseCardFront />}
                                            maxSize={8388608}
                                            noClick
                                            onFileChange={(file?: File) =>
                                                setFieldValue('drivingLicenseCardFront', file)
                                            }
                                        />
                                        <Dropzone
                                            buttonText={localize('Drop file or click here to upload')}
                                            defaultFile={values.drivingLicenseCardBack}
                                            description={localize('Upload the back of your driving licence.')}
                                            fileFormats={[
                                                'image/jpeg',
                                                'image/jpg',
                                                'image/png',
                                                'image/gif',
                                                'application/pdf',
                                            ]}
                                            icon={<DrivingLicenseCardBack />}
                                            maxSize={8388608}
                                            noClick
                                            onFileChange={(file?: File) =>
                                                setFieldValue('drivingLicenseCardBack', file)
                                            }
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

export default DrivingLicenseUpload;

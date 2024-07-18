import React, { useState } from 'react';
import { Formik, FormikValues } from 'formik';
import moment from 'moment';
import { TSocketError } from '@deriv/api-v2/types';
import { Divider } from '@deriv-com/ui';
import { DatePicker, Dropzone, FormField, ModalStepWrapper, WalletText } from '../../../../../../components';
import PassportPlaceholder from '../../../../../../public/images/accounts/passport-placeholder.svg';
import { documentRequiredValidator, expiryDateValidator } from '../../../../validations';
import { Footer } from '../../../components';
import { GeneralDocumentRules, TManualDocumentComponent } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { ManualUploadErrorMessage } from '../ManualUploadErrorMessage';
import { SelfieUpload } from '../SelfieUpload';
import { useSelfieUpload } from '../SelfieUpload/hooks';
import { usePassportUpload } from './hooks';
import './PassportUpload.scss';

const PassportUpload: TManualDocumentComponent = ({ onClickBack, onCompletion }) => {
    const {
        error: errorPassportUpload,
        initialValues: initialValuesPassportUpload,
        isSuccess: isPassportUploadSuccess,
        resetError,
        submit: submitPassport,
    } = usePassportUpload();
    const {
        error: errorSelfieUpload,
        initialValues: initialValuesSelfieUpload,
        isSuccess: isSelfieUploadSuccess,
        submit: submitSelfie,
    } = useSelfieUpload();
    const [showSelfieUpload, setShowSelfieUpload] = useState(false);
    const [uploadError, setUploadError] = useState<TSocketError<'document_upload'>['error']>();

    const submit = async (values: FormikValues) => {
        await submitPassport(values);
        await submitSelfie(values);
        if (errorPassportUpload || errorSelfieUpload) {
            setUploadError(errorPassportUpload || errorSelfieUpload);
        } else if (isPassportUploadSuccess && isSelfieUploadSuccess && onCompletion) {
            onCompletion();
        }
    };

    return (
        <Formik initialValues={{ ...initialValuesPassportUpload, ...initialValuesSelfieUpload }} onSubmit={submit}>
            {({ dirty, errors, handleSubmit, setFieldValue, values }) => {
                const handleFileChange = (file?: File) => {
                    setFieldValue('passportFile', file);
                };
                const isPassportFormDirty =
                    dirty && !errors.passportExpiryDate && !errors.passportFile && !errors.passportNumber;

                const handleOnClickNext = () => {
                    if (isPassportFormDirty) {
                        setShowSelfieUpload(true);
                    }
                };

                if (uploadError) {
                    return <ManualUploadErrorMessage errorCode={uploadError.code} onRetry={resetError} />;
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
                                disableNext={!isPassportFormDirty}
                                onClickBack={onClickBack}
                                onClickNext={handleOnClickNext}
                            />
                        )}
                        title='Add a real MT5 account'
                    >
                        <div className='wallets-passport-upload' data-testid='dt_passport-document-upload'>
                            <div className='wallets-passport-upload__wrapper'>
                                <WalletText>First, enter your Passport number and the expiry date.</WalletText>
                                <div className='wallets-passport-upload__input-group'>
                                    <FormField
                                        defaultValue={values.passportNumber}
                                        label='Passport number*'
                                        name='passportNumber'
                                        validationSchema={documentRequiredValidator('Passport number')}
                                    />
                                    <DatePicker
                                        label='Expiry date*'
                                        minDate={moment().add(2, 'days').toDate()}
                                        name='passportExpiryDate'
                                        validationSchema={expiryDateValidator}
                                    />
                                </div>
                                <Divider
                                    className='wallets-passport-upload__divider'
                                    color='var(--border-divider)'
                                    height={2}
                                />
                                <div className='wallets-passport-upload__document-upload'>
                                    <WalletText>
                                        Next, upload the page of your passport that contains your photo.
                                    </WalletText>
                                    <Dropzone
                                        buttonText='Drop file or click here to upload'
                                        defaultFile={values.passportFile}
                                        description='Upload the page of your passport that contains your photo.'
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
                                    <DocumentRules hints={GeneralDocumentRules} />
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

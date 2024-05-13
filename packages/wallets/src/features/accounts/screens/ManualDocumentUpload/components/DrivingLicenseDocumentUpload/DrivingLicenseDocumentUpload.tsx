import React from 'react';
import moment from 'moment';
import { DatePicker, Divider, Dropzone, FlowTextField, useFlow, WalletText } from '../../../../../../components';
import DrivingLicenseCardBack from '../../../../../../public/images/accounts/document-back.svg';
import DrivingLicenseCardFront from '../../../../../../public/images/accounts/driving-license-front.png';
import { documentRequiredValidator, expiryDateValidator } from '../../../../validations';
import { DocumentRuleHints } from '../DocumentRuleHints';
import './DrivingLicenseDocumentUpload.scss';

const DrivingLicenseDocumentUpload = () => {
    const { formValues, setFormValues } = useFlow();

    const handleDateChange = (formattedDate: string | null) => {
        setFormValues('drivingLicenseExpiryDate', formattedDate);
    };

    return (
        <div className='wallets-driving-license-document-upload' data-testid='dt_driving-license-document-upload'>
            <WalletText>First, enter your Driving licence number and the expiry date.</WalletText>
            <div className='wallets-driving-license-document-upload__input-group'>
                <FlowTextField
                    defaultValue={formValues.drivingLicenceNumber ?? ''}
                    label='Driving licence number*'
                    name='drivingLicenceNumber'
                    validationSchema={documentRequiredValidator('Driving licence number')}
                />
                <DatePicker
                    defaultValue={formValues.drivingLicenseExpiryDate ?? ''}
                    label='Expiry date*'
                    minDate={moment().add(2, 'days').toDate()}
                    name='drivingLicenseExpiryDate'
                    onDateChange={handleDateChange}
                    placeholder='DD/MM/YYYY'
                    validationSchema={expiryDateValidator}
                />
            </div>
            <Divider />
            <div className='wallets-driving-license-document-upload__document-section'>
                <WalletText>Next, upload the front and back of your driving licence.</WalletText>
                <div className='wallets-driving-license-document-upload__dropzones'>
                    <div className='wallets-driving-license-document-upload__dropzones--left'>
                        <Dropzone
                            buttonText='Drop file or click here to upload'
                            defaultFile={formValues.drivingLicenseCardFront}
                            description='Upload the front of your driving licence.'
                            fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                            icon={<DrivingLicenseCardFront />}
                            maxSize={8388608}
                            onFileChange={(file: File) => setFormValues('drivingLicenseCardFront', file)}
                        />
                    </div>
                    <div className='wallets-driving-license-document-upload__dropzones--right'>
                        <Dropzone
                            buttonText='Drop file or click here to upload'
                            defaultFile={formValues.drivingLicenseCardBack}
                            description='Upload the back of your driving licence.'
                            fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                            icon={<DrivingLicenseCardBack />}
                            maxSize={8388608}
                            onFileChange={(file: File) => setFormValues('drivingLicenseCardBack', file)}
                        />
                    </div>
                </div>
                <DocumentRuleHints docType='drivingLicense' />
            </div>
        </div>
    );
};

export default DrivingLicenseDocumentUpload;

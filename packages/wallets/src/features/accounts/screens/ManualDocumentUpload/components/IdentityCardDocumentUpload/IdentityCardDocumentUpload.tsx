import React from 'react';
import moment from 'moment';
import { Divider } from '@deriv-com/ui';
import { DatePicker, Dropzone, FlowTextField, useFlow, WalletText } from '../../../../../../components';
import IdentityCardBack from '../../../../../../public/images/accounts/document-back.svg';
import IdentityCardFront from '../../../../../../public/images/accounts/identity-card-front.svg';
import { documentRequiredValidator, expiryDateValidator } from '../../../../validations';
import { DocumentRuleHints } from '../DocumentRuleHints';
import './IdentityCardDocumentUpload.scss';

const IdentityCardDocumentUpload = () => {
    const { formValues, setFormValues } = useFlow();

    const handleDateChange = (formattedDate: string | null) => {
        setFormValues('identityCardExpiryDate', formattedDate);
    };
    return (
        <div className='wallets-identity-card-document-upload' data-testid='dt_identity-card-document-upload'>
            <WalletText>First, enter your Identity card number and the expiry date.</WalletText>
            <div className='wallets-identity-card-document-upload__input-group'>
                <FlowTextField
                    defaultValue={formValues.identityCardNumber ?? ''}
                    label='Identity card number*'
                    name='identityCardNumber'
                    validationSchema={documentRequiredValidator('Identity card number')}
                />
                <DatePicker
                    defaultValue={formValues.identityCardExpiryDate ?? ''}
                    label='Expiry date*'
                    minDate={moment().add(2, 'days').toDate()}
                    name='identityCardExpiryDate'
                    onDateChange={handleDateChange}
                    placeholder='DD/MM/YYYY'
                    validationSchema={expiryDateValidator}
                />
            </div>
            <Divider color='var(--border-divider)' height={2} />
            <div className='wallets-identity-card-document-upload__document-upload'>
                <WalletText>Next, upload the front and back of your identity card.</WalletText>
                <div className='wallets-identity-card-document-upload__dropzone'>
                    <Dropzone
                        buttonText='Drop file or click here to upload'
                        defaultFile={formValues.identityCardFront}
                        description='Upload the front of your identity card.'
                        fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                        icon={<IdentityCardFront />}
                        maxSize={8388608}
                        noClick
                        onFileChange={(file?: File) => setFormValues('identityCardFront', file)}
                    />
                    <Dropzone
                        buttonText='Drop file or click here to upload'
                        defaultFile={formValues.identityCardBack}
                        description='Upload the back of your identity card.'
                        fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                        icon={<IdentityCardBack />}
                        maxSize={8388608}
                        noClick
                        onFileChange={(file?: File) => setFormValues('identityCardBack', file)}
                    />
                </div>
                <DocumentRuleHints docType='identityCard' />
            </div>
        </div>
    );
};

export default IdentityCardDocumentUpload;

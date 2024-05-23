import React from 'react';
import { Dropzone, useFlow, WalletText } from '../../../../components';
import useDevice from '../../../../hooks/useDevice';
import SelfieIcon from '../../../../public/images/accounts/selfie-icon.svg';
import './SelfieDocumentUpload.scss';

const SelfieDocumentUpload = () => {
    const { isDesktop } = useDevice();
    const { formValues, setFormValues } = useFlow();

    return (
        <div className='wallets-selfie-document-upload'>
            <WalletText>Upload your selfie</WalletText>
            <Dropzone
                buttonText='Drop file or click here to upload'
                defaultFile={formValues.selfie}
                description='Upload your selfie'
                descriptionColor={isDesktop ? 'less-prominent' : 'general'}
                fileFormats='image/*'
                hasFrame={isDesktop}
                icon={<SelfieIcon />}
                noClick
                onFileChange={(file?: File) => setFormValues('selfie', file)}
            />
            <WalletText color={isDesktop ? 'less-prominent' : 'general'}>
                Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and your face
                is within the frame.
            </WalletText>
        </div>
    );
};

export default SelfieDocumentUpload;

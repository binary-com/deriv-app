import React from 'react';
import { Divider } from '@deriv-com/ui';
import { Dropzone, FlowTextField, useFlow, WalletText } from '../../../../../../components';
import NIMCSlipFront from '../../../../../../public/images/accounts/nimc-slip-front.svg';
import ProofOfAgeIcon from '../../../../../../public/images/accounts/proof-of-age.svg';
import { documentRequiredValidator } from '../../../../validations';
import { DocumentRuleHints } from '../DocumentRuleHints';
import './NIMCSlipDocumentUpload.scss';

const NIMCSlipDocumentUpload = () => {
    const { formValues, setFormValues } = useFlow();

    return (
        <div className='wallets-nimc-slip-document-upload' data-testid='dt_driving-license-document-upload'>
            <WalletText>First, enter your NIMC slip number.</WalletText>
            <FlowTextField
                defaultValue={formValues.nimcNumber ?? ''}
                label='NIMC slip number*'
                name='nimcNumber'
                validationSchema={documentRequiredValidator('NIMC slip number')}
            />
            <Divider color='var(--border-divider)' height={2} />
            <div className='wallets-nimc-slip-document-upload__document-section'>
                <WalletText>Next, upload both of the following documents.</WalletText>
                <div className='wallets-nimc-slip-document-upload__dropzones'>
                    <div className='wallets-nimc-slip-document-upload__dropzones--left'>
                        <Dropzone
                            buttonText='Drop file or click here to upload'
                            defaultFile={formValues.nimcCardFront}
                            description='Upload your NIMC slip.'
                            fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                            icon={<NIMCSlipFront />}
                            maxSize={8388608}
                            onFileChange={(file?: File) => setFormValues('nimcCardFront', file)}
                        />
                    </div>
                    <div className='wallets-nimc-slip-document-upload__dropzones--right'>
                        <Dropzone
                            buttonText='Drop file or click here to upload'
                            defaultFile={formValues.nimcCardBack}
                            description='Upload your proof of age: birth certificate or age declaration document.'
                            fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                            icon={<ProofOfAgeIcon />}
                            maxSize={8388608}
                            noClick
                            onFileChange={(file?: File) => setFormValues('nimcCardBack', file)}
                        />
                    </div>
                </div>
                <DocumentRuleHints docType='nimcSlip' />
            </div>
        </div>
    );
};

export default NIMCSlipDocumentUpload;

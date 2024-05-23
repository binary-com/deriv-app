import React from 'react';
import { DerivLightDeclinedPoiIcon } from '@deriv/quill-icons';
import { WalletButton } from '../../../../components/Base';
import { WalletsActionScreen } from '../../../../components/WalletsActionScreen';
import { ErrorCode } from '../../constants';
import './PoiUploadError.scss';
import { useFlow } from '../../../../components/FlowProvider';

type PoiUploadErrorProps = {
    errorCode: keyof typeof ErrorCode;
};

const errorCodeToDescriptionMapper: Record<keyof typeof ErrorCode, string> = {
    DuplicateUpload: 'It seems you’ve submitted this document before. Upload a new document.',
};

const PoiUploadError = ({ errorCode }: PoiUploadErrorProps) => {
    const { formValues, setFormValues, switchScreen } = useFlow();

    // clears the form values to navigate back to document selection
    const switchBackToDocumentSelection = () => {
        if (formValues.selectedManualDocument === 'passport') {
            setFormValues('passportNumber', '');
            setFormValues('passportExpiryDate', '');
            setFormValues('passportCard', '');
        } else if (formValues.selectedManualDocument === 'driving-license') {
            setFormValues('drivingLicenseNumber', '');
            setFormValues('drivingLicenseExpiryDate', '');
            setFormValues('drivingLicenseCardFront', '');
            setFormValues('drivingLicenseCardBack', '');
        } else if (formValues.selectedManualDocument === 'identity-card') {
            setFormValues('identityCardNumber', '');
            setFormValues('identityCardExpiryDate', '');
            setFormValues('identityCardFront', '');
            setFormValues('identityCardBack', '');
        } else if (formValues.selectedManualDocument === 'nimc-slip') {
            setFormValues('nimcNumber', '');
            setFormValues('nimcCardFront', '');
            setFormValues('nimcCardBack', '');
        }

        setFormValues('selectedManualDocument', '');
        switchScreen('manualScreen');
    };

    return (
        <div className='wallets-poi-upload-error'>
            <WalletsActionScreen
                description={errorCodeToDescriptionMapper[errorCode]}
                icon={<DerivLightDeclinedPoiIcon height={120} width={120} />}
                renderButtons={() => (
                    <WalletButton onClick={switchBackToDocumentSelection} size='lg'>
                        Try again
                    </WalletButton>
                )}
                title='Proof of identity documents upload failed'
            />
        </div>
    );
};

export default PoiUploadError;

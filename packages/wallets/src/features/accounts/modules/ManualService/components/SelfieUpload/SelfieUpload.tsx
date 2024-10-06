import React from 'react';
import { useFormikContext } from 'formik';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { Dropzone, ModalStepWrapper } from '../../../../../../components';
import SelfieIcon from '../../../../../../public/images/accounts/selfie-icon.svg';
import { Footer } from '../../../components';
import { TManualDocumentComponent } from '../../utils';
import { TSelfieUploadValues } from './types';
import './SelfieUpload.scss';

const SelfieUpload: TManualDocumentComponent = ({ onClickBack, onCompletion }) => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const { dirty, errors, setFieldValue, values } = useFormikContext<TSelfieUploadValues>();

    const isSelfieFormValid = dirty && !errors.selfieFile;

    return (
        <ModalStepWrapper
            disableAnimation
            renderFooter={() => (
                <Footer
                    disableNext={!isSelfieFormValid}
                    nextText={localize('Confirm and upload')}
                    onClickBack={onClickBack}
                    onClickNext={onCompletion}
                />
            )}
            title={localize('Add a real MT5 account')}
        >
            <div className='wallets-selfie-upload'>
                <Text align='start' weight='bold'>
                    <Localize i18n_default_text='Upload your selfie' />
                </Text>
                <Dropzone
                    buttonText={localize('Drop file or click here to upload')}
                    defaultFile={values.selfieFile}
                    description={localize('Upload your selfie')}
                    descriptionColor={isDesktop ? 'less-prominent' : 'general'}
                    fileFormats='image/*'
                    hasFrame={isDesktop && !values.selfieFile}
                    icon={<SelfieIcon />}
                    noClick
                    onFileChange={(file?: File) => setFieldValue('selfieFile', file)}
                />
                <Text align='start' color={isDesktop ? 'less-prominent' : 'general'}>
                    <Localize i18n_default_text='Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and your face is within the frame.' />
                </Text>
            </div>
        </ModalStepWrapper>
    );
};

export default SelfieUpload;

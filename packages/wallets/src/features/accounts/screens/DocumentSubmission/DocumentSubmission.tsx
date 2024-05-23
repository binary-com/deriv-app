import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropzone, useFlow, WalletText } from '../../../../components';
import useDevice from '../../../../hooks/useDevice';
import Upload from '../../../../public/images/accounts/upload.svg';
import i18n from '../../../../translations/i18n';
import { getExampleImagesConfig } from '../../constants';
import { CommonMistakesExamples } from '../CommonMistakesExamples';
import './DocumentSubmission.scss';

const listItems = [
    i18n.t('Utility bill: electricity, water, gas, or landline phone bill.'),
    i18n.t('Financial, legal, or government document: recent bank statement, affidavit, or government-issued letter.'),
    i18n.t('Home rental agreement: valid and current agreement.'),
];

const DocumentSubmission: React.FC = () => {
    const { isMobile } = useDevice();
    const { setFormValues } = useFlow();
    const { t } = useTranslation();

    return (
        <div className='wallets-poa__document'>
            <div className='wallets-poa__document__title'>
                <WalletText weight='bold'>{t('Document Submission')}</WalletText>
                <div className='wallets-poa__document__title__divider' />
            </div>
            <div className='wallets-poa__document__container'>
                <div className='wallets-poa__document__container__disclaimer'>
                    <WalletText size='sm' weight='bold'>
                        {t(
                            'We accept only these types of documents as proof of address. The document must be recent (issued within last 12 months) and include your name and address:'
                        )}
                    </WalletText>

                    <ul className='wallets-poa__document__container__disclaimer__list'>
                        {listItems.map(item => (
                            <li key={`list-item-${item}`}>
                                <WalletText size='sm'>{item}</WalletText>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='wallets-poa__document__container__upload'>
                    <WalletText size='sm' weight='bold'>
                        {t('Upload File')}
                    </WalletText>
                    <Dropzone
                        description={t(
                            'Remember, selfies, pictures of houses, or non-related images will be rejected.'
                        )}
                        descriptionColor='primary'
                        descriptionSize='sm'
                        fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                        hoverMessage='Upload your file here'
                        icon={<Upload />}
                        maxSize={8388608}
                        onFileChange={(file?: File) => setFormValues('poaDocument', file)}
                        title={t('Drag and drop a file or click to browse your files.')}
                        titleType='bold'
                    />
                    <div className='wallets-poa__document__container__upload__requirements'>
                        <WalletText size={isMobile ? 'xs' : 'sm'}>
                            {t('Supported formats : JPEG, JPG, PNG, PDF, and GIF only')}
                        </WalletText>
                        <WalletText size={isMobile ? 'xs' : 'sm'}>{t('Maximum size : 8MB')}</WalletText>
                    </div>
                </div>
                <div className='wallets-poa__document__container__common-mistakes'>
                    <WalletText size='sm' weight='bold'>
                        {t('Common Mistakes')}
                    </WalletText>

                    <div className='wallets-common-mistakes__content'>
                        {getExampleImagesConfig().map(config => (
                            <CommonMistakesExamples
                                description={config.description}
                                image={<config.image />}
                                key={`common-mistake-${config.description}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentSubmission;

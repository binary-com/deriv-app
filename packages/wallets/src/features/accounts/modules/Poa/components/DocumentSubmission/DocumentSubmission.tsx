import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { useIsEuRegion, useKycAuthStatus } from '@deriv/api-v2';
import { LabelPairedArrowUpFromBracketXlFillIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { Dropzone, FormDropdown } from '../../../../../../components';
import { TDocumentSubmission, TDocumentSubmissionProps, TListItem } from '../../types';
import { getExampleImagesConfig, getSupportedProofOfAddressDocuments } from '../../utils';
import { CommonMistakesExamples } from '../CommonMistakesExamples';
import './DocumentSubmission.scss';

const DocumentSubmission: React.FC<TDocumentSubmissionProps> = ({ countryCode }) => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const { data: isEuRegion } = useIsEuRegion();
    const { isLoading, kyc_auth_status: kycAuthStatus } = useKycAuthStatus({ country: countryCode });
    const [documentList, setDocumentList] = useState<Required<TListItem>[]>([]);
    const { setFieldValue, values } = useFormikContext<TDocumentSubmission>();

    useEffect(() => {
        if (!isLoading && kycAuthStatus) {
            const { address } = kycAuthStatus;
            const { supported_documents: supportedDocuments } = address;
            const docList = getSupportedProofOfAddressDocuments().filter(doc =>
                supportedDocuments?.includes(doc.value)
            );
            setDocumentList(docList);
        }
    }, [isLoading, kycAuthStatus]);

    const listItems = [
        {
            id: 'utility_bill',
            value: (
                <Localize
                    components={[<strong key={0} />]}
                    i18n_default_text='<0>Utility bill:</0> Electricity, water, gas, or landline phone bill.'
                />
            ),
        },
        {
            id: 'financial_legal_government_document',
            value: (
                <Localize
                    components={[<strong key={0} />]}
                    i18n_default_text='<0>Financial, legal, or government document:</0> Recent bank statement, affidavit, or government-issued letter.'
                />
            ),
        },
        {
            id: 'tenancy_agreement',
            value: (
                <Localize
                    components={[<strong key={0} />]}
                    i18n_default_text='<0>Tenancy agreement:</0> Valid and current agreement.'
                />
            ),
        },
    ];

    useEffect(() => {
        return () => {
            setFieldValue('poaFile', null);
        };
    }, [setFieldValue]);

    return (
        <div className='wallets-poa__document'>
            <div className='wallets-poa__document__title'>
                <Text weight='bold'>
                    <Localize i18n_default_text='Submit your document' />
                </Text>
                <div className='wallets-poa__document__title__divider' />
            </div>
            <div className='wallets-poa__document__container'>
                <div className='wallets-poa__document__container__disclaimer'>
                    <Text align='start' size='sm' weight='bold'>
                        {localize(
                            'We accept only the following documents as proof of address. The document must be issued within last {{timePeriod}} months and include your name and address:',
                            { timePeriod: isEuRegion ? '6' : '12' }
                        )}
                    </Text>

                    <ul className='wallets-poa__document__container__disclaimer-list'>
                        {listItems.map(item => (
                            <li key={`list-item-${item.id}`}>
                                <Text size='sm'>{item.value}</Text>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='wallets-poa__document__container__common-mistakes'>
                    <Text size='sm' weight='bold'>
                        <Localize i18n_default_text='Common mistakes' />
                    </Text>

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

                <div className='wallets-poa__document__type-selection'>
                    <Text size='sm' weight='bold'>
                        <Localize i18n_default_text='Select the type of document:' />
                    </Text>
                    <FormDropdown
                        isFullWidth
                        label={localize('Type of document')}
                        list={documentList}
                        listHeight='sm'
                        name='documentType'
                    />
                </div>

                <div className='wallets-poa__document__container__upload'>
                    <Text size='sm' weight='bold'>
                        <Localize i18n_default_text='Upload file' />
                    </Text>
                    <Dropzone
                        defaultFile={values.poaFile}
                        description={localize(
                            'Remember, selfies, pictures of houses, or non-related images will be rejected.'
                        )}
                        descriptionColor='primary'
                        descriptionSize='sm'
                        fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                        hoverMessage={localize('Upload your file here')}
                        icon={<LabelPairedArrowUpFromBracketXlFillIcon fill='#C7E5E5' height='32' width='30' />}
                        maxSize={8388608}
                        onFileChange={(file?: File) => setFieldValue('poaFile', file)}
                        title={localize('Drag and drop a file or click to browse your files.')}
                        titleType='bold'
                    />
                    <div className='wallets-poa__document__container__upload__requirements'>
                        <Text size={!isDesktop ? 'xs' : 'sm'}>
                            <Localize i18n_default_text='Supported formats : JPEG, JPG, PNG, PDF, and GIF only' />
                        </Text>
                        <Text size={!isDesktop ? 'xs' : 'sm'}>
                            <Localize i18n_default_text='Maximum size : 8MB' />
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentSubmission;

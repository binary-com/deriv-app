import React, { useMemo, useState } from 'react';
import classnames from 'classnames';
import { useFormikContext } from 'formik';
import { LabelPairedArrowLeftMdBoldIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { InlineMessage, Text } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../../../components';
import { Footer } from '../../../components';
import { usePoa } from '../../hooks';
import { TPoaValues } from '../../types';
import { AddressSection } from '../AddressSection';
import { DocumentSubmission } from '../DocumentSubmission';
import './POAMobile.scss';

const ProgressBar = ({ isActive }: { isActive?: boolean }) => (
    <div className='wallets-progress-container'>
        <div className={classnames('wallets-progress-bar', { 'wallets-progress-bar--animate': isActive })} />
    </div>
);

type POAMobileProps = {
    countryCode: string;
    onCompletion?: VoidFunction;
};

const POAMobile: React.FC<POAMobileProps> = ({ countryCode, onCompletion }) => {
    const { localize } = useTranslations();
    const { errorSettings } = usePoa();
    const { errors, isValid, values } = useFormikContext<TPoaValues>();
    const [shouldRenderDocumentUpload, setShouldRenderDocumentUpload] = useState(false);

    const isNextBtnDisabled = useMemo(() => {
        if (shouldRenderDocumentUpload) {
            return false;
        }
        return (
            !values.firstLine ||
            !!errors.firstLine ||
            !!errors.secondLine ||
            !values.townCityLine ||
            !!errors.townCityLine ||
            !!errors.stateProvinceLine ||
            !!errors.zipCodeLine
        );
    }, [values, errors, shouldRenderDocumentUpload]);

    if (shouldRenderDocumentUpload) {
        return (
            <ModalStepWrapper
                disableAnimation
                renderFooter={() => (
                    <Footer disableNext={!isValid} nextText={localize('Submit')} onClickNext={onCompletion} />
                )}
                title={localize('Add a real MT5 account')}
            >
                <div className='wallets-poa-mobile-layout'>
                    <div className='wallets-poa-mobile-layout__header'>
                        <div className='wallets-timeline'>
                            <LabelPairedArrowLeftMdBoldIcon onClick={() => setShouldRenderDocumentUpload(false)} />
                            <Text align='start' as='p' lineHeight='sm' size='sm'>
                                <Localize
                                    components={[<strong key={0} />]}
                                    i18n_default_text='<0>Step 2/2:&nbsp;</0> Upload proof of address'
                                />
                            </Text>
                        </div>
                        <div className='wallets-timeline__item'>
                            <ProgressBar isActive />
                            <ProgressBar isActive />
                        </div>
                    </div>
                    <div className='wallets-poa-mobile-layout__container'>
                        {errorSettings?.message && (
                            <InlineMessage className='wallets-poa-mobile-layout__error-banner' variant='error'>
                                <Text align='start'>{errorSettings.message}</Text>
                            </InlineMessage>
                        )}
                        <DocumentSubmission countryCode={countryCode as string} />
                    </div>
                </div>
            </ModalStepWrapper>
        );
    }

    return (
        <ModalStepWrapper
            renderFooter={() => (
                <Footer disableNext={isNextBtnDisabled} onClickNext={() => setShouldRenderDocumentUpload(true)} />
            )}
            title={localize('Add a real MT5 account')}
        >
            <div className='wallets-poa-mobile-layout'>
                <div className='wallets-poa-mobile-layout__header'>
                    <Text as='p' className='wallets-timeline' lineHeight='sm' size='sm'>
                        <Localize
                            components={[<strong key={0} />]}
                            i18n_default_text='<0>Step 1/2:&nbsp;</0> Enter your address'
                        />
                    </Text>
                    <div className='wallets-timeline__item'>
                        <ProgressBar isActive />
                        <ProgressBar />
                    </div>
                </div>
                <div className='wallets-poa-mobile-layout__container'>
                    {errorSettings?.message && (
                        <InlineMessage className='wallets-poa-mobile-layout__error-banner' variant='error'>
                            <Text>{localize(errorSettings.message)}</Text>
                        </InlineMessage>
                    )}
                    <AddressSection hasError={Boolean(errorSettings?.message)} />
                </div>
            </div>
        </ModalStepWrapper>
    );
};

export default POAMobile;

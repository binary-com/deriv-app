import React, { FC, lazy, Suspense } from 'react';
import { usePOA, usePOI } from '@deriv/api-v2';
import { Localize, localize } from '@deriv-com/translations';
import { Button, Loader, Text, useDevice } from '@deriv-com/ui';
import { useModal } from '../../../../components/ModalProvider';
import { THooks } from '../../../../types';
import './VerificationFailed.scss';

const LazyVerification = lazy(
    () =>
        import(
            /* webpackChunkName: "wallets-client-verification" */ '../../flows/ClientVerification/ClientVerification'
        )
);

const getDocumentTitle = (isPOIFailed?: boolean, isPOAFailed?: boolean) => {
    if (isPOIFailed && isPOAFailed) return localize('proof of identity and proof of address documents');
    if (isPOIFailed) return localize('proof of identity document');
    return localize('proof of address document');
};

type TVerificationFailedProps = {
    selectedJurisdiction: THooks.MT5AccountsList['landing_company_short'];
};

const VerificationFailed: FC<TVerificationFailedProps> = ({ selectedJurisdiction }) => {
    const { hide, show } = useModal();
    const { data: poiStatus } = usePOI();
    const { data: poaStatus } = usePOA();
    const { isDesktop } = useDevice();

    const walletButton = isDesktop ? 'lg' : 'md';
    const buttonText = isDesktop ? 'md' : 'sm';

    const isPOIFailed = poiStatus?.is_rejected || poiStatus?.is_expired || poiStatus?.is_suspected;
    const isPOAFailed = poaStatus?.is_rejected || poaStatus?.is_expired || poaStatus?.is_suspected;

    return (
        <div className='wallets-verification-failed'>
            <Text align='start' size='md' weight='bold'>
                <Localize i18n_default_text='Why did my verification fail?' />
            </Text>
            <div className='wallets-verification-failed__content'>
                <Text align='start' size='sm'>
                    <Localize
                        i18n_default_text='Your {{documentTitle}} did not pass our verification checks. This could be due to reasons such as:'
                        values={{ documentTitle: getDocumentTitle(isPOIFailed, isPOAFailed) }}
                    />
                </Text>
                <ul>
                    <li>
                        <Text align='start' size='sm'>
                            <Localize i18n_default_text='Document details do not match profile details' />
                        </Text>
                    </li>
                    <li>
                        <Text align='start' size='sm'>
                            <Localize i18n_default_text='Expired documents' />
                        </Text>
                    </li>
                    <li>
                        <Text align='start' size='sm'>
                            <Localize i18n_default_text='Poor image quality' />
                        </Text>
                    </li>
                </ul>
                <Text align='start' size='sm'>
                    <Localize
                        components={[<strong key={0} />]}
                        i18n_default_text='Click <0>Resubmit documents</0> to find out more and try again.'
                    />
                </Text>
            </div>
            <div className='wallets-verification-failed__footer'>
                <Button
                    borderWidth='sm'
                    color='black'
                    onClick={() => hide()}
                    size={walletButton}
                    textSize={buttonText}
                    variant='outlined'
                >
                    <Localize i18n_default_text='Maybe later' />
                </Button>
                <Button
                    onClick={() =>
                        show(
                            <Suspense fallback={<Loader />}>
                                <LazyVerification hasVerificationFailed selectedJurisdiction={selectedJurisdiction} />
                            </Suspense>
                        )
                    }
                    size={walletButton}
                    textSize={buttonText}
                >
                    <Localize i18n_default_text='Resubmit documents' />
                </Button>
            </div>
        </div>
    );
};

export default VerificationFailed;

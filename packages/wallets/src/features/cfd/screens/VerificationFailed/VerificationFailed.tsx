import React, { FC, lazy, Suspense } from 'react';
import { usePOA, usePOI } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { WalletButton, WalletText } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { THooks } from '../../../../types';
import './VerificationFailed.scss';

const LazyVerification = lazy(
    () => import(/* webpackChunkName: "wallets-verification-flow" */ '../../flows/Verification/Verification')
);

const getDocumentTitle = (isPOIFailed?: boolean, isPOAFailed?: boolean) => {
    if (isPOIFailed && isPOAFailed) return 'proof of identity and proof of address documents';
    if (isPOIFailed) return 'proof of identity document';
    return 'proof of address document';
};

type TVerificationFailedProps = {
    selectedJurisdiction: THooks.MT5AccountsList['landing_company_short'];
};

const VerificationFailed: FC<TVerificationFailedProps> = ({ selectedJurisdiction }) => {
    const { hide, show } = useModal();
    const { data: poiStatus } = usePOI();
    const { data: poaStatus } = usePOA();
    const { isMobile } = useDevice();

    const isPOIFailed = poiStatus?.is_rejected || poiStatus?.is_expired || poiStatus?.is_suspected;
    const isPOAFailed = poaStatus?.is_rejected || poaStatus?.is_expired || poaStatus?.is_suspected;

    return (
        <div className='wallets-verification-failed'>
            <WalletText size='md' weight='bold'>
                Why did my verification fail?
            </WalletText>
            <div className='wallets-verification-failed__content'>
                <WalletText size='sm'>
                    Your {getDocumentTitle(isPOIFailed, isPOAFailed)} did not pass our verification checks. This could
                    be due to reasons such as:
                </WalletText>
                <ul>
                    <li>
                        <WalletText size='sm'>Document details do not match profile details</WalletText>
                    </li>
                    <li>
                        <WalletText size='sm'>Expired documents</WalletText>
                    </li>
                    <li>
                        <WalletText size='sm'>Poor image quality</WalletText>
                    </li>
                </ul>
                <WalletText size='sm'>
                    Click <strong>Resubmit documents</strong> to find out more and try again.
                </WalletText>
            </div>
            <div className='wallets-verification-failed__footer'>
                <WalletButton onClick={() => hide()} size={isMobile ? 'md' : 'lg'} variant='outlined'>
                    Maybe later
                </WalletButton>
                <WalletButton
                    onClick={() =>
                        show(
                            <Suspense fallback={<Loader />}>
                                <LazyVerification selectedJurisdiction={selectedJurisdiction} />
                            </Suspense>
                        )
                    }
                    size={isMobile ? 'md' : 'lg'}
                >
                    Resubmit documents
                </WalletButton>
            </div>
        </div>
    );
};

export default VerificationFailed;

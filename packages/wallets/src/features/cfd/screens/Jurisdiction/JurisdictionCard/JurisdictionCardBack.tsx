import React, { Dispatch, FC, SetStateAction } from 'react';
import { LegacyArrowLeft2pxIcon } from '@deriv/quill-icons';
import { Divider } from '@deriv-com/ui';
import { WalletText } from '../../../../../components/Base/WalletText';
import IdCardIcon from '../../../../../public/images/ic-id-card.svg';
import DocumentIcon from '../../../../../public/images/ic-id-number.svg';
import NameAndAddressIcon from '../../../../../public/images/ic-name-and-address.svg';
import NotApplicableIcon from '../../../../../public/images/ic-not-applicable.svg';
import SelfieIcon from '../../../../../public/images/ic-selfie.svg';
import VerificationFailedStatusIcon from '../../../../../public/images/ic-verification-failed-status.svg';
import VerificationPendingStatusIcon from '../../../../../public/images/ic-verification-pending-status.svg';
import VerificationSuccessStatusIcon from '../../../../../public/images/ic-verification-success-status.svg';
import { jurisdictionVerificationContents } from '../jurisdiction-contents/jurisdiction-verification-contents';
import {
    TJurisdictionCardItemVerification,
    TJurisdictionCardItemVerificationItem,
} from '../jurisdiction-contents/props.types';
import './JurisdictionCardBack.scss';

const verificationIconsMapper: Record<string, JSX.Element> = {
    documentNumber: <DocumentIcon />,
    identityDocument: <IdCardIcon />,
    nameAndAddress: <NameAndAddressIcon />,
    notApplicable: <NotApplicableIcon />,
    selfie: <SelfieIcon />,
};

const verificationStatusIconsMapper: Record<string, JSX.Element> = {
    verificationFailedStatusIcon: <VerificationFailedStatusIcon />,
    verificationPendingStatusIcon: <VerificationPendingStatusIcon />,
    verificationSuccessStatusIcon: <VerificationSuccessStatusIcon />,
};

type TJurisdictionCardBackProps = {
    setIsFlipped: Dispatch<SetStateAction<boolean>>;
    verificationDocs?: TJurisdictionCardItemVerification;
};

const JurisdictionCardBack: FC<TJurisdictionCardBackProps> = ({ setIsFlipped, verificationDocs }) => {
    const verificationContents = jurisdictionVerificationContents();
    if (verificationDocs)
        return (
            <div className='wallets-jurisdiction-card-back'>
                <LegacyArrowLeft2pxIcon
                    className='wallets-jurisdiction-card-back__icon'
                    iconSize='xs'
                    onClick={e => {
                        e.stopPropagation();
                        setIsFlipped(false);
                    }}
                />
                <WalletText size='xs'>{verificationContents.shortDescription}</WalletText>
                {verificationDocs.map((verificationDocument: TJurisdictionCardItemVerificationItem, i) => {
                    return (
                        <div className='wallets-jurisdiction-card-back__row' key={`${verificationDocument}-${i}`}>
                            {verificationIconsMapper[verificationDocument]}
                            <WalletText size='xs'>
                                {verificationContents.requiredVerificationDocs[verificationDocument]?.text}
                            </WalletText>
                        </div>
                    );
                })}
                <Divider color='var(--wallets-banner-border-color)' height={2} />
                <div className='wallets-jurisdiction-card-back__border' />
                {verificationContents.statusReferences.map((statusReference, i) => {
                    return (
                        <div className='wallets-jurisdiction-card-back__row' key={`${statusReference}-${i}`}>
                            {verificationStatusIconsMapper[statusReference.icon]}
                            <WalletText size='xs'>{statusReference.text}</WalletText>
                        </div>
                    );
                })}
            </div>
        );
    return <></>;
};

export default JurisdictionCardBack;

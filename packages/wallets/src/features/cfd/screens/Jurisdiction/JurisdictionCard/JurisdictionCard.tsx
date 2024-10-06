import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Divider, Text } from '@deriv-com/ui';
import { useModal } from '../../../../../components/ModalProvider';
import IdCardIcon from '../../../../../public/images/ic-id-card.svg';
import DocumentIcon from '../../../../../public/images/ic-id-number.svg';
import NameAndAddressIcon from '../../../../../public/images/ic-name-and-address.svg';
import SelfieIcon from '../../../../../public/images/ic-selfie.svg';
import { useDynamicLeverageModalState } from '../../../components/DynamicLeverageContext';
import useVerificationDocs from '../hooks/useVerificationDocs';
import { getJurisdictionContents } from '../jurisdiction-contents/jurisdiction-contents';
import { TJurisdictionCardItems, TJurisdictionCardSection } from '../jurisdiction-contents/props.types';
import JurisdictionCardBack from './JurisdictionCardBack';
import JurisdictionCardRow from './JurisdictionCardRow';
import JurisdictionCardTag from './JurisdictionCardTag';
import JurisdictionCardVerificationTag from './JurisdictionCardVerificationTag';
import './JurisdictionCard.scss';

type TJurisdictionCardProps = {
    isAdded: boolean;
    isSelected: boolean;
    jurisdiction: string;
    onSelect: (clickedJurisdiction: string) => void;
    tag?: string;
};

type TVerificationDocumentsMapper = {
    [key: string]: {
        category: 'poa' | 'poi' | null;
        icon?: JSX.Element;
    };
};

const verificationDocumentsMapper: TVerificationDocumentsMapper = {
    documentNumber: {
        category: 'poi',
        icon: <DocumentIcon />,
    },
    identityDocument: {
        category: 'poi',
        icon: <IdCardIcon />,
    },
    nameAndAddress: {
        category: 'poa',
        icon: <NameAndAddressIcon />,
    },
    notApplicable: {
        category: null,
    },
    selfie: {
        category: 'poi',
        icon: <SelfieIcon />,
    },
};

const JurisdictionCard: React.FC<TJurisdictionCardProps> = ({ isAdded, isSelected, jurisdiction, onSelect }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const { toggleDynamicLeverage } = useDynamicLeverageModalState();
    const { getModalState } = useModal();
    const { localize } = useTranslations();
    const verificationDocs = useVerificationDocs(jurisdiction);

    const descriptionClickHandler = (tag?: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.stopPropagation();
        if (tag === 'dynamicLeverage') {
            toggleDynamicLeverage();
        } else {
            setIsFlipped(true);
        }
    };

    const { contents, header, isOverHeaderAvailable, overHeader } = useMemo<TJurisdictionCardItems>(
        () => getJurisdictionContents(localize)[jurisdiction],
        [jurisdiction, localize]
    );
    const marketType = getModalState('marketType') || 'all';
    const rows = contents[marketType] || [];

    const parseDescription = (row: TJurisdictionCardSection) => {
        if (row.clickableDescription)
            return row.clickableDescription.map(description => {
                if (description.type === 'link') {
                    return (
                        <a
                            className='wallets-jurisdiction-card__link'
                            key={description.text}
                            onClick={descriptionClickHandler(description.tag)}
                        >
                            {description.text}{' '}
                        </a>
                    );
                }
                return description.text;
            });
        return row.description;
    };

    return (
        <div className='wallets-jurisdiction-card'>
            <div
                className={classNames('wallets-jurisdiction-card__wrapper', {
                    'wallets-jurisdiction-card__wrapper--added': isAdded,
                    'wallets-jurisdiction-card__wrapper--flipped': isFlipped,
                    'wallets-jurisdiction-card__wrapper--selected': isSelected,
                })}
                onClick={() => {
                    !isAdded && onSelect(jurisdiction);
                }}
            >
                <div className='wallets-jurisdiction-card-front'>
                    {isOverHeaderAvailable && <JurisdictionCardTag tag={overHeader || ''} />}
                    <div className='wallets-jurisdiction-card-front__label'>
                        <Text align='center' size='lg' weight='bold'>
                            {header}
                        </Text>
                    </div>
                    <div className='wallets-jurisdiction-card-rows'>
                        {rows.map((row, index) => {
                            return (
                                <React.Fragment key={`wallets-jurisdiction-card-row--${row.key}`}>
                                    <JurisdictionCardRow
                                        className={`wallets-jurisdiction-card-row--${row.key}`}
                                        description={parseDescription(row)}
                                        renderTag={() => {
                                            if (!row?.titleIndicators) return;

                                            if (
                                                row.titleIndicators?.type === 'displayIcons' &&
                                                verificationDocs &&
                                                marketType &&
                                                marketType !== 'all'
                                            ) {
                                                return (
                                                    <div className='wallets-jurisdiction-card-front__tag-icons'>
                                                        {!(marketType in verificationDocs)
                                                            ? verificationDocumentsMapper.notApplicable.icon
                                                            : verificationDocs[marketType]?.map(doc => (
                                                                  <JurisdictionCardVerificationTag
                                                                      category={
                                                                          verificationDocumentsMapper[doc].category
                                                                      }
                                                                      icon={verificationDocumentsMapper[doc].icon}
                                                                      key={`verification-doc-${doc}`}
                                                                  />
                                                              ))}
                                                    </div>
                                                );
                                            }

                                            if (row?.titleIndicators?.displayText) {
                                                return (
                                                    <div
                                                        className={`wallets-jurisdiction-card-front__tag wallets-jurisdiction-card-front__tag--${
                                                            row.titleIndicators?.displayTextSkinColor || ''
                                                        }`}
                                                    >
                                                        <Text align='start' color='white' size='xs' weight='bold'>
                                                            {row.titleIndicators.displayText}
                                                        </Text>
                                                    </div>
                                                );
                                            }
                                        }}
                                        title={row.title}
                                    />
                                    {index < rows.length - 1 && (
                                        <Divider color='var(--wallets-banner-border-color)' height={2} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                    {isAdded && (
                        <div className='wallets-jurisdiction-card__added-status'>
                            <Text align='center' color='white' lineHeight='3xs' size='xs' weight='bold'>
                                <Localize i18n_default_text='Added' />
                            </Text>
                        </div>
                    )}
                </div>
                {marketType && marketType !== 'all' && verificationDocs && (
                    <JurisdictionCardBack setIsFlipped={setIsFlipped} verificationDocs={verificationDocs[marketType]} />
                )}
            </div>
        </div>
    );
};

export default JurisdictionCard;

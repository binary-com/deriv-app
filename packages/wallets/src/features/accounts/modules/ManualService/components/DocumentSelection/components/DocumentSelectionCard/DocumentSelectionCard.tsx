import React from 'react';
import { LabelPairedChevronLeftCaptionBoldIcon, LabelPairedChevronRightCaptionBoldIcon } from '@deriv/quill-icons';
import { Text, useDevice } from '@deriv-com/ui';
import useIsRtl from '../../../../../../../../hooks/useIsRtl';
import { TManualDocumentType } from '../../../../utils';
import './DocumentSelectionCard.scss';

type TDocumentSelectionCardProps = Omit<TManualDocumentType[string], 'component'> & {
    onClick: (document: keyof TManualDocumentType) => void;
    value: keyof TManualDocumentType;
};

const DocumentSelectionCard: React.FC<TDocumentSelectionCardProps> = ({
    description,
    icon: Icon,
    onClick,
    title,
    value,
}) => {
    const { isDesktop } = useDevice();
    const isRtl = useIsRtl();

    return (
        <button className='wallets-document-selection-card' data-testid={`dt_${value}`} onClick={() => onClick(value)}>
            <div className='wallets-document-selection-card__content'>
                <Icon />
                <div className='wallets-document-selection-card__text-content'>
                    <Text size={!isDesktop ? 'xs' : 'sm'} weight='bold'>
                        {title}
                    </Text>
                    <Text size={!isDesktop ? '2xs' : 'xs'}>{description}</Text>
                </div>
            </div>
            {isRtl ? (
                <LabelPairedChevronLeftCaptionBoldIcon width={16} />
            ) : (
                <LabelPairedChevronRightCaptionBoldIcon width={16} />
            )}
        </button>
    );
};

export default DocumentSelectionCard;

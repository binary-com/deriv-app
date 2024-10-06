import React from 'react';
import classNames from 'classnames';
import { LabelPairedChevronLeftLgFillIcon, LabelPairedChevronRightLgFillIcon } from '@deriv/quill-icons';
import { IconButton } from '../../../../components/Base';
import './CompareAccountsCarouselButton.scss';

type TPrevNextButtonProps = {
    enabled: boolean;
    isNext: boolean;
    isRtl?: boolean;
    onClick: () => void;
};

const CFDCompareAccountsCarouselButton = ({ enabled, isNext, isRtl, onClick }: TPrevNextButtonProps) => {
    const nextButton = isRtl ? (
        <LabelPairedChevronLeftLgFillIcon fill='#333333' />
    ) : (
        <LabelPairedChevronRightLgFillIcon fill='#333333' />
    );
    const prevButton = isRtl ? (
        <LabelPairedChevronRightLgFillIcon fill='#333333' />
    ) : (
        <LabelPairedChevronLeftLgFillIcon fill='#333333' />
    );

    return (
        <IconButton
            className={classNames('wallets-compare-accounts-carousel-button', {
                'wallets-compare-accounts-carousel-button--next': isNext,
                'wallets-compare-accounts-carousel-button--prev': !isNext,
            })}
            color='white'
            disabled={!enabled}
            icon={isNext ? nextButton : prevButton}
            isRound
            onClick={onClick}
            size='md'
        />
    );
};

export default CFDCompareAccountsCarouselButton;

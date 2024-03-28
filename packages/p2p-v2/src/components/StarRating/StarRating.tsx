import React, { memo } from 'react';
import { Rating } from 'react-simple-star-rating';
import { LabelPairedStarLgFillIcon, LabelPairedStarLgRegularIcon } from '@deriv/quill-icons';
import './StarRating.scss';

type TStarRatingProps = {
    allowHalfIcon?: boolean;
    allowHover?: boolean;
    initialValue?: number;
    isReadonly?: boolean;
    onClick?: (rate: number) => void;
    ratingValue: number;
    starsScale?: number;
};

const StarRating = ({
    allowHalfIcon = false,
    allowHover = false,
    initialValue = 0,
    isReadonly = false,
    onClick,
    ratingValue,
    starsScale = 1,
}: TStarRatingProps) => {
    // Converts initial value to be in the form of x.0 or x.5
    // to show full and half stars only
    const fractionalizedValue = Math.round(initialValue * 2) / 2;

    return (
        <Rating
            allowHalfIcon={allowHalfIcon}
            allowHover={allowHover}
            className='p2p-v2-star-rating'
            emptyIcon={<LabelPairedStarLgRegularIcon data-testid='dt_p2p_v2_star_rating_empty_star' fill='#FFAD3A' />}
            fullIcon={<LabelPairedStarLgFillIcon data-testid='dt_p2p_v2_star_rating_full_star' fill='#FFAD3A' />}
            iconsCount={5}
            initialValue={ratingValue}
            onClick={onClick}
            ratingValue={fractionalizedValue}
            readonly={isReadonly}
            size={12}
            style={{ transform: `scale(${starsScale})`, transformOrigin: 'left' }}
        />
    );
};

export default memo(StarRating);

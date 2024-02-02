import React from 'react';
import { Loader, Text, useDevice } from '@deriv-com/ui';
import { useAdvertiserStats } from '../../hooks';
import ThumbUpIcon from '../../public/ic-thumb-up.svg';
import BlockedUserOutlineIcon from '../../public/ic-user-blocked-outline.svg';
import { StarRating } from '../StarRating';
import './AdvertiserNameStats.scss';

/**
 * This component is to show an advertiser's stats, in UI its commonly used under an advertiser's name
 * Example:
 * Joined 2d | Not rated yet | x x x x x (5 ratings)
 *
 * Use cases are to show this in My Profile and Advertiser page
 */
const AdvertiserNameStats = () => {
    const { data: advertiserStats, isLoading } = useAdvertiserStats();
    const { isMobile } = useDevice();

    if (isLoading || !advertiserStats) return <Loader />;

    const { blocked_by_count, daysSinceJoined, rating_average, rating_count, recommended_average } = advertiserStats;

    return (
        <div className='p2p-v2-advertiser-name-stats'>
            <div>
                <Text color='less-prominent' size='sm'>
                    Joined {daysSinceJoined}d
                </Text>
            </div>
            {!rating_average && (
                <div>
                    <Text color='less-prominent' size='sm'>
                        Not rated yet
                    </Text>
                </div>
            )}
            {rating_average && (
                <>
                    <div>
                        <div className='p2p-v2-advertiser-name-stats__rating'>
                            {isMobile && (
                                <Text color='less-prominent' size='sm'>
                                    ({rating_average})
                                </Text>
                            )}
                            <StarRating ratingValue={rating_average} />
                            <Text color='less-prominent' size='sm'>
                                ({rating_count} ratings)
                            </Text>
                        </div>
                    </div>
                    <div>
                        <ThumbUpIcon />
                        <Text color='less-prominent' size='sm'>
                            {recommended_average || 0}%
                        </Text>
                    </div>
                </>
            )}
            <div>
                <BlockedUserOutlineIcon />
                <Text color='less-prominent' size='sm'>
                    {blocked_by_count}
                </Text>
            </div>
        </div>
    );
};
AdvertiserNameStats.displayName = 'AdvertiserNameStats';

export default AdvertiserNameStats;

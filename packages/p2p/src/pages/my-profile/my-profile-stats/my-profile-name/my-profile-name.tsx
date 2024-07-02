import React from 'react';
import { DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import { daysSince } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import BlockUserCount from 'Pages/advertiser-page/block-user/block-user-count';
import RecommendedBy from 'Components/recommended-by';
import StarRating from 'Components/star-rating';
import TradeBadge from 'Components/trade-badge';
import UserAvatar from 'Components/user/user-avatar';
import { document_status_codes, identity_status_codes } from 'Constants/account-status-codes';
import { useStores } from 'Stores';
import { getIconSize, getTextSize } from 'Utils/responsive';
import MyProfilePrivacy from '../my-profile-privacy';

const MyProfileName = () => {
    const { general_store } = useStores();
    const { client } = useStore();
    const {
        basic_verification,
        buy_orders_count,
        created_time,
        full_verification,
        rating_average,
        rating_count,
        recommended_average,
        recommended_count,
        sell_orders_count,
    } = general_store.advertiser_info;
    const { email_address } = client;

    const date_joined = created_time ? new Date(created_time * 1000).toISOString().split('T')[0] : '';
    const joined_since = daysSince(date_joined);
    // rating_average_decimal converts rating_average to 1 d.p number
    const rating_average_decimal = rating_average ? Number(rating_average).toFixed(1) : null;
    const user_nickname = general_store.is_advertiser ? general_store.nickname : email_address;

    return (
        <div className='my-profile-name'>
            <UserAvatar
                className='my-profile-name__avatar'
                nickname={user_nickname}
                size={getIconSize(32, 64)}
                text_size={getTextSize('s', 'm')}
            />
            <div className='my-profile-name__name'>
                <div className='my-profile-name__privacy'>
                    <div className='my-profile-name__column'>
                        <Text color='prominent' weight='bold'>
                            {user_nickname}
                        </Text>
                        <MobileWrapper>
                            <div className='my-profile-name__row'>
                                <Text
                                    className='my-profile-name__rating__row'
                                    color='less-prominent'
                                    size={getTextSize('xxxs', 'xs')}
                                >
                                    {joined_since ? (
                                        <Localize
                                            i18n_default_text='Joined {{days_since_joined}}d'
                                            values={{ days_since_joined: joined_since }}
                                        />
                                    ) : (
                                        <Localize i18n_default_text='Joined today' />
                                    )}
                                </Text>
                            </div>
                        </MobileWrapper>
                        <div className='my-profile-name__rating'>
                            <DesktopWrapper>
                                <Text
                                    className='my-profile-name__rating__row'
                                    color='less-prominent'
                                    size={getTextSize('xxxs', 'xs')}
                                >
                                    {joined_since ? (
                                        <Localize
                                            i18n_default_text='Joined {{days_since_joined}}d'
                                            values={{ days_since_joined: joined_since }}
                                        />
                                    ) : (
                                        <Localize i18n_default_text='Joined today' />
                                    )}
                                </Text>
                            </DesktopWrapper>
                            {rating_average ? (
                                <React.Fragment>
                                    <div className='my-profile-name__rating__row'>
                                        <Text color='prominent' size={getTextSize('xxxs', 'xs')}>
                                            {rating_average_decimal}
                                        </Text>
                                        <StarRating
                                            empty_star_icon='IcEmptyStar'
                                            full_star_icon='IcFullStar'
                                            initial_value={rating_average_decimal}
                                            is_readonly
                                            number_of_stars={5}
                                            should_allow_hover_effect={false}
                                            star_size={getIconSize(17, 20)}
                                        />
                                        <div className='my-profile-name__rating__text'>
                                            <Text color='less-prominent' size={getTextSize('xxxs', 'xs')}>
                                                {rating_count === 1 ? (
                                                    <Localize
                                                        i18n_default_text='({{number_of_ratings}} rating)'
                                                        values={{ number_of_ratings: rating_count }}
                                                    />
                                                ) : (
                                                    <Localize
                                                        i18n_default_text='({{number_of_ratings}} ratings)'
                                                        values={{ number_of_ratings: rating_count }}
                                                    />
                                                )}
                                            </Text>
                                        </div>
                                    </div>
                                    <div className='my-profile-name__rating__row'>
                                        <RecommendedBy
                                            recommended_average={recommended_average}
                                            recommended_count={recommended_count}
                                        />
                                    </div>
                                </React.Fragment>
                            ) : (
                                <div className='my-profile-name__rating__row'>
                                    <Text color='less-prominent' size={getTextSize('xxxs', 'xs')}>
                                        <Localize i18n_default_text='Not rated yet' />
                                    </Text>
                                </div>
                            )}
                            <DesktopWrapper>
                                <div className='my-profile-name__rating__row'>
                                    <BlockUserCount />
                                </div>
                                {/* TODO: uncomment when implementing business hours feature */}
                                {/* <div className='my-profile-name__rating__row'>
                                    <MyProfileNameBusinessHours />
                                </div> */}
                            </DesktopWrapper>
                        </div>
                        <MobileWrapper>
                            <div className='my-profile-name__row'>
                                <div className='my-profile-name__rating__row'>
                                    <BlockUserCount />
                                </div>
                                {/* TODO: uncomment when implementing business hours feature */}
                                {/* <div className='my-profile-name__rating__row'>
                                    <MyProfileNameBusinessHours />
                                </div> */}
                            </div>
                        </MobileWrapper>
                        <div className='my-profile-name__row'>
                            <TradeBadge
                                is_poa_verified={
                                    general_store.is_advertiser
                                        ? !!full_verification
                                        : general_store.poa_status === document_status_codes.VERIFIED
                                }
                                is_poi_verified={
                                    general_store.is_advertiser
                                        ? !!basic_verification
                                        : general_store.poi_status === identity_status_codes.VERIFIED
                                }
                                trade_count={Number(buy_orders_count) + Number(sell_orders_count)}
                                large
                            />
                        </div>
                    </div>
                    <DesktopWrapper>
                        <MyProfilePrivacy />
                    </DesktopWrapper>
                </div>
            </div>
        </div>
    );
};

export default observer(MyProfileName);

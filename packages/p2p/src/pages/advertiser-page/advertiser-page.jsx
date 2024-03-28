import React from 'react';
import classNames from 'classnames';
import { reaction } from 'mobx';
import { useP2PAdvertiserAdverts } from 'Hooks';
import { useHistory, useLocation } from 'react-router-dom';
import { DesktopWrapper, Loading, MobileWrapper, Text } from '@deriv/components';
import { useP2PAdvertInfo } from '@deriv/hooks';
import { daysSince, isEmptyObject, isMobile, routes } from '@deriv/shared';
import { observer } from '@deriv/stores';

import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { OnlineStatusIcon, OnlineStatusLabel } from 'Components/online-status';
import PageReturn from 'Components/page-return';
import RecommendedBy from 'Components/recommended-by';
import StarRating from 'Components/star-rating';
import TradeBadge from 'Components/trade-badge';
import UserAvatar from 'Components/user/user-avatar';
import { api_error_codes } from 'Constants/api-error-codes';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import { getEligibilityMessage } from 'Utils/adverts';
import { getErrorMessage, getErrorModalTitle, getWidth } from 'Utils/block-user';
import AdvertiserPageAdverts from './advertiser-page-adverts.jsx';
import AdvertiserPageDropdownMenu from './advertiser-page-dropdown-menu.jsx';
import AdvertiserPageStats from './advertiser-page-stats.jsx';
import BlockUserOverlay from './block-user/block-user-overlay';

const AdvertiserPage = () => {
    const { advertiser_page_store, buy_sell_store, general_store, my_profile_store } = useStores();
    const {
        advertiser_id,
        advertiser_info,
        counterparty_advert_id,
        counterparty_advertiser_id,
        is_advertiser,
        is_barred,
        setCounterpartyAdvertId,
        setCounterpartyAdvertiserId,
    } = general_store;
    const { hideModal, showModal, useRegisterModalProps } = useModalManagerContext();
    const { advertiser_details_name, counterparty_advertiser_info } = advertiser_page_store;
    const { id: counterparty_details_id } = counterparty_advertiser_info;

    const is_my_advert =
        !!counterparty_details_id && !!advertiser_id ? counterparty_details_id === advertiser_id : null;
    // Use general_store.advertiser_info since resubscribing to the same id from advertiser page returns error
    const info = is_my_advert ? advertiser_info : counterparty_advertiser_info;

    const history = useHistory();
    const location = useLocation();

    const {
        basic_verification,
        buy_orders_count,
        created_time,
        first_name,
        full_verification,
        is_online,
        last_online_time,
        last_name,
        name,
        rating_average,
        rating_count,
        recommended_average,
        recommended_count,
        sell_orders_count,
    } = info;

    const is_invalid_advertiser_id = general_store.error_code === api_error_codes.INVALID_ADVERTISER_ID;
    const joined_since = daysSince(created_time);
    const nickname = advertiser_details_name ?? name;
    // rating_average_decimal converts rating_average to 1 d.p number
    const rating_average_decimal = rating_average ? Number(rating_average).toFixed(1) : null;

    const { data: p2p_advert_info } = useP2PAdvertInfo(counterparty_advert_id);

    const showErrorModal = eligibility_status => {
        let error_message = localize("It's either deleted or no longer active.");
        let error_modal_title = localize('This ad is unavailable');

        if (eligibility_status?.length > 0) {
            error_modal_title = '';
            error_message = getEligibilityMessage(eligibility_status);
        }

        setCounterpartyAdvertId('');
        showModal({
            key: 'ErrorModal',
            props: {
                error_message,
                error_modal_button_text: 'OK',
                error_modal_title,
                onClose: () => {
                    hideModal({ should_hide_all_modals: true });
                },
                width: isMobile() ? '90vw' : '',
            },
        });
    };

    const setShowAdvertInfo = React.useCallback(
        () => {
            if (p2p_advert_info) {
                const { eligibility_status, is_active, is_buy, is_eligible, is_visible } = p2p_advert_info || {};
                const advert_type = is_buy ? 1 : 0;

                if (is_active && is_visible && is_eligible) {
                    advertiser_page_store.setActiveIndex(advert_type);
                    advertiser_page_store.handleTabItemClick(advert_type);
                    buy_sell_store.setSelectedAdState(p2p_advert_info);
                    showModal({ key: 'BuySellModal' });
                } else {
                    showErrorModal(eligibility_status);
                }
            }
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [p2p_advert_info]
    );

    React.useEffect(() => {
        if (is_advertiser && !is_barred && is_my_advert !== null && !is_my_advert) setShowAdvertInfo();
    }, [counterparty_advert_id, setShowAdvertInfo, is_my_advert]);

    React.useEffect(() => {
        if (location.search || counterparty_advertiser_id) {
            const url_params = new URLSearchParams(location.search);
            general_store.setCounterpartyAdvertiserId(url_params.get('id'));
        }

        buy_sell_store.setShowAdvertiserPage(true);
        advertiser_page_store.onMount();
        advertiser_page_store.setIsDropdownMenuVisible(false);

        const disposeCounterpartyAdvertiserIdReaction = reaction(
            () => [general_store.counterparty_advertiser_id, general_store.is_advertiser_info_subscribed],
            () => {
                if (counterparty_advertiser_id) {
                    // DO NOT REMOVE. This fixes reloading issue when user navigates to advertiser page via URL
                    advertiser_page_store.onAdvertiserIdUpdate();

                    if (is_barred) {
                        history.push(routes.p2p_buy_sell);
                    }

                    // Need to set active index to 0 when users navigate to advertiser page via url,
                    // and when user clicks the back button, it will navigate back to the buy/sell tab
                    general_store.setActiveIndex(0);
                }
            },
            { fireImmediately: true }
        );

        return () => {
            disposeCounterpartyAdvertiserIdReaction();
            advertiser_page_store.onUnmount();
            buy_sell_store.setShowAdvertiserPage(false);
            advertiser_page_store.setCounterpartyAdvertiserInfo({});
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const disposeBlockUnblockUserErrorReaction = reaction(
            () => [advertiser_page_store.active_index, general_store.block_unblock_user_error],
            () => {
                if (general_store.block_unblock_user_error) {
                    showModal({
                        key: 'ErrorModal',
                        props: {
                            error_message: getErrorMessage(
                                general_store.block_unblock_user_error,
                                !!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert,
                                is_invalid_advertiser_id,
                                nickname
                            ),
                            error_modal_button_text: localize('Got it'),
                            error_modal_title: getErrorModalTitle(is_invalid_advertiser_id, nickname),
                            has_close_icon: false,
                            onClose: () => {
                                buy_sell_store.hideAdvertiserPage();
                                history.push(general_store.active_tab_route);
                                if (general_store.active_index !== 0)
                                    my_profile_store.setActiveTab(my_profile_tabs.MY_COUNTERPARTIES);
                                advertiser_page_store.onCancel();
                                general_store.setBlockUnblockUserError('');
                                hideModal();
                            },
                            width: getWidth(),
                        },
                    });
                }
            },
            { fireImmediately: true }
        );

        return () => {
            disposeBlockUnblockUserErrorReaction();
            advertiser_page_store.onUnmount();
        };
    }, [advertiser_details_name, counterparty_advertiser_info]);

    useRegisterModalProps({
        key: 'BlockUserModal',
        props: {
            advertiser_name: name,
            is_advertiser_blocked: !!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert,
            onCancel: advertiser_page_store.onCancel,
            onSubmit: advertiser_page_store.onSubmit,
        },
    });

    const { error, isError } = useP2PAdvertiserAdverts();

    if (advertiser_page_store.is_loading || general_store.is_block_unblock_user_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (advertiser_page_store.error_message) {
        return <div className='advertiser-page__error'>{advertiser_page_store.error_message}</div>;
    }

    if (isError) {
        return <div className='advertiser-page__error'>{error.message}</div>;
    }

    return (
        <div
            className={classNames('advertiser-page', {
                'advertiser-page--no-scroll':
                    !!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert,
            })}
        >
            <div className='advertiser-page__page-return-header'>
                <PageReturn
                    className='buy-sell__advertiser-page-return'
                    onClick={() => {
                        buy_sell_store.hideAdvertiserPage();
                        if (general_store.active_index === general_store.path.my_profile)
                            my_profile_store.setActiveTab(my_profile_tabs.MY_COUNTERPARTIES);
                        history.push(general_store.active_tab_route);
                        setCounterpartyAdvertiserId(null);
                        setCounterpartyAdvertId('');
                    }}
                    page_title={localize("Advertiser's page")}
                />
                {!is_my_advert && (
                    <MobileWrapper>
                        <AdvertiserPageDropdownMenu />
                    </MobileWrapper>
                )}
            </div>
            <BlockUserOverlay
                is_visible={!!advertiser_page_store.is_counterparty_advertiser_blocked && !is_my_advert}
                onClickUnblock={() =>
                    showModal({
                        key: 'BlockUserModal',
                    })
                }
            >
                <div className='advertiser-page-details-container'>
                    <div className='advertiser-page__header-details'>
                        <UserAvatar
                            nickname={nickname}
                            size={isMobile() ? 32 : 64}
                            text_size={isMobile() ? 's' : 'sm'}
                        />
                        <div className='advertiser-page__header-name--column'>
                            <div className='advertiser-page__header-name'>
                                <Text color='prominent' weight='bold'>
                                    {nickname}
                                </Text>
                                {first_name && last_name && (
                                    <div className='advertiser-page__header-real-name'>
                                        <Text color='less-prominent' line_height='xs' size='xs'>
                                            {`(${first_name} ${last_name})`}
                                        </Text>
                                    </div>
                                )}
                            </div>
                            <MobileWrapper>
                                <div className='advertiser-page__row'>
                                    <div className='advertiser-page__rating--row'>
                                        <OnlineStatusIcon is_online={is_online} />
                                        <OnlineStatusLabel is_online={is_online} last_online_time={last_online_time} />
                                    </div>
                                    <div className='advertiser-page__rating--row'>
                                        <Text
                                            className='advertiser-page__joined-since'
                                            color='less-prominent'
                                            size='xxxs'
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
                                </div>
                            </MobileWrapper>
                            {!isEmptyObject(info) && (
                                <div className='advertiser-page__rating'>
                                    <DesktopWrapper>
                                        <div className='advertiser-page__rating--row'>
                                            <OnlineStatusIcon is_online={is_online} />
                                            <OnlineStatusLabel
                                                is_online={is_online}
                                                last_online_time={last_online_time}
                                            />
                                        </div>
                                        <div className='advertiser-page__rating--row'>
                                            <Text
                                                className='advertiser-page__joined-since'
                                                color='less-prominent'
                                                size='xs'
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
                                    </DesktopWrapper>
                                    {rating_average ? (
                                        <React.Fragment>
                                            <div className='advertiser-page__rating--row'>
                                                <Text color='prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                                                    {rating_average_decimal}
                                                </Text>
                                                <StarRating
                                                    empty_star_className='advertiser-page__rating--star'
                                                    empty_star_icon='IcEmptyStar'
                                                    full_star_className='advertiser-page__rating--star'
                                                    full_star_icon='IcFullStar'
                                                    initial_value={rating_average_decimal}
                                                    is_readonly
                                                    number_of_stars={5}
                                                    should_allow_hover_effect={false}
                                                    star_size={isMobile() ? 17 : 20}
                                                />
                                                <div className='advertiser-page__rating--text'>
                                                    <Text color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
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
                                            <div className='advertiser-page__rating--row'>
                                                <RecommendedBy
                                                    recommended_average={recommended_average}
                                                    recommended_count={recommended_count}
                                                />
                                            </div>
                                        </React.Fragment>
                                    ) : (
                                        <div className='advertiser-page__rating--row'>
                                            <Text color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                                                <Localize i18n_default_text='Not rated yet' />
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className='advertiser-page__row'>
                                <TradeBadge
                                    is_poa_verified={!!full_verification}
                                    is_poi_verified={!!basic_verification}
                                    trade_count={Number(buy_orders_count) + Number(sell_orders_count)}
                                    large
                                />
                            </div>
                        </div>
                        {!is_my_advert && (
                            <DesktopWrapper>
                                <AdvertiserPageDropdownMenu />
                            </DesktopWrapper>
                        )}
                    </div>
                    <AdvertiserPageStats />
                </div>
                <AdvertiserPageAdverts />
            </BlockUserOverlay>
        </div>
    );
};

export default observer(AdvertiserPage);

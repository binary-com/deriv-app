import React from 'react';
import { Dropdown, Icon, Loading, Text } from '@deriv/components';
import { daysSince, isDesktop, isMobile } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import PageReturn from 'Components/page-return/page-return.jsx';
import { Localize, localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import BuySellModal from 'Components/buy-sell/buy-sell-modal.jsx';
import UserAvatar from 'Components/user/user-avatar/user-avatar.jsx';
import { useStores } from 'Stores';
import AdvertiserPageStats from './advertiser-page-stats.jsx';
import AdvertiserPageAdverts from './advertiser-page-adverts.jsx';
import TradeBadge from '../trade-badge/trade-badge.jsx';
import './advertiser-page.scss';

const AdvertiserPageDropdown = ({ is_dropdown_visible, onViewBlockModal, onViewDropdown }) => {
    return (
        <div className='advertiser-page__menu-dots-toggle'>
            <Icon
                className='advertiser-page__menu-dots-icon'
                height='16px'
                icon={'IcMenuDots'}
                onClick={onViewDropdown}
                width='16px'
            />
            {is_dropdown_visible && (
                <div className='advertiser-page__dropdown' onClick={onViewBlockModal}>
                    <Dropdown
                        is_align_text_right
                        list={['Block']}
                        name={'block_user_dropdown'}
                        placeholder={localize('Block')}
                    />
                </div>
            )}
        </div>
    );
};

AdvertiserPageDropdown.propTypes = {
    is_dropdown_visible: PropTypes.bool.isRequired,
    onViewBlockModal: PropTypes.func.isRequired,
    onViewDropdown: PropTypes.func.isRequired,
};

const AdvertiserPage = () => {
    const { advertiser_page_store, buy_sell_store } = useStores();

    const [isDropdownVisible, setIsDropdownVisible] = React.useState(false);

    const {
        basic_verification,
        buy_orders_count,
        created_time,
        first_name,
        full_verification,
        last_name,
        sell_orders_count,
    } = advertiser_page_store.advertiser_info;

    const joined_since = daysSince(created_time);

    React.useEffect(() => {
        advertiser_page_store.onMount();
        setIsDropdownVisible(false);

        return reaction(
            () => advertiser_page_store.active_index,
            () => advertiser_page_store.onTabChange(),
            { fireImmediately: true }
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (advertiser_page_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (advertiser_page_store.error_message) {
        return <div className='advertiser-page__error'>{advertiser_page_store.error_message}</div>;
    }

    return (
        <div className='advertiser-page'>
            <BuySellModal
                selected_ad={advertiser_page_store.advert}
                should_show_popup={advertiser_page_store.show_ad_popup}
                setShouldShowPopup={advertiser_page_store.setShowAdPopup}
                table_type={advertiser_page_store.counterparty_type === buy_sell.BUY ? buy_sell.BUY : buy_sell.SELL}
            />
            <div className='advertiser-page__page-return-header'>
                <PageReturn
                    className='buy-sell__advertiser-page-return'
                    onClick={buy_sell_store.hideAdvertiserPage}
                    page_title={localize("Advertiser's page")}
                />
                {isMobile() && (
                    <AdvertiserPageDropdown
                        is_dropdown_visible={isDropdownVisible}
                        onViewBlockModal={() => advertiser_page_store.setIsBlockUserModalOpen(true)}
                        onViewDropdown={() => setIsDropdownVisible(prevState => !prevState)}
                    />
                )}
            </div>
            <div className='advertiser-page-details-container'>
                <div className='advertiser-page__header-details'>
                    <UserAvatar
                        nickname={advertiser_page_store.advertiser_details_name}
                        size={isMobile() ? 32 : 64}
                        text_size={isMobile() ? 's' : 'sm'}
                    />
                    <div className='advertiser-page__header-name--column'>
                        <div className='advertiser-page__header-name'>
                            <Text color='prominent' line-height='m' size='s' weight='bold'>
                                {advertiser_page_store.advertiser_details_name}
                            </Text>
                            {first_name && last_name && (
                                <div className='advertiser-page__header-real-name'>
                                    <Text color='less-prominent' line_height='xs' size='xs'>
                                        {`(${first_name} ${last_name})`}
                                    </Text>
                                </div>
                            )}
                        </div>
                        <Text color='less-prominent' size={isMobile() ? 'xxxs' : 'xs'}>
                            {joined_since > 0 ? (
                                <Localize
                                    i18n_default_text='Joined {{days_since_joined}}d'
                                    values={{ days_since_joined: joined_since }}
                                />
                            ) : (
                                <Localize i18n_default_text='Joined today' />
                            )}
                        </Text>
                        <div className='my-profile-name--row'>
                            <TradeBadge
                                is_poa_verified={!!full_verification}
                                is_poi_verified={!!basic_verification}
                                trade_count={Number(buy_orders_count) + Number(sell_orders_count)}
                                large
                            />
                        </div>
                    </div>
                    {isDesktop() && (
                        <AdvertiserPageDropdown
                            is_dropdown_visible={isDropdownVisible}
                            onViewBlockModal={() => advertiser_page_store.setIsBlockUserModalOpen(true)}
                            onViewDropdown={() => setIsDropdownVisible(prevState => !prevState)}
                        />
                    )}
                </div>
                <AdvertiserPageStats />
            </div>
            <AdvertiserPageAdverts />
        </div>
    );
};

AdvertiserPage.propTypes = {
    active_index: PropTypes.number,
    advert: PropTypes.object,
    advertiser_info: PropTypes.object,
    adverts: PropTypes.array,
    api_error_message: PropTypes.string,
    counterparty_type: PropTypes.string,
    error_message: PropTypes.string,
    form_error_message: PropTypes.string,
    handleTabItemClick: PropTypes.func,
    height_values: PropTypes.array,
    is_loading: PropTypes.bool,
    is_submit_disabled: PropTypes.bool,
    item_height: PropTypes.number,
    modal_title: PropTypes.string,
    onCancelClick: PropTypes.func,
    onConfirmClick: PropTypes.func,
    onMount: PropTypes.func,
    onTabChange: PropTypes.func,
    setFormErrorMessage: PropTypes.func,
    setIsSubmitDisabled: PropTypes.func,
    setSubmitForm: PropTypes.func,
    show_ad_popup: PropTypes.bool,
    showAdPopup: PropTypes.func,
    submitForm: PropTypes.func,
};

export default observer(AdvertiserPage);

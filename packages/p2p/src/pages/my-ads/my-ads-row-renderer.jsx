import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, Icon, Popover, ProgressIndicator, Table, Text } from '@deriv/components';
import { isMobile, formatMoney } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useP2PExchangeRate } from '@deriv/hooks';
import { Localize, localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AdStatus from 'Pages/my-ads/ad-status.jsx';
import { useStores } from 'Stores';
import { api_error_codes } from 'Constants/api-error-codes';
import { generateEffectiveRate } from 'Utils/format-value';
import AdType from './ad-type.jsx';

const MyAdsRowDropdown = ({ is_advert_active, is_disabled, onSelectMore }) => {
    return (
        <Dropdown
            className='my-ads-table__status-more'
            classNameDisplay='my-ads-table__status-more--display'
            disabled={is_disabled}
            is_align_text_left
            list={[
                {
                    text: localize('Edit'),
                    value: 'edit',
                },
                {
                    text: localize('Copy'),
                    value: 'copy',
                },
                {
                    text: localize('Share'),
                    value: 'share',
                },
                {
                    text: is_advert_active ? localize('Deactivate') : localize('Activate'),
                    value: is_advert_active ? 'deactivate' : 'activate',
                },

                {
                    text: localize('Delete'),
                    value: 'delete',
                },
            ]}
            no_border
            onChange={onSelectMore}
            suffix_icon='IcCashierVerticalEllipsis'
        />
    );
};

const MyAdsRowRenderer = observer(({ row: advert }) => {
    const {
        ui: { is_desktop },
    } = useStore();
    const { floating_rate_store, general_store, my_ads_store, my_profile_store } = useStores();
    const { showModal } = useModalManagerContext();

    const {
        account_currency,
        amount,
        amount_display,
        effective_rate,
        id,
        is_active,
        local_currency,
        max_order_amount_display,
        min_order_amount_display,
        payment_method_names,
        price_display,
        rate_display,
        rate_type,
        remaining_amount,
        remaining_amount_display,
        type,
        visibility_status = [],
    } = advert;

    // Use separate is_advert_active state to ensure value is updated
    const [is_advert_active, setIsAdvertActive] = React.useState(is_active);
    const [show_warning_icon, setShowWarningIcon] = React.useState(false);
    const amount_dealt = amount - remaining_amount;
    const enable_action_point = floating_rate_store.change_ad_alert && floating_rate_store.rate_type !== rate_type;
    const is_buy_advert = type === buy_sell.BUY;
    const advert_type = is_buy_advert ? <Localize i18n_default_text='Buy' /> : <Localize i18n_default_text='Sell' />;
    const exchange_rate = useP2PExchangeRate(local_currency);

    const { display_effective_rate } = generateEffectiveRate({
        price: price_display,
        rate_type,
        rate: rate_display,
        local_currency,
        exchange_rate,
        market_rate: effective_rate,
    });

    const { ADVERT_INACTIVE, ADVERTISER_ADS_PAUSED } = api_error_codes;

    const is_advert_listed = general_store.is_listed && !general_store.is_barred;
    const ad_pause_color = is_advert_listed ? 'general' : 'less-prominent';

    const icon_disabled_color =
        (!general_store.is_listed || general_store.is_barred || !is_advert_active) && 'disabled';
    const is_activate_ad_disabled = floating_rate_store.reached_target_date && enable_action_point;

    const onClickActivateDeactivate = () => {
        if (!is_activate_ad_disabled) {
            my_ads_store.onClickActivateDeactivate(id, is_advert_active, setIsAdvertActive);
        }
    };

    const onClickAdd = () => {
        if (is_advert_listed) {
            my_ads_store.showQuickAddModal(advert);
        }
    };
    const onClickDelete = () => !general_store.is_barred && my_ads_store.onClickDelete(id);
    const onClickEdit = () => !general_store.is_barred && my_ads_store.onClickEdit(id, rate_type);
    const onClickShare = () => {
        if (!general_store.is_barred) showModal({ key: 'ShareMyAdsModal', props: { advert } });
    };
    const onClickCopy = () => {
        my_ads_store.onClickCopy(id, is_desktop);
    };
    const onClickSwitchAd = () => {
        if (!general_store.is_barred) {
            general_store.showModal({ key: 'MyAdsFloatingRateSwitchModal', props: {} });
            my_ads_store.onToggleSwitchModal(id);
        }
    };

    const handleOnEdit = () =>
        enable_action_point && floating_rate_store.rate_type !== rate_type ? onClickSwitchAd() : onClickEdit();

    const should_show_tooltip_icon =
        (visibility_status?.length === 1 &&
            visibility_status[0] !== 'advert_inactive' &&
            visibility_status[0] !== 'advertiser_ads_paused') ||
        visibility_status.length > 1;

    const getErrorCodes = () => {
        let updated_visibility_status = [...visibility_status];
        if (!is_advert_listed && !updated_visibility_status.includes(ADVERTISER_ADS_PAUSED))
            updated_visibility_status = [...updated_visibility_status, ADVERTISER_ADS_PAUSED];
        if (!enable_action_point && updated_visibility_status.includes(ADVERT_INACTIVE))
            updated_visibility_status = updated_visibility_status.filter(status => status !== ADVERT_INACTIVE);
        if (enable_action_point && !updated_visibility_status.includes(ADVERT_INACTIVE))
            updated_visibility_status = [...updated_visibility_status, ADVERT_INACTIVE];
        return updated_visibility_status;
    };

    React.useEffect(() => {
        my_profile_store.getAdvertiserPaymentMethods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        setShowWarningIcon(enable_action_point || should_show_tooltip_icon || !general_store.is_listed);
    }, [enable_action_point, general_store.is_listed, should_show_tooltip_icon]);

    const onClickTooltipIcon = () => {
        showModal({
            key: 'AdErrorTooltipModal',
            props: {
                visibility_status: getErrorCodes(),
                account_currency,
                advert_type: type,
                remaining_amount,
            },
        });
    };

    const onSelectMore = event => {
        switch (event.target.value) {
            case 'edit':
                handleOnEdit();
                break;
            case 'copy':
                onClickCopy();
                break;
            case 'share':
                onClickShare();
                break;
            case 'activate':
            case 'deactivate':
                onClickActivateDeactivate();
                break;
            case 'delete':
                onClickDelete();
                break;
            default:
        }
    };

    if (isMobile()) {
        return (
            <Table.Row
                className={classNames('my-ads-table__row', {
                    'my-ads-table__row-disabled': !is_advert_active,
                })}
            >
                <Text color='less-prominent' size='xxs'>
                    <Localize i18n_default_text='Ad ID {{advert_id}} ' values={{ advert_id: id }} />
                </Text>
                <div className='my-ads-table__row__type-and-status'>
                    <Text color={ad_pause_color} weight='bold'>
                        {advert_type} {account_currency}
                    </Text>
                    {show_warning_icon ? (
                        <div className='my-ads-table__status-warning'>
                            <div style={{ marginRight: '0.8rem' }}>
                                <AdStatus is_active={!!is_advert_active && !general_store.is_barred} />
                            </div>
                            <Icon
                                icon='IcAlertWarning'
                                onClick={onClickTooltipIcon}
                                className={!!is_advert_active && 'my-ads-table__status-warning__icon'}
                                data_testid='dt_visibility_alert_icon'
                            />
                        </div>
                    ) : (
                        <AdStatus is_active={!!is_advert_active && !general_store.is_barred} />
                    )}
                    <MyAdsRowDropdown
                        is_advert_active={is_advert_active}
                        is_disabled={general_store.is_barred}
                        onSelectMore={onSelectMore}
                    />
                </div>
                <div className='my-ads-table__row-details'>
                    <Text color={is_advert_listed ? 'profit-success' : 'less-prominent'} size='xxs'>
                        {`${formatMoney(account_currency, amount_dealt, true)}`} {account_currency}&nbsp;
                        {is_buy_advert ? localize('Bought') : localize('Sold')}
                    </Text>
                    <Text color='less-prominent' size='xxs'>
                        {amount_display} {account_currency}
                    </Text>
                </div>
                <ProgressIndicator className={'my-ads-table__available-progress'} value={amount_dealt} total={amount} />
                <div className='my-ads-table__row-details'>
                    <Text color='less-prominent' size='xxs'>
                        <Localize i18n_default_text='Limits' />
                    </Text>
                    <Text color='less-prominent' size='xxs'>
                        <Localize i18n_default_text='Rate (1 {{account_currency}})' values={{ account_currency }} />
                    </Text>
                </div>
                <div className='my-ads-table__row-details'>
                    <Text color={ad_pause_color} size='xxs'>
                        {min_order_amount_display} - {max_order_amount_display} {account_currency}
                    </Text>
                    <Text color={is_advert_listed ? 'profit-success' : 'disabled'} size='xs' weight='bold'>
                        <div className='display-layout'>
                            {display_effective_rate} {local_currency}
                            {rate_type === ad_type.FLOAT && (
                                <AdType ad_pause_color={ad_pause_color} float_rate={rate_display} />
                            )}
                        </div>
                    </Text>
                </div>
                <div className='my-ads-table__row-methods'>
                    {payment_method_names ? (
                        payment_method_names.map((payment_method, key) => {
                            return (
                                <div className='my-ads-table__payment-method--label' key={key}>
                                    <Text color={ad_pause_color} size='xxxs' line_height='l'>
                                        {payment_method}
                                    </Text>
                                </div>
                            );
                        })
                    ) : (
                        <div
                            className={classNames('my-ads-table__add', {
                                'my-ads-table__add--disabled': !general_store.is_listed,
                            })}
                            onClick={() => onClickAdd()}
                        >
                            <Icon color={icon_disabled_color} icon='IcAdd' />
                            <Text color={ad_pause_color} size='xxs' weight='bold'>
                                <Localize i18n_default_text='Add' />
                            </Text>
                        </div>
                    )}
                </div>
            </Table.Row>
        );
    }

    return (
        <div>
            <Table.Row
                className={classNames('my-ads-table__row', {
                    'my-ads-table__row-disabled': !is_advert_active,
                })}
            >
                <Table.Cell>
                    {advert_type} {id}
                </Table.Cell>
                <Table.Cell>
                    {min_order_amount_display}-{max_order_amount_display} {account_currency}
                </Table.Cell>
                <Table.Cell className='my-ads-table__price'>
                    <div className='display-layout'>
                        {display_effective_rate} {local_currency}
                        {rate_type === ad_type.FLOAT && (
                            <AdType ad_pause_color={ad_pause_color} float_rate={rate_display} />
                        )}
                    </div>
                </Table.Cell>
                <Table.Cell className='my-ads-table__available'>
                    <ProgressIndicator
                        className={'my-ads-table__available-progress'}
                        value={remaining_amount}
                        total={amount}
                    />
                    <div className='my-ads-table__available-value'>
                        {remaining_amount_display}/{amount_display} {account_currency}
                    </div>
                </Table.Cell>
                <Table.Cell>
                    <div className='my-ads-table__payment-method'>
                        {payment_method_names ? (
                            payment_method_names.map((payment_method, key) => {
                                return (
                                    <div className='my-ads-table__payment-method--label' key={key}>
                                        <Text color={ad_pause_color} size='xs' line_height='l'>
                                            {payment_method}
                                        </Text>
                                    </div>
                                );
                            })
                        ) : (
                            <div
                                className={classNames('my-ads-table__add', {
                                    'my-ads-table__add--disabled': !general_store.is_listed,
                                })}
                                onClick={() => onClickAdd()}
                            >
                                <Icon color={icon_disabled_color} icon='IcAdd' />
                                <Text color={ad_pause_color} size='xxs' weight='bold'>
                                    <Localize i18n_default_text='Add' />
                                </Text>
                            </div>
                        )}
                    </div>
                </Table.Cell>
                <Table.Cell>
                    {show_warning_icon ? (
                        <div className='my-ads-table__status-warning'>
                            <AdStatus is_active={!!is_advert_active && !general_store.is_barred} />
                            <Popover alignment='top' message={localize('Ad not listed')}>
                                <Icon
                                    icon='IcAlertWarning'
                                    onClick={onClickTooltipIcon}
                                    data_testid='dt_visibility_alert_icon'
                                />
                            </Popover>
                        </div>
                    ) : (
                        <div className='my-ads-table__status'>
                            <AdStatus is_active={!!is_advert_active && !general_store.is_barred} />
                        </div>
                    )}
                    <Popover alignment='top' message={localize('Manage ad')}>
                        <MyAdsRowDropdown
                            is_advert_active={is_advert_active}
                            is_disabled={general_store.is_barred}
                            onSelectMore={onSelectMore}
                        />
                    </Popover>
                </Table.Cell>
            </Table.Row>
        </div>
    );
});

MyAdsRowRenderer.displayName = 'MyAdsRowRenderer';
MyAdsRowRenderer.propTypes = {
    advert: PropTypes.object,
};

export default MyAdsRowRenderer;

import React from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Icon, Table, Text } from '@deriv/components';
import { isMobile, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useP2PExchangeRate } from '@deriv/hooks';

import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { OnlineStatusAvatar } from 'Components/online-status';
import StarRating from 'Components/star-rating';
import TradeBadge from 'Components/trade-badge';
import { document_status_codes, identity_status_codes } from 'Constants/account-status-codes';
import { buy_sell } from 'Constants/buy-sell';
import BuySellRowAction from 'Pages/buy-sell/buy-sell-row-action';
import { useStores } from 'Stores';
import { generateEffectiveRate } from 'Utils/format-value';

import './buy-sell-row.scss';

const BuySellRow = ({ row: advert }) => {
    const {
        account_currency,
        advertiser_details,
        counterparty_type,
        effective_rate,
        eligibility_status,
        is_eligible,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit_display,
        payment_method_names,
        price_display,
        rate_type,
        rate,
    } = advert;

    const { buy_sell_store, general_store } = useStores();
    const { showModal } = useModalManagerContext();
    const {
        client: { currency },
        ui: { is_desktop },
    } = useStore();
    const history = useHistory();
    const exchange_rate = useP2PExchangeRate(local_currency);

    if (advert.id === 'WATCH_THIS_SPACE') {
        // This allows for the sliding animation on the Buy/Sell toggle as it pushes
        // an empty item with an item that holds the same height of the toggle container.
        // Also see: buy-sell-table.jsx
        return <div style={{ height: '140px' }} />;
    }

    if (advert.id === 'NO_MATCH_ROW') {
        // Empty row when there is a search_term but no search_results
        return (
            <div className='buy-sell-row__no-match'>
                <Text color='prominent' size='xs'>
                    <Localize i18n_default_text='There are no matching ads.' />
                </Text>
            </div>
        );
    }

    const is_my_advert = advert.advertiser_details.id === general_store.advertiser_id;
    const is_buy_advert = counterparty_type === buy_sell.BUY;
    const { name: advertiser_name, rating_average, rating_count } = advert.advertiser_details;
    const rating_average_decimal = rating_average ? Number(rating_average).toFixed(1) : null;
    const { display_effective_rate } = generateEffectiveRate({
        price: price_display,
        rate_type,
        rate,
        local_currency,
        exchange_rate,
        market_rate: effective_rate,
    });
    const is_poi_poa_verified =
        general_store.poi_status === identity_status_codes.VERIFIED &&
        (!general_store.p2p_poa_required ||
            (general_store.poa_status === document_status_codes.VERIFIED && !general_store.poa_authenticated_with_idv));
    const onClickRow = () => {
        if ((general_store.is_advertiser || is_poi_poa_verified) && !general_store.is_barred) {
            buy_sell_store.showAdvertiserPage(advert);
            history.push({ pathname: routes.p2p_advertiser_page, search: `?id=${advert.advertiser_details.id}` });
        } else if (!general_store.is_advertiser) {
            buy_sell_store.setShouldShowVerification(true);
        }
    };

    const onClickBuySell = () => {
        if (general_store.is_advertiser) buy_sell_store.setSelectedAdvert(advert);
        else if (is_poi_poa_verified) {
            showModal({
                key: 'NicknameModal',
                props: {
                    onConfirm: () => buy_sell_store.setSelectedAdvert(advert),
                    should_hide_close_btn: is_desktop,
                },
            });
        } else {
            buy_sell_store.setShouldShowVerification(true);
        }
    };

    if (isMobile()) {
        return (
            <div className='buy-sell-row'>
                <div className='buy-sell-row__advertiser' onClick={() => onClickRow()}>
                    <OnlineStatusAvatar
                        is_online={advertiser_details.is_online}
                        nickname={advertiser_name}
                        size={32}
                        text_size='s'
                    />
                    <div className='buy-sell-row__advertiser-name'>
                        <div className='buy-sell__cell--container__row'>
                            <Text className='buy-sell-row__advertiser-name--text' size='xs' weight='bold'>
                                {advertiser_name}
                            </Text>
                            <TradeBadge trade_count={advertiser_details.completed_orders_count} />
                        </div>
                        <div className='buy-sell-row__rating'>
                            {!!rating_count && !!rating_average ? (
                                <div className='buy-sell-row__rating--row'>
                                    <Text color='less-prominent' size={isMobile() ? 'xxxs' : 'xxs'}>
                                        {rating_average_decimal}
                                    </Text>
                                    <StarRating
                                        empty_star_className='buy-sell-row__rating--star'
                                        empty_star_icon='IcEmptyStar'
                                        full_star_className='buy-sell-row__rating--star'
                                        full_star_icon='IcFullStar'
                                        initial_value={rating_average_decimal}
                                        is_readonly
                                        number_of_stars={5}
                                        should_allow_hover_effect={false}
                                        star_size={14}
                                    />
                                    <Text color='less-prominent' size={isMobile() ? 'xxxs' : 'xxs'}>
                                        ({rating_count})
                                    </Text>
                                </div>
                            ) : (
                                <Text color='less-prominent' size='xxs'>
                                    <Localize i18n_default_text='Not rated yet' />
                                </Text>
                            )}
                        </div>
                    </div>
                    <Icon className='buy-sell-row__advertiser-arrow' icon='IcChevronRightBold' size={16} />
                </div>
                <div className='buy-sell-row__information'>
                    <div className='buy-sell-row__rate'>
                        <Text as='div' size='xxs'>
                            <Localize i18n_default_text='Rate (1 {{currency}})' values={{ currency }} />
                        </Text>
                        <Text as='div' color='profit-success' weight='bold'>
                            {display_effective_rate} {local_currency}
                        </Text>
                        <Text as='div' color='less-prominent' size='xxs'>
                            <Localize
                                i18n_default_text='Limits {{ min_order }}–{{ max_order }} {{ currency }}'
                                values={{
                                    min_order: min_order_amount_limit_display,
                                    max_order: max_order_amount_limit_display,
                                    currency: account_currency,
                                }}
                            />
                        </Text>
                    </div>
                    <div className='buy-sell-row__payment-methods-list'>
                        {payment_method_names ? (
                            payment_method_names.map((payment_method, key) => {
                                return (
                                    <div className='buy-sell-row__payment-method' key={key}>
                                        <Text line_height='l' size='xxxs'>
                                            {payment_method}
                                        </Text>
                                    </div>
                                );
                            })
                        ) : (
                            <div className='buy-sell-row__payment-method'>
                                <Text line_height='l' size='xxxs'>
                                    -
                                </Text>
                            </div>
                        )}
                    </div>
                    {!is_my_advert && (
                        <BuySellRowAction
                            account_currency={account_currency}
                            className='buy-sell-row__button'
                            eligibility_status={eligibility_status}
                            is_buy_advert={is_buy_advert}
                            is_eligible={is_eligible}
                            onClick={onClickBuySell}
                        />
                    )}
                </div>
            </div>
        );
    }

    return (
        <Table.Row className='buy-sell__table-row'>
            <Table.Cell>
                <div
                    className={classNames('buy-sell__cell', { 'buy-sell__cell-hover': !general_store.is_barred })}
                    onClick={() => onClickRow()}
                >
                    <OnlineStatusAvatar
                        is_online={advertiser_details.is_online}
                        nickname={advertiser_name}
                        size={24}
                        text_size='xxs'
                    />
                    <div className='buy-sell__cell--container'>
                        <div className='buy-sell__cell--container__row'>
                            <div
                                className={classNames({
                                    'buy-sell__name': !general_store.is_barred,
                                })}
                            >
                                {advertiser_name}
                            </div>
                            <TradeBadge trade_count={advertiser_details.completed_orders_count} />
                        </div>
                        <div className='buy-sell-row__rating'>
                            {!!rating_count && !!rating_average ? (
                                <div className='buy-sell-row__rating--row'>
                                    <Text color='less-prominent' size={isMobile() ? 'xxxs' : 'xxs'}>
                                        {rating_average_decimal}
                                    </Text>
                                    <StarRating
                                        empty_star_className='buy-sell-row__rating--star'
                                        empty_star_icon='IcEmptyStar'
                                        full_star_className='buy-sell-row__rating--star'
                                        full_star_icon='IcFullStar'
                                        initial_value={rating_average_decimal}
                                        is_readonly
                                        number_of_stars={5}
                                        should_allow_hover_effect={false}
                                        star_size={14}
                                    />
                                    <Text color='less-prominent' size={isMobile() ? 'xxxs' : 'xxs'}>
                                        ({rating_count})
                                    </Text>
                                </div>
                            ) : (
                                <Text color='less-prominent' size={isMobile() ? 'xxxs' : 'xxs'}>
                                    <Localize i18n_default_text='Not rated yet' />
                                </Text>
                            )}
                        </div>
                    </div>
                </div>
            </Table.Cell>
            <Table.Cell>
                {min_order_amount_limit_display}&ndash;{max_order_amount_limit_display} {account_currency}
            </Table.Cell>
            <Table.Cell>
                <Text color='profit-success' size='xs' weight='bold'>
                    {display_effective_rate} {local_currency}
                </Text>
            </Table.Cell>
            <Table.Cell>
                <div className='buy-sell-row__payment-method'>
                    {payment_method_names ? (
                        payment_method_names.map((payment_method, key) => {
                            return (
                                <div className='buy-sell-row__payment-method--label' key={key}>
                                    <Text size='xs' line_height='l'>
                                        {payment_method}
                                    </Text>
                                </div>
                            );
                        })
                    ) : (
                        <div className='buy-sell-row__payment-method--label'>
                            <Text size='xs' line_height='l'>
                                -
                            </Text>
                        </div>
                    )}
                </div>
            </Table.Cell>
            {is_my_advert ? (
                <Table.Cell />
            ) : (
                <Table.Cell className='buy-sell__button'>
                    <BuySellRowAction
                        account_currency={account_currency}
                        eligibility_status={eligibility_status}
                        is_buy_advert={is_buy_advert}
                        is_eligible={is_eligible}
                        onClick={onClickBuySell}
                    />
                </Table.Cell>
            )}
        </Table.Row>
    );
};

BuySellRow.propTypes = {
    advert: PropTypes.object,
    is_buy: PropTypes.bool,
    row: PropTypes.object,
    setSelectedAdvert: PropTypes.func,
    style: PropTypes.object,
};

export default observer(BuySellRow);

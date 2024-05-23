import React from 'react';
import PropTypes from 'prop-types';
import { Table, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useP2PExchangeRate } from '@deriv/hooks';
import { useStores } from 'Stores';
import { buy_sell } from 'Constants/buy-sell';
import { Localize } from 'Components/i18next';
import BuySellRowAction from 'Pages/buy-sell/buy-sell-row-action';
import { generateEffectiveRate } from 'Utils/format-value';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import './advertiser-page-row.scss';

const AdvertiserPageRow = ({ row: advert }) => {
    const { advertiser_page_store, buy_sell_store, general_store } = useStores();
    const {
        counterparty_advertiser_info: { id: counterparty_details_id },
    } = advertiser_page_store;
    const {
        client: { currency },
        ui: { is_desktop },
    } = useStore();
    const {
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

    const { showModal } = useModalManagerContext();

    const is_buy_advert = advertiser_page_store.counterparty_type === buy_sell.BUY;
    const is_my_advert = counterparty_details_id === general_store.advertiser_id;
    const exchange_rate = useP2PExchangeRate(local_currency);

    const { display_effective_rate } = generateEffectiveRate({
        price: price_display,
        rate_type,
        rate,
        local_currency,
        exchange_rate,
        market_rate: effective_rate,
    });

    const showBuySellForm = () => {
        buy_sell_store.setSelectedAdState(advert);
        showModal({
            key: 'BuySellModal',
        });
    };

    const onBuySellButtonClick = () => {
        if (general_store.is_advertiser) {
            showBuySellForm();
        } else {
            showModal({
                key: 'NicknameModal',
                props: {
                    onConfirm: showBuySellForm,
                    should_hide_close_btn: is_desktop,
                },
            });
        }
    };

    if (isMobile()) {
        return (
            <Table.Row className='advertiser-page-adverts__table-row'>
                <Table.Cell className='advertiser-page__cell'>
                    <Text size='xxs'>
                        <Localize
                            i18n_default_text='Rate (1 {{currency}})'
                            values={{
                                currency,
                            }}
                        />
                    </Text>
                    <Text as='div' color='profit-success' weight='bold'>
                        {display_effective_rate} {local_currency}
                    </Text>
                    <div className='advertiser-page__cell-limit'>
                        <Text size='xxs'>
                            <Localize
                                i18n_default_text='Limits {{min_order_amount_limit_display}}-{{max_order_amount_limit_display}} {{currency}}'
                                values={{
                                    min_order_amount_limit_display,
                                    max_order_amount_limit_display,
                                    currency,
                                }}
                            />
                        </Text>
                    </div>
                    <div className='advertiser-page__payment-methods-list'>
                        {payment_method_names
                            ? payment_method_names.map((payment_method, key) => {
                                  return (
                                      <div className='advertiser-page__payment-method' key={key}>
                                          <Text line_height='l' size='xxxs'>
                                              {payment_method}
                                          </Text>
                                      </div>
                                  );
                              })
                            : null}
                    </div>
                </Table.Cell>
                {is_my_advert ? (
                    <Table.Cell />
                ) : (
                    <Table.Cell className='advertiser-page-adverts__button'>
                        <BuySellRowAction
                            account_currency={currency}
                            eligibility_status={eligibility_status}
                            is_buy_advert={is_buy_advert}
                            is_eligible={is_eligible}
                            onClick={onBuySellButtonClick}
                        />
                    </Table.Cell>
                )}
            </Table.Row>
        );
    }

    return (
        <Table.Row className='advertiser-page-adverts__table-row'>
            <Table.Cell>{`${min_order_amount_limit_display}-${max_order_amount_limit_display} ${currency}`}</Table.Cell>
            <Table.Cell>
                <Text color='profit-success' size='xs' weight='bold'>
                    {display_effective_rate} {local_currency}
                </Text>
            </Table.Cell>
            <Table.Cell>
                <div className='advertiser-page__payment-methods-list'>
                    {payment_method_names
                        ? payment_method_names.map((payment_method, key) => {
                              return (
                                  <div className='advertiser-page__payment-method' key={key}>
                                      <Text size='xs' line_height='l'>
                                          {payment_method}
                                      </Text>
                                  </div>
                              );
                          })
                        : null}
                </div>
            </Table.Cell>
            {is_my_advert ? (
                <Table.Cell />
            ) : (
                <Table.Cell className='advertiser-page-adverts__button'>
                    <BuySellRowAction
                        account_currency={currency}
                        eligibility_status={eligibility_status}
                        is_buy_advert={is_buy_advert}
                        is_eligible={is_eligible}
                        onClick={onBuySellButtonClick}
                    />
                </Table.Cell>
            )}
        </Table.Row>
    );
};

AdvertiserPageRow.displayName = 'AdvertiserPageRow';

AdvertiserPageRow.propTypes = {
    advert: PropTypes.object,
    row: PropTypes.object,
};

export default observer(AdvertiserPageRow);

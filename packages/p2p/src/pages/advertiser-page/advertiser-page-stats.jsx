import React from 'react';
import { Money, Table, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './advertiser-page-stats.scss';

const AdvertiserPageStats = () => {
    const { advertiser_page_store, general_store } = useStores();
    const {
        client: { currency },
    } = useStore();
    const { isDesktop } = useDevice();

    const is_my_advert = advertiser_page_store.advertiser_details_id === general_store.advertiser_id;
    // Use general_store.advertiser_info since resubscribing to the same id from advertiser page returns error
    const info = is_my_advert ? general_store.advertiser_info : advertiser_page_store.counterparty_advertiser_info;
    const {
        buy_completion_rate,
        buy_orders_amount,
        buy_orders_count,
        buy_time_avg,
        partner_count,
        release_time_avg,
        sell_completion_rate,
        sell_orders_amount,
        sell_orders_count,
    } = info;

    const avg_buy_time_in_minutes = buy_time_avg > 60 ? Math.round(buy_time_avg / 60) : '< 1';
    const avg_release_time_in_minutes = release_time_avg > 60 ? Math.round(release_time_avg / 60) : '< 1';

    if (!isDesktop) {
        return (
            <React.Fragment>
                <Table className='advertiser-page-stats__wrapper'>
                    <Table.Row className='advertiser-page-stats__row'>
                        <Table.Cell className='advertiser-page-stats__cell'>
                            <Text as='p' color='less-prominent' size='xxxs'>
                                <Localize
                                    i18n_default_text='Buy completion  <0>30d</0>'
                                    components={[
                                        <Text
                                            key={0}
                                            className='advertiser-page__italic'
                                            color='less-prominent'
                                            size='xxxs'
                                        />,
                                    ]}
                                />
                            </Text>
                            <Text as='p' color='prominent' size='xs' weight='bold'>
                                {buy_completion_rate ? `${buy_completion_rate}% (${buy_orders_count})` : '-'}
                            </Text>
                        </Table.Cell>
                        <div className='advertiser-page-stats__cell-separator' />
                        <Table.Cell className='advertiser-page-stats__cell'>
                            <Text as='p' color='less-prominent' size='xxxs'>
                                <Localize
                                    i18n_default_text='Avg. pay time  <0>30d</0>'
                                    components={[
                                        <Text
                                            key={0}
                                            className='advertiser-page__italic'
                                            color='less-prominent'
                                            size='xxxs'
                                        />,
                                    ]}
                                />
                            </Text>
                            <Text align='left' color='prominent' size='xs' weight='bold'>
                                {buy_time_avg
                                    ? localize('{{- avg_buy_time_in_minutes}} min', {
                                          avg_buy_time_in_minutes,
                                      })
                                    : '-'}
                            </Text>
                        </Table.Cell>
                    </Table.Row>
                </Table>
                <Table className='advertiser-page-stats__wrapper'>
                    <Table.Row className='advertiser-page-stats__row'>
                        <Table.Cell className='advertiser-page-stats__cell'>
                            <Text as='p' color='less-prominent' size='xxxs'>
                                <Localize
                                    i18n_default_text='Sell completion  <0>30d</0>'
                                    components={[
                                        <Text
                                            key={0}
                                            className='advertiser-page__italic'
                                            color='less-prominent'
                                            size='xxxs'
                                        />,
                                    ]}
                                />
                            </Text>
                            <Text as='p' color='prominent' size='xs' weight='bold'>
                                {sell_completion_rate ? `${sell_completion_rate}% (${sell_orders_count})` : '-'}
                            </Text>
                        </Table.Cell>
                        <div className='advertiser-page-stats__cell-separator' />
                        <Table.Cell className='advertiser-page-stats__cell'>
                            <Text as='p' color='less-prominent' size='xxxs'>
                                <Localize
                                    i18n_default_text='Avg. release time  <0>30d</0>'
                                    components={[
                                        <Text
                                            key={0}
                                            className='advertiser-page__italic'
                                            color='less-prominent'
                                            size='xxxs'
                                        />,
                                    ]}
                                />
                            </Text>
                            <Text align='left' color='prominent' size='xs' weight='bold'>
                                {release_time_avg
                                    ? localize('{{- avg_release_time_in_minutes}} min', {
                                          avg_release_time_in_minutes,
                                      })
                                    : '-'}
                            </Text>
                        </Table.Cell>
                    </Table.Row>
                </Table>
                <Table className='advertiser-page-stats__wrapper'>
                    <Table.Row className='advertiser-page-stats__row'>
                        <Table.Cell className='advertiser-page-stats__cell'>
                            <Text as='p' color='less-prominent' size='xxxs'>
                                <Localize
                                    i18n_default_text='Trade volume  <0>30d</0>'
                                    components={[
                                        <Text
                                            key={0}
                                            className='advertiser-page__italic'
                                            color='less-prominent'
                                            size='xxxs'
                                        />,
                                    ]}
                                />
                            </Text>
                            <Text as='p' color='prominent' size='xs' weight='bold'>
                                {buy_orders_amount && sell_orders_amount ? (
                                    <Money
                                        amount={Number(buy_orders_amount) + Number(sell_orders_amount)}
                                        currency={currency}
                                        show_currency
                                    />
                                ) : (
                                    '-'
                                )}
                            </Text>
                        </Table.Cell>
                        <div className='advertiser-page-stats__cell-separator' />
                        <Table.Cell className='advertiser-page-stats__cell'>
                            <Text as='p' color='less-prominent' size='xxxs'>
                                <Localize i18n_default_text='Trade partners' />
                            </Text>
                            <Text as='p' color='prominent' size='xs' weight='bold'>
                                {partner_count || '0'}
                            </Text>
                        </Table.Cell>
                    </Table.Row>
                </Table>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Table className='advertiser-page-stats__wrapper'>
                <Table.Row className='advertiser-page-stats__row'>
                    <Table.Cell className='advertiser-page-stats__cell'>
                        <Text as='p' color='less-prominent' size='xs'>
                            <Localize
                                i18n_default_text='Buy completion  <0>30d</0>'
                                components={[
                                    <Text
                                        key={0}
                                        className='advertiser-page__italic'
                                        color='less-prominent'
                                        size='xs'
                                    />,
                                ]}
                            />
                        </Text>
                        <Text as='p' color='prominent' size='m' weight='bold'>
                            {buy_completion_rate ? `${buy_completion_rate}% (${buy_orders_count})` : '-'}
                        </Text>
                    </Table.Cell>
                    <div className='advertiser-page-stats__cell-separator' />
                    <Table.Cell className='advertiser-page-stats__cell'>
                        <Text as='p' color='less-prominent' size='xs'>
                            <Localize
                                i18n_default_text='Sell completion  <0>30d</0>'
                                components={[
                                    <Text
                                        key={0}
                                        className='advertiser-page__italic'
                                        color='less-prominent'
                                        size='xs'
                                    />,
                                ]}
                            />
                        </Text>
                        <Text as='p' color='prominent' size='m' weight='bold'>
                            {sell_completion_rate ? `${sell_completion_rate}% (${sell_orders_count})` : '-'}
                        </Text>
                    </Table.Cell>
                    <div className='advertiser-page-stats__cell-separator' />
                    <Table.Cell className='advertiser-page-stats__cell'>
                        <Text as='p' color='less-prominent' size='xs'>
                            <Localize
                                i18n_default_text='Trade volume  <0>30d</0>'
                                components={[
                                    <Text
                                        key={0}
                                        className='advertiser-page__italic'
                                        color='less-prominent'
                                        size='xs'
                                    />,
                                ]}
                            />
                        </Text>
                        <Text as='p' color='prominent' size='m' weight='bold'>
                            {buy_orders_amount && sell_orders_amount ? (
                                <Money
                                    amount={Number(buy_orders_amount) + Number(sell_orders_amount)}
                                    currency={currency}
                                    show_currency
                                />
                            ) : (
                                '-'
                            )}
                        </Text>
                    </Table.Cell>
                </Table.Row>
            </Table>
            <Table className='advertiser-page-stats__wrapper'>
                <Table.Row className='advertiser-page-stats__row'>
                    <Table.Cell className='advertiser-page-stats__cell'>
                        <Text as='p' color='less-prominent' size='xs'>
                            <Localize
                                i18n_default_text='Avg. pay time  <0>30d</0>'
                                components={[
                                    <Text
                                        key={0}
                                        className='advertiser-page__italic'
                                        color='less-prominent'
                                        size='xs'
                                    />,
                                ]}
                            />
                        </Text>
                        <Text color='prominent' size='m' weight='bold'>
                            {buy_time_avg
                                ? localize('{{- avg_buy_time_in_minutes}} min', {
                                      avg_buy_time_in_minutes,
                                  })
                                : '-'}
                        </Text>
                    </Table.Cell>
                    <div className='advertiser-page-stats__cell-separator' />
                    <Table.Cell className='advertiser-page-stats__cell'>
                        <Text as='p' color='less-prominent' size='xs'>
                            <Localize
                                i18n_default_text='Avg. release time  <0>30d</0>'
                                components={[
                                    <Text
                                        key={0}
                                        className='advertiser-page__italic'
                                        color='less-prominent'
                                        size='xs'
                                    />,
                                ]}
                            />
                        </Text>
                        <Text color='prominent' size='m' weight='bold'>
                            {release_time_avg
                                ? localize('{{- avg_release_time_in_minutes}} min', {
                                      avg_release_time_in_minutes,
                                  })
                                : '-'}
                        </Text>
                    </Table.Cell>
                    <div className='advertiser-page-stats__cell-separator' />
                    <Table.Cell className='advertiser-page-stats__cell'>
                        <Text as='p' color='less-prominent' size='xs'>
                            <Localize i18n_default_text='Trade partners' />
                        </Text>
                        <Text as='p' color='prominent' size='m' weight='bold'>
                            {partner_count || '0'}
                        </Text>
                    </Table.Cell>
                </Table.Row>
            </Table>
        </React.Fragment>
    );
};

export default observer(AdvertiserPageStats);

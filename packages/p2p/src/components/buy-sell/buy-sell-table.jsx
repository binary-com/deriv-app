import React from 'react';
import PropTypes from 'prop-types';
import { InfiniteDataList, Loading, Table } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import Empty from 'Components/empty/empty.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { useStores } from 'Stores';
import BuySellRow from './buy-sell-row.jsx';

const BuySellRowRendererComponent = row_props => {
    const { buy_sell_store } = useStores();

    return (
        <BuySellRow
            {...row_props}
            is_buy={buy_sell_store.is_buy}
            setSelectedAdvert={buy_sell_store.setSelectedAdvert}
            showAdvertiserPage={buy_sell_store.showAdvertiserPage}
        />
    );
};

const BuySellRowRenderer = observer(BuySellRowRendererComponent);

const BuySellTable = ({ onScroll }) => {
    const { buy_sell_store, general_store } = useStores();

    React.useEffect(
        () =>
            reaction(
                () => buy_sell_store.is_buy,
                () => {
                    buy_sell_store.setItems([]);
                    buy_sell_store.setIsLoading(true);
                    buy_sell_store.loadMoreItems({ startIndex: 0 });
                },
                { fireImmediately: true }
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    if (buy_sell_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (buy_sell_store.api_error_message) {
        return <TableError message={buy_sell_store.api_error_message} />;
    }

    if (buy_sell_store.items.length) {
        return (
            <Table className='buy-sell__table'>
                {isDesktop() && (
                    <Table.Header>
                        <Table.Row className='buy-sell__table-header'>
                            <Table.Head>{localize('Advertisers')}</Table.Head>
                            <Table.Head>{localize('Limits')}</Table.Head>
                            <Table.Head>
                                {localize('Rate (1 {{currency}})', { currency: general_store.client.currency })}
                            </Table.Head>
                            <Table.Head />
                        </Table.Row>
                    </Table.Header>
                )}
                <Table.Body className='buy-sell__table-body'>
                    <InfiniteDataList
                        data_list_className='buy-sell__data-list'
                        items={buy_sell_store.rendered_items}
                        rowRenderer={props => <BuySellRowRenderer {...props} />}
                        loadMoreRowsFn={buy_sell_store.loadMoreItems}
                        has_filler
                        has_more_items_to_load={buy_sell_store.has_more_items_to_load}
                        keyMapperFn={item => item.id}
                        onScroll={onScroll}
                    />
                </Table.Body>
            </Table>
        );
    }

    return (
        <Empty
            className='buy-sell__empty'
            has_tabs
            icon='IcCashierNoAds'
            title={<Localize i18n_default_text='There are no ads.' />}
        />
    );
};

BuySellTable.displayName = 'BuySellTable';
BuySellTable.propTypes = {
    onScroll: PropTypes.func,
};

export default observer(BuySellTable);

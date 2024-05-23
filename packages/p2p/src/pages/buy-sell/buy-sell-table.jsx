import React from 'react';
import PropTypes from 'prop-types';
import { InfiniteDataList, Loading, Modal, RadioGroup, Table, Text } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer, useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import TableError from 'Components/section-error';
import { api_error_codes } from 'Constants/api-error-codes';
import { useP2PRenderedAdverts } from 'Hooks';
import { useStores } from 'Stores';
import BuySellRow from './buy-sell-row.jsx';
import NoAds from 'Pages/buy-sell//no-ads';
import './buy-sell-table.scss';

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
    const {
        client: { currency },
    } = useStore();

    React.useEffect(
        () => {
            reaction(
                () => buy_sell_store.is_buy,
                () => buy_sell_store.fetchAdvertiserAdverts(),
                { fireImmediately: true }
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const { error, has_more_items_to_load, isError, isLoading, loadMoreAdverts, rendered_adverts } =
        useP2PRenderedAdverts();

    React.useEffect(() => {
        if (error?.code === api_error_codes.PERMISSION_DENIED) {
            general_store.setIsBlocked(true);
        }
    }, [error?.code]);

    if (isLoading) {
        return <Loading is_fullscreen={false} />;
    }

    if (isError) {
        return <TableError message={error.message} className='section-error__table--center' size='xs' />;
    }

    // Need to cater for the extra element added to the list for mobile i.e. the "WATCH_THIS_SPACE".
    // Otherwise, the "No ads for this currency" message won't be displayed for mobile, when there are no ads for the selected currency.
    const rendered_adverts_count = isDesktop() ? rendered_adverts.length : rendered_adverts.length - 1;

    if (rendered_adverts_count > 0) {
        return (
            <>
                <Table className='buy-sell-table'>
                    <Modal
                        name='sort'
                        className='sort'
                        is_open={buy_sell_store.is_sort_dropdown_open}
                        height='10rem'
                        toggleModal={() => buy_sell_store.setIsSortDropdownOpen(false)}
                        width='80vw'
                    >
                        <RadioGroup
                            name='reason'
                            className='sort-radiogroup'
                            onToggle={buy_sell_store.handleChange}
                            selected={buy_sell_store.selected_value}
                            required
                        >
                            {buy_sell_store.sort_list.map((list_item, key) => {
                                return (
                                    <RadioGroup.Item
                                        key={key}
                                        value={list_item.value}
                                        label={<Text color='prominent'>{list_item.text}</Text>}
                                    />
                                );
                            })}
                        </RadioGroup>
                    </Modal>
                    {isDesktop() && (
                        <Table.Header>
                            <Table.Row className='buy-sell-table__header'>
                                <Table.Head>
                                    <Localize i18n_default_text='Advertisers' />
                                </Table.Head>
                                <Table.Head>
                                    <Localize i18n_default_text='Limits' />
                                </Table.Head>
                                <Table.Head>
                                    <Localize i18n_default_text='Rate (1 {{currency}})' values={{ currency }} />
                                </Table.Head>
                                <Table.Head>
                                    <Localize i18n_default_text='Payment methods' />
                                </Table.Head>
                                <Table.Head />
                                <Table.Head />
                            </Table.Row>
                        </Table.Header>
                    )}
                    <Table.Body className='buy-sell-table__body'>
                        <InfiniteDataList
                            data_list_className='buy-sell__data-list'
                            items={rendered_adverts}
                            rowRenderer={props => <BuySellRowRenderer {...props} />}
                            loadMoreRowsFn={loadMoreAdverts}
                            has_filler
                            has_more_items_to_load={has_more_items_to_load}
                            keyMapperFn={item => item.id}
                            onScroll={onScroll}
                        />
                    </Table.Body>
                </Table>
            </>
        );
    }

    return <NoAds />;
};

BuySellTable.displayName = 'BuySellTable';
BuySellTable.propTypes = {
    onScroll: PropTypes.func,
};

export default observer(BuySellTable);

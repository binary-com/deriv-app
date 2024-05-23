import classNames from 'classnames';
import React from 'react';
import { Button, InfiniteDataList, Loading, Table } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from 'Components/i18next';
import ToggleAds from 'Pages/my-ads/toggle-ads.jsx';
import { useStores } from 'Stores';
import MyAdsRowRenderer from './my-ads-row-renderer.jsx';
import NoAds from 'Pages/buy-sell/no-ads';
import './my-ads-table.scss';

const getHeaders = offered_currency => [
    { text: localize('Ad ID') },
    { text: localize('Limits') },
    { text: localize('Rate (1 {{ offered_currency }})', { offered_currency }) },
    { text: localize('Available amount') },
    { text: localize('Payment methods') },
    { text: localize('Status') },
    { text: '' }, // empty header for delete and archive icons
];

const MyAdsTable = ({ country_list, table_ref }) => {
    const { general_store, my_ads_store } = useStores();
    const {
        client: { currency },
    } = useStore();

    React.useEffect(() => {
        my_ads_store.setAdverts([]);
        my_ads_store.setSelectedAdId('');
        my_ads_store.loadMoreAds({ startIndex: 0 }, true);

        return () => {
            my_ads_store.setApiErrorCode(null);
            my_ads_store.setTableHeight(0);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_ads_store.is_table_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (my_ads_store.adverts.length) {
        return (
            <React.Fragment>
                <div className='my-ads__header'>
                    {isDesktop() && (
                        <Button
                            is_disabled={general_store.is_barred}
                            large
                            onClick={my_ads_store.onClickCreate}
                            primary
                        >
                            {localize('Create new ad')}
                        </Button>
                    )}
                    <ToggleAds />
                </div>
                <Table
                    className={classNames('my-ads-table', {
                        'my-ads-table--disabled': !general_store.is_listed || general_store.is_barred,
                    })}
                >
                    {isDesktop() && (
                        <Table.Header>
                            <Table.Row className='my-ads-table__row'>
                                {getHeaders(currency).map(header => (
                                    <Table.Head key={header.text}>{header.text}</Table.Head>
                                ))}
                            </Table.Row>
                        </Table.Header>
                    )}
                    <Table.Body className='my-ads-table__body'>
                        <InfiniteDataList
                            data_list_className='my-ads__data-list'
                            has_more_items_to_load={my_ads_store.has_more_items_to_load}
                            items={my_ads_store.adverts}
                            keyMapperFn={item => item.id}
                            loadMoreRowsFn={my_ads_store.loadMoreAds}
                            rowRenderer={row_props => (
                                <MyAdsRowRenderer {...row_props} country_list={country_list} table_ref={table_ref} />
                            )}
                        />
                    </Table.Body>
                </Table>
                {isMobile() && (
                    <div className='my-ads__create-container'>
                        <Button
                            className='my-ads__create'
                            is_disabled={general_store.is_barred}
                            large
                            onClick={my_ads_store.onClickCreate}
                            primary
                        >
                            {localize('Create new ad')}
                        </Button>
                    </div>
                )}
            </React.Fragment>
        );
    }

    return <NoAds is_ads_page />;
};

export default observer(MyAdsTable);

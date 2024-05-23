import React from 'react';
import classNames from 'classnames';
import { InfiniteDataList, Loading, Table, Tabs, Text } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useP2PAdvertiserAdverts } from 'Hooks';
import { useStores } from 'Stores';
import P2pEmpty from 'Components/p2p-empty';
import AdvertiserPageRow from './advertiser-page-row.jsx';
import './advertiser-page-adverts.scss';

const EmptyAdsMessage = () => (
    <Text weight='bold'>
        <Localize i18n_default_text='There are no ads yet' />
    </Text>
);

const AdvertiserPageAdverts = () => {
    const {
        client: { currency },
    } = useStore();

    const { advertiser_page_store } = useStores();
    const { adverts, has_more_adverts_to_load, isLoading, loadMoreAdvertiserAdverts } = useP2PAdvertiserAdverts();

    const AdvertiserPageRowRenderer = row_props => (
        <AdvertiserPageRow {...row_props} showAdPopup={advertiser_page_store.showAdPopup} />
    );

    return (
        <div className='advertiser-page-adverts'>
            <Tabs
                active_index={advertiser_page_store.active_index}
                className='advertiser-page-adverts__tabs'
                is_full_width={isMobile()}
                onTabItemClick={advertiser_page_store.handleTabItemClick}
                header_fit_content
                top
            >
                <div label={localize('Buy')} />
                <div label={localize('Sell')} />
            </Tabs>
            {isLoading ? (
                <div className='advertiser-page-adverts__table'>
                    <Loading is_fullscreen={false} />
                </div>
            ) : (
                <React.Fragment>
                    {adverts.length ? (
                        <Table className='advertiser-page-adverts__table'>
                            {isDesktop() && (
                                <Table.Header>
                                    <Table.Row className='advertiser-page-adverts__table-row'>
                                        <Table.Head>{localize('Limits')}</Table.Head>
                                        <Table.Head>
                                            {localize('Rate (1 {{currency}})', {
                                                currency,
                                            })}
                                        </Table.Head>
                                        <Table.Head>
                                            <Localize i18n_default_text='Payment methods' />
                                        </Table.Head>
                                        <Table.Head>{''}</Table.Head>
                                        <Table.Head />
                                    </Table.Row>
                                </Table.Header>
                            )}
                            <Table.Body className='advertiser-page-adverts__table-body'>
                                <InfiniteDataList
                                    data_list_className='advertiser-page__data-list'
                                    items={adverts}
                                    keyMapperFn={item => item.id}
                                    rowRenderer={AdvertiserPageRowRenderer}
                                    loadMoreRowsFn={loadMoreAdvertiserAdverts}
                                    has_more_items_to_load={has_more_adverts_to_load}
                                />
                            </Table.Body>
                        </Table>
                    ) : (
                        <P2pEmpty
                            className={classNames('', { 'advertiser-page-empty': isMobile() })}
                            icon='IcNoData'
                            title={<EmptyAdsMessage />}
                        />
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default observer(AdvertiserPageAdverts);

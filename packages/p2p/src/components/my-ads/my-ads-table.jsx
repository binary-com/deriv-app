import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, InfiniteDataList, Loading, Table, ProgressIndicator } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import Empty from 'Components/empty/empty.jsx';
import ToggleAds from 'Components/my-ads/toggle-ads.jsx';
import Popup from 'Components/orders/popup.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { requestWS } from 'Utils/websocket';
import { useStores } from 'Stores';

const getHeaders = offered_currency => [
    { text: localize('Ad ID') },
    { text: localize('Limits') },
    { text: localize('Rate (1 {{ offered_currency }})', { offered_currency }) },
    { text: localize('Available amount') },
    { text: '' }, // empty header for delete icon
];

const type = {
    buy: <Localize i18n_default_text='Buy' />,
    sell: <Localize i18n_default_text='Sell' />,
};

const RowComponent = React.memo(({ row: advert, onClickDelete }) => {
    const {
        account_currency,
        amount,
        amount_display,
        local_currency,
        max_order_amount_display,
        min_order_amount_display,
        price_display,
        remaining_amount,
        remaining_amount_display,
    } = advert;

    return (
        <Table.Row className='p2p-my-ads__table-row'>
            <Table.Cell>
                {type[advert.type]} {advert.id}
            </Table.Cell>
            <Table.Cell>
                {min_order_amount_display}-{max_order_amount_display} {account_currency}
            </Table.Cell>
            <Table.Cell className='p2p-my-ads__table-price'>
                {price_display} {local_currency}
            </Table.Cell>
            <Table.Cell className='p2p-my-ads__table-available'>
                <ProgressIndicator
                    className={'p2p-my-ads__table-available-progress'}
                    value={remaining_amount}
                    total={amount}
                />
                <div className='p2p-my-ads__table-available-value'>
                    {remaining_amount_display}/{amount_display} {account_currency}
                </div>
            </Table.Cell>
            <Table.Cell className='p2p-my-ads__table-delete'>
                <Icon icon='IcDelete' size={16} onClick={() => onClickDelete(advert.id)} />
            </Table.Cell>
        </Table.Row>
    );
});

RowComponent.propTypes = {
    advert: PropTypes.object,
    style: PropTypes.object,
};
RowComponent.displayName = 'RowComponent';

const MyAdsTable = observer(({ onClickCreate }) => {
    const { general_store } = useStores();
    const item_offset = React.useRef(0);
    const [adverts, setAdverts] = React.useState([]);
    const [api_error_message, setApiErrorMessage] = React.useState('');
    const [has_more_items_to_load, setHasMoreItemsToLoad] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(false);
    const [selected_ad_id, setSelectedAdId] = React.useState('');
    const [should_show_popup, setShouldShowPopup] = React.useState(false);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (isMounted()) {
            setIsLoading(true);
            loadMoreAds(item_offset.current);
        }
    }, []);

    const loadMoreAds = start_idx => {
        const { list_item_limit } = general_store;

        requestWS({
            p2p_advertiser_adverts: 1,
            offset: start_idx,
            limit: list_item_limit,
        }).then(response => {
            if (isMounted()) {
                if (!response.error) {
                    const { list } = response.p2p_advertiser_adverts;
                    setHasMoreItemsToLoad(list.length >= list_item_limit);
                    setAdverts(adverts.concat(list));
                    item_offset.current += list.length;
                } else {
                    setApiErrorMessage(response.error.message);
                }
                setIsLoading(false);
            }
        });
    };

    const onClickDelete = id => {
        setSelectedAdId(id);
        setShouldShowPopup(true);
    };

    const onClickCancel = () => {
        setSelectedAdId('');
        setShouldShowPopup(false);
    };

    const onClickConfirm = showError => {
        requestWS({ p2p_advert_update: 1, id: selected_ad_id, delete: 1 }).then(response => {
            if (isMounted()) {
                if (response.error) {
                    showError({ error_message: response.error.message });
                } else {
                    // remove the deleted ad from the list of items
                    const updated_items = adverts.filter(ad => ad.id !== response.p2p_advert_update.id);
                    setAdverts(updated_items);
                    setShouldShowPopup(false);
                }
            }
        });
    };

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (api_error_message) {
        return <TableError message={api_error_message} />;
    }

    const MyAdsRowRenderer = row_props => <RowComponent {...row_props} onClickDelete={onClickDelete} />;

    if (adverts.length) {
        return (
            <React.Fragment>
                <div className='p2p-my-ads__header'>
                    <Button large primary onClick={onClickCreate}>
                        {localize('Create new ad')}
                    </Button>
                    <ToggleAds />
                </div>
                <Table
                    className={classNames('p2p-my-ads__table', {
                        'p2p-my-ads__table--disabled': !general_store.is_listed,
                    })}
                >
                    <Table.Header>
                        <Table.Row className='p2p-my-ads__table-row'>
                            {getHeaders(general_store.client.currency).map(header => (
                                <Table.Head key={header.text}>{header.text}</Table.Head>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body className='p2p-my-ads__table-body'>
                        <InfiniteDataList
                            data_list_className='p2p-my-ads__data-list'
                            items={adverts}
                            rowRenderer={MyAdsRowRenderer}
                            has_more_items_to_load={has_more_items_to_load}
                            loadMoreRowsFn={loadMoreAds}
                            keyMapperFn={item => item.id}
                        />
                    </Table.Body>
                </Table>
                <Popup
                    cancel_text={localize('Cancel')}
                    confirm_text={localize('Delete')}
                    has_cancel
                    message={localize('You will NOT be able to restore it.')}
                    onCancel={onClickCancel}
                    onClickConfirm={onClickConfirm}
                    setShouldShowPopup={setShouldShowPopup}
                    should_show_popup={should_show_popup}
                    title={localize('Do you want to delete this ad?')}
                />
            </React.Fragment>
        );
    }

    return (
        <Empty icon='IcCashierNoAds' title={localize('You have no adverts')}>
            <Button primary large className='p2p-empty__button' onClick={() => onClickCreate()}>
                {localize('Create new ad')}
            </Button>
        </Empty>
    );
});

MyAdsTable.propTypes = {
    onClickCreate: PropTypes.func,
};

export default MyAdsTable;
